// 네이버쇼핑 검색 API로 실시간 상품 목록(이름/브랜드/가격/이미지/링크)을 가져온다.
// 무료 발급: https://developers.naver.com/apps/#/register 에서 "검색" API 사용 설정
//
// 사용법:
//   1) .env.local 파일에 아래 두 값을 채운다 (.env.local.example 참고)
//        NAVER_CLIENT_ID=...
//        NAVER_CLIENT_SECRET=...
//   2) npm run fetch:naver -- "무선청소기" 50
//
// 결과는 data/naver-products-raw.json 에 저장된다. 이 API는 스펙(흡입력/배터리)과
// 평점/리뷰수는 제공하지 않으므로, 그 부분은 이후 다나와/브랜드 공식몰에서 보강해야 한다.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "NAVER_CLIENT_ID / NAVER_CLIENT_SECRET이 없습니다.\n" +
      ".env.local 파일을 만들고 (.env.local.example 참고) 네이버 개발자센터에서 발급받은 키를 채워주세요.\n" +
      "발급: https://developers.naver.com/apps/#/register (검색 API 선택)"
  );
  process.exit(1);
}

const query = process.argv[2] ?? "무선청소기";
const targetCount = Number(process.argv[3] ?? 50);

function stripTags(html) {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
}

async function fetchPage(start) {
  const url = new URL("https://openapi.naver.com/v1/search/shop.json");
  url.searchParams.set("query", query);
  url.searchParams.set("display", "100");
  url.searchParams.set("start", String(start));
  url.searchParams.set("sort", "sim");

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": CLIENT_ID,
      "X-Naver-Client-Secret": CLIENT_SECRET,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`네이버 API 오류 ${res.status}: ${body}`);
  }

  return res.json();
}

async function main() {
  console.log(`"${query}" 검색 중 (목표 ${targetCount}개)...`);

  const seen = new Map();
  let start = 1;

  while (seen.size < targetCount && start <= 1000) {
    const data = await fetchPage(start);
    if (!data.items || data.items.length === 0) break;

    for (const item of data.items) {
      if (!seen.has(item.productId)) {
        seen.set(item.productId, {
          productId: item.productId,
          name: stripTags(item.title),
          brand: item.brand || item.maker || "",
          price: Number(item.lprice) || 0,
          mallName: item.mallName,
          imageUrl: item.image,
          link: item.link,
          category: [item.category1, item.category2, item.category3, item.category4].filter(Boolean).join(" > "),
        });
      }
    }

    start += 100;
  }

  const products = Array.from(seen.values()).slice(0, targetCount);

  const outDir = path.join(ROOT, "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "naver-products-raw.json");
  fs.writeFileSync(outPath, JSON.stringify(products, null, 2), "utf-8");

  console.log(`${products.length}개 저장 완료 -> ${path.relative(ROOT, outPath)}`);
  console.log("\n미리보기 (상위 10개):");
  for (const p of products.slice(0, 10)) {
    console.log(`- [${p.brand || "브랜드미상"}] ${p.name} — ${p.price.toLocaleString("ko-KR")}원 (${p.mallName})`);
  }
  console.log(
    "\n주의: 이 API는 스펙(흡입력/배터리 등)과 평점/리뷰수를 제공하지 않습니다.\n" +
      "이 목록에서 실제로 카탈로그에 넣을 30~50개를 추리고, data/products-template.csv 형식에 맞춰 나머지 항목을 채워주세요."
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
