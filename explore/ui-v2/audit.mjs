// Machine check of the ui-v2 quality bar, go-bar lines G3 and G4 in READINESS.md.
// drive.mjs runs `audit` at every shot when AUDIT=1, `auditFocus` on a {"audit":"focus"} step,
// and FOCUS_MARK / FOCUS_CHECK around every scripted wait.
// A finding is { rule, selector, text, detail }. An unknown is a check the audit could not decide.
// Unknowns are reported next to findings and are never counted as passes.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { inflateSync } from "node:zlib";

// Extension point for new rules (word budgets, island positions). Each entry is
// { rule, check(api) } where check runs inside the page, so it must be self-contained source that
// uses only its argument and browser globals. api is { cfg, W, H, items, sel, squash, shown, inView, cs, stats }:
// items are the visible text runs { p, text, rects, fontPx, ... }, and cfg is CONFIG below, so put a
// rule's settings there. stats records measurements even on exempt beats.
// check returns [{ selector, text, value, limit, detail, unknown? }].
export const PAGE_RULES = [{ rule: "text-budget", check: function ({ cfg, W, H, cs, squash, stats }) {
  // TEXT.md's counter walks raw text, not items, which truncates copy and includes key caps.
  const P = CSS.escape(document.body.dataset.concept || new URLSearchParams(location.hash.slice(1)).get("c") || "audit");
  const B = cfg.textBudget;
  const SURFACE = [
    ["toast", "#toast"],
    ["palette", "#pal"],
    ["pill", "#chips .chip,." + P + "-mark,.egress"],
    ["card", "#" + P + "-card,#" + P + "-dock,#" + P + "-guide,#" + P + "-kv-panel,#" + P + "-prov,#insp,.pop"],
    ["island", ".fl,#nav,.hint,#watermark,#cbar,#rpdeck,.simdeck"],
    ["plant", "#stage"],
  ];
  const ROW = ".bl .wait,.bl .agent,.bl .tl,." + P + "-reading,." + P + "-mini,." + P + "-check,." + P + "-kv-row,." + P + "-answer,." + P + "-bindings summary,." + P + "-bindings button,#" + P + "-guide button,.pal-list>*";
  const CHOICE = "." + P + "-answer,.pal-row";
  const SKIP = "script,style,title,desc,defs,noscript,textarea,input,select,option,kbd,.mono,.pal-row .ic,[data-text=glyph]";
  const USER = "[data-text=user],." + P + "-sentence";
  const LAYER = "#" + P + "-prov,#" + P + "-kv-panel,#net,#layers,#ex";
  const units = new Set(["B", "KB", "MB", "GB", "ms", "s", "S", "min", "m", "h", "%", "rps"]);
  const wordsOf = (s) => {
    const out = [], toks = s.split(/\s+/).filter(Boolean);
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i];
      if (!/[\p{L}\p{N}]/u.test(t)) continue;
      if (units.has(t.replace(/[.,;:)]+$/, "")) && i > 0 && /\d[.,;:]?$/.test(toks[i - 1])) continue;
      out.push(t);
    }
    return out;
  };
  const textShown = (el) => {
    let o = 1;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const s = cs(n);
      if (s.display === "none" || s.visibility !== "visible" || s.contentVisibility === "hidden") return false;
      o *= +s.opacity; if (o < 0.05) return false;
      const d = n.parentElement;
      if (d && d.tagName === "DETAILS" && !d.open && n.tagName !== "SUMMARY") return false;
    }
    return true;
  };
  const cls = (kind, el) => kind === "card" ? (el.matches("[data-empty]") ? "empty" : el.matches("#" + P + "-dock,#" + P + "-guide") ? "rest" : "card")
    : kind === "island" ? (el.matches(".fl.bl") ? "queue" : el.matches("#rpdeck,.simdeck") ? "deck" : "island") : kind;
  const inside = (x, y, r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  const covers = [...document.querySelectorAll(SURFACE.slice(0, 5).map(([, s]) => s).join(","))].filter((e) => !e.closest("#stage") && textShown(e) && e.getClientRects().length).map((e) => e.getBoundingClientRect());
  const clipped = (el, x, y) => { for (let n = el; n && n !== document.body; n = n.parentElement) if (cs(n).overflow !== "visible" && !inside(x, y, n.getBoundingClientRect())) return true; return false; };
  const keyOf = (el) => {
    const parts = [];
    for (let n = el; n; n = n.parentElement) {
      if (n.id) { parts.unshift("#" + CSS.escape(n.id)); break; }
      let part = n.localName + [...n.classList].slice(0, 2).map((c) => "." + CSS.escape(c)).join("");
      const siblings = n.parentElement && [...n.parentElement.children].filter((e) => e.localName === n.localName);
      if (siblings && siblings.length > 1) part += ":nth-of-type(" + (siblings.indexOf(n) + 1) + ")";
      parts.unshift(part);
      if (n === document.body) break;
    }
    return parts.join(" > ");
  };
  const r = { total: 0, user: 0, layer: document.body.classList.contains("alt") || [...document.querySelectorAll(LAYER)].some((e) => textShown(e) && e.getClientRects().length), cap: document.querySelector("[data-team]") ? B.screen : B.solo, kinds: {}, surfaces: [], rows: [] };
  const surfaces = new Map(), rows = new Map();
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t; (t = walk.nextNode());) {
    const el = t.parentElement, words = wordsOf(t.textContent);
    if (!words.length || !el || el.closest(SKIP) || !textShown(el)) continue;
    const range = document.createRange(); range.selectNodeContents(t);
    const rect = [...range.getClientRects()].find((a) => a.width > 1 && a.height > 1 && a.right > 0 && a.bottom > 0 && a.left < W && a.top < H);
    if (!rect) continue;
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    if (clipped(el, cx, cy)) continue;
    if (el.closest("#stage") && covers.some((a) => inside(cx, cy, a))) continue;
    if (el.closest(USER)) { r.user += words.length; continue; }
    let surf = null, kind = "other";
    for (let n = el; n && !surf; n = n.parentElement) { const hit = SURFACE.find(([, s]) => n.matches(s)); if (hit) { surf = n; kind = hit[0]; } }
    const s = surfaces.get(surf) || { kind, cls: surf ? cls(kind, surf) : "other", key: surf ? keyOf(surf) : "body", words: 0, text: [] };
    s.words += words.length; s.text.push(words.join(" ")); surfaces.set(surf, s);
    r.total += words.length;
    r.kinds[s.cls] = (r.kinds[s.cls] || 0) + words.length;
    const row = el.closest(ROW);
    if (row) { const a = rows.get(row) || { key: keyOf(row), cls: row.matches(CHOICE) ? "choice" : "row", words: 0, text: [] }; a.words += words.length; a.text.push(words.join(" ")); rows.set(row, a); }
  }
  r.surfaces = [...surfaces.values()].map((s) => ({ ...s, text: s.text.join(" | ") }));
  r.rows = [...rows.values()].map((a) => ({ ...a, text: a.text.join(" ") }));
  stats.textBudget = r;
  if (r.layer) return [];
  const out = [];
  const judge = (kind, selector, value, limit, text = "") => {
    if (value > limit) out.push({ selector, text: squash(text), value, limit, detail: kind + " " + value + " > " + limit });
  };
  judge("screen", "body", r.total, r.cap);
  let plant = 0;
  for (const s of r.surfaces) {
    if (s.cls === "plant") { plant += s.words; continue; }
    judge(s.cls, s.key, s.words, B[s.cls], s.text);
  }
  judge("plant", "#stage", plant, B.plant);
  for (const a of r.rows) judge(a.cls, a.key, a.words, B[a.cls], a.text);
  return out;
} }];

export const RULES = ["type-floor", "overlap", "offscreen", "contrast", "focus-ring", "transition", "egress-sum", "focus-steal", ...PAGE_RULES.map((r) => r.rule)];

// Camera easing runs in JS (build.mjs animate(), blueprint.mjs inkLoop), so no CSS camera selector needs allowing.
// The ink-in moment is the one CSS animation the bar allows: .orders-ink in orders.mjs, its copy
// .quiet-ink in quiet.mjs, and .bench-ink in bench.mjs.
export const MOTION_ALLOW = { selectors: [".orders-ink", ".quiet-ink", ".bench-ink"], animations: ["orders-ink", "quiet-ink", "bench-ink"] };

// The appearance a shot was taken in. World keeps its own theme on #worldApp; the shell uses body[data-appearance].
const APPEARANCE = `(() => { const w = document.querySelector("#worldApp"); return (w && w.dataset.theme) || document.body.dataset.appearance || "dark"; })()`;

// Pills show the running byte total; logs list the ops. `section` logs read the rows after the
// "Network log" header up to the next header. `total` logs carry the total in a header and may show
// only the last few rows, so their rows are summed only when the header's op count matches.
export const EGRESS = [
  ...["orders", "quiet"].flatMap((c) => [
    { pill: ".egress", root: `#${c}-kv-panel`, section: `.${c}-section`, row: `.${c}-kv-row[data-state]`, bytes: "i" },
    { pill: ".egress", root: `#${c}-kv-dock`, total: "header b", count: "header span", row: `.${c}-kv-row`, bytes: "i" },
    { pill: ".egress", root: `#${c}-kv-card`, total: "header b", count: "header span", row: `.${c}-kv-row`, bytes: "i" },
  ]),
  { pill: ".egress", root: "#clashKvPanel", section: ".clash-kv-section", row: ".clash-kv-row[data-state]", bytes: "i" },
  { pill: ".egress", root: "#clashKv", total: "header b", count: "header span", row: ".clash-kv-row", bytes: "i" },
  { pill: ".egress", root: "#gateKv", total: "header b", count: "header span", row: ".gate-kvlog-row", bytes: "i" },
  { pill: ".egress", root: ".bench-kvarm", total: "h3 small", row: ".bench-op", bytes: "span" },
  { pill: "#worldEgress", root: "#worldNetworkBody", section: "h3", row: ".world-network-row", bytes: "b > span" },
];

