# Shell: islands, slots and rules

This is the one shell every journey screen runs on (`JOURNEY.md` section 1). The stage draws full-bleed. Every control lives on a floating glass island. There are no bars and no docked panels.

All numbers below were measured from the running builds (`live-<concept>.html` for bench, clash, gate, orders and world) at 1280 x 800, 1440 x 900 and 1600 x 900, with `getBoundingClientRect` at every step of each concept's steps file. Rects are `[left, top, width, height]` in CSS px. Where a width varies with copy, the range is given with the step that produced it.

## 1. Tokens

These come from the `SHELL` object at `build.mjs:37-39`. The build emits them as CSS custom properties and as the page global `SHELL`, so script layout and CSS share one source. Every rule in section 6 is written in terms of them.

| Token | Value | Meaning |
|---|---|---|
| `--inset` | 16 | Gap from every viewport edge to the nearest island |
| `--row` | 40 | Height of a one-line island (top row, bottom right, world bottom left) |
| `--gap` | 8 | Gap between neighbouring islands, and between an island and a card |
| `--strip` | 28 | Height of the hint strip |
| `--below` | 100 | Top of the card slot, the queue and the palette (inset + row + gap + strip + gap) |
| `--card` | 392 | Width of the right card slot and of the queue |
| `--rail` | 96 | Width of the right rail (`#nav`) |
| `--slot` | 64 | Top of the strip row (inset + row + gap) |

## 2. Persistent islands

These never unmount and never move. Only their width changes with copy.

### 2.1 ui-v1 shell (bench, clash, gate, orders, and Acquit's plant in the journey)

| Island | Selector | 1280 x 800 | 1440 x 900 | 1600 x 900 |
|---|---|---|---|---|
| Top left: brand, Back, Forward, breadcrumb, Go to | `.fl.tl` | `[16,16,273,40]` | `[16,16,273,40]` | `[16,16,273,40]` |
| Top centre: Live, Blueprint, Simulate, Replay | `.fl.tc` | `[476,16,327,40]` | `[556,16,327,40]` | `[636,16,327,40]` |
| Top right: Layers, Export, egress pill | `.fl.tr` | right edge 1264, width 327 to 357 | right edge 1424, width 327 to 357 | right edge 1584, width 327 to 357 |
| Hint strip | `body>.hint` | top 64, height 28, centred on 640 | top 64, height 28, centred on 720 | top 64, height 28, centred on 800 |
| Right rail | `#nav` | `[1168,64,96,135]` | `[1328,64,96,135]` | `[1488,64,96,135]` |
| Compass (inside the rail) | `#compass` | `[1179,64,74,74]` | `[1339,64,74,74]` | `[1499,64,74,74]` |
| Bottom left: status and Waiting on you | `.fl.bl` | `[16,616,264..322,168]` | `[16,716,264..322,168]` | `[16,716,264..322,168]` |
| Bottom right: zoom, readout, clock, connection | `.fl.br` | `[694,744,570,40]` | `[854,844,570,40]` | `[1014,844,570,40]` |

Top right widths seen at 1600 x 900: 327 at load, 339 after `orders-05-open`, 351 after `bench-03-funded` and `clash-05-split`, 357 after `clash-21-mouse-done`. The pill grows with the byte count.

Hint widths seen at 1600 x 900: orders 241 to 247, bench 589, gate 670, clash 730. The clash hint is shifted right by `#clashToolbar`, which declares `data-hint-row` and sits at `[16,64,...]`. Its left edge moved between 435 and 545.

### 2.2 World level (`live-world.html`, the journey's world canvas)

| Island | Selector | 1280 x 800 | 1440 x 900 | 1600 x 900 |
|---|---|---|---|---|
| Top left: brand, Back, Forward, breadcrumb, Go to | `.world-tl` | `[16,16,358,40]` at world level, width 411 to 433 at plant and machine | same | same |
| Top centre: modes 1 to 4 (plant and machine only) | `.world-modes` | `[476,16,327,40]` | `[502,16,437,40]` | `[582,16,437,40]` |
| Top right: Layers, egress, Kvarm pill | `.world-tr` | `[981,16,283,40]` | `[1141,16,283,40]` | `[1301,16,283,40]` |
| Hint strip | `.world-hint` | `[282,64,717,28]` | `[362,64,717,28]` | `[442,64,717,28]` |
| Bottom left: Waiting on you | `.world-bl` | `[16,744,183..232,40]` | `[16,844,183..232,40]` | `[16,844,183..232,40]` |
| Bottom right: zoom, readout, clock, connection | `.world-br` | right edge 1264, left 332 to 547 | right edge 1424 | `[433..649,844,936..1151,40]`, right edge 1584 |
| Right rail: minimap | `#worldMinimap` | `[1080,64,184,139]` | `[1240,64,184,139]` | `[1400,64,184,139]` |

