import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finders Admin",
  description: "Finders 관리자 페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
