// Drawing helpers for direction C, "Transit". Like dir-c-lib.mjs, dir-base.mjs inlines these into the page by
// source, so each reads only its arguments, browser globals, page helpers and the other inlined functions.

export function tEsc(s) { return String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]); }

// One hue per session. The kit only has red, green and blue, and red is reserved, so three hues are the kit blue
// turned in OKLCH. Deriving them from --d-focus keeps the page free of literal colours and lifts them in dark.
export function tHue(session) {
  return ({ "claude-payouts": "var(--dc-claude)", "claude-port": "var(--dc-claude)", "droid-radar": "var(--dc-radar)", "codex-paypal": "var(--dc-codex)", "droid-payouts": "var(--dc-d2)" })[session] || "var(--d-tick)";
}

export function tFresh(s) { return /not reported|unknown/.test(s) ? "unknown" : /simulated/.test(s) ? "sim" : /stale/.test(s) ? "stale" : "fresh"; }

// Label width from canvas metrics, so placement never forces a layout per label.
export function tW(T, text, kind) {
  const key = kind + "|" + text;
  let w = T.wc.get(key);
  if (w !== undefined) return w;
  if (!T.cv) { T.cv = document.createElement("canvas").getContext("2d"); T.sans = getComputedStyle(document.body).getPropertyValue("--sans").trim() || "system-ui,sans-serif"; }
  T.cv.font = (kind === "alt" ? "400 " : "500 ") + "12px " + T.sans;
  w = Math.ceil(T.cv.measureText(text).width) + ({ mark: 18, beacon: 18, name: 8, alt: 14 })[kind] + 2;
  T.wc.set(key, w);
  return w;
}

export function tRingSvg(f, cls) {
  return '<svg class="dc-ringi ' + cls + '" viewBox="-7 -7 14 14"><circle r="5" class="tr"/>' + (f > 0 ? '<path class="ar" d="' + tArc(0, 0, 5, f) + '"/>' : "") + "</svg>";
}

// Cross-plant contracts as single schematic lines between site footprints, for org and site levels only.
export function tCons(T, c) {
  const box = (id) => { const p = c.D.plants.find((q) => q.id === id), a = c.project(p.rect[0], p.rect[1]), b = c.project(p.rect[2], p.rect[3]); return [a[0], a[1], b[0], b[1]]; };
  for (const k of c.D.contracts) {
    const A = box(k.from), B = box(k.to);
    const ca = [(A[0] + A[2]) / 2, (A[1] + A[3]) / 2], cb = [(B[0] + B[2]) / 2, (B[1] + B[3]) / 2];
    const dx = cb[0] - ca[0], dy = cb[1] - ca[1], hor = Math.abs(dx) > Math.abs(dy);
    const p = hor ? { x: dx > 0 ? A[2] : A[0], y: ca[1] } : { x: ca[0], y: dy > 0 ? A[3] : A[1] };
    const q = hor ? { x: dx > 0 ? B[0] : B[2], y: cb[1] } : { x: cb[0], y: dy > 0 ? B[1] : B[3] };
    const svg = tAt(tEl(T, c.plane, "k:" + k.id, "svg", true), { class: "dc-con " + k.kind, width: c.W, height: c.H, "data-binding": k.binding });
    tAt(tEl(T, svg, "k:" + k.id + "/p", "path", true), { d: tPath(tRouteOpts(p, q)[0]) });
  }
}

