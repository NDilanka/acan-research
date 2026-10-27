// Page-side drawing for direction B, Living cartographic (direction/memo-gemini.md Directions 1 and 3).
// Every function here is inlined into the page by source (dir-base.mjs), so it may use only its arguments, browser
// globals, the page helpers (freeRect, cameraFor, levelFor, clock, T0, conceptActive) and the other functions in LIB.
//
// The plane is drawn in screen space each frame from ctx.project, so strokes and labels keep a fixed screen size while
// the camera zooms continuously. Nodes are keyed (bEl), so a plant, a machine or a label stays the same element across
// zoom levels and frame jumps; document order follows draw order, which keeps the F8 mark comparison stable.

export function bState() {
  return bState.s || (bState.s = { gen: 0, touched: [], ctx: null, fx: [], frame: null, perf: false, preview: null, blocker: -1, replayTo: null, drag: null, fly: 0 });
}

export function bEl(parent, key, tag, attrs, html) {
  const B = bState();
  if (parent.__pg !== B.gen) { parent.__pg = B.gen; parent.__i = 0; if (!parent.__k) parent.__k = new Map(); B.touched.push(parent); }
  let n = parent.__k.get(key);
  if (!n || n.localName !== tag) {
    if (n) n.remove();
    n = /^(svg|g|path|circle|rect|line|ellipse)$/.test(tag) ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag);
    n.__a = {};
    parent.__k.set(key, n);
  }
  const at = parent.children[parent.__i];
  if (at !== n) parent.insertBefore(n, at || null);
  parent.__i++;
  n.__seen = B.gen;
  if (n.__k && n.__pg !== B.gen) { n.__pg = B.gen; n.__i = 0; B.touched.push(n); }
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (n.__a[k] === v) continue;
    n.__a[k] = v;
    if (v === null || v === undefined || v === false) n.removeAttribute(k); else n.setAttribute(k, v);
  }
  if (html !== undefined && n.__h !== html) { n.__h = html; n.innerHTML = html; n.__sz = null; }
  return n;
}

export function bSweep() {
  const B = bState();
  for (const p of B.touched) for (const [k, n] of p.__k) if (n.__seen !== B.gen) { n.remove(); p.__k.delete(k); }
  B.touched = [];
}

export function bR(v) { return Math.round(v * 10) / 10; }
export function bEsc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]); }
export function bPath(pts) { return pts.map((p, i) => (i ? "L" : "M") + bR(p[0]) + "," + bR(p[1])).join(""); }

// Half extents and height in plant units per machine kind. Belt ends in acquit.mjs sit about this far from each centre.
export function bFoot(kind, size) {
  const T = { intake: [18, 18, 10], gate: [20, 20, 14], assembler: [38, 32, 20], clock: [17, 17, 8], bank: [24, 22, 14], tank: [22, 22, 18], kiln: [30, 22, 14],
    dock: [22, 22, 16], radar: [18, 18, 10], retry: [12, 12, 8], breaker: [12, 12, 8], valve: [9, 9, 5], buffer: [26, 18, 10], hopper: [22, 20, 16], crate: [20, 20, 12], splitter: [18, 18, 10] };
  const f = T[kind] || [20, 20, 12], s = size || 1;
  return [f[0] * s, f[1] * s, f[2] * s];
}

// Offsets an orthogonal or straight polyline by d screen px to its left.
export function bOffset(pts, d) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[i], c = pts[Math.min(pts.length - 1, i + 1)];
    const n1 = i ? bNorm(a, b) : bNorm(b, c), n2 = i < pts.length - 1 ? bNorm(b, c) : n1;
    let nx = n1[0] + n2[0], ny = n1[1] + n2[1];
    const l = Math.hypot(nx, ny) || 1, dot = (nx / l) * n1[0] + (ny / l) * n1[1] || 1;
    out.push([b[0] + (nx / l) * d / dot, b[1] + (ny / l) * d / dot]);
  }
  return out;
}
export function bNorm(a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; }

// Keeps the part of a polyline (plant units) whose x lies in [lo, hi]; belts in the fixture run left to right.
export function bClipX(pts, lo, hi) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    const t0 = ax === bx ? (ax >= lo && ax <= hi ? 0 : 1) : Math.max(0, Math.min(1, (Math.max(lo, Math.min(ax, bx)) - ax) / (bx - ax)));
    const t1 = ax === bx ? (ax >= lo && ax <= hi ? 1 : 0) : Math.max(0, Math.min(1, (Math.min(hi, Math.max(ax, bx)) - ax) / (bx - ax)));
    if (t1 <= t0 && ax !== bx) continue;
    if (ax === bx && t1 === 0) continue;
    const p = [ax + (bx - ax) * t0, ay + (by - ay) * t0], q = [ax + (bx - ax) * t1, ay + (by - ay) * t1];
    if (!out.length || Math.hypot(out[out.length - 1][0] - p[0], out[out.length - 1][1] - p[1]) > 0.01) out.push(p);
    out.push(q);
  }
  return out;
}

export function bChevrons(pts, step, size) {
  let d = "", carry = step / 2;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1], len = Math.hypot(bx - ax, by - ay);
    if (!len) continue;
    const ux = (bx - ax) / len, uy = (by - ay) / len;
    for (let s = carry; s < len - 2; s += step) {
      const x = ax + ux * s, y = ay + uy * s;
      d += "M" + bR(x - ux * size - uy * size) + "," + bR(y - uy * size + ux * size) + "L" + bR(x + ux * size * 0.6) + "," + bR(y + uy * size * 0.6) + "L" + bR(x - ux * size + uy * size) + "," + bR(y - uy * size - ux * size);
      carry = s + step - len;
    }
    if (carry < 0) carry = step / 2;
  }
  return d;
}

// Derived state for the clock, the kv scenario and the fixture. Nothing here is invented: every value comes from D.
export function bModel(ctx) {
  const { D, S } = ctx, at = S.at, kv = D.kv[S.kv];
  const msOf = (c) => { const [h, m, s = 0] = c.split(":").map(Number); return (h * 3600 + m * 60 + s - T0) * 1000; };
  const past = new Set(D.events.filter((e) => e.at <= at).map((e) => e.id));
  const settled = { c1: past.has("bench-record"), c2: past.has("settle-c2") };
  const clashes = past.has("declarations") ? D.moment.clashes.filter((c) => kv.clashes.includes(c.id) && !settled[c.id]) : [];
  const agents = (at >= D.at.back ? D.away.onReturn.agents : D.moment.agents).map((a) => {
    const o = { ...a, ...(kv.agents[a.session] || {}) };
    if (o.askedAt && o.waitsOn) o.waitedMin = Math.max(0, Math.floor((at - msOf(o.askedAt)) / 60000));
    return o;
  });
  const ids = [];
  for (const e of D.events) if (e.at <= at) { for (const a of e.queue.add || []) ids.push(a); for (const d of e.queue.drop || []) ids.splice(ids.indexOf(d), 1); }
  const known = new Map([...D.moment.queue.rows, ...D.away.departure.queue.rows, ...D.away.onReturn.queue.rows].map((r) => [r.id, r]));
  const order = [...known.keys()];
  const queue = ids.map((id) => known.get(id) || { id, title: D.bindings["queue:" + id].value, binding: "queue:" + id,
    on: id === D.moment.question.ref ? D.moment.question.entity : (D.away.items.find((i) => i.id === id) || {}).machine })
    .sort((a, b) => (order.indexOf(a.id) + 1 || 99) - (order.indexOf(b.id) + 1 || 99));
  const claimed = S.kv !== "ok" || past.has("claim");
  const changes = at > D.at.away ? D.away.items.filter((i) => i.at && msOf(i.at) > D.at.away && msOf(i.at) <= at) : [];
  const ciMatch = /(\d+) of (\d+)/.exec(D.moment.ci.what) || [0, 0, 5];
  const ci = past.has("ci-418") ? [+ciMatch[2], +ciMatch[2]] : [+ciMatch[1], +ciMatch[2]];
  const waitBy = {};
  for (const r of queue) { const p = r.plant || "acquit"; waitBy[p] = (waitBy[p] || 0) + 1; }
  return { at, kvId: S.kv, kv, past, clashes, agents, queue, claimed, changes, ci, waitBy,
    flag: claimed ? kv.order.flag : null, flagBinding: S.kv === "ok" ? D.moment.order.binding : kv.binding,
    second: S.kv === "ok" ? (claimed ? D.moment.order.readback : null) : kv.holderRow,
    labels: [], mpos: {}, belts: {}, plantBox: {}, blockers: [] };
}

