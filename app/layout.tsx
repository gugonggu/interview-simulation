import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GPT도 면접은 처음이라",
  description: "인공지능을 활용한 면접 연습 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased max-w-screen-sm mx-auto bg-background h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