// One plant: its site svg (kept as the same node at every zoom) and the schematic inside it. Pushes labels, Alt
// words and obstacles for the shared placement pass into out.
export function tPlant(T, c, P, st, out) {
  const { S, D, ppu } = c;
  const a = c.project(P.rect[0], P.rect[1]), b = c.project(P.rect[2], P.rect[3]);
  const sw = b[0] - a[0], sh = b[1] - a[1], real = P.acq;
  const lvl = real ? S.level : sw < 160 ? "org" : sw < 560 ? "site" : sw < 2200 ? "plant" : "machine";
  const near = lvl === "plant" || lvl === "machine", small = !near;
  const vis = b[0] > -80 && a[0] < c.W + 80 && b[1] > -80 && a[1] < c.H + 80;
  const hov = real && S.hover && S.hover.startsWith("decl:") ? S.hover : null;
  const K = "p:" + P.id + "/", sid = P.id.replace(/\W/g, "_");
  // Below a 3 px stop the schematic is texture: footprint, belts and stops sit in one group drawn once per quarter
  // octave of zoom and scaled in between, so a zoom frame over twenty-five plants changes one transform each. A plant
  // with nothing else at live scale (no agents, no away dots) scales as a whole box, which skips layout entirely.
  const r = tClamp(ppu * 5.5, 1.6, 15), merge = r < 3 && !near, q = merge ? Math.pow(2, Math.round(Math.log2(ppu) * 4) / 4) : ppu, k = ppu / q;
  const plain = merge && !real && !(st.back && st.fresh.some((it) => it.plant === P.of));
  const fw = (P.rect[2] - P.rect[0]) * q, fh = (P.rect[3] - P.rect[1]) * q;
  const svg = tAt(tEl(T, c.plane, "p:" + P.id, "svg", true), { "data-plant": P.id, "data-binding": P.binding, class: "dc-plant" + (hov ? " dc-hov" : ""),
    width: (plain ? fw : Math.max(1, sw)).toFixed(1), height: (plain ? fh : Math.max(1, sh)).toFixed(1),
    style: (plain ? "left:0;top:0;transform-origin:0 0;transform:translate(" + a[0].toFixed(1) + "px," + a[1].toFixed(1) + "px) scale(" + k.toFixed(4) + ")" : "left:" + a[0].toFixed(1) + "px;top:" + a[1].toFixed(1) + "px") + (vis ? "" : ";display:none") });
  P.box = vis ? [a[0], a[1], b[0], b[1]] : null;
  if (!vis) return;
  const ox = a[0], oy = a[1];
  const L = (x, y) => [(P.origin[0] + x - P.rect[0]) * ppu, (P.origin[1] + y - P.rect[1]) * ppu];
  const lw = tClamp(ppu * 2, 1, 5), fresh = tFresh(P.freshness);
  const on = (bnd) => (S.hover && S.hover === bnd ? " dc-on" : "");
  const el = (key, tag, attrs, parent) => tAt(tEl(T, parent || svg, K + key, tag, true), attrs);
  const f1 = (v) => v.toFixed(1);
  const K2 = st.K, fog = real && K2.territory.fog;

  if (fresh === "unknown" || fresh === "sim" || fog) {
    const defs = el("defs", "defs", {});
    const pat = el("pat", "pattern", { id: "dc-h-" + sid, patternUnits: "userSpaceOnUse", width: 6, height: 6, patternTransform: fresh === "sim" ? "rotate(-45)" : "rotate(45)" }, defs);
    el("patl", "line", { x1: 0, y1: 0, x2: 0, y2: 6, class: "dc-hatch" + (fresh === "sim" ? " sim" : "") }, pat);
  }
  const mk2 = merge ? "m" : "", nss = merge ? "non-scaling-stroke" : null;
  const mg = merge ? el("mg", "g", { transform: plain ? null : "scale(" + k.toFixed(4) + ")", "data-binding": P.binding }) : svg;
  const fo = lvl === "org" ? 1 : lvl === "site" ? tClamp((640 - sw) / 320, 0, 1) : 0;
  if (fo > 0.02) el(mk2 + "foot", "rect", { x: 0, y: 0, width: f1(fw), height: f1(fh), rx: f1(Math.min(10, fw * 0.08)), class: "dc-foot" + on(P.binding), style: "opacity:" + fo.toFixed(2), "vector-effect": nss, "data-hit": small && !P.stub ? P.binding : null }, mg);
  if (fresh === "unknown" || fresh === "sim") el(mk2 + "fog", "rect", { x: 0, y: 0, width: f1(fw), height: f1(fh), rx: f1(Math.min(10, fw * 0.08)), fill: "url(#dc-h-" + sid + ")", class: "dc-fog" }, mg);
  if (P.wall && near) {
    const [wx, wy0] = L(P.wall.x, P.wall.y0), [, wy1] = L(P.wall.x, P.wall.y1);
    el("wall", "path", { d: "M" + f1(wx) + " " + f1(wy0) + "V" + f1(wy1), class: "dc-wall" });
    out.alt.push({ key: "wall", kind: "alt", text: P.wall.text, binding: P.binding, anchor: [ox + wx, oy + wy0 + 10], prio: 9 });
  }
  if (fog) {
    const ids = D.moment.territories.find((t) => t.id === K2.territory.id).entities.filter((e) => P.E[e]);
    const xs = ids.map((e) => L(P.E[e].x, P.E[e].y)), pad = r + 12;
    const x0 = Math.min(...xs.map((p) => p[0])) - pad, y0 = Math.min(...xs.map((p) => p[1])) - pad, x1 = Math.max(...xs.map((p) => p[0])) + pad, y1 = Math.max(...xs.map((p) => p[1])) + pad;
    el("terr", "rect", { x: f1(x0), y: f1(y0), width: f1(x1 - x0), height: f1(y1 - y0), rx: 10, fill: "url(#dc-h-" + sid + ")", class: "dc-terr", "data-binding": "territory:" + K2.territory.id });
  }

  const blast = hov && D.moment.blast.decl === hov.slice(5) ? D.moment.blast : null;
  const hot = new Set(blast ? blast.downstream : []);
  if (blast) {
    const ln = P.lines.find((l) => l.id === blast.belt), i0 = ln.chain.indexOf(blast.on), i1 = Math.max(...blast.downstream.map((s) => ln.chain.indexOf(s)));
    el("blast", "path", { d: tPath(tChain(P, ln.chain.slice(i0, i1 + 1)).map(([x, y]) => L(x, y))), class: "dc-blast", style: "--h:" + tHue(blast.session) + ";stroke-width:" + f1(lw * 4.5), "data-binding": blast.binding });
  }
  if (merge) {
    if (!P.mc || P.mc.q !== q) {
      const L0 = (x, y) => [(P.origin[0] + x - P.rect[0]) * q, (P.origin[1] + y - P.rect[1]) * q], r0 = tClamp(q * 5.5, 1.6, 15), mb = {}, ms = {};
      for (const ln of P.lines) { const tone = (ln.tone ? " red" : "") + (ln.ghost ? " ghost" : ""); (mb[tone] = mb[tone] || []).push(tPath(tChain(P, ln.chain).map(([x, y]) => L0(x, y)))); }
      for (const e of P.ents) {
        const [x, y] = L0(e.x, e.y);
        (ms[e.state] = ms[e.state] || []).push(e.dock ? "M" + f1(x - r0) + " " + f1(y - r0) + "h" + f1(2 * r0) + "v" + f1(2 * r0) + "h" + f1(-2 * r0) + "Z" : "M" + f1(x - r0) + " " + f1(y) + "a" + f1(r0) + " " + f1(r0) + " 0 1 0 " + f1(2 * r0) + " 0a" + f1(r0) + " " + f1(r0) + " 0 1 0 " + f1(-2 * r0) + " 0");
      }
      P.mc = { q, lw: tClamp(q * 2, 1, 5).toFixed(2), mb, ms };
    }
    for (const k in P.mc.mb) el("bm:" + k, "path", { d: P.mc.mb[k].join(""), class: "dc-belt" + k, style: "stroke-width:" + P.mc.lw, "vector-effect": "non-scaling-stroke" }, mg);
    for (const k in P.mc.ms) el("sm:" + k, "path", { d: P.mc.ms[k].join(""), class: "dc-sm " + k }, mg);
  }
  else for (const ln of P.lines) {
    el("b:" + ln.id, "path", { d: tPath(tChain(P, ln.chain).map(([x, y]) => L(x, y))), class: "dc-belt" + (ln.tone ? " red" : "") + (ln.ghost ? " ghost" : ""), style: "stroke-width:" + lw.toFixed(2), "data-binding": ln.binding });
  }

  // Agent lines: each declaration runs beside its belt from the belt's source to the last station it writes, so two
  // agents on one belt share a segment and meet at the station where their writes collide.
  const side = { "claude-payouts": 1, "droid-radar": -1 }, off = lw * 1.25 + 1, ends = {};
  if (real) for (const d of st.decls) {
    const hue = tHue(d.session), sd = side[d.session] || 1, cover = new Set();
    for (const bid of d.belts) {
      const ln = P.lines.find((l) => l.id === bid);
      if (!ln) continue;
      const idx = d.touches.map((t) => ln.chain.indexOf(t)).filter((i) => i >= 0);
      const sub = ln.chain.slice(0, (idx.length ? Math.max(...idx) : ln.chain.length - 1) + 1);
      if (sub.length < 2) continue;
      for (const s of sub) cover.add(s);
      const pts = tOffset(tChain(P, sub).map(([x, y]) => L(x, y)), off * sd);
      el("d:" + d.id + ":" + bid, "path", { d: tPath(pts), class: "dc-aline" + on(d.binding) + (hov === d.binding ? " dc-hot" : ""), style: "--h:" + hue + ";stroke-width:" + lw.toFixed(2), "data-binding": d.binding, "data-hit": near ? d.binding : null });
      ends[d.session + ">" + sub[sub.length - 1]] = pts;
      let best = 0, mid = pts[0];
      for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); if (l > best) { best = l; mid = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]; } }
      if (near) out.alt.push({ key: "d:" + d.id + bid, kind: "alt", text: d.id + " · " + d.agent + " · declared", binding: d.binding, anchor: [ox + mid[0], oy + mid[1]], prio: 8 });
    }
    for (const t of d.touches) if (!cover.has(t) && P.E[t]) {
      const [x, y] = L(P.E[t].x, P.E[t].y), rr = r + lw * 0.9 + 1.5;
      el("t:" + d.id + ":" + t, "path", { d: "M" + f1(x - rr) + " " + f1(y) + "A" + f1(rr) + " " + f1(rr) + " 0 0 " + (sd > 0 ? 0 : 1) + " " + f1(x + rr) + " " + f1(y), class: "dc-aline dc-touch", style: "--h:" + hue + ";stroke-width:" + f1(lw * 0.8), "data-binding": d.binding });
    }
  }

  // Transit maps name every stop. The short names keep Acquit's fourteen stops inside the 20-word plant budget;
  // the full name and reading sit under Alt.
  const SHORT = { kiln: "model calls", api: "acquit-api" };
  for (const e of merge ? [] : P.ents) {
    const [x, y] = L(e.x, e.y), sx = ox + x, sy = oy + y;
    const g = el("s:" + e.id, "g", { transform: "translate(" + f1(x) + " " + f1(y) + ")", class: "dc-st " + e.state + (r < 3 ? " tiny" : "") + (hot.has(e.id) ? " dc-hot" : "") + on(e.binding), "data-binding": e.binding,
      "data-hit": real && near ? e.binding : null, style: hot.has(e.id) ? "--h:" + tHue(blast.session) : null });
    const shape = el("s:" + e.id + "/o", e.dock ? "rect" : "circle", e.dock ? { x: f1(-r * 0.9), y: f1(-r * 0.9), width: f1(r * 1.8), height: f1(r * 1.8), rx: f1(r * 0.4) } : { r: r.toFixed(2) }, g);
    if (r >= 6.5) el("s:" + e.id + "/g", "path", { d: tGlyph(e.kind), transform: "scale(" + (r * 0.56).toFixed(2) + ")", class: "dc-gl", "vector-effect": "non-scaling-stroke" }, g);
    if (!near) continue;
    out.obst.push([sx - r - 2, sy - r - 2, sx + r + 2, sy + r + 2]);
    const reading = e.reading || "", fail = e.state === "fail";
    const text = (lvl === "machine" ? e.name : SHORT[e.id] || e.id) + ((fail || lvl === "machine") && reading ? " · " + reading : "");
    out.items.push({ key: "n:" + P.id + e.id, kind: "name", text, binding: e.binding, anchor: [sx, sy], gap: r + 3, prio: fail ? 1.8 : 4, hit: real ? e.binding : null, cls: fail ? "dc-failn" : "" });
    if (lvl !== "machine" && (reading || e.name !== text) && !fail) out.alt.push({ key: "n:" + P.id + e.id, kind: "alt", text: e.name + (reading ? " · " + reading : ""), binding: e.binding, anchor: [sx, sy], gap: r + 3, prio: 6 });
  }

  if (real && near) for (const w of D.moment.witnesses) {
    const e = P.E[w.entity];
    if (!e) continue;
    const [x, y] = L(e.x, e.y), px = x - r * 0.95 - 2, py = y + r * 0.95 + 2;
    const broken = st.clashes.some((cl) => cl.state === "open" && cl.breaks === w.id);
    el("w:" + w.id, "path", { d: w.polarity === "must-not" ? "M" + f1(px - 4.5) + " " + f1(py - 3.5) + "H" + f1(px + 4.5) + "L" + f1(px) + " " + f1(py + 4.5) + "Z" : "M" + f1(px - 4) + " " + f1(py) + "a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",
      class: "dc-pin " + w.polarity + (broken ? " broken" : ""), "data-binding": w.binding, "data-hit": w.binding });
    out.obst.push([ox + px - 5, oy + py - 5, ox + px + 5, oy + py + 5]);
    out.alt.push({ key: "w:" + w.id, kind: "alt", text: D.bindings[w.binding].entity, binding: w.binding, anchor: [ox + px, oy + py], gap: 7, prio: 7 });
  }

  for (const cl of real ? st.clashes : []) {
    const e = P.E[cl.at.entity];
    if (!e || lvl === "org") continue;
    const [x, y] = L(e.x, e.y), ds = cl.state === "advisory" ? 5 : near ? 8 : 6, k = (r * 0.8 + ds) * 0.78, cx = x + k, cy = y - k;
    const g = el("c:" + cl.id, "g", { transform: "translate(" + f1(cx) + " " + f1(cy) + ")", class: "dc-clash " + cl.state + on(cl.binding), "data-binding": cl.binding, "data-hit": cl.state === "advisory" ? null : cl.binding });
    el("c:" + cl.id + "/d", "path", { d: "M0 " + -ds + "L" + ds + " 0L0 " + ds + "L" + -ds + " 0Z", class: "dc-dia" }, g);
    if (cl.breaks && cl.state === "open") el("c:" + cl.id + "/i", "path", { d: "M0 " + f1(-ds * 0.42) + "L" + f1(ds * 0.42) + " 0L0 " + f1(ds * 0.42) + "L" + f1(-ds * 0.42) + " 0Z", class: "dc-dia-in" }, g);
    out.obst.push([ox + cx - ds - 2, oy + cy - ds - 2, ox + cx + ds + 2, oy + cy + ds + 2]);
    if (near && cl.title && cl.breaks && cl.state === "open") out.items.push({ key: "ct:" + cl.id, kind: "mark", cls: "dc-ctitle", text: cl.title, binding: cl.binding, anchor: [ox + cx, oy + cy], gap: ds + 4, prefer: "above", prio: 2, hit: cl.binding });
    out.alt.push({ key: "c:" + cl.id, kind: "alt", text: cl.id + " · " + D.bindings[cl.binding].value + (cl.state === "settled" ? " · settled" : ""), binding: cl.binding, anchor: [ox + cx, oy + cy], gap: ds + 4, prio: 5 });
  }

  // Agents: a working agent is a train at the end of its own line; anyone else is a still puck at its fixture spot,
  // tied to the station it targets. Waiting on you adds the amber ring that fills over an hour.
  for (const ag of real ? st.agents : []) {
    const hue = tHue(ag.session), tgt = P.E[ag.target], line = !small && ends[ag.session + ">" + ag.target];
    const waits = ag.state === "waiting" && ag.waitsOn === "you", stopped = ag.state === "stopped";
    const idle = !waits && !stopped && ag.state !== "working";
    let px, py;
    if (line) {
      const n = line.length, p1 = line[n - 1], p0 = line[n - 2], len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) || 1;
      const tl = Math.max(lw * 4, 10), th = Math.max(lw * 2, 5), back = Math.min(len * 0.6, r + tl / 2 + 3);
      px = p1[0] - ((p1[0] - p0[0]) / len) * back; py = p1[1] - ((p1[1] - p0[1]) / len) * back;
      const ang = (Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180) / Math.PI;
      el("a:" + ag.session, "rect", { x: f1(-tl / 2), y: f1(-th / 2), width: f1(tl), height: f1(th), rx: f1(th / 2), transform: "translate(" + f1(px) + " " + f1(py) + ") rotate(" + ang.toFixed(1) + ")",
        class: "dc-train" + (stopped ? " stopped" : "") + on(ag.binding), style: "--h:" + hue, "data-binding": ag.binding, "data-hit": ag.binding });
    } else {
      [px, py] = L(ag.x, ag.y);
      const pr = small ? 3.2 : Math.max(lw * 1.6, 4.5);
      if (tgt && near) {
        const [tx, ty] = L(tgt.x, tgt.y), dd = Math.hypot(tx - px, ty - py) || 1, ux = (tx - px) / dd, uy = (ty - py) / dd;
        el("al:" + ag.session, "path", { d: "M" + f1(px + ux * (pr + 5)) + " " + f1(py + uy * (pr + 5)) + "L" + f1(tx - ux * (r + 3)) + " " + f1(ty - uy * (r + 3)), class: "dc-link", "data-binding": ag.binding });
      }
      if (waits) {
        const rr = pr + (small ? 2.5 : 4.5);
        el("ar0:" + ag.session, "circle", { cx: f1(px), cy: f1(py), r: f1(rr), class: "dc-rtrack", "data-binding": ag.binding });
        el("ar:" + ag.session, "path", { d: tArc(px, py, rr, Math.min(1, (ag.waitedMin || 0) / 60)), class: "dc-ring", "data-binding": ag.binding });
      }
      el("a:" + ag.session, "circle", { cx: f1(px), cy: f1(py), r: f1(pr), class: "dc-puck" + (ag.passive ? " passive" : "") + (idle ? " idle" : "") + (stopped ? " stopped" : "") + on(ag.binding), style: "--h:" + hue, "data-binding": ag.binding, "data-hit": near ? ag.binding : null });
    }
    if (!near) continue;
    const sx = ox + px, sy = oy + py;
    out.obst.push([sx - 11, sy - 11, sx + 11, sy + 11]);
    const holds = K2.lease.holder === ag.session;
    // The holder chip sits directly over the order flag, which already names the agent; it keeps only the evidence.
    const parts = holds && near && String(K2.order.flag).includes(ag.agent) ? [] : [ag.agent];
    if (!ag.passive && ag.state !== "yields") parts.push(ag.evidence);
    if (waits) parts.push("waiting on you", (ag.waitedMin || 0) + "m");
    else if (ag.state === "yields") parts.push("yields");
    else if (stopped) parts.push("stopped");
    else if (ag.state === "waiting") parts.push(String(ag.activity).split(" · ").pop());
    const chip = { key: "ag:" + ag.session, kind: "mark", text: parts.join(" · "), binding: ag.binding, hue, preW: 2, cls: waits ? "dc-wait" : idle || stopped ? "dc-idle" : "", anchor: [sx, sy], gap: 12, prio: holds ? 0 : waits ? 1 : 2.5, far: true, hit: ag.binding };
    out.items.push(chip);
    if (holds) out.holder = chip;
    out.alt.push({ key: "ag:" + ag.session, kind: "alt", text: ag.session + " · " + ag.activity, binding: ag.binding, anchor: [sx, sy], gap: 12, prio: 5 });
  }

  // While away: a dot on every station that changed, with the minute it changed.
  if (!P.stub && st.back) for (const it of st.fresh) if (it.plant === P.of && P.E[it.machine]) {
    const e = P.E[it.machine], [x, y] = L(e.x, e.y), dx = x - r * 0.75 - 1, dy = y - r * 0.75 - 1;
    el("new:" + it.id, "circle", { cx: f1(dx), cy: f1(dy), r: small ? 3 : 4.5, class: "dc-new", "data-binding": it.binding, "data-hit": it.binding });
    if (near) out.items.push({ key: "new:" + it.id, kind: "mark", cls: "dc-newt", text: it.at, binding: it.binding, anchor: [ox + dx, oy + dy], gap: 7, prio: 3, hit: it.binding });
  }

  // Names, honesty values and counts.
  const nameIt = near ? { key: "name:" + P.id, kind: "name", text: P.name, binding: P.binding, cands: [[ox + 6, oy + 4], [ox + 6, oy - 20]], anchor: [ox, oy], prio: 5 }
    : { key: "name:" + P.id, kind: "name", text: P.name, binding: P.binding, anchor: [(a[0] + b[0]) / 2, b[1]], prefer: "below", gap: 4, prio: 0.2, hit: P.stub ? null : P.binding };
  out.items.push(nameIt);
  if (!P.stub) out.alt.push({ key: "fr:" + P.id, kind: "alt", text: P.freshness, binding: P.binding, anchor: near ? [ox + 6, oy + 30] : [(a[0] + b[0]) / 2, b[1] + 22], prefer: "below", gap: 4, prio: 6 });
  if (small && !P.stub) {
    const n = st.waiting[P.of] || 0, oc = real ? st.openClashes : 0;
    if (n) out.items.push({ key: "wb:" + P.id, kind: "mark", cls: "dc-badge dc-wait", text: String(n), binding: P.binding, cands: [[b[0] + 5, a[1] - 2], [a[0] - 34, a[1] - 2]], anchor: [b[0], a[1]], prio: 0, hit: P.binding });
    if (oc) out.items.push({ key: "cb:" + P.id, kind: "mark", cls: "dc-badge dc-ctitle", pre: '<svg class="dc-diai" viewBox="-6 -6 12 12"><path d="M0 -5L5 0L0 5L-5 0Z"/></svg>', preW: 14, text: String(oc), binding: "clash:c1", cands: [[b[0] + 5, a[1] + 22], [a[0] - 48, a[1] + 22]], anchor: [b[0], a[1]], prio: 0.05, hit: "clash:c1" });
    if (real) {
      const dots = st.agents.map((ag) => '<i class="dc-dot' + (ag.state === "waiting" && ag.waitsOn === "you" ? " dc-dw" : ag.state === "working" ? "" : " dc-di") + '" style="--h:' + tHue(ag.session) + '"></i>').join("");
      out.items.push({ key: "dots:" + P.id, kind: "name", cls: "dc-dots", text: "", pre: dots, preW: st.agents.length * 12, binding: P.binding, follow: nameIt, prio: 0.3 });
    }
  }
  if (real) {
    const ok = st.kv === "ok", lease = st.leaseLeft;
    const ring = ok ? tRingSvg(lease / st.lease.leaseS, "") : st.kv === "stale" ? tRingSvg(0, "stale") : tRingSvg(0.999, "unmatched");
    const pp = P.E[D.moment.order.on], at = near ? L(pp.x, pp.y) : [sw / 2, 0];
    // The order flag hangs under the lease holder's chip, so who holds the claim and what Acan read back read as one stack.
    const flag = { key: "flag", kind: "mark", cls: "dc-flag " + st.kv, pre: ring, preW: 17 + (ok ? 2 : 0), text: K2.order.flag, binding: ok ? D.moment.order.binding : K2.binding, hue: ok ? tHue(st.lease.holder) : null,
      anchor: [ox + at[0], oy + at[1]], gap: near ? r + 16 : 6, prefer: "above", prio: near ? 0.01 : 0.5, far: true, follow: near ? out.holder : null, up: !near };
    out.items.push(flag);
    const second = ok ? D.moment.order.readback : K2.holderRow;
    if (second && (near || ok)) out.items.push({ key: "rb", kind: "mark", cls: "dc-rb" + (ok ? "" : " dc-wait"), text: second, binding: ok ? D.moment.order.binding : K2.binding, follow: flag, up: !near, prio: near ? 0.02 : 0.51, far: true });
  }
}

