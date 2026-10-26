// Builds and drives steps files one at a time across every caller (agents included) via a shared lock dir.
// Usage: node run-steps.mjs [concepts/<name>.steps.json ...]   (no args: every steps file)
// Env passes through to drive.mjs (AUDIT=1, SIZE=WxH). OUTROOT sets the shot root (default <tmp>/acan-steps).
import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const files = process.argv.length > 2 ? process.argv.slice(2).map((f) => resolve(f)) : readdirSync(join(here, "concepts")).filter((f) => f.endsWith(".steps.json")).sort().map((f) => join(here, "concepts", f));
const root = resolve(process.env.OUTROOT || join(tmpdir(), "acan-steps"));
const lock = join(tmpdir(), "acan-drive.lock");
const STALE_MS = 20 * 60 * 1000;

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
function acquire() {
  for (;;) {
    try { mkdirSync(lock); return; } catch (e) {
      if (e.code !== "EEXIST") throw e;
      // A crashed holder never removes its lock, so age it out.
      try { if (Date.now() - statSync(lock).mtimeMs > STALE_MS) rmSync(lock, { recursive: true, force: true }); } catch {}
      sleep(500);
    }
  }
}

let fail = 0;
for (const f of files) {
  const name = basename(f, ".steps.json");
  const id = name.split("-")[0];
  const kv = /-kv-(\w+)$/.exec(name);
  const hash = `c=${id}` + (kv ? `&kv=${kv[1]}` : "");
  const out = join(root, name);
  mkdirSync(out, { recursive: true });
  acquire();
  let log;
  try {
    const opts = { cwd: here, encoding: "utf8", maxBuffer: 64 << 20, env: { ...process.env, OUT: `live-${id}.html` } };
    const b = spawnSync(process.execPath, ["build.mjs", id], opts);
    const d = b.status === 0 ? spawnSync(process.execPath, ["drive.mjs", `live-${id}.html`, hash, f, out], opts) : null;
    log = (b.stdout + b.stderr) + (d ? d.stdout + d.stderr : "");
    const ok = d && d.status === 0 && /^OK/m.test(d.stdout);
    if (!ok) fail = 1;
    const why = ok ? "" : ": " + ((log.match(/^.*(FAIL|Error|expected).*$/m) || [log.trim().split("\n").pop() || ""])[0]).slice(0, 200);
    console.log(`${name} ${ok ? "OK" : "FAIL"}${why}`);
  } finally {
    rmSync(lock, { recursive: true, force: true });
  }
  writeFileSync(join(root, name + ".log"), log);
}
process.exit(fail);
