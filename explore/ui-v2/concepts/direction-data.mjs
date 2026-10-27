// The one fixture all three direction prototypes render (direction/00-synthesis.md).
// Every value is derived from acquit.mjs, core-data, world-data, gate-data, bench-data or JOURNEY.md.
// Where JOURNEY gives only a minute stamp, the event sits on the minute; `src` names the origin.
// Builders read this file and never edit it.
import { ACQUIT, SESSIONS as ACQUIT_SESSIONS, TERRITORIES, GHOSTS, CI, REPLAY } from "../acquit.mjs";
import { SHEET, WITNESSES, QUESTION, ORDER, READBACKS, DECLARATIONS, CLASHES, KVARM } from "./core-data.mjs";
import { WORLD } from "./world-data.mjs";
import { GATE } from "./gate-data.mjs";
import { BENCH, ATTEMPTS, KVARM_OPS } from "./bench-data.mjs";

export const T0 = REPLAY.now; // 16:30:00 in seconds, the end of the recorded hour
const MIN = 60000;
export function clockOf(ms) {
  const s = Math.floor(T0 + ms / 1000), p = (n) => String(n).padStart(2, "0");
  return p(Math.floor(s / 3600)) + ":" + p(Math.floor((s % 3600) / 60)) + ":" + p(s % 60);
}
const msOf = (hhmm) => { const [h, m, s = 0] = hhmm.split(":").map(Number); return (h * 3600 + m * 60 + s - T0) * 1000; };
const find = (list, id, key = "id") => { const x = list.find((e) => e[key] === id); if (!x) throw new Error("direction-data: no " + id); return x; };

// Journey clock (JOURNEY.md section 2). Readbacks arrive READBACKS.arriveMs after Post; declareMs is section 5's timer.
const DECLARE_MS = 1200;
const AT = {
  boot: 0, post: msOf("16:31"), answer: msOf("16:32"), declarations: msOf("16:33"),
  moment: msOf("16:33:30"), settleC2: msOf("16:34"), hold: msOf("16:35"), fund: msOf("16:36"), spent: msOf("16:53"),
  record: msOf("16:55"), approve: msOf("16:58"), away: msOf("17:00"), back: msOf("17:30"),
};
AT.claim = AT.declarations - DECLARE_MS;
AT.review = AT.record + 2000;

// ---------- bindings: every fact carries one id, marks carry it as data-binding ----------
export const BINDINGS = {};
const bind = (id, entity, value, src, sourceClass = "fixture") => { BINDINGS[id] = { id, entity, value, src, sourceClass }; return id; };

// ---------- sessions (JOURNEY.md section 4, canonical table) ----------
const droidRadar = find(ACQUIT_SESSIONS, "droid-radar"), codex = find(ACQUIT_SESSIONS, "codex-paypal");
const rbCC = find(READBACKS, "claude-payouts", "session"), rbD2 = find(READBACKS, "droid-payouts", "session");
const worldAlias = Object.fromEntries(WORLD.bots.map((b) => [b.session, b.principal]));
export const SESSIONS = [
  { id: "claude-payouts", agent: "Claude Code", bot: rbCC.bot, aliases: Object.keys(worldAlias).filter((s) => s === "cc-42"), role: "claims paypal-payouts after its readback matched", src: "core-data READBACKS, JOURNEY section 4" },
  { id: "droid-payouts", agent: "Droid", bot: rbD2.bot, aliases: [], role: "readback session that lost p-2307", src: "core-data READBACKS" },
  { id: "droid-radar", agent: droidRadar.agent, bot: droidRadar.bot, aliases: [], role: "verifies radar-otel, owns d2, d3 and the breaker ghost", territory: droidRadar.territory, src: "acquit.mjs SESSIONS, core-data DECLARATIONS" },
  { id: "codex-paypal", agent: codex.agent, bot: codex.bot, aliases: Object.keys(worldAlias).filter((s) => s === "cx-17"), role: "passive, no MCP", src: "acquit.mjs SESSIONS, world-data bots" },
  { id: "claude-port", agent: "Claude Code", bot: null, workspace: find(ATTEMPTS, "a3").workspace, aliases: [], role: "bench workspace, active 16:36 to 16:55 only", src: "bench-data ATTEMPTS a3" },
];
for (const s of SESSIONS) bind("session:" + s.id, s.agent + " · " + s.id, s.role, s.src);

// ---------- Acquit plant (acquit.mjs ACQUIT) ----------
const AGENT_KINDS = new Set(["bot", "inspection", "scaffold"]);
const machines = ACQUIT.entities.filter((e) => !AGENT_KINDS.has(e.kind)).map((e) => ({
  id: e.id, kind: e.kind, name: e.name, x: e.x, y: e.y, size: e.size ?? 1, state: e.state, reading: e.reading, ...(e.variant ? { variant: e.variant } : {}), ...(e.params ? { params: e.params } : {}),
  binding: bind("machine:" + e.id, "Acquit / " + e.name, e.reading, "acquit.mjs ACQUIT.entities " + e.id, e.state === "ghost" ? "declared" : "observed"),
}));
const belts = ACQUIT.belts.map((b) => ({ ...b, id: b.from + "->" + b.to, binding: bind("belt:" + b.from + "->" + b.to, b.from + " to " + b.to, b.tone || (b.ghost ? "ghost" : "ok"), "acquit.mjs ACQUIT.belts") }));

