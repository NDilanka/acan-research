# Proto B · Living cartographic

## What it is
A matte architectural map on one plane with one camera (memo-gemini.md Directions 1 and 3). Plants are white plinths. Machines are extruded solids, and each one has a shape that reads its kind (tank, dock, bank, kiln, coil, gate). Healthy machines stay achromatic. Hue only names an agent: CC violet, DR teal, CX azure, all rotated from the kit focus token. Red only marks what blocks (clash diamonds, the over-budget belt, the broken witness). Amber only marks what waits on you. Roof gauges appear where the fixture gives a ratio: the paypal error bar against its 2% budget line, the retry coil lit 2 of 3, the verifier cells 1 busy and 7 queued, and the CI crane lamps 3 of 5. Each declaration draws as a trail in its agent's hue beside the belt it claims, so two trails on one belt show the collision before anyone opens a card. Events send a packet down the belt and ping the machine. Nothing moves while the stream is paused.

Code lives in `concepts/dir-b.mjs` (CSS, setup, render) and `concepts/dir-b-lib.mjs` (page drawing functions).

## Value moments (shots in `shots/`, named `dir-b-<frame>-<WxH>-<appearance>.png`)
- F1 (`dir-b-F1-1440x900-light.png`). The org view keeps the Acquit cluster row above its plinth: two red diamonds, the advisory diamond, and four agent drones, with CX ringed amber. Amber counts sit under Acquit (4) and acan-format (1).
- F3 (`dir-b-F3-1440x900-dark.png`). The CX drone has an amber ring and the chip "Codex · waits on you · 12m". c1 is a red diamond on the breaker labelled `c1 CC×DR`, and the violet and teal trails run along the red api to paypal belt. A red dashed tether goes to the broken witness w3. The claim flag and READBACK · ACAN sit on the violet paypal-payouts territory. An edge beacon points up to acan-format, the plant waiting off screen.
- F4. Hovering d3 dims everything outside the blast radius. A teal band runs from the breaker downstream, and dashed frames mark retry and paypal.
- F5 (`dir-b-F5-*`). The clash card sits in the 392 px slot with 6 rows. The suggested resolution (split at the port) previews on the map as dashed trails and a port square. Hovering or pressing 1 to 4 previews each option, and the camera does not move.
- F6 (`dir-b-F6-*`). Machines that did not change dim. Change tags sit where the change happened ("17:14 breaker declared", "17:06 radar CI 5/5"), and a beacon reads "acan-site · 17:22". The card keeps only what the map cannot place, plus Replay (T).
- F7. Unmatched draws the territory as fog, an amber flag "UNMATCHED · Codex holds g1 · no readback", and the holder row. Stale draws a dashed grey flag and its holder row.
- F8. Alt adds each mark's words in place. Rest labels are placed before Alt labels, so no rest label moves.

## Words at rest (audit textBudget.total, identical in all four runs)
F1 28 · F3 45 · F6 66. F6 is over 50 because the away card is open (19 words) and the egress pill grows to 6 words.

## Frame time, scripted wheel zoom with D.stub20 (25 plants, org to machine and back, 120 frames)
| run | frame p95 | render p95 | idle rAF p95 |
|---|---|---|---|
| 1280x800 light | 33.5 ms | 13.1 ms | 7.9 ms |
| 1280x800 dark | 38.4 ms | 20.7 ms | 8.0 ms |
| 1440x900 light | 41.3 ms | 20.5 ms | 8.8 ms |
| 1440x900 dark | 29.9 ms | 15.6 ms | 8.7 ms |
Render is the synchronous draw. The rest of the frame is headless software raster of the SVG. A profile with SVG hidden brought plant-level frames from about 31 ms to about 15 ms. While the camera moves, plants drop chevrons, roof details and dashes, and one full redraw follows 160 ms after it settles. Frame p95 misses the 16 ms target.

## Keys
Wheel zooms at the cursor and drag pans. Arrows or WASD pan, + and - zoom, F fits the world, and Shift 1 to 5 flies to a plant. Ctrl K or Go to opens a fly list. I steps through blockers, and a beacon click flies there. C opens the c1 card, and 1 to 4 preview its options. Shift V or a click on the egress pill opens the Kvarm log. T replays the away half hour, Esc closes, and Alt shows the words.

## Self-score (0 to 4)
- Ten-second test: 3. Waiting, collision, egress and away changes each have a mark. A cold judge must still learn that hue means agent. The CC, DR and CX caps on drones and clash labels carry it without a legend.
- Scan speed: 3. Red and amber are rare, so blockers pop out. Agent chips can crowd near paypal.
- Honesty: 3. dirCheck finds no unbound marks, nothing animates while paused, and unmatched and stale show fog. I did not run textBind or textSeen.
- Words: 3. F1 and F3 are under 50. F6 is at 66.
- Plant legibility: 3. Roofs carry machine id stamps, kinds have distinct solids, and the paypal belt is the only red belt. Dark machine edges (#3e3e3e on #2a2a2a) are under 3:1, not measured by the audit.
- Infinite canvas: 2. Plant nodes keep identity, zoom is continuous, and the org view keeps the blocked agent and the clashes. Frame p95 is 30 to 41 ms, against 16 ms.
- Keyboard reach: 3. Camera, blockers, cards, the log, replay and Alt are all on keys. Picking a resolution only previews it.
- Look: 3. Only tokens are used, audit contrast is clean in all runs, and the shell islands are unchanged.

## Known weaknesses
- Frame p95 is over 16 ms. A transform-based camera would cut path rebuilds, but it is not built.
- Agent hues use CSS relative colour (`oklch(from var(--d-focus) ...)`), which needs Chromium 119 or later. A step checks the support.
- The pause wrapper also finishes finite shell transitions. Transitions on hidden layer switches stalled in headless Chrome and kept the base's zero-running check failing at 1440x900.
- While a clash card is open, digits 1 to 4 preview options instead of switching shell modes.
- Machine stamps and clash caps are set in `.mono`, which the word counter skips.
