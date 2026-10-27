# Direction memo (Opus)

This memo answers `direction/BRIEF-memo.md`. It reads the current shell, the shots, the research and the code, then proposes one visual language, an infinite canvas model, three directions, a Kvarm placement, a prototype plan and the plan changes. Line numbers for `JOURNEY.md` are from a read on 2026-10-27 while another agent was editing it, so they may shift by a few lines.

The short version. The current screens explain the system in words and draw it small and grey. Agents, the subject of the product, are text chips that look exactly like machine labels. The fix is to make agents bodies with color and motion that come only from evidence, make the plant large and white, keep words only for the values the honesty rule protects, and put world, plant and machine on one continuous plane. I bet on direction C, "Live paper".

## 1. Diagnosis

### 1.1 The plant does not read

- The plant is small. In `shots/shell-world-after.png` (1600 x 900) the Acquit drawing spans roughly x 515 to 1170 and y 255 to 710. That is about 21 percent of the screen, measured by eye. The rest is empty dark grid and islands. The cause is `concepts/world.mjs:282-284`, which scales the 1100 x 620 stage (`world.mjs:1027`) down with `k = Math.min(1, ...)` and never up.
- Figure and ground are weak. Dark faces sit on a near-black page with hairline strokes. The kit draws at `--anatomy-weight:.6px` (`vendor/anatomy/iso-kit.mjs:576`) and world raises it only to `.8px` with shades between `#121617` and `#303839` (`world.mjs:1006`). In `shots/shell-gate-after.png` and `shots/shell-orders-after.png` machines, belts and territory outlines all share one grey and one weight.
- Nothing on the plant changes with state except small lamps. The world footer says so in words, `PLANT · read only · no activity animation` (`shots/shell-world-after.png`, bottom island).
- Agents are missing or disguised. In `shots/shell-world-after.png` the plant level of world draws zero agents, while the queue says `Waiting on you 6`. In the ui-v1 plant, agents are 22 x 15 px grey drones (`build.mjs:34`) that hide when the agents layer is off (`build.mjs:94`). Their names are chips with the same class, size, blur and two-letter badge as machine labels (`build.mjs:73-75`, reused at `concepts/orders.mjs:137`). In `shots/orders-kv-unmatched.png`, `CX CODEX` and `VF VERIFIER` are the same object to the eye.
- Agent state lives in a list, not on the map. `Codex blocked on you 9m`, `Droid reading` and `Claude Code reading` are rows in the bottom-left island (`shots/quiet-after-kv-unmatched-light.png`). The drones on the plant carry none of it.
- Numbers float away from their machines. The bottom-right island reads `15 rps · p99 184 ms · 0.6% err` (`shots/shell-gate-after.png`), which describes paypal and the API but sits in a corner.

### 1.2 Text doing work that a visual channel could do

I counted words by hand from the shots, splitting on spaces and treating a number with its unit as one word, as `TEXT.md:44` does. The counts are approximate. "Replaceable" means a word whose job position, shape, color, motion or size could carry, with the word kept one key away.

| Shot | Words on screen | Replaceable | What the replaceable words do | Better channel |
|---|---|---|---|---|
| `shell-world-overview-after.png` | about 134 | about 80 | Site numbers `01` to `05` (5). Severity said twice per plant, once as a badge `1 blocks publication` and again as the condition line (14). Environment words `local`, `sandbox`, `own origin`, `preview` (6). Freshness words `stale · 41 s`, `fresh 8 s`, `runtime not reported`, `simulated · not live` (11). Footer summary and prototype disclaimers `WORLD · read only · no activity animation`, `5 plants · 2 block publication · 5 waiting · 1 stale`, `Scripted evidence · no network` (27). Minimap names that repeat the canvas names while the whole world is already in view (7). Route labels (10). | Position for identity. One glyph with a count on the footprint for severity. Paper tint or border style for environment. The five evidence drawings already defined in `CORE.md:96` for freshness. Line pattern for route kind. |
| `shell-world-after.png` | about 118 | about 45 | The same age `41 s` printed six times on six machine labels and the header. Territory states `STALE`, `VERIFYING`, `UNCLAIMED` in capitals. `sandbox · 55825fe` in the header and again in the footer. Footer disclaimers (19). The same four plants named three times, as edge labels, in the minimap and in Go to. The toast `Opened Acquit. Local evidence only.` | One plant-level freshness state, since all six readings share one stale OTLP batch. Territory fill and outline style. Drop the footer. Edge beacons only. |
| `orders-kv-unmatched.png` | 309 (`TEXT.md:136`) | most of the card | Readback paragraphs of 30 to 47 words, wire calls `comment_issue`, `claim_task` with bytes inside the order card (`orders.mjs:102-103`), per-witness `w1 pass w2 pass w3 fail` rows that repeat the pins on the plant. | Per-agent tick rows on the agent body. Ledger behind the egress pill. |
| `quiet-after-kv-unmatched-light.png` | 135 (`TEXT.md:136`) | about 30 | `✓✓✓ 3/3` and `✓✓✕ 2/3` say the same thing twice. Witness rows `w1 15:44 retry loop depth ≤ 2` repeat the pins. Agent states `reading`, `blocked on you 9m` sit in a list. Codex appears twice in the queue. | Ticks only, with the number under Alt. A wait ring on the Codex body. |
| `shell-gate-after.png` | about 190 | about 70 | Nine request rows, each with a meta line such as `Droid · 10-15 min · guess`. The review cost is a text range, and none of the nine rows points at the machine it concerns (webhook, breaker, sqlite, verifier). Section headings in faint capitals. | A bar length per row for review minutes, against the allowance line. A pin on the machine each request concerns. |
| `shell-clash-after-light.png` | about 120 | about 32 | Eight footprint labels like `api · Claude Code · static` and `sqlite · Droid · history · not declared` (`clash.mjs:18`, `clash.mjs:331`). Each label names the machine (already given by position), the agent (could be hue) and the source class (could be line style). | Agent hue on the footprint, line style for source, word under Alt. |