export function bHue(session) { return session === "claude-payouts" || session === "claude-port" ? "cc" : session === "codex-paypal" ? "cx" : "dr"; }
export function bCap(agent) { return agent === "Claude Code" ? "CC" : agent === "Codex" ? "CX" : "DR"; }

export function bAgentChip(a, M) {
  if (a.session === "codex-paypal") return M.kvId === "unmatched" ? M.kv.holderRow : "Codex · waits on you · " + a.waitedMin + "m";
  if (a.session === "claude-payouts") return M.kvId === "unmatched" ? "Claude Code · authenticated · Kvarm rejected" : M.kvId === "stale" ? "Claude Code · authenticated · stopped" : "Claude Code · " + a.evidence;
  return a.agent + " · " + a.evidence + (a.state === "yields" ? " · yields" : "");
}

// One plant site: plinth, territories, belts, machines, declarations, and the label specs placed later by bPlace.
export function bPlant(ctx, M, p, stub) {
  const { D, S, plane, project } = ctx, ppu = S.camera.ppu, W = innerWidth, H = innerHeight;
  const of = p.of || p.id, acq = of === "acquit", live = acq && !stub;
  const [x0, y0] = project(p.rect[0], p.rect[1]), [x1, y1] = project(p.rect[2], p.rect[3]), w = x1 - x0, h = y1 - y0;
  const on = x1 > -60 && x0 < W + 60 && y1 > -80 && y0 < H + 60;
  const site = bEl(plane, (stub ? "S:" : "P:") + p.id, "div", { class: "dir-b-site", "data-plant": stub ? null : p.id, "data-stub": stub ? p.id : null, "data-binding": "plant:" + of,
    style: on ? "left:" + bR(x0) + "px;top:" + bR(y0) + "px;width:" + bR(w) + "px;height:" + bR(h) + "px" : "display:none" });
  M.plantBox[p.id] = [x0, y0, x1, y1];
  // Blockers register before the off-screen cull, so an off-screen plant still raises its edge beacon.
  if (!stub && !live) {
    const row = M.queue.find((r) => r.plant === of), art = M.changes.find((c) => c.plant === of);
    if (row || art) M.blockers.push({ id: "plant:" + of, label: p.name, x: (p.rect[0] + p.rect[2]) / 2, y: (p.rect[1] + p.rect[3]) / 2, plant: of, binding: row ? row.binding : art.binding, tone: row ? "wait" : "", count: row ? M.waitBy[of] : 0, at: art ? art.at : null });
  }
  if (live && !on) {
    for (const c of M.clashes) { const m = D.moment.machines.find((x) => x.id === c.at.entity); if (m) M.blockers.push({ id: c.id, label: c.id, x: p.origin[0] + m.x, y: p.origin[1] + m.y, plant: of, mono: true, binding: c.binding }); }
    for (const a of M.agents) if (a.waitsOn) M.blockers.push({ id: a.session, label: a.agent, x: p.origin[0] + a.x, y: p.origin[1] + a.y, plant: of, binding: a.binding, tone: "wait" });
  }
  if (!on) return;
  const lv = live ? S.level : w < 160 ? "org" : w < 560 ? "site" : w < 2200 ? "plant" : "machine";
  const fine = lv === "plant" || lv === "machine";
  const E = (lx, ly) => { const q = project(p.origin[0] + lx, p.origin[1] + ly); return [q[0] - x0, q[1] - y0]; };
  const V = (pt) => [pt[0] + x0, pt[1] + y0];
  const away = live && S.card === "away";
  const changed = new Set(M.changes.filter((c) => c.plant === of).map((c) => c.machine));
  const hover = live && S.hover === "decl:" + D.moment.blast.decl;
  const blast = new Set(hover ? D.moment.blast.downstream.concat(D.moment.blast.on) : []);
  // The SVG covers only the part of the site near the viewport, so a deep zoom never rasterises a site thousands of px wide.
  const vx0 = Math.max(-30, -x0 - 40), vy0 = Math.max(-30, -y0 - 40), vw = Math.max(1, Math.min(w + 30, W - x0 + 40) - vx0), vh = Math.max(1, Math.min(h + 30, H - y0 + 40) - vy0);
  const svg = bEl(site, "geo", "svg", { class: "dir-b-geo", width: bR(vw), height: bR(vh), viewBox: bR(vx0) + " " + bR(vy0) + " " + bR(vw) + " " + bR(vh), style: "left:" + bR(vx0) + "px;top:" + bR(vy0) + "px" });
  const t = Math.max(2, Math.min(7, ppu * 4));
  bEl(svg, "pf", "rect", { class: "b-plinth-f", x: 0, y: bR(h - 6), width: bR(w), height: bR(t + 6), rx: 5 });
  bEl(svg, "pt", "rect", { class: "b-plinth", x: 0, y: 0, width: bR(w), height: bR(h), rx: 5 });

  const ents = acq ? D.moment.machines : D.scenes[of].entities.map((e) => ({ id: e.id, kind: e.kind, name: e.id, x: e.x, y: e.y, size: 1, state: "ok", reading: null }));
  const belts = acq ? D.moment.belts : D.scenes[of].belts.map((b) => ({ id: b.from + "->" + b.to, pts: b.pts }));
  const box = {};
  for (const m of ents) {
    const [hx, hy, hz] = bFoot(m.kind, m.size), [ax, ay] = E(m.x - hx, m.y - hy), [bx, by] = E(m.x + hx, m.y + hy);
    const e = lv === "org" ? 0 : lv === "site" ? Math.max(1, Math.min(5, hz * ppu * 0.45)) : Math.max(2, Math.min(36, hz * ppu * 0.6));
    box[m.id] = { ax, ay, bx, by, e, cx: (ax + bx) / 2, cy: (ay + by) / 2, top: ay - e, m };
    if (live) M.mpos[m.id] = { x: x0 + (ax + bx) / 2, y: y0 + ay - e, r: [x0 + ax, y0 + ay - e, x0 + bx, y0 + by] };
  }
  const geo = bEl(svg, "g", "g", { class: "b-plant" + (hover ? " is-hover" : "") });

  // Territories: claimed zones in the claimant's hue, verifying zones dashed, stale or unmatched zones under fog hatch.
  const terr = bEl(geo, "terr", "g", {});
  let claimBox = null;
  if (live && lv !== "org") for (const tz of D.moment.territories) {
    const mem = tz.entities.map((id) => box[id]).filter(Boolean);
    if (!mem.length) continue;
    const pad = Math.max(6, 12 * ppu);
    const r = [Math.min(...mem.map((b) => b.ax)) - pad, Math.min(...mem.map((b) => b.top)) - pad, Math.max(...mem.map((b) => b.bx)) + pad, Math.max(...mem.map((b) => b.by)) + pad];
    const own = tz.id === M.kv.territory.id;
    const state = own ? (M.kv.territory.fog ? "fog" : M.claimed ? "claimed" : "open") : tz.state === "stale" ? "fog" : tz.state === "verifying" ? "verifying" : "open";
    bEl(terr, tz.id, "rect", { class: "b-terr " + state + " " + bHue(tz.session), "data-binding": tz.binding, x: bR(r[0]), y: bR(r[1]), width: bR(r[2] - r[0]), height: bR(r[3] - r[1]), rx: 6 });
    if (own) claimBox = r;
    if (S.alt) M.labels.push({ key: "terr:" + tz.id, b: tz.binding, html: bEsc(own ? M.kv.territory.label : tz.label), ax: x0 + r[0], ay: y0 + r[3], at: ["bl", "tl"], g: 4, pri: 20, alt: true, cls: "b-small" });
  }

  // Belts: a track with direction chevrons. The over-budget belt carries red chevrons; ghost belts are dashed.
  const bg = bEl(geo, "belts", "g", {});
  if (lv !== "org") for (const b of belts) {
    const pts = b.pts.map((q) => E(q[0], q[1]));
    if (live) M.belts[b.id] = pts.map(V);
    const tone = stub ? "" : b.tone === "red" ? " red" : "";
    const g = bEl(bg, b.id, "g", { "data-binding": b.binding || null, class: "b-beltg" + (hover && b.id === D.moment.blast.belt ? "" : hover ? " dim" : "") });
    bEl(g, "t", "path", { class: "b-belt" + tone + (b.ghost ? " ghost" : "") + (fine ? "" : " thin"), d: bPath(pts) });
    if (fine && !b.ghost && !bState().moving) bEl(g, "c", "path", { class: "b-chev" + tone, d: bChevrons(pts, 30, 3) });
  }
  if (live && fine) {
    const wl = D.moment.wall, segs = [];
    let ys = wl.y0;
    for (const [g0, g1] of wl.gaps.slice().sort((a, b) => a[0] - b[0])) { segs.push([ys, g0]); ys = g1; }
    segs.push([ys, wl.y1]);
    bEl(geo, "wall", "path", { class: "b-wall", "data-binding": "plant:acquit", d: segs.map(([a, c]) => bPath([E(wl.x, a), E(wl.x, c)])).join("") });
    if (S.alt) M.labels.push({ key: "wall", b: "plant:acquit", html: bEsc(wl.text), ax: x0 + E(wl.x, wl.y0)[0], ay: y0 + E(wl.x, wl.y0)[1], at: ["t", "r"], g: 4, pri: 10, alt: true, cls: "b-small" });
  }

  // Declarations: each agent's footprint on the api to paypal belt as a trail in its hue, so c1 shows before selection.
  const decl = bEl(geo, "decl", "g", {});
  const c1 = M.clashes.find((c) => c.id === "c1"), c2 = M.clashes.find((c) => c.id === "c2"), c3 = M.clashes.find((c) => c.id === "c3");
  const pv = live && S.card === "clash:c1" ? bState().shown : null;
  if (live && lv !== "org" && c1) {
    const belt = D.moment.belts.find((b) => b.id === c1.at.belt), brk = D.moment.machines.find((m) => m.id === c1.at.entity);
    const retry = D.moment.machines.find((m) => m.id === "retry");
    const port = (brk.x + retry.x) / 2;
    const d1 = pv === "split" ? bClipX(belt.pts, port, 1e9) : pv === "right" ? bClipX(belt.pts, -1e9, brk.x) : belt.pts;
    const d3 = pv === "split" ? bClipX(belt.pts, -1e9, port) : pv === "left" ? [] : belt.pts;
    const off = Math.max(3, Math.min(7, ppu * 3));
    if (d1.length > 1) bEl(decl, "d1", "path", { class: "b-trail cc" + (pv ? " pv" : ""), "data-binding": "decl:d1", d: bPath(bOffset(d1.map((q) => E(q[0], q[1])), off)) });
    if (d3.length > 1) {
      const sp = bOffset(d3.map((q) => E(q[0], q[1])), -off);
      bEl(decl, "d3", "path", { class: "b-trail dr" + (pv ? " pv" : ""), "data-binding": "decl:d3", d: bPath(sp) });
      bEl(decl, "d3hit", "path", { class: "b-hit", "data-binding": "decl:d3", "data-hover": "decl:d3", d: bPath(sp) });
    }
    if (pv === "split") { const [px, py] = E(port, belt.pts[0][1]); bEl(decl, "port", "rect", { class: "b-port", "data-binding": "clash:c1", "data-preview": "split", x: bR(px - 5), y: bR(py - 5), width: 10, height: 10 }); }
    if (pv === "left" || pv === "right") { const bb = box[pv === "left" ? brk.id : "retry"]; bEl(decl, "x", "path", { class: "b-x", "data-binding": "clash:c1", "data-preview": pv, d: bPath([[bb.ax - 3, bb.top - 3], [bb.bx + 3, bb.by + 3]]) + bPath([[bb.bx + 3, bb.top - 3], [bb.ax - 3, bb.by + 3]]) }); }
    if (pv === "serialize") for (const [k, x] of [["d1", -40], ["d3", 60]]) { const [sx, sy] = E(x, belt.pts[0][1]); M.labels.push({ key: "ser:" + k, b: "clash:c1", html: '<span class="mono">' + (k === "d1" ? "1" : "2") + "</span>", ax: x0 + sx, ay: y0 + sy + (k === "d1" ? -off : off), at: [k === "d1" ? "t" : "b"], g: 6, pri: 95, force: true, cls: "b-order " + (k === "d1" ? "cc" : "dr") }); }
  }

  // Machines back to front, so nearer solids overlap farther ones.
  const mg = bEl(geo, "machines", "g", {});
  for (const m of ents.slice().sort((a, b) => a.y - b.y)) {
    if (m.kind === "crane") continue;
    const B = box[m.id], { ax, ay, bx, by, e, cx } = B;
    const ghost = !stub && m.state === "ghost";
    const dim = (hover && !blast.has(m.id)) || (away && !changed.has(m.id) && !(m.id === "radar" && changed.has("radar")));
    const cls = "b-m k-" + m.kind + (ghost ? " ghost" : "") + (!stub && m.state === "fail" ? " fail" : "") + (m.id === D.moment.blast.on && ghost ? " dr" : "") + (dim ? " dim" : "") + (changed.has(m.id) ? " changed" : "");
    const g = bEl(mg, "m:" + m.id, "g", { class: cls, "data-binding": acq ? m.binding : null, "data-hover": live && m.id === D.moment.blast.on ? "decl:" + D.moment.blast.decl : null });
    if (lv === "org") { bEl(g, "dot", "rect", { class: "b-dot", x: bR(ax), y: bR(ay), width: bR(Math.max(2.5, bx - ax)), height: bR(Math.max(2.5, by - ay)) }); continue; }
    const round = m.kind === "tank" || m.kind === "clock" || m.kind === "retry" || m.kind === "radar";
    if (round) {
      const r = (bx - ax) / 2, ry = (by - ay) / 2, cy = (ay + by) / 2;
      bEl(g, "f", "path", { class: "b-front", d: "M" + bR(cx - r) + "," + bR(cy - e) + "V" + bR(cy) + "A" + bR(r) + "," + bR(ry) + " 0 0 0 " + bR(cx + r) + "," + bR(cy) + "V" + bR(cy - e) + "Z" });
      bEl(g, "t", "ellipse", { class: "b-top", cx: bR(cx), cy: bR(cy - e), rx: bR(r), ry: bR(ry) });
    } else {
      bEl(g, "f", "path", { class: "b-front", d: "M" + bR(ax) + "," + bR(by - e) + "H" + bR(bx) + "V" + bR(by) + "H" + bR(ax) + "Z" });
      bEl(g, "t", "path", { class: "b-top", d: "M" + bR(ax) + "," + bR(ay - e) + "H" + bR(bx) + "V" + bR(by - e) + "H" + bR(ax) + "Z" });
    }
    if (!fine) continue;
    const kind = bState().moving ? "" : m.kind;
    const tx0 = ax, ty0 = ay - e, tx1 = bx, ty1 = by - e, tw = tx1 - tx0, th = ty1 - ty0, tcy = (ty0 + ty1) / 2;
    let detail = "";
    if (kind === "assembler") detail = bPath([[tx0 + 5, ty0 + th / 3], [tx1 - 5, ty0 + th / 3]]) + bPath([[tx0 + 5, ty0 + (2 * th) / 3], [tx1 - 5, ty0 + (2 * th) / 3]]);
    if (kind === "gate") detail = bPath([[cx, ty0 + 3], [cx, ty1 - 3]]);
    if (kind === "clock") detail = bPath([[cx, tcy], [cx + tw * 0.28, tcy - th * 0.2]]);
    if (kind === "tank") bEl(g, "lid", "ellipse", { class: "b-detail", cx: bR(cx), cy: bR(tcy), rx: bR(tw * 0.3), ry: bR(th * 0.3) });
    if (kind === "intake" || kind === "hopper") bEl(g, "mouth", "path", { class: "b-mouth", d: "M" + bR(tx0 + tw * 0.25) + "," + bR(ty0 + th * 0.25) + "H" + bR(tx1 - tw * 0.25) + "V" + bR(ty1 - th * 0.25) + "H" + bR(tx0 + tw * 0.25) + "Z" });
    if (kind === "dock") bEl(g, "door", "path", { class: "b-door", d: "M" + bR(cx - tw * 0.2) + "," + bR(by) + "V" + bR(by - e * 0.7) + "H" + bR(cx + tw * 0.2) + "V" + bR(by) + "Z" });
    if (kind === "kiln") { const r = Math.min(6, tw * 0.12), kx = tx1 - r - 4, ky = ty0 + r + 3; bEl(g, "stack", "path", { class: "b-front", d: "M" + bR(kx - r) + "," + bR(ky - 8) + "V" + bR(ky) + "H" + bR(kx + r) + "V" + bR(ky - 8) + "Z" }); bEl(g, "stackt", "ellipse", { class: "b-top", cx: bR(kx), cy: bR(ky - 8), rx: bR(r), ry: bR(r * 0.8) }); }
    if (kind === "valve") detail = "M" + bR(tx0 + 2) + "," + bR(ty0 + 2) + "L" + bR(tx1 - 2) + "," + bR(ty1 - 2) + "V" + bR(ty0 + 2) + "L" + bR(tx0 + 2) + "," + bR(ty1 - 2) + "Z";
    if (kind === "breaker") detail = bPath([[tx0 + 3, ty1 - 3], [tx1 - 3, ty0 + 3]]);
    if (detail) bEl(g, "d", "path", { class: "b-detail", d: detail });
    if (!live) continue;
    // Roof micro-gauges, only where the fixture gives a ratio: paypal errors against the order budget, retry loop depth,
    // the verifier's busy and queued slots.
    if (m.id === D.moment.order.on && m.state === "fail") {
      const v = parseFloat(m.reading), bud = parseFloat((/([\d.]+)%/.exec(D.moment.order.budget) || [0, 0])[1]), max = Math.max(v, bud) * 1.25;
      const gx = tx0 + 5, gw = tw - 10, gy = ty1 - 8;
      bEl(g, "gt", "rect", { class: "b-track", x: bR(gx), y: bR(gy), width: bR(gw), height: 4, rx: 1 });
      bEl(g, "gv", "rect", { class: "b-failf", x: bR(gx), y: bR(gy), width: bR((gw * v) / max), height: 4, rx: 1 });
      bEl(g, "gb", "path", { class: "b-budget", d: bPath([[gx + (gw * bud) / max, gy - 3], [gx + (gw * bud) / max, gy + 7]]) });
      M.labels.push({ key: "val:" + m.id, b: m.binding, html: bEsc((/^[\d.]+%/.exec(m.reading) || [m.reading])[0]), ax: x0 + cx, ay: y0 + by + 3, at: ["b", "r", "l"], g: 2, pri: 60, cls: "b-val fail" });
    }
    if (kind === "retry") {
      const lm = /(\d+)\/(\d+)/.exec(m.reading) || [0, 0, 3], n = +lm[2], lit = +lm[1];
      for (let i = 0; i < n; i++) bEl(g, "ring" + i, "ellipse", { class: "b-coil" + (i < lit ? " lit" : ""), cx: bR(cx), cy: bR(tcy), rx: bR((tw / 2) * (0.3 + (0.6 * i) / Math.max(1, n - 1))), ry: bR((th / 2) * (0.3 + (0.6 * i) / Math.max(1, n - 1))) });
    }
    if (kind === "bank") {
      const qm = /(\d+) busy · (\d+) queued/.exec(m.reading);
      if (qm) { const busy = +qm[1], all = busy + +qm[2], cols = Math.ceil(all / 2), cw = (tw - 8) / cols, ch = (th - 8) / 2;
        for (let i = 0; i < all; i++) bEl(g, "q" + i, "rect", { class: "b-cell" + (i < busy ? " on" : ""), x: bR(tx0 + 4 + (i % cols) * cw + 1), y: bR(ty0 + 4 + Math.floor(i / cols) * ch + 1), width: bR(Math.max(1, cw - 2)), height: bR(Math.max(1, ch - 2)) }); }
    }
    if (tw >= 24) M.labels.push({ key: "stamp:" + m.id, b: m.binding, html: '<span class="mono">' + bEsc(m.id) + "</span>", ax: x0 + cx, ay: y0 + tcy, at: ["c", "b2"], g: 0, pri: 50, cls: "b-stamp", box: [x0 + tx0, y0 + ty0, x0 + tx1, y0 + by] });
    if (S.alt) M.labels.push({ key: "name:" + m.id, b: m.binding, html: bEsc(m.name) + (m.reading ? ' <span class="b-dim">' + bEsc(m.reading) + "</span>" : ""), ax: x0 + cx, ay: y0 + by + 2, at: ["b", "t2", "r", "l"], g: 2, pri: 30, alt: true, cls: "b-small" });
  }
  if (!live) {
    if (S.alt && fine) for (const m of ents) { const B = box[m.id]; M.labels.push({ key: "name:" + p.id + ":" + m.id, b: "plant:" + of, html: bEsc(m.name), ax: x0 + B.cx, ay: y0 + B.by + 2, at: ["b", "t"], g: 2, pri: 25, alt: true, cls: "b-small" }); }
  }

  if (live && fine) {
    // CI crane over the radar ghost, with one lamp per check (lit = passed so far).
    const cr = D.moment.machines.find((m) => m.kind === "crane"), rb = box[cr.id];
    const lx0 = rb.ax - 6, lx1 = rb.bx + 6, top = rb.top - Math.max(14, 22 * ppu * 0.6);
    const cg = bEl(geo, "crane", "g", { class: "b-crane" + (away && !changed.has("radar") ? " dim" : "") + (changed.has("radar") ? " changed" : ""), "data-binding": D.moment.ci.binding });
    bEl(cg, "legs", "path", { class: "b-gantry", d: bPath([[lx0, rb.by], [lx0, top]]) + bPath([[lx1, rb.by], [lx1, top]]) + bPath([[lx0 - 3, top], [lx1 + 3, top]]) });
    for (let i = 0; i < M.ci[1]; i++) bEl(cg, "lamp" + i, "circle", { class: "b-lamp" + (i < M.ci[0] ? " lit" : ""), cx: bR(lx0 + ((i + 1) * (lx1 - lx0)) / (M.ci[1] + 1)), cy: bR(top), r: 2.6 });
    if (S.alt) M.labels.push({ key: "ci", b: D.moment.ci.binding, html: "CI #" + D.moment.ci.n + " · " + bEsc(M.ci[0] + " of " + M.ci[1]), ax: x0 + (lx0 + lx1) / 2, ay: y0 + top - 4, at: ["t", "l"], g: 2, pri: 28, alt: true, cls: "b-small" });

    // Witness pins on the roofs they guard; a witness a live clash breaks gets a red ring and a tether to the clash.
    if (M.past.has("post")) for (const wt of D.moment.witnesses) {
      const mb = box[wt.entity]; if (!mb) continue;
      const px = mb.bx - 6, py = mb.top + 6, broken = c1 && c1.breaks === wt.id;
      const wg = bEl(geo, "w:" + wt.id, "g", { class: "b-pin " + wt.polarity + (broken ? " broken" : ""), "data-binding": wt.binding });
      if (broken) bEl(wg, "ring", "circle", { class: "b-broken", cx: bR(px), cy: bR(py), r: 7.5 });
      bEl(wg, "dot", "circle", { class: "b-pindot", cx: bR(px), cy: bR(py), r: 4 });
      if (wt.polarity === "must-not") bEl(wg, "slash", "path", { class: "b-slash", d: bPath([[px - 2.8, py + 2.8], [px + 2.8, py - 2.8]]) });
      M.labels.push({ key: "wid:" + wt.id, b: wt.binding, html: '<span class="mono">' + bEsc(wt.id) + "</span>", ax: x0 + px + 7, ay: y0 + py, at: ["r", "t"], g: 3, pri: 40, cls: "b-wid" });
      if (S.alt) M.labels.push({ key: "wchk:" + wt.id, b: wt.binding, html: bEsc(wt.polarity + " · " + wt.check), ax: x0 + px, ay: y0 + py - 8, at: ["t", "r", "l"], g: 2, pri: 26, alt: true, cls: "b-small" });
    }
    if (c1) {
      const wt = D.moment.witnesses.find((x) => x.id === c1.breaks), mb = box[wt.entity], bb = box[c1.at.entity];
      bEl(decl, "tether", "path", { class: "b-tether", "data-binding": c1.binding, d: bPath([[bb.cx, bb.top - 2], [mb.bx - 6, mb.top + 6]]) });
    }
    if (c2) { const sb = box[c2.at.entity], r = (sb.bx - sb.ax) / 2;
      bEl(decl, "c2a", "ellipse", { class: "b-ring cc", "data-binding": "decl:" + c2.decls[0], cx: bR(sb.cx), cy: bR(sb.top + (sb.by - sb.ay) / 2), rx: bR(r + 5), ry: bR((sb.by - sb.ay) / 2 + 5) });
      bEl(decl, "c2b", "ellipse", { class: "b-ring dr", "data-binding": "decl:" + c2.decls[1], cx: bR(sb.cx), cy: bR(sb.top + (sb.by - sb.ay) / 2), rx: bR(r + 9), ry: bR((sb.by - sb.ay) / 2 + 9) });
    }
    // Rows that wait on you and sit on a machine get an amber frame; clash rows draw as clash pins instead.
    for (const q of M.queue) {
      const mb = box[q.on]; if (!mb || q.id === "c1" || q.id === "c2") continue;
      bEl(geo, "q:" + q.id, "rect", { class: "b-waitf", "data-binding": q.binding, x: bR(mb.ax - 5), y: bR(mb.top - 5), width: bR(mb.bx - mb.ax + 10), height: bR(mb.by - mb.top + 10), rx: 5 });
    }
    // While away: a changed machine keeps full ink and gets its time stamp; the rest dim while the return card is open.
    for (const c of M.changes) {
      const mb = box[c.machine]; if (!mb) continue;
      const html = bEsc(c.at) + ' <span class="mono">' + bEsc(c.machine) + "</span> " + bEsc(c.id === "ci-418" ? "CI " + M.ci[0] + "/" + M.ci[1] : c.change);
      M.labels.push({ key: "chg:" + c.id, b: c.binding, html, ax: x0 + mb.cx, ay: y0 + mb.top - (c.machine === "radar" ? 26 : 8), at: ["t", "l", "r"], g: 4, pri: 78, cls: "b-tag" });
    }
  }

  // Clash pins: red diamonds where two declarations meet, kept at a fixed screen size at every level.
  if (live) {
    const cluster = lv === "org" || w < 360;
    const marks = [];
    for (const c of M.clashes) {
      const target = box[c.at.entity];
      const pos = cluster || !target ? null : [x0 + target.cx, y0 + target.top - 12];
      marks.push({ kind: "clash", c, pos });
      if (pos) M.blockers.push({ id: c.id, label: c.id, x: p.origin[0] + target.m.x, y: p.origin[1] + target.m.y, plant: of, mono: true, binding: c.binding });
    }
    for (const a of M.agents) {
      const pos = cluster ? null : V(E(a.x, a.y));
      marks.push({ kind: "agent", a, pos });
      if (a.waitsOn) M.blockers.push({ id: a.session, label: a.agent, x: p.origin[0] + a.x, y: p.origin[1] + a.y, plant: of, binding: a.binding, tone: "wait" });
    }
    let cx = x0 + 2;
    const cy = y0 - 22;
    for (const mk of marks) {
      let pos = mk.pos;
      if (!pos) { pos = [cx + 13, cy]; cx += mk.kind === "agent" ? 30 : 22; }
      if (mk.kind === "clash") {
        const c = mk.c;
        M.labels.push({ key: "clash:" + c.id, b: c.binding, html: "", ax: pos[0], ay: pos[1], at: ["c"], g: 0, pri: 100, force: true, cls: "b-diamond" + (c.severity === "blocking" ? "" : " adv"), click: "clash:" + c.id, mark: true });
        const who = c.decls.map((id) => D.moment.declarations.find((d) => d.id === id)).filter(Boolean).map((d) => '<b class="b-cap ' + bHue(d.session) + '">' + bCap(d.agent) + "</b>").join("×");
        if (!cluster) M.labels.push({ key: "cid:" + c.id, b: c.binding, html: '<span class="mono">' + c.id + (who ? " " + who : "") + "</span>", ax: pos[0] + 9, ay: pos[1], at: ["r", "l", "t"], g: 2, pri: 45, cls: "b-wid" + (c.severity === "blocking" ? " fail" : "") });
        if (S.alt && !cluster) M.labels.push({ key: "ctitle:" + c.id, b: c.binding, html: bEsc(c.title || c.id + " · " + c.severity) + (c.breaksRow ? " · " + bEsc(c.breaksRow) : ""), ax: pos[0], ay: pos[1] - 10, at: ["t", "r", "l"], g: 4, pri: 35, alt: true, cls: "b-small" });
        continue;
      }
      const a = mk.a, hue = bHue(a.session);
      const st = a.state === "waiting" && M.kvId === "unmatched" && a.session === "claude-payouts" ? "held" : a.state;
      const rogue = M.kvId === "unmatched" && a.session === M.kv.lease.holder;
      M.labels.push({ key: "drone:" + a.session, b: a.binding, html: '<span class="mono">' + bCap(a.agent) + "</span>", ax: pos[0], ay: pos[1], at: ["c"], g: 0, pri: 100, force: true, cls: "b-drone " + hue + " s-" + st + (a.waitsOn ? " waits" : "") + (rogue ? " rogue" : ""), mark: true });
      if (!cluster && !(away && !a.waitsOn)) {
        M.labels.push({ key: "chip:" + a.session, b: a.binding, html: bEsc(bAgentChip(a, M)), ax: pos[0], ay: pos[1], at: a.session === "droid-payouts" ? ["b", "r", "l", "t"] : ["r", "l", "t", "b"], g: 17, pri: a.waitsOn ? 88 : a.session === "claude-payouts" ? 86 : 70, cls: "b-chip " + hue + (a.waitsOn ? " wait" : "") });
        if (S.alt) M.labels.push({ key: "act:" + a.session, b: a.binding, html: bEsc(a.session + " · " + a.activity + (a.sinceMin ? " · " + a.sinceMin + "m" : "") + (a.prompt ? " · " + a.prompt : "")), ax: pos[0], ay: pos[1] + 16, at: ["b", "t", "r", "l"], g: 2, pri: 34, alt: true, cls: "b-small" });
      }
    }
    if (claimBox && M.flag && !cluster) {
      const tone = M.kv.order.tone === "wait" ? " wait" : M.kvId === "stale" ? " stale" : "";
      M.labels.push({ key: "flag", b: M.flagBinding, html: '<span class="b-lock" data-text="glyph">' + (M.kvId === "ok" ? "■" : "□") + "</span>" + bEsc(M.flag), ax: x0 + claimBox[0], ay: y0 + claimBox[1], at: ["tl", "tr", "bl"], g: 4, pri: 92, cls: "b-flag" + tone });
      if (M.second) M.labels.push({ key: "second", b: M.kvId === "ok" ? D.moment.order.binding : M.kv.binding, html: (M.kvId === "ok" ? '<span class="b-dots" data-text="glyph">●●●</span>' : "") + bEsc(M.second), near: "flag", at: ["right", "under", "over"], g: 4, pri: 91, cls: "b-flag2" + (M.kvId === "ok" ? "" : " wait") });
      if (S.alt) M.labels.push({ key: "sentence", b: D.moment.order.binding, html: bEsc(D.moment.order.sentence), ax: x0 + claimBox[0], ay: y0 + claimBox[3], at: ["bl", "br"], g: 4, pri: 24, alt: true, cls: "b-small" });
    }
    if (S.alt && fine) {
      const rb = D.moment.belts.find((b) => b.tone === "red");
      if (rb) { const q = E(rb.pts[1][0] - 60, rb.pts[1][1]); M.labels.push({ key: "beltred", b: "plant:acquit", html: bEsc(p.condition || ""), ax: x0 + q[0], ay: y0 + q[1] + 6, at: ["b", "t"], g: 2, pri: 27, alt: true, cls: "b-small" }); }
      if (hover) {}
    }
  }
  if (live && hover && fine) {
    const bl = D.moment.blast, belt = D.moment.belts.find((b) => b.id === bl.belt), brk = D.moment.machines.find((m) => m.id === bl.on);
    const seg = bClipX(belt.pts, brk.x, 1e9).map((q) => E(q[0], q[1]));
    const hg = bEl(geo, "blast", "g", { class: "b-blast", "data-binding": bl.binding });
    bEl(hg, "band", "path", { class: "b-band", d: bPath(seg) });
    for (const id of bl.downstream) { const mb = box[id]; if (mb) bEl(hg, "r:" + id, "rect", { class: "b-blastf", x: bR(mb.ax - 4), y: bR(mb.top - 4), width: bR(mb.bx - mb.ax + 8), height: bR(mb.by - mb.top + 8), rx: 4 }); }
    const bb = box[bl.on];
    M.labels.push({ key: "blast", b: bl.binding, html: '<span class="mono">' + bl.decl + "</span> · blast radius · " + bl.downstream.length + " downstream", ax: x0 + bb.cx, ay: y0 + bb.by + 6, at: ["b", "bl"], g: 6, pri: 96, cls: "b-chip dr" });
  }

  // Org and site: plant name, waiting count, and the plant condition under Alt.
  if (lv === "org" || lv === "site") {
    M.labels.push({ key: "pname:" + p.id, b: "plant:" + of, html: bEsc(p.name), ax: x0, ay: y1 + t + 4, at: ["bl"], g: 2, pri: stub ? 20 : 62, cls: "b-pname" });
    const nw = stub ? 0 : M.waitBy[of] || 0;
    if (nw) M.labels.push({ key: "wait:" + p.id, b: "plant:" + of, html: '<span data-text="glyph" class="b-wd">●</span>' + nw, ax: x1, ay: y1 + t + 4, at: ["br"], g: 2, pri: 80, cls: "b-count" });
    if (S.alt && !stub && p.condition) M.labels.push({ key: "pcond:" + p.id, b: "plant:" + of, html: bEsc(p.condition), ax: x0, ay: y1 + t + 22, at: ["bl", "tl"], g: 2, pri: 30, alt: true, cls: "b-small" });
  }
}

