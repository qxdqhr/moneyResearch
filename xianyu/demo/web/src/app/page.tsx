"use client";

import { useState } from "react";

type ApiResult = {
  ok?: boolean;
  code?: number;
  stdout?: string;
  stderr?: string;
  data?: Record<string, unknown>;
  error?: string;
};

async function callApi(path: string, body: Record<string, unknown>): Promise<ApiResult> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export default function HomePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);

  const [cookie, setCookie] = useState("");
  const [token, setToken] = useState("");
  const [signData, setSignData] = useState("{}");
  const [productName, setProductName] = useState("男士羊毛大衣 驼色长款");
  const [condition, setCondition] = useState("95新");
  const [price, setPrice] = useState("199");
  const [originalPrice, setOriginalPrice] = useState("599");
  const [publishTitle, setPublishTitle] = useState("");
  const [publishDesc, setPublishDesc] = useState("");
  const [shippingMode, setShippingMode] = useState("包邮");
  const [postPrice, setPostPrice] = useState("12");
  const [dryRun, setDryRun] = useState(true);

  async function run(action: string, fn: () => Promise<ApiResult>) {
    setLoading(action);
    try {
      const data = await fn();
      setResult(data);
    } catch (error) {
      setResult({ ok: false, error: String(error) });
    } finally {
      setLoading(null);
    }
  }

  return (
    <main>
      <h1>闲鱼自动化 Demo 测试台</h1>
      <p className="subtitle">
        调用 <code>demo/scripts</code> 下 5 个 Python 脚本。发品默认 dry-run，不会真正上架。
      </p>

      <div className="grid">
        <section className="card">
          <h2>
            01 Cookie 登录 <span className="badge">01_cookie_login.py</span>
          </h2>
          <label>Cookie 字符串（可选，留空则读 data/cookies.json）</label>
          <textarea
            value={cookie}
            onChange={(e) => setCookie(e.target.value)}
            placeholder="cookie2=...; unb=...; _m_h5_tk=..."
          />
          <div className="row">
            <button
              disabled={loading !== null}
              onClick={() =>
                run("cookie", () =>
                  callApi("/api/cookie-login", {
                    cookie: cookie || undefined,
                    refresh: true,
                    save: true,
                  }),
                )
              }
            >
              检测并刷新 Token
            </button>
          </div>
          <p className="hint">需要真实闲鱼 Cookie。首次请把浏览器 Cookie 写入 demo/data/cookies.json。</p>
        </section>

        <section className="card">
          <h2>
            02 签名 <span className="badge">02_sign.py</span>
          </h2>
          <label>Token（_m_h5_tk 前半段）</label>
          <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="demo_token" />
          <label>data JSON</label>
          <textarea value={signData} onChange={(e) => setSignData(e.target.value)} />
          <div className="row">
            <button
              disabled={loading !== null}
              onClick={() =>
                run("sign", () =>
                  callApi("/api/sign", {
                    token: token || undefined,
                    data: signData,
                  }),
                )
              }
            >
              生成签名
            </button>
          </div>
        </section>

        <section className="card">
          <h2>
            03 商品文案 <span className="badge">03_copywriting.py</span>
          </h2>
          <label>商品名称</label>
          <input value={productName} onChange={(e) => setProductName(e.target.value)} />
          <label>成色</label>
          <input value={condition} onChange={(e) => setCondition(e.target.value)} />
          <div className="row">
            <div style={{ flex: 1 }}>
              <label>售价</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label>原价</label>
              <input value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
            </div>
          </div>
          <div className="row">
            <button
              disabled={loading !== null}
              onClick={() =>
                run("copy", () =>
                  callApi("/api/copywriting", {
                    name: productName,
                    condition,
                    price: Number(price),
                    originalPrice: Number(originalPrice),
                  }),
                )
              }
            >
              生成文案
            </button>
            <button
              className="secondary"
              disabled={loading !== null}
              onClick={() => {
                const data = result?.data as { title?: string; description?: string } | undefined;
                if (data?.title) setPublishTitle(data.title);
                if (data?.description) setPublishDesc(data.description);
              }}
            >
              填入发品表单
            </button>
          </div>
        </section>

        <section className="card">
          <h2>
            04 上架商品 <span className="badge">04_publish_item.py</span>
          </h2>
          <label>标题</label>
          <input value={publishTitle} onChange={(e) => setPublishTitle(e.target.value)} placeholder="可留空，自动用文案标题" />
          <label>描述</label>
          <textarea value={publishDesc} onChange={(e) => setPublishDesc(e.target.value)} placeholder="可留空，自动用文案描述" />
          <label>售价</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} />
          <label>
            <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} /> 仅 dry-run（推荐）
          </label>
          <div className="row">
            <button
              disabled={loading !== null}
              onClick={() =>
                run("publish", () =>
                  callApi("/api/publish", {
                    cookie: cookie || undefined,
                    name: productName,
                    title: publishTitle || undefined,
                    desc: publishDesc || undefined,
                    price: Number(price),
                    originalPrice: Number(originalPrice),
                    shippingMode,
                    postPrice: shippingMode === "一口价" ? Number(postPrice) : undefined,
                    dryRun,
                    saveCookie: true,
                  }),
                )
              }
            >
              {dryRun ? "模拟上架" : "真实上架"}
            </button>
          </div>
          <p className="hint">真实上架前请取消 dry-run，并使用测试账号。</p>
        </section>

        <section className="card" style={{ gridColumn: "1 / -1" }}>
          <h2>
            05 发货配置 <span className="badge">05_shipping.py</span>
          </h2>
          <div className="row">
            <div style={{ minWidth: 180 }}>
              <label>发货模式</label>
              <select value={shippingMode} onChange={(e) => setShippingMode(e.target.value)}>
                <option value="包邮">包邮</option>
                <option value="按距离计费">按距离计费</option>
                <option value="一口价">一口价</option>
                <option value="无需邮寄">无需邮寄</option>
              </select>
            </div>
            {shippingMode === "一口价" && (
              <div style={{ minWidth: 140 }}>
                <label>邮费（元）</label>
                <input value={postPrice} onChange={(e) => setPostPrice(e.target.value)} />
              </div>
            )}
          </div>
          <div className="row">
            <button
              disabled={loading !== null}
              onClick={() =>
                run("shipping", () =>
                  callApi("/api/shipping", {
                    mode: shippingMode,
                    postPrice: shippingMode === "一口价" ? Number(postPrice) : undefined,
                    title: publishTitle || productName,
                    desc: publishDesc || "商品描述",
                    price: Number(price),
                    originalPrice: Number(originalPrice),
                  }),
                )
              }
            >
              生成发货配置
            </button>
          </div>
        </section>
      </div>

      <section className="result">
        <h3>
          执行结果
          {loading && <span className="status">运行中: {loading}...</span>}
          {!loading && result && (
            <span className={`status ${result.ok ? "ok" : "err"}`}>
              {result.ok ? "成功" : `失败 (code ${result.code ?? "?"})`}
            </span>
          )}
        </h3>
        <pre>{result ? JSON.stringify(result.data ?? result, null, 2) : "点击上方按钮开始测试"}</pre>
        {result?.stderr ? <pre style={{ color: "#ff9b9b", marginTop: "0.75rem" }}>{result.stderr}</pre> : null}
      </section>
    </main>
  );
}
