# moneyResearch

副业 / 平台自动化调研与 Demo。

## 目录

| 路径 | 说明 |
|------|------|
| [xianyu/](./xianyu/) | 闲鱼 API 调研文档 |
| [baidu-pan/](./baidu-pan/) | 百度网盘转存调研文档 |
| [quark-pan/](./quark-pan/) | 夸克网盘转存调研文档 |
| **[demo/](./demo/)** | **统一 Demo（闲鱼 + 百度/夸克网盘脚本 + Next.js 测试台）** |

## 快速开始

```bash
cd demo
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

cd web && npm install && npm run dev
```

访问 http://localhost:3000，切换「闲鱼 / 百度网盘 / 夸克网盘」标签页测试。

## 原则

- **调研文档** → 各主题目录（`xianyu/`、`baidu-pan/`、`quark-pan/`）
- **可运行 Demo** → 统一放在根目录 `demo/` 下