// Cross-plant contracts as arteries between plinths, drawn on one plane under the plants.
export function bContracts(ctx, M) {
  const { D, S, plane, project } = ctx, W = innerWidth, H = innerHeight;
  const plants = Object.fromEntries(D.plants.map((p) => [p.id, p]));
  for (const c of D.contracts) {
    const a = plants[c.from], b = plants[c.to];
    const ca = [(a.rect[0] + a.rect[2]) / 2, (a.rect[1] + a.rect[3]) / 2], cb = [(b.rect[0] + b.rect[2]) / 2, (b.rect[1] + b.rect[3]) / 2];
    const clip = (r, from, to) => { const dx = to[0] - from[0], dy = to[1] - from[1]; let t = 1; if (dx) t = Math.min(t, ((dx > 0 ? r[2] : r[0]) - from[0]) / dx); if (dy) t = Math.min(t, ((dy > 0 ? r[3] : r[1]) - from[1]) / dy); return [from[0] + dx * t, from[1] + dy * t]; };
    const pa = project(...clip(a.rect, ca, cb)), pb = project(...clip(b.rect, cb, ca));
    const svg = bEl(plane, "C:" + c.id, "svg", { class: "dir-b-art", "data-binding": c.binding, width: W, height: H, style: bState().perf ? "display:none" : null });
    const mid = [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2];
    bEl(svg, "l", "path", { class: "b-artery " + c.kind, d: bPath([pa, pb]) });
    if (!bState().moving) bEl(svg, "c", "path", { class: "b-chev", d: bChevrons([pa, pb], Math.max(40, Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) / 3), 3.5) });
    M.contracts = M.contracts || {};
    M.contracts[c.id] = [pa, pb];
    if (S.alt && S.level !== "plant" && S.level !== "machine") M.labels.push({ key: "con:" + c.id, b: c.binding, html: bEsc(c.label), ax: mid[0], ay: mid[1], at: ["c", "t", "b"], g: 4, pri: 22, alt: true, cls: "b-small" });
  }
}

