import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center gap-3 py-24 text-center">
      <p className="text-3xl font-extrabold text-gray-900">404</p>
      <p className="text-sm text-gray-500">페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="btn-primary mt-2">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