// The breaker and retry sit on the api->paypal belt; downstream of the breaker is every fitting past it, then the belt end.
function downstreamOf(entityId, beltId) {
  const belt = find(belts, beltId), src = find(machines, entityId);
  const onBelt = (m) => belt.pts.some(([x0, y0], i) => { const [x1, y1] = belt.pts[i + 1] || [x0, y0]; return Math.abs(y0 - y1) < 1 ? Math.abs(m.y - y0) < 1 && m.x >= Math.min(x0, x1) && m.x <= Math.max(x0, x1) : Math.abs(m.x - x0) < 1 && m.y >= Math.min(y0, y1) && m.y <= Math.max(y0, y1); });
  return [...machines.filter((m) => m.id !== src.id && onBelt(m) && m.x > src.x).map((m) => m.id), belt.to];
}

// ---------- the busy moment, 16:33:30 (JOURNEY beats 8 and 9) ----------
const W3 = QUESTION.options[0].witness;
const witnesses = [...WITNESSES, W3].map((w) => ({ id: w.id, polarity: w.polarity, entity: w.entity, clock: w.clock, check: w.check, binding: bind("witness:" + w.id, w.id + " · " + w.polarity + " · " + w.entity, w.check, w.id === "w3" ? "core-data QUESTION option 1" : "core-data WITNESSES") }));
const lease = { id: KVARM.orders.generation, holder: "claude-payouts", agent: "Claude Code", task: KVARM.orders.task, issue: KVARM.orders.issue, evidence: KVARM.clash.lease.evidence, leaseS: KVARM.orders.leaseS, heartbeatS: KVARM.orders.heartbeatS, grantedAt: clockOf(AT.claim), state: "live" };
lease.binding = bind("lease:" + lease.id, "Kvarm lease " + lease.id, "Claude Code holds " + lease.id, "core-data KVARM.orders, KVARM.clash.lease", "authenticated");
const order = { id: ORDER.id, rev: "r2", state: "claimed", flag: "CLAIMED · Claude Code · lease " + lease.id, on: ORDER.on, territory: ORDER.territory, sentence: ORDER.placeholder, budget: ORDER.budgets[0], witnesses: witnesses.map((w) => w.id), readback: "READBACK · ACAN", src: "orders.mjs ordersFlag, JOURNEY beat 7" };
order.binding = bind("order:" + order.id, "Order " + order.id + " · " + order.rev, order.flag, order.src, "authenticated");
const question = { id: QUESTION.id, ref: "p-2307", entity: QUESTION.entity, layer: QUESTION.layer, text: QUESTION.text, state: "answered", answer: "1", label: QUESTION.options[0].label, witness: "w3", answeredAt: clockOf(AT.answer) };
question.binding = bind("question:" + question.id, "Question p-2307 at sqlite", "answered · keep pending", "core-data QUESTION, JOURNEY beat 6");
const declarations = DECLARATIONS.map((d) => ({ id: d.id, session: d.session, agent: d.agent, territory: d.territory, proposal: d.proposal || null, touches: d.touches, belts: d.belts, asserts: d.asserts, binding: bind("decl:" + d.id, d.agent + " · " + d.id, d.asserts, "core-data DECLARATIONS " + d.id, "declared") }));
const CLASH_TITLE = { c1: ["Retry meets breaker", "Breaks w3 · payout p-2307"], c2: ["c2 · two migrations on effects queue rows", null] };
const clashes = CLASHES.map((c) => ({ id: c.id, severity: c.severity, at: c.at, decls: c.decls, breaks: c.breaks, suggested: c.suggested, title: CLASH_TITLE[c.id]?.[0] || null, breaksRow: CLASH_TITLE[c.id]?.[1] || null, options: c.resolutions.map((r) => ({ key: r.key, kind: r.kind, label: r.label })), binding: bind("clash:" + c.id, "Clash " + c.id, c.severity + (c.breaks ? " · breaks " + c.breaks : ""), "core-data CLASHES " + c.id + ", JOURNEY beats 8 and 9", "declared") }));
const blast = { decl: "d3", agent: "Droid", session: "droid-radar", on: "breaker", belt: "api->paypal", downstream: downstreamOf("breaker", "api->paypal"), src: "core-data d3 belts, acquit.mjs belt api->paypal" };
blast.binding = bind("blast:d3", "Blast radius of d3", blast.downstream.join(", "), blast.src, "declared");

const codexAsked = find(GATE.brief, "idle", "cls").what.match(/at (\d\d:\d\d)\. It is passive/)[1]; // "16:21"
const waitedMin = (atMs) => Math.floor((atMs - msOf(codexAsked)) / MIN);
const radarSince = msOf("16:30") - parseInt(droidRadar.since, 10) * MIN; // acquit.mjs says 38m at 16:30
const ENT = Object.fromEntries(ACQUIT.entities.map((e) => [e.id, e]));
const dock = ENT[ORDER.on];
function agentsAt(atMs) {
  return [
    // orders.mjs ordersGrant moves the claimant to paypal (x - 10, y + 15); ordersArrive placed bot-d2 at (x - 45, y + 55).
    { session: "claude-payouts", agent: "Claude Code", bot: "bot-cc", x: dock.x - 10, y: dock.y + 15, target: ORDER.on, state: "working", activity: "claimed · lease " + lease.id, evidence: lease.evidence, readback: "3 of 3", territory: ORDER.territory, src: "orders.mjs ordersGrant" },
    { session: "droid-radar", agent: "Droid", bot: "bot", x: ENT.bot.x, y: ENT.bot.y, target: "radar", state: "working", activity: droidRadar.now, sinceMin: Math.floor((atMs - radarSince) / MIN), evidence: "declared", territory: droidRadar.territory, declares: ["d2", "d3"], src: "acquit.mjs SESSIONS droid-radar" },
    { session: "droid-payouts", agent: "Droid", bot: "bot-d2", x: dock.x - 45, y: dock.y + 55, target: ORDER.on, state: "yields", activity: "yields", evidence: "declared", territory: null, src: "orders.mjs ordersArrive, ordersGrant" },
    { session: "codex-paypal", agent: "Codex", bot: "bot-cx", x: ENT["bot-cx"].x, y: ENT["bot-cx"].y, target: "retry", state: "waiting", waitsOn: "you", activity: "waiting on you · " + waitedMin(atMs) + "m", askedAt: codexAsked, waitedMin: waitedMin(atMs), prompt: "run npm test in packages/core", passive: true, evidence: "observed", territory: null, src: "acquit.mjs bot-cx, gate-data codex" },
  ].map((a) => ({ ...a, binding: "session:" + a.session }));
}

