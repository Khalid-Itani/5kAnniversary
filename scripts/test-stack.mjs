import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const mode = process.argv[2];
if (!["start", "stop"].includes(mode)) throw new Error("Use start or stop.");
const root = resolve(".test-stack");
mkdirSync(`${root}/supabase`, { recursive: true });
cpSync("tests/config/supabase.toml", `${root}/supabase/config.toml`);
cpSync("supabase/migrations", `${root}/supabase/migrations`, { recursive: true });
const binary = resolve(`node_modules/.bin/supabase${process.platform === "win32" ? ".cmd" : ""}`);
function run(args, capture = false) {
  const result = spawnSync(binary, [...args, "--workdir", root], {
    shell: process.platform === "win32", encoding: "utf8",
    stdio: capture ? "pipe" : "inherit",
  });
  if (result.error || result.status !== 0) throw new Error("Local Supabase command failed. Install/start Docker Desktop, then retry.");
  return result.stdout;
}
if (mode === "stop") run(["stop", "--no-backup"]);
else {
  run(["start", "--exclude", "studio,vector,edge-runtime,logflare,imgproxy,supavisor"]);
  const config = JSON.parse(run(["status", "-o", "json"], true));
  if (new URL(config.API_URL).hostname !== "127.0.0.1") throw new Error("Refusing a non-local database.");
  writeFileSync(`${root}/runtime.json`, JSON.stringify(config));
  console.log("Disposable local database ready. Run npm run test:e2e.");
}
