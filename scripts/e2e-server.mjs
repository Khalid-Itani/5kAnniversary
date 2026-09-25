import { existsSync, readFileSync } from "node:fs";
import { spawnSync, spawn } from "node:child_process";

const runtime = existsSync(".test-stack/runtime.json")
  ? JSON.parse(readFileSync(".test-stack/runtime.json", "utf8")) : {};
const url = runtime.API_URL ?? "http://127.0.0.1:54321";
if (new URL(url).hostname !== "127.0.0.1") throw new Error("E2E only supports the disposable local database.");
const env = {
  ...process.env, NEXT_BUILD_DIR: ".next-test", NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3100",
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: runtime.ANON_KEY ?? "local-smoke-test-key",
  ADMIN_EMAIL: "5kyearrun@gmail.com", RESEND_API_KEY: "", EMAIL_FROM: "",
};
const next = "node_modules/next/dist/bin/next";
const build = spawnSync(process.execPath, [next, "build"], { env, stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);
const server = spawn(process.execPath, [next, "start", "--hostname", "127.0.0.1", "--port", "3100"], { env, stdio: "inherit" });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.kill(signal));
server.on("exit", code => process.exit(code ?? 0));