const CONFIG = {
  floorPx: 11,
  overlapPx: 2,
  labelMax: [480, 200],
  surfaces: "[role=dialog],dialog[open],[aria-modal=true],.pop.open,#insp.open,#toast.on,[class*=card],[class*=panel],[class*=plate],[class*=popover],[class*=sheet],[id*=card],[id*=Card],[id*=panel],[id*=Panel],[id*=plate]",
  motion: MOTION_ALLOW,
  egress: EGRESS,
  textBudget: { pill: 6, row: 8, choice: 12, toast: 8, island: 12, queue: 24, deck: 30, card: 60, rest: 24, empty: 20, palette: 40, plant: 20, other: 0, screen: 150, solo: 136 },
};

// Runs in the page. Everything it needs is inside it, because it is sent as source text.
function pageAudit(cfg, extra) {
  const W = innerWidth, H = innerHeight;
  const findings = [], unknown = [], stats = {}, laps = {};
  const t0 = performance.now();
  let tl = t0;
  const lap = (k) => { const n = performance.now(); laps[k] = Math.round(n - tl); tl = n; };
  const csMemo = new Map();
  const cs = (e) => { let s = csMemo.get(e); if (!s) csMemo.set(e, (s = getComputedStyle(e))); return s; };
  const opMemo = new Map();
  const opacity = (e) => {
    if (!e || e.nodeType !== 1) return 1;
    let v = opMemo.get(e);
    if (v === undefined) opMemo.set(e, (v = +cs(e).opacity * opacity(e.parentElement)));
    return v;
  };
  const anchorOf = (e) => { for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) if (n.id) return n; return null; };
  const part = (n) => {
    if (n.id) return "#" + CSS.escape(n.id);
    let s = n.localName + [...n.classList].slice(0, 2).map((c) => "." + CSS.escape(c)).join("");
    for (const a of ["data-id", "data-key", "data-action", "data-machine", "data-mode", "data-orders-kv", "data-clash"]) if (n.hasAttribute(a)) { s += "[" + a + '="' + n.getAttribute(a) + '"]'; break; }
    return s;
  };
  const sel = (e) => {
    if (!e || e.nodeType !== 1) return String(e);
    if (e.id) return part(e);
    const chain = [part(e)];
    for (let n = e.parentElement, i = 0; n && i < 2 && !n.id && n !== document.body; n = n.parentElement, i++) chain.unshift(part(n));
    const a = anchorOf(e);
    return (a && !chain[0].startsWith("#") ? part(a) + " " : "") + chain.join(" > ");
  };
  const squash = (s) => String(s || "").replace(/\s+/g, " ").trim().slice(0, 70);
  const ctx = new OffscreenCanvas(1, 1).getContext("2d", { willReadFrequently: true });
  const colorMemo = new Map();
  const rgba = (str) => {
    let v = colorMemo.get(str);
    if (v) return v;
    ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = "#010203"; ctx.fillStyle = str;
    const ok = ctx.fillStyle !== "#010203" || /^#010203$/i.test(str.trim());
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    v = ok ? [d[0], d[1], d[2], d[3] / 255] : null;
    colorMemo.set(str, v);
    return v;
  };
  const rendered = (e) => e.getClientRects().length > 0;
  const shown = (e) => rendered(e) && cs(e).visibility === "visible" && opacity(e) > 0.05;
  const inView = (r) => r.right > 0 && r.bottom > 0 && r.left < W && r.top < H && r.width > 0 && r.height > 0;
  const SVG_GEOM = new Set(["path", "rect", "circle", "ellipse", "polygon", "polyline", "line", "image", "use"]);
  const occMemo = new Map();
  const occludes = (e) => {
    let v = occMemo.get(e);
    if (v !== undefined) return v;
    const s = cs(e);
    if (e instanceof SVGElement) v = SVG_GEOM.has(e.localName) && s.fill !== "none" && opacity(e) * +s.fillOpacity > 0.3;
    else {
      const bg = rgba(s.backgroundColor);
      v = /^(img|video|canvas|iframe)$/.test(e.localName) || s.backgroundImage !== "none" || s.backdropFilter !== "none" || (!!bg && bg[3] * opacity(e) >= 0.35);
    }
    occMemo.set(e, v);
    return v;
  };
  const stack = (x, y) => document.elementsFromPoint(x, y);
  const visibleAt = (p, x, y) => {
    for (const e of stack(x, y)) {
      if (e === p || p.contains(e) || e.contains(p)) return true;
      if (occludes(e)) return false;
    }
    return false;
  };

  const SKIP = new Set(["script", "style", "noscript", "template", "title", "desc", "option", "textarea", "metadata"]);
  const groups = new Map();
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (/\S/.test(n.data) ? 1 : 3) });
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    const p = n.parentElement;
    if (!p || SKIP.has(p.localName) || p.closest("defs,symbol,clipPath,mask,pattern,marker")) continue;
    let g = groups.get(p);
    if (!g) groups.set(p, (g = []));
    g.push(n);
  }
  for (const e of document.querySelectorAll("input,textarea,select")) {
    if (/^(hidden|checkbox|radio|range|color|file|submit|button|reset|image)$/.test(e.type)) continue;
    if (!groups.has(e)) groups.set(e, null);
  }

  const style = document.createElement("style");
  style.textContent = "*,*::before,*::after{pointer-events:auto!important}";
  const items = [];
  document.head.append(style);
  try {
    for (const [p, nodes] of groups) {
      const s = cs(p);
      if (s.visibility !== "visible" || opacity(p) <= 0.05) continue;
      const svg = p instanceof SVGElement;
      let rects = [], text;
      if (nodes) {
        const range = document.createRange();
        for (const n of nodes) { range.selectNodeContents(n); for (const r of range.getClientRects()) if (r.width > 0.5 && r.height > 0.5) rects.push(r); }
        text = squash(nodes.map((n) => n.data).join(" "));
      } else {
        const r = p.getBoundingClientRect(), pl = parseFloat(s.paddingLeft) || 0, pr = parseFloat(s.paddingRight) || 0;
        if (r.width > 0 && r.height > 0) rects.push(new DOMRect(r.left + pl, r.top, Math.max(1, r.width - pl - pr), r.height));
        text = squash(p.value || p.placeholder || (p.selectedOptions && p.selectedOptions[0] && p.selectedOptions[0].textContent));
        if (!text) continue;
      }
      rects = rects.filter(inView);
      if (!rects.length) continue;
      const seen = [];
      for (const r of rects.slice(0, 4)) {
        const y = r.top + r.height / 2;
        const pts = (r.width > 24 ? [0.15, 0.5, 0.85] : [0.5]).map((f) => [r.left + r.width * f, y]).filter(([x]) => x >= 0 && x < W && y >= 0 && y < H);
        if (pts.some(([x, y]) => visibleAt(p, x, y))) seen.push(r);
      }
      if (!seen.length) continue;
      let fontPx = parseFloat(s.fontSize);
      if (svg) {
        const m = p.getScreenCTM();
        if (m) fontPx *= Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
      } else {
        // Ancestor transforms, not rect/offsetHeight: offsetHeight is rounded to whole pixels.
        for (let n = p; n && n.nodeType === 1; n = n.parentElement) {
          const c = cs(n);
          if (c.transform !== "none") { const m = new DOMMatrix(c.transform); fontPx *= Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)); }
          if (c.scale && c.scale !== "none") { const [x, y = x] = c.scale.split(" ").map(Number); fontPx *= Math.sqrt(Math.abs(x * y)); }
          if (c.zoom && +c.zoom !== 1) fontPx *= +c.zoom;
        }
      }
      items.push({ p, svg, text, rects, seen, fontPx, weight: +s.fontWeight || 400, aria: !!p.closest("[aria-hidden=true]"), placeholder: !nodes && !p.value });
    }
    stats.textItems = items.length;
    lap("text");

    for (const it of items) {
      if (it.aria) continue;
      if (it.fontPx < cfg.floorPx - 0.05) findings.push({ rule: "type-floor", selector: sel(it.p), text: it.text, value: it.fontPx.toFixed(1) + " px", limit: cfg.floorPx + " px", detail: it.fontPx.toFixed(1) + " px, floor " + cfg.floorPx + " px" });
    }

    // A label is the box it paints: a small positioned chip, pin or tag with a background or border.
    // Text with no painted box, and SVG text on the iso plant, is measured by its glyph cells,
    // because a skewed text's bounding box covers far more than its letters.
    const paints = (e) => { const c = cs(e), bg = rgba(c.backgroundColor); return (!!bg && bg[3] > 0.1) || c.backgroundImage !== "none" || c.backdropFilter !== "none" || ["Top", "Right", "Bottom", "Left"].some((k) => parseFloat(c["border" + k + "Width"]) > 0 && c["border" + k + "Style"] !== "none"); };
    const glyphs = (t) => {
      const m = t.getScreenCTM(), n = Math.min(t.getNumberOfChars(), 120), out = [];
      if (!m || (Math.abs(m.b) < 0.01 && Math.abs(m.c) < 0.01) || !n) return [t.getBoundingClientRect()];
      for (let i = 0; i < n; i++) {
        let e; try { e = t.getExtentOfChar(i); } catch { continue; }
        const q = [[e.x, e.y], [e.x + e.width, e.y], [e.x, e.y + e.height], [e.x + e.width, e.y + e.height]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
        const xs = q.map((p) => p[0]), ys = q.map((p) => p[1]);
        out.push(new DOMRect(Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)));
      }
      return out;
    };
    const units = new Map();
    for (const it of items) {
      let root = null, rects = null;
      if (it.svg) { root = it.p.closest("text") || it.p; if (units.has(root)) continue; rects = glyphs(root); }
      else {
        for (let a = it.p; a && a !== document.body; a = a.parentElement) {
          const pos = cs(a).position;
          if (pos === "absolute" || pos === "fixed") {
            const r = a.getBoundingClientRect();
            if (r.width <= cfg.labelMax[0] && r.height <= cfg.labelMax[1]) { root = a; rects = paints(a) ? [r] : null; }
            break;
          }
        }
        if (!root) root = it.p;
        if (!rects) { const u = units.get(root); if (u) { if (!u.boxed) u.rects.push(...it.rects); continue; } rects = [...it.rects]; }
        else if (units.has(root)) continue;
      }
      units.set(root, { root, rects, boxed: rects.length === 1 && !it.svg && root !== it.p, text: it.text, stack: root.closest("[data-audit-stack]") });
    }
    for (const u of units.values()) {
      u.rects = u.rects.filter(inView);
      if (!u.rects.length) continue;
      const l = Math.min(...u.rects.map((r) => r.left)), t = Math.min(...u.rects.map((r) => r.top));
      u.rect = new DOMRect(l, t, Math.max(...u.rects.map((r) => r.right)) - l, Math.max(...u.rects.map((r) => r.bottom)) - t);
    }
    const list = [...units.values()].filter((u) => u.rect).sort((a, b) => a.rect.left - b.rect.left);
    stats.labelUnits = list.length;
    stats.stackOptOuts = document.querySelectorAll("[data-audit-stack]").length;
    stats.stackSkips = 0;
    const seen = new Set();
    for (let i = 0; i < list.length; i++) {
      const A = list[i];
      for (let j = i + 1; j < list.length; j++) {
        const B = list[j];
        if (B.rect.left >= A.rect.right - cfg.overlapPx) break;
        let hit = null;
        for (const ra of A.rects) for (const rb of B.rects) {
          const l = Math.max(ra.left, rb.left, 0), r = Math.min(ra.right, rb.right, W), t = Math.max(ra.top, rb.top, 0), b = Math.min(ra.bottom, rb.bottom, H);
          if (r - l > cfg.overlapPx && b - t > cfg.overlapPx && (!hit || (r - l) * (b - t) > (hit.r - hit.l) * (hit.b - hit.t))) hit = { l, r, t, b };
        }
        if (!hit) continue;
        const { l, r, t, b } = hit;
        if (A.root.contains(B.root) || B.root.contains(A.root)) continue;
        if (A.stack && A.stack === B.stack) { stats.stackSkips++; continue; }
        let both = false;
        for (const [fx, fy] of [[0.5, 0.5], [0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]]) {
          let a = false, c = false;
          for (const e of stack(l + (r - l) * fx, t + (b - t) * fy)) {
            const inA = A.root.contains(e), inB = B.root.contains(e);
            a ||= inA; c ||= inB;
            if (a && c) break;
            if (!inA && !inB && occludes(e)) break;
          }
          if (a && c) { both = true; break; }
        }
        if (!both) continue;
        const key = sel(A.root) + "|" + sel(B.root);
        if (seen.has(key)) continue;
        seen.add(key);
        findings.push({ rule: "overlap", selector: sel(A.root), text: A.text, value: Math.round(r - l) + "x" + Math.round(b - t) + " px", limit: cfg.overlapPx + " px", detail: "overlaps " + sel(B.root) + ' "' + B.text + '" by ' + Math.round(r - l) + "x" + Math.round(b - t) + " px, limit " + cfg.overlapPx + " px" });
      }
    }

    lap("overlap");
    const pillsShown = new Map();
    for (const ps of new Set(cfg.egress.map((g) => g.pill))) {
      const el = document.querySelector(ps);
      if (!el || !shown(el)) continue;
      const r = el.getBoundingClientRect();
      if (!inView(r) || !visibleAt(el, r.left + r.width / 2, r.top + r.height / 2)) continue;
      const m = el.textContent.match(/([\d,]+) B\b/);
      pillsShown.set(ps, { el, bytes: m ? +m[1].replace(/,/g, "") : null, text: squash(el.textContent) });
    }
    stats.egressLogs = 0;
    const bytesOf = (s) => { const m = String(s || "").match(/([\d,]+) B\b/); return m ? +m[1].replace(/,/g, "") : null; };
    for (const g of cfg.egress) {
      const pill = pillsShown.get(g.pill);
      for (const root of document.querySelectorAll(g.root)) {
        if (!shown(root) || !inView(root.getBoundingClientRect())) continue;
        let total = null, rows = [], complete = true, label;
        if (g.section) {
          const head = [...root.querySelectorAll(g.section)].find((h) => /^\s*Network log/i.test(h.textContent));
          if (!head) continue;
          total = bytesOf(head.textContent); label = squash(head.textContent);
          for (let n = head.nextElementSibling; n && !n.matches(g.section); n = n.nextElementSibling) if (n.matches(g.row)) rows.push(n);
        } else {
          const t = root.querySelector(g.total);
          total = t ? bytesOf(t.textContent) : null; label = t ? squash(t.textContent) : "";
          rows = [...root.querySelectorAll(g.row)];
          if (g.count) { const c = root.querySelector(g.count), m = c && c.textContent.match(/(\d+) ops?\b/); complete = !!m && +m[1] === rows.length; }
        }
        stats.egressLogs++;
        const vals = rows.map((n) => bytesOf(n.querySelector(g.bytes) && n.querySelector(g.bytes).textContent));
        const where = sel(root);
        if (pill && pill.bytes !== null && total !== null && pill.bytes !== total)
          findings.push({ rule: "egress-sum", selector: g.pill, text: pill.text, value: pill.bytes + " B", limit: total + " B", detail: "pill " + pill.bytes + " B, " + where + ' header "' + label + '" says ' + total + " B, must be equal" });
        if (!complete) continue;
        if (vals.some((v) => v === null)) {
          unknown.push({ rule: "egress-sum", selector: where, text: label, detail: rows.length + " rows, " + vals.filter((v) => v === null).length + " show no byte count (sending, held or a result)" });
          continue;
        }
        const sum = vals.reduce((a, b) => a + b, 0);
        if (total !== null && sum !== total) findings.push({ rule: "egress-sum", selector: where, text: label, value: sum + " B", limit: total + " B", detail: "rows sum to " + sum + " B, header says " + total + " B, must be equal" });
        if (pill && pill.bytes !== null && sum !== pill.bytes) findings.push({ rule: "egress-sum", selector: g.pill, text: pill.text, value: pill.bytes + " B", limit: sum + " B", detail: "pill " + pill.bytes + " B, " + where + " rows sum to " + sum + " B, must be equal" });
      }
    }
  } finally { style.remove(); }
  lap("egress");

  const surf = [...document.querySelectorAll(cfg.surfaces)].filter((e) => {
    if (!shown(e)) return false;
    const pos = cs(e).position;
    if (pos !== "absolute" && pos !== "fixed" && e.getAttribute("role") !== "dialog" && e.localName !== "dialog") return false;
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && !(r.width > W * 1.5 && r.height > H * 1.5);
  });
  const surfSet = new Set(surf);
  const tops = surf.filter((e) => { for (let n = e.parentElement; n; n = n.parentElement) if (surfSet.has(n)) return false; return true; });
  stats.surfaces = tops.length;
  for (const e of tops) {
    const r = e.getBoundingClientRect(), out = [];
    if (r.left < -1) out.push("left " + Math.round(-r.left));
    if (r.top < -1) out.push("top " + Math.round(-r.top));
    if (r.right > W + 1) out.push("right " + Math.round(r.right - W));
    if (r.bottom > H + 1) out.push("bottom " + Math.round(r.bottom - H));
    if (out.length) findings.push({ rule: "offscreen", selector: sel(e), text: squash(e.textContent), value: out.join(", ") + " px", limit: "0 px (1 px tolerance)", detail: "clipped by the viewport, " + out.join(", ") + " px past the edge, limit 0 px" + (inView(r) ? "" : ", fully outside") });
  }

  lap("offscreen");
  const allowSel = cfg.motion.selectors.join(",");
  const motion = new Map();
  const sig = (e) => e.localName + [...e.classList].slice(0, 2).map((c) => "." + c).join("") + (e.id ? "#" + e.id : "");
  let scanned = 0;
  const seenMotion = (e) => shown(e) && inView(e.getBoundingClientRect());
  for (const e of document.querySelectorAll("*")) {
    if (!rendered(e)) continue;
    scanned++;
    const s = cs(e);
    if (s.transitionProperty === "none" || !s.transitionDuration.split(",").some((v) => parseFloat(v) > 0)) continue;
    if (e.matches(allowSel) || !seenMotion(e)) continue;
    const k = "transition " + sig(e);
    const m = motion.get(k) || { rule: "transition", selector: sel(e), text: squash(e.textContent).slice(0, 40), value: s.transitionProperty + " " + s.transitionDuration, limit: "none outside the allowlist", detail: "transition: " + s.transitionProperty + " " + s.transitionDuration + ", allowed only on " + cfg.motion.selectors.join(" "), n: 0 };
    m.n++; motion.set(k, m);
  }
  stats.motionScanned = scanned;
  for (const a of document.getAnimations()) {
    if (a.playState !== "running") continue;
    const e = a.effect && a.effect.target;
    if (!e || !seenMotion(e)) continue;
    if (a.animationName && cfg.motion.animations.includes(a.animationName)) continue;
    if (e.matches(allowSel)) continue;
    const what = a.animationName ? "animation " + a.animationName : a.transitionProperty ? "running transition " + a.transitionProperty : "script animation";
    const k = what + " " + sig(e);
    const m = motion.get(k) || { rule: "transition", selector: sel(e) + (a.effect.pseudoElement || ""), text: squash(e.textContent).slice(0, 40), value: what, limit: "none outside the allowlist", detail: what + " running at the shot, allowed only " + cfg.motion.animations.join(" "), n: 0 };
    m.n++; motion.set(k, m);
  }
  for (const m of motion.values()) { m.detail += m.n > 1 ? " · " + m.n + " elements" : ""; delete m.n; findings.push(m); }

  lap("motion");
  const contrast = [], moving = [];
  stats.contrastExempt = 0;
  for (const it of items) {
    if (it.aria || it.p.closest(":disabled,[aria-disabled=true]")) { stats.contrastExempt++; continue; }
    const s = cs(it.p);
    const clip = (() => { for (let n = it.p; n; n = n.parentElement) { const c = cs(n); if (/text/.test(c.backgroundClip + " " + (c.webkitBackgroundClip || ""))) return true; } return false; })();
    const raw = it.svg ? s.fill : it.placeholder ? getComputedStyle(it.p, "::placeholder").color : s.webkitTextFillColor || s.color;
    const fg = /^url\(/.test(raw) || clip ? null : rgba(raw);
    const large = it.fontPx >= 24 || (it.fontPx >= 18.66 && it.weight >= 700);
    const base = { selector: sel(it.p), text: it.text };
    if (!fg) { unknown.push({ rule: "contrast", ...base, detail: "text paint is " + (clip ? "background-clip: text" : raw) }); continue; }
    const alpha = fg[3] * opacity(it.p) * (it.svg ? +s.fillOpacity : 1);
    const box = (r) => [Math.max(0, r.left), Math.max(0, r.top), Math.min(W, r.right), Math.min(H, r.bottom)];
    contrast.push({ ...base, fg, alpha, need: large ? 3 : 4.5, large, rects: it.seen.map(box) });
    moving.push([it.p, it.p.getBoundingClientRect()]);
  }
  for (const [rule, check] of extra) {
    try { for (const f of check({ cfg, W, H, items, sel, squash, shown, inView, cs, stats }) || []) { const u = f.unknown; delete f.unknown; (u ? unknown : findings).push({ rule, ...f }); } }
    catch (e) { unknown.push({ rule, selector: "", text: "", detail: "rule threw: " + e.message }); }
  }
  lap("contrast+rules");
  stats.laps = laps;
  window.__acanAuditMoving = moving;
  stats.contrastItems = contrast.length;
  stats.collectMs = Math.round(performance.now() - t0);
  return { findings, unknown, stats, contrast, view: [W, H] };
}