// Off-screen blockers clamp to the edge of the free rect, pointing at what waits.
export function tBeacons(c, st, out, card) {
  const { D, S } = c;
  if (S.level === "org") return;
  const fr = freeRect(c.W, c.H, { rail: "none", card: !!card });
  const x0 = fr.x, y0 = fr.y, x1 = fr.x + fr.w, y1 = fr.y + fr.h;
  const shown = (x, y) => x >= 16 && x <= c.W - 16 && y >= 100 && y <= c.H - 64 && !(card && x >= card[0] - 8 && y <= card[3] + 8);
  const P = (id) => D.plants.find((p) => p.id === id);
  const local = (pid, lx, ly) => { const p = P(pid); return c.project(p.origin[0] + lx, p.origin[1] + ly); };
  const list = [];
  for (const ag of st.agents) if (ag.state === "waiting" && ag.waitsOn === "you") list.push({ key: ag.session, text: ag.agent + " · " + ag.waitedMin + "m", binding: ag.binding, at: local("acquit", ag.x, ag.y), cls: "dc-wait", hue: tHue(ag.session) });
  for (const cl of st.clashes) if (cl.state === "open" && cl.severity === "blocking") { const e = D.moment.machines.find((m) => m.id === cl.at.entity); list.push({ key: cl.id, text: cl.id + " · blocking", binding: cl.binding, at: local("acquit", e.x, e.y), cls: "dc-ctitle" }); }
  for (const p of D.plants) if (p.id !== "acquit" && st.waiting[p.id]) list.push({ key: p.id, text: p.name + " · " + st.waiting[p.id], binding: p.binding, at: c.project((p.rect[0] + p.rect[2]) / 2, (p.rect[1] + p.rect[3]) / 2), cls: "dc-wait" });
  for (const it of st.fresh) if (it.plant !== "acquit") { const p = P(it.plant); list.push({ key: it.id, text: it.at + " · " + p.name, binding: it.binding, at: c.project((p.rect[0] + p.rect[2]) / 2, (p.rect[1] + p.rect[3]) / 2), cls: "dc-newb" }); }
  for (const bc of list) {
    const [ax, ay] = bc.at;
    if (shown(ax, ay)) continue;
    const w = tW(c.T, bc.text, "beacon") + 15 + (bc.hue ? 2 : 0), h = 20;
    const cx = tClamp(ax, x0 + 4, x1 - 4), cy = tClamp(ay, y0 + 4, y1 - 4);
    const bx = tClamp(cx - w / 2, x0 + 4, x1 - w - 4), by = tClamp(cy - h / 2, y0 + 4, y1 - h - 4);
    const deg = (Math.atan2(ay - (by + h / 2), ax - (bx + w / 2)) * 180) / Math.PI;
    out.items.push({ key: "bc:" + bc.key, kind: "beacon", cls: "dc-beacon " + bc.cls, text: bc.text, binding: bc.binding, hue: bc.hue || null,
      pre: '<svg class="dc-arr" viewBox="-5 -5 10 10" style="transform:rotate(' + deg.toFixed(0) + 'deg)"><path d="M-3.5 -3.8L4 0L-3.5 3.8Z"/></svg>', preW: 15 + (bc.hue ? 2 : 0),
      cands: [[bx, by], [bx, by + h + 4], [bx, by - h - 4], [bx - w - 4, by], [bx + w + 4, by]], anchor: [bx, by], prio: 1.5, hit: bc.binding.startsWith("away:") ? bc.binding : bc.binding.startsWith("plant:") ? bc.binding : bc.binding });
  }
}

