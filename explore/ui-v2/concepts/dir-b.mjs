// Direction B, Living cartographic (direction/memo-gemini.md Directions 1 and 3): a matte architectural plane where
// healthy machines stay achromatic, hue names the agent, red marks what blocks, and amber marks what waits on you.
import { directionStub } from "./dir-base.mjs";
import * as L from "./dir-b-lib.mjs";

const P = 'body[data-concept="dir-b"]';
// Agent hues derive from the kit focus token by hue rotation, so light and dark stay on the kit palette.
const css = `
${P}{--b-cc:oklch(from var(--d-focus) l c calc(h + 50));--b-dr:oklch(from var(--d-focus) l calc(c * .8) calc(h - 95));--b-cx:oklch(from var(--d-focus) l c calc(h - 28));
--b-top:var(--d-face);--b-front:var(--d-line2);--b-edge:var(--d-tick);--b-plinth:var(--d-face);--b-plinth-f:var(--d-line);--b-plinth-e:var(--d-line2);--b-trk:var(--d-line2)}
${P}:not([data-appearance=light]){--b-top:var(--d-line);--b-front:var(--d-face);--b-edge:var(--d-line2);--b-plinth:var(--d-card);--b-plinth-f:var(--d-page);--b-plinth-e:var(--d-line);--b-trk:var(--d-line)}
${P} .cc{--h:var(--b-cc)}${P} .dr{--h:var(--b-dr)}${P} .cx{--h:var(--b-cx)}
${P} .dir-b-plane,${P} .dir-b-fxl{position:absolute;inset:0;overflow:hidden;pointer-events:none}
${P} .dir-b-plane{contain:strict}
${P} .dir-b-site{position:absolute;contain:layout style}
${P} .b-cap{font-weight:600;color:var(--d-ink);border-bottom:2px solid var(--h);margin:0 1px}
${P} .dir-b-geo,${P} .dir-b-art{position:absolute;left:0;top:0;overflow:visible}
${P} .b-plinth{fill:var(--b-plinth);stroke:var(--b-plinth-e);stroke-width:1}
${P} .b-plinth-f{fill:var(--b-plinth-f)}
${P} .b-terr{fill:none;stroke-width:1.25}
${P} .b-terr.claimed{fill:color-mix(in srgb,var(--h) 7%,var(--b-plinth));stroke:var(--h)}
${P} .b-terr.open{stroke:var(--h);stroke-opacity:.55;stroke-dasharray:1 3}
${P} .b-terr.verifying{fill:color-mix(in srgb,var(--h) 4%,var(--b-plinth));stroke:var(--h);stroke-dasharray:5 3}
${P} .b-terr.fog{fill:var(--d-hover);stroke:var(--d-tick);stroke-dasharray:2 3}
${P} .b-belt{fill:none;stroke:var(--b-trk);stroke-width:6;stroke-linejoin:round;stroke-linecap:round}
${P} .b-belt.thin{stroke-width:2}
${P} .b-belt.red{stroke:color-mix(in srgb,var(--d-fail-mark) 26%,var(--b-trk))}
${P} .b-belt.ghost{stroke:var(--d-ghost);stroke-width:1.5;stroke-dasharray:4 3}
${P} .b-chev{fill:none;stroke:var(--d-tick);stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
${P} .b-chev.red{stroke:var(--d-fail-mark);stroke-width:1.6}
${P} .b-wall{fill:none;stroke:var(--d-tick);stroke-width:2;stroke-dasharray:8 3}
${P} .b-trail{fill:none;stroke:var(--h);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
${P} .b-trail.pv{stroke-dasharray:6 4}
${P} .b-hit{fill:none;stroke:var(--d-ink);stroke-opacity:0;stroke-width:14;pointer-events:stroke;cursor:help}
${P} [data-hover]{pointer-events:visiblePainted}
${P} .b-port{fill:var(--d-face);stroke:var(--d-ink);stroke-width:1.5}
${P} .b-x{fill:none;stroke:var(--d-fail-mark);stroke-width:2}
${P} .b-top{fill:var(--b-top);stroke:var(--b-edge);stroke-width:1}
${P} .b-front{fill:var(--b-front);stroke:var(--b-edge);stroke-width:1}
${P} .b-dot{fill:var(--d-tick)}
${P} .b-m.fail .b-top{stroke:var(--d-fail-mark);stroke-width:1.5}
${P} .b-m.fail .b-front{fill:color-mix(in srgb,var(--d-fail-mark) 22%,var(--b-front));stroke:var(--d-fail-mark)}
${P} .b-m.fail .b-dot{fill:var(--d-fail-mark)}
${P} .b-m.ghost :is(.b-top,.b-front){fill:color-mix(in srgb,var(--d-ghost) 5%,var(--b-plinth));stroke:var(--d-ghost);stroke-dasharray:3 2}
${P} .b-m.ghost.dr :is(.b-top,.b-front){fill:color-mix(in srgb,var(--b-dr) 6%,var(--b-plinth));stroke:var(--b-dr)}
${P} .b-m.ghost .b-dot{fill:none;stroke:var(--d-ghost)}
${P} .b-m.dim,${P} .b-beltg.dim,${P} .b-crane.dim{opacity:.28}
${P} .b-detail{fill:none;stroke:var(--b-edge);stroke-width:1}
${P} .b-mouth{fill:var(--b-front);stroke:var(--b-edge);stroke-width:1}
${P} .b-door{fill:var(--b-edge)}
${P} .b-track{fill:var(--d-line2)}
${P} .b-failf{fill:var(--d-fail-mark)}
${P} .b-budget{stroke:var(--d-ink);stroke-width:1.5}
${P} .b-coil{fill:none;stroke:var(--d-tick);stroke-width:1}
${P} .b-coil.lit{stroke:var(--d-ink);stroke-width:1.4}
${P} .b-cell{fill:var(--d-line2)}
${P} .b-cell.on{fill:var(--d-ink)}
${P} .b-gantry{fill:none;stroke:var(--d-tick);stroke-width:1.5}
${P} .b-lamp{fill:var(--b-plinth);stroke:var(--d-tick);stroke-width:1}
${P} .b-lamp.lit{fill:var(--d-ok-mark);stroke:var(--d-ok-mark)}
${P} .b-pindot{fill:var(--d-ink)}
${P} .b-pin.must-not .b-pindot{fill:var(--b-plinth);stroke:var(--d-ink);stroke-width:1.5}
${P} .b-slash{stroke:var(--d-ink);stroke-width:1.5}
${P} .b-broken{fill:none;stroke:var(--d-fail-mark);stroke-width:2}
${P} .b-tether{fill:none;stroke:var(--d-fail-mark);stroke-width:1.25;stroke-dasharray:3 3}
${P} .b-ring{fill:none;stroke:var(--h);stroke-width:1.5}
${P} .b-waitf{fill:none;stroke:var(--d-wait-mark);stroke-width:2}
${P} .b-band{fill:none;stroke:var(--b-dr);stroke-opacity:.22;stroke-width:16;stroke-linecap:round}
${P} .b-blastf{fill:none;stroke:var(--b-dr);stroke-width:1.5;stroke-dasharray:4 2}
${P} .b-artery{fill:none;stroke:var(--d-line2);stroke-width:3;stroke-linecap:round}
${P} .dir-b-mark{position:absolute;white-space:nowrap;font:500 11px/14px var(--sans);color:var(--d-ink);pointer-events:none;user-select:none}
${P} .dir-b-mark[data-click],${P} .dir-b-mark[data-fly]{pointer-events:auto;cursor:pointer}
${P} .mono{font-family:var(--mono)}
${P} .b-chip{background:var(--d-card);border:1px solid var(--d-line2);border-left:3px solid var(--h);border-radius:4px;padding:3px 7px 3px 6px}
${P} .b-chip.wait{border-color:var(--d-wait-mark);border-left-color:var(--h);color:var(--d-wait)}
${P} .b-flag{font:600 11px/14px var(--mono);letter-spacing:.03em;background:var(--d-face);border:1px solid var(--b-cc);border-radius:3px;padding:3px 7px;color:var(--d-ink)}
${P} .b-lock{color:var(--b-cc);margin-right:6px}
${P} .b-flag.wait{border-color:var(--d-wait-mark);color:var(--d-wait)}
${P} .b-flag.wait .b-lock{color:var(--d-wait)}
${P} .b-flag.stale{border-style:dashed;border-color:var(--d-tick);color:var(--d-dim)}
${P} .b-flag.stale .b-lock{color:var(--d-dim)}
${P} .b-flag2{font:500 11px/14px var(--mono);background:var(--d-face);border:1px solid var(--d-line2);border-radius:3px;padding:3px 7px;color:var(--d-text)}
${P} .b-dots{color:var(--d-ok);margin-right:6px;letter-spacing:1px}
${P} .b-flag2.wait{color:var(--d-wait);border-color:var(--d-wait-mark)}
${P} .b-diamond{width:12px;height:12px;background:var(--d-fail-mark);transform:rotate(45deg);box-shadow:0 0 0 2px var(--d-face)}
${P} .b-diamond.adv{background:var(--d-face);box-shadow:inset 0 0 0 2px var(--d-dim)}
${P} .b-drone{width:22px;height:22px;box-sizing:border-box;border-radius:50%;background:var(--d-face);border:2px solid var(--h);display:grid;place-items:center;font:600 11px/1 var(--mono);color:var(--d-ink);letter-spacing:-.04em}
${P} .b-drone.waits{box-shadow:0 0 0 2px var(--d-face),0 0 0 4px var(--d-wait-mark)}
${P} .b-drone.s-yields,${P} .b-drone.s-held,${P} .b-drone.rogue{border-style:dashed}
${P} .b-stamp{font:500 11px/14px var(--mono);color:var(--d-text);background:var(--b-top);padding:0 2px;border-radius:2px}
${P} .dir-b-plane.moving *{stroke-dasharray:none!important}
${P} .b-wid{font:500 11px/14px var(--mono);color:var(--d-dim);background:var(--d-face);padding:0 2px;border-radius:2px}
${P} .b-wid.fail{color:var(--d-fail)}
${P} .b-val{font:600 11px/14px var(--mono);background:var(--d-face);padding:0 3px;border-radius:2px}
${P} .b-val.fail{color:var(--d-fail)}
${P} .b-tag{font:500 11px/14px var(--mono);color:var(--d-ink);background:var(--d-face);border:1px solid var(--d-ink);border-radius:3px;padding:2px 6px}
${P} .b-pname{font:600 11px/14px var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--d-ink)}
${P} .b-count{font:600 11px/14px var(--mono);color:var(--d-wait)}
${P} .b-wd{margin-right:4px}
${P} .b-beacon{background:var(--d-card);border:1px solid var(--d-fail-mark);border-radius:999px;padding:3px 9px 3px 7px}
${P} .b-beacon.wait{border-color:var(--d-wait-mark)}
${P} .b-arrow{margin-right:5px;color:var(--d-fail)}
${P} .b-beacon.wait .b-arrow,${P} .b-wn{color:var(--d-wait)}
${P} .b-wn{font-family:var(--mono)}
${P} .b-small{font-weight:400;color:var(--d-text);background:var(--d-glass);border-radius:3px;padding:1px 4px}
${P} .b-order{width:16px;height:16px;box-sizing:border-box;border-radius:50%;border:1.5px solid var(--h);background:var(--d-face);display:grid;place-items:center;font:600 11px/1 var(--mono)}
${P} .b-dim{color:var(--d-dim)}
${P} .dir-b-fx{position:absolute;left:0;top:0}
${P} .b-packet{width:6px;height:6px;border-radius:2px;background:var(--h)}
${P} .b-ping{width:24px;height:24px;box-sizing:border-box;border-radius:50%;border:2px solid var(--h)}
${P} .b-ping.small{width:14px;height:14px;border-width:1.5px}
${P} :is(.b-packet,.b-ping).ink{--h:var(--d-ink)}${P} :is(.b-packet,.b-ping).fail{--h:var(--d-fail-mark)}${P} :is(.b-packet,.b-ping).wait{--h:var(--d-wait-mark)}
#dir-b-card{display:none}
${P} #dir-b-card:not([hidden]){display:block;position:fixed;right:var(--inset);top:var(--below);width:var(--card);box-sizing:border-box;max-height:calc(100vh - var(--below) - var(--slot));overflow:auto;z-index:30;
background:var(--d-card);border:1px solid var(--d-line);border-radius:10px;color:var(--d-text);padding:10px 10px 6px 12px;font:13px/18px var(--sans)}
${P} #dir-b-card header{display:flex;align-items:center;gap:8px;margin:0 0 6px}
${P} #dir-b-card h3{margin:0;flex:1;font:600 13px/18px var(--sans);color:var(--d-ink)}
${P} #dir-b-card kbd,${P} #dir-b-goto kbd{font-size:11px}
${P} #dir-b-card kbd{color:var(--d-dim);border-color:var(--d-line2);margin-left:auto;flex:none}
${P} .b-dia{width:9px;height:9px;flex:none;background:var(--d-fail-mark);transform:rotate(45deg)}
${P} #dir-b-card ul{list-style:none;margin:0;padding:0}
${P} #dir-b-card li{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 8px;padding:6px 0;border-top:1px solid var(--d-line)}
${P} #dir-b-card li:has(>.b-opt){padding:1px 0;border-top:0}
${P} #dir-b-card li:has(>.b-opt):nth-child(3){padding-top:5px;border-top:1px solid var(--d-line)}
${P} .b-sev{font:600 11px/18px var(--mono);color:var(--d-fail);letter-spacing:.03em}
${P} .b-sw{display:inline-block;width:8px;height:8px;border-radius:2px;background:var(--h);margin-right:6px}
${P} .b-alt{display:none;color:var(--d-dim)}
${P}.alt .b-alt{display:inline}
${P} .b-vs{color:var(--d-dim)}
${P} .b-opt{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:8px;width:100%;padding:4px 6px;border-radius:6px;color:var(--d-ink);cursor:pointer;font:13px/18px var(--sans)}
${P} .b-opt:hover,${P} .b-opt.on{background:var(--d-hover)}
${P} .b-opt.on{box-shadow:inset 2px 0 0 var(--d-ghost)}
${P} .b-opt:focus-visible,${P} #dir-b-goto button:focus-visible{outline:2px solid var(--d-focus);outline-offset:-2px}
${P} .b-opt em{font:normal 500 11px/14px var(--mono);color:var(--d-ok)}
${P} .b-time{font:11px/18px var(--mono);color:var(--d-dim);min-width:38px}
${P} .b-bytes{margin-left:auto;font:11px/18px var(--mono);color:var(--d-dim)}
${P} .fl.tr .egress{cursor:pointer}
#dir-b-goto{display:none}
${P} #dir-b-goto:not([hidden]){display:grid;gap:1px;position:fixed;left:var(--inset);top:var(--below);width:264px;box-sizing:border-box;padding:6px;z-index:31;background:var(--d-card);border:1px solid var(--d-line);border-radius:10px}
${P} #dir-b-goto button{all:unset;display:flex;gap:8px;padding:6px 8px;border-radius:6px;color:var(--d-ink);font:13px/18px var(--sans);cursor:pointer}
${P} #dir-b-goto button:hover{background:var(--d-hover)}
${P} #dir-b-goto kbd{margin-left:auto;color:var(--d-dim);border-color:var(--d-line2)}
`;

