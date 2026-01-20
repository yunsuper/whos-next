import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "WHO'S NEXT? | 럭키 제비뽑기 머신",
    description:
        "클릭 한 번으로 결정되는 운명! 세련된 물리 엔진 기반 제비뽑기 추첨기입니다.",
    icons: {
        icon: "/icon", 
        apple: "/apple-icon", 
    },
    openGraph: {
        title: "WHO'S NEXT? | 제비뽑기 추첨기",
        description: "공정한 랜덤 추첨, 지금 바로 돌려보세요!",
        type: "website",
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