// ---------- queue (JOURNEY section 5, sorted by gate class, gate.mjs) ----------
const CLASS_ORDER = GATE.classes.map((c) => c.id);
const est = (s) => s.split(/[–-]/).map((n) => parseInt(n, 10));
const g = (id) => find(GATE.items, id), wq = (id) => find(WORLD.queue, id);
const QUEUE_ROWS = {
  breaker: { title: g("breaker").title, cls: g("breaker").cls, est: g("breaker").est, basis: g("breaker").basis, on: "breaker", agent: "Droid", src: "gate-data breaker" },
  codex: { title: g("codex").title, cls: g("codex").cls, est: g("codex").est, basis: g("codex").basis, on: "bot-cx", agent: "Codex", src: "gate-data codex" },
  digest: { title: wq("digest").title, cls: "publish", est: est(wq("digest").estimate), basis: "fixture", plant: "format", on: wq("digest").entity, src: "world-data queue digest" },
  "p-2307": { title: wq("p-2307").title, cls: "idle", est: est(wq("p-2307").estimate), basis: "fixture", on: "sqlite", src: "world-data queue p-2307, class new in JOURNEY" },
  c1: { title: wq("c1").title, cls: "reversal", est: est(wq("c1").estimate), basis: "fixture", on: "breaker", src: "world-data queue c1" },
  c2: { title: "c2 · two migrations on effects queue rows", cls: "reversal", est: [3, 5], basis: "guess", on: "sqlite", src: "JOURNEY section 5" },
  "review-184": { title: wq("review").title, cls: "publish", est: est(wq("review").estimate), basis: "fixture", on: ORDER.on, src: "world-data queue review, moved to Acquit by JOURNEY section 4" },
};
for (const [id, r] of Object.entries(QUEUE_ROWS)) { r.id = id; r.binding = bind("queue:" + id, "Queue row " + id, r.title, r.src); }

// ---------- ledger (JOURNEY section 5 table; heartbeats stay one row with a count, orders.mjs:432) ----------
const OPS = { ...Object.fromEntries(WORLD.operations.map((o) => [o.op, o.bytes])), list_pending_reviews: GATE.kvarm.ops[0].bytes, ...Object.fromEntries(Object.entries(KVARM.orders.ops).map(([k, v]) => [k, v.bytes])), ...Object.fromEntries(KVARM.clash.reads.map((r) => [r.op, r.bytes])), record_decision_clash: KVARM.clash.ops.record_decision.bytes, git_push: KVARM.clash.ops.git_push.bytes, set_intent: KVARM.clash.ops.set_intent.bytes };
const op = (name, key = name) => { if (!(key in OPS)) throw new Error("direction-data: no bytes for " + key); return { op: name, bytes: OPS[key] }; };
const benchOp = (list, name) => ({ op: name, bytes: find(list, name, "op").bytes });

