// Direction C, "Transit" (direction/memo-opus.md section 5 A, direction/00-synthesis.md). The plant is a transit
// map at every zoom: machines are stations, belts are grey lines with 45-degree routing, and each agent session is a
// coloured line laid beside the belts it declared. A working agent is a train at the end of its line; an agent that
// waits on you is a still puck with an amber ring that fills over an hour; two lines on one segment meet at a
// diamond. One SVG per plant site on one plane, fixed-size HTML labels placed by priority, edge beacons for blockers.
import { directionStub } from "./dir-base.mjs";
import { tClamp, tRouteOpts, tModel, tChain, tOffset, tPath, tGlyph, tArc, tState, tEl, tAt, tSweep, tPlace } from "./dir-c-lib.mjs";
import { tEsc, tHue, tFresh, tW, tRingSvg, tCons, tPlant, tBeacons, tLabel, tCard, tMotion } from "./dir-c-draw.mjs";

const P = 'body[data-concept="dir-c"]';
const css = `
${P}{--dc-claude:oklch(from var(--d-focus) l c calc(h + 46));--dc-radar:oklch(from var(--d-focus) l c calc(h - 62));--dc-codex:oklch(from var(--d-focus) l c calc(h + 90));--dc-d2:var(--d-focus);
  --dc-belt:color-mix(in srgb,var(--d-tick) 55%,var(--d-page))}
${P} .dir-c-plane{position:absolute;inset:0;pointer-events:none;overflow:hidden}
${P} .dc-plant,${P} .dc-con{position:absolute;overflow:visible;pointer-events:none}
${P} .dc-con{left:0;top:0}
${P} .dc-con path{fill:none;stroke:var(--dc-belt);stroke-width:1.5;stroke-linejoin:round}
${P} .dc-con.egress path{stroke-dasharray:6 4}
${P} .dc-con.package path,${P} .dc-con.artifact path{stroke-dasharray:2 4;stroke-linecap:round}
${P} .dc-plant [data-hit]{pointer-events:visiblePainted;cursor:pointer}
${P} .dc-foot{fill:var(--d-face);stroke:var(--d-line2);stroke-width:1}
${P} .dc-hatch{stroke:var(--d-tick);stroke-width:1.2;opacity:.5}
${P} .dc-fog{opacity:.9}
${P} .dc-terr{stroke:var(--d-wait-mark);stroke-width:1.2;stroke-dasharray:4 3;opacity:.85}
${P} .dc-belt{fill:none;stroke:var(--dc-belt);stroke-linecap:round;stroke-linejoin:round}
${P} .dc-belt.red{stroke:var(--d-fail-mark)}
${P} .dc-belt.ghost{stroke:var(--d-ghost);stroke-dasharray:.5 7}
${P} .dc-aline{fill:none;stroke:var(--h);stroke-linecap:round;stroke-linejoin:round}
${P} .dc-touch{stroke-linecap:butt}
${P} .dc-blast{fill:none;stroke:var(--h);opacity:.25;stroke-linecap:round;stroke-linejoin:round}
${P} .dc-st>circle,${P} .dc-st>rect{fill:var(--d-face);stroke:var(--d-tick);stroke-width:1.5}
${P} .dc-st.tiny>circle,${P} .dc-st.tiny>rect{stroke:none;fill:var(--d-tick)}
${P} .dc-st.strain>:first-child{stroke:var(--d-text);stroke-width:2.2}
${P} .dc-st.fail>:first-child{stroke:var(--d-fail-mark);stroke-width:2.6}
${P} .dc-st.ghost>:first-child{stroke:var(--d-ghost);stroke-dasharray:3 2.5;fill:var(--d-page)}
${P} .dc-st.tiny.ghost>:first-child{fill:var(--d-ghost)}
${P} .dc-st.tiny.fail>:first-child{fill:var(--d-fail-mark)}
${P} .dc-sm{fill:var(--d-tick)}
${P} .dc-sm.fail{fill:var(--d-fail-mark)}
${P} .dc-sm.ghost{fill:var(--d-ghost)}
${P} .dc-gl{fill:none;stroke:var(--d-text);stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
${P} .dc-st.ghost .dc-gl{stroke:var(--d-ghost)}
${P} .dc-st.fail .dc-gl{stroke:var(--d-fail)}
${P} .dc-st.dc-hot>:first-child{stroke:var(--h);stroke-width:3}
${P} .dc-st.dc-on>:first-child,${P} .dc-train.dc-on,${P} .dc-puck.dc-on{stroke:var(--d-focus);stroke-width:2.5}
${P} .dc-hov :is(.dc-belt,.dc-aline:not(.dc-hot),.dc-st:not(.dc-hot),.dc-clash,.dc-train,.dc-puck,.dc-ring,.dc-rtrack,.dc-link,.dc-pin){opacity:.28}
${P} .dc-train{fill:var(--h);stroke:var(--d-page);stroke-width:1.5}
${P} .dc-train.stopped{fill:var(--d-face);stroke:var(--d-tick);stroke-width:2}
${P} .dc-puck{fill:var(--h);stroke:var(--d-page);stroke-width:1.5}
${P} .dc-puck.passive{fill:var(--d-face);stroke:var(--h);stroke-width:2.2;stroke-dasharray:3 2}
${P} .dc-puck.idle{fill:var(--d-face);stroke:var(--h);stroke-width:2.2}
${P} .dc-puck.stopped{fill:var(--d-face);stroke:var(--d-tick);stroke-width:2.2}
${P} .dc-link{fill:none;stroke:var(--d-tick);stroke-width:1.2;stroke-dasharray:2 3}
${P} .dc-rtrack{fill:none;stroke:var(--d-line2);stroke-width:3}
${P} .dc-ring{fill:none;stroke:var(--d-wait-mark);stroke-width:3;stroke-linecap:round}
${P} .dc-dia{fill:var(--d-ink);stroke:var(--d-page);stroke-width:1.5}
${P} .dc-clash.advisory .dc-dia{fill:var(--d-page);stroke:var(--d-tick);stroke-dasharray:2 2;stroke-width:1.2}
${P} .dc-clash.settled .dc-dia{fill:var(--d-page);stroke:var(--d-text);stroke-width:1.6}
${P} .dc-clash.dc-on .dc-dia{stroke:var(--d-focus);stroke-width:2.5}
${P} .dc-dia-in{fill:var(--d-fail-mark)}
${P} .dc-pin{stroke-width:1.4;fill:var(--d-face);stroke:var(--d-text)}
${P} .dc-pin.broken{fill:var(--d-fail-mark);stroke:var(--d-fail-mark)}
${P} .dc-wall{fill:none;stroke:var(--d-line2);stroke-width:1.5;stroke-dasharray:7 6}
${P} .dc-new{fill:var(--d-ink);stroke:var(--d-page);stroke-width:2}
${P} .dc-lab{position:absolute;left:0;top:0;white-space:nowrap;pointer-events:auto;font:500 12px/16px var(--sans);color:var(--d-text);box-sizing:border-box;cursor:default}
${P} .dc-lab[data-hit]{cursor:pointer}
${P} .dc-name{padding:0 4px;background:var(--d-page);border-radius:4px}
${P} .dc-name.dc-failn{color:var(--d-fail)}
${P} .dir-c-mark{display:flex;align-items:center;gap:5px;padding:1px 8px;background:var(--d-card);border:1px solid var(--d-line2);border-radius:6px;color:var(--d-ink)}
${P} .dir-c-mark.hue{border-left:3px solid var(--h);padding-left:7px}
${P} .dir-c-mark.dc-wait{color:var(--d-wait);border-color:var(--d-wait-mark);border-left-color:var(--h)}
${P} .dir-c-mark.dc-idle{color:var(--d-text)}
${P} .dir-c-mark.dc-ctitle{color:var(--d-fail);border-color:var(--d-fail-mark)}
${P} .dir-c-mark.dc-newt{padding:1px 6px;font-variant-numeric:tabular-nums}
${P} .dc-flag.unmatched{color:var(--d-wait);border:1px dashed var(--d-wait-mark)}
${P} .dc-flag.stale{color:var(--d-text);border:1px dashed var(--d-tick)}
${P} .dc-rb{color:var(--d-text)}
${P} .dc-badge{padding:1px 7px;font-variant-numeric:tabular-nums}
${P} .dc-badge.dc-wait{border-radius:10px;border-width:2px;padding:0 6px}
${P} .dc-dots{display:flex;gap:4px;align-items:center;padding:0 2px;background:none}
${P} .dc-dot{width:8px;height:8px;border-radius:50%;background:var(--h);box-sizing:border-box}
${P} .dc-dot.dc-di{background:var(--d-page);border:2px solid var(--h)}
${P} .dc-dot.dc-dw{background:var(--d-page);border:2px solid var(--d-wait-mark)}
${P} .dc-diai{width:10px;height:10px;fill:var(--d-ink)}
${P} .dc-ringi{width:12px;height:12px;flex:none}
${P} .dc-ringi .tr{fill:none;stroke:var(--d-line2);stroke-width:2}
${P} .dc-ringi .ar{fill:none;stroke:var(--h);stroke-width:2;stroke-linecap:round}
${P} .dc-ringi.unmatched .ar{stroke:var(--d-wait-mark);stroke-dasharray:2 2}
${P} .dc-ringi.stale .tr{stroke:var(--d-tick);stroke-dasharray:2 2.2}
${P} .dc-arr{width:10px;height:10px;flex:none;fill:currentColor}
${P} .dc-alt{font-weight:400;padding:0 5px;line-height:16px;background:var(--d-card);border:1px solid var(--d-line);border-radius:4px;color:var(--d-text)}
${P} .dc-lead{position:absolute;left:0;top:0;height:1px;background:var(--d-tick);transform-origin:0 0;pointer-events:none}
${P} .dc-lab.dc-on{outline:2px solid var(--d-focus);outline-offset:1px}
${P} .fl.tr .egress{cursor:pointer}
${P} #dir-c-card{position:fixed;right:16px;top:100px;width:392px;box-sizing:border-box;max-height:calc(100vh - 164px);overflow:hidden;z-index:30;background:var(--d-card);border:1px solid var(--d-line);border-radius:12px;box-shadow:none;color:var(--d-text);padding:14px 16px 10px;font:13px/1.45 var(--sans)}
${P} #dir-c-card[hidden]{display:none}
${P} #dir-c-card header{display:flex;align-items:center;gap:8px;margin-bottom:8px}
${P} #dir-c-card h3{margin:0;flex:1;font:600 14px/1.3 var(--sans);color:var(--d-ink)}
${P} #dir-c-card kbd{font:11px var(--mono);color:var(--d-dim);border:1px solid var(--d-line2);border-radius:4px;padding:0 4px}
${P} #dir-c-card ul{list-style:none;margin:0;padding:0}
${P} #dir-c-card li{display:flex;gap:8px;align-items:baseline;padding:6px 0;border-top:1px solid var(--d-line)}
${P} #dir-c-card li b{font-weight:600;color:var(--d-ink)}
${P} .dc-t{flex:none;min-width:40px;font:12px/18px var(--sans);font-variant-numeric:tabular-nums;color:var(--d-dim)}
${P} .dc-op{flex:1}
${P} .dc-b{font-variant-numeric:tabular-nums;color:var(--d-ink)}
${P} .dc-kv{font-size:12px;color:var(--d-dim)}
${P} .dc-where{font-style:normal;color:var(--d-dim)}
${P} .dc-sev{font:600 11px/16px var(--sans);letter-spacing:.04em;color:var(--d-fail);border:1px solid var(--d-fail-mark);border-radius:4px;padding:0 5px}
${P} .dc-sev.settled{color:var(--d-text);border-color:var(--d-line2)}
${P} .dc-sw{flex:none;width:9px;height:9px;border-radius:3px;background:var(--h);align-self:center}
${P} .dc-dia-r{flex:none;width:9px;height:9px;background:var(--d-fail-mark);transform:rotate(45deg) scale(.8);align-self:center}
${P} .dc-pin-r{flex:none;width:8px;height:8px;border:1.5px solid var(--d-fail-mark);border-radius:50%;align-self:center}
${P} .dc-opts,${P} .dc-chips{display:flex;flex-wrap:wrap;gap:6px}
${P} .dc-opt,${P} .dc-chip{border:1px solid var(--d-line2);border-radius:6px;padding:1px 7px;font-size:12px;color:var(--d-text)}
${P} .dc-opt.sug{border-color:var(--d-ink);color:var(--d-ink)}
${P} #dir-c-goto{position:fixed;left:50%;top:100px;transform:translateX(-50%);width:440px;z-index:50;background:var(--d-card);border:1px solid var(--d-line);border-radius:10px;padding:6px;font:13px/1.4 var(--sans);color:var(--d-text);box-shadow:var(--d-shadow)}
${P} #dir-c-goto[hidden]{display:none}
${P} #dir-c-goto input{width:100%;box-sizing:border-box;border:0;outline:none;background:transparent;color:var(--d-ink);font:14px var(--sans);padding:8px}
${P} #dir-c-goto input::placeholder{color:var(--d-dim)}
${P} #dir-c-goto ul{list-style:none;margin:0;padding:0}
${P} #dir-c-goto li{display:flex;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer}
${P} #dir-c-goto li[aria-selected=true]{background:var(--d-press);color:var(--d-ink)}
${P} #dir-c-goto small{margin-left:auto;color:var(--d-dim);font-size:12px}
`;