The world modes island shows mode labels from 1440 px up, so it is 110 px wider there.

## 3. Slots that open

| Slot | Selector | 1280 x 800 | 1440 x 900 | 1600 x 900 |
|---|---|---|---|---|
| Right card slot, ui-v1 inspector | `.insp.open` | `[872,100,392,636]` | `[1032,100,392,736]` (rule) | `[1192,100,392,736]` (rule) |
| Right card slot, world card | `#worldCard` | `[872,100,392,...]` | `[1032,100,392,...]` | `[1192,100,392,294..444]` |
| Right card slot, network log | `#worldNetwork` | `[872,100,392,...]` | `[1032,100,392,...]` | `[1192,100,392,700..736]` |
| Queue (bottom left card) | `#worldQueue` | `[16,100,392,636]` | `[16,100,392,736]` | `[16,100,392,736]` |
| Jump palette | `#worldPalette`, `.pal` | `[330,100,620,242]` | `[410,100,620,242]` | `[490,100,620,242]` |
| Layers menu | `#layers` | `[1014,64,250,316]` | right edge 1424 | right edge 1584 |
| Toast | `.toast`, world announcement | bottom-centre, top 696 to 703, height 33 | bottom-centre | bottom-centre |

The inspector is parked off-screen at `left: vw + 64` when closed.

### 3.1 Free rect

The camera fits its subject inside the free rect. It is derived from the measured islands: left `--inset`, top `--below`, bottom `vh - 64` (one row above the bottom islands), and right at `#nav` left minus `--gap`, or at the open card's left minus `--gap`.

| Size | No card | Card open |
|---|---|---|
| 1280 x 800 | `[16,100,1144,636]` | `[16,100,848,636]` |
| 1440 x 900 | `[16,100,1304,736]` | `[16,100,1008,736]` |
| 1600 x 900 | `[16,100,1464,736]` | `[16,100,1168,736]` |

Measured check at 1280 x 800: the world machine stage drew at `[16,179,848,478]` with a card open, the full free-rect width. The plant stage drew at `[90,108,1100,620]` with no card, inside the free rect at the 1600:900 aspect.

## 4. Where each world extra went

The world concept's old top bar, toolbar row, framed stage and docked inspector are retired. Each control they carried now lives on an island.

| Old world control | New home |
|---|---|
| Brand and level title | `.world-tl`, first item |
| Breadcrumb `My world / Acquit / ...` | `.world-tl`, after Back and Forward |
| Back and Forward | `.world-tl`, buttons before the breadcrumb (in-memory place history) |
| Go to (Ctrl K) | `.world-tl` button, opens `#worldPalette` in the palette slot |
| Commands: Go offline, Reconnect, Light, Dark, System appearance | Rows in `#worldPalette` under Commands |
| Level mode chips | `.world-modes`, top centre, plant and machine levels only, keys 1 to 4 |
| Layers toggle | `.world-tr`, opens `#worldLayers` |
| Contracts (V), Evidence states | Rows in `#worldLayers` |
| Fit world (Shift P), Fit plant (P), Mark place (M), Bookmarks | Rows in `#worldLayers` |
| Appearance (F8 cycles System, Light, Dark) | Select in `#worldLayers`, stored in `sessionStorage` |
| Egress readout | `#worldEgress` pill in `.world-tr` |
| Kvarm status | `#worldKvarm` pill in `.world-tr`; click or Shift V opens `#worldNetwork` in the right card slot |
| Waiting list | `.world-bl` count; U opens `#worldQueue` as the bottom-left card |
| Docked inspector | `#worldCard` inside `#worldStack`, the right card slot |
| Overview map | `#worldMinimap` in the rail slot (`[data-nav-slot]`); it hides when a card covers it |
| Zoom, clock, connection | `.world-br` |
| Toolbar notes and hints | `.world-hint`, the one hint line |

## 5. Reserved team slots

The open build renders none of these. They come from `research/agentic-ux/n-multiplayer-ux.md` section 5. Each one goes inside an island that already exists, so no island is added for team use. A solo screen adds zero words.