// ---------- event stream: the only thing allowed to start motion ----------
const ev = (id, atMs, kind, text, extra = {}) => ({ id, at: atMs, clock: clockOf(atMs), kind, text, rows: [], queue: {}, bindings: [], ...extra });
const RAW_EVENTS = [
  ev("boot", AT.boot, "boot", "Five plants, queue of three", { beat: 1, rows: ["list_repos", "get_heads", "get_leases", "list_pending_reviews"].map((n) => op(n)), queue: { add: ["breaker", "codex", "digest"] } }),
  ev("post", AT.post, "order", "Posted r1. Witnesses are locked.", { beat: 4, rows: [op("create_issue"), op("dispatch_issue")], bindings: ["order:" + ORDER.id] }),
  ev("readback-cc", AT.post + rbCC.arriveMs, "readback", "Claude Code sent a readback.", { beat: 5, bindings: ["session:claude-payouts"] }),
  ev("readback-d2", AT.post + rbD2.arriveMs, "readback", "Two readings differ on p-2307. Answer at sqlite.", { beat: 5, bindings: ["session:droid-payouts", "question:q1"], queue: { add: ["p-2307"] } }),
  ev("answer", AT.answer, "answer", "Pinned w3. Order is now r2.", { beat: 6, rows: [op("comment_issue")], bindings: ["witness:w3", "question:q1"], queue: { drop: ["p-2307"] } }),
  ev("claim", AT.claim, "claim", "Claude Code claimed. Readback matched 3 of 3.", { beat: 7, rows: [op("claim_task")], bindings: ["lease:g1", "session:claude-payouts", "order:" + ORDER.id] }),
  ev("declarations", AT.declarations, "declarations", "2 clashes before code", { beat: 8, rows: [op("get_intent"), op("forecast")], bindings: ["decl:d1", "decl:d2", "decl:d3", "clash:c1", "clash:c2", "clash:c3"], queue: { add: ["c1", "c2"] } }),
  ev("settle-c2", AT.settleC2, "settle", "Settled before code. Decision logged to Kvarm.", { beat: 10, rows: [op("record_decision", "record_decision_clash")], bindings: ["clash:c2"], queue: { drop: ["c2"] } }),
  ev("hold-breaker", AT.hold, "advice", "Hold advised on the breaker. Droid keeps working.", { beat: 11, bindings: ["queue:breaker"], local: true }),
  ev("bench-fund", AT.fund, "bench", "Bench funded, three attempts", { beat: 12, rows: [benchOp(KVARM_OPS.fund, "create_arena")] }),
  ev("bench-spent", AT.spent, "bench", "A2 disproved by w3. A3 spent at 300000 tokens.", { beat: 12, rows: [benchOp(KVARM_OPS.results, "rank_arena")] }),
  ev("bench-record", AT.record, "bench", "Recorded A3. Now r3. c1 settled as Split.", { beat: 12, rows: [...["record_decision", "select_arena_winner", "resolve_escalation"].map((n) => benchOp(KVARM_OPS.pick, n)), op("record_decision", "record_decision_clash"), op("git_push"), op("set_intent"), op("set_intent")], bindings: ["clash:c1"], queue: { drop: ["c1"] } }),
  ev("review-184", AT.review, "review", "Review #184 arrived", { beat: 13, queue: { add: ["review-184"] } }),
  ev("approve-184", AT.approve, "review", "Approved #184. Publication not confirmed.", { beat: 13, rows: [{ op: "reviewChange", bytes: null }], queue: { drop: ["review-184"] } }),
  ev("away", AT.away, "away", "Away until 17:30", { beat: 14 }),
  ev("ci-418", msOf("17:06"), "away-item", "CI #418 passed 5/5 · seal radar-otel ready", { bindings: ["away:ci-418"] }),
  ev("breaker-declared", msOf("17:14"), "away-item", "Breaker declared via paypal.result v1 · hold advised", { bindings: ["away:breaker"] }),
  ev("artifact", msOf("17:22"), "away-item", WORLD.arrival.title, { bindings: ["away:artifact"], local: true }),
  ev("return", AT.back, "return", "While you were away · 17:00 to 17:30", { beat: 15, rows: [{ op: "readUpdates", bytes: null }, { op: "readSnapshot", bytes: null }] }),
];
// Heartbeats every heartbeatS while the lease is live (kv=ok), from the claim to the return.
for (let t = AT.claim + KVARM.orders.heartbeatS * 1000; t <= AT.back; t += KVARM.orders.heartbeatS * 1000)
  RAW_EVENTS.push(ev("heartbeat-" + clockOf(t).replace(/:/g, ""), t, "heartbeat", "Lease g1 renewed", { rows: [op("heartbeat_task")], bindings: ["lease:g1"], quiet: true }));
export const EVENTS = RAW_EVENTS.sort((a, b) => a.at - b.at).map((e) => ({ ...e, binding: bind("event:" + e.id, "Event " + e.id + " · " + e.clock, e.text, "JOURNEY beat " + (e.beat || "-")) }));

export function ledgerAt(atMs, events = EVENTS) {
  const rows = [];
  for (const e of events) if (e.at <= atMs) for (const r of e.rows) {
    const last = rows[rows.length - 1];
    if (r.op === "heartbeat_task" && last && last.op === "heartbeat_task") { last.count++; last.bytes += r.bytes; continue; }
    rows.push({ ...r, count: 1, at: e.clock, event: e.id });
  }
  return rows.map((r, i) => ({ ...r, binding: bind("ledger:" + r.event + ":" + r.op, "Kvarm " + r.op + " at " + r.at, r.bytes === null ? "bytes not in any fixture" : r.bytes + " B", "JOURNEY section 5 ledger", "declared") }));
}
export function ledgerTotal(rows) {
  const known = rows.filter((r) => r.bytes !== null);
  return { bytes: known.reduce((s, r) => s + r.bytes, 0), rows: rows.length, unsized: rows.length - known.length };
}
export function queueAt(atMs) {
  const ids = [];
  for (const e of EVENTS) if (e.at <= atMs) { for (const a of e.queue.add || []) ids.push(a); for (const d of e.queue.drop || []) ids.splice(ids.indexOf(d), 1); }
  const rows = ids.map((id) => ({ ...QUEUE_ROWS[id], state: id === "breaker" && atMs >= AT.hold ? "hold advised" : "open" }))
    .sort((a, b) => CLASS_ORDER.indexOf(a.cls) - CLASS_ORDER.indexOf(b.cls) || ids.indexOf(a.id) - ids.indexOf(b.id));
  const sum = rows.reduce((s, r) => [s[0] + r.est[0], s[1] + r.est[1]], [0, 0]);
  return { rows, header: rows.length ? sum[0] + "–" + sum[1] + " min" : null, count: rows.length };
}
const fmtBytes = (n) => n.toLocaleString("en-US");
const egressAt = (atMs, rows = ledgerAt(atMs)) => { const t = ledgerTotal(rows); return { bytes: t.bytes, unsized: t.unsized, label: "local + kvarm · " + fmtBytes(t.bytes) + " B out" + (t.unsized ? " + " + t.unsized + " unsized" : ""), binding: "egress:total" }; };
bind("egress:total", "Bytes sent off the machine", "sum of ledger rows", "ledgerAt over EVENTS", "declared");