const html = `<aside id="dir-b-card" class="dir-b-card" hidden></aside><nav id="dir-b-goto" hidden aria-label="Go to"></nav>`;

function setup(ctx) {
  const B = bState(), D = ctx.D;
  B.ctx = ctx;
  B.hoverEl = null;
  const stage = document.getElementById("stage"), cardEl = document.getElementById("dir-b-card"), gotoEl = document.getElementById("dir-b-goto");
  const fxl = document.createElement("div");
  fxl.id = "dir-b-fxl"; fxl.className = "dir-b-fxl";
  stage.append(fxl);
  const egress = document.querySelector(".fl.tr .egress");
  if (egress) { egress.title = "Kvarm network log (Shift V)"; egress.addEventListener("click", () => { if (on()) card("net"); }); }
  const on = () => conceptActive(ctx.ID);
  const S = () => B.ctx.S;
  const card = (c) => { S().card = S().card === c ? null : c; B.preview = null; B.ctx.draw(); };
  const plantRect = (p) => { if (p.id === "acquit") return D.camera.stops.plant.rect; const w = p.rect[2] - p.rect[0], h = p.rect[3] - p.rect[1], m = Math.max(w, h) * 0.4; return [p.rect[0] - m, p.rect[1] - m, p.rect[2] + m, p.rect[3] + m]; };
  const flyTo = (id) => {
    const p = D.plants.find((x) => "plant:" + x.id === id) || D.plants.find((x) => x.id === "acquit");
    bFly(plantRect(p), 420);
  };
  const cycle = () => {
    const ids = [...new Set((B.blockers || []).map((k) => k.id))];
    if (!ids.length) return;
    B.blocker = (B.blocker + 1) % ids.length;
    flyTo(ids[B.blocker]);
  };
  const goto = (open) => {
    gotoEl.hidden = !(open ?? gotoEl.hidden);
    if (gotoEl.hidden) return;
    gotoEl.innerHTML = D.plants.map((p, i) => '<button data-fly="plant:' + p.id + '">' + bEsc(p.name) + "<kbd>Shift " + (i + 1) + "</kbd></button>").join("")
      + '<button data-next>Next blocker<kbd>I</kbd></button><button data-fit>Whole world<kbd>F</kbd></button>';
    gotoEl.querySelector("button").focus();
  };
  gotoEl.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    goto(false);
    if (b.dataset.fly) flyTo(b.dataset.fly); else if ("next" in b.dataset) cycle(); else bFly(D.camera.stops.org.rect, 420);
  });
  document.addEventListener("click", (e) => {
    if (!on() || !e.target.closest || !e.target.closest("[data-do=palette]")) return;
    e.preventDefault(); e.stopImmediatePropagation(); goto();
  }, true);

  stage.addEventListener("wheel", (e) => { if (!on()) return; e.preventDefault(); B.fly++; bZoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY); }, { passive: false });
  let drag = null;
  stage.addEventListener("pointerdown", (e) => { if (!on() || e.button) return; drag = { x: e.clientX, y: e.clientY, moved: false, t: e.target }; B.fly++; });
  addEventListener("pointermove", (e) => {
    if (!on()) return;
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (drag.moved || Math.hypot(dx, dy) > 3) { drag.moved = true; drag.x = e.clientX; drag.y = e.clientY; bPanBy(dx, dy); }
      return;
    }
    const h = e.target.closest && e.target.closest("#dir-b-plane [data-hover]"), v = h ? h.dataset.hover : null;
    if (v !== B.hoverEl) { B.hoverEl = v; S().hover = v; B.ctx.draw(); }
  });
  addEventListener("pointerup", () => {
    const d = drag; drag = null;
    if (!d || d.moved || !on()) return;
    const c = d.t.closest && d.t.closest("[data-click],[data-fly]");
    if (!c) return;
    if (c.dataset.click) { card(c.dataset.click); if (S().level === "org" || S().level === "site") flyTo("plant:acquit"); }
    else flyTo(c.dataset.fly);
  });
  const preview = (k) => { B.preview = k; B.ctx.draw(); };
  cardEl.addEventListener("pointerover", (e) => { const o = e.target.closest(".b-opt"); if (o && !B.pinned) preview(o.dataset.opt); });
  cardEl.addEventListener("pointerout", (e) => { const o = e.target.closest(".b-opt"); if (o && !B.pinned && !o.contains(e.relatedTarget)) preview(null); });
  cardEl.addEventListener("click", (e) => {
    const o = e.target.closest(".b-opt");
    if (o) { B.pinned = B.pinned === o.dataset.opt ? null : o.dataset.opt; preview(B.pinned); return; }
    if (e.target.closest("kbd")) card(S().card);
  });

  document.addEventListener("keydown", (e) => {
    if (!on() || (e.target.closest && e.target.closest("input,textarea"))) return;
    const k = e.key, s = S();
    const done = () => { e.preventDefault(); e.stopImmediatePropagation(); };
    if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === "k") { done(); goto(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const f = freeRect(innerWidth, innerHeight, { rail: "none" }), cx = f.x + f.w / 2, cy = f.y + f.h / 2, step = 96;
    const pan = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step], a: [step, 0], d: [-step, 0], w: [0, step], s: [0, -step] }[k];
    const shiftDigit = e.shiftKey && /^Digit[1-5]$/.test(e.code) ? D.plants[+e.code.slice(5) - 1] : null;
    const clash = s.card && s.card.startsWith("clash:") ? D.moment.clashes.find((c) => "clash:" + c.id === s.card) : null;
    const opt = clash && clash.options.find((o) => o.key.toLowerCase() === k.toLowerCase());
    if (opt) { B.pinned = B.pinned === opt.kind ? null : opt.kind; preview(B.pinned); }
    else if (pan) { B.fly++; bPanBy(pan[0], pan[1]); }
    else if (k === "+" || k === "=") bZoomAt(1.3, cx, cy);
    else if (k === "-" || k === "_") bZoomAt(1 / 1.3, cx, cy);
    else if (k === "f" || k === "F") bFly(D.camera.stops.org.rect, 420);
    else if (shiftDigit) flyTo("plant:" + shiftDigit.id);
    else if (k === "i" || k === "I") cycle();
    else if (k === "c" || k === "C") { if ((B.model && B.model.clashes || []).some((c) => c.id === "c1")) card("clash:c1"); }
    else if (k === "V" && e.shiftKey) card("net");
    else if (k === "t" || k === "T") { B.replayTo = D.at.back; dirEvents.seek(D.at.away); dirEvents.play(90); }
    else if (k === "Escape" && (s.card || !gotoEl.hidden)) { goto(false); if (s.card) card(s.card); }
    else return;
    done();
  }, true);
  // Pausing the stream stops every motion at once, including packets still in flight. Finite shell transitions are
  // finished too: on hidden islands (the layer switches) the page paints no frames, so their clock can stall mid-way.
  const pause = dirEvents.pause;
  dirEvents.pause = () => {
    bFxClear();
    const at = pause();
    for (const a of document.getAnimations()) if (a.playState === "running" && isFinite(a.effect.getComputedTiming().endTime)) a.finish();
    return at;
  };
  window.dirBPerf = (enable) => {
    B.perf = !!enable;
    if (enable) B.times = [];
    B.ctx.draw();
    if (enable) return D.stub20.length;
    const q = (i) => { const s = B.times.map((t) => t[i]).sort((a, b) => a - b); return +(s[Math.floor(s.length * 0.95)] || 0).toFixed(1); };
    return { shell: q(0), draw: q(1), place: q(2) };
  };
}