Across these six screens, between 40 and 45 percent of the words do a job a channel could do, by this hand count. The words that remain are the ones `TEXT.md:63-72` requires at rest: state word and holder, bytes out, readback source, evidence on agent chips, and the blocking gate.

### 1.3 Why it looks dated and generic

- Uppercase, tracked, monospaced micro labels everywhere. The hint strip is `11px mono, letter-spacing .06em, uppercase` (`build.mjs:134`). Chips are `10.5px, uppercase, .09em, weight 600` (`build.mjs:73`). Eyebrows and section labels are `10px mono uppercase` (`orders.mjs:15`, `orders.mjs:31`, `orders.mjs:39`, `build.mjs:158`, `build.mjs:193`). This is the sci-fi HUD idiom of crypto and devtool dashboards from a few years ago, and it is the first thing that reads as generic.
- Frosted glass with deep shadows on every island, chip and card. Islands use `backdrop-filter: blur(16px) saturate(1.2)` (`build.mjs:103`), the inspector `blur(20px)` (`build.mjs:175`), and the shadow token stacks a 32 px blur at 45 percent black (`build.mjs:49`). Even chips blur (`build.mjs:73`) and draw a gradient leader line (`build.mjs:74`).
- Brass on graphite as the house style (`CORE.md:38`). With low-contrast grey machines, brass becomes the only color, so it marks everything and means nothing.
- Game nameplates. Two-letter badges (`CX`, `CC`, `VF`, `PP`) on every chip (`build.mjs:75`) read as an RTS unit frame.
- Camera chrome that is always on. The rail shows a 74 px compass, an orbit row and `tilt 30°` (`SHELL.md:34-35`, every ui-v1 shot). Orbit is a rare action that takes a permanent corner.
- Orthogonal dashed connectors with mid-line labels in `shell-world-overview-after.png` look like a generic node graph, which Honeycomb's account warns users read once and forget (`research/agentic-ux/b-games-softvis.md`, "Observability maps").

### 1.4 Why cards and panels feel heavy

- They are wide. The orders card is 470 px (`orders.mjs:24`), 29 percent of a 1600 px screen and 37 percent of 1280. The clash card is 560 px (`SHELL.md:152`). The gate station is 400 x 608 at 1600 (`concepts/gate.mjs:340`, `shell-gate-after.png`). The card slot itself is 392 px (`build.mjs:37`).
- They are dark and opaque. The orders card is `rgba(22,22,21,.97)` with a brass border (`orders.mjs:24`). The inspector is pinned dark in light (`build.mjs:56-57`, `SHELL.md:159`).
- They stack many sections, each with its own heading, mono ledger and footer button. `shell-gate-after.png` shows an allowance block, three section headings, nine two-line rows, a four-line ledger and a button in one card.
- The bottom-left island is 168 px tall (`SHELL.md:36`, `SHELL.md:156`), so a status list cuts into the plant on every screen.

### 1.5 Light is not pure white yet

Light uses warm vellum in six places, not the kit's neutral tokens (`iso-kit.mjs:580-589`).

- Islands `rgba(252,250,245,.8)` (`build.mjs:53`).
- Stage paper `#f8f5ed` to `#ebe7dc` (`build.mjs:242`) and iso faces `#F8F5ED` (`build.mjs:247`).
- World paper `#F4F1EA` (`world.mjs:809`) and iso faces `#F2EEE4` (`world.mjs:1007`).
- Decks and inspector forced dark (`build.mjs:56-57`).
- Chips hard-coded dark `rgba(14,14,14,.72)` (`build.mjs:73`), and `.xl` labels `rgba(10,10,10,.6)` (`build.mjs:98`).
- The orders card hard-coded dark (`orders.mjs:24`).

The result is visible in `shell-orders-after-light.png`. A black card and black chips sit on cream paper.

### 1.6 What already works and must survive

- The island shell from `orders-kv-unmatched.png`. Full-bleed stage, corner islands, one card slot (`PARKED.md:16`).
- The text rule and honesty table (`TEXT.md:5-9`, `TEXT.md:63-72`) and the quiet cut that took screens down 41 to 62 percent (`TEXT.md:116-137`).
- Five distinct evidence states (`CORE.md:96`) and the binding record (`CORE.md:94`).
- Alt reveals words in place, as Factorio's alt mode does (`CORE.md:95`).

## 2. The value case

Each moment says what the developer sees on the map in under two seconds, which channel carries it, and what a chat UI makes them do instead. They are ranked by how strongly they sell the switch to a developer who lives in chat tabs today. The ranking weighs how often the moment happens, how fast it reads cold, and whether chat can do it at all.