function setup(ctx) {
  const { D, S, ID, draw, setView } = ctx;
  const stage = document.getElementById("stage");
  const hint = document.querySelector("body>.hint");
  if (hint) hint.innerHTML = "<kbd>Alt</kbd> words · <kbd>I</kbd> next · <kbd>Shift V</kbd> network";
  const free = () => freeRect(innerWidth, innerHeight, { rail: "none" });
  const pad = (r, f) => { const w = r[2] - r[0], h = r[3] - r[1]; return [r[0] - w * f, r[1] - h * f, r[2] + w * f, r[3] + h * f]; };
  const plantRect = (id) => (id === "acquit" ? D.camera.stops.plant.rect.slice() : pad(D.plants.find((p) => p.id === id).rect, 0.3));
  // Wheel and pan set the view synchronously: a rAF-batched view can land after a later frame jump and undo it
  // (headless drivers may not produce a frame for many seconds), and each render is cheap enough to run per event.
  let flight = 0;
  const zoomRect = (v, px, py, f) => {
    const c = cameraFor(v, free()), np = tClamp(c.ppu * f, 0.02, 40);
    f = np / c.ppu;
    const wx = c.cx + (px - c.sx) / c.ppu, wy = c.cy + (py - c.sy) / c.ppu;
    return [wx + (v[0] - wx) / f, wy + (v[1] - wy) / f, wx + (v[2] - wx) / f, wy + (v[3] - wy) / f];
  };
  const zoomAt = (px, py, f) => setView(zoomRect(S.view, px, py, f));
  const panBy = (dx, dy) => { const v = S.view, p = cameraFor(v, free()).ppu; setView([v[0] - dx / p, v[1] - dy / p, v[2] - dx / p, v[3] - dy / p]); };
  // Go to eases within two screens and cuts beyond, as memo-opus.md section 4.6 asks; reduced motion always cuts.
  const fly = (to, then) => {
    cancelAnimationFrame(flight);
    const from = S.view.slice(), fw = from[2] - from[0], fh = from[3] - from[1], tw = to[2] - to[0], th = to[3] - to[1];
    const fc = [(from[0] + from[2]) / 2, (from[1] + from[3]) / 2], tc = [(to[0] + to[2]) / 2, (to[1] + to[3]) / 2];
    const done = () => { setView(to.slice()); if (then) then(); };
    if (Math.hypot(tc[0] - fc[0], tc[1] - fc[1]) > 2 * Math.max(fw, tw) || matchMedia("(prefers-reduced-motion: reduce)").matches) return done();
    const t0 = performance.now();
    const step = (n) => {
      const t = Math.min(1, (n - t0) / 380), e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      if (t >= 1) return done();
      const w = fw * (tw / fw) ** e, h = fh * (th / fh) ** e, cx = fc[0] + (tc[0] - fc[0]) * e, cy = fc[1] + (tc[1] - fc[1]) * e;
      setView([cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2]);
      flight = requestAnimationFrame(step);
    };
    flight = requestAnimationFrame(step);
  };
  const focusPlant = () => {
    const v = S.view, cx = (v[0] + v[2]) / 2, cy = (v[1] + v[3]) / 2;
    let best = "acquit", bd = Infinity;
    for (const p of D.plants) { const d = Math.hypot((p.rect[0] + p.rect[2]) / 2 - cx, (p.rect[1] + p.rect[3]) / 2 - cy); if (d < bd) { bd = d; best = p.id; } }
    return best;
  };
  const setCard = (v) => { S.card = v; draw(); };
  const activate = (id) => {
    if (!id) { if (S.card || S.hover) { S.card = null; S.hover = null; draw(); } return; }
    const i = id.indexOf(":"), kind = id.slice(0, i), ref = id.slice(i + 1);
    if (kind === "clash") setCard(S.card === id ? null : id);
    else if (kind === "plant") fly(plantRect(ref));
    else if (kind === "away") { const it = D.away.items.find((x) => x.id === ref); if (it && it.plant !== "acquit") fly(plantRect(it.plant)); else setCard("away"); }
    else if (kind === "session" && S.level !== "plant" && S.level !== "machine") fly(plantRect("acquit"), () => { S.hover = id; draw(); });
    else { S.hover = id; draw(); }
  };
  const attention = () => {
    const st = tState(D, S), out = [];
    for (const c of st.clashes) if (c.state === "open" && c.severity === "blocking") out.push({ rect: plantRect("acquit"), card: c.binding });
    for (const a of st.agents) if (a.state === "waiting" && a.waitsOn === "you") out.push({ rect: plantRect("acquit"), hover: a.binding });
    for (const p of D.plants) if (p.id !== "acquit" && st.waiting[p.id]) out.push({ rect: plantRect(p.id), hover: p.binding });
    if (st.back) out.push({ rect: plantRect("acquit"), card: "away" });
    for (const it of st.fresh) if (it.plant !== "acquit") out.push({ rect: plantRect(it.plant), hover: it.binding });
    return out;
  };
  let ai = -1;
  const next = (d) => { const L = attention(); if (!L.length) return; ai = (ai + d + L.length) % L.length; const t = L[ai]; fly(t.rect, () => { S.card = t.card || null; S.hover = t.hover || null; draw(); }); };
  const tab = (d) => {
    const ids = [...new Set([...document.querySelectorAll("#" + ID + "-plane [data-hit]")].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight; }).map((e) => e.dataset.hit))];
    if (!ids.length) return;
    S.hover = ids[(ids.indexOf(S.hover) + d + ids.length) % ids.length];
    draw();
  };

  stage.addEventListener("wheel", (e) => { if (!conceptActive(ID)) return; e.preventDefault(); cancelAnimationFrame(flight); zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015))); }, { passive: false });
  let drag = null;
  const hitOf = (t) => { const h = t && t.closest ? t.closest("[data-hit]") : null; return h ? h.dataset.hit : null; };
  stage.addEventListener("pointerdown", (e) => { if (!conceptActive(ID) || e.button !== 0) return; cancelAnimationFrame(flight); drag = { x: e.clientX, y: e.clientY, v: S.view.slice(), p: S.camera.ppu, moved: false, hit: hitOf(e.target) }; });
  addEventListener("pointermove", (e) => {
    if (!conceptActive(ID)) return;
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
      if (drag.moved) setView([drag.v[0] - dx / drag.p, drag.v[1] - dy / drag.p, drag.v[2] - dx / drag.p, drag.v[3] - dy / drag.p]);
      return;
    }
    if (!e.target.closest || !e.target.closest("#stage")) return;
    const id = hitOf(e.target);
    if (id !== S.hover) { S.hover = id; draw(); }
  });
  addEventListener("pointerup", () => { if (!drag) return; const d = drag; drag = null; if (!d.moved) activate(d.hit); });
  const eg = document.querySelector(".fl.tr .egress");
  if (eg) eg.addEventListener("click", () => { if (conceptActive(ID)) setCard(S.card === "net" ? null : "net"); });

  // Go to: plants, Acquit's stations, agents, clashes and the network log, filtered as you type.
  const box = document.createElement("div");
  box.id = ID + "-goto"; box.hidden = true;
  box.innerHTML = '<input aria-label="Go to" placeholder="Go to a plant, station, agent or clash"><ul role="listbox"></ul>';
  document.body.append(box);
  const inp = box.querySelector("input"), ul = box.querySelector("ul");
  let rows = [], sel = 0;
  const targets = () => {
    const st = tState(D, S), aq = D.plants.find((p) => p.id === "acquit"), t = [];
    for (const p of D.plants) t.push({ label: p.name, sub: "plant", go: () => fly(plantRect(p.id)) });
    for (const m of D.moment.machines) if (m.kind !== "crane") { const x = aq.origin[0] + m.x, y = aq.origin[1] + m.y; t.push({ label: m.name, sub: "station · Acquit", go: () => fly([x - 110, y - 55, x + 110, y + 55]) }); }
    for (const a of st.agents) t.push({ label: a.agent + " · " + a.session, sub: "agent", go: () => fly(plantRect("acquit"), () => { S.hover = a.binding; draw(); }) });
    for (const c of st.clashes) if (c.title) t.push({ label: c.title, sub: "clash", go: () => fly(plantRect("acquit"), () => setCard(c.binding)) });
    t.push({ label: "Network log", sub: "Kvarm", go: () => setCard("net") });
    t.push({ label: "Everything", sub: "world", go: () => fly(D.camera.stops.org.rect.slice()) });
    return t;
  };
  const list = () => {
    const q = inp.value.trim().toLowerCase();
    rows = targets().filter((t) => !q || (t.label + " " + t.sub).toLowerCase().includes(q)).slice(0, 8);
    sel = Math.min(sel, Math.max(0, rows.length - 1));
    ul.innerHTML = rows.map((r, i) => '<li role="option" aria-selected="' + (i === sel) + '" data-i="' + i + '">' + tEsc(r.label) + "<small>" + tEsc(r.sub) + "</small></li>").join("");
  };
  const closeGoto = () => { box.hidden = true; inp.blur(); };
  const openGoto = () => { box.hidden = false; inp.value = ""; sel = 0; list(); inp.focus(); };
  inp.addEventListener("input", () => { sel = 0; list(); });
  inp.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Escape") { e.preventDefault(); closeGoto(); }
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % Math.max(1, rows.length); list(); }
    else if (e.key === "Enter") { e.preventDefault(); const r = rows[sel]; closeGoto(); if (r) r.go(); }
  });
  ul.addEventListener("pointerdown", (e) => { const li = e.target.closest("li"); if (!li) return; e.preventDefault(); const r = rows[+li.dataset.i]; closeGoto(); if (r) r.go(); });
  inp.addEventListener("blur", () => setTimeout(() => { if (document.activeElement !== inp) box.hidden = true; }, 0));

  // Keys run in the capture phase so the shell's ui-v1 bindings (Ctrl K palette, Tab issue step) never see the ones
  // this direction owns. Mode keys 1 to 4 and L stay with the shell.
  addEventListener("keydown", (e) => {
    if (!conceptActive(ID) || (e.target && e.target.closest && e.target.closest("input,textarea,select,[contenteditable=true]"))) return;
    const k = e.key, own = () => { e.preventDefault(); e.stopImmediatePropagation(); };
    if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === "k") { own(); openGoto(); return; }
    if (e.ctrlKey || e.metaKey) return;
    if (e.altKey) { if (/^[1-9]$/.test(k) && D.plants[+k - 1]) { own(); fly(plantRect(D.plants[+k - 1].id)); } return; }
    const W = innerWidth, H = innerHeight, fr = free(), mx = fr.x + fr.w / 2, my = fr.y + fr.h / 2;
    const act = {
      ArrowLeft: () => panBy(W * 0.2, 0), ArrowRight: () => panBy(-W * 0.2, 0), ArrowUp: () => panBy(0, H * 0.2), ArrowDown: () => panBy(0, -H * 0.2),
      "-": () => zoomAt(mx, my, 1 / 1.8), _: () => zoomAt(mx, my, 1 / 1.8), "=": () => zoomAt(mx, my, 1.8), "+": () => zoomAt(mx, my, 1.8),
      f: () => fly(plantRect(focusPlant())), F: () => fly(D.camera.stops.org.rect.slice()),
      i: () => next(1), I: () => next(-1), V: () => setCard(S.card === "net" ? null : "net"),
      Tab: () => tab(e.shiftKey ? -1 : 1),
      Enter: S.hover ? () => activate(S.hover) : null,
      Escape: S.card || S.hover ? () => { S.card = null; S.hover = null; draw(); } : null,
    }[k];
    if (!act) return;
    own(); act();
  }, true);
  window.dirCView = (rect) => setView(rect);
  // p95 of the synchronous frame work (render plus forced style and layout) over a scripted 52x zoom into the last of
  // twenty stub plants drawn beside the real five; rAF gaps and long animation frames are reported because paint is not.
  window.dirCPerf = async () => {
    const saved = S.view.slice(), raf = () => new Promise((r) => requestAnimationFrame(r));
    window.dirCStub = true;
    const R = D.stub20.map((p) => p.rect), g = D.siteGap;
    setView([Math.min(...R.map((r) => r[0])) - g, Math.min(...R.map((r) => r[1])) - g, Math.max(...R.map((r) => r[2])) + g, Math.max(...R.map((r) => r[3])) + g]);
    await raf(); await raf();
    const t = D.stub20.filter((p) => p.of === "acquit").at(-1), tc = [(t.rect[0] + t.rect[2]) / 2, (t.rect[1] + t.rect[3]) / 2];
    const work = [], gaps = [], N = 90;
    const T = document.getElementById(ID + "-plane")._t;
    T.prof = { render: [], state: [], plants: [], place: [], labels: [], sweep: [], n: [] };
    let last = await raf(), longs = 0, longMax = 0, obs = null;
    try { obs = new PerformanceObserver((l) => { for (const e of l.getEntries()) { longs++; longMax = Math.max(longMax, e.duration); } }); obs.observe({ type: "long-animation-frame" }); } catch (e) { obs = null; }
    for (let i = 0; i < 2 * N; i++) {
      const now = await raf(); gaps.push(now - last); last = now;
      const t0 = performance.now(), c = cameraFor(S.view, free());
      setView(zoomRect(S.view, c.sx + (tc[0] - c.cx) * c.ppu, c.sy + (tc[1] - c.cy) * c.ppu, i < N ? 1.045 : 1 / 1.045));
      void document.body.offsetHeight;
      work.push(performance.now() - t0);
    }
    await raf();
    if (obs) obs.disconnect();
    window.dirCStub = false;
    setView(saved);
    const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return +s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(2); };
    const pf = T.prof; T.prof = null;
    return { phases95: Object.fromEntries(Object.entries(pf).map(([k, v]) => [k, q(v, 0.95)])), plants: D.plants.length + D.stub20.length, frames: work.length, p50: q(work, 0.5), p95: q(work, 0.95), max: q(work, 1), rafP50: q(gaps, 0.5), rafP95: q(gaps, 0.95), longFrames: longs, longMaxMs: Math.round(longMax), loaf: !!obs };
  };
}

