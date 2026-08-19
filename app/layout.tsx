import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "KOPICK — 가장 합리적인 상품을 찾다",
  description: "최저가가 아니라 가장 합리적인 상품을 찾아주는 쇼핑 상품 비교·랭킹 서비스, KOPICK MVP 프로토타입.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-[#f7f8fb] antialiased">
        <Header />
        <main className="pb-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