| Rank | Moment | What the map shows in under 2 s | Channel | Chat equivalent it replaces |
|---|---|---|---|---|
| 1 | An agent is blocked on you | Among moving agents, one body is still, with an amber ring that fills clockwise as its wait ages. A full ring means the latest safe response has passed. | Motion stopping, a filling ring (arc length), amber hue reserved for "you" | Hunting through five tabs for the one whose last message is a question, or a desktop notification with no place attached. The HN quote in `f-frontier.md` ("you never know if you should wait or switch") is this pain. |
| 2 | Two agents converge on the same belt | Two agent-colored tints run along the api to paypal belt and overlap at the breaker. The overlap carries a brass diamond. If it breaks a witness, the diamond is filled and has a red tick. | Hue per agent, overlap in position, shape for the clash | Nothing. Each transcript says "I'll add a retry" or "I'll add a breaker". You find out at merge. This is the moment chat cannot reproduce. |
| 3 | What changed while you were away | Changed machines show a faint ghost of their old outline under the new one. Each agent leaves a fading trail of where it worked. A dot marks every item that is new since you left. | Ghosting, trails, a "new" dot, density on the timeline strip | Scrolling five transcripts from the top and rebuilding the story in your head. |
| 4 | An agent says done, the system has not confirmed | The machine the agent touched shows a hollow check. It turns solid only when the bound check or telemetry confirms. | Fill (hollow against solid) | "Done! All tests pass." in a chat bubble, which is the agent's claim, not evidence (`00-synthesis.md`, convergence row 1). |
| 5 | Cost and blast radius of a change | Selecting an order or a declaration warms every downstream belt and machine it can reach. Untouched parts stay grey. | Heat along topology (luminance and hue ramp) | The agent's prose summary, "this touches X and Y", which you cannot check. |
| 6 | Two readbacks disagree | At the sqlite layer a split pin shows the two agents' hues, one half each. Each agent body shows a row of ticks, one per witness, and one tick is red. | Split shape at the exact place, small multiples of ticks | Reading two plans side by side and diffing them in your head. |
| 7 | A change moves a runtime number | The paypal gauge needle crosses its budget notch, and the belt into paypal carries red cargo. | Needle position against a notch, cargo color | Opening Grafana in another window and guessing which agent caused it. |
| 8 | A stale lease or an unmatched claim | The territory outline turns dashed amber and the fog stays. The lease ring around the holder's flag shrinks as time runs out, and turns hatched and still when stale. | Arc length, texture (hatch), dash | Nothing. Chat never shows leases. At best a log line. |
| 9 | Data leaves the machine | A brass thread runs from the sending machine to the origin beacon at the plant edge, and a packet travels once per send. | Line, motion bound to a send event | Nothing visible. |
| 10 | Review load exceeds your allowance | Your review tray at the dock fills with tokens up to a line. Tokens past the line are drawn hollow. | Isotype count against a threshold line | A PR list sorted by date. |

Moments 1 to 3 are the pitch. Moment 1 reads with no legend, and I guess it happens every few minutes once three or more agents run, though nothing here measures that. Moment 2 is the one thing chat cannot do. Moment 3 answers the most common reason people stay in chat, which is that the transcript is the record. Every direction in section 5 must land these three.

## 3. Encoding system

### 3.1 Rules

1. **Quiet when normal.** Healthy machines are neutral grey. Color appears only for agents and for abnormal states. This is the dark-cockpit rule of flight decks and the ISA-101 high-performance HMI practice (`j-plant-fidelity.md`, "SCADA favors a quiet normal state").
2. **Hue means identity, not status.** Each agent session gets one hue from a fixed set of four. Status uses fill, ring, dash, hatch and motion. Two hues are reserved for status. Amber means "waits on you". Red means "breaks a witness or fails". Teal leaves the plant, so "fine" draws as grey.
3. **Motion means an event happened.** An agent moves only when its session reports activity. Cargo moves only with observed events (`j-plant-fidelity.md`, binding 9). Unknown means no motion and fog hatch (`CORE.md:96`). Still means waiting or idle, never "fine".
4. **Words only for the honesty table.** The values in `TEXT.md:63-72` stay as words at rest. Everything else is a mark with its words under Alt, in the card, or in the provenance popover.
5. **Every mark reads one binding.** Mark, Alt label and popover read the same record (`CORE.md:94`). A mark with no binding does not render.
6. **Size is screen-space for attention marks.** Wait rings, clash diamonds and unmatched flags keep a fixed pixel size at every zoom, so zooming out never hides a decision.

### 3.2 The marks

| Object | Mark | Channels and states | Words at rest | One key away |
|---|---|---|---|---|
| Agent | A body (a 14 px puck at plant level, a 6 px dot when zoomed out) in the session hue, sitting on the machine it is acting on. A name flag in the hue, as a Figma cursor has. | Working: small bob and a work tick traveling along the belt it touches. Waiting on you: still, amber ring filling with age. Idle: still, hollow, desaturated. Blocked by another agent: still, with a thin tether to the blocker. Passive (cannot see orders): dashed outline. | Name and evidence word on the flag, `Codex · authenticated` (`TEXT.md:70`). The flag shows on activity, selection, wait, or when the agent holds a lease, and fades after 4 s otherwise. | Session id, model, last event, wait age in minutes (Alt). |
| Order | A plate on the territory edge. | Open: hollow outline. Matched: half fill. Claimed: solid, with a stripe in the holder's hue. Unmatched: dashed amber, fog kept. | State word and holder, `CLAIMED · Claude Code` (`TEXT.md:68`). | Sentence, revision, witnesses (card). |
| Lease | A ring around the order plate. | Arc length is time left. A tick on each renewal. Stale: hatched and still. Expired or rejected: a broken ring. | None beyond the order's state word. | Fence, deadline, authority (popover). |
| Declaration (footprint) | A tint along the belts and machines an agent declares it will write. | Hue is the agent. Line style is the source. Solid means Acan declaration, long dash static analysis, dot history, double line remote intent. Shown on V and always where it overlaps another. | None. | Source word on every write under Alt, as `CORE.md:58` requires. |
| Clash | A brass diamond where two tints overlap. | Size grows with consequence. Filled with a red tick when it breaks a witness. Advisory: faint dashed diamond, no count (`CORE.md:59`). Settled: a small hollow notch. | The count chip `2 clashes before code`. | Consequence and options (card). |
| Witness | A pin. Must not is a red downward triangle. Must keep is a grey circle with a ring. | Pass, fail and unknown per agent show as ticks on the agent body, not on the pin. | None. | Time, reason, check (Alt). |
| Readback | A row of ticks under the agent body, one tick per witness, in witness order. | Pass is a solid tick, fail red, unknown hollow. Disagreement draws a split pin at the place where the readings differ. | `READBACK · ACAN` on the order plate (`TEXT.md:69`). | Paragraph per agent (Alt). |
| Egress | A brass thread from the sending machine to the origin beacon at the plant edge. | One packet per send. Thread weight in three bins by bytes. Held sends while offline draw as a dotted thread that stops at the boundary. | The pill `local + kvarm · 1,336 B out` (`TEXT.md:67`). | Network log (Shift V). |
| Runtime | Belt cargo and one mounted gauge per machine (`j-plant-fidelity.md`, recommended bindings). | Cargo only from events. Gauge needle against a budget notch. Breach turns the needle red. | None. | Metric, unit, window (Alt). |
| Time | Trails, ghosts and the "new" dot, plus a 60-minute activity strip under the clock. | Trail opacity decays over the away window. Ghost is the pre-change outline at 25 percent. Strip height is event count per minute per plant. | The clock. | Scrub the strip to replay (Replay mode). |
| Review load | Tokens in a tray at your dock, against an allowance line. | Isotype, one token per item up to seven, then a number (`j-plant-fidelity.md`, Isotype). | `Waiting on you 3` count. | The queue (U). |
| Freshness | Saturation steps on the whole plant or machine. | Fresh is full contrast. Aging steps down once. Stale is dimmed with no motion and its age on Alt (`CORE.md:96`). | None. | Age and source (Alt). |