function render(ctx) {
  const { D, S, plane } = ctx;
  const T = plane._t || (plane._t = { pool: new Map(), used: new Set(), seq: new Map(), wc: new Map(), M: null, stub: null });
  const stub = !!window.dirCStub;
  if (!T.M || T.stub !== stub) { T.M = tModel(D, stub ? D.plants.concat(D.stub20) : D.plants); T.stub = stub; }
  const pf = T.prof, tA = pf && performance.now();
  const W = innerWidth, H = innerHeight, st = tState(D, S);
  const c = { D, S, T, plane, W, H, ppu: S.camera.ppu, project: ctx.project };
  const out = { items: [], alt: [], obst: [] }, t0 = pf && performance.now();
  const card = tCard(c, st);
  if (!stub && (S.level === "org" || S.level === "site")) tCons(T, c);
  for (const P of T.M.plants) tPlant(T, c, P, st, out);
  const t1 = pf && performance.now();
  if (!stub) tBeacons(c, st, out, card);
  if (!T.bl || T.blW !== W || T.blH !== H) { const r = document.querySelector(".fl.bl")?.getBoundingClientRect(); T.bl = r && r.width ? [r.left - 6, r.top - 6, r.right + 6, r.bottom + 6] : [0, 0, 0, 0]; T.blW = W; T.blH = H; }
  const occ = [[0, 0, W, 96], T.bl, ...out.obst];
  if (card) occ.push([card[0] - 8, card[1] - 8, card[2] + 8, card[3] + 8]);
  const HT = { name: 16, mark: 20, beacon: 20, alt: 18 };
  const size = (it) => { it.h = HT[it.kind]; it.w = tW(T, it.text, it.kind) + (it.preW || 0); };
  // A label whose anchor sits under the card would land far from it; the beacon already points there.
  const under = (p) => card && p && p[0] > card[0] && p[0] < card[2] && p[1] > card[1] && p[1] < card[3];
  const rest = out.items.filter((it) => it.kind === "beacon" || !under(it.anchor)).sort((a, b) => a.prio - b.prio);
  rest.forEach(size);
  tPlace(rest, occ, W, H, false);
  const t2 = pf && performance.now();
  for (const it of rest) if (it.pos) tLabel(T, c, it);
  const t3 = pf && performance.now();
  if (S.alt) {
    const alt = out.alt.sort((a, b) => a.prio - b.prio);
    alt.forEach(size);
    tPlace(alt, occ, W, H, true);
    for (const it of alt) if (it.pos) tLabel(T, c, it);
  }
  tSweep(T);
  if (pf) { const t4 = performance.now(); pf.state.push(t0 - tA); pf.render.push(t4 - tA); pf.plants.push(t1 - t0); pf.place.push(t2 - t1); pf.labels.push(t3 - t2); pf.sweep.push(t4 - t3); pf.n.push(rest.length); }
  // Past 60x replay a mark changes faster than its flash can be read, so fast replay just updates.
  const now = performance.now(), fast = T.lastNow && (S.at - T.lastAt) / Math.max(1, now - T.lastNow) > 60;
  T.lastAt = S.at; T.lastNow = now;
  if (ctx.fired.length && !fast) tMotion(T, ctx.fired);
}

export default directionStub({
  id: "dir-c", label: "Direction C · Transit", css, html: "",
  lib: [tClamp, tRouteOpts, tModel, tChain, tOffset, tPath, tGlyph, tArc, tState, tEl, tAt, tSweep, tPlace, tEsc, tHue, tFresh, tW, tRingSvg, tCons, tPlant, tBeacons, tLabel, tCard, tMotion],
  setup, render,
});
