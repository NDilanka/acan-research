// Page-side helpers for direction C, "Transit". dir-base.mjs inlines lib functions into the page by source, so each
// is a plain function declaration that reads only its arguments, browser globals and the page helpers (levelFor, ...).

export function tClamp(v, a, b) { return v < a ? a : v > b ? b : v; }

// Octilinear route candidates between two stations in plant-local units: diagonal first, diagonal last, diagonal middle.
export function tRouteOpts(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, ax = Math.abs(dx), ay = Math.abs(dy), sx = Math.sign(dx), sy = Math.sign(dy);
  const A = [a.x, a.y], B = [b.x, b.y], m = Math.min(ax, ay);
  if (m < 0.5 || Math.abs(ax - ay) < 1) return [[A, B]];
  // A jog this small sits under the station disc, so a right angle reads as straight.
  if (m < 4) return [ax > ay ? [A, [b.x, a.y], B] : [A, [a.x, b.y], B]];
  if (ax > ay) return [[A, [a.x + sx * m, b.y], B], [A, [b.x - sx * m, a.y], B], [A, [a.x + sx * (ax - ay) / 2, a.y], [b.x - sx * (ax - ay) / 2, b.y], B]];
  return [[A, [b.x, a.y + sy * m], B], [A, [a.x, b.y - sy * m], B], [A, [a.x, a.y + sy * (ay - ax) / 2], [b.x, b.y - sy * (ay - ax) / 2], B]];
}

// One schematic per plant: stations from the plant's machines, lines from its belts. Fittings that sit on a belt
// (valve, retry, breaker) become stops on that line. Routes pick the octilinear option whose exit and entry
// directions are still free at both stations, so lines out of a hub fan out instead of sharing a track.
export function tModel(D, list) {
  const FIT = { valve: 1, retry: 1, breaker: 1 };
  const plants = list.map((p) => {
    const of = p.of || p.id, acq = of === "acquit";
    const real = D.plants.find((q) => q.id === of);
    const ents = acq
      ? D.moment.machines.filter((m) => m.kind !== "crane").map((m) => ({ id: m.id, kind: m.kind, name: m.name, x: m.x, y: m.y, state: m.state, reading: m.reading, binding: m.binding, fit: !!FIT[m.kind], dock: m.kind === "dock" }))
      : D.scenes[of].entities.map((e) => ({ id: e.id, kind: e.kind, name: e.id, x: e.x, y: e.y, state: "ok", reading: null, binding: "plant:" + of, fit: false, dock: false }));
    const E = Object.fromEntries(ents.map((e) => [e.id, e]));
    const belts = acq ? D.moment.belts : D.scenes[of].belts.map((b) => ({ ...b, id: b.from + "->" + b.to, binding: "plant:" + of }));
    const onBelt = (m, pts) => pts.some(([x0, y0], i) => {
      const n = pts[i + 1]; if (!n) return false;
      const [x1, y1] = n;
      return Math.abs(y0 - y1) < 1 ? Math.abs(m.y - y0) < 1 && m.x >= Math.min(x0, x1) - 1 && m.x <= Math.max(x0, x1) + 1
        : Math.abs(m.x - x0) < 1 && m.y >= Math.min(y0, y1) - 1 && m.y <= Math.max(y0, y1) + 1;
    });
    const lines = belts.filter((b) => E[b.from] && E[b.to]).map((b) => {
      const a = E[b.from];
      const mids = ents.filter((m) => m.fit && m.id !== b.from && m.id !== b.to && onBelt(m, b.pts)).sort((m, n) => Math.hypot(m.x - a.x, m.y - a.y) - Math.hypot(n.x - a.x, n.y - a.y));
      return { id: b.id, binding: b.binding, chain: [b.from, ...mids.map((m) => m.id), b.to], tone: b.tone || null, ghost: !!b.ghost };
    });
    const routes = {}, used = {};
    const dir = (p, q) => Math.sign(Math.round(q[0] - p[0])) + "," + Math.sign(Math.round(q[1] - p[1]));
    // The errored belt carries the agent lines and the clash, so it gets first pick of the hub's directions.
    for (const ln of [...lines].sort((x, y) => (y.tone ? 1 : 0) - (x.tone ? 1 : 0))) for (let i = 0; i < ln.chain.length - 1; i++) {
      const a = E[ln.chain[i]], b = E[ln.chain[i + 1]];
      let pick = null, best = 9;
      for (const o of tRouteOpts(a, b)) {
        const ex = dir(o[0], o[1]), en = dir(o[o.length - 1], o[o.length - 2]);
        const c = (used[a.id] && used[a.id].has(ex) ? 1 : 0) + (used[b.id] && used[b.id].has(en) ? 1 : 0);
        if (c < best) { best = c; pick = o; }
      }
      (used[a.id] = used[a.id] || new Set()).add(dir(pick[0], pick[1]));
      (used[b.id] = used[b.id] || new Set()).add(dir(pick[pick.length - 1], pick[pick.length - 2]));
      routes[a.id + ">" + b.id] = pick;
    }
    const degree = {};
    for (const ln of lines) for (const s of ln.chain) degree[s] = (degree[s] || 0) + 1;
    return { id: p.id, of, name: p.name, acq: acq && !p.stub, stub: !!p.stub, rect: p.rect, origin: p.origin, binding: "plant:" + of,
      env: real.env, freshness: real.freshness, ents, E, lines, routes, degree, level: null, wall: acq ? D.moment.wall : null, div: null };
  });
  return { plants };
}