### 3.3 What each borrowing buys

| Source | What we take | What it buys | What we refuse |
|---|---|---|---|
| Mini Metro | One clean line per agent in its own color. The overcrowding timer, a ring that fills around a station. Thin lines and simple station shapes. | The wait ring for moment 1, read with no legend. Agent identity at any zoom. | Its abstraction of geography at plant level, because the plant drawing is the product. |
| Factorio | Alt mode words in place (`b-games-softvis.md`, G3). Ghosts and the assigned-ghost tint (G1, G5). The pollution overlay (G6). | Words one key away with no layout change. Declarations as ghosts. Blast radius as an overlay on a fixed layout. | Perpetual animation of healthy machines. |
| Flight decks and ISA-101 | Dark cockpit. Normal is silent and abnormal is lit. | A calm plant, so the few colored marks pop out pre-attentively. | Annunciator text panels. |
| Tufte | Small multiples and sparklines. | Per-agent readback ticks compared at a glance. Plants as identical small multiples at org zoom. The activity strip. | Dense tables in cards (`TEXT.md:105` already found them slow to reach). |
| Bret Victor | Immediate connection between a control and its effect. | Hovering a declaration or an option warms its blast radius live. Scrubbing the strip shows the plant at that minute. | Free-form simulation as truth (`00-synthesis.md`, "Simulated comparison"). |
| Figma multiplayer | Colored cursors with name flags at the point of action, which appear on activity and fade at rest. | A chat developer reads "my agents are here, doing this" with no training. | Cursor jitter as a sign of progress. Motion only from events. |
| Linear | Restraint. One accent, neutral greys, 13 px sentence-case UI type, 1 px hairlines, no glass. | The modern, calm look the user is asking for. | Hiding state behind hover. The honesty values stay visible. |
| Isotype | Repeated equal units, then a number (`j-plant-fidelity.md`). | Honest counts for queues and review load. | Big pictograms for big numbers. |
| Map labeling | Priority labels with collision culling and fixed screen size. | Labels that never overlap and never shrink below 11 px. | Labels that scale with the canvas. |

### 3.4 Honesty rules for marks

- A mark renders only from a binding with a source class, locator, revision and age (`CORE.md:94`). The audit counts marks without `data-binding` and fails on any.
- Motion requires an event in the last N seconds for that binding. With no events, the stage has zero running animations, which the steps file can assert with `getAnimations()`.
- Unknown, stale, zero, stopped and simulated keep their five drawings (`CORE.md:96`). Freshness by saturation never replaces the hatch for unknown.
- A glyph never carries an honesty-table value alone (`TEXT.md:85`). Hue and shape carry everything else, and Alt shows the word in place for every mark.
- Every number on a card or chip sits inside a binding (`TEXT.md:57`).

## 4. Infinite canvas for world

### 4.1 What the current world cannot do

- The world is a fixed 1600 x 900 box. The routes SVG has `viewBox="0 0 1600 900"` and the viewport is `width:1600px;height:900px` (`world.mjs:772`, `world.mjs:829`, `world.mjs:1026`). The ui-v1 plant is the same fixed box (`build.mjs:31`, `build.mjs:69-71`), and `JOURNEY.md:26` and `JOURNEY.md:105` keep it.
- Sites are thumbnail positions on that box (`concepts/world-data.mjs:5-56`), not real plant extents. A plant at world zoom is about 200 px wide, while the same plant at plant level is a separate 1100 x 620 stage.
- Zoom never goes past 1. `worldTransform` caps scale at `Math.min(1, ...)` and ignores the user's camera whenever a card is open (`world.mjs:200-208`).
- The wheel does not zoom. It steps levels after 110 or 160 units of wheel delta and locks for 300 ms (`world.mjs:716-736`). Pan works only at world level with no card open (`world.mjs:739`).
- Plant level is a page swap, not a zoom. The world viewport is hidden (`world.mjs:222`) and a different DOM stage draws (`world.mjs:278-287`). Other plants become edge labels (`world.mjs:224-276`). `JOURNEY.md:13` adds a second swap into the ui-v1 stage for Acquit.
- The minimap divides 1600 x 900 by 10 (`world.mjs:468-472`, `world.mjs:755`), so it cannot represent an unbounded plane.
- Labels live inside the scaled viewport, so they shrink with the camera instead of keeping a fixed size.

### 4.2 Model

- One plane in world units, where 1 unit is one iso grid step. Each plant owns a site rect sized from its real drawing extents, not its thumbnail. Machines sit in plant-local coordinates inside that rect. World placement stays in local workspace state and never rewrites a repository's files (`k-multi-plant-canvas.md`, "One personal world").
- One camera with `x`, `y` and a continuous log-scale zoom `z`. Every view, bookmark and history entry is a camera plus a selection. Cards no longer freeze the camera. They only shrink the free rect the camera fits into.
- One scene graph. The plant a user zooms into is the same object at a higher level of detail, so nothing swaps. Acquit's ui-v1 stage mounts as the plant at Acquit's site.
- The plane is unbounded in both directions, with soft bounds. Panning past all content by more than one screen shows edge beacons toward the nearest plants, which avoids desert fog (`k-multi-plant-canvas.md`, Jul and Furnas).

### 4.3 Semantic zoom levels

