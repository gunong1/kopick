import Link from "next/link";
import { CompareIndicatorLink } from "./CompareIndicatorLink";
import { SearchBar } from "./SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="shrink-0 text-xl font-extrabold tracking-tight text-brand-600">
          KOPICK
        </Link>
        <div className="hidden flex-1 md:block">
          <SearchBar />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <CompareIndicatorLink />
        </div>
      </div>
      <div className="container-page pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
