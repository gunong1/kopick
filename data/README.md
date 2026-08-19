# 실제 상품 데이터 수집 템플릿

## 0단계: 네이버쇼핑 API로 실제 상품 목록/가격 자동으로 가져오기 (추천)

1. https://developers.naver.com/apps/#/register 에서 애플리케이션 등록 (무료, "검색" API 사용 설정)
2. 발급받은 Client ID/Secret을 프로젝트 루트에 `.env.local` 파일로 저장 (`.env.local.example` 참고)
3. 실행:
   ```bash
   npm run fetch:naver -- "무선청소기" 50
   ```
4. `data/naver-products-raw.json`에 실시간 상품명/브랜드/가격/이미지/판매링크가 저장됨
5. 이 중 실제로 카탈로그에 넣을 30~50개를 골라서, 아래 CSV 템플릿에 옮기고 스펙/리뷰/AS 정보를 보강

이 API는 흡입력·배터리 같은 스펙과 평점/리뷰수는 주지 않기 때문에, 그 부분만 다나와나 브랜드 공식몰에서
수동으로 채우면 됩니다. 가격/상품 목록을 손으로 검색하는 것보다 훨씬 빠르고 최신 데이터를 유지할 수 있습니다.

## 1단계: CSV에 나머지 정보 채우기

`products-template.csv`를 엑셀/구글시트로 열어서 채우세요. 앞 3개 행(`example-`로 시작하는 id)은 **형식 예시**이며,
지금 프로토타입 mock 데이터를 그대로 옮겨둔 것이라 실제 검증된 값이 아닙니다. 실제 리서치 값으로 덮어쓰거나
삭제하고 새 행을 추가하세요.

## 컬럼 설명

| 컬럼 | 설명 | 어디서 구하나 |
|---|---|---|
| id | 영문 소문자+하이픈 고유 id (예: `dyson-v15-detect`) | 직접 작성 |
| name / brand | 상품명 / 브랜드 | 네이버쇼핑, 쿠팡 |
| price | 기준 가격(원, 숫자만) | 네이버쇼핑 최저가 기준 권장 |
| releaseYear | 출시연도 | 브랜드 공식몰 |
| imageUrl | 상품 이미지 URL | `naver-products-raw.json`의 `imageUrl` 값 그대로 사용(추천). 없으면 브랜드 이니셜 그라디언트로 자동 대체 표시됨 |
| suctionPowerAW | 흡입력(AW) | 다나와 스펙 비교, 브랜드 공식몰 |
| batteryMinutes | 최대 사용시간(분) | 다나와 스펙 비교 |
| chargeHours | 완충 시간(시간) | 다나와 스펙 비교 |
| weightKg | 무게(kg) | 다나와 스펙 비교 |
| dustCapacityL | 먼지통 용량(L) | 다나와 스펙 비교 |
| avgRating | 평균 평점(5점 만점) | 쿠팡/네이버 상품 페이지 |
| reviewCount | 리뷰 수 | 쿠팡/네이버 상품 페이지 |
| warrantyMonths | 무상보증 기간(개월) | 브랜드 고객센터 |
| serviceCenterCount | 서비스센터 수 | 브랜드 고객센터(전국 서비스센터 찾기 페이지) |
| asGrade | S/A/B/C 중 하나 (보증기간·센터수 기준 직접 판단) | 위 두 항목 종합 판단 |
| positiveKeywords / negativeKeywords | 세미콜론(;)으로 구분한 키워드 목록 | 리뷰 상위 20~30개 직접 읽고 요약 |
| summaryText | 한 문장 리뷰 요약 | 위와 동일. 원문 그대로 복사하지 말고 직접 요약(저작권) |
| coupangUrl / naverUrl | 실제 구매 링크 | 쿠팡파트너스 딥링크, 네이버쇼핑 상품 링크 |

## 다음 단계

10개 이상 채워지면 파일을 다시 보내주세요 — 이 CSV를 읽어서 `lib/mock/products.ts` 형식으로 자동 변환하는
스크립트를 만들어 실제 데이터로 교체해드리겠습니다.
