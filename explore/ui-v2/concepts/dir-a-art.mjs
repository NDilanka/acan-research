// Build-time art for direction A (Live paper). The iso catalog draws each plant once in node as a white paper model,
// so the page only places one SVG per plant and never rebuilds machine geometry while zooming.
import * as kit from "../vendor/anatomy/iso-kit.mjs";
import { ASSETS } from "../assets.mjs";
import { renderScene } from "../scene.mjs";
import { DIRECTION as D } from "./direction-data.mjs";

const AZ = 60, EL = 30, PAD = 16, FILL = 0.96, MIN_SCALE = 0.55;
const proj = (scale, origin = [0, 0]) => ({ origin, scale, azimuth: AZ, elevation: EL });
const round = (v) => Math.round(v * 1000) / 1000;

function sceneOf(id) {
  if (id === "acquit") return { entities: D.moment.machines, belts: D.moment.belts, wall: { ...D.moment.wall, text: "" } };
  const s = D.scenes[id];
  return { entities: s.entities, belts: s.belts };
}
const dims = (e) => { const a = ASSETS[e.kind], s = e.size || 1; return [e.x, e.y, a.w * s, a.d * s, a.top * s]; };
const boxOf = (ents, pad) => {
  const b = ents.map(dims);
  return [Math.min(...b.map((d) => d[0] - d[2] / 2)) - pad, Math.min(...b.map((d) => d[1] - d[3] / 2)) - pad, Math.max(...b.map((d) => d[0] + d[2] / 2)) + pad, Math.max(...b.map((d) => d[1] + d[3] / 2)) + pad];
};

// Scene text, blurred halos, smoke and belt flow dashes are stripped: words live in fixed-size HTML labels, the
// direction allows no blur, and nothing may animate without an event.
const clean = (svg, bind) => svg
  .replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")
  .replace(/<text[\s\S]*?<\/text>/g, "")
  .replace(/<path class="iso-halo"[^>]*\/>/g, "")
  .replace(/<g class="smoke">[\s\S]*?<\/g>/g, "")
  .replace(/ data-flow=""/g, "")
  .replace(/class="ent" data-id="([^"]+)"/g, (m, id) => (bind ? m + ` data-binding="machine:${id}"` : m))
  .replace(/class="belt" data-from="([^"]+)" data-to="([^"]+)"/g, (m, a, b) => (bind ? m + ` data-binding="belt:${a}->${b}"` : m));

function plantArt(p) {
  const scene = sceneOf(p.id), b = boxOf(scene.entities, 22), plan = { x: b[0], y: b[1], w: b[2] - b[0], d: b[3] - b[1], r: 10 };
  const pts = [...scene.entities.flatMap((e) => { const [x, y, w, d, top] = dims(e); return [[-1, -1], [1, -1], [1, 1], [-1, 1]].flatMap(([sx, sy]) => [[x + sx * w / 2, y + sy * d / 2, 0], [x + sx * w / 2, y + sy * d / 2, top]]); }),
    ...kit.corners(plan, 0).map(([x, y]) => [x, y, 0])];
  const bbox = (P) => { const q = pts.map((v) => kit.iso(v, P)); return [Math.min(...q.map((v) => v[0])), Math.min(...q.map((v) => v[1])), Math.max(...q.map((v) => v[0])), Math.max(...q.map((v) => v[1]))]; };
  const b1 = bbox(proj(1)), site = [p.rect[2] - p.rect[0], p.rect[3] - p.rect[1]];
  // A narrow site (acan-format) would shrink its machines to half size, so the drawing may overflow its site rect.
  const s = Math.max(MIN_SCALE, FILL * Math.min(site[0] / (b1[2] - b1[0]), site[1] / (b1[3] - b1[1])));
  const bb = bbox(proj(s)), O = [-bb[0] + PAD, -bb[1] + PAD], size = [bb[2] - bb[0] + 2 * PAD, bb[3] - bb[1] + 2 * PAD].map(Math.ceil);
  const local = [p.rect[0] - p.origin[0], p.rect[1] - p.origin[1], p.rect[2] - p.origin[0], p.rect[3] - p.origin[1]];
  const C = [(local[0] + local[2]) / 2 - (bb[0] + bb[2]) / 2, (local[1] + local[3]) / 2 - (bb[1] + bb[3]) / 2];
  const PO = proj(s, O);
  const paper = kit.solidSvg(kit.slabOf(plan, -4, 4, PO, 6, 0.6), { tone: "mid", crease: "none", className: "dir-a-paper" });
  const art = paper + clean(renderScene(kit, ASSETS, scene, PO, { width: size[0], height: size[1] }).svg, p.id === "acquit");
  const sil = paper + scene.entities.slice().sort((a, c) => kit.depthOf([a.x, a.y, 0], PO) - kit.depthOf([c.x, c.y, 0], PO)).map((e) => {
    const [x, y, w, d, top] = dims(e);
    return kit.solidSvg(kit.slabOf({ x: x - w / 2, y: y - d / 2, w, d, r: 2 }, 0, top * 0.45, PO, 2, 0), { tone: "mid", crease: "none" });
  }).join("");
  const basis = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((v) => kit.iso(v, proj(s)).map(round));
  return { s: round(s), C: C.map(round), tl: [C[0] - O[0], C[1] - O[1]].map(round), size, b: basis, art, sil,
    ents: Object.fromEntries(scene.entities.map((e) => [e.id, dims(e).map(round)])) };
}

const territories = Object.fromEntries(D.moment.territories.map((t) => [t.id, boxOf(t.entities.map((id) => D.moment.machines.find((m) => m.id === id)), 12)]));
export const ART = { plants: Object.fromEntries(D.plants.map((p) => [p.id, plantArt(p)])), terr: territories };
