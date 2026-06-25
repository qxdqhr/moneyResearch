# moneyResearch

副业 / 平台自动化相关调研与 Demo 代码。

## 目录

| 路径 | 说明 |
|------|------|
| [xianyu/](./xianyu/) | 闲鱼平台 API 调研、自动化可行性分析 |
| [xianyu/demo/](./xianyu/demo/) | Cookie 登录、签名、文案、发品、发货配置 Demo + Next.js 测试台 |

## 快速开始（闲鱼 Demo）

```bash
cd xianyu/demo
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# 将浏览器 Cookie 写入 data/cookies.json 后
python scripts/01_cookie_login.py --refresh --save
python scripts/04_publish_item.py --name "测试" --price 0.01 --dry-run

cd web && npm install && npm run dev
```

> 仅供技术调研自用，请勿提交真实 Cookie 或账号凭证。