// Edge beacons for blockers outside the free rect; a click or I flies the camera there.
export function bBeacons(ctx, M) {
  const { S, project } = ctx, f = freeRect(innerWidth, innerHeight, { rail: "none" });
  const inset = { l: f.x + 8, t: f.y + 6, r: f.x + f.w - 8, b: f.y + f.h - 6 };
  const cx = f.x + f.w / 2, cy = f.y + f.h / 2;
  const seen = new Set();
  for (const k of M.blockers) {
    if (seen.has(k.id)) continue;
    seen.add(k.id);
    const [sx, sy] = project(k.x, k.y);
    if (sx >= f.x && sx <= f.x + f.w && sy >= f.y && sy <= f.y + f.h) continue;
    const dx = sx - cx, dy = sy - cy;
    const t = Math.min(dx ? ((dx > 0 ? inset.r : inset.l) - cx) / dx : Infinity, dy ? ((dy > 0 ? inset.b : inset.t) - cy) / dy : Infinity);
    const ex = cx + dx * t, ey = cy + dy * t;
    const ang = Math.atan2(dy, dx), arrows = ["→", "↘", "↓", "↙", "←", "↖", "↑", "↗"];
    const arrow = arrows[(Math.round(ang / (Math.PI / 4)) + 8) % 8];
    const text = (k.mono ? '<span class="mono">' + bEsc(k.label) + "</span>" : bEsc(k.label)) + (k.count ? ' <span class="b-wn">' + k.count + "</span>" : "") + (k.at ? " · " + bEsc(k.at) : "");
    M.labels.push({ key: "beacon:" + k.id, b: k.binding || (k.plant ? "plant:" + k.plant : null), html: '<span class="b-arrow" data-text="glyph">' + arrow + "</span>" + text, ax: ex, ay: ey, at: ["c"], g: 0, pri: 99, force: true, clamp: inset, cls: "b-beacon" + (k.tone === "wait" ? " wait" : ""), fly: k.id });
  }
}

