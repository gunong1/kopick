# KOPICK MVP 프로토타입

"가장 싼 상품이 아니라, 가장 합리적인 상품을 찾게 해준다" — KOPICK의 무선청소기 카테고리 MVP 프로토타입입니다.
실제 쿠팡/네이버 API 연동 없이, 30개의 mock 상품 데이터로 검색 → 랭킹 → 필터 → 상세 → 비교 흐름이 실제로 동작합니다.

설계 근거는 `docs/kopick-product-design.md`를 참고하세요.

## 실행 방법

1. Node.js 20 이상 설치 확인 (`node -v`)
2. 의존성 설치
   ```bash
   npm install
   ```
3. 개발 서버 실행
   ```bash
   npm run dev
   ```
4. 브라우저에서 http://localhost:3000 접속

프로덕션 빌드로 확인하려면:

```bash
npm run build
npm run start
```

## 주요 페이지

- `/` — 홈 (검색, 카테고리, 이번 주 추천, 종합 TOP3)
- `/category/wireless-vacuum` — 무선청소기 상품 리스트 (랭킹 탭 + 필터)
- `/product/[id]` — 상품 상세 (KOPICK Score, 레이더 차트, 스펙, 리뷰 요약, 대안 상품)
- `/compare` — 비교함에 담은 상품 비교 테이블
- `/search?q=...` — 검색 결과

## 코드 구조

```
app/                    # Next.js App Router 페이지
components/             # UI 컴포넌트
lib/
  types.ts              # 상품/카테고리 데이터 타입 (Supabase 스키마를 염두에 둔 구조)
  scoring.ts            # KOPICK Score 계산 엔진 (정규화 + 가중치 프리셋)
  filters.ts            # 리스트 필터 상태/로직
  compare-store.tsx     # 비교함 전역 상태 (localStorage 동기화)
  data.ts               # 데이터 접근 레이어 (지금은 mock, 추후 Supabase 쿼리로 교체)
  mock/                 # 무선청소기 30개 mock 상품 데이터
```

## 참고

- 모든 상품·가격·리뷰 데이터는 mock입니다. 실제 쿠팡/네이버쇼핑 연동, 로그인, AI 챗봇은 이 단계에 포함되지 않습니다.
- "구매하러 가기" 버튼은 실제 이동 대신 프로토타입 안내 토스트를 보여줍니다.
- `lib/data.ts`의 함수 시그니처는 이후 Supabase 쿼리로 그대로 교체할 수 있도록 설계했습니다.
