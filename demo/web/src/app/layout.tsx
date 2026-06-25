import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "moneyResearch Demo 测试台",
  description: "闲鱼与百度网盘自动化脚本联调",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