// Places every label in priority order at the first candidate that clears islands, marks and other labels.
// Rest labels are placed before Alt labels, so holding Alt never moves a label that shows at rest.
// The shell keeps closed drawers in the DOM with layout boxes, so only islands that actually paint count as obstacles.
export function bObstacles() {
  return [...document.querySelectorAll(".fl, body>.hint, #dir-b-card")].filter((e) => !e.hidden && e.checkVisibility({ opacityProperty: true, visibilityProperty: true }))
    .map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0).map((r) => [r.left - 4, r.top - 4, r.right + 4, r.bottom + 4]);
}

export function bPlace(ctx, specs, obst) {
  const { plane } = ctx, W = innerWidth, H = innerHeight;
  const list = specs.filter((s) => s.b).map((s, i) => ({ s, i })).sort((a, b) => (a.s.alt ? 1 : 0) - (b.s.alt ? 1 : 0) || b.s.pri - a.s.pri || a.i - b.i).map((x) => x.s);
  const nodes = list.map((s) => {
    const n = bEl(plane, "L:" + s.key, "div", { class: "dir-b-mark " + (s.cls || ""), "data-binding": s.b, "data-click": s.click || null, "data-fly": s.fly || null }, s.html);
    return n;
  });
  // Label sizes are cached by class and markup, so a label that culls and returns during a zoom costs no layout.
  const SZ = bState().sz || (bState().sz = new Map()), keyOf = (s) => (s.cls || "") + "|" + s.html;
  const need = [];
  nodes.forEach((n, i) => { if (!n.__sz) { const z = SZ.get(keyOf(list[i])); if (z) n.__sz = z; else need.push(i); } });
  for (const i of need) { nodes[i].style.cssText = "left:0;top:0;visibility:hidden"; nodes[i].__a.style = undefined; }
  for (const i of need) SZ.set(keyOf(list[i]), nodes[i].__sz = [nodes[i].offsetWidth, nodes[i].offsetHeight]);
  const placed = [], at = {}, hit = (r, q) => r[0] < q[2] && r[2] > q[0] && r[1] < q[3] && r[3] > q[1];
  for (let i = 0; i < list.length; i++) {
    const s = list[i], n = nodes[i], [w, h] = n.__sz;
    let ax = s.ax, ay = s.ay, R = null;
    if (s.near) { R = at[s.near]; if (!R) { bSet(n, "display:none"); continue; } }
    let pos = null;
    for (const mode of s.at) {
      const g = s.g || 0;
      let x, y;
      if (R) { if (mode === "right") { x = R[2] + g; y = R[1]; } else if (mode === "under") { x = R[0]; y = R[3] + g; } else { x = R[0]; y = R[1] - g - h; } }
      else if (mode === "c") { x = ax - w / 2; y = ay - h / 2; }
      else if (mode === "b2") { x = ax - w / 2; y = s.box ? s.box[3] - h - 1 : ay + 4; }
      else if (mode === "t2") { x = ax - w / 2; y = ay - g - h - 40; }
      else if (mode === "r") { x = ax + g; y = ay - h / 2; }
      else if (mode === "l") { x = ax - g - w; y = ay - h / 2; }
      else if (mode === "b") { x = ax - w / 2; y = ay + g; }
      else if (mode === "t") { x = ax - w / 2; y = ay - g - h; }
      else if (mode === "tl") { x = ax; y = ay - g - h; }
      else if (mode === "tr") { x = ax - w; y = ay - g - h; }
      else if (mode === "bl") { x = ax; y = ay + g; }
      else if (mode === "br") { x = ax - w; y = ay + g; }
      if (s.clamp) { x = Math.max(s.clamp.l, Math.min(s.clamp.r - w, x)); y = Math.max(s.clamp.t, Math.min(s.clamp.b - h, y)); }
      const r = [x, y, x + w, y + h];
      if (s.box && (r[0] < s.box[0] - 2 || r[2] > s.box[2] + 2)) continue;
      const inside = r[0] >= 2 && r[1] >= 2 && r[2] <= W - 2 && r[3] <= H - 2;
      if (s.force ? true : inside && !obst.some((q) => hit(r, q)) && !placed.some((q) => hit(r, q))) { pos = r; break; }
    }
    if (!pos) { bSet(n, "display:none"); continue; }
    if (s.force && obst.some((q) => hit(pos, q))) { bSet(n, "display:none"); continue; }
    placed.push([pos[0] - 2, pos[1] - 2, pos[2] + 2, pos[3] + 2]);
    at[s.key] = pos;
    bSet(n, "left:" + Math.round(pos[0]) + "px;top:" + Math.round(pos[1]) + "px");
  }
}
export function bSet(n, style) { if (n.__a.style !== style) { n.__a.style = style; n.style.cssText = style; } }