// ---------- plants on one unbounded plane ----------
// World units are plant-scene units (the iso kit's ground units). Each plant's site rect comes from its machines' extents;
// world-data's 1600 x 900 thumbnail layout keeps its arrangement, scaled by the smallest factor that keeps sites apart.
export const SITE_PAD = 48, SITE_GAP = 96;
const extent = (ents) => [Math.min(...ents.map((e) => e.x)) - SITE_PAD, Math.min(...ents.map((e) => e.y)) - SITE_PAD, Math.max(...ents.map((e) => e.x)) + SITE_PAD, Math.max(...ents.map((e) => e.y)) + SITE_PAD];
const PLANT_STATE = {
  acquit: { revision: SHEET.rev, branch: "main", condition: "paypal over budget · 4.1% of 2%", src: "JOURNEY section 5 Plants" },
  format: { condition: "Digest blocks publication", src: "JOURNEY section 5 Plants" },
  kvarm: { condition: "fresh · nothing waits", src: "JOURNEY section 5 Plants, until beat 13" },
  acan: { condition: null, src: "world-data condition is the unmatched claim, which JOURNEY drops under kv=ok" },
  site: { condition: find(WORLD.plants, "site").condition, src: "world-data" },
};
const base = WORLD.plants.map((p) => {
  const local = p.id === "acquit" ? [...machines.filter((m) => m.kind !== "crane"), ...agentsAt(AT.moment)] : p.scene.entities;
  return { id: p.id, name: p.name, thumb: [p.x, p.y], local: extent(local), env: p.env, revision: p.revision, branch: p.branch, freshness: p.freshness,
    machines: p.id === "acquit" ? machines.map((m) => m.id) : p.scene.entities.map((e) => e.id), ...PLANT_STATE[p.id] };
});
let scale = 0;
for (const [i, a] of base.entries()) for (const b of base.slice(i + 1)) {
  // Scale at which the pair stops overlapping on axis k, whichever side b sits on.
  const need = (k) => { const d = b.thumb[k] - a.thumb[k]; return d > 0 ? (a.local[k + 2] - b.local[k] + SITE_GAP) / d : d < 0 ? (b.local[k + 2] - a.local[k] + SITE_GAP) / -d : Infinity; };
  scale = Math.max(scale, Math.min(need(0), need(1)));
}
// F1 must read as org level, so spread the layout further until every site is under the org threshold, with
// hysteresis margin, when the org stop fits the largest frame size (1440 x 900) with no rail.
const ORG_BELOW = 160, FRAME_MAX = [1440, 900];
const orgFitPx = (k) => {
  const rects = base.map((p) => [p.thumb[0] * k + p.local[0], p.thumb[1] * k + p.local[1], p.thumb[0] * k + p.local[2], p.thumb[1] * k + p.local[3]]);
  const u = [Math.min(...rects.map((r) => r[0])) - SITE_GAP, Math.min(...rects.map((r) => r[1])) - SITE_GAP, Math.max(...rects.map((r) => r[2])) + SITE_GAP, Math.max(...rects.map((r) => r[3])) + SITE_GAP];
  return cameraFor(u, freeRect(...FRAME_MAX, { rail: "none" })).ppu * Math.max(...base.map((p) => p.local[2] - p.local[0]));
};
scale = Math.ceil(scale * 20) / 20;
while (orgFitPx(scale) >= ORG_BELOW * 0.85) scale += 0.05;
export const PLANE_SCALE = Math.round(scale * 100) / 100;
const momentQueue = queueAt(AT.moment), momentAgents = agentsAt(AT.moment);
export const PLANTS = base.map((p) => {
  const origin = [p.thumb[0] * PLANE_SCALE, p.thumb[1] * PLANE_SCALE];
  const waiting = momentQueue.rows.filter((r) => (r.plant || "acquit") === p.id).length;
  return { ...p, origin, rect: [origin[0] + p.local[0], origin[1] + p.local[1], origin[0] + p.local[2], origin[1] + p.local[3]],
    agents: p.id === "acquit" ? momentAgents.map((a) => a.session) : [], waiting,
    binding: bind("plant:" + p.id, p.name, p.condition, "world-data plants " + p.id + ", " + p.src) };
});
const scenes = Object.fromEntries(WORLD.plants.filter((p) => p.scene).map((p) => [p.id, { entities: p.scene.entities, belts: p.scene.belts, territories: p.scene.territories || [] }]));
export const CONTRACTS = WORLD.contracts.map((c) => ({ id: c.id, from: c.from, to: c.to, fromEntity: c.fromEntity, toEntity: c.toEntity, kind: c.kind, label: c.label, evidence: c.evidence, binding: bind("contract:" + c.id, c.label, c.evidence, "world-data contracts " + c.id, "declared") }));

// Twenty-plant stub for the perf check: repeated fixtures, no telemetry, no agents.
export function stubPlants(n = 20, plants = PLANTS, gap = SITE_GAP) {
  const u = [Math.min(...plants.map((p) => p.rect[0])), Math.min(...plants.map((p) => p.rect[1])), Math.max(...plants.map((p) => p.rect[2])), Math.max(...plants.map((p) => p.rect[3]))];
  const copies = Math.ceil(n / plants.length), cols = Math.ceil(Math.sqrt(copies)), w = u[2] - u[0] + gap, h = u[3] - u[1] + gap, out = [];
  for (let c = 0; c < copies; c++) for (const p of plants) {
    if (out.length === n) break;
    const dx = (c % cols) * w, dy = Math.floor(c / cols) * h;
    out.push({ id: p.id + "~" + c, of: p.id, name: p.name, stub: true, origin: [p.origin[0] + dx, p.origin[1] + dy], rect: [p.rect[0] + dx, p.rect[1] + dy, p.rect[2] + dx, p.rect[3] + dy], machines: p.machines });
  }
  return out;
}