export function tLabel(T, c, it) {
  const cls = it.kind === "mark" || it.kind === "beacon" ? "dir-c-mark" : it.kind === "name" ? "dc-name" : "dc-alt";
  const e = tAt(tEl(T, c.plane, "l:" + it.key + (it.kind === "alt" ? "/alt" : ""), "div"), { class: "dc-lab " + cls + (it.cls ? " " + it.cls : "") + (it.hue ? " hue" : "") + (c.S.hover && it.hit === c.S.hover ? " dc-on" : ""),
    "data-binding": it.binding, "data-hit": it.hit || null, style: "transform:translate(" + it.pos[0] + "px," + it.pos[1] + "px)" + (it.hue ? ";--h:" + it.hue : "") });
  const html = (it.pre || "") + "<span>" + tEsc(it.text) + "</span>";
  if (e._h !== html) { e._h = html; e.innerHTML = html; }
  if (it.anchor && !it.follow && !it.cands) {
    const [ax, ay] = it.anchor, [x0, y0, x1, y1] = it.pos, nx = tClamp(ax, x0, x1), ny = tClamp(ay, y0, y1), d = Math.hypot(nx - ax, ny - ay);
    if (d > (it.gap || 6) + 14) tAt(tEl(T, c.plane, "ld:" + it.key, "div"), { class: "dc-lead", "data-binding": it.binding, style: "width:" + d.toFixed(1) + "px;transform:translate(" + ax.toFixed(1) + "px," + ay.toFixed(1) + "px) rotate(" + Math.atan2(ny - ay, nx - ax).toFixed(3) + "rad)" });
  }
}