// Local polyline through a chain of stations, reusing the belt routes so agent lines sit exactly on their belts.
export function tChain(P, chain) {
  const pts = [];
  for (let i = 0; i < chain.length - 1; i++) {
    const a = P.E[chain[i]], b = P.E[chain[i + 1]];
    let r = P.routes[a.id + ">" + b.id];
    if (!r) { const back = P.routes[b.id + ">" + a.id]; r = back ? [...back].reverse() : tRouteOpts(a, b)[0]; }
    pts.push(...(i ? r.slice(1) : r));
  }
  return pts;
}

// Parallel offset of a screen polyline with mitred joins, so an agent line runs beside its belt like a second track.
export function tOffset(pts, d) {
  if (!d) return pts;
  const out = [], n = pts.length;
  const nrm = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
  for (let i = 0; i < n; i++) {
    const n1 = i > 0 ? nrm(pts[i - 1], pts[i]) : null, n2 = i < n - 1 ? nrm(pts[i], pts[i + 1]) : null;
    let m = n1 && n2 ? [n1[0] + n2[0], n1[1] + n2[1]] : n1 || n2;
    const l = Math.hypot(m[0], m[1]) || 1; m = [m[0] / l, m[1] / l];
    const s = Math.min(2, 1 / Math.max(0.3, m[0] * (n1 || n2)[0] + m[1] * (n1 || n2)[1]));
    out.push([pts[i][0] + m[0] * d * s, pts[i][1] + m[1] * d * s]);
  }
  return out;
}

export function tPath(pts) { return pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(""); }

// Station role pictograms in a unit box. Flat transit drops the iso drawing, so the role rides on a glyph instead of a word.
export function tGlyph(kind) {
  return ({
    intake: "M-0.9 0H0.3M-0.15-0.45L0.3 0L-0.15 0.45M0.75-0.75V0.75",
    gate: "M-0.65 0.8V-0.55M0.65 0.8V-0.55M-0.9-0.55H0.9",
    assembler: "M-0.62-0.62H0.62V0.62H-0.62ZM-0.22-0.22H0.22V0.22H-0.22Z",
    clock: "M0-0.8A0.8 0.8 0 1 1 -0.01-0.8M0-0.45V0H0.38",
    bank: "M-0.7 0L-0.2 0.5L0.75-0.5",
    tank: "M-0.6-0.45A0.6 0.25 0 0 1 0.6-0.45V0.45A0.6 0.25 0 0 1 -0.6 0.45ZM-0.6-0.45A0.6 0.25 0 0 0 0.6-0.45",
    kiln: "M0 0.8C-0.6 0.8-0.7 0.1-0.2-0.3C-0.2 0.1 0.1 0.1 0.1-0.25C0.1-0.5 0-0.7 0-0.8C0.5-0.4 0.75 0.1 0.5 0.5C0.38 0.7 0.2 0.8 0 0.8Z",
    dock: "M-0.55 0.55L0.5-0.5M-0.05-0.5H0.5V0.05",
    radar: "M-0.75 0.75L0.05-0.05M-0.8-0.2A0.85 0.85 0 0 0 0.2 0.8M-0.3-0.75A0.85 0.85 0 0 1 0.75 0.3",
    retry: "M0.62 0.05A0.62 0.62 0 1 1 0.3-0.55M0.25-0.95L0.35-0.5L-0.1-0.4",
    breaker: "M0.15-0.85L-0.4 0.1H0.1L-0.1 0.85L0.5-0.1H0Z",
    valve: "M-0.7-0.5L0.7 0.5V-0.5L-0.7 0.5Z",
    buffer: "M-0.65-0.45H0.65M-0.65 0H0.65M-0.65 0.45H0.65",
    hopper: "M-0.7-0.5H0.7L0.25 0.5H-0.25Z",
    crate: "M-0.6-0.6H0.6V0.6H-0.6ZM-0.6-0.6L0.6 0.6M0.6-0.6L-0.6 0.6",
    splitter: "M-0.75 0H0M0 0L0.6-0.5M0 0L0.6 0.5",
  })[kind] || "M-0.3 0H0.3";
}