// Event motion: a packet runs along the belt to the machine an event binds, then a ring pings it. Only events in
// ctx.fired start motion, every animation is finite, and frame jumps cancel what is still running.
export function bFxTargets(ctx, M, e) {
  const { D } = ctx, out = [];
  const MAP = { "order:": "paypal", "lease:": "paypal", "session:claude-payouts": "paypal", "session:droid-payouts": "paypal", "question:": "sqlite", "witness:w3": "sqlite",
    "decl:d1": "paypal", "decl:d2": "radar", "decl:d3": "breaker", "clash:c1": "breaker", "clash:c2": "sqlite", "clash:c3": "api", "queue:breaker": "breaker", "away:ci-418": "radar", "away:breaker": "breaker" };
  const seen = new Set();
  for (const b of e.bindings) {
    const key = Object.keys(MAP).find((k) => b === k || (k.endsWith(":") && b.startsWith(k)));
    const id = key && MAP[key];
    if (!id || seen.has(id) || !M.mpos[id]) continue;
    seen.add(id);
    const belt = D.moment.belts.find((x) => x.from === "api" && (x.to === id || D.moment.machines.some((m) => m.id === id && Math.abs(m.y - x.pts[0][1]) < 1 && m.x > x.pts[0][0] && m.x < x.pts[x.pts.length - 1][0])));
    let path = null;
    if (belt && M.belts[belt.id]) {
      const m = D.moment.machines.find((x) => x.id === id);
      const pts = belt.to === id ? belt.pts : bClipX(belt.pts, -1e9, m.x);
      const full = M.belts[belt.id], world = belt.pts;
      const proj = pts.map((q) => { const i = world.findIndex((w) => w[0] === q[0] && w[1] === q[1]); if (i >= 0) return full[i]; const k = world.findIndex((w, j) => j < world.length - 1 && Math.abs(w[1] - q[1]) < 0.01 && Math.abs(world[j + 1][1] - q[1]) < 0.01); const a = full[k], c = full[k + 1], t = (q[0] - world[k][0]) / ((world[k + 1][0] - world[k][0]) || 1); return [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t]; });
      path = proj;
    }
    const tone = b.startsWith("clash:") ? "fail" : b.startsWith("queue:") ? "wait" : b.startsWith("decl:") ? bHue(D.moment.declarations.find((d) => "decl:" + d.id === b).session) : "ink";
    out.push({ path, at: [M.mpos[id].x, M.mpos[id].y], tone });
  }
  if (e.kind === "heartbeat" && M.mpos.paypal && !out.length) out.push({ path: null, at: [M.mpos.paypal.x, M.mpos.paypal.y], tone: "ink", small: true });
  if (e.rows.length && !e.local && M.contracts && M.contracts.rest) out.push({ path: M.contracts.rest, at: M.contracts.rest[1], tone: "ink", egress: true });
  return out;
}

