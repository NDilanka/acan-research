// Shared base for the three direction prototypes in direction/00-synthesis.md (A Live paper, B Living cartographic,
// C Transit). Each direction renders the same fixture (direction-data.mjs, read only) on the island shell, owns #stage,
// and answers the same page hooks, so one steps file shape (dir-<x>.steps.json) drives and checks all three.
//
// What a builder writes, in concepts/dir-<x>.mjs only (plus any concepts/dir-<x>-*.mjs it imports):
//   export default directionStub({ id: "dir-<x>", label, css, html, lib, setup, render })
//   css        extra CSS. Scope it under body[data-concept="dir-<x>"] and use the --d-* kit tokens below, never literals.
//   html       markup appended to <body> once.
//   lib        array of functions inlined into the page before setup and render.
//   setup(ctx) runs once at init. Add wheel, drag, hover and key handling here, and guard keys with conceptActive(ctx.ID).
//   render(ctx) draws the whole direction for ctx.S into ctx.plane (and any card or overlay it owns). It runs on every
//              frame jump, clock tick, view change, Alt press and resize, and must finish synchronously, because a shot
//              follows the hook call. It may start motion only for events in ctx.fired.
// lib, setup and render are inlined into the page by source, so they can use only ctx, browser globals, other lib
// functions and the page helpers freeRect, cameraFor, levelFor, ledgerTotal, clockOf and LEVELS. No module imports.
//
// ctx = { D, S, ID, LABEL, plane, project, unproject, clock, fired, draw, setView }
//   D          the fixture (DIRECTION). D.frames lists F1, F2-1 to F2-5, F3, F4, F5, F6, F7-unmatched, F7-stale, F8.
//   S          state: frame, stop, view (world rect on screen), at (ms from 16:30:00), kv, card, hover, alt, level,
//              camera, shell { clock, waiting, egress }. Builders may set S.hover, S.card and call draw().
//   project    world units to screen px for the current camera; unproject is the inverse.
//   fired      events crossed since the last render while the stream plays; empty on jumps, seeks and frames.
//   draw()     re-render; setView(rect) moves the camera to a world rect (wheel, pan, fly-to) and re-renders.
//
// Shell: the base re-points the islands at the kit tokens, keeps the top islands, the egress pill and the waiting count
// (both driven from the fixture clock), and hides the islands that describe the hidden ui-v1 plant: the rail, the
// bottom-right zoom and telemetry island, and the bottom-left agent rows and floor timeline. Those slots are free.
// The camera fits the free rect with no rail (JOURNEY.md section 1, memo-opus.md section 4.7).
//
// Rules the steps file checks on every frame (keep them passing):
//   - one element per plant, [data-plant=<id>], inside ctx.plane, kept as the same node across the F2 sweep
//   - every element in the plane and in #dir-<x>-card sits in or under an element with data-binding, and every
//     data-binding value is a key of D.bindings
//   - the egress pill and waiting count match the frame; at rest the order flag shows, with READBACK · ACAN under kv=ok
//     and the lease holder row under kv=unmatched
//   - F5: the card shows at most six rows (li or [data-row]) in the 392 px slot and the camera equals F3's
//   - F8: no mark that exists on F3 moves
//   - with the stream paused, document.getAnimations() reports nothing running
//
// Page hooks, defined while the concept is active:
//   dirFrame(id)       jump to a frame; pauses the stream
//   dirEvents          play(rate), pause(), seek(ms), paused, at, past
//   dirState()         a copy of S plus clock and paused
//   dirData            the fixture
// Hash params: frame=<id> opens on that frame; kv=<unmatched|stale> opens on F7-<kv> when no frame is given.
import { DIRECTION, HELPERS, T0, clockOf } from "./direction-data.mjs";