function render(ctx) {
  const { D, S } = ctx, B = bState();
  B.ctx = ctx;
  B.gen++;
  if (B.frame !== S.frame) { B.frame = S.frame; B.preview = null; B.pinned = null; B.sz = null; B.okey = null; bFxClear(); }
  else if (!ctx.fired.length && B.lastAt !== S.at) bFxClear();
  B.lastAt = S.at;
  if (B.replayTo !== null && B.replayTo !== undefined && S.at >= B.replayTo) {
    const to = B.replayTo;
    B.replayTo = null;
    setTimeout(() => { dirEvents.pause(); dirEvents.seek(to); });
  }
  const t0 = performance.now();
  ctx.plane.classList.toggle("moving", !!B.moving);
  const M = bModel(ctx);
  // An open clash card previews its suggested resolution until the pointer or a key picks another option.
  const clash = S.card && S.card.startsWith("clash:") ? D.moment.clashes.find((c) => "clash:" + c.id === S.card) : null;
  B.shown = B.preview || (clash ? clash.suggested : null);
  bCard(ctx, M);
  for (const o of document.querySelectorAll("#dir-b-card .b-opt")) o.classList.toggle("on", o.dataset.opt === B.shown);
  bShell(ctx, M);
  const card = document.getElementById("dir-b-card"), hint = document.querySelector("body>.hint");
  const okey = [innerWidth, innerHeight, S.card, card.__h && card.__h.length, hint && hint.textContent].join("|");
  if (B.okey !== okey) { B.okey = okey; B.obst = bObstacles(); }
  const obst = B.obst;
  const t1 = performance.now();
  bContracts(ctx, M);
  for (const p of D.plants) bPlant(ctx, M, p, false);
  if (B.perf) for (const p of D.stub20) bPlant(ctx, M, p, true);
  bBeacons(ctx, M);
  const t2 = performance.now();
  bPlace(ctx, M.labels, obst);
  bSweep();
  if (B.perf) (B.times = B.times || []).push([t1 - t0, t2 - t1, performance.now() - t2]);
  B.blockers = M.blockers;
  B.model = M;
  if (ctx.fired.length) bFx(ctx, M);
}

export default directionStub({ id: "dir-b", label: "Living cartographic", css, html, lib: Object.values(L), setup, render });