// The right-slot card: a clash, the away brief, or the Kvarm network log. Rows hold only what the map cannot show.
export function tCard(c, st) {
  const { D, S } = c;
  let card = document.getElementById("dir-c-card");
  if (!card) { card = document.createElement("aside"); card.id = "dir-c-card"; document.body.append(card); }
  card.hidden = !S.card;
  if (!S.card) return null;
  const E = tEsc, row = (b, inner, extra) => '<li data-binding="' + b + '"' + (extra || "") + ">" + inner + "</li>";
  let binding, html;
  if (S.card === "away") {
    binding = D.away.binding;
    const off = D.away.items.filter((i) => i.plant !== "acquit"), pub = D.away.items.filter((i) => i.plant === "acquit" && i.at && i.at < D.away.from.slice(0, 5));
    const onMap = D.away.items.filter((i) => i.plant === "acquit" && !pub.includes(i));
    html = "<header><h3>" + E(D.away.title) + "</h3><kbd>Esc</kbd></header><ul>"
      + off.map((i) => row(i.binding, '<span class="dc-t">' + E(i.at || "") + "</span><span>" + E(i.row) + ' <em class="dc-where">' + E(D.plants.find((p) => p.id === i.plant).name) + "</em></span>")).join("")
      + pub.map((i) => row(i.binding, '<span class="dc-t">' + E(i.at) + "</span><span>" + E(i.row) + "</span>")).join("")
      + row(D.away.binding, '<span class="dc-t">map</span><span class="dc-chips">' + onMap.map((i) => '<span class="dc-chip" data-binding="' + i.binding + '">' + E(i.machine === "bot-cx" ? "Codex " + i.codexWaitedMin + " min" : i.machine + " " + i.at) + "</span>").join("") + "</span>")
      + "</ul>";
  } else if (S.card === "net") {
    binding = "kvarm:indicator";
    let rows;
    if (st.kv === "ok") rows = D.events.filter((e) => e.at <= S.at && e.rows.length).slice(-5).map((e) => { const ops = [...new Set(e.rows.map((r) => r.op))].join(", "), by = e.rows.reduce((s, r) => s + (r.bytes || 0), 0); return row(e.binding, '<span class="dc-t">' + E(e.clock.slice(0, 5)) + '</span><span class="dc-op">' + E(ops) + '</span><span class="dc-b">' + by.toLocaleString("en-US") + " B</span>"); });
    else rows = st.K.ledger.slice(-5).map((r) => row(r.binding, '<span class="dc-t">' + E((r.at || "").slice(0, 5)) + '</span><span class="dc-op">' + E(r.op + (r.result ? " · " + r.result : "")) + '</span><span class="dc-b">' + r.bytes.toLocaleString("en-US") + " B</span>"));
    html = "<header><h3>Network log</h3><span class=\"dc-kv\">Kvarm · " + E(st.K.indicator.label) + "</span><kbd>Esc</kbd></header><ul>" + rows.join("")
      + row("egress:total", '<span class="dc-t">total</span><span class="dc-op">' + E(S.shell ? S.shell.egress : "") + "</span>") + "</ul>";
  } else {
    const cl = D.moment.clashes.find((x) => x.binding === S.card) || D.moment.clashes[0];
    binding = cl.binding;
    const live = st.clashes.find((x) => x.id === cl.id), state = live ? live.state : "open";
    const decl = (id) => D.moment.declarations.find((d) => d.id === id);
    const first = (s) => s.split(/(?<=\.)\s/)[0];
    const w = cl.breaks && D.moment.witnesses.find((x) => x.id === cl.breaks);
    html = '<header><span class="dc-sev ' + state + '">' + E(state === "open" ? cl.severity.toUpperCase() : state.toUpperCase()) + "</span><h3>" + E(cl.title || cl.id) + "</h3><kbd>Esc</kbd></header><ul>"
      + (cl.breaksRow ? row(cl.binding, '<i class="dc-dia-r"></i><span>' + E(cl.breaksRow) + "</span>") : "")
      + cl.decls.map((id) => { const d = decl(id); return row(d.binding, '<i class="dc-sw"></i><span><b>' + E(d.agent + " · " + d.id) + "</b> " + E(first(d.asserts)) + "</span>", ' style="--h:' + tHue(d.session) + '"'); }).join("")
      + (w ? row(w.binding, '<i class="dc-pin-r"></i><span>' + E(w.id + " · " + w.check) + "</span>") : "")
      + row(cl.binding, '<span class="dc-opts">' + cl.options.map((o) => '<span class="dc-opt' + (o.kind === cl.suggested ? " sug" : "") + '">' + E(o.label) + (o.kind === cl.suggested ? " · suggested" : "") + "</span>").join("") + "</span>", ' class="dc-optrow"')
      + "</ul>";
  }
  card.dataset.binding = binding;
  if (card._h !== html) { card._h = html; card.innerHTML = html; }
  return [c.W - 408, 100, c.W - 16, 100 + card.offsetHeight];
}

