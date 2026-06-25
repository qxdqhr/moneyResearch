import { spawn } from "node:child_process";
import path from "node:path";

const DEMO_ROOT = path.resolve(process.cwd(), "..");
const PYTHON = path.join(DEMO_ROOT, ".venv", "bin", "python");
const SYSTEM_PYTHON = "python3";

export type ScriptName =
  | "01_cookie_login"
  | "02_sign"
  | "03_copywriting"
  | "04_publish_item"
  | "05_shipping";

export async function runDemoScript(
  script: ScriptName,
  args: string[] = [],
): Promise<{ ok: boolean; code: number; stdout: string; stderr: string; data?: unknown }> {
  const scriptPath = path.join(DEMO_ROOT, "scripts", `${script}.py`);
  const pythonBin = await fileExists(PYTHON) ? PYTHON : SYSTEM_PYTHON;

  return new Promise((resolve) => {
    const child = spawn(pythonBin, [scriptPath, ...args], {
      cwd: DEMO_ROOT,
      env: { ...process.env, PYTHONUTF8: "1" },
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });

    child.on("close", (code) => {
      const exitCode = code ?? 1;
      let data: unknown;
      try {
        data = JSON.parse(stdout);
      } catch {
        data = undefined;
      }
      resolve({
        ok: exitCode === 0,
        code: exitCode,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        data,
      });
    });
  });
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await import("node:fs/promises").then((fs) => fs.access(filePath));
    return true;
  } catch {
    return false;
  }
}