// Decodes the 8-bit RGB or RGBA PNG that Page.captureScreenshot returns.
function decodePng(buf) {
  let i = 8, w = 0, h = 0, type = 0;
  const idat = [];
  while (i < buf.length) {
    const len = buf.readUInt32BE(i), kind = buf.toString("ascii", i + 4, i + 8), body = buf.subarray(i + 8, i + 8 + len);
    if (kind === "IHDR") { w = body.readUInt32BE(0); h = body.readUInt32BE(4); type = body[9]; if (body[8] !== 8 || (type !== 2 && type !== 6)) throw new Error("unsupported png"); }
    else if (kind === "IDAT") idat.push(body);
    else if (kind === "IEND") break;
    i += 12 + len;
  }
  const bpp = type === 6 ? 4 : 3, stride = w * bpp, raw = inflateSync(Buffer.concat(idat)), px = Buffer.alloc(stride * h);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], s = y * (stride + 1) + 1, o = y * stride, u = o - stride;
    if (f === 0) raw.copy(px, o, s, s + stride);
    else if (f === 1) for (let x = 0; x < stride; x++) px[o + x] = raw[s + x] + (x >= bpp ? px[o + x - bpp] : 0);
    else if (f === 2) for (let x = 0; x < stride; x++) px[o + x] = raw[s + x] + (y ? px[u + x] : 0);
    else if (f === 3) for (let x = 0; x < stride; x++) px[o + x] = raw[s + x] + (((x >= bpp ? px[o + x - bpp] : 0) + (y ? px[u + x] : 0)) >> 1);
    else for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? px[o + x - bpp] : 0, b = y ? px[u + x] : 0, c = x >= bpp && y ? px[u + x - bpp] : 0;
      const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      px[o + x] = raw[s + x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
    }
  }
  return { w, h, bpp, px };
}
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const over = (fg, a, bg) => [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));

