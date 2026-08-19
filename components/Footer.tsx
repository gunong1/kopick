export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="container-page grid gap-8 py-10 text-sm text-gray-500 sm:grid-cols-2">
        <div>
          <p className="text-base font-extrabold text-brand-600">KOPICK</p>
          <p className="mt-2 max-w-sm leading-relaxed">
            가장 싼 상품이 아니라, 가장 합리적인 상품을 찾게 해줍니다. KOPICK Score는 성능·가성비·리뷰 만족도·배터리·AS를
            종합해 계산됩니다.
          </p>
        </div>
        <div className="sm:text-right">
          <p className="leading-relaxed">
            이 화면은 MVP 프로토타입이며 모든 상품·가격·리뷰 데이터는 목업(mock) 데이터입니다.
            <br />
            실제 쿠팡/네이버쇼핑 연동 및 구매는 이후 단계에서 지원될 예정입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
