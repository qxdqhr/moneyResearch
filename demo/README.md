# moneyResearch Demo

统一测试目录：闲鱼 + 百度网盘 + 夸克网盘自动化脚本，以及 Next.js 联调面板。

## 目录结构

```
demo/
├── requirements.txt       # 共享 Python 依赖
├── xianyu/                # 闲鱼脚本
│   ├── lib/
│   ├── scripts/           # 01~05
│   └── data/cookies.json
├── baidu-pan/             # 百度网盘脚本
│   ├── lib/
│   ├── scripts/           # 01~06
│   └── data/cookies.json
├── quark-pan/             # 夸克网盘脚本
│   ├── lib/
│   ├── scripts/           # 01~06
│   └── data/cookies.json
└── web/                   # Next.js 测试台
```

## 环境准备

```bash
cd demo
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cd web && npm install && npm run dev
# http://localhost:3000
```

## Cookie 配置

| 主题 | 文件 | 关键字段 |
|------|------|----------|
| 闲鱼 | `xianyu/data/cookies.json` | cookie2, unb, _m_h5_tk |
| 百度网盘 | `baidu-pan/data/cookies.json` | BDUSS, STOKEN |
| 夸克网盘 | `quark-pan/data/cookies.json` | __puus, __pus |

## 命令行测试

**闲鱼：**
```bash
python xianyu/scripts/01_cookie_login.py --refresh --save
python xianyu/scripts/04_publish_item.py --name "测试" --price 0.01 --dry-run
```

**百度网盘：**
```bash
python baidu-pan/scripts/01_cookie_login.py --save
python baidu-pan/scripts/06_pipeline.py --url "https://pan.baidu.com/s/1xxx?pwd=abcd" --pwd abcd
```

**夸克网盘：**
```bash
python quark-pan/scripts/01_cookie_login.py --save
python quark-pan/scripts/02_parse_share_link.py --url "https://pan.quark.cn/s/xxxxx?pwd=abcd"
python quark-pan/scripts/06_pipeline.py --url "https://pan.quark.cn/s/xxxxx?pwd=abcd" --pwd abcd
```

> ⚠️ 仅供调研自用，请勿提交真实 Cookie。