// Dark from vendor/anatomy/iso-kit.mjs:568-578, light from 580-589 with the JOURNEY.md section 1 shell mapping.
// fail, ok and wait are text colours (4.5:1); the -mark variants are for strokes and fills (3:1), per the JOURNEY.md table.
// Dark --dim is #8f8f8f because the kit muted #6e6e6e is under 4.5:1 on the kit card #131313; it plays the role light --dim does.
export const TOKENS = {
  dark: { page: "#0b0b0b", card: "#131313", face: "#1b1b1b", line: "#2a2a2a", line2: "#3e3e3e", text: "#a3a3a3", ink: "#e6e6e6", dim: "#8f8f8f", faint: "#6e6e6e",
    focus: "#6b9bff", hover: "#1d1d1d", press: "#262626", tick: "#6a6a6a", fail: "#ff6b6b", ok: "#6be0a0", wait: "#e1a43c", ghost: "#6b9bff",
    "fail-mark": "#ff6b6b", "ok-mark": "#6be0a0", "wait-mark": "#e1a43c",
    glass: "rgba(19,19,19,.92)", shadow: "inset 0 1px 0 0 #ffffff0a,inset 0 0 0 1px #ffffff06,0 0 0 1px #00000026,0 1px 1px -.5px #00000014,0 3px 3px -1.5px #00000014,0 6px 6px -3px #00000014,0 12px 12px -6px #00000014" },
  light: { page: "#f2f2ef", card: "#fbfbfa", face: "#ffffff", line: "#e5e5e2", line2: "#dcdcd9", text: "#57575a", ink: "#18181a", dim: "#6a6a6e", faint: "#8c8c90",
    focus: "#3e63dd", hover: "#f4f4f1", press: "#ededea", tick: "#8a8a8f", fail: "#c62a2f", ok: "#1d7a50", wait: "#9a5b00", ghost: "#3e63dd",
    "fail-mark": "#e5484d", "ok-mark": "#30a46c", "wait-mark": "#b97700",
    glass: "rgba(251,251,250,.92)", shadow: "inset 0 1px 0 0 #ffffff,0 0 0 1px #0000000f,0 1px 1px -.5px #0000000a,0 3px 3px -1.5px #0000000a,0 6px 6px -3px #0000000a,0 12px 12px -6px #0000000a" },
};
const vars = (t) => Object.entries(t).map(([k, v]) => "--d-" + k + ":" + v).join(";");
// The shell islands read these names (build.mjs:48-57), so the direction re-points them at the kit tokens.
// Island key caps and carets are text set in --faint, so islands take the text-safe --d-dim there; --d-faint stays for marks.
const ISLAND_VARS = "--glass:var(--d-glass);--glass-hi:var(--d-card);--line:var(--d-line);--line2:var(--d-line2);--text:var(--d-text);--ink:var(--d-ink);--dim:var(--d-dim);--faint:var(--d-dim);--focus:var(--d-focus);--wait:var(--d-wait);--hover:var(--d-hover);--press:var(--d-press);--tick:var(--d-tick);--shadow:var(--d-shadow)";

export function themeCss(id) {
  const P = `body[data-concept="${id}"]`;
  return `${P}{${vars(TOKENS.dark)}}${P}[data-appearance=light]{${vars(TOKENS.light)}}`
    + `${P},${P} #stage{background:var(--d-page)}`
    + `${P} :is(.fl,.nav,.pop,.hint,.toast,.cbar,.watermark){${ISLAND_VARS}}`
    // Shell pulses and fades belong to the ui-v1 plant's clock; the direction owns all motion on its stage.
    + `${P} :is(.fl,.nav,.hint,.watermark,.toast),${P} :is(.fl,.nav) *{animation:none!important;transition:none!important}`
    // These islands show the hidden ui-v1 plant's static mock (camera rail, zoom and telemetry, agent rows such as
    // "Claude Code idle"), which contradicts the fixture, so their slots start empty for the direction.
    + `${P} :is(.nav,.fl.br,.bl .agent,.bl .tl){display:none}`;
}