| Element | Island | Words at rest, team |
|---|---|---|
| World name in the breadcrumb (`Northwind / Acquit`) | Top left | 0 to 1 |
| World switcher with Share and Join | Top left, `▾` menu rows | 0 |
| `2 here` presence, after the plant name | Top left | 2 |
| `1 following` or `following Dana · Esc` (replaces `2 here`) | Top left | 2 to 3 |
| `view only` | Top left | 2 |
| `needs Sam` inside the hint for a blocked option | Hint strip | 0 to 2 |
| Egress pill `local + team · N B out` (origin short name replaces `kvarm`) | Top right | 0 |
| `Agents · mine · all` filter | Top right, Layers menu row | 0 |
| `Team · 4 waiting`, one row above Floor timeline, hidden at 0 | Bottom left | 3 |
| Owner on others' bot chips and plates | Plant | 1 per chip |
| `Sam · settling` acting pill | Plant, at the machine | 2 |
| Owner in card header and on clash sides | Right card slot | 1 to 2 |
| `needs Sam` on option rows (replaces the key cap) | Right card slot | 2 per row |
| Handoff and proposal rows | Queue, then the card | row budget 8 |
| Teammate events that affect you | Toast | toast budget 8 |
| `Seen by team` list and team bytes | Network log card | 0 at rest |

## 6. Rules the audit can check

Each rule names the selectors and the numbers. `vw` and `vh` are the viewport size. A tolerance of 1 px applies to every edge because centred islands land on half pixels.

1. **Edges.** The left edge of `.fl.tl`, `.fl.bl`, `.world-tl`, `.world-bl`, `#worldQueue` is 16. The right edge of `.fl.tr`, `.fl.br`, `#nav`, `.world-tr`, `.world-br`, `#worldMinimap`, `.insp.open`, `#worldCard`, `#worldNetwork` is `vw - 16`.
2. **Top row.** `.fl.tl`, `.fl.tc`, `.fl.tr`, `.world-tl`, `.world-modes`, `.world-tr` have top 16 and height 40.
3. **Strip row.** `body>.hint` and `.world-hint` have top 64 and height 28. `#nav`, `#compass`, `#worldMinimap`, `#layers` and any `[data-hint-row]` element have top 64.
4. **Bottom row.** `.fl.br`, `.world-bl`, `.world-br` have bottom `vh - 16` and height 40. `.fl.bl` has bottom `vh - 16` and height 168.
5. **Centre line.** `.fl.tc`, `.world-modes`, `.world-hint` and `body>.hint` are centred on `vw / 2`. The one exception is a hint shifted by a `[data-hint-row]` element; it must then start at that element's right edge plus 8.
6. **Gaps.** Two islands in the same row are at least 8 apart. The hint's right edge is at most `#nav` left minus 8. No island overlaps another island, and no card overlaps an island except the card it replaces.
7. **Card slot.** `.insp.open`, `#worldCard`, `#worldNetwork` and every concept card have left `vw - 408`, top 100, width 392, and bottom at most `vh - 64`. They fit without scrolling at 1280 x 800 (`scrollHeight <= clientHeight`).
8. **Queue.** `#worldQueue` is `[16, 100, 392, vh - 164]`.
9. **Palette.** `.pal` content and `#worldPalette` have top 100 and are centred on `vw / 2`.
10. **Toast.** A toast is centred on the free rect's horizontal centre and its bottom sits at most 8 above the bottom row.
11. **Plant chips.** A plant chip whose rect intersects a visible `.fl`, `.hint` or `#nav` carries `.chip.under` and is not visible.
12. **Island text.** Island text meets 4.5:1 against its island fill in both appearances, and is at least 11 px.
13. **Focus.** Every control inside `.fl`, `.nav`, `.pop` shows a 2 px `--focus` ring when focused, by mouse or keyboard.

## 7. Known violations

These were measured in the builds and are not fixed by the shell.

- **Concept cards are not in the card slot.** Measured at 1280 x 800: orders card left 360 to 720 and 470 wide; clash card `[592,170,560,556]`; gate card left 692 and 460 wide; bench card `[16,100,466,...]`; gate station `[16,100,400,508]`; orders guide `[16,100,288,381]`. Rule 7 fails for all of them. Moving them is concept work.
- **The orders card scrolls at 1280 x 800.** Rule 7 fails.
- **The clash hint collides with the rail at 1280 x 800.** `#clashToolbar` shifts a 730 px hint so that its right edge passes `#nav` left. Rule 6 fails. The fix is shorter hint copy or a toolbar that leaves the strip row.
- **A clash pin label goes off-screen at 1440 x 900** at the step "One table, two migrations · history advisory" (`.clash-pin-label`, left about -6). The open card itself stays on-screen.
- **`.fl.bl` is 168 tall.** It cuts 120 px into the free rect's bottom-left corner. The world level's `.world-bl` is one row tall, as `JOURNEY.md` asks.
- **The world bottom-right island is wider than the ui-v1 one** (936 to 1151 at 1600 against 570) because it carries the connection readout inline.
- **Replay deck and inspector type** is 9 to 10.5 px. Rule 12 fails.
- **The decks and inspector stay dark in light appearance.** They are pinned to graphite tokens so their text keeps contrast on the bright stage.
