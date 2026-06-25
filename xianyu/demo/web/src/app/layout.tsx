import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "闲鱼 Demo 测试台",
  description: "Cookie 登录、签名、文案、发品、发货配置联调",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