function frameScript(id, label, { lib = [], setup, render }) {
  const D = JSON.stringify(DIRECTION).replace(/</g, "\\u003c");
  return `function ${id.replace(/\W/g, "_")}Init(params) {
  if (!conceptActive(${JSON.stringify(id)})) return;
  const D = ${D};
  const ID = ${JSON.stringify(id)}, LABEL = ${JSON.stringify(label)}, T0 = ${T0};
  // JSON turns the open-ended machine level's Infinity into null.
  const LEVELS = D.levels.map((l) => ({ ...l, below: l.below ?? Infinity }));
  ${HELPERS}
  ${clockOf.toString()}
  const clock = clockOf;
  ${lib.map((f) => f.toString()).join("\n")}
  const FRAME = Object.fromEntries(D.frames.map((f) => [f.id, f]));
  const S = { frame: null, stop: "plant", view: D.camera.stops.plant.rect, at: D.at.moment, kv: "ok", card: null, hover: null, alt: false, level: null, camera: null, shell: null };
  const plane = document.createElement("div");
  plane.className = ID + "-plane"; plane.id = ID + "-plane";
  document.getElementById("stage").append(plane);
  // Cards do not refit the camera: F5 proves the camera is unchanged when a card opens.
  function camera() {
    const cam = cameraFor(S.view, freeRect(innerWidth, innerHeight, { rail: "none" }));
    const acquit = D.plants.find((p) => p.id === "acquit");
    S.level = levelFor((acquit.rect[2] - acquit.rect[0]) * cam.ppu, S.level);
    S.camera = cam;
    return cam;
  }
  function shellAt(at, kv) {
    const past = D.events.filter((e) => e.at <= at), q = [];
    for (const e of past) { for (const a of e.queue.add || []) q.push(a); for (const d of e.queue.drop || []) q.splice(q.indexOf(d), 1); }
    let egress = D.kv[kv].egress.label;
    if (kv === "ok") {
      const rows = past.flatMap((e) => e.rows), sized = rows.filter((r) => r.bytes !== null);
      const bytes = sized.reduce((s, r) => s + r.bytes, 0), unsized = rows.length - sized.length;
      egress = "local + kvarm · " + bytes.toLocaleString("en-US") + " B out" + (unsized ? " + " + unsized + " unsized" : "");
    }
    return { clock: clock(at), waiting: q.length, egress };
  }
  function paintShell() {
    S.shell = shellAt(S.at, S.kv);
    if (typeof setWaitingCount === "function") setWaitingCount(S.shell.waiting);
    const eg = document.querySelector(".fl.tr .egress");
    if (eg && eg.lastChild.textContent !== S.shell.egress) eg.lastChild.textContent = S.shell.egress;
  }
  const render = ${(render || placeholder).toString()};
  const setup = ${(setup || (() => {})).toString()};
  let drawnAt = S.at, rate = 0;
  function draw() {
    const cam = camera();
    const fired = rate ? D.events.filter((e) => e.at > drawnAt && e.at <= S.at) : [];
    drawnAt = S.at;
    paintShell();
    render(ctx(cam, fired));
  }
  function ctx(cam, fired) {
    return { D, S, ID, LABEL, plane, clock, fired, draw, setView,
      project: (x, y) => [cam.sx + (x - cam.cx) * cam.ppu, cam.sy + (y - cam.cy) * cam.ppu],
      unproject: (px, py) => [cam.cx + (px - cam.sx) / cam.ppu, cam.cy + (py - cam.sy) / cam.ppu] };
  }
  function setView(rect) { S.view = rect; draw(); }
  function enter(f) {
    Object.assign(S, { frame: f.id, stop: f.stop, view: D.camera.stops[f.stop].rect, at: f.at, kv: f.kv, card: f.card, hover: f.hover, alt: f.alt, level: null });
    drawnAt = S.at;
    document.body.dataset.dirFrame = f.id;
    document.body.classList.toggle("alt", !!f.alt);
    draw();
  }
  let timer = 0, last = 0;
  const events = {
    play(r = 1) { events.pause(); rate = r; last = performance.now(); timer = setInterval(() => { const n = performance.now(); S.at += (n - last) * rate; last = n; draw(); }, 100); return S.at; },
    pause() { clearInterval(timer); timer = 0; rate = 0; return S.at; },
    seek(ms) { S.at = ms; drawnAt = ms; draw(); return S.at; },
    get paused() { return !rate; },
    get at() { return S.at; },
    // Events at or before the clock, oldest first.
    get past() { return D.events.filter((e) => e.at <= S.at); },
  };
  window.dirData = D;
  window.dirEvents = events;
  window.dirState = () => JSON.parse(JSON.stringify({ ...S, clock: clock(S.at), paused: events.paused }));
  window.dirFrame = (fid) => { const f = FRAME[fid]; if (!f) throw new Error("no frame " + fid + ", expected one of " + Object.keys(FRAME).join(", ")); events.pause(); enter(f); return window.dirState(); };
  const setAlt = (on) => { if (S.alt !== on) { S.alt = on; draw(); } };
  addEventListener("keydown", (e) => { if (e.key === "Alt") setAlt(true); });
  addEventListener("keyup", (e) => { if (e.key === "Alt") setAlt(false); });
  addEventListener("blur", () => setAlt(false));
  addEventListener("resize", draw);
  // JOURNEY.md section 1: the bottom-left island is one Waiting on you row at every level, like the world's .world-bl.
  document.querySelector(".fl.bl")?.classList.add("world-bl");
  setup(ctx(camera(), []));
  const kv = params.get("kv");
  window.dirFrame(params.get("frame") || (kv && FRAME["F7-" + kv] ? "F7-" + kv : "F3"));
}`;
}