// The background under a line of text is the most common colour in its box once glyph pixels,
// which sit near the text colour, are set aside. Sampling the shot itself needs no second
// screenshot and no hidden-text repaint, so the audit does not stretch the page's clocks.
function background(img, [l, t, r, b], fg, sx, sy) {
  const buckets = new Map();
  const x0 = Math.floor(l * sx), x1 = Math.ceil(r * sx), y0 = Math.floor(t * sy), y1 = Math.ceil(b * sy);
  const step = Math.max(1, Math.round(Math.sqrt(((x1 - x0) * (y1 - y0)) / 4000)));
  for (let y = y0; y < Math.min(y1, img.h); y += step) for (let x = x0; x < Math.min(x1, img.w); x += step) {
    const k = (y * img.w + x) * img.bpp, c = [img.px[k], img.px[k + 1], img.px[k + 2]];
    if (Math.abs(c[0] - fg[0]) + Math.abs(c[1] - fg[1]) + Math.abs(c[2] - fg[2]) < 24) continue;
    const key = (c[0] >> 3) * 1024 + (c[1] >> 3) * 32 + (c[2] >> 3);
    const e = buckets.get(key) || { n: 0, s: [0, 0, 0] };
    e.n++; e.s[0] += c[0]; e.s[1] += c[1]; e.s[2] += c[2];
    buckets.set(key, e);
  }
  let best = null;
  for (const e of buckets.values()) if (!best || e.n > best.n) best = e;
  return best && best.s.map((v) => v / best.n);
}


// Run just before the screenshot, so the audit can tell which text held still across the shot.
// An element counts as unchanged when one with the same tag, class, own text and box was there at
// the shot, so a re-render that swaps in an identical node keeps its contrast check.
const SHOT_SIG = `const shotSig = (e, r) => { let t = ""; for (const n of e.childNodes) if (n.nodeType === 3) t += n.data; const h = (v) => Math.round(v * 2) / 2; return e.localName + "|" + e.getAttribute("class") + "|" + t.trim().slice(0, 80) + "|" + h(r.left) + "," + h(r.top) + "," + h(r.width) + "," + h(r.height); };`;
export const SHOT_MARK = `(() => { ${SHOT_SIG} const m = new Set(); for (const e of document.querySelectorAll("body *")) m.add(shotSig(e, e.getBoundingClientRect())); window.__acanShotRects = m; return true; })()`;

const CONTRAST_MOVED = `new Promise((ok) => {
  ${SHOT_SIG}
  const m = window.__acanAuditMoving || [], shot = window.__acanShotRects;
  delete window.__acanAuditMoving; delete window.__acanShotRects;
  const diff = (a, b) => Math.max(Math.abs(a.left - b.left), Math.abs(a.top - b.top), Math.abs(a.width - b.width), Math.abs(a.height - b.height));
  const say = (d, when) => d > 0.5 ? "text moved " + Math.round(d * 10) / 10 + " px " + when : "";
  const done = () => ok(m.map(([e, a]) => {
    if (shot && !shot.has(shotSig(e, a))) return "text moved or changed between the screenshot and the audit";
    return say(diff(a, e.getBoundingClientRect()), "between frames");
  }));
  requestAnimationFrame(() => requestAnimationFrame(done));
  setTimeout(done, 120);
})`;

