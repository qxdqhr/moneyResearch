# 闲鱼自动化 Demo

5 个 Python 脚本 + Next.js 测试面板。

## 目录

```
demo/
├── lib/                 # 共享库（签名、Cookie、Mtop 客户端）
├── scripts/
│   ├── 01_cookie_login.py
│   ├── 02_sign.py
│   ├── 03_copywriting.py
│   ├── 04_publish_item.py
│   └── 05_shipping.py
├── data/cookies.json    # 登录 Cookie（自行填写）
├── assets/sample.jpg    # 测试图片
└── web/                 # Next.js 测试项目
```

## Python 环境

```bash
cd demo
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Cookie 配置

1. 浏览器登录 https://www.goofish.com
2. 开发者工具 → Application → Cookies，复制关键字段到 `data/cookies.json`
3. 至少需要：`cookie2`、`unb`、`_m_h5_tk`（可先留空，脚本会刷新）

## 脚本用法

```bash
# 1. 登录检测 + 刷新 token
python scripts/01_cookie_login.py --refresh --save

# 2. 签名演示
python scripts/02_sign.py --token YOUR_TOKEN --data '{}'

# 3. 文案生成
python scripts/03_copywriting.py --name "男士毛呢大衣" --price 299 --condition "95新"

# 4. 上架（建议先 dry-run）
python scripts/04_publish_item.py --name "测试商品" --price 0.01 --dry-run
python scripts/04_publish_item.py --name "测试商品" --price 0.01 --save-cookie

# 5. 发货配置
python scripts/05_shipping.py --mode 包邮 --price 99
```

## Next.js 测试

```bash
cd web
npm install
npm run dev
```

访问 http://localhost:3000

> ⚠️ 仅供调研自用，真实发品请使用测试账号。