// ---------- camera ----------
// Free rect rules from JOURNEY.md section 1: left 16, top 100, bottom vh - 64, right at the rail or the open card, minus 8.
export function freeRect(vw, vh, opts = {}) {
  const right = opts.card ? vw - 408 - 8 : opts.rail === "minimap" ? vw - 200 - 8 : opts.rail === "none" ? vw - 16 : vw - 112 - 8;
  const left = opts.queue ? 416 : 16;
  return { x: left, y: 100, w: right - left, h: vh - 64 - 100 };
}
// Fits a world rect into a screen rect. Returns the centre in world units and pixels per unit.
export function cameraFor(rect, free) {
  const w = rect[2] - rect[0], h = rect[3] - rect[1], ppu = Math.min(free.w / w, free.h / h);
  return { cx: (rect[0] + rect[2]) / 2, cy: (rect[1] + rect[3]) / 2, ppu, sx: free.x + free.w / 2, sy: free.y + free.h / 2 };
}
// Level from a plant's site width on screen (direction/memo-opus.md section 4.3), with 15 percent hysteresis.
export const LEVELS = [{ id: "org", below: ORG_BELOW }, { id: "site", below: 560 }, { id: "plant", below: 2200 }, { id: "machine", below: Infinity }];
export function levelFor(siteWidthPx, prev) {
  const i = LEVELS.findIndex((l) => siteWidthPx < l.below);
  if (!prev) return LEVELS[i].id;
  const p = LEVELS.findIndex((l) => l.id === prev), lo = p ? LEVELS[p - 1].below * 0.85 : 0, hi = LEVELS[p].below * 1.15;
  return siteWidthPx >= lo && siteWidthPx < hi ? prev : LEVELS[i].id;
}
const union = (rs) => [Math.min(...rs.map((r) => r[0])), Math.min(...rs.map((r) => r[1])), Math.max(...rs.map((r) => r[2])), Math.max(...rs.map((r) => r[3]))];
const acquit = PLANTS.find((p) => p.id === "acquit");
const orgRect = union(PLANTS.map((p) => p.rect)).map((v, i) => v + (i < 2 ? -SITE_GAP : SITE_GAP));
const terr = TERRITORIES[ORDER.territory].entities.map((id) => ENT[id]);
const machineRect = extent(terr).map((v, i) => v + acquit.origin[i % 2] + (i < 2 ? 24 : -24));
// The sweep is one zoom about a fixed anchor, so every stop is the same scene at a different scale.
function sweep(from, to, n) {
  const s = (to[2] - to[0]) / (from[2] - from[0]), c = (r) => [(r[0] + r[2]) / 2, (r[1] + r[3]) / 2], cf = c(from), ct = c(to);
  const A = [0, 1].map((i) => (ct[i] - s * cf[i]) / (1 - s));
  return Array.from({ length: n }, (_, k) => { const f = Math.pow(s, k / (n - 1)); return from.map((v, i) => A[i % 2] + (v - A[i % 2]) * f); });
}
const sweepRects = sweep(orgRect, acquit.rect, 5);
export const CAMERA = {
  stops: {
    org: { label: "My world · five plants", rect: orgRect },
    ...Object.fromEntries(sweepRects.map((r, i) => ["sweep-" + (i + 1), { label: "Zoom sweep stop " + (i + 1) + " of 5", rect: r }])),
    plant: { label: "Acquit plant", rect: acquit.rect, plant: "acquit" },
    machine: { label: "paypal-payouts, machine level", rect: machineRect, plant: "acquit", machine: ORDER.on },
  },
  script: ["org", "sweep-1", "sweep-2", "sweep-3", "sweep-4", "sweep-5", "plant", "machine"],
};

