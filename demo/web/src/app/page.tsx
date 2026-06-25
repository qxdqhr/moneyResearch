"use client";

import { useState } from "react";

type Tab = "xianyu" | "baidu-pan" | "quark-pan";

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
  const [tab, setTab] = useState<Tab>("xianyu");
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);

  // 闲鱼
  const [xyCookie, setXyCookie] = useState("");
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

  // 百度网盘
  const [bdCookie, setBdCookie] = useState("");
  const [bdShareUrl, setBdShareUrl] = useState("https://pan.baidu.com/s/1xxxx?pwd=abcd");
  const [bdSharePwd, setBdSharePwd] = useState("abcd");
  const [bdSavePath, setBdSavePath] = useState("/转存调研");
  const [bdNewSharePwd, setBdNewSharePwd] = useState("x1y2");

  // 夸克网盘
  const [qkCookie, setQkCookie] = useState("");
  const [qkShareUrl, setQkShareUrl] = useState("https://pan.quark.cn/s/xxxxx?pwd=abcd");
  const [qkSharePwd, setQkSharePwd] = useState("abcd");
  const [qkSavePath, setQkSavePath] = useState("/转存调研");
  const [qkNewSharePwd, setQkNewSharePwd] = useState("x1y2");

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
      <h1>moneyResearch Demo 测试台</h1>
      <p className="subtitle">
        统一调用 <code>demo/xianyu</code>、<code>demo/baidu-pan</code>、<code>demo/quark-pan</code> 下的 Python 脚本。
      </p>

      <div className="tabs">
        <button className={tab === "xianyu" ? "tab active" : "tab"} onClick={() => setTab("xianyu")}>
          闲鱼
        </button>
        <button className={tab === "baidu-pan" ? "tab active" : "tab"} onClick={() => setTab("baidu-pan")}>
          百度网盘
        </button>
        <button className={tab === "quark-pan" ? "tab active" : "tab"} onClick={() => setTab("quark-pan")}>
          夸克网盘
        </button>
      </div>

      {tab === "xianyu" ? (
        <div className="grid">
          <section className="card">
            <h2>
              01 Cookie 登录 <span className="badge">xianyu/01_cookie_login.py</span>
            </h2>
            <label>Cookie（留空读 demo/xianyu/data/cookies.json）</label>
            <textarea value={xyCookie} onChange={(e) => setXyCookie(e.target.value)} placeholder="cookie2=...; unb=..." />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("xy-cookie", () =>
                    callApi("/api/xianyu/cookie-login", { cookie: xyCookie || undefined, refresh: true, save: true }),
                  )
                }
              >
                检测并刷新 Token
              </button>
            </div>
          </section>

          <section className="card">
            <h2>
              02 签名 <span className="badge">xianyu/02_sign.py</span>
            </h2>
            <label>Token</label>
            <input value={token} onChange={(e) => setToken(e.target.value)} />
            <label>data JSON</label>
            <textarea value={signData} onChange={(e) => setSignData(e.target.value)} />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("xy-sign", () =>
                    callApi("/api/xianyu/sign", { token: token || undefined, data: signData }),
                  )
                }
              >
                生成签名
              </button>
            </div>
          </section>

          <section className="card">
            <h2>
              03 商品文案 <span className="badge">xianyu/03_copywriting.py</span>
            </h2>
            <label>商品名称</label>
            <input value={productName} onChange={(e) => setProductName(e.target.value)} />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("xy-copy", () =>
                    callApi("/api/xianyu/copywriting", {
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
            </div>
          </section>

          <section className="card">
            <h2>
              04 上架 <span className="badge">xianyu/04_publish_item.py</span>
            </h2>
            <label>
              <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} /> dry-run
            </label>
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("xy-publish", () =>
                    callApi("/api/xianyu/publish", {
                      cookie: xyCookie || undefined,
                      name: productName,
                      price: Number(price),
                      dryRun,
                      saveCookie: true,
                    }),
                  )
                }
              >
                {dryRun ? "模拟上架" : "真实上架"}
              </button>
            </div>
          </section>

          <section className="card" style={{ gridColumn: "1 / -1" }}>
            <h2>
              05 发货 <span className="badge">xianyu/05_shipping.py</span>
            </h2>
            <select value={shippingMode} onChange={(e) => setShippingMode(e.target.value)}>
              <option value="包邮">包邮</option>
              <option value="按距离计费">按距离计费</option>
              <option value="一口价">一口价</option>
              <option value="无需邮寄">无需邮寄</option>
            </select>
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("xy-ship", () =>
                    callApi("/api/xianyu/shipping", {
                      mode: shippingMode,
                      price: Number(price),
                      title: productName,
                    }),
                  )
                }
              >
                生成发货配置
              </button>
            </div>
          </section>
        </div>
      ) : tab === "baidu-pan" ? (
        <div className="grid">
          <section className="card">
            <h2>
              01 Cookie 登录 <span className="badge">baidu-pan/01_cookie_login.py</span>
            </h2>
            <label>Cookie（留空读 demo/baidu-pan/data/cookies.json）</label>
            <textarea value={bdCookie} onChange={(e) => setBdCookie(e.target.value)} placeholder="BDUSS=...; STOKEN=..." />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("bd-cookie", () =>
                    callApi("/api/baidu-pan/cookie-login", { cookie: bdCookie || undefined, save: true }),
                  )
                }
              >
                检测登录 & bdstoken
              </button>
            </div>
          </section>

          <section className="card">
            <h2>
              02 解析分享 <span className="badge">baidu-pan/02_parse_share_link.py</span>
            </h2>
            <label>分享链接</label>
            <input value={bdShareUrl} onChange={(e) => setBdShareUrl(e.target.value)} />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("bd-parse", () =>
                    callApi("/api/baidu-pan/parse-share", {
                      url: bdShareUrl,
                      cookie: bdCookie || undefined,
                    }),
                  )
                }
              >
                解析链接
              </button>
            </div>
          </section>

          <section className="card">
            <h2>
              03 验证提取码 <span className="badge">baidu-pan/03_verify_extract_code.py</span>
            </h2>
            <label>提取码</label>
            <input value={bdSharePwd} onChange={(e) => setBdSharePwd(e.target.value)} />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("bd-verify", () =>
                    callApi("/api/baidu-pan/verify-pwd", {
                      url: bdShareUrl,
                      pwd: bdSharePwd,
                      cookie: bdCookie || undefined,
                    }),
                  )
                }
              >
                验证提取码
              </button>
            </div>
          </section>

          <section className="card">
            <h2>
              04 转存 <span className="badge">baidu-pan/04_transfer_save.py</span>
            </h2>
            <label>保存目录</label>
            <input value={bdSavePath} onChange={(e) => setBdSavePath(e.target.value)} />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("bd-transfer", () =>
                    callApi("/api/baidu-pan/transfer", {
                      url: bdShareUrl,
                      pwd: bdSharePwd,
                      path: bdSavePath,
                      cookie: bdCookie || undefined,
                    }),
                  )
                }
              >
                转存到网盘
              </button>
            </div>
          </section>

          <section className="card">
            <h2>
              05 创建分享 <span className="badge">baidu-pan/05_create_share.py</span>
            </h2>
            <label>新分享提取码</label>
            <input value={bdNewSharePwd} onChange={(e) => setBdNewSharePwd(e.target.value)} />
            <label>按文件名搜索 fs_id</label>
            <input placeholder="转存后的文件名关键词" id="bd-search" />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() => {
                  const search = (document.getElementById("bd-search") as HTMLInputElement)?.value;
                  run("bd-share", () =>
                    callApi("/api/baidu-pan/create-share", {
                      search,
                      pwd: bdNewSharePwd,
                      cookie: bdCookie || undefined,
                    }),
                  );
                }}
              >
                生成分享链接
              </button>
            </div>
          </section>

          <section className="card" style={{ gridColumn: "1 / -1" }}>
            <h2>
              06 全流程 <span className="badge">baidu-pan/06_pipeline.py</span>
            </h2>
            <p className="hint">分享链接 → 转存 → 自动生成新分享</p>
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("bd-pipeline", () =>
                    callApi("/api/baidu-pan/pipeline", {
                      url: bdShareUrl,
                      pwd: bdSharePwd,
                      path: bdSavePath,
                      sharePwd: bdNewSharePwd,
                      cookie: bdCookie || undefined,
                    }),
                  )
                }
              >
                一键转存并分享
              </button>
            </div>
          </section>
        </div>
      ) : (
        <div className="grid">
          <section className="card">
            <h2>
              01 Cookie 登录 <span className="badge">quark-pan/01_cookie_login.py</span>
            </h2>
            <label>Cookie（留空读 demo/quark-pan/data/cookies.json）</label>
            <textarea value={qkCookie} onChange={(e) => setQkCookie(e.target.value)} placeholder="__puus=...; __pus=..." />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("qk-cookie", () =>
                    callApi("/api/quark-pan/cookie-login", { cookie: qkCookie || undefined, save: true }),
                  )
                }
              >
                检测登录
              </button>
            </div>
          </section>

          <section className="card">
            <h2>
              02 解析分享 <span className="badge">quark-pan/02_parse_share_link.py</span>
            </h2>
            <label>分享链接</label>
            <input value={qkShareUrl} onChange={(e) => setQkShareUrl(e.target.value)} />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("qk-parse", () =>
                    callApi("/api/quark-pan/parse-share", {
                      url: qkShareUrl,
                      cookie: qkCookie || undefined,
                    }),
                  )
                }
              >
                解析链接
              </button>
            </div>
          </section>

          <section className="card">
            <h2>
              03 验证提取码 <span className="badge">quark-pan/03_verify_extract_code.py</span>
            </h2>
            <label>提取码</label>
            <input value={qkSharePwd} onChange={(e) => setQkSharePwd(e.target.value)} />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("qk-verify", () =>
                    callApi("/api/quark-pan/verify-pwd", {
                      url: qkShareUrl,
                      pwd: qkSharePwd,
                      cookie: qkCookie || undefined,
                    }),
                  )
                }
              >
                验证提取码
              </button>
            </div>
          </section>

          <section className="card">
            <h2>
              04 转存 <span className="badge">quark-pan/04_transfer_save.py</span>
            </h2>
            <label>保存目录</label>
            <input value={qkSavePath} onChange={(e) => setQkSavePath(e.target.value)} />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("qk-transfer", () =>
                    callApi("/api/quark-pan/transfer", {
                      url: qkShareUrl,
                      pwd: qkSharePwd,
                      path: qkSavePath,
                      cookie: qkCookie || undefined,
                    }),
                  )
                }
              >
                转存到网盘
              </button>
            </div>
          </section>

          <section className="card">
            <h2>
              05 创建分享 <span className="badge">quark-pan/05_create_share.py</span>
            </h2>
            <label>新分享提取码</label>
            <input value={qkNewSharePwd} onChange={(e) => setQkNewSharePwd(e.target.value)} />
            <label>按文件名搜索 fid</label>
            <input placeholder="转存后的文件名关键词" id="qk-search" />
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() => {
                  const searchName = (document.getElementById("qk-search") as HTMLInputElement)?.value;
                  run("qk-share", () =>
                    callApi("/api/quark-pan/create-share", {
                      searchName,
                      pwd: qkNewSharePwd,
                      cookie: qkCookie || undefined,
                    }),
                  );
                }}
              >
                生成分享链接
              </button>
            </div>
          </section>

          <section className="card" style={{ gridColumn: "1 / -1" }}>
            <h2>
              06 全流程 <span className="badge">quark-pan/06_pipeline.py</span>
            </h2>
            <p className="hint">分享链接 → 转存 → 自动生成新分享</p>
            <div className="row">
              <button
                disabled={loading !== null}
                onClick={() =>
                  run("qk-pipeline", () =>
                    callApi("/api/quark-pan/pipeline", {
                      url: qkShareUrl,
                      pwd: qkSharePwd,
                      path: qkSavePath,
                      sharePwd: qkNewSharePwd,
                      cookie: qkCookie || undefined,
                    }),
                  )
                }
              >
                一键转存并分享
              </button>
            </div>
          </section>
        </div>
      )}

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
        <pre>{result ? JSON.stringify(result.data ?? result, null, 2) : "选择主题后点击按钮测试"}</pre>
        {result?.stderr ? <pre style={{ color: "#ff9b9b", marginTop: "0.75rem" }}>{result.stderr}</pre> : null}
      </section>
    </main>
  );
}
