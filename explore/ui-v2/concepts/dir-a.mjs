// Direction A, Live paper (direction/00-synthesis.md, memo-opus.md section 5C). Each plant is the anatomy kit's white
// paper model on one infinite plane. Agents are the only saturated marks, machines stay grey until abnormal, and words
// sit in fixed-size labels culled by priority, with every other word one held Alt away.
import { directionStub } from "./dir-base.mjs";
import { ART } from "./dir-a-art.mjs";

const ID = "dir-a", P = `body[data-concept="${ID}"]`, Q = `${P} #${ID}-plane`;

// lib entries are inlined by their source text, so an object whose source is a declaration carries the prerendered
// plant art and the page-side caches into the page.
const pageConsts = { toString: () => "const ART = " + JSON.stringify(ART).replace(/</g, "\\u003c") + ";\nconst AS = { nodes: {}, stubs: [], labels: new Map(), fly: 0, card: null, ink: null, goto: null, bk: null, blocks: [], sizes: new Map(), inkCam: null };" };

function aEsc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]); }
function aHue(agent) { return agent === "Claude Code" ? "claude" : agent === "Droid" ? "droid" : agent === "Codex" ? "codex" : "you"; }

// Everything the map shows at S.at under S.kv, derived from the event stream the way the base derives the shell.
function aModel(ctx) {
  const { D, S } = ctx, mk = S.at + "|" + S.kv;
  if (AS.m && AS.mk === mk) return AS.m;
  AS.mk = mk;
  return (AS.m = aModelAt(ctx));
}
function aModelAt(ctx) {
  const { D, S } = ctx, kv = D.kv[S.kv], past = D.events.filter((e) => e.at <= S.at), q = [];
  for (const e of past) { for (const a of e.queue.add || []) q.push(a); for (const d of e.queue.drop || []) q.splice(q.indexOf(d), 1); }
  const declared = past.some((e) => e.id === "declarations");
  const clashes = D.moment.clashes.filter((c) => declared && kv.clashes.includes(c.id) && (c.severity !== "blocking" || q.includes(c.id)));
  const snap = S.at >= D.at.back ? D.away.onReturn.agents : S.at >= D.at.away ? D.away.departure.agents : D.moment.agents;
  const agents = snap.map((a) => ({ ...a, ...(kv.agents[a.session] || {}), override: !!(kv.agents[a.session] && kv.agents[a.session].activity) }));
  const rows = {};
  for (const r of [...D.moment.queue.rows, ...D.away.departure.queue.rows, ...D.away.onReturn.queue.rows]) rows[r.id] = r;
  const waiting = {};
  for (const id of q) { const p = (rows[id] && rows[id].plant) || "acquit"; waiting[p] = (waiting[p] || 0) + 1; }
  const back = S.at >= D.at.back;
  return { kv, q, declared, clashes, agents, waiting, back, away: back ? D.away.items : [] };
}

function aGeo(ctx) {
  const { D, S, project } = ctx, vw = innerWidth, vh = innerHeight, P = {};
  for (const p of D.plants) P[p.id] = p;
  // Plant-local ground units (x, y, height) to screen px: the art's iso basis, then the plane camera.
  const W = (pid, x, y, z = 0, origin = P[pid].origin) => {
    const a = ART.plants[pid], b = a.b;
    return project(origin[0] + a.C[0] + x * b[0][0] + y * b[1][0] + z * b[2][0], origin[1] + a.C[1] + x * b[0][1] + y * b[1][1] + z * b[2][1]);
  };
  const ppu = S.camera.ppu;
  return { P, W, vw, vh, ppu, zs: Math.max(0.6, Math.min(1.4, ppu / 1.9)), free: { l: 16, t: 100, r: S.card ? vw - 416 : vw - 16, b: vh - 64 } };
}

// Plant nodes are created once and sized in plane units, so a camera move is one transform per node: no layout, and
// the F2 sweep keeps the same elements. The detailed model shows once a site is 300 px wide; below that the white
// footprint silhouette stands in, and offscreen art is culled.
function aPlantNode(ctx, p, of, real) {
  const n = document.createElement("div"), a = ART.plants[of];
  const at = `left:${(p.origin[0] + a.tl[0] - p.rect[0]).toFixed(2)}px;top:${(p.origin[1] + a.tl[1] - p.rect[1]).toFixed(2)}px`;
  const svg = (lod, body) => `<svg class="dir-a-art" data-lod="${lod}" style="${at}" viewBox="0 0 ${a.size[0]} ${a.size[1]}" width="${a.size[0]}" height="${a.size[1]}">${body}</svg>`;
  n.className = "dir-a-plant" + (real ? "" : " stub");
  n.dataset.binding = real ? p.binding : "plant:" + of;
  if (real) n.dataset.plant = p.id; else n.dataset.stub = p.id;
  n.style.width = p.rect[2] - p.rect[0] + "px";
  n.style.height = p.rect[3] - p.rect[1] + "px";
  n.innerHTML = svg(1, a.art) + svg(0, a.sil);
  n._art = [n.children[0], n.children[1]];
  n._lod = null;
  ctx.plane.insertBefore(n, AS.ink);
  return n;
}

function aPlants(ctx, G) {
  const { D, project } = ctx, k = G.ppu, sc = k.toFixed(5);
  const list = [...D.plants.map((p) => [p, AS.nodes[p.id], p.id]), ...AS.stubs.map((s) => [s.p, s.n, s.p.of])];
  for (const [p, n, of] of list) {
    const a = ART.plants[of], [x0, y0] = project(p.rect[0], p.rect[1]);
    const ax = x0 + (p.origin[0] + a.tl[0] - p.rect[0]) * k, ay = y0 + (p.origin[1] + a.tl[1] - p.rect[1]) * k;
    const lod = ax < G.vw && ay < G.vh && ax + a.size[0] * k > 0 && ay + a.size[1] * k > 0 ? ((p.rect[2] - p.rect[0]) * k >= 300 ? 1 : 0) : -1;
    // A culled stub has nothing to show, so its box is left where it was.
    if (lod >= 0 || n.dataset.plant) n.style.transform = `translate(${x0.toFixed(1)}px,${y0.toFixed(1)}px) scale(${sc})`;
    if (n._lod !== lod) { n._lod = lod; n._art[0].style.display = lod === 1 ? "" : "none"; n._art[1].style.display = lod === 0 ? "" : "none"; }
  }
}

// Island, hint, card and Go to rects, read only when one of them can have changed, never per camera move.
function aBlocks(ctx, G) {
  const { S } = ctx, key = [G.vw, G.vh, S.card, AS.card && AS.card._k, AS.goto && AS.goto.hidden, S.shell.egress, S.shell.waiting].join("|");
  if (AS.bk !== key) {
    AS.bk = key;
    AS.blocks = [...document.querySelectorAll(".fl,body>.hint,#dir-a-card,#dir-a-goto")].filter((e) => e.getClientRects().length && (!e.checkVisibility || e.checkVisibility({ opacityProperty: true, visibilityProperty: true }))).map((e) => { const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; });
  }
  G.blocks = AS.blocks;
  G.seen = (x, y) => x >= 8 && x <= G.vw - 8 && y >= 8 && y <= G.vh - 8 && !G.blocks.some((q) => x >= q.l && x <= q.r && y >= q.t && y <= q.b);
}

// Where an away item marks the map, or null when its machine has no drawing or sits outside the free area.
function aAwaySpot(G, it, rect) {
  const a = ART.plants[it.plant], e = a && a.ents[it.machine];
  if (!e) return null;
  const [x, y] = G.W(it.plant, e[0], e[1], e[4] + 6), F = G.free;
  if (x < F.l || x > G.vw - 16 || y < F.t || y > F.b) return null;
  if (rect && x >= rect.left - 8 && x <= rect.right + 8 && y >= rect.top - 8 && y <= rect.bottom + 8) return null;
  return [x, y];
}