Levels switch on the projected width of a plant's site rect in screen pixels, with 15 percent hysteresis so a small wheel movement never flickers. The names are zoom names. In the open build the top is "My world". A company world is the paid team module and uses the same canvas.

| Level | Trigger (site width on screen) | Renders | Hidden | Labels |
|---|---|---|---|---|
| Org | under 160 px | Each plant as a filled footprint silhouette (small multiples), its name, one attention glyph with a count, agent dots in their hues (isotype, up to 7 then a number), a 60-minute activity sparkline under the name. Cross-plant contracts bundled into one route per plant pair. | Machines, belts, cargo, pins, territories. | Plant names, always. Nothing else. |
| Site | 160 to 560 px | The flat plan (the required flat projection in `j-plant-fidelity.md`, section 2) with machine blocks by role, territory fills by claim state, agents as dots at their machines, wait rings, clash diamonds, unmatched flags. | Iso volume, gauges, cargo, witness pins. | Plant name plus up to three abnormal machine names by priority. |
| Plant | 560 to 2200 px | Full iso anatomy, belts with event cargo, agent bodies with flags, order plates, lease rings, witness pins, footprints on V, gauges, egress threads, trails and ghosts. Neighbor plants in view draw at their own level. | Machine internals. | Honesty-table words, then attention marks, then abnormal machines, then the selected machine. Healthy machine names only under Alt. |
| Machine | the machine itself over 220 px | Ports, fittings, tank layers, the named gauge with its number, connected flows, affected orders. | Far parts of the plant fade to 40 percent. | Port and layer labels for the focused machine. |
| File | explicit, X on a machine (`JOURNEY.md:69`) | The machine's declared and observed files as rows, with one tick per agent edit and a diff count, read-only. Only files from a binding. Acan never invents files. | Everything outside the machine. | Text is allowed here, because this is the deepest layer. |

### 4.4 Level of detail and label collision

- A spatial grid index over site rects and machines. Draw only what intersects the viewport plus one screen of margin.
- At org and site level, render each plant once to a cached raster per appearance and mode, and redraw only when its summary changes. At plant level, draw live vector for the plants in view. Cap detailed machines across the viewport at 2,000, as `k-multi-plant-canvas.md` ("Performance is one aggregate budget") proposes.
- Motion only for plants in view, capped at 20 fps, and stillness after two minutes with no input or state change (`j-plant-fidelity.md`, "What to avoid", citing Q15).
- Labels render in screen space at a fixed size, never scaled with the canvas. Placement is greedy by priority with eight candidate positions per anchor. The priority order is honesty values, then wait, clash and unmatched marks, then the selection and hover target, then plant names, then abnormal machines, then the rest. A label that loses a collision becomes a 4 px dot that shows its label on hover. Alt shows every label with leader lines. A grid-bucket index replaces the brute-force offset scan in `world.mjs:289-294`.

### 4.5 Agents when zoomed out

- Agents never disappear. At org level each plant shows its agents as hue dots in a row under the name, so "three agents in Acquit, one in acan-site" reads at a glance.
- Waiting agents keep a fixed-size amber ring at every level. At org level the ring sits on the plant's footprint with the number of waiting agents inside.
- Off-screen attention clamps to the edge of the free rect as a beacon that points toward it, with a count and the agent hue. Clicking or pressing I flies there.
- Agent motion collapses to a pulse on the plant's activity sparkline when the agent is too small to see moving.

### 4.6 Navigation

| Input | Does |
|---|---|
| Wheel or pinch | Continuous zoom about the cursor. Levels change on thresholds, never on wheel count. |
| Drag on empty canvas, two-finger trackpad | Pan at every level, with or without a card open. |
| `-` and `=` | Zoom out and in by one level step about the free rect's centre. Both keys are outside the taken list in `CORE.md:27`. |
| F | Fit the focused plant or machine (`JOURNEY.md:68`). |
| Shift F | Fit everything. This needs sign-off, since Shift F is not in the free list in `CORE.md:27`. |
| Ctrl K | Go to a plant, machine, order or decision. A target within two screens eases there. A farther target cuts with no flight. Reduced motion always cuts. |
| Alt 1 to 9 | Fly to a plant in world order. This extends Alt 1 to 5 in `JOURNEY.md:63`. |
| Alt left and right | Back and forward through place history, restoring camera, selection and mode. |
| I | Next attention item, wherever it is. The camera eases to it and the card opens. |
| Minimap | Off by default. A Layers row turns it on in the rail slot. Edge beacons, Shift F and Go to answer "where am I" without a permanent panel. |

### 4.7 The island shell over the canvas

- Islands stay fixed in screen space, and the canvas runs full-bleed under them (`SHELL.md:3`). No island is added.
- The camera fits into the free rect (`SHELL.md:71-81`). Edge beacons clamp to the free rect, not the viewport, so they never hide under an island.
- The mode chips stay top centre and apply to the focused plant only. Other plants in view keep Live.
- The compass and orbit row leave the rail. Orbit becomes a single button in the zoom island, because semantic zoom makes orbit rare. The rail slot holds the optional minimap or nothing.

### 4.8 Performance checks for the prototype

Five plants are the fixture. A stub of twenty plants built from repeated fixtures, with no telemetry, tests the canvas. The prototype records frame time during a scripted zoom sweep from org to machine and back, and counts label visibility toggles during the sweep. These are prototype checks, not the A10 budget for the real renderer.

## 5. Three directions

All three use the encoding rules in section 3, the canvas in section 4, the kit's neutral tokens in both appearances (`iso-kit.mjs:568-589`), and the island shell. They differ in what the plant is, where the information lives, and what the eye does first.

### Direction A. "Transit"

**Thesis.** The plant is a transit map. Machines are stations, belts are lines, agents are trains in their own color running along the lines they work on. The drawing is flat 2D at every level, schematic, with 45-degree routing. It is the clearest possible picture of who is where and who collides, and it trades away the physical plant.