// Motion only for events crossed while the stream plays; each one briefly marks the thing it changed.
export function tMotion(T, fired) {
  const flash = [{ opacity: 0.15 }, { opacity: 1 }];
  const pulse = (key, kf, ms) => { const e = T.pool.get(key); if (e && e.animate) e.animate(kf || flash, { duration: ms || 480, easing: "cubic-bezier(.2,.7,.2,1)" }); };
  for (const ev of fired) {
    const k = ev.kind;
    if (k === "heartbeat" || k === "claim") pulse("l:flag", null, 500);
    else if (k === "declarations") { for (const [key, e] of T.pool) if (key.startsWith("p:acquit/d:") && e.getTotalLength) { const n = e.getTotalLength(); e.animate([{ strokeDasharray: n + " " + n, strokeDashoffset: n }, { strokeDasharray: n + " " + n, strokeDashoffset: 0 }], { duration: 600, easing: "ease-out" }); } }
    else if (k === "settle") pulse("p:acquit/c:c2");
    else if (k === "advice") pulse("p:acquit/s:breaker");
    else if (k === "away-item") pulse(ev.id === "ci-418" ? "p:acquit/s:radar" : ev.id === "artifact" ? "p:site" : "p:acquit/s:breaker");
    else if (k === "readback") pulse("p:acquit/a:" + (ev.id === "readback-cc" ? "claude-payouts" : "droid-payouts"));
    else if (k === "bench") pulse("p:acquit/c:c1");
    else if (k === "review") pulse("p:acquit/s:paypal");
    else if (k === "answer") pulse("p:acquit/s:sqlite");
    else pulse("l:name:acquit");
  }
}