// Arc from 12 o'clock, clockwise, for rings that fill with time.
export function tArc(cx, cy, r, f) {
  f = tClamp(f, 0, 0.9999);
  const a = f * Math.PI * 2, x = cx + r * Math.sin(a), y = cy - r * Math.cos(a);
  return "M" + cx.toFixed(1) + " " + (cy - r).toFixed(1) + "A" + r + " " + r + " 0 " + (f > 0.5 ? 1 : 0) + " 1 " + x.toFixed(1) + " " + y.toFixed(1);
}

// Everything time and kv dependent, derived from the fixture's event stream at S.at.
export function tState(D, S) {
  const at = S.at, kv = S.kv, K = D.kv[kv];
  const past = new Set(D.events.filter((e) => e.at <= at).map((e) => e.id));
  const msOf = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return (h * 3600 + m * 60 - T0) * 1000; };
  const declared = past.has("declarations"), claimed = past.has("claim");
  const decls = declared ? D.moment.declarations.filter((d) => !(kv === "unmatched" && d.session === "claude-payouts")) : [];
  const clashes = [];
  if (declared) for (const c of D.moment.clashes) if (K.clashes.includes(c.id)) {
    const settled = (c.id === "c1" && past.has("bench-record")) || (c.id === "c2" && past.has("settle-c2"));
    clashes.push({ ...c, state: c.severity === "advisory" ? "advisory" : settled ? "settled" : "open" });
  }
  const q = [];
  for (const e of D.events) if (e.at <= at) { for (const a of e.queue.add || []) q.push(a); for (const d of e.queue.drop || []) q.splice(q.indexOf(d), 1); }
  const plantOf = (id) => (D.moment.queue.rows.find((r) => r.id === id) || {}).plant || "acquit";
  const waiting = {};
  for (const id of q) waiting[plantOf(id)] = (waiting[plantOf(id)] || 0) + 1;
  const agents = D.moment.agents.map((a) => {
    const o = { ...a, ...(K.agents[a.session] || {}) };
    if (a.askedAt) { o.waitedMin = Math.floor((at - msOf(a.askedAt)) / 60000); if (!K.agents[a.session]) o.activity = "waiting on you · " + o.waitedMin + "m"; }
    return o;
  });
  const beats = D.events.filter((e) => e.at <= at && (e.id === "claim" || e.kind === "heartbeat"));
  const lease = K.lease, renewed = beats.length ? beats[beats.length - 1].at : null;
  const leaseLeft = kv === "ok" && renewed !== null ? tClamp(lease.leaseS - (at - renewed) / 1000, 0, lease.leaseS) : null;
  const ciDone = past.has("ci-418");
  const ciM = (ciDone ? "5/5" : D.moment.ci.what).match(/(\d+)\s*(?:of|\/)\s*(\d+)/);
  const back = at >= D.at.back;
  const fresh = back ? D.away.items.filter((i) => i.at && i.at >= D.away.from.slice(0, 5)) : [];
  return { at, kv, K, past, declared, claimed, decls, clashes, q, waiting, agents, lease, leaseLeft,
    ci: { done: +ciM[1], of: +ciM[2], passed: ciDone }, back, fresh, hold: past.has("hold-breaker"), approved: past.has("approve-184"),
    openClashes: clashes.filter((c) => c.state === "open").length };
}