// ---------- kv scenarios (orders.mjs ordersFlag, ordersExpire, ordersClaim; TEXT.md honesty table) ----------
const kvLedger = (extra, drop = []) => { const rows = ledgerAt(AT.moment).filter((r) => !drop.includes(r.op)); return [...rows, ...extra.map((r) => ({ ...r, count: 1, binding: bind("ledger:kv:" + r.op, "Kvarm " + r.op, r.bytes + " B", r.src, "declared") }))]; };
const kvRows = {
  ok: ledgerAt(AT.moment),
  // Codex holds g1 from the dispatch poll, so Claude Code's claim is rejected and no declarations are read.
  unmatched: kvLedger([{ op: "get_task", bytes: OPS.get_task, src: "orders.mjs ordersDispatched" }], ["get_intent", "forecast"]),
  // The stale script renews after heartbeatMs; Kvarm rejects that heartbeat with STALE_GENERATION.
  stale: kvLedger([{ op: "heartbeat_task", bytes: OPS.heartbeat_task, result: KVARM.orders.stale.code, src: "orders.mjs ordersKvTick" }]),
};
const U = KVARM.orders.unmatched;
export const KV = {
  ok: { id: "ok", lease, order: { flag: order.flag, state: "claimed" }, holderRow: null, territory: { id: ORDER.territory, state: "claimed", label: "PAYPAL-PAYOUTS · CLAIMED · Claude Code", fog: false },
    indicator: { state: "fresh", ageS: WORLD.bindings.train.age, label: "fresh · " + WORLD.bindings.train.age + " s" }, agents: {}, clashes: ["c1", "c2", "c3"] },
  unmatched: { id: "unmatched", lease: { ...lease, holder: U.session, agent: U.holder, evidence: U.evidence, readback: false, grantedAt: null },
    order: { flag: "UNMATCHED · " + U.holder + " holds " + lease.id + " · no readback", tone: "wait", state: "open" },
    holderRow: U.holder + " unmatched · holds " + lease.id, toast: "Kvarm rejected the claim from Claude Code. Codex holds g1 with no readback.",
    territory: { id: ORDER.territory, state: "unmatched", label: "PAYPAL-PAYOUTS · UNCLAIMED", fog: true },
    indicator: { state: "fresh", ageS: WORLD.bindings.train.age, label: "fresh · " + WORLD.bindings.train.age + " s" },
    agents: { "claude-payouts": { state: "waiting", activity: "readback · Kvarm rejected", lease: null }, "codex-paypal": { lease: lease.id, readback: false, activity: "holds " + lease.id + " · no readback" } },
    clashes: [], src: "orders.mjs ordersDispatched, ordersClaim; no claim means no d1, so c1 to c3 never form" },
  stale: { id: "stale", lease: { ...lease, state: "expired" }, order: { flag: "LEASE STALE · " + lease.id + " expired", evidenceState: "stale", state: "stale" },
    holderRow: "claude-payouts · heartbeat rejected · " + KVARM.orders.stale.code, toast: "Lease g1 expired. Kvarm rejected the heartbeat with STALE_GENERATION. Claude Code stopped.",
    territory: { id: ORDER.territory, state: "unclaimed", label: "PAYPAL-PAYOUTS · LEASE STALE", fog: true },
    indicator: { state: "fresh", ageS: WORLD.bindings.train.age, label: "fresh · " + WORLD.bindings.train.age + " s" },
    worldConnection: { label: "Kvarm stale · 2 missed polls", src: "world.mjs reads kv=stale as a stale connection, not a stale lease" },
    agents: { "claude-payouts": { state: "stopped", activity: "stopped · " + KVARM.orders.stale.code, lease: null } },
    clashes: ["c1", "c2", "c3"], staleAfter: KVARM.staleAfter, src: "orders.mjs ordersExpire" },
};
for (const k of Object.values(KV)) { k.ledger = kvRows[k.id]; k.egress = egressAt(0, k.ledger); k.binding = bind("kv:" + k.id, "Kvarm scenario " + k.id, k.order.flag, k.src || "orders.mjs ordersFlag", "authenticated"); }
bind("kvarm:indicator", "Kvarm connection", "fresh · " + WORLD.bindings.train.age + " s", "world-data bindings.train", "authenticated");

// ---------- the busy moment ----------
export const MOMENT = {
  at: AT.moment, clock: clockOf(AT.moment), plant: "acquit", sheet: SHEET.label,
  machines, belts, wall: ACQUIT.wall,
  territories: [
    { id: "radar-otel", owner: "Droid", session: "droid-radar", state: TERRITORIES["radar-otel"].state, entities: TERRITORIES["radar-otel"].entities, label: "RADAR-OTEL · VERIFYING" },
    { id: "gate-sessions", owner: null, state: "stale", entities: TERRITORIES["gate-sessions"].entities, label: "GATE-SESSIONS · STALE", why: TERRITORIES["gate-sessions"].stale },
    { id: ORDER.territory, owner: "Claude Code", session: "claude-payouts", state: "claimed", entities: TERRITORIES[ORDER.territory].entities, label: "PAYPAL-PAYOUTS · CLAIMED · Claude Code", depends: TERRITORIES[ORDER.territory].depends },
  ].map((t) => ({ ...t, binding: bind("territory:" + t.id, "Territory " + t.id, t.label, "acquit.mjs TERRITORIES, orders.mjs ordersGrant") })),
  ghosts: Object.fromEntries(Object.entries(GHOSTS).map(([id, gh]) => [id, { stage: gh.stage, by: gh.by, agent: gh.agent || gh.by, binding: bind("ghost:" + id, "Ghost " + id, gh.stage, "acquit.mjs GHOSTS " + id, "declared") }])),
  ci: { ...CI.runs.at(-1), crane: CI.crane, session: CI.session, binding: bind("ci:" + CI.runs.at(-1).n, "CI #" + CI.runs.at(-1).n, CI.runs.at(-1).what, "acquit.mjs CI", "observed") },
  agents: momentAgents, lease, order, witnesses, question, declarations, clashes, blast,
  status: "2 clashes before code",
  queue: momentQueue,
  ledger: ledgerAt(AT.moment), egress: egressAt(AT.moment),
  kvarm: { indicator: KV.ok.indicator, origin: KVARM.origin, binding: "kvarm:indicator" },
  bench: { id: BENCH.id, zone: BENCH.zone, state: "not funded until 16:36" },
};