**Look.**
- Type is Inter 13 px sentence case for every label and Inter tabular figures for numbers. No mono except revisions and bytes.
- In pure white, the page is `#f2f2ef`, stations are white discs with a 1.5 px grey ring, lines are 4 px neutral grey, and agent lines are 4 px in their hues laid alongside. Islands are `#fbfbfa` with a 1 px hairline at 8 percent black, no blur, no shadow.
- In dark, the page is `#0b0b0b`, stations are `#1b1b1b` discs with a `#3e3e3e` ring, and agent lines keep the same hues at higher lightness.
- Cards are 320 px, flat, hairline border, at most six rows at rest.
- Chrome is the island shell with no compass.

**Top three moments.** Waiting on you is a train stopped at a station with Mini Metro's filling ring. Convergence is two colored lines on one segment, with the diamond at the shared station. Away is a faded line where a train ran and a dot on each station that changed.

**Infinite canvas.** It is the easiest of the three. Flat vector with map-style level of detail. Org level is a subway system map of plants, plant level is the line diagram, machine level is a station plan.

**Main risk.** It throws away the isometric plant, the anatomy kit's machine drawings and the authored layouts, which `f-frontier.md` ("Novelty check") names as part of what separates Acan from agent canvases. It can read as one more node graph, the failure Honeycomb documents (`b-games-softvis.md`, S5).

### Direction B. "Instrument"

**Thesis.** The plant is a control-room mimic. Every machine wears one small instrument, a gauge with a budget notch and a 60-minute sparkline. The plant stays grey and silent until a value leaves its band. Agents are small, precise markers. Information density is high and words are replaced with instruments, not with motion.

**Look.**
- Type is Inter 12 px for labels and a narrow tabular face for numbers on instruments.
- In pure white, machines are white iso blocks with the kit's grey shading, instruments are drawn in `#26262a` hairlines, abnormal values go red `#e5484d` and waits go amber.
- In dark, the kit dark tokens, with instruments in `#d4d4d4`.
- Cards are tables of aligned figures, 360 px, flat.
- The bottom-right readout disappears because each number lives on its machine. The rail keeps a small compass.

**Top three moments.** Waiting on you is an amber marker with a wait bar that grows against a safe-response tick. Convergence is two markers on the belt and a red band on the shared segment's gauge. Away is a sparkline per machine with a shaded band for the away window.

**Infinite canvas.** At org level each plant becomes one small multiple of its top three sparklines. At site level the instruments merge into one per territory. At plant level every machine shows its instrument.

**Main risk.** Numbers count as words (`TEXT.md:13`), so the word budget gets worse, not better, and it looks like Grafana. A chat developer sees a monitoring screen and does not see agents. It is strongest on moment 7 and weakest on moments 1 to 3.

### Direction C. "Live paper"

**Thesis.** The plant is a white paper model, large in the frame, drawn with the anatomy kit's default light faces. Agents are the only saturated things on it. They are colored bodies with Figma-style name flags that sit on the machine they are working on, move only when their session reports work, and leave ink trails that fade. Machines stay quiet grey until something is abnormal. Text is the honesty table and almost nothing else.

**Look.**
- Type is Inter 13 px sentence case, weight 500 for names and 400 for the rest. Mono only for revisions, bytes and file paths. No uppercase anywhere except the state word.
- In pure white, the page is `#f2f2ef`, faces `#ffffff`, shades `#dcdcd9` to `#f4f4f1`, edges `#26262a` at the kit's weights, all from `iso-kit.mjs:581-588`. Islands and cards are `#fbfbfa` with the kit's `--anatomy-lift` shadow (`iso-kit.mjs:588`). No blur.
- In dark, the kit dark tokens (`iso-kit.mjs:569-578`). Faces `#1b1b1b` on `#0b0b0b`, edges `#d4d4d4`, and the same agent hues lifted for contrast.
- Agent hues are four, starting from the kit blue `#3e63dd` and three others chosen in the prototype with a color-vision-deficiency check. "You" is ink black in light and white in dark.
- Cards are 340 px, one header line with the state word, at most six rows at rest, hairline dividers, and no section headings. Sentences go under Alt.
- Chrome is the island shell, compass removed, the bottom-left island one row tall.

**Top three moments.** Waiting on you is a still body with the amber ring among bobbing ones. Convergence is two hue tints meeting on the belt at a brass diamond, visible before anyone selects anything. Away shows the trails of where each agent went, ghosts under changed machines, and "new" dots, with the return brief card listing only what the map cannot show.

**Infinite canvas.** At org level each plant is a white footprint silhouette with its agent dots and sparkline. At site level it is the flat plan with hue dots. At plant level it is the full paper model with bodies. The paper model makes the zoom feel physical, because the same white object grows.

**Main risk.** Motion can read as progress, which six research slices warn against (`00-synthesis.md`, convergence row 3). The mitigation is rule 3 in section 3.1, an audit that fails any animation without an event, and a plant that goes still when agents are waiting. A second risk is cost, since bodies, trails and live iso at plant level need the level-of-detail work in section 4.4. A third is that the white model can look empty when no agent is active, which is acceptable because empty is the truth.

### The bet

I bet on C, with B's dark-cockpit rule for machines and A's flat plan as the site level.

- The top three value moments are about agents in places over time. Only C gives agents a body, a place and a trail, so only C lands all three without reading.
- The user asked for pure white from the anatomy kit. C is that kit's light theme used as the product's face, not a theme bolted on.
- A chat developer already knows Figma cursors. "Colored names on the thing they are editing" needs no legend, which is what the 10-second test measures.
- It keeps the isometric plant, the authored layout and the machine catalog, which A gives up.
- It cuts words more than B, because bodies, rings and tints replace text where B replaces text with numbers.

What would change my mind. If the motion audit shows that event-bound motion still makes cold judges call an idle plant "working", or if C scores below A on the 10-second test, I would take A's flat schematic for every level and keep C's look.

## 6. Kvarm placement