// The Acquit overlay: territories, the c1 tints and pin, blast radius, away marks and agent bodies, drawn in screen px
// inside the Acquit node. Returns the label items for aLabels.
function aOverlay(ctx, m, G) {
  const { D, S } = ctx, lvl = S.level, org = lvl === "org", near = lvl === "plant" || lvl === "machine", z = G.zs;
  const f = (n) => n.toFixed(1), pt = (x, y, h = 0) => G.W("acquit", x, y, h);
  const path = (pts, h = 0, pid = "acquit") => pts.map((p, i) => (i ? "L" : "M") + G.W(pid, p[0], p[1], h).map(f).join(" ")).join("");
  const box = (b, h = 0) => path([[b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]]], h) + "Z";
  const ell = (x, y, r, pid = "acquit") => { const pts = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } return path(pts, 0, pid) + "Z"; };
  const E = ART.plants.acquit.ents, kv = m.kv, items = [], svg = [];
  const g = (binding, cls, body, extra = "") => svg.push(`<g class="${cls}" data-binding="${binding}"${extra}>${body}</g>`);
  const hueOf = (name) => ` style="--hue:var(--hue-${name})"`;
  const alt = (key, binding, html, cands) => items.push({ key: "alt:" + key, binding, cls: "", html, alt: true, on: S.hover === binding, prio: 9, cands });
  const sideCands = (x, y, r) => [[x + r + 4, y, 0, -0.5], [x - r - 4, y, -1, -0.5], [x, y - r - 4, -0.5, -1], [x, y + r + 4, -0.5, 0]];
  const proj = (x, y) => ctx.project(x, y);
  const belt = D.moment.belts.find((b) => b.id === "api->paypal"), brk = D.moment.machines.find((x) => x.id === "breaker");
  const up = [belt.pts[0], [brk.x, brk.y]], down = [[brk.x, brk.y], ...belt.pts.slice(1)];
  const c1 = m.clashes.find((c) => c.id === "c1");

  // The drawing and its label spots are rebuilt only when what they show changes. Between rebuilds a camera move maps
  // the last drawing onto the new camera with one transform, so panning and zooming never re-parse SVG. Dot radii
  // follow the clamped zoom factor, so reuse stops once plain scaling is 20% off it (under a pixel on the org and site dots).
  const cam = S.camera, key = [lvl, S.hover, S.kv, S.at, S.card, S.frame].join("|");
  let B = AS.inkCam, kk = B ? cam.ppu / B.ppu : 0;
  if (!B || B.key !== key || Math.abs(kk / (org ? 1 : z / B.zs) - 1) > 0.2) {

  // Contracts between plants, edge to edge, only while plants read as footprints.
  if (!near) for (const c of D.contracts) {
    const ra = G.P[c.from].rect, rb = G.P[c.to].rect, ca = [(ra[0] + ra[2]) / 2, (ra[1] + ra[3]) / 2], cb = [(rb[0] + rb[2]) / 2, (rb[1] + rb[3]) / 2];
    const d = [cb[0] - ca[0], cb[1] - ca[1]];
    const exit = (r, c0, dir) => Math.min(...[0, 1].map((i) => (dir[i] > 0 ? (r[i + 2] - c0[i]) / dir[i] : dir[i] < 0 ? (r[i] - c0[i]) / dir[i] : Infinity)));
    const t0 = exit(ra, ca, d), t1 = 1 - exit(rb, cb, [-d[0], -d[1]]);
    if (t1 <= t0) continue;
    const a = proj(ca[0] + d[0] * t0, ca[1] + d[1] * t0), b = proj(ca[0] + d[0] * t1, ca[1] + d[1] * t1);
    svg.push(`<path class="contract" data-binding="${c.binding}" d="M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}"/>`);
    alt("contract:" + c.id, c.binding, aEsc(c.label), sideCands((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 2));
  }

  if (!org) for (const t of D.moment.territories) {
    const st = t.id === kv.territory.id ? kv.territory.state : t.state;
    const hue = st === "claimed" ? hueOf("claude") : t.owner === "Droid" ? hueOf("droid") : "";
    const defs = t.id === "gate-sessions" ? `<defs><pattern id="dir-a-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6"/></pattern></defs>` : "";
    g(t.binding, "terr", defs + `<path d="${box(ART.terr[t.id])}"/>`, ` data-state="${st}"${hue}`);
    if (near) { const b = ART.terr[t.id], c = pt(b[0], b[3]); alt("terr:" + t.id, t.binding, aEsc(t.id === kv.territory.id ? kv.territory.label : t.label), [[c[0], c[1] + 4, -0.5, 0], [c[0], c[1] - 4, -0.5, -1]]); }
  }

  if (c1 && !org) {
    // Two agents' footprints on one belt: Droid's d3 reaches the breaker from the api side, Claude Code's d1 holds
    // the run to paypal, and they meet at the c1 pin.
    const w = f(Math.max(6, 11 * z));
    g("decl:d3", "tint", `<path d="${path(up, 1.7)}" style="stroke-width:${w}px"/>`, hueOf("droid"));
    g("decl:d1", "tint", `<path d="${path(down, 1.7)}" style="stroke-width:${w}px"/>`, hueOf("claude"));
  }
  if (near && S.hover === "decl:d3" && m.declared) {
    const rings = D.moment.blast.downstream.map((id) => { const e = E[id]; return `<path class="foot" d="${ell(e[0], e[1], Math.max(e[2], e[3]) / 2 + 8)}"/>`; }).join("");
    g(D.moment.blast.binding, "blast", `<path class="band" d="${path(down, 1.7)}" style="stroke-width:${f(16 * z)}px"/><path class="core" d="${path(down, 1.7)}"/>${rings}`, hueOf("droid"));
    const [bx, by] = pt(brk.x, brk.y, 30);
    items.push({ key: "blast", binding: D.moment.blast.binding, cls: "dir-a-mark", hue: "droid", html: `<b>d3</b><span class="t"> downstream · ${aEsc(D.moment.blast.downstream.join(", "))}</span>`, prio: 0.8, must: true, cands: [[bx, by - 18, -0.5, -1], [bx - 20, by - 18, -1, -1], [bx + 20, by - 18, 0, -1]] });
    const d3 = D.moment.declarations.find((d) => d.id === "d3");
    alt("decl:d3", d3.binding, aEsc("d3 · " + d3.asserts), [[bx, by + 40, -0.5, 0], [bx - 30, by + 40, -1, 0]]);
  }

  // Away: the agent's ink trail to what it changed, a dashed ghost under the changed machine, and a new dot.
  for (const it of m.away) {
    const ent = ART.plants[it.plant].ents[it.machine];
    if (!ent || (org && it.plant !== "acquit")) continue;
    const who = it.session && m.agents.find((a) => a.session === it.session), hue = who ? aHue(who.agent) : "you";
    const [nx, ny] = G.W(it.plant, ent[0], ent[1], ent[4] + 6);
    let body = "";
    if (!org) body += `<path class="under" d="${ell(ent[0], ent[1], Math.max(ent[2], ent[3]) / 2 + 7, it.plant)}"/>`;
    if (!org && who && it.plant === "acquit" && Math.hypot(who.x - ent[0], who.y - ent[1]) > 40) {
      const a = pt(who.x, who.y, 0), b = pt(ent[0], ent[1], 0);
      body += `<path class="trail" d="M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}"/>`;
    }
    body += `<circle class="new" cx="${f(nx)}" cy="${f(ny)}" r="${f(org ? 3 : Math.max(3.5, 5 * z))}"/>`;
    g(it.binding, "away", body, hueOf(hue));
    // The change word names what happened at the dot; a waiting agent's own flag already says it.
    if (!org && !(who && who.state === "waiting")) items.push({ key: "chg:" + it.id, binding: it.binding, cls: "chg", hue, html: aEsc(it.change), prio: 2.5, must: true, cands: sideCands(nx, ny, 7) });
    if (!org) alt("away:" + it.id, it.binding, aEsc((it.at ? it.at + " · " : "") + it.row), [[nx, ny + 26, -0.5, 0], [nx, ny - 26, -0.5, -1], [nx + 30, ny + 14, 0, 0], [nx - 30, ny + 14, -1, 0]]);
  }

  for (const c of m.clashes) {
    if (c.severity === "advisory" && !near) continue;
    const e = E[c.at.entity], [bx, by] = pt(e[0], e[1], e[4]), [px, py] = org ? pt(e[0], e[1], 0) : pt(e[0], e[1], e[4] + 14);
    const r = org ? 4.5 : Math.max(4, (c.id === "c1" ? 8 : 6) * z);
    const stem = org ? "" : `<path class="stem" d="M${f(bx)} ${f(by)}L${f(px)} ${f(py + r)}"/>`;
    g(c.binding, "pin" + (c.severity === "advisory" ? " adv" : "") + (S.hover === c.binding ? " hov" : ""), stem + `<path d="M${f(px)} ${f(py - r)}L${f(px + r)} ${f(py)}L${f(px)} ${f(py + r)}L${f(px - r)} ${f(py)}Z"/>`, ` data-hover="${c.binding}"`);
    if (c.severity === "blocking" && !org && (near || c.id === "c1"))
      items.push({ key: "clash:" + c.id, binding: c.binding, cls: "dir-a-mark dir-a-clash", html: aEsc(c.id + (c.breaks ? " · breaks " + c.breaks : "")), prio: 1.5, must: true, cands: [[px + r + 6, py, 0, -0.5], [px - r - 6, py, -1, -0.5], [px, py - r - 6, -0.5, -1], [px, py + r + 6, -0.5, 0]] });
    if (near) alt("clash:" + c.id, c.binding, aEsc([c.title || c.id, c.breaksRow || c.severity].join(" · ")), [[px, py - r - 30, -0.5, -1], [px + r + 6, py + 22, 0, 0], [px - r - 6, py + 22, -1, 0]]);
  }

  for (const a of m.agents) {
    const hn = aHue(a.agent), waits = a.state === "waiting" && a.waitsOn === "you", hollow = !waits && a.state !== "working";
    const [gx, gy] = pt(a.x, a.y, 0), [tx, ty] = org ? [gx, gy] : pt(a.x, a.y, 18), r = org ? 3.2 : Math.max(4, 6.5 * z);
    let body = org ? "" : `<ellipse class="shadow" cx="${f(gx)}" cy="${f(gy)}" rx="${f(r * 1.3)}" ry="${f(r * 0.6)}"/><path class="stem" d="M${f(gx)} ${f(gy)}L${f(tx)} ${f(ty + r)}"/>`;
    if (waits) body += `<circle class="ring" cx="${f(tx)}" cy="${f(ty)}" r="${f(r + (org ? 3 : 4.5))}"/>`;
    body += `<circle class="body${hollow ? " hollow" : ""}${hollow && a.state !== "yields" ? " dashed" : ""}" cx="${f(tx)}" cy="${f(ty)}" r="${f(r)}"/>`;
    g(a.binding, "agent" + (S.hover === a.binding ? " hov" : ""), body, ` data-hover="${a.binding}"${hueOf(hn)}`);
    const act = waits || a.state === "yields" || a.override;
    const tail = (act ? " · " + a.activity : "") + (a.evidence && a.evidence !== "observed" ? " · " + a.evidence : "");
    if (near || waits) {
      const o = r + 3, fl = [[tx + o, ty - o, 0, -1], [tx + o, ty + o, 0, 0], [tx - o, ty - o, -1, -1], [tx - o, ty + o, -1, 0], [tx + o, ty - o - 22, 0, -1], [tx + o, ty + o + 22, 0, 0], [tx - o, ty - o - 22, -1, -1], [tx - o, ty + o + 22, -1, 0],
        [tx, ty - o - 26, -0.5, -1], [tx, ty + o + 26, -0.5, 0], [tx + o, ty + o + 46, 0, 0], [tx - o, ty + o + 46, -1, 0], [tx + o, ty - o - 46, 0, -1], [tx - o, ty - o - 46, -1, -1]];
      items.push({ key: "flag:" + a.session, binding: a.binding, cls: "dir-a-mark dir-a-flag" + (waits ? " wait" : ""), hue: hn, html: `<b>${aEsc(a.agent)}</b><span class="t">${aEsc(tail)}</span>`, prio: waits ? 1 : 3, must: true, cands: fl });
    }
    if (near) alt("agent:" + a.session, a.binding, aEsc([a.activity, a.readback && "readback " + a.readback, a.prompt, a.passive && "passive"].filter(Boolean).join(" · ")), [[tx, ty + r + 30, -0.5, 0], [tx, ty - r - 30, -0.5, -1], [tx + r + 40, ty, 0, -0.5], [tx - r - 40, ty, -1, -0.5]]);
  }

  if (near) {
    // The order flag and its readback source sit on the claimed territory, at its highest corner on screen.
    const b = ART.terr[kv.territory.id], top = [[b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]]].map(([x, y]) => pt(x, y)).reduce((p, c) => (c[1] < p[1] ? c : p));
    const flag = kv.order.flag, i = flag.indexOf(" · "), ob = S.kv === "ok" ? D.moment.order.binding : kv.binding;
    const second = S.kv === "ok" ? [D.moment.order.readback, D.moment.order.binding] : [kv.holderRow, "lease:g1"];
    items.push({ key: "order", binding: ob, cls: "dir-a-order", html: `<span class="dir-a-mark st-${S.kv}" data-binding="${ob}"><b>${aEsc(flag.slice(0, i))}</b>${aEsc(flag.slice(i))}</span><span class="dir-a-mark sub" data-binding="${second[1]}">${aEsc(second[0])}</span>`,
      prio: 0, must: true, cands: [[top[0], top[1] - 10, -0.5, -1], [top[0] + 30, top[1] - 10, 0, -1], [top[0] - 30, top[1] - 10, -1, -1], [top[0] + 60, top[1] - 40, 0, -1], [top[0] - 60, top[1] - 40, -1, -1]] });

    // Six roles carry names at rest; the rest of the machines answer under Alt or when they fail.
    const REST = ["intake", "gate", "api", "sqlite", "breaker", "paypal"];
    for (const mc of D.moment.machines) {
      const [x, y, w, d, top2] = E[mc.id], cs = [[x - w / 2, y - d / 2], [x + w / 2, y - d / 2], [x + w / 2, y + d / 2], [x - w / 2, y + d / 2]].map(([u, v]) => pt(u, v));
      const xs = cs.map((c) => c[0]), by = Math.max(...cs.map((c) => c[1])), [hx, hy] = pt(x, y, top2), cx = (Math.min(...xs) + Math.max(...xs)) / 2, my = (hy + by) / 2;
      const cands = [[cx, by + 3, -0.5, 0], [hx, hy - 4, -0.5, -1], [Math.max(...xs) + 4, my, 0, -0.5], [Math.min(...xs) - 4, my, -1, -0.5]];
      const fail = mc.state === "fail", name = mc.id === "kiln" ? mc.name : mc.id;
      if (REST.includes(mc.id) || fail) items.push({ key: "m:" + mc.id, binding: mc.binding, cls: "m", html: aEsc(name) + (fail ? ` <span class="r">${aEsc(mc.reading)}</span>` : ""), prio: fail ? 2 : 6, cands });
      alt("m:" + mc.id, mc.binding, aEsc(mc.name + " · " + mc.reading), [[cx, by + 22, -0.5, 0], [hx, hy - 24, -0.5, -1], [Math.max(...xs) + 4, my + 18, 0, -0.5], [Math.min(...xs) - 4, my + 18, -1, -0.5]]);
    }
    for (const w of D.moment.witnesses) { const [x, y, , , h] = E[w.entity], [wx, wy] = pt(x, y, h); alt("w:" + w.id, w.binding, aEsc(w.id + " · " + w.polarity + " · " + w.check), [[wx, wy - 26, -0.5, -1], [wx + 30, wy - 10, 0, -1], [wx - 30, wy - 10, -1, -1]]); }
  }

  // Plant names hang off the drawing's own box, which can be much smaller than the site at org level.
  if (!near) for (const p of D.plants) {
    const a = ART.plants[p.id], [x0, y0] = proj(p.origin[0] + a.tl[0], p.origin[1] + a.tl[1]), x1 = x0 + a.size[0] * G.ppu, y1 = y0 + a.size[1] * G.ppu;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, n = m.waiting[p.id] || 0;
    items.push({ key: "p:" + p.id, binding: p.binding, cls: "pn", html: aEsc(p.name) + (n ? ` <b class="n">${n}</b>` : ""), prio: n ? 1.2 : 5, must: !!n,
      cands: [[cx, y1 + 2, -0.5, 0], [cx, y0 - 2, -0.5, -1], [x1 + 4, cy, 0, -0.5], [x0 - 4, cy, -1, -0.5], [x1, y1, 0, 0], [x0, y1, -1, 0]] });
    if (p.condition) alt("p:" + p.id, p.binding, aEsc(p.condition), [[cx, y1 + 24, -0.5, 0], [cx, y0 - 24, -0.5, -1], [x1 + 4, cy + 20, 0, -0.5], [x0 - 4, cy + 20, -1, -0.5]]);
  }

    AS.ink.innerHTML = svg.join("");
    AS.ink.style.transform = "";
    B = AS.inkCam = { key, ppu: cam.ppu, cx: cam.cx, cy: cam.cy, sx: cam.sx, sy: cam.sy, zs: z, items };
    kk = 1;
  }
  const tx = cam.sx - B.sx * kk + (B.cx - cam.cx) * cam.ppu, ty = cam.sy - B.sy * kk + (B.cy - cam.cy) * cam.ppu, out = [];
  if (B.items === items) out.push(...items);
  else {
    AS.ink.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${kk.toFixed(5)})`;
    for (const it of B.items) out.push({ ...it, cands: it.cands.map(([x, y, fx, fy]) => [x * kk + tx, y * kk + ty, fx, fy]) });
  }

  // Edge beacons for blockers outside the free area, which shrinks while a card holds the right slot.
  const F = G.free, targets = [];
  const waiter = m.agents.find((a) => a.state === "waiting" && a.waitsOn === "you");
  if (waiter) targets.push([waiter.binding, pt(waiter.x, waiter.y, 18), waiter.agent, "wait"]);
  if (c1) targets.push([c1.binding, pt(brk.x, brk.y, 14), "c1", "fail"]);
  for (const it of m.away) if (it.plant !== "acquit") { const e = ART.plants[it.plant].ents[it.machine]; if (e) targets.push([it.binding, G.W(it.plant, e[0], e[1], e[4]), G.P[it.plant].name, "new"]); }
  for (const [b, [x, y], label, tone] of targets) {
    if (G.seen(x, y)) continue;
    const cx = Math.max(F.l + 6, Math.min(F.r - 6, x)), cy = Math.max(F.t + 6, Math.min(F.b - 6, y));
    const fx = x > F.r ? -1 : x < F.l ? 0 : -0.5, fy = y > F.b ? -1 : y < F.t ? 0 : -0.5;
    // The arrow turns by a style variable, so the label text and its measured size stay fixed while the camera moves.
    const rot = Math.round(Math.atan2(y - cy, x - cx) * 180 / Math.PI);
    out.push({ key: "beacon:" + b, binding: b, cls: "dir-a-mark dir-a-beacon " + tone + (fx === -1 ? " end" : ""), rot, html: `<span class="g" data-text="glyph">→</span><span>${aEsc(label)}</span>`, prio: 0.5, must: true, cands: [[cx, cy, fx, fy]] });
  }

  return out;
}

// Fixed-size labels: content first, then one measuring pass for new text, then greedy placement by priority, written
// as transforms so a camera move never relayouts. Alt labels are placed after every other label, so they exist only
// while Alt is held (or their mark is hovered) and the at-rest labels never move when Alt goes down.
function aLabels(ctx, all, G) {
  const { plane, S } = ctx, M = AS.labels, used = new Set(), els = [], items = all.filter((it) => !it.alt || S.alt || it.on);
  for (const it of items) {
    let el = M.get(it.key);
    if (!el) { el = document.createElement("div"); el.hidden = true; M.set(it.key, el); }
    const cls = "dir-a-lab " + (it.cls || "") + (it.alt ? " alt" : "") + (it.on ? " on" : "");
    if (el.className !== cls) { el.className = cls; el._wh = null; }
    if (el.dataset.binding !== it.binding) el.dataset.binding = it.binding;
    if (el._h !== it.html) { el.innerHTML = it.html; el._h = it.html; el._wh = null; }
    const hv = it.hue ? "var(--hue-" + it.hue + ")" : "";
    if (el._hue !== hv) { el.style.setProperty("--hue", hv); el._hue = hv; }
    if (it.rot !== undefined && el._rot !== it.rot) { el.style.setProperty("--rot", it.rot + "deg"); el._rot = it.rot; }
    used.add(it.key); els.push(el);
  }
  for (const [k, el] of M) if (!used.has(k)) { el.remove(); M.delete(k); }
  let prev = null;
  for (const el of els) { if (prev) { if (prev.nextElementSibling !== el) prev.after(el); } else if (!el.isConnected) plane.append(el); prev = el; }
  // Sizes are cached by markup and class, so labels that come back at a level already visited are never measured again.
  const Z = AS.sizes, sk = (el) => el.className + "\n" + el._h;
  for (const el of els) if (!el._wh) el._wh = Z.get(sk(el)) || null;
  const fresh = els.filter((el) => !el._wh || !el._wh[0]);
  for (const el of fresh) el.hidden = false;
  for (const el of fresh) { el._wh = [el.offsetWidth, el.offsetHeight]; if (el._wh[0]) Z.set(sk(el), el._wh); }
  const order = items.map((_, i) => i).sort((a, b) => (items[a].alt ? 1 : 0) - (items[b].alt ? 1 : 0) || items[a].prio - items[b].prio || a - b);
  const placed = [], pos = [], B = G.blocks;
  const bad = (r) => r.l < 4 || r.t < 4 || r.r > G.vw - 4 || r.b > G.vh - 4
    || placed.some((q) => r.l < q.r + 3 && r.r > q.l - 3 && r.t < q.b + 3 && r.b > q.t - 3)
    || B.some((q) => r.l < q.r + 4 && r.r > q.l - 4 && r.t < q.b + 4 && r.b > q.t - 4);
  for (const i of order) {
    const it = items[i], [w, h] = els[i]._wh, at = ([x, y, fx, fy]) => { const l = Math.round(x + fx * w), t = Math.round(y + fy * h); return { l, t, r: l + w, b: t + h }; };
    let hit = null;
    for (const c of it.cands) { const r = at(c); if (!bad(r)) { hit = r; break; } }
    // A must-show label that fits none of its spots walks outward from the first one before it may overlap.
    if (!hit && it.must && it.cands.length) {
      const [x, y, fx, fy] = it.cands[0];
      if (x > 0 && x < G.vw && y > 0 && y < G.vh) for (let d = 12; !hit && d <= 168; d += 12) for (let j = 0; j < 12 && !hit; j++) { const r = at([x + Math.cos(j * Math.PI / 6) * d * 1.5, y + Math.sin(j * Math.PI / 6) * d, fx, fy]); if (!bad(r)) hit = r; }
      if (!hit) { const r = at(it.cands[0]); if (r.r > 0 && r.l < G.vw && r.b > 0 && r.t < G.vh) hit = r; }
    }
    pos[i] = hit;
    if (hit) placed.push(hit);
  }
  els.forEach((el, i) => {
    const p = pos[i];
    if (el.hidden !== !p) el.hidden = !p;
    if (!p) return;
    const tf = "translate(" + p.l + "px," + p.t + "px)";
    if (el._tf !== tf) { el.style.transform = tf; el._tf = tf; }
  });
}

function aLedger(D, at) {
  const rows = [];
  for (const e of D.events) if (e.at <= at) for (const r of e.rows) {
    const last = rows[rows.length - 1];
    if (r.op === "heartbeat_task" && last && last.op === "heartbeat_task") { last.count++; last.bytes += r.bytes; continue; }
    rows.push({ ...r, count: 1, at: e.clock, binding: "ledger:" + e.id + ":" + r.op });
  }
  return rows;
}

function aCard(ctx, m, G) {
  const { D, S, ID } = ctx;
  let card = AS.card;
  if (!card) { card = AS.card = document.createElement("aside"); card.id = ID + "-card"; card.className = ID + "-card"; document.body.append(card); }
  if (card.hidden !== !S.card) card.hidden = !S.card;
  if (!S.card) return;
  const sw = (hue) => `<i class="sw" style="--hue:var(--hue-${hue})"></i>`, esc = `<kbd>Esc</kbd>`;
  let binding, html;
  if (S.card === "away") {
    // The return card lists only what the map cannot show here: items whose machine is off screen or under the card.
    binding = D.away.binding;
    const shown = (i, rect) => {
      const a = i.session && m.agents.find((x) => x.session === i.session);
      if (a && a.state === "waiting") { const [x, y] = G.W("acquit", a.x, a.y, 18); return x > 16 && x < G.vw - 16 && y > G.free.t && y < G.free.b && !(rect && x > rect.left - 8 && y < rect.bottom + 8); }
      return !!aAwaySpot(G, i, rect);
    };
    const rowsFor = (list) => `<header data-binding="${binding}"><h3>${aEsc(D.away.title)}</h3>${esc}</header><ul>` + list.map((i) => {
      const a = i.session && m.agents.find((x) => x.session === i.session);
      return `<li data-binding="${i.binding}"><span class="mono">${i.at || "now"}</span>${sw(a ? aHue(a.agent) : "you")}<span>${aEsc(i.row)}</span></li>`;
    }).join("") + `</ul>`;
    // The card box follows from its row count (padding, header, 35 px rows), so no layout read is needed.
    let list = [], n = -1;
    while (list.length !== n) { n = list.length; const r = { left: G.vw - 408, right: G.vw - 16, top: 100, bottom: 156 + n * 35 }; list = D.away.items.filter((i) => !shown(i, r)); }
    html = rowsFor(list);
  } else if (S.card === "kvarm") {
    binding = "egress:total";
    const rows = (S.kv === "ok" ? aLedger(D, S.at) : D.kv[S.kv].ledger).slice(-5);
    html = `<header data-binding="kvarm:indicator"><b class="st ok">${aEsc(D.kv[S.kv].indicator.label)}</b><h3>Network log</h3>${esc}</header><ul>` + rows.map((r) =>
      `<li data-binding="${D.bindings[r.binding] ? r.binding : binding}"><span class="mono op">${aEsc(r.op)}${r.count > 1 ? " ×" + r.count : ""}</span><span class="mono b">${r.bytes === null ? "unsized" : r.bytes.toLocaleString("en-US") + " B"}</span></li>`).join("")
      + `<li data-binding="${binding}" class="tot"><span class="mono op">${aEsc(D.moment.kvarm.origin)}</span><span class="mono b">${aEsc(S.shell.egress.replace(/^local \+ kvarm · /, ""))}</span></li></ul>`;
  } else {
    const c = D.moment.clashes.find((x) => x.binding === S.card) || D.moment.clashes[0];
    binding = c.binding;
    const rows = c.decls.map((id) => { const d = D.moment.declarations.find((x) => x.id === id); return `<li data-binding="${d.binding}">${sw(aHue(d.agent))}<span><b>${aEsc(d.agent)}</b> · ${d.id} · ${aEsc(d.touches.join(", "))}</span></li>`; });
    if (c.breaksRow) rows.push(`<li data-binding="witness:${c.breaks}"><i class="sw x"></i><span class="fail">${aEsc(c.breaksRow)}</span></li>`);
    const sug = c.options.find((o) => o.kind === c.suggested);
    if (sug) rows.push(`<li data-binding="${c.binding}"><kbd>${sug.key}</kbd><span>Suggested · ${aEsc(sug.label)}</span></li>`);
    html = `<header data-binding="${c.binding}"><b class="st">${aEsc(c.severity.toUpperCase())}</b><h3>${aEsc(c.title || c.id)}</h3>${esc}</header><ul>${rows.join("")}</ul>`;
  }
  if (card._k !== html) { card.innerHTML = html; card._k = html; }
  card.dataset.binding = binding;
}

// One short opacity or lift per mark whose binding an event names; heartbeats are quiet and move nothing.
function aMotion(ctx) {
  const ids = new Set(ctx.fired.filter((e) => !e.quiet).flatMap((e) => e.bindings));
  for (const b of ids) for (const el of ctx.plane.querySelectorAll(`[data-binding="${b}"]`)) {
    if (el.closest(".dir-a-art")) continue;
    el.animate(el instanceof SVGElement ? [{ opacity: 0.25 }, { opacity: 1 }] : [{ translate: "0 -4px" }, { translate: "0 0" }], { duration: 480, easing: "cubic-bezier(.32,.72,0,1)" });
  }
}

function aZoomAt(ctx, k, px, py) {
  const c = ctx.S.camera, fr = freeRect(innerWidth, innerHeight, { rail: "none" }), ppu = Math.max(0.02, Math.min(24, c.ppu * k));
  const wx = c.cx + (px - c.sx) / c.ppu, wy = c.cy + (py - c.sy) / c.ppu, cx = wx - (px - c.sx) / ppu, cy = wy - (py - c.sy) / ppu, hw = fr.w / ppu / 2, hh = fr.h / ppu / 2;
  ctx.setView([cx - hw, cy - hh, cx + hw, cy + hh]);
}
function aPan(ctx, dx, dy) {
  const c = ctx.S.camera, fr = freeRect(innerWidth, innerHeight, { rail: "none" }), cx = c.cx - dx / c.ppu, cy = c.cy - dy / c.ppu, hw = fr.w / c.ppu / 2, hh = fr.h / c.ppu / 2;
  ctx.setView([cx - hw, cy - hh, cx + hw, cy + hh]);
}
function aFly(ctx, rect) {
  const from = ctx.S.view.slice(), t0 = performance.now(), tok = ++AS.fly;
  const step = (now) => {
    if (tok !== AS.fly) return;
    const u = Math.min(1, (now - t0) / 320), e = 1 - Math.pow(1 - u, 3);
    ctx.setView(from.map((v, i) => v + (rect[i] - v) * e));
    if (u < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function aIssues(ctx) {
  const m = aModel(ctx), out = [], w = m.agents.find((a) => a.state === "waiting" && a.waitsOn === "you");
  if (w) out.push(w.binding);
  for (const c of m.clashes) if (c.severity === "blocking") out.push(c.binding);
  if (m.declared) out.push("decl:d3");
  return out;
}
function aActivate(ctx, b) {
  const { S, D } = ctx;
  if (b && b.startsWith("clash:")) S.card = b;
  else if (S.at >= D.at.back && (!b || b.startsWith("away:"))) S.card = "away";
  else if (b) S.hover = b;
  ctx.draw();
}

// p95 of the synchronous frame work (draw plus forced style and layout) over a scripted 52x zoom into one of twenty
// stub plants, with the rAF gaps and long animation frames reported beside it because paint is not in the first number.
async function aPerf(ctx) {
  const { D, S } = ctx, saved = S.view.slice();
  if (!AS.stubs.length) for (const p of D.stub20) AS.stubs.push({ p, n: aPlantNode(ctx, p, p.of, false) });
  const R = D.stub20.map((p) => p.rect), pad = D.siteGap;
  ctx.setView([Math.min(...R.map((r) => r[0])) - pad, Math.min(...R.map((r) => r[1])) - pad, Math.max(...R.map((r) => r[2])) + pad, Math.max(...R.map((r) => r[3])) + pad]);
  const raf = () => new Promise((r) => requestAnimationFrame(r));
  await raf(); await raf();
  const t = D.stub20.filter((p) => p.of === "acquit").at(-1), tc = [(t.rect[0] + t.rect[2]) / 2, (t.rect[1] + t.rect[3]) / 2];
  const work = [], gaps = [], N = 90;
  let last = await raf(), longs = 0, longMax = 0, obs = null;
  try { obs = new PerformanceObserver((l) => { for (const e of l.getEntries()) { longs++; longMax = Math.max(longMax, e.duration); } }); obs.observe({ type: "long-animation-frame" }); } catch (e) { obs = null; }
  for (let i = 0; i < 2 * N; i++) {
    const now = await raf(); gaps.push(now - last); last = now;
    const t0 = performance.now(), c = S.camera;
    aZoomAt(ctx, i < N ? 1.045 : 1 / 1.045, c.sx + (tc[0] - c.cx) * c.ppu, c.sy + (tc[1] - c.cy) * c.ppu);
    void document.body.offsetHeight;
    work.push(performance.now() - t0);
  }
  await raf();
  if (obs) obs.disconnect();
  for (const s of AS.stubs) s.n.remove();
  AS.stubs = [];
  ctx.setView(saved);
  const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return +s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(2); };
  return { plants: D.plants.length + D.stub20.length, frames: work.length, p50: q(work, 0.5), p95: q(work, 0.95), max: q(work, 1), rafP50: q(gaps, 0.5), rafP95: q(gaps, 0.95), longFrames: longs, longMaxMs: Math.round(longMax), loaf: !!obs };
}

// Go to: plants, the agent waiting on you, blocking clashes and the network log, filtered as you type.
function aGotoRows(ctx, toggleLog) {
  const { D, S } = ctx, m = aModel(ctx), plant = () => aFly(ctx, D.camera.stops.plant.rect), rows = [];
  D.plants.forEach((p, i) => rows.push({ b: p.binding, label: p.name, key: String(i + 1), go: () => aFly(ctx, p.rect) }));
  const w = m.agents.find((a) => a.state === "waiting" && a.waitsOn === "you");
  if (w) rows.push({ b: w.binding, label: w.agent + " · waiting on you", key: "Tab", go: () => { S.hover = w.binding; plant(); } });
  for (const c of m.clashes) if (c.severity === "blocking") rows.push({ b: c.binding, label: c.id + (c.breaks ? " · breaks " + c.breaks : ""), key: "", go: () => { S.card = c.binding; plant(); } });
  rows.push({ b: "egress:total", label: "Network log", key: "Shift V", go: toggleLog });
  return rows;
}

function setup(ctx) {
  const { D, S, ID } = ctx;
  for (const p of D.plants) AS.nodes[p.id] = aPlantNode(ctx, p, p.id, true);
  AS.ink = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  AS.ink.setAttribute("class", "dir-a-ink");
  AS.ink.dataset.binding = "plant:acquit";
  ctx.plane.append(AS.ink);
  const stage = document.getElementById("stage"), mid = () => { const fr = freeRect(innerWidth, innerHeight, { rail: "none" }); return [fr.x + fr.w / 2, fr.y + fr.h / 2]; };
  stage.addEventListener("wheel", (e) => { if (!conceptActive(ID)) return; e.preventDefault(); aZoomAt(ctx, Math.exp(-e.deltaY * 0.0016), e.clientX, e.clientY); }, { passive: false });
  let drag = null;
  stage.addEventListener("pointerdown", (e) => { if (conceptActive(ID) && e.button === 0) drag = { x: e.clientX, y: e.clientY, moved: 0 }; });
  addEventListener("pointermove", (e) => {
    if (!conceptActive(ID)) return;
    if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.moved += Math.abs(dx) + Math.abs(dy); drag.x = e.clientX; drag.y = e.clientY; if (drag.moved > 3) aPan(ctx, dx, dy); return; }
    const h = e.target && e.target.closest ? e.target.closest("#dir-a-plane [data-hover]") : null, b = h ? h.dataset.hover : null;
    if (b !== S.hover && (b || (S.hover && !S.hover.startsWith("decl:")))) { S.hover = b; ctx.draw(); }
  });
  addEventListener("pointerup", (e) => {
    if (!drag) return;
    const click = drag.moved <= 3; drag = null;
    if (click) { const h = e.target && e.target.closest ? e.target.closest("#dir-a-plane [data-hover]") : null; if (h) aActivate(ctx, h.dataset.hover); else if (S.card) { S.card = null; ctx.draw(); } }
  });
  const toggleLog = () => { S.card = S.card === "kvarm" ? null : "kvarm"; ctx.draw(); };
  const eg = document.querySelector(".fl.tr .egress");
  if (eg) eg.addEventListener("click", () => { if (conceptActive(ID)) toggleLog(); });

  const box = AS.goto = document.createElement("aside");
  box.id = ID + "-goto"; box.hidden = true;
  box.innerHTML = '<input aria-label="Go to" placeholder="Go to"><ul role="listbox"></ul>';
  document.body.append(box);
  const inp = box.firstChild, ul = box.lastChild;
  let rows = [], sel = 0;
  const list = () => {
    const q = inp.value.trim().toLowerCase(), all = aGotoRows(ctx, toggleLog);
    rows = all.filter((r) => !q || r.label.toLowerCase().includes(q)).slice(0, 9);
    sel = Math.min(sel, Math.max(0, rows.length - 1));
    ul.innerHTML = rows.map((r, i) => `<li data-i="${i}" data-binding="${r.b}" aria-selected="${i === sel}"><span>${aEsc(r.label)}</span>${r.key ? `<kbd>${r.key}</kbd>` : ""}</li>`).join("");
  };
  const closeGoto = () => { box.hidden = true; inp.blur(); ctx.draw(); };
  const openGoto = () => { box.hidden = false; inp.value = ""; sel = 0; list(); inp.focus(); ctx.draw(); };
  const pick = (r) => { closeGoto(); if (r) r.go(); };
  inp.addEventListener("input", () => { sel = 0; list(); });
  inp.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); sel = (sel + (e.key === "ArrowDown" ? 1 : rows.length - 1)) % Math.max(1, rows.length); list(); }
    else if (e.key === "Enter") { e.preventDefault(); pick(rows[sel]); }
    else if (e.key === "Escape") { e.preventDefault(); closeGoto(); }
    else return;
    e.stopImmediatePropagation();
  });
  ul.addEventListener("pointerdown", (e) => { const li = e.target.closest("li"); if (!li) return; e.preventDefault(); pick(rows[+li.dataset.i]); });
  document.addEventListener("click", (e) => {
    if (!conceptActive(ID) || !e.target.closest || !e.target.closest("[data-do=palette]")) return;
    e.preventDefault(); e.stopImmediatePropagation(); openGoto();
  }, true);

  // Keys run in the capture phase and stop there, so the shell's ui-v1 bindings (mode keys 1 to 4, Tab issue step,
  // Ctrl K palette) never see the ones the map owns.
  addEventListener("keydown", (e) => {
    if (!conceptActive(ID)) return;
    const k = e.key, own = () => { e.preventDefault(); e.stopImmediatePropagation(); };
    if ((e.ctrlKey || e.metaKey) && !e.altKey && k.toLowerCase() === "k") { own(); if (box.hidden) openGoto(); else closeGoto(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target && e.target.closest && e.target.closest("input,textarea,[contenteditable=true]")) return;
    const [cx, cy] = mid();
    if (k === "ArrowLeft") aPan(ctx, 160, 0);
    else if (k === "ArrowRight") aPan(ctx, -160, 0);
    else if (k === "ArrowUp") aPan(ctx, 0, 120);
    else if (k === "ArrowDown") aPan(ctx, 0, -120);
    else if (k === "+" || k === "=") aZoomAt(ctx, 1.25, cx, cy);
    else if (k === "-" || k === "_") aZoomAt(ctx, 0.8, cx, cy);
    else if (k === "0") aFly(ctx, D.camera.stops.org.rect);
    else if (/^[1-5]$/.test(k)) aFly(ctx, D.plants[+k - 1].rect);
    else if (k === "Tab") {
      const L = aIssues(ctx);
      if (!L.length) return;
      const i = L.indexOf(S.hover);
      S.hover = L[(i + (e.shiftKey ? L.length - 1 : 1) + (i < 0 && e.shiftKey ? 1 : 0)) % L.length];
      if (S.level === "plant" || S.level === "machine") ctx.draw(); else aFly(ctx, D.camera.stops.plant.rect);
    } else if (k === "Escape" && !box.hidden) closeGoto();
    else if (k === "Enter" && S.hover) aActivate(ctx, S.hover);
    else if (k === "Escape" && (S.card || S.hover)) { if (S.card) S.card = null; else S.hover = null; ctx.draw(); }
    else if ((k === "V" || k === "v") && e.shiftKey) toggleLog();
    else if ((k === "r" || k === "R") && !e.shiftKey && S.at >= D.at.back) { S.card = S.card === "away" ? null : "away"; ctx.draw(); }
    else return;
    own();
  }, { capture: true });
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener("loadingdone", () => { AS.sizes.clear(); for (const el of AS.labels.values()) el._wh = null; ctx.draw(); });
  window.dirAPerf = () => aPerf(ctx);
}

function render(ctx) {
  const h = document.querySelector("body>.hint"), hint = "<kbd>Alt</kbd> words <kbd>Tab</kbd> next <kbd>Shift V</kbd> network";
  if (h && h._k !== hint) { h.innerHTML = hint; h._k = hint; }
  const m = aModel(ctx), G = aGeo(ctx);
  aPlants(ctx, G);
  aCard(ctx, m, G);
  aBlocks(ctx, G);
  aLabels(ctx, aOverlay(ctx, m, G), G);
  if (ctx.fired.length) aMotion(ctx);
}

const css = [
  // Agent hues are mixes of kit tokens: violet for Claude Code, teal for Droid, the kit blue for Codex, ink for you.
  `${Q}{position:absolute;inset:0;overflow:hidden;pointer-events:none;contain:strict;`
  + `--hue-claude:color-mix(in oklch,var(--d-fail-mark) 45%,var(--d-focus));--hue-droid:color-mix(in oklch,var(--d-ok-mark) 55%,var(--d-focus));--hue-codex:var(--d-focus);--hue-you:var(--d-ink);`
  + `--anatomy-paper:var(--d-face);--anatomy-face:var(--d-face);--anatomy-top:var(--d-face);--anatomy-lit-top:var(--d-face);--anatomy-hi:var(--d-ink);--anatomy-mid:var(--d-tick);--anatomy-red:var(--d-fail-mark);--anatomy-dot:var(--d-ink);--anatomy-weight:.75px;`
  + `--anatomy-shade-0:var(--d-page);--anatomy-shade-1:color-mix(in srgb,var(--d-page) 65%,var(--d-face));--anatomy-shade-2:color-mix(in srgb,var(--d-page) 35%,var(--d-face));--anatomy-shade-3:var(--d-card);--anatomy-lit-shade:var(--d-card);--anatomy-lo:var(--d-line2);--anatomy-faint:var(--d-line);--anatomy-lit:var(--d-ink)}`,
  `${P}[data-appearance=light] #${ID}-plane{--anatomy-shade-0:var(--d-line2);--anatomy-shade-1:var(--d-line);--anatomy-shade-2:var(--d-press);--anatomy-shade-3:var(--d-hover);--anatomy-lit-shade:var(--d-press);--anatomy-lo:color-mix(in srgb,var(--d-tick) 55%,var(--d-face));--anatomy-faint:var(--d-line2)}`,
  `${Q} *{animation:none!important;transition:none!important}`,
  `${Q} [hidden]{display:none!important}`,
  `${Q} .dir-a-plant{position:absolute;left:0;top:0;transform-origin:0 0}`,
  `${Q} .dir-a-art{position:absolute;overflow:visible}`,
  `${Q} .dir-a-art :is(path,circle){vector-effect:non-scaling-stroke}`,
  `${Q} .dir-a-paper>:is(.iso-top,.iso-fill){fill:var(--d-face)}`,
  `${Q} .ent[data-state=ghost] .iso-fill{fill:color-mix(in srgb,var(--hue-droid) 7%,transparent)}`,
  `${Q} .ent[data-state=ghost] :is(.iso-shade,.iso-top){fill:none;opacity:0}`,
  `${Q} .ent[data-state=ghost] .iso-line,${Q} .belt[data-ghost] .iso-line{stroke:var(--hue-droid);stroke-dasharray:2.6 2.2;opacity:1}`,
  `${Q} .ent[data-state=ghost] .iso-dots circle,${Q} .belt[data-ghost] .iso-dots circle{fill:var(--hue-droid)}`,
  `${Q} .lamp .iso-top{fill:var(--d-face)}${Q} .lamp .iso-shade{fill:var(--d-line2)}`,
  `${Q} .ent:is([data-state=strain],[data-state=run]) .lamp .iso-top{fill:var(--d-ink)}`,
  `${Q} .ent[data-state=fail] .lamp .iso-top{fill:var(--d-fail-mark)}${Q} .ent[data-state=fail] .iso-edge{stroke:var(--d-fail-mark)}`,
  `${Q} .dir-a-ink{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;z-index:1;transform-origin:0 0}`,
  `${Q} .dir-a-ink :is(.contract,.terr path,.stem,.under,.trail,.foot,.core){vector-effect:non-scaling-stroke}`,
  `${Q} .dir-a-ink [data-hover]{pointer-events:visiblePainted;cursor:pointer}`,
  `${Q} .terr path{fill:color-mix(in srgb,var(--hue,var(--d-tick)) 8%,transparent);stroke:color-mix(in srgb,var(--hue,var(--d-tick)) 70%,transparent);stroke-width:1}`,
  `${Q} .terr[data-state=verifying] path{stroke-dasharray:5 3}`,
  `${Q} .terr[data-state=unmatched] path{fill:none;stroke:var(--d-wait-mark);stroke-width:1.5;stroke-dasharray:6 4}`,
  `${Q} .terr:is([data-state=stale],[data-state=unclaimed]) path{fill:url(#dir-a-hatch);stroke:var(--d-tick);stroke-dasharray:3 3}`,
  `${Q} #dir-a-hatch path{fill:none;stroke:var(--d-line2);stroke-width:1.5}`,
  `${Q} .contract{fill:none;stroke:var(--d-tick);stroke-width:1;stroke-dasharray:3 4}`,
  `${Q} .tint path{fill:none;stroke:var(--hue);stroke-opacity:.42;stroke-linecap:round;stroke-linejoin:round}`,
  `${Q} .blast .band{fill:none;stroke:var(--hue);stroke-opacity:.22;stroke-linecap:round;stroke-linejoin:round}`,
  `${Q} .blast .core{fill:none;stroke:var(--hue);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}`,
  `${Q} .blast .foot{fill:color-mix(in srgb,var(--hue) 12%,transparent);stroke:var(--hue);stroke-width:1.5}`,
  `${Q} .pin path:last-child{fill:var(--d-fail-mark);stroke:var(--d-face);stroke-width:1.5}`,
  `${Q} .pin.adv path:last-child{fill:var(--d-face);stroke:var(--d-tick)}`,
  `${Q} .pin.hov path:last-child{stroke:var(--d-ink);stroke-width:2}`,
  `${Q} .pin .stem{stroke:var(--d-fail-mark);stroke-width:1.25}${Q} .pin.adv .stem{stroke:var(--d-tick)}`,
  `${Q} .agent .shadow{fill:var(--d-ink);opacity:.14}`,
  `${Q} .agent .stem{stroke:var(--hue);stroke-width:2}`,
  `${Q} .agent .body{fill:var(--hue);stroke:var(--d-face);stroke-width:2}`,
  `${Q} .agent .body.hollow{fill:var(--d-face);stroke:var(--hue);stroke-width:2.5}`,
  `${Q} .agent .body.dashed{stroke-dasharray:3 2.5}`,
  `${Q} .agent .ring{fill:none;stroke:var(--d-wait-mark);stroke-width:2.5}`,
  `${Q} .agent.hov .body{stroke:var(--d-ink)}`,
  `${Q} .away .new{fill:var(--hue);stroke:var(--d-face);stroke-width:2}`,
  `${Q} .away .under{fill:none;stroke:var(--d-tick);stroke-width:1;stroke-dasharray:3 3}`,
  `${Q} .away .trail{fill:none;stroke:var(--hue);stroke-width:2.5;stroke-dasharray:.5 6;stroke-linecap:round;opacity:.8}`,
  `${Q} .dir-a-lab{position:absolute;left:0;top:0;z-index:2;white-space:nowrap;font:500 12px/16px var(--sans);color:var(--d-dim)}`,
  `${Q} .dir-a-lab.m{background:var(--d-face);padding:0 4px;border-radius:4px}`,
  `${Q} .dir-a-lab.m .r,${Q} .dir-a-clash{color:var(--d-fail)}`,
  `${Q} .dir-a-lab.chg{background:var(--d-face);color:var(--d-ink);padding:0 5px 0 4px;border-left:3px solid var(--hue);border-radius:2px 4px 4px 2px}`,
  `${Q} .dir-a-lab.pn{color:var(--d-ink);background:var(--d-page);padding:0 4px;border-radius:4px}`,
  `${Q} .dir-a-lab.pn .n{color:var(--d-wait);font-weight:600;margin-left:2px}`,
  `${Q} .dir-a-mark{display:inline-block;background:var(--d-card);border:1px solid var(--d-line2);border-radius:7px;padding:3px 8px;color:var(--d-ink);font:500 12px/16px var(--sans)}`,
  `${Q} .dir-a-mark .t{color:var(--d-text);font-weight:400}`,
  `${Q} .dir-a-mark .g{color:var(--d-dim)}`,
  `${Q} .dir-a-flag{border-left:3px solid var(--hue);border-radius:3px 7px 7px 3px}`,
  `${Q} .dir-a-flag.wait{border-color:var(--d-wait-mark);border-left-color:var(--hue)}${Q} .dir-a-flag.wait .t{color:var(--d-wait)}`,
  `${Q} .dir-a-clash{border-color:var(--d-fail-mark)}`,
  `${Q} .dir-a-order{display:flex;flex-direction:column;align-items:flex-start;gap:4px}`,
  `${Q} .dir-a-order .sub{color:var(--d-text);font-weight:400}`,
  `${Q} .dir-a-order .st-unmatched{color:var(--d-wait);border-color:var(--d-wait-mark)}${Q} .dir-a-order .st-stale{border-style:dashed}`,
  `${Q} .dir-a-beacon{display:flex;align-items:center;gap:5px}${Q} .dir-a-beacon .g{display:inline-block;rotate:var(--rot);line-height:14px}${Q} .dir-a-beacon.end .g{order:2}`,
  `${Q} .dir-a-beacon.wait{border-color:var(--d-wait-mark)}${Q} .dir-a-beacon.fail{border-color:var(--d-fail-mark)}`,
  `${Q} .dir-a-lab.alt{font-weight:400;color:var(--d-text);background:var(--d-card);border:1px solid var(--d-line);border-radius:5px;padding:1px 6px}`,
  `${P} #${ID}-card{position:fixed;right:16px;top:100px;width:392px;box-sizing:border-box;max-height:calc(100vh - 164px);overflow:hidden;z-index:30;background:var(--d-card);border:1px solid var(--d-line);border-radius:12px;padding:14px 16px 6px;color:var(--d-text);font:400 13px/18px var(--sans)}`,
  `${P} #${ID}-card[hidden]{display:none}`,
  `${P} #${ID}-card *,${P} #${ID}-goto *{transition:none!important;animation:none!important}`,
  `${P} #${ID}-card header{display:flex;align-items:baseline;gap:8px;margin:0 0 8px}`,
  `${P} #${ID}-card h3{margin:0;flex:1;font:600 14px/20px var(--sans);color:var(--d-ink)}`,
  `${P} #${ID}-card .st{font:600 11px/20px var(--sans);letter-spacing:.04em;color:var(--d-fail)}${P} #${ID}-card .st.ok{color:var(--d-dim);letter-spacing:0;font-weight:500}`,
  `${P} #${ID}-card kbd{font:500 11px/16px var(--sans);color:var(--d-dim);border:1px solid var(--d-line2);border-radius:4px;padding:0 4px}`,
  `${P} #${ID}-card ul{list-style:none;margin:0;padding:0}`,
  `${P} #${ID}-card li{display:flex;align-items:baseline;gap:8px;padding:8px 0;border-top:1px solid var(--d-line)}`,
  `${P} #${ID}-card .sw{width:8px;height:8px;border-radius:50%;background:var(--hue);flex:none;align-self:center}${P} #${ID}-card .sw.x{background:var(--d-fail-mark);border-radius:1px;transform:rotate(45deg)}`,
  `${P} #${ID}-card b{color:var(--d-ink);font-weight:500}${P} #${ID}-card .fail{color:var(--d-fail)}`,
  `${P} #${ID}-card .mono{font:400 12px/18px var(--mono);color:var(--d-dim);flex:none;min-width:40px}`,
  `${P} #${ID}-card .op{flex:1;color:var(--d-text)}${P} #${ID}-card .b{flex:none}`,
  // The shell hint strip is mono capitals; here it reads as plain words beside quiet key caps.
  `${P}>.hint{font:400 12px/16px var(--sans);letter-spacing:0;text-transform:none;color:var(--d-dim)}`,
  `${P}>.hint kbd{font:500 11px/14px var(--sans);color:var(--d-text);border:1px solid var(--d-line2);border-radius:4px;padding:0 4px;margin:0 4px 0 10px}${P}>.hint kbd:first-child{margin-left:0}`,
  `${P} #${ID}-goto{position:fixed;left:16px;top:100px;width:300px;box-sizing:border-box;z-index:31;background:var(--d-card);border:1px solid var(--d-line);border-radius:12px;padding:6px;font:400 13px/18px var(--sans);color:var(--d-text)}`,
  `${P} #${ID}-goto[hidden]{display:none}`,
  `${P} #${ID}-goto input{width:100%;box-sizing:border-box;border:0;outline:none;background:transparent;color:var(--d-ink);font:400 14px/20px var(--sans);padding:6px 8px}`,
  `${P} #${ID}-goto input::placeholder{color:var(--d-dim)}`,
  `${P} #${ID}-goto ul{list-style:none;margin:0;padding:0}`,
  `${P} #${ID}-goto li{display:flex;align-items:baseline;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer}${P} #${ID}-goto li span{flex:1}`,
  `${P} #${ID}-goto li[aria-selected=true]{background:var(--d-press);color:var(--d-ink)}`,
  `${P} #${ID}-goto kbd{font:500 11px/16px var(--sans);color:var(--d-dim);border:1px solid var(--d-line2);border-radius:4px;padding:0 4px}`,
  `${P} .fl.tr .egress{cursor:pointer}${P} .fl.tr .egress .dot{background:var(--d-dim)}`,
].join("\n");

export default directionStub({ id: ID, label: "Direction A · Live paper", css, lib: [pageConsts, aEsc, aHue, aModel, aModelAt, aGeo, aPlantNode, aPlants, aBlocks, aAwaySpot, aOverlay, aLabels, aLedger, aCard, aMotion, aZoomAt, aPan, aFly, aIssues, aActivate, aPerf, aGotoRows], setup, render });