// ---------- away, 17:00 to 17:30 (JOURNEY section 5 Away fixture) ----------
const radarGate = find(GATE.items, "seal");
const AWAY_ITEMS = [
  { id: "breaker", at: "17:14", cls: "harm", row: "Breaker declared via paypal.result v1 · hold advised", full: "Droid declared the breaker through paypal.result v1. Your hold is still advised.", plant: "acquit", machine: "breaker", session: "droid-radar", change: "declared", src: "JOURNEY section 5" },
  { id: "codex", at: null, cls: "idle", row: "Codex waiting " + waitedMin(AT.back) + " min · own prompt", full: null, plant: "acquit", machine: "bot-cx", session: "codex-paypal", change: "still waiting", codexAskedAt: codexAsked, codexWaitedMin: waitedMin(AT.back), src: "JOURNEY section 5, gate-data codex" },
  { id: "ci-418", at: "17:06", cls: radarGate.cls, row: "CI #418 passed 5/5 · seal radar-otel ready", full: "CI #418 passed 5 of 5. Seal radar-otel is ready for your review.", plant: "acquit", machine: "radar", session: "droid-radar", change: "passed", forecast: "17:00 to 17:20", src: "JOURNEY section 5" },
  { id: "review-184", at: "16:58", cls: "publish", row: "#184 approved · publication not confirmed", full: null, plant: "acquit", machine: ORDER.on, session: "claude-payouts", change: "approved", copy: "derived from the JOURNEY rule to say approved until publication is confirmed", src: "JOURNEY section 5, beat 13" },
  { id: "artifact", at: "17:22", cls: null, row: WORLD.arrival.title, full: WORLD.arrival.why + ".", plant: WORLD.arrival.plant, machine: WORLD.arrival.entity, session: null, change: "arrived", local: true, src: "world-data arrival" },
].sort((a, b) => (a.cls ? CLASS_ORDER.indexOf(a.cls) : 99) - (b.cls ? CLASS_ORDER.indexOf(b.cls) : 99))
  .map((i) => ({ ...i, binding: bind("away:" + i.id, "Away item " + i.id, i.row, i.src) }));
const group = (key) => AWAY_ITEMS.reduce((m, i) => { if (i[key]) (m[i[key]] = m[i[key]] || []).push(i.id); return m; }, {});
export const AWAY = {
  from: clockOf(AT.away), to: clockOf(AT.back), backAt: GATE.backAt, title: "While you were away · 17:00 to 17:30",
  departure: {
    clock: clockOf(AT.away), order: { ...order, rev: "r3" },
    clashes: { c1: { settled: "split", via: "bench", push: KVARM.clash.settle.c1.split.push }, c2: { settled: "serialize", sync: "synced" } },
    breaker: "hold advised", bench: { recorded: "a3", attempt: find(ATTEMPTS, "a3").label }, review184: "approved",
    queue: queueAt(AT.away), ledger: ledgerAt(AT.away), egress: egressAt(AT.away), agents: agentsAt(AT.away),
  },
  items: AWAY_ITEMS, byMachine: group("machine"), bySession: group("session"), byPlant: group("plant"),
  onReturn: { queue: queueAt(AT.back), ledger: ledgerAt(AT.back), egress: egressAt(AT.back), agents: agentsAt(AT.back), unsizedOps: ["reviewChange", "readUpdates", "readSnapshot"] },
  binding: bind("away:brief", "Return brief", "While you were away · 17:00 to 17:30", "JOURNEY beat 15, section 5 Away fixture"),
};

// ---------- frames F1 to F8 ----------
const shell = (atMs, kv = "ok") => ({ clock: clockOf(atMs), waiting: queueAt(atMs).count, egress: kv === "ok" ? egressAt(atMs) : KV[kv].egress, indicator: KV[kv].indicator.label, flag: KV[kv].order.flag });
const frame = (id, stop, extra = {}) => { const at = extra.at ?? AT.moment, kv = extra.kv || "ok"; return { id, stop, at, clock: clockOf(at), kv, card: null, hover: null, alt: false, ...extra, shell: shell(at, kv) }; };
export const FRAMES = [
  frame("F1", "org", { proves: "Agents visible per plant, waiting count, no machine labels" }),
  ...[1, 2, 3, 4, 5].map((i) => frame("F2-" + i, "sweep-" + i, { proves: "Same scene objects at every stop, no DOM swap, no label flicker" })),
  frame("F3", "plant", { proves: "Waiting agent, two working agents, c1 readable with no selection" }),
  frame("F4", "plant", { hover: "decl:d3", proves: "Blast radius on downstream belts only" }),
  frame("F5", "plant", { card: "clash:c1", proves: "Card weight, at most six rows at rest, camera unchanged from F3" }),
  frame("F6", "plant", { at: AT.back, card: "away", proves: "What changed while away, from the map; card lists only what the map cannot" }),
  frame("F7-unmatched", "plant", { kv: "unmatched", proves: "Unmatched lease distinguishable, indicator wording" }),
  frame("F7-stale", "plant", { kv: "stale", proves: "Stale lease distinguishable, indicator wording" }),
  frame("F8", "plant", { alt: true, proves: "Alt held on F3: every mark shows its words in place, nothing moves" }),
];

export const DIRECTION = {
  t0: clockOf(0), at: AT, sessions: SESSIONS, plants: PLANTS, scenes, contracts: CONTRACTS, stub20: stubPlants(20), siteGap: SITE_GAP, planeScale: PLANE_SCALE,
  moment: MOMENT, events: EVENTS, kv: KV, away: AWAY, camera: CAMERA, levels: LEVELS, frames: FRAMES, bindings: BINDINGS,
};
// Pure helpers the page needs, inlined into each stub's script by source.
export const HELPERS = [freeRect, cameraFor, levelFor, ledgerTotal].map((f) => f.toString()).join("\n");
