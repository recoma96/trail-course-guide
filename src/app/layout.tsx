import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Orbit } from 'next/font/google';

const baseFont = Orbit({
  subsets: ['latin'],
  weight: ['400']
})


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '트레킹 코스 가이드 페이지',
  description: '트레킹 코스 가이드를 생성해서 PDF/JPG/PNG 까지 프린팅 할 수 있는 사이트',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${baseFont.className} ${geistSans.variable} ${geistMono.variable} bg-gray-200 antialiased`}
      >
        <main className="w-full lg:max-w-mobile lg:mx-auto bg-gray-100 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