export function bFx(ctx, M) {
  const B = bState(), { fired } = ctx, layer = document.getElementById("dir-b-fxl");
  let n = 0;
  for (const e of fired) for (const t of bFxTargets(ctx, M, e)) {
    if (n++ >= 10) return;
    const els = [];
    const mk = (cls) => { const d = document.createElement("div"); d.className = "dir-b-fx " + cls; d.dataset.binding = "event:" + e.id; layer.append(d); els.push(d); return d; };
    let delay = 0;
    if (t.path && t.path.length > 1) {
      const pk = mk("b-packet " + t.tone);
      const lens = [0];
      for (let i = 1; i < t.path.length; i++) lens.push(lens[i - 1] + Math.hypot(t.path[i][0] - t.path[i - 1][0], t.path[i][1] - t.path[i - 1][1]));
      const L = lens[lens.length - 1] || 1;
      const frames = t.path.map((q, i) => ({ transform: "translate(" + bR(q[0] - 3) + "px," + bR(q[1] - 3) + "px)", offset: lens[i] / L }));
      delay = 700;
      B.fx.push(pk.animate(frames, { duration: delay, easing: "linear" }));
    }
    if (!t.egress) {
      const ring = mk("b-ping " + t.tone + (t.small ? " small" : ""));
      ring.style.left = bR(t.at[0]) + "px"; ring.style.top = bR(t.at[1]) + "px";
      B.fx.push(ring.animate([{ transform: "translate(-50%,-50%) scale(.4)", opacity: 1 }, { transform: "translate(-50%,-50%) scale(1.6)", opacity: 0 }], { duration: 520, delay, easing: "ease-out", fill: "backwards" }));
    }
    const last = B.fx[B.fx.length - 1];
    last.onfinish = last.oncancel = () => { for (const d of els) d.remove(); };
  }
  B.fx = B.fx.filter((a) => a.playState !== "finished" && a.playState !== "idle");
}
export function bFxClear() {
  const B = bState();
  for (const a of B.fx) a.cancel();
  B.fx = [];
  for (const d of document.querySelectorAll(".dir-b-fx")) d.remove();
}