// Pixel sampling runs in Node and the page clock keeps running while it does, so it is deferred:
// drive.mjs calls r.finish() once the steps are done. Only the page reads happen at the shot.
export async function audit({ send, evaluate }, shotBase64) {
  const extra = "[" + PAGE_RULES.map((p) => "[" + JSON.stringify(p.rule) + "," + p.check.toString() + "]").join(",") + "]";
  const r = await evaluate("(" + pageAudit.toString() + ")(" + JSON.stringify(CONFIG) + "," + extra + ")");
  const { contrast, view } = r;
  delete r.contrast; delete r.view;
  r.stats.appearance = await evaluate(APPEARANCE);
  if (!contrast.length) return r;
  const png = shotBase64 || (await send("Page.captureScreenshot", { format: "png" })).data;
  // The shot was taken before the geometry was read. Text that moved since SHOT_MARK, or is still
  // moving (a camera ease, a walking chip), may sit somewhere else in the shot, so its sample
  // would be of whatever was there instead.
  const moved = await evaluate(CONTRAST_MOVED);
  Object.defineProperty(r, "finish", { enumerable: false, value: () => sampleContrast(r, contrast, moved, view, png) });
  return r;
}

function sampleContrast(r, contrast, moved, view, png) {
  const t = Date.now();
  let img = null;
  try { img = decodePng(Buffer.from(png, "base64")); }
  catch (e) { for (const c of contrast) r.unknown.push({ rule: "contrast", selector: c.selector, text: c.text, detail: "screenshot not readable: " + e.message }); return r; }
  const sx = img.w / view[0], sy = img.h / view[1];
  for (const [i, c] of contrast.entries()) {
    if (moved[i]) { r.unknown.push({ rule: "contrast", selector: c.selector, text: c.text, detail: moved[i] }); continue; }
    const fgRgb = c.fg.slice(0, 3);
    let worst = null;
    for (const box of c.rects) {
      const bg = background(img, box, fgRgb, sx, sy);
      if (!bg) continue;
      const shown = over(fgRgb, c.alpha, bg), q = ratio(shown, bg);
      if (!worst || q < worst.q) worst = { q, bg, shown };
    }
    if (!worst) { r.unknown.push({ rule: "contrast", selector: c.selector, text: c.text, detail: "no background pixels apart from the text colour" }); continue; }
    if (worst.q < c.need) r.findings.push({ rule: "contrast", selector: c.selector, text: c.text, value: worst.q.toFixed(2) + ":1", limit: c.need + ":1", detail: worst.q.toFixed(2) + ":1, needs " + c.need + ":1 · text rgb(" + worst.shown.map(Math.round).join(",") + ") on rgb(" + worst.bg.map(Math.round).join(",") + ")" + (c.large ? " · large" : "") });
  }
  r.stats.sampleMs = Date.now() - t;
  return r;
}

// Returns each control followed by its parent and grandparent, so one getProperties call yields
// every node the audit forces.
function pageFocusList(cap) {
  const W = innerWidth, H = innerHeight;
  const opacity = (e) => { let v = 1; for (let n = e; n && n.nodeType === 1; n = n.parentElement) v *= +getComputedStyle(n).opacity; return v; };
  const all = [...document.querySelectorAll("a[href],button,input,select,textarea,summary,[tabindex],[contenteditable=true]")].filter((e) => {
    if (e.disabled || e.tabIndex < 0 || e.closest("[inert],[hidden]") || (e.type === "hidden")) return false;
    const face = e.closest("label") || e;
    const r = face.getBoundingClientRect();
    if (!face.getClientRects().length || getComputedStyle(face).visibility !== "visible" || opacity(face) <= 0.05) return false;
    return r.right > 0 && r.bottom > 0 && r.left < W && r.top < H;
  });
  window.__acanFocusTotal = all.length;
  window.__acanFocusBefore = document.activeElement;
  return all.slice(0, cap).flatMap((e) => [e, e.parentElement, e.parentElement && e.parentElement.parentElement]);
}

function pageFocusLook() {
  const look = (e, pseudo) => { if (!e) return ""; const s = getComputedStyle(e, pseudo); return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.outlineOffset, s.boxShadow, s.borderTopColor, s.borderRightColor, s.borderBottomColor, s.borderLeftColor, s.borderTopWidth, s.borderBottomWidth].join("|"); };
  const ring = (e) => { const s = getComputedStyle(e); return s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0 ? "outline " + s.outlineWidth + " " + s.outlineStyle : ""; };
  const sib = this.nextElementSibling, par = this.parentElement, gp = par && par.parentElement;
  return { parts: [look(this), look(this, "::before"), look(this, "::after"), look(sib), look(par), look(gp)], ring: ring(this), shadow: getComputedStyle(this).boxShadow !== "none", active: this.matches(":focus") };
}

const focusDescribe = "function(){const p=(n)=>n.id?'#'+n.id:n.localName+[...n.classList].slice(0,2).map(c=>'.'+c).join('');let a=this.parentElement;while(a&&!a.id&&a!==document.body)a=a.parentElement;const text=(this.getAttribute('aria-label')||this.textContent||this.value||'').replace(/\\s+/g,' ').trim().slice(0,60);return{selector:(a&&a.id&&!this.id?p(a)+' ':'')+p(this),text,key:[this.localName,this.id,this.className,this.type,this.disabled,...['role','aria-pressed','aria-expanded','aria-current','aria-selected','aria-checked'].map(k=>this.getAttribute(k)),this.parentElement&&this.parentElement.localName+'.'+this.parentElement.getAttribute('class')].join('|')}}";
const focusInfo = "function(){return{who:(" + focusDescribe + ").call(this),plain:(" + pageFocusLook.toString() + ").call(this)}}";

// Verdicts carry over between focus audits in one drive run, and are shared inside one audit. A
// control with the same tag, id, classes, role, ARIA state and parent tag and classes in the same
// appearance is taken to get the same focus style, so only the first one is forced. Its text is
// left out of the key so that pins and rows whose labels change still share one verdict.
const focusVerdicts = new Map();

// Forces :focus and :focus-visible through CDP instead of pressing Tab, because Tab and focus
// handlers are bound by ui-v1 and the concepts; real focus would change selection mid-flow.
// The page clock keeps running during the audit and steps files time their waits against it, and
// each CDP round trip can wait a renderer frame, so commands go out pipelined: every control's
// force, read and release burst is sent at once. CDP runs a session's commands in order, so each
// read still sees only its own control forced.
export async function auditFocus({ send, evaluate }, { cap = 80 } = {}) {
  const t = Date.now(), findings = [], unknown = [], phases = {};
  const lap = (k) => { phases[k] = Date.now() - t - Object.values(phases).reduce((a, b) => a + b, 0); };
  const call = async (objectId, fn) => (await send("Runtime.callFunctionOn", { objectId, functionDeclaration: fn, returnByValue: true })).result.value;
  const node = async (objectId) => objectId ? (await send("DOM.requestNode", { objectId })).nodeId : null;
  const force = (nodeId, forcedPseudoClasses) => send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses });
  const [, , , list, appearance] = await Promise.all([
    send("DOM.enable"), send("CSS.enable"), send("DOM.getDocument", { depth: 0 }),
    send("Runtime.evaluate", { expression: "(" + pageFocusList.toString() + ")(" + cap + ")", returnByValue: false }),
    evaluate(APPEARANCE),
  ]);
  const props = await send("Runtime.getProperties", { objectId: list.result.objectId, ownProperties: true });
  const flat = [];
  for (const p of props.result) if (/^\d+$/.test(p.name)) flat[+p.name] = p.value && p.value.objectId;
  const n = Math.floor(flat.length / 3);
  let reused = 0;
  lap("list");
  const controls = await Promise.all(Array.from({ length: n }, async (_, k) => {
    const objectId = flat[3 * k];
    const [info, ...nodes] = await Promise.allSettled([call(objectId, focusInfo), ...[0, 1, 2].map((j) => node(flat[3 * k + j]))]);
    if (info.status === "rejected") return { who: { selector: "focusable #" + (k + 1), text: "" }, error: String(info.reason && info.reason.message) };
    const { who, plain } = info.value, key = appearance + "|" + who.key;
    if (!plain.active && focusVerdicts.has(key)) return { who, plain, key, cached: focusVerdicts.get(key) };
    const bad = nodes.find((x) => x.status === "rejected");
    if (bad) return { who, error: String(bad.reason && bad.reason.message) };
    return { objectId, who, plain, key, self: nodes[0].value, up: nodes.slice(1).map((x) => x.value).filter((x) => x) };
  }));
  lap("describe");
  const first = new Set();
  const looks = controls.map((c) => {
    if (c.error || c.cached !== undefined || c.plain.active) return null;
    if (first.has(c.key)) { c.dup = true; return null; }
    first.add(c.key);
    const on = [force(c.self, ["focus", "focus-visible"]), ...c.up.map((u) => force(u, ["focus-within"]))];
    const look = call(c.objectId, pageFocusLook.toString());
    const off = [c.self, ...c.up].map((u) => force(u, []));
    return Promise.all([look, ...on, ...off]).then(([v]) => v, (e) => ({ error: e.message }));
  });
  const focusedLooks = await Promise.all(looks);
  for (const [i, c] of controls.entries()) {
    if (c.error) { unknown.push({ rule: "focus-ring", selector: c.who.selector, text: c.who.text, detail: c.error }); continue; }
    if (c.dup) c.cached = focusVerdicts.has(c.key) ? focusVerdicts.get(c.key) : undefined;
    if (c.cached !== undefined) { reused++; if (c.cached) findings.push({ ...c.cached, selector: c.who.selector, text: c.who.text }); continue; }
    if (c.dup) { unknown.push({ rule: "focus-ring", selector: c.who.selector, text: c.who.text, detail: "shares a key with a control the audit could not read" }); continue; }
    // Real focus cannot be lifted by forcePseudoState, so the focused control is judged on its own look.
    if (c.plain.active) {
      if (!c.plain.ring && !c.plain.shadow) findings.push({ rule: "focus-ring", selector: c.who.selector, text: c.who.text, value: "no outline or box-shadow", limit: "a visible outline or box-shadow", detail: "has focus now and shows no outline or box-shadow" });
      continue;
    }
    const focused = focusedLooks[i];
    if (focused.error) { unknown.push({ rule: "focus-ring", selector: c.who.selector, text: c.who.text, detail: focused.error }); continue; }
    const f = focused.parts.every((v, k) => v === c.plain.parts[k])
      ? { rule: "focus-ring", selector: c.who.selector, text: c.who.text, value: "no change", limit: "a visible outline, box-shadow or border change", detail: "focused style equals unfocused style" + (c.plain.ring ? " (" + c.plain.ring + " in both)" : ", no outline, box-shadow or border change") }
      : null;
    focusVerdicts.set(c.key, f);
    if (f) findings.push(f);
  }
  lap("force");
  const [total, moved] = await evaluate("(() => { const b = window.__acanFocusBefore, total = window.__acanFocusTotal; delete window.__acanFocusBefore; delete window.__acanFocusTotal; if (document.activeElement === b) return [total, false]; if (b && b.isConnected) b.focus({ preventScroll: true }); return [total, true]; })()");
  // Nothing waits on the release: later commands queue behind it.
  for (const m of ["CSS.disable", "DOM.disable"]) send(m).catch(() => {});
  lap("restore");
  return { findings, unknown, stats: { focusable: total, checked: n, reused, restored: moved, appearance, phases, ms: Date.now() - t } };
}
// A re-render that swaps the focused node for an equal one and refocuses it has not moved focus,
// so the mark keeps a description to compare when the old node is gone.
const FOCUS_SAY = `const d = (e) => !e || e === document.body ? "body|" : (e.id ? "#" + e.id : e.localName + [...e.classList].slice(0, 2).map((c) => "." + c).join("")) + "|" + (e.getAttribute("aria-label") || e.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 60);`;
export const FOCUS_MARK = `(() => { ${FOCUS_SAY} window.__acanFocusMark = { el: document.activeElement, say: d(document.activeElement) }; return true; })()`;
export const FOCUS_CHECK = `(() => {
  ${FOCUS_SAY}
  const mark = window.__acanFocusMark, was = mark.el, now = document.activeElement;
  delete window.__acanFocusMark;
  if (was === now || (mark.say === d(now) && (!was || was === document.body || !was.isConnected))) return null;
  const sayWas = mark.say.split("|")[0];
  const [sel, text] = d(now).split("|");
  // When the focused control is removed, placing focus on its successor keeps keyboard users in
  // place, and the removal is usually the late result of an earlier key. The audit cannot tell, so
  // it reports the move as unknown.
  if (was && was !== document.body && !was.isConnected) return { unknown: true, rule: "focus-steal", selector: sel, text, detail: "focus moved from " + sayWas + " (removed from the page) to " + sel };
  return { rule: "focus-steal", selector: sel, text, value: "moved to " + sel, limit: "no move without input", detail: "focus moved from " + sayWas + " to " + sel + " with no input" };
})()`;