I read "the compass island" as the right-hand cluster, the rail with the compass and the top-right island, under which the network log card opens in the right slot (`SHELL.md:63`, `SHELL.md:100`). Today Kvarm status is spread across six places. These are the egress pill (`.fl.tr`), the Kvarm pill in world (`SHELL.md:100`), the connection readout in the bottom-right island (`JOURNEY.md:23`), ledger rows inside the order card (`orders.mjs:102-103`, visible in `orders-kv-stale.png`), the kv panel (`TEXT.md:81`), and the network log card.

Recommendation. Move Kvarm off the rail and out of the cards. Kvarm is a place the plant talks to, so draw it on the map, and keep one pill for its words.

- **On the map.** The selected origin is a beacon at the plant edge, in the direction of its plant if that plant is in the world, otherwise at the top edge. Egress threads end at it. Its lamp is steady when fresh, hatched and still when stale, and dark when offline. Lease rings on order plates carry claim state. Unmatched claims show as dashed amber territories. This puts every Kvarm fact that changes what you do next where you are already looking.
- **One pill.** The top-right egress pill becomes the connection pill, `local + kvarm · 1,336 B out`, with a state lamp. It adds one word only when the state is not fresh, such as `stale 33 s` or `offline · 3 held`. This keeps the bytes value the honesty rule requires (`TEXT.md:67`).
- **One card.** Click the pill or press Shift V to open the network log in the right card slot (`JOURNEY.md:66`). It holds the ledger, capabilities, consent and per-call bytes.
- **Removed.** The connection readout leaves the bottom-right island, which fixes its extra width (`SHELL.md:157`). The mono ledger leaves the order card. The order card keeps only the state word and holder.
- **Not conflated.** The origin beacon is not the Kvarm plant in `world-data.mjs:28`. When the user's own Kvarm plant serves the selected origin, a thin "serves" line connects the plant to the beacon. Under the hard rule in `PARKED.md:21`, nothing names unannounced server features.

The reason. Kvarm status matters at three moments, when data leaves, when a claim is uncertain, and when the connection degrades. The first two are spatial, so they belong on the plant. The third is global, so it belongs in one pill. None of them belongs next to the camera controls.

## 7. Prototype plan

### 7.1 Same inputs for all three

- **Scenario.** One fixed session, the busy minute at 16:33:30 from `JOURNEY.md:43` plus an away window from 17:00 to 17:30 (`JOURNEY.md:118-124`). Claude Code holds paypal-payouts on lease g1. Droid works radar-otel and declares the breaker. Codex is passive and has waited 9 minutes on you. Clashes c1 and c2 are open, p-2307 is answered, and the egress pill shows the fixture ledger total (1,336 B in `TEXT.md:67`). The world has five plants.
- **Fixtures.** `concepts/core-data.mjs`, `concepts/world-data.mjs` and `concepts/gate-data.mjs`, plus one new `concepts/direction-data.mjs` written once before the three builds. It holds the camera script, the event stream that drives motion, the away diff and the twenty-plant stub. The three builders may not edit it.
- **Scenarios.** `kv=ok` and `kv=unmatched` for every frame, and `kv=stale` for frame F7.
- **Sizes and appearances.** 1280 x 800 and 1440 x 900, light (pure white kit tokens) and dark (kit dark tokens).
- **Build rules.** Each direction is one concept module, `concepts/dir-a.mjs`, `concepts/dir-b.mjs` and `concepts/dir-c.mjs`, on the island shell, with a steps file driven through `node run-steps.mjs` with `AUDIT=1`. Shots go to `shots/dir-<x>-<frame>-<size>-<appearance>.png`, which is 8 frames x 2 sizes x 2 appearances, 32 shots per direction.

### 7.2 Frames every prototype must show

| Frame | State | What it must prove |
|---|---|---|
| F1 | Org level, five plants | Agents visible as dots per plant, waiting count on Acquit, no machine labels. |
| F2 | Continuous zoom from org to Acquit, five fixed zoom stops from the camera script | Same scene object at every stop, no DOM swap, no label flicker, levels change on thresholds. |
| F3 | Acquit at plant level, at rest, no card | Moments 1 and 2 readable with no selection. Codex waiting, Claude Code and Droid working, c1 visible. |
| F4 | Blast radius of Droid's breaker declaration on hover | Heat along the downstream belts only. |
| F5 | c1 card open | Card weight, six rows at most, leader to the breaker, camera unchanged. |
| F6 | Return at 17:30 | Trails, ghosts, "new" dots, and a return card that lists only what the map cannot show. |
| F7 | `kv=unmatched` and `kv=stale` | Dashed amber territory, broken or hatched lease ring, beacon state, pill wording. |
| F8 | Alt held on F3 | Every mark shows its words in place, nothing moves, all text reachable. |

### 7.3 Rubric

Score each direction from 0 to 1 per row, multiply by the weight, and sum to 100. Honesty is also a veto. Any mark without a binding, or any animation with no event behind it, disqualifies the direction until fixed.

| Criterion | Weight | How it is measured |
|---|---|---|
| A chat-UI developer sees the value in 10 seconds | 25 | Show F3 for 10 s, then hide it. Ask five questions: which agent needs you, which two agents will collide and where, which agent is idle, is data leaving the machine, and (after F6 for 10 s) which machines changed while you were away. Judges are two cold models from two labs and the user. Score is correct answers over five, averaged. Also ask "what would you lose going back to chat?" and quote the answers. |
| Scan speed | 15 | Six locate tasks from the static shots, such as "find the order Codex holds without a readback". Count the marks a judge names before the correct answer, and the zoom or hover steps a cold agent takes in the live build. Fewer is better, scored against the best of the three. |
| Honesty | 15, plus veto | `textBind` and `textSeen` pass on every frame (`TEXT.md:57`, `TEXT.md:61`). Every semantic mark has `data-binding`. With the event stream paused, the stage reports zero running animations. Unknown bindings draw the fog hatch. |
| Words on screen | 10 | `textCount` solo totals at rest on F1, F3 and F6. Full score at 50 words or fewer, zero at 136 (`TEXT.md:31`), linear between. Quiet's current range of 89 to 135 is the baseline to beat. |
| Keyboard reach | 10 | Every frame reached from boot by keys alone, with the key count recorded. Every hidden word reachable with one key (Alt, or one card key). Every action works with no mouse. |
| Plant legibility | 10 | From F3, a cold judge names the role of six machines and points to the paypal belt. Plant-to-page contrast of edges is at least 3:1 in both appearances. |
| Canvas quality | 10 | Node identity holds across the F2 sweep. Label visibility toggles during the sweep stay under a set count. Frame time p95 under 16 ms with the twenty-plant stub on the test machine. |
| Look | 5 | No hard-coded colors outside tokens in light (audit grep), contrast 4.5:1 on all text, and a panel judgment of "modern and calm" from the cross-lab critique and the user. |