// Keyed element pool: elements persist across renders, so plants and marks keep identity and event motion survives
// redraws. Anything not touched in a render is removed, so a frame's element set depends only on its state.
export function tEl(T, parent, key, tag, svg) {
  let e = T.pool.get(key);
  if (e && e.localName !== tag) { e.remove(); e = null; }
  if (!e) {
    e = svg ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag);
    T.pool.set(key, e);
    parent.append(e);
  }
  T.used.add(key);
  let s = T.seq.get(parent);
  if (!s) T.seq.set(parent, (s = []));
  s.push(e);
  return e;
}
export function tAt(e, a) { for (const k in a) { const v = a[k]; if (v === null || v === undefined) e.removeAttribute(k); else if (e.getAttribute(k) !== String(v)) e.setAttribute(k, v); } return e; }
// Children follow call order, so the DOM order of a frame never depends on which frames came before it. The F8
// check numbers marks per binding in DOM order, so a node recreated late must not land after its siblings.
export function tSweep(T) {
  for (const [k, e] of T.pool) if (!T.used.has(k)) { e.remove(); T.pool.delete(k); }
  for (const [p, list] of T.seq) {
    let cur = p.firstElementChild;
    for (const e of list) { if (e === cur) cur = cur.nextElementSibling; else p.insertBefore(e, cur); }
  }
  T.used.clear(); T.seq.clear();
}

// Greedy label placement in screen space. Near candidates first; with far set (Alt), rings out to 220 px with a leader.
export function tPlace(items, occ, W, H, far) {
  const hit = (r) => r[0] < 4 || r[1] < 96 || r[2] > W - 4 || r[3] > H - 4 || occ.some((o) => r[0] < o[2] && r[2] > o[0] && r[1] < o[3] && r[3] > o[1]);
  for (const it of items) {
    const f = it.follow && it.follow.pos;
    if (it.follow && !f && !it.anchor) { it.pos = null; continue; }
    const [ax, ay] = f ? [f[0], f[3]] : it.anchor, g = it.gap || 6, w = it.w, h = it.h, c = [];
    if (f) {
      { const below = [[f[0], f[3] + 3], [f[2] - w, f[3] + 3]], above = [[f[0], f[1] - h - 3], [f[2] - w, f[1] - h - 3]]; c.push(...(it.up ? above.concat(below) : below.concat(above)), [f[2] + 6, f[1]]); }
    }
    else if (it.cands) c.push(...it.cands);
    else {
      const near = it.prefer === "below" ? [[ax - w / 2, ay + g], [ax - w / 2, ay - g - h]] : it.prefer === "above" ? [[ax - w / 2, ay - g - h], [ax, ay - g - h], [ax - w, ay - g - h], [ax - w / 2, ay + g]] : [];
      c.push(...near, [ax + g, ay - h - g * 0.6], [ax + g, ay - h / 2], [ax - w - g, ay - h / 2], [ax - w / 2, ay - g - h], [ax - w / 2, ay + g], [ax - w - g, ay - h - g * 0.6], [ax + g, ay + g * 0.6], [ax - w - g, ay + g * 0.6]);
    }
    if (far || it.far) for (const d of [26, 44, 66, 92, 122, 160, 200, 240, 300, 380]) for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2, cx = ax + Math.cos(a) * d, cy = ay + Math.sin(a) * d;
      c.push([Math.cos(a) >= 0 ? cx : cx - w, cy - h / 2]);
    }
    it.pos = null;
    for (const [x, y] of c) { const r = [Math.round(x), Math.round(y), Math.round(x) + w, Math.round(y) + h]; if (!hit(r)) { it.pos = r; break; } }
    if (it.pos) occ.push([it.pos[0] - 3, it.pos[1] - 2, it.pos[2] + 3, it.pos[3] + 2]);
  }
}