// node audit.mjs selftest [dir]                  drives a broken and a clean fixture page through drive.mjs and checks
//                                                that every rule fires on the broken page and stays quiet on the clean one.
//                                                dir defaults to <tmp>/audit-fixtures.
// node audit.mjs steps <outDir> <steps.json>...  writes <outDir>/dark and <outDir>/light variants of steps files, with a
//                                                {"audit":"focus"} step after every shot, to pass to run-steps.mjs.
// node audit.mjs report <outRoot>...             prints per-rule counts per steps file and appearance, then the top findings.
// A rule added to PAGE_RULES needs a planted case in FIXTURES.broken.expect, or the selftest fails it.
// The same lock dir run-steps.mjs takes, so fixture drives never overlap a concept drive.
const LOCK = join(tmpdir(), "acan-drive.lock");
const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
function locked(fn) {
  for (;;) { try { mkdirSync(LOCK); break; } catch (e) { if (e.code !== "EEXIST") throw e; sleepSync(500); } }
  try { return fn(); } finally { rmSync(LOCK, { recursive: true, force: true }); }
}
const FIXTURE_CSS = `body{margin:0;background:#101214;color:#e6e6e6;font:14px/1.3 sans-serif}
.a{position:absolute;white-space:nowrap}.tag{background:#2a2d31;padding:2px 6px}
button{position:absolute;background:#000;color:#fff;border:1px solid #555;font:14px sans-serif;padding:4px 8px}
.egress{position:absolute;left:1300px;top:20px;padding:4px 10px;background:#1c1f22}
#gateKv{position:absolute;left:400px;top:260px;width:240px;padding:6px;background:#000}
#gateKv header,.gate-kvlog-row{display:flex;justify-content:space-between}#gateKv i{font-style:normal}
[role=dialog]{position:fixed;top:600px;width:300px;height:100px;padding:8px;background:#1c1f22}
.glass{position:absolute;left:40px;top:240px;width:260px;height:36px;background:#fff}.glass>div{position:absolute;inset:0;background:rgba(0,0,0,.85)}
#fxKeep,.keep{outline:none}#fxKeep:focus-visible,.keep:focus-visible{outline:2px solid #fff}
@keyframes fxPulse{to{opacity:.6}}`;
const kvLog = (pill, total, rows) => `<span class="egress">local + kvarm · ${pill} B out</span><div id="gateKv" class="pop"><header><span>log · ${rows.length} ops</span> <b>${total} B</b></header>${rows.map((b, i) => `<div class="gate-kvlog-row"><b>op ${i + 1}</b> <i>${b} B</i></div>`).join("")}</div>`;
const fixturePage = (body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>audit fixture</title><style>${FIXTURE_CSS}</style></head><body>${body}</body></html>`;
const fixtureWords = (n) => Array(n).fill("word").join(" ");
const budgetCard = (n) => `<div id="fxBudgetCard" class="pop" style="position:absolute;left:800px;top:430px;width:400px">${fixtureWords(n)}</div>`;
const budgetScreen = (n, team = false) => (team ? "<i data-team></i>" : "") + [50, 50, n - 100].map((words, i) => `<div id="fxBudget${i}" class="pop" style="position:absolute;left:${40 + 500 * i}px;top:40px;width:400px">${fixtureWords(words)}</div>`).join("");
const TEXT_CASES = [
  { shot: "card-over-budget", html: budgetCard(61), total: 61, findings: [["#fxBudgetCard", "card 61 > 60", 61, 60]] },
  { shot: "card-at-budget", html: budgetCard(60), total: 60 },
  { shot: "excluded-copy", total: 60, user: 7, html: `<div id="fxBudgetCard" class="pop" style="position:absolute;left:40px;top:40px;width:700px">
${fixtureWords(58)} éclair 1,336 B · → %
<span data-text="user">user wrote this</span><span class="quiet-sentence">four user written words</span>
<kbd>${fixtureWords(20)}</kbd><span class="mono">${fixtureWords(20)}</span><span data-text="glyph">${fixtureWords(20)}</span>
<div class="pal-row"><span class="ic">${fixtureWords(20)}</span></div>
<div id="quiet-prov" hidden>${fixtureWords(80)}</div><div id="quiet-kv-panel" style="display:none">${fixtureWords(80)}</div>
<div style="visibility:hidden">${fixtureWords(80)}</div><div style="content-visibility:hidden">${fixtureWords(80)}</div>
<div style="opacity:.1"><span style="opacity:.1">${fixtureWords(80)}</span></div>
<details style="position:fixed;left:40px;top:700px;width:700px"><summary><kbd>Alt</kbd></summary><div>${fixtureWords(80)}</div></details>
<textarea>${fixtureWords(20)}</textarea><input value="ignored input"><select><option>ignored option</option></select>
<script type="application/json">${JSON.stringify(fixtureWords(80))}</script></div>` },
  ...[[136, false], [137, false], [137, true], [150, true], [151, true]].map(([n, team]) => ({
    shot: (team ? "team-" : "solo-") + n, html: budgetScreen(n, team), total: n, cap: team ? 150 : 136,
    findings: n > (team ? 150 : 136) ? [["body", "screen " + n + " > " + (team ? 150 : 136), n, team ? 150 : 136]] : [],
  })),
  { shot: "row-at-budget", html: `<div class="pop"><div id="fxRow" class="quiet-reading">${fixtureWords(8)}</div></div>`, total: 8 },
  { shot: "row-over-budget", html: `<div class="pop"><div id="fxRow" class="quiet-reading">${fixtureWords(9)}</div></div>`, total: 9, findings: [["#fxRow", "row 9 > 8", 9, 8]] },
  { shot: "choice-at-budget", html: `<div class="pop"><div id="fxChoice" class="quiet-answer">${fixtureWords(12)}</div></div>`, total: 12 },
  { shot: "choice-over-budget", html: `<div class="pop"><div id="fxChoice" class="quiet-answer">${fixtureWords(13)}</div></div>`, total: 13, findings: [["#fxChoice", "choice 13 > 12", 13, 12]] },
  ...[
    ["pill", "fxSurface", 'class="quiet-mark"', 7, 6],
    ["toast", "toast", "", 9, 8],
    ["island", "fxSurface", 'class="fl"', 13, 12],
    ["queue", "fxSurface", 'class="fl bl"', 25, 24],
    ["deck", "rpdeck", "", 31, 30],
    ["rest", "quiet-dock", "", 25, 24],
    ["empty", "quiet-guide", "data-empty", 21, 20],
    ["palette", "pal", "", 41, 40],
    ["plant", "stage", "", 21, 20],
    ["other", "fxSurface", "", 1, 0],
  ].map(([kind, id, attrs, n, cap]) => ({
    shot: kind + "-over-budget", html: `<div id="${id}" ${attrs}>${fixtureWords(n)}</div>`, total: n,
    findings: [[kind === "other" ? "body" : "#" + id, kind + " " + n + " > " + cap, n, cap]],
  })),
  { shot: "clipped-copy", total: 0, html: `<div class="pop" style="position:absolute;left:40px;top:40px;width:100px;height:30px;overflow:hidden"><span style="position:absolute;left:200px;white-space:nowrap">${fixtureWords(80)}</span></div><div class="pop" style="position:absolute;left:1800px">${fixtureWords(80)}</div>` },
  { shot: "covered-stage", total: 2, html: `<div id="stage"><span style="position:absolute;left:40px;top:40px">${fixtureWords(30)}</span><span style="position:absolute;left:40px;top:140px">plant</span></div><div class="fl" style="position:absolute;left:40px;top:40px;width:1200px;height:30px;background:#000">island</div>` },
  { shot: "alt-reveal", html: budgetCard(61), total: 61, layer: true, alt: true },
  ...["quiet-prov", "quiet-kv-panel", "net", "layers", "ex"].map((id) => ({
    shot: id + "-reveal", html: budgetCard(61) + `<div id="${id}" style="width:20px;height:20px"></div>`, total: 61, layer: true,
  })),
];

// #fxGlass and #fxGlassOk sit on an 85% black layer over white. Reading the nearest opaque background
// would call black-on-it 21:1 and white-on-it 1:1; the composited shot gives 1.4:1 and 15:1.
// #fxMid and #fxLarge share #7a7a7a (4.4:1): it fails at 14 px and passes the 3:1 large-text bar at 24 px.
const FIXTURES = {
  broken: {
    html: fixturePage(`<div class="pop">
<div class="a" id="fxTiny" style="left:40px;top:40px;font-size:9px">tiny text</div>
<div class="a" style="left:40px;top:70px;transform:scale(.7);transform-origin:0 0"><span id="fxShrunk">shrunk text</span></div>
<svg class="a" style="left:40px;top:100px" width="200" height="30"><text id="fxSvgTiny" x="0" y="40" font-size="20" transform="scale(.45)" fill="#e6e6e6">svg tiny</text></svg>
<div class="a" id="fxDim" style="left:40px;top:150px;color:#444">dim text</div>
<div class="a" id="fxFaded" style="left:40px;top:180px;color:#fff;opacity:.3">faded text</div>
<div class="a" id="fxMid" style="left:40px;top:210px;color:#7a7a7a">mid grey body text</div>
<div class="glass"><div><span class="a" id="fxGlass" style="left:8px;top:9px;color:#000">black on dark glass</span></div></div>
<div class="a tag" id="fxA" style="left:400px;top:40px">label A</div>
<div class="a tag" id="fxB" style="left:430px;top:48px">label B</div>
<div class="a" id="fxMove" style="left:400px;top:120px;transition:opacity .3s">fades on change</div>
<div class="a" id="fxPulse" style="left:400px;top:150px;animation:fxPulse 1s infinite alternate">pulses</div>
<button id="fxRing" style="left:400px;top:200px;outline:none">no ring</button>
${[1, 2].map((i) => `<button id="fxRing${i + 1}" style="left:${400 + i * 110}px;top:340px;outline:none">no ring ${i + 1}</button>`).join("")}
${[1, 2, 3].map((i) => `<button class="keep" style="left:${700 + i * 90}px;top:340px">ring ${i}</button>`).join("")}
</div>
${kvLog(100, 150, [100, 40])}
<div role="dialog" id="fxCard" class="pop" style="left:1450px">card past the edge</div>
${budgetCard(61)}`),
    steps: [
      { eval: "setTimeout(() => document.querySelector('#fxRing').focus(), 100); true", expect: true },
      { wait: 400 },
      { key: "Tab" },
      { eval: "[document.activeElement.id, document.activeElement.matches(':focus')]", expect: ["fxRing2", true] },
      { shot: "broken" },
      { audit: "focus" },
      { audit: "focus" },
    ],
    expect: {
      "type-floor": [/#fxTiny/, /#fxShrunk/, /#fxSvgTiny/],
      overlap: [/#fx[AB]\b/],
      offscreen: [/#fxCard/],
      contrast: [/#fxDim/, /#fxFaded/, /#fxMid/, /#fxGlass/],
      "focus-ring": [/#fxRing$/, /#fxRing2$/, /#fxRing3$/, /#fxRing$/, /#fxRing2$/, /#fxRing3$/],
      transition: [/#fxMove/, /#fxPulse/],
      "egress-sum": [/^\.egress$/, /#gateKv/, /^\.egress$/],
      "focus-steal": [/#fxRing/],
      "text-budget": [/^#fxBudgetCard$/],
    },
    focusedRing: /#fxRing2$/,
  },
  clean: {
    html: fixturePage(`<div class="pop">
<div class="a" id="fxFloor" style="left:40px;top:40px;font-size:11px">eleven px text</div>
<div class="a" style="left:40px;top:70px;transform:scale(.75);transform-origin:0 0"><span id="fxScaled" style="font-size:16px">scaled to 12 px</span></div>
<svg class="a" style="left:40px;top:100px" width="200" height="30"><text id="fxSvgOk" x="0" y="50" font-size="30" transform="scale(.4)" fill="#e6e6e6">svg at 12 px</text></svg>
<div class="a" id="fxBright" style="left:40px;top:150px;color:#ccc">bright text</div>
<div class="a" id="fxSoft" style="left:40px;top:175px;color:#fff;opacity:.85">mostly opaque text</div>
<div class="a" id="fxLarge" style="left:40px;top:200px;color:#7a7a7a;font-size:24px">large grey</div>
<div class="glass"><div><span class="a" id="fxGlassOk" style="left:8px;top:9px;color:#fff">white on dark glass</span></div></div>
<div class="a" data-audit-stack style="left:400px;top:40px"><div class="a tag" id="fxC">stack C</div><div class="a tag" id="fxD" style="left:30px;top:8px">stack D</div></div>
<div class="a tag" id="fxE" style="left:560px;top:40px">label E</div>
<div class="a orders-ink" id="fxInk" style="left:400px;top:120px;transition:clip-path .5s">ink in, allowed</div>
<div class="a" id="fxSlide" style="left:40px;top:300px;color:#333">sliding text</div>
<button id="fxKeep" style="left:400px;top:200px">kept ring</button>
${[1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<button class="keep" style="left:${400 + i * 90}px;top:340px">ring ${i}</button>`).join("")}
</div>
${kvLog(140, 140, [100, 40])}
<div role="dialog" id="fxCardOk" class="pop" style="left:1200px">card in view</div>
<script>const slide = document.querySelector("#fxSlide"); (function tick(t) { slide.style.left = 40 + (t / 4) % 100 + "px"; requestAnimationFrame(tick); })(0);</script>`),
    steps: [
      { eval: "document.querySelector('#fxKeep').focus(); setTimeout(() => { const o = document.querySelector('#fxKeep'), n = o.cloneNode(true); o.replaceWith(n); n.focus(); }, 100); true", expect: true },
      { wait: 400 },
      { eval: "const g = document.createElement('button'); g.id = 'fxGone'; g.textContent = 'gone'; g.style.cssText = 'left:700px;top:200px'; document.body.append(g); g.focus(); setTimeout(() => { g.remove(); document.querySelector('#fxKeep').focus(); }, 100); true", expect: true },
      { wait: 400 },
      { key: "Tab" },
      { eval: "[document.activeElement.className, document.activeElement.matches(':focus-visible')]", expect: ["keep", true] },
      { shot: "clean" },
      { audit: "focus" },
    ],
    expect: {},
    unknown: [
      ["focus-steal", /#fxKeep/, "focus placed on a successor after its control was removed is unknown, not a finding"],
      ["contrast", /#fxSlide/, "text moving at the shot is contrast unknown, not a finding"],
    ],
    stack: true,
  },
  text: {
    html: fixturePage(""),
    steps: TEXT_CASES.flatMap((c) => [
      { eval: `document.body.dataset.concept='quiet';document.body.classList.toggle('alt',${!!c.alt});document.body.innerHTML=${JSON.stringify(c.html)};true`, expect: true },
      { shot: c.shot },
    ]),
    expect: { "text-budget": TEXT_CASES.flatMap((c) => (c.findings || []).map(([selector]) => new RegExp("^" + selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"))) },
    budgets: TEXT_CASES,
  },
};

function selftest(dir) {
  mkdirSync(dir, { recursive: true });
  const drive = join(dirname(fileURLToPath(import.meta.url)), "drive.mjs"), checks = [];
  for (const [name, fx] of Object.entries(FIXTURES)) {
    const html = join(dir, name + ".html"), steps = join(dir, name + ".steps.json"), out = join(dir, name);
    writeFileSync(html, fx.html); writeFileSync(steps, JSON.stringify(fx.steps));
    const run = locked(() => spawnSync(process.execPath, [drive, html, "", steps, out], { env: { ...process.env, AUDIT: "1" }, encoding: "utf8" }));
    writeFileSync(join(dir, name + ".log"), run.stdout + run.stderr);
    checks.push([name + ": drive ran with no page errors or step failures", /^OK\r?$/m.test(run.stdout)]);
    const s = JSON.parse(readFileSync(join(out, "audit-summary.json"), "utf8"));
    const all = s.audits.flatMap((a) => a.findings), unk = s.audits.flatMap((a) => a.unknown);
    for (const rule of RULES) {
      const got = all.filter((f) => f.rule === rule), want = fx.expect[rule] || [];
      const planted = name !== "broken" || want.length > 0;
      const ok = planted && got.length === want.length && want.every((re) => got.some((f) => re.test(f.selector)));
      checks.push([`${name}: ${rule} ${got.length} findings, want ${want.length}` + (planted ? "" : " (no planted case in FIXTURES.broken.expect)") + got.map((f) => " · " + f.selector + " " + (f.value || f.detail) + (f.limit ? " vs " + f.limit : "")).join(""), ok]);
    }
    for (const [rule, re, what] of fx.unknown || []) checks.push([name + ": " + what, unk.some((u) => u.rule === rule && re.test(u.selector))]);
    for (const c of fx.budgets || []) {
      const a = s.audits.find((a) => a.shot === c.shot), b = a && a.stats.textBudget;
      checks.push([`${name}: ${c.shot} counts ${c.total} product words, ${c.user || 0} user words, cap ${c.cap || 136}, reveal ${!!c.layer}`, !!b && b.total === c.total && b.user === (c.user || 0) && b.cap === (c.cap || 136) && b.layer === !!c.layer]);
      const got = a ? a.findings.filter((f) => f.rule === "text-budget") : [], want = c.findings || [];
      checks.push([name + ": " + c.shot + " reports exactly the budget overruns with measured values and limits", !!a && !a.unknown.some((u) => u.rule === "text-budget") && got.length === want.length && want.every(([selector, detail, value, limit]) => got.some((f) => f.selector === selector && f.detail === detail && f.value === value && f.limit === limit))]);
    }
    const focusRuns = s.audits.filter((a) => /-focus$/.test(a.shot));
    if (focusRuns.length > 1) checks.push([name + ": a repeat focus audit reuses verdicts and reports the same findings", focusRuns[1].stats.reused >= 2 && focusRuns[1].findings.length === focusRuns[0].findings.length]);
    if (fx.focusedRing) checks.push([name + ": the control with real focus is judged on its own look", all.some((f) => f.rule === "focus-ring" && fx.focusedRing.test(f.selector) && /has focus now/.test(f.detail))]);
    if (fx.stack) checks.push([name + ": data-audit-stack opt-out counted and skipped", s.audits.some((a) => a.stats.stackOptOuts === 1 && a.stats.stackSkips >= 1)]);
  }
  return checks;
}

// The shell's light switch is shellAppearance() in build.mjs, which sets body[data-appearance] and the
// Layers select; the attribute also re-themes the plant drawing.
// World has its own F8 toggle and forces dark in its first step, so its light variant swaps every
// quoted 'dark' and 'light', which starts the run in light and keeps its theme checks consistent.
const LIGHT = "typeof shellAppearance === 'function' ? shellAppearance('light') : (document.body.dataset.appearance = 'light'); true";
function variants(outDir, files) {
  for (const look of ["dark", "light"]) mkdirSync(join(outDir, look), { recursive: true });
  for (const f of files) {
    const src = readFileSync(f, "utf8"), dark = JSON.parse(src).flatMap((s) => (s.shot ? [s, { audit: "focus" }] : [s]));
    const light = /"key":\s*"F8"/.test(src)
      ? JSON.parse(JSON.stringify(dark).replace(/(\\"|'|")(dark|light)\1/g, (m, q, w) => q + (w === "dark" ? "light" : "dark") + q))
      : [{ eval: LIGHT, expect: true }, ...dark];
    if (!/"key":\s*"F8"/.test(src)) {
      // A reload drops body[data-appearance], so light is re-applied after each reload's wait.
      for (const [i, s] of light.entries()) if (s.eval && /reload\(/.test(s.eval)) {
        const w = light[i + 1] && light[i + 1].wait ? i + 1 : i;
        light.splice(w + 1, 0, { eval: LIGHT, expect: true });
      }
    }
    writeFileSync(join(outDir, "dark", basename(f)), JSON.stringify(dark, null, 1));
    writeFileSync(join(outDir, "light", basename(f)), JSON.stringify(light, null, 1));
    console.log(join(outDir, "light", basename(f)) + (/"key":\s*"F8"/.test(src) ? " (F8 swap)" : " (body appearance)"));
  }
}

// Who fixes a finding: island is shell chrome (build.mjs islands, hint, pill), plant is the shell-drawn
// plant and its chips, concept is a concept's own cards, panels and pins. An overlap names both sides.
const CONCEPT_RE = /#(bench|clash|orders|quiet|gate|world)|\.(bench|clash|orders|quiet|gate|world)-/i, PLANT_RE = /#plant\b|#chips\b|\.chip\b/;
const owner = (s) => (CONCEPT_RE.test(s) ? "concept" : PLANT_RE.test(s) ? "plant" : "island");
const ownerOf = (f) => { const o = owner(f.selector), m = f.rule === "overlap" && /^overlaps (.+?) "/.exec(f.detail); return m ? [o, owner(m[1])].sort().join(" x ") : o; };

// Counts are findings summed over audits, then distinct (selector and text) in brackets, then ?unknowns.
// An audit takes the appearance it measured; focus audits and the tail inherit the shot before them.
function report(roots) {
  const rows = [], tops = [], owners = new Map();
  for (const root of roots) for (const name of readdirSync(root).sort()) {
    const file = join(root, name, "audit-summary.json");
    if (!existsSync(file)) continue;
    const s = JSON.parse(readFileSync(file, "utf8")), pass = basename(root), by = new Map(), seen = new Map();
    let look = "dark";
    for (const a of s.audits) {
      look = (a.stats && a.stats.appearance) || look;
      if (!by.has(look)) by.set(look, { audits: 0, rules: Object.fromEntries(RULES.map((r) => [r, { n: 0, d: new Set(), u: 0 }])) });
      const b = by.get(look);
      b.audits++;
      for (const f of a.findings) {
        b.rules[f.rule].n++; b.rules[f.rule].d.add(f.selector + "|" + f.text);
        const ok = f.rule + "|" + ownerOf(f); if (!owners.has(ok)) owners.set(ok, new Set()); owners.get(ok).add(name + "|" + look + "|" + f.selector + "|" + f.text);
        const k = look + "|" + f.rule + "|" + f.selector + "|" + f.text, e = seen.get(k) || { f, look, shots: [] };
        if (!e.shots.includes(a.shot)) e.shots.push(a.shot);
        seen.set(k, e);
      }
      for (const u of a.unknown) b.rules[u.rule].u++;
    }
    for (const [lk, b] of by) rows.push(`| ${name} | ${pass} | ${lk} | ${b.audits} | ` + RULES.map((r) => { const e = b.rules[r]; return (e.n ? e.n + " (" + e.d.size + ")" : "0") + (e.u ? " ?" + e.u : ""); }).join(" | ") + " |");
    tops.push(`\n### ${name} · ${pass} pass\n`);
    for (const r of RULES) for (const { f, look: lk, shots } of [...seen.values()].filter((e) => e.f.rule === r).sort((a, b) => b.shots.length - a.shots.length).slice(0, 4))
      tops.push(`- ${r} · ${lk} · ${ownerOf(f)} · \`${f.selector}\` · "${f.text}" · ${f.detail} · ${shots.length} shots, first ${shots[0]}`);
  }
  const own = [...owners].sort().map(([k, v]) => "| " + k.replace("|", " | ") + " | " + v.size + " |").join("\n");
  return `| steps file | pass | appearance | audits | ${RULES.join(" | ")} |\n|${"---|".repeat(RULES.length + 4)}\n${rows.join("\n")}\n\nDistinct findings (steps file, appearance, selector, text) by owner:\n\n| rule | owner | distinct |\n|---|---|---|\n${own}\n${tops.join("\n")}`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === "report" && rest.length) console.log(report(rest));
  else if (cmd === "steps" && rest.length > 1) variants(rest[0], rest.slice(1));
  else if (cmd === "selftest") {
    const dir = rest[0] || join(tmpdir(), "audit-fixtures"), checks = selftest(dir);
    for (const [what, ok] of checks) console.log((ok ? "PASS " : "FAIL ") + what);
    console.log("selftest pages, steps, logs and shots in " + dir);
    process.exit(checks.every((c) => c[1]) ? 0 : 1);
  } else { console.error("usage: node audit.mjs selftest [dir] | steps <outDir> <steps.json>... | report <outRoot>..."); process.exit(2); }
}