// Placeholder render: one box per plant site from the fixture camera, the order flag on Acquit, a card in the card slot,
// and the frame line in the hint. Plant boxes are keyed so the F2 sweep keeps the same nodes.
function placeholder({ D, S, ID, LABEL, plane, project, clock }) {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const kv = D.kv[S.kv];
  for (const p of D.plants) {
    let site = plane.querySelector(`[data-plant="${p.id}"]`);
    if (!site) { site = document.createElement("div"); site.className = ID + "-site"; site.dataset.plant = p.id; site.dataset.binding = p.binding; plane.append(site); }
    const [x0, y0] = project(p.rect[0], p.rect[1]), [x1, y1] = project(p.rect[2], p.rect[3]), w = x1 - x0;
    Object.assign(site.style, { left: x0.toFixed(1) + "px", top: y0.toFixed(1) + "px", width: w.toFixed(1) + "px", height: (y1 - y0).toFixed(1) + "px" });
    const lines = p.id === "acquit" && S.level !== "org" && w > 240 ? [kv.order.flag, S.kv === "ok" ? D.moment.order.readback : kv.holderRow].filter(Boolean) : [];
    site.innerHTML = (w > 40 || S.alt ? `<span class="${ID}-name">${esc(p.name)}</span>` : "")
      + lines.map((t, i) => `<span class="${ID}-mark" data-binding="${S.kv === "ok" ? D.moment.order.binding : kv.binding}" style="top:${12 + i * 28}px">${esc(t)}</span>`).join("");
  }
  const hint = document.querySelector("body>.hint");
  if (hint) hint.textContent = [LABEL, S.frame, S.level, clock(S.at)].join(" · ");
  let card = document.getElementById(ID + "-card");
  if (!card) { card = document.createElement("aside"); card.id = ID + "-card"; card.className = ID + "-card"; document.body.append(card); }
  card.hidden = !S.card;
  if (!S.card) return;
  let title, rows, binding;
  if (S.card === "away") {
    title = D.away.title; binding = D.away.binding;
    rows = D.away.items.map((i) => [i.at || "", i.row, i.binding]);
  } else {
    const c = D.moment.clashes.find((x) => "clash:" + x.id === S.card);
    title = c.title; binding = c.binding;
    rows = [["", c.severity + " · " + c.at.belt, c.binding], ["", c.breaksRow, c.binding], ["", "Suggested · " + c.options.find((o) => o.kind === c.suggested).label, c.binding]];
  }
  card.dataset.binding = binding;
  card.innerHTML = `<h3>${esc(title)}</h3><ul>${rows.map(([t, r, b]) => `<li data-binding="${b}"><span class="${ID}-time">${esc(t)}</span>${esc(r)}</li>`).join("")}</ul>`;
}

function placeholderCss(id) {
  const P = `body[data-concept="${id}"]`;
  return `#${id}-card{display:none}`
    + `${P} .${id}-plane{position:absolute;inset:0;pointer-events:none}`
    + `${P} .${id}-site{position:absolute;border:1px solid var(--d-line2);background:var(--d-face);border-radius:4px}`
    + `${P} .${id}-name{position:absolute;left:0;bottom:100%;margin-bottom:4px;font:11px/14px var(--mono);color:var(--d-text);white-space:nowrap}`
    + `${P} .${id}-mark{position:absolute;left:12px;font:11px/14px var(--mono);color:var(--d-ink);background:var(--d-card);border:1px solid var(--d-line2);border-radius:6px;padding:4px 8px;white-space:nowrap}`
    + `${P} #${id}-card:not([hidden]){display:block;position:fixed;right:var(--inset);top:var(--below);width:var(--card);max-height:calc(100vh - var(--below) - var(--slot));overflow:auto;z-index:30;`
    + `background:var(--d-card);border:1px solid var(--d-line);border-radius:12px;box-shadow:var(--d-shadow);color:var(--d-text);padding:16px;font:13px/1.45 var(--sans)}`
    + `${P} #${id}-card h3{margin:0 0 10px;font:600 14px/1.3 var(--sans);color:var(--d-ink)}`
    + `${P} #${id}-card ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}`
    + `${P} #${id}-card li{display:grid;grid-template-columns:44px 1fr;gap:8px}`
    + `${P} .${id}-time{font:11px/18px var(--mono);color:var(--d-dim)}`;
}

export function directionStub({ id, label, css = "", html = "", lib, setup, render }) {
  return {
    id, label, stage: "own",
    hint: label + (render ? "" : " · placeholder"),
    css: themeCss(id) + (render ? "" : placeholderCss(id)) + css,
    html,
    script: frameScript(id, label, { lib, setup, render }),
  };
}