## 8. What changes in the plan

### 8.1 Changes every direction makes

- **JOURNEY.md.** Section 1 "Two levels, one canvas" (`JOURNEY.md:13`) becomes one plane with semantic zoom and no swap. "Right rail" (`JOURNEY.md:24`) loses the compass, and the minimap becomes an optional Layers row. "Layout" (`JOURNEY.md:26`) and seam row "World coordinates are 1600 x 900" (`JOURNEY.md:105`) are replaced by the camera model in section 4.2. Seam row "Light mode exists only in world" (`JOURNEY.md:100`) takes the kit's neutral tokens instead of the `l-light-mode.md` table, and open question 3 (`JOURNEY.md:209`) is answered as "everything moves to tokens". "Bottom right" (`JOURNEY.md:23`) loses the connection readout to the pill in section 6. Key map (`JOURNEY.md:60-78`) gains `-`, `=`, and Shift F.
- **SHELL.md.** Tokens (`SHELL.md:11-20`) lose `--rail` as a permanent slot. Island fills in light change from vellum (`build.mjs:53`) to `#fbfbfa`. Section 2.1 drops the compass row (`SHELL.md:35`). Section 2.2 drops `#worldMinimap` as persistent (`SHELL.md:53`) and the Kvarm pill becomes the connection pill (`SHELL.md:100`). Section 6 rules 1 and 3 drop `#worldMinimap` and `#compass`. Known violation "decks and inspector stay dark in light" (`SHELL.md:159`) is resolved by tokens. `.fl.bl` becomes one row (`SHELL.md:156`).
- **TEXT.md.** The plant budget of 20 (`TEXT.md:28`) stays, but the counter must skip label text that is hidden until Alt, which it already does for hidden nodes (`TEXT.md:41`). Direction C in the directions table, "Glyph HUD" (`TEXT.md:104`), was rejected for honesty. The encoding system brings it back only for values outside the honesty table, with Alt words for every mark, so that row needs a note. The honesty rule (`TEXT.md:59-85`) stays unchanged.
- **CORE.md.** The visual language line (`CORE.md:38`) changes from brass and graphite glass with Plex Mono readings to the kit tokens and Inter. Brass stays only for clash diamonds and egress threads.

### 8.2 Changes specific to each direction

| Document | A. Transit | B. Instrument | C. Live paper |
|---|---|---|---|
| JOURNEY.md | Overturns "the ui-v1 stage, which is Acquit's real plant" (`JOURNEY.md:13`) and seam row "World Acquit stage art against the ui-v1 stage" (`JOURNEY.md:96`). The plant becomes a schematic, and X "Explode the Acquit stage" (`JOURNEY.md:69`) loses meaning. Beat 9 footprints on V (`JOURNEY.md:44`) become line overlays. | Keeps the plant. Overturns "Bottom right. Zoom, the readout..." (`JOURNEY.md:23`), since the readout moves onto machines. Cards become tables, which changes beat 4 and beat 11 card content (`JOURNEY.md:39`, `JOURNEY.md:46`). | Keeps the plant and beats. Changes beat 14 "The stage dims with no animation" (`JOURNEY.md:49`), since agents keep their event motion while you are away and the stage only stops drawing trails. Beat 15 (`JOURNEY.md:50`) becomes a map-first return with a short card. Beats 5, 7 and 8 keep "focus stays", and their arrivals become bodies moving to machines. |
| SHELL.md | Removes the compass and orbit entirely. Card slot narrows to 320 (`SHELL.md:18`, rule 7 at `SHELL.md:140`). | Keeps a small compass. Card slot stays 392 for tables. | Card slot narrows to 340 (`SHELL.md:18`, `SHELL.md:140`). Orbit moves into the zoom island. Islands lose blur (`build.mjs:103`). |
| TEXT.md | Plant words drop furthest, because station names can be culled by priority. The counter needs no change. | Numbers count as words (`TEXT.md:13`), so B needs either a separate instrument budget or it fails the screen cap. This is a real overturn of the counting rule. | No budget change. Agent flags count as pills (`TEXT.md:17`) only while shown, and they fade at rest. |
| CORE.md | Overturns "Cards that are about a machine are anchored on the plant" in spirit (`CORE.md:34`), since machines become stations. | No further change. | Overturns "The one allowed animation is the existing ink-in moment" (`CORE.md:31`). The new rule is that chrome never animates, and stage marks move only from bound events. "Nothing moves under the user" stays for focus and cards. |

## Open questions

1. Shift F for "fit everything" needs sign-off against the key map in `CORE.md:27` and `JOURNEY.md:60-78`.
2. The four agent hues need a color-vision-deficiency check in the prototype. The kit gives only blue, red and green (`iso-kit.mjs:587`), and red is reserved.
3. Whether agent flags may fade at rest while the honesty table requires evidence words "on each chip of an agent with an Acan session" (`TEXT.md:70`). My reading is that the rule applies while the chip is drawn, and a faded flag with its word one key away under Alt meets "one key away". The user or the text owner should confirm.
4. Where the origin beacon sits when the selected origin is not a plant in the world. I propose the top edge of the focused plant.
5. The twenty-plant stub tests the canvas only. It is not evidence for the A10 renderer budget.