// The one card in the 392 px right slot: a clash, the return brief, or the Kvarm network log.
export function bCard(ctx, M) {
  const { D, S } = ctx, card = document.getElementById("dir-b-card");
  card.hidden = !S.card;
  if (!S.card) return;
  let html = "", binding = "";
  const kb = (k) => "<kbd>" + k + "</kbd>";
  if (S.card.startsWith("clash:")) {
    const c = D.moment.clashes.find((x) => "clash:" + x.id === S.card);
    const ds = c.decls.map((id) => D.moment.declarations.find((d) => d.id === id));
    binding = c.binding;
    const where = c.at.belt ? c.at.belt.replace("->", " → ") : c.at.entity + (c.at.layer ? " · " + c.at.layer : "");
    html = '<header><i class="b-dia" data-text="glyph"></i><h3>' + bEsc(c.title || c.id) + "</h3>" + kb("Esc") + "</header><ul>"
      + '<li data-binding="' + c.binding + '"><b class="b-sev">' + bEsc(c.severity.toUpperCase()) + "</b> · " + bEsc(where) + (c.breaks ? " · breaks " + c.breaks : "") + "</li>"
      + '<li data-binding="' + c.binding + '">' + ds.map((d) => '<span data-binding="' + d.binding + '"><i class="b-sw ' + bHue(d.session) + '"></i>' + bEsc(d.agent) + ' <span class="mono">' + d.id + '</span><span class="b-alt"> ' + bEsc(d.asserts) + "</span></span>").join('<span class="b-vs">·</span>') + "</li>"
      + c.options.map((o) => '<li data-binding="' + c.binding + '"><button class="b-opt" data-opt="' + o.kind + '">' + bEsc(o.label) + (o.kind === c.suggested ? ' <em>suggested</em>' : "") + kb(o.key) + "</button></li>").join("")
      + "</ul>";
  } else if (S.card === "away") {
    binding = D.away.binding;
    // Changes that happened on a machine are tagged there; the card keeps only what the map cannot place.
    const rows = D.away.items.filter((i) => i.at && !M.changes.some((c) => c.id === i.id));
    html = "<header><h3>Away · " + bEsc(D.away.from.slice(0, 5)) + " to " + bEsc(D.away.to.slice(0, 5)) + "</h3>" + kb("Esc") + "</header><ul>"
      + (M.changes.length ? '<li data-binding="' + D.away.binding + '"><span class="b-time"></span>' + M.changes.length + " changes marked on the map</li>" : "")
      + rows.map((i) => '<li data-binding="' + i.binding + '"><span class="b-time">' + bEsc(i.at || "") + "</span>" + bEsc(i.row) + "</li>").join("")
      + '<li data-binding="' + D.away.binding + '"><span class="b-time"></span><span>Replay the half hour</span>' + kb("T") + "</li></ul>";
  } else if (S.card === "net") {
    binding = "kvarm:indicator";
    const rows = bLedger(ctx);
    const tot = rows.reduce((s, r) => s + (r.bytes || 0), 0), uns = rows.filter((r) => r.bytes === null).length;
    const show = rows.slice(-4);
    html = '<header><h3>Kvarm · ' + bEsc(D.kv[S.kv].indicator.label) + "</h3>" + kb("Esc") + "</header><ul>"
      + '<li data-binding="egress:total"><span class="b-time"></span>' + tot.toLocaleString("en-US") + " B out · " + rows.length + " ops" + (uns ? " · " + uns + " unsized" : "") + "</li>"
      + show.map((r) => '<li data-binding="' + r.binding + '"><span class="b-time">' + bEsc((r.at || "").slice(0, 5)) + '</span><span class="mono">' + bEsc(r.op) + "</span>" + (r.count > 1 ? " ×" + r.count : "") + '<span class="b-bytes">' + (r.bytes === null ? "unsized" : r.bytes.toLocaleString("en-US") + " B") + "</span></li>").join("")
      + "</ul>";
  }
  card.dataset.binding = binding;
  if (card.__h !== html) { card.__h = html; card.innerHTML = html; }
}

export function bLedger(ctx) {
  const { D, S } = ctx;
  if (S.kv !== "ok") return D.kv[S.kv].ledger;
  const rows = [];
  for (const e of D.events) if (e.at <= S.at) for (const r of e.rows) {
    const last = rows[rows.length - 1];
    if (r.op === "heartbeat_task" && last && last.op === "heartbeat_task") { last.count++; last.bytes += r.bytes; continue; }
    rows.push({ ...r, count: 1, at: e.clock, event: e.id, binding: "ledger:" + e.id + ":" + r.op });
  }
  return rows;
}

export function bShell(ctx, M) {
  const hint = document.querySelector("body>.hint");
  const top = M.queue[0], text = top ? top.title : "Nothing waits on you";
  if (hint && hint.textContent !== text) hint.textContent = text;
}

// Camera moves: wheel and keys zoom about a screen point, drag pans, Go to flies. All of them only call setView.
// While the camera moves, plants drop belt chevrons, roof details and dashes; one full redraw follows when it settles.
export function bMoving() {
  const B = bState();
  B.moving = true;
  clearTimeout(B.settle);
  B.settle = setTimeout(() => { B.moving = false; B.ctx.draw(); }, 160);
}
export function bZoomAt(f, px, py) {
  bMoving();
  const c = bState().ctx, cam = c.S.camera, fr = freeRect(innerWidth, innerHeight, { rail: "none" });
  const [wx, wy] = c.unproject(px, py), ppu = Math.max(0.04, Math.min(14, cam.ppu * f));
  const cx = wx - (px - cam.sx) / ppu, cy = wy - (py - cam.sy) / ppu, hw = fr.w / 2 / ppu, hh = fr.h / 2 / ppu;
  c.setView([cx - hw, cy - hh, cx + hw, cy + hh]);
}
export function bPanBy(dx, dy) {
  bMoving();
  const c = bState().ctx, ppu = c.S.camera.ppu, v = c.S.view;
  c.setView([v[0] - dx / ppu, v[1] - dy / ppu, v[2] - dx / ppu, v[3] - dy / ppu]);
}
export function bFly(rect, ms = 260) {
  const B = bState(), c = B.ctx, from = c.S.view.slice(), id = ++B.fly, t0 = performance.now();
  const step = (now) => {
    if (id !== B.fly) return;
    const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
    const wf = from[2] - from[0], wt = rect[2] - rect[0], w = wf * Math.pow(wt / wf, e), s = (w - wf) / ((wt - wf) || 1);
    const t = Math.abs(wt - wf) < 1e-6 ? e : s;
    bMoving();
    B.ctx.setView(from.map((v, i) => v + (rect[i] - v) * t));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
export function bAround(x, y, ppu) {
  const fr = freeRect(innerWidth, innerHeight, { rail: "none" }), hw = fr.w / 2 / ppu, hh = fr.h / 2 / ppu;
  return [x - hw, y - hh, x + hw, y + hh];
}
