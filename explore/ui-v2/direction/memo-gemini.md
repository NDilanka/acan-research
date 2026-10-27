# Acan UI v2 design strategy memo

**Consumer and maintainer impact.** An engineer supervising three or more coding agents needs to spot architectural collisions, stalled prompts, and broken invariants in under two seconds without reading chat transcripts, inferred. Right now the UI forces that engineer to read dense prose cards floating over a dim, static diagram, measured in `explore/ui-v2/shots/shell-orders-after.png` and `explore/ui-v2/shots/shell-clash-after.png`. This memo replaces duplicated card prose and static plant thumbnails with a pure-white and carbon-dark infinite canvas where position, motion, shape, and color carry system state at rest. Every origin fact stays one key away, inferred. The next engineer maintaining `explore/ui-v2/` inherits one token sheet derived from `explore/ui-v2/vendor/anatomy/iso-kit.mjs:567-589`, one continuous camera coordinate system across world and plant levels, and one right-hand card slot instead of five incompatible concept layouts, inferred.

---

## 1. Diagnosis

The current redesign fails the visual bar for four concrete reasons, measured.

### 1.1 Broken light mode and dark-pinned surfaces

The anatomy kit already defines a clean, pure-white light theme in `explore/ui-v2/vendor/anatomy/iso-kit.mjs:580-589` with page `#f2f2ef`, card `#fbfbfa`, top face `#ffffff`, left face `#f3f3f0`, right face `#e4e4e0`, and neutral ink `#161616`, measured. Two layers corrupt that palette, measured.

First, `explore/ui-v2/build.mjs:241-247` and `explore/ui-v2/concepts/world.mjs:809-826` override the anatomy kit with warm vellum `#f4f1ea` and muddy beige gradients `#ebe7dc`, measured. Second, `explore/ui-v2/build.mjs:56-57` explicitly pins `.simdeck` and `.insp` to dark charcoal `#121212f0` under `body[data-appearance=light]`, and `explore/ui-v2/SHELL.md:159` codifies that dark pin as a rule, measured. Worse, the individual concept stylesheets hard-code dark backgrounds and light text with no light-mode tokens at all, measured.

- `explore/ui-v2/concepts/orders.mjs:23-24,72` hard-codes `#19160f` on `.orders-mark`, `#161615f7` on `.orders-card`, and `#141311f5` on `.orders-dock`, measured.
- `explore/ui-v2/concepts/clash.mjs:512,519,530,536` hard-codes `#121312` on `#clashToolbar`, `#101211e8` on `#clashAdvisory`, `#171510f0` on `.clash-order`, and `#161715` on `.clash-card`, measured.
- `explore/ui-v2/concepts/gate.mjs:400` hard-codes `#161715` on `.gate-card`, and `explore/ui-v2/concepts/gate.mjs:340` uses `--glass-hi` which `explore/ui-v2/build.mjs:246` only lightens on `.fl`, `.nav`, and `.pop`, leaving `.gate-station` dark in `explore/ui-v2/shots/shell-gate-after-light.png`, measured.
- `explore/ui-v2/concepts/bench.mjs:530,546,549,562,572` hard-codes `#121212f2` on `.bench-pin-label`, `#0f1311f0` on `.bench-zone-label`, `#0f1311f2` on `.bench-plate`, `#171510f2` on `.bench-order`, and `#161715` on `.bench-card`, measured.

The visual result in `explore/ui-v2/shots/shell-orders-after-light.png`, `explore/ui-v2/shots/shell-clash-after-light.png`, `explore/ui-v2/shots/shell-gate-after-light.png`, and `explore/ui-v2/shots/shell-bench-after-light.png` is severe, measured. Huge black rectangles sit like ink stains on top of a yellowed paper background, measured.

### 1.2 Dated brass-and-brown palette and heavy card chrome

The UI relies on a warm antique-brass accent `--focus` set to `#c9a45c` in `explore/ui-v2/build.mjs:8` paired with dark sepia fills `#19160f`, `#15130f`, and `#18140d` across `explore/ui-v2/concepts/orders.mjs:23`, `explore/ui-v2/concepts/clash.mjs:521-523`, and `explore/ui-v2/concepts/bench.mjs:575`, measured. Every floating container applies heavy glass blur of `16px` to `18px` and deep drop shadows of `32px` at `45%` black opacity in `explore/ui-v2/build.mjs:49,175` and `explore/ui-v2/concepts/gate.mjs:340`, measured. Instead of reading like a sharp engineering instrument, this combination of sepia, gold borders, and heavy shadow reads like a 2018 strategy-game menu, inferred.

### 1.3 Competing boxes that suffocate the plant canvas

`explore/ui-v2/SHELL.md:60-66` defines a single 392px right card slot, but `explore/ui-v2/SHELL.md:152` admits that none of the four core concepts use it, measured. Multiple wide cards mount at the same time and cover the isometric plant, measured.

- In `explore/ui-v2/shots/shell-orders-after.png`, ten separate UI boxes appear simultaneously, measured. They are `.fl.tl`, `.fl.tc`, `.fl.tr`, `.hint`, `#cbar` at `explore/ui-v2/build.mjs:25`, `#nav` at `explore/ui-v2/build.mjs:30`, `.orders-guide` at `288px` wide in `explore/ui-v2/concepts/orders.mjs:14`, `.fl.bl` at `168px` tall in `explore/ui-v2/SHELL.md:36`, `#rpdeck` at `580px` wide in `explore/ui-v2/build.mjs:103`, and `.fl.br` at `570px` wide in `explore/ui-v2/SHELL.md:37`, measured.
- In `explore/ui-v2/shots/shell-clash-after.png`, `.clash-card` is `560px` wide at `explore/ui-v2/concepts/clash.mjs:536` while `.clash-order` is `318px` wide at `explore/ui-v2/concepts/clash.mjs:530`, `#clashToolbar` sits at top-left in `explore/ui-v2/concepts/clash.mjs:512`, `#clashAdvisory` sits at `bottom` `235px` in `explore/ui-v2/concepts/clash.mjs:519`, and `.fl.bl` occupies the bottom-left corner, measured. Over half the viewport is covered by opaque dark boxes, measured.
- In `explore/ui-v2/shots/shell-bench-after.png`, `.bench-card` takes `466px` on the left in `explore/ui-v2/concepts/bench.mjs:572`, `.bench-order` takes `300px` on the bottom-right in `explore/ui-v2/concepts/bench.mjs:562`, `.fl.bl` takes `168px` height at bottom-left, a toast sits at bottom-center, and seven dark pin and plate boxes cover the center of the plant, measured.
- In `explore/ui-v2/shots/orders-kv-unmatched.png`, which the user singled out as cleanest, `#cbar` and `#rpdeck` are hidden and the central plant is visible, measured. Even there, `.orders-dock` at `340px` wide in `explore/ui-v2/concepts/orders.mjs:72` and `.orders-card` at `470px` wide in `explore/ui-v2/concepts/orders.mjs:14` sit open together and duplicate the order header, readback rows, and Kvarm log, measured.

### 1.4 Low-contrast machines buried under high-contrast text chips

On the dark canvas, `explore/ui-v2/build.mjs:4,230` sets the background to `#0c0c0c`, machine top faces to `#141414`, side faces to `#101010`, and wireframe lines to `#3a3a3a`, measured. Machine faces have a luminance contrast of roughly 1.15 to 1 against the floor, while floating `.chip` labels in `explore/ui-v2/build.mjs:73-85` use high-contrast borders, bright monospace badges, and white text, measured. In `explore/ui-v2/shots/shell-gate-after.png` and `explore/ui-v2/shots/shell-world-after.png`, the machines disappear into the floor and the screen reads as a cloud of rectangular text tags, inferred.

### 1.5 Count of places where text does the job of visual channels

Fourteen distinct places in the current codebase use text strings where position, shape, color, motion, or size would communicate faster, measured.

1. **Machine health chips.** In `explore/ui-v2/build.mjs:73-85,356`, floating `.chip` boxes print `PAYPAL 2.3% err` and `RETRY loop 3/3` in words instead of showing red packet drops on the PayPal belt and three lit concentric rings on the retry machine, measured.
2. **Territory floor banners.** In `explore/ui-v2/concepts/clash.mjs:248,255` and `explore/ui-v2/concepts/bench.mjs:99`, floor labels print `PAYPAL-PAYOUTS · CLAIMED · CLAUDE CODE` in all-caps text instead of tinting the territory perimeter with the claiming agent's hue and a corner lock glyph, measured.
3. **Witness canvas pills.** In `explore/ui-v2/concepts/orders.mjs:803-825` and `explore/ui-v2/concepts/bench.mjs:380,530`, each witness renders a wide text box `W1 · MUST NOT · 15:44` with `[A1][A2][A3]` text cells on the stage instead of a 14px polarity pin paired with three 4px lamp dots, measured.
4. **Bench rig floating plates.** In `explore/ui-v2/concepts/bench.mjs:344-364,549`, three HTML `.bench-plate` boxes float above the bench rigs printing `A1 · Retry with jitter`, `Claude Code`, `no evidence yet`, and `w1 w2 w3` even though `ASSETS.benchRig` in `explore/ui-v2/concepts/bench.mjs:79` already draws three physical isometric lamps on each rig plinth, measured.
5. **On-canvas order plates.** In `explore/ui-v2/concepts/clash.mjs:266,530` and `explore/ui-v2/concepts/bench.mjs:390,562`, a 300px to 318px card stays permanently on the canvas to repeat the order sentence, witness checkmarks, and budget string, measured.
6. **Clash resolution floor notes.** In `explore/ui-v2/concepts/clash.mjs:343,348`, settling a clash draws SVG text strings `Claude Code · replanning` and `after · pin waits for upstream revision` across the floor instead of showing a directional gate valve on the belt or a parked state on the agent drone, measured.
7. **Footprint write badges.** In `explore/ui-v2/concepts/clash.mjs:331,357-375`, pressing `V` scatters `.clash-foot-label` text boxes with leader lines such as `paypal · Claude Code · declared · kvarm intent` across the canvas instead of illuminating touched machine roofs with solid declared or dashed historical agent-colored outlines, measured.
8. **World overview plant stacks.** In `explore/ui-v2/concepts/world.mjs:209-217` and `explore/ui-v2/shots/shell-world-overview-after.png`, each of the five plants renders an inert grey thumbnail accompanied by four stacked lines of text such as `01 acquit`, `✕ 1 blocks publication +2`, `prod + local · [41] OTLP stale · 41 s`, and `✕ Review #184 blocks publication` instead of lighting the internal machines inside the thumbnail, measured.
9. **World cross-plant contract labels.** In `explore/ui-v2/concepts/world.mjs:750,837`, dashed lines between plants carry long text strings such as `payment + payout events`, `work orders · leases · choices`, and `span + metric export` instead of animated directional belt packets and port icons, measured.
10. **World plant-level static boxes.** In `explore/ui-v2/concepts/world.mjs:290-335` and `explore/ui-v2/shots/shell-world-after.png`, zooming into Acquit from World shows six grey boxes with wide text pills such as `acquit-api p99 184 ms · 41 s` and a footer reading `PLANT · read only · no activity animation`, replacing live spatial telemetry with text disclaimers, measured.
11. **Readback prose blocks.** In `explore/ui-v2/concepts/orders.mjs:295-314`, agent readbacks render multi-line prose paragraphs and text score lists `w1 pass w2 pass p-2307 pending` in both the dock and the card instead of a 3-cell lamp matrix on the agent drone and a fork beacon on `sqlite`, measured.
12. **Duplicated inline Kvarm logs.** In `explore/ui-v2/concepts/orders.mjs:166,507`, `explore/ui-v2/concepts/clash.mjs:266`, `explore/ui-v2/concepts/gate.mjs:88`, and `explore/ui-v2/concepts/bench.mjs:305`, every concept embeds a 2-to-4 row monospace RPC log with `create_issue`, `set_task_phase`, and `claim_task` inside its own card or dock while `.egress` in `.fl.tr` already tracks outbound bytes, measured.
13. **Permanent bottom-left agent roster.** In `explore/ui-v2/build.mjs:318-322` and `explore/ui-v2/SHELL.md:36`, a 168px-tall `.fl.bl` box permanently lists agent names and text statuses such as `Droid verifying otel radar 38m` and `Codex blocked on you 9m` that duplicate the agent drones on the map, measured.
14. **Gate queue disconnection.** In `explore/ui-v2/concepts/gate.mjs:56-98` and `explore/ui-v2/shots/shell-gate-after.png`, the 400px left station lists eight review items in text while the machines those items block, namely `breaker`, `retry`, `sqlite`, and `verifier`, display no review badges or hold rings on the plant, measured.

---

## 2. The value case

A developer switching from Claude Code, Cursor, or Codex chat transcripts must see value on the live map in under ten seconds, inferred from `explore/ui-v2/direction/BRIEF-memo.md:7`. Below are nine concrete moments in a multi-agent session where the spatial map beats a chat transcript, ranked from strongest switch-seller to ninth, inferred.

### Rank 1. Two agents converging on the same belt or table before code is written

- **What the developer sees in under 2 seconds.** Two colored footprint outlines, cobalt for Claude Code on `retry` and viridian for Droid on `breaker`, overlap on the belt from `api` to `paypal` and ignite a pulsing vermilion clash diamond `◇` on that exact belt segment, inferred.
- **Visual channel.** Spatial intersection of two agent territory halos on a shared edge, paired with a high-contrast geometric clash beacon, inferred.
- **Chat-UI equivalent replaced.** Reading two separate 80-line agent plan transcripts in different terminal tabs and mentally cross-referencing which service contracts and database tables both plans touch, inferred.

### Rank 2. Live blast radius and downstream backpressure of an agent's change

- **What the developer sees in under 2 seconds.** When an agent edits `retry`, animated flow particles between `api`, `retry`, `paypal`, and `sqlite` immediately show which downstream belts speed up, stall, or drop red error sparks during replay or simulation, inferred.
- **Visual channel.** Belt particle velocity, density pile-up at machine inputs, and downstream halo propagation along connected edges, inferred.
- **Chat-UI equivalent replaced.** Grepping imports across the repo and reading static `git diff --stat` file lists that hide runtime coupling between services, inferred.

### Rank 3. Readback disagreement pinned to the exact machine where interpretations fork

- **What the developer sees in under 2 seconds.** Two agent drones hover at the `paypal-payouts` border with two green dots and one amber dot on their 3-dot readback badges, while a bright amber fork pin `⑂` pulses directly on top of the `sqlite` machine, inferred.
- **Visual channel.** Small-multiple 3-dot matrix on each agent drone paired with a spatial tether line pointing to the exact entity `sqlite` where the two interpretations diverge, inferred.
- **Chat-UI equivalent replaced.** Prompting two agents to explain their understanding of edge cases and comparing paragraphs of prose to discover they disagree on whether a lost response leaves a row `pending` or `failed`, inferred.

### Rank 4. Parallel bench arena where three competing designs run against locked witnesses

- **What the developer sees in under 2 seconds.** Three miniature isometric test rigs `A1`, `A2`, and `A3` sit side by side in the bench zone, inferred. As replay runs, `A2` flips its third witness lamp red and dims, `A3` hits 100% on its plinth budget bar and flashes amber, and `A1` lights all three lamps solid green, inferred.
- **Visual channel.** Tufte small multiples of identical rig geometry, 3-lamp status arrays in green, red, and striped amber, and a linear fuel-gauge bar on the plinth edge, inferred.
- **Chat-UI equivalent replaced.** Switching between three git worktrees, running test suites in three terminals, and reading scrolling test logs to figure out which branch broke which invariant, inferred.

### Rank 5. An agent blocked on you versus an agent working steadily versus an unmatched rogue agent

- **What the developer sees in under 2 seconds.** At `paypal`, the `Codex` drone pulses amber with a tether to a permission badge, or sits outside the territory fence with a dashed grey ring and `?` bezel when holding an unmatched lease, while `Droid` orbits `otel-radar` with a steady green work ring, inferred.
- **Visual channel.** Drone motion state contrasting steady orbit, parked pulse, and fenced-out exterior position, combined with solid authenticated versus dashed unmatched border strokes, inferred.
- **Chat-UI equivalent replaced.** Cycling through five terminal windows or IDE tabs to check which agent is silently waiting at a tool permission prompt and which agent started editing files without reading the spec, inferred.

### Rank 6. Pinning a real failure moment from replay as a locked witness without writing a spec paragraph

- **What the developer sees in under 2 seconds.** Scrubbing the timeline to `15:44` shows the `retry` machine glowing red with three loop rings lit, inferred. Pressing `M` drops a red `⊘ w1` witness pin directly onto `retry` and locks that exact state into the work order, inferred.
- **Visual channel.** Direct manipulation of a temporal state on a spatial machine, leaving a persistent red `⊘` or green `●` physical pin on the machine roof, inferred.
- **Chat-UI equivalent replaced.** Copying stack traces, log timestamps, and metric values out of Datadog or a terminal and pasting a three-paragraph bug description into a chat prompt, inferred.

### Rank 7. What changed while you were away for 30 minutes

- **What the developer sees in under 2 seconds.** Returning at `17:30` illuminates only the three machines that changed state between `17:00` and `17:30` with a time-delta halo, while untouched territories remain calm and a 15-second timelapse scrub replays the sequence of claims, CI passes, and new blockers on the floor, inferred.
- **Visual channel.** Differential luminance where changed machines glow and unchanged machines dim, paired with accelerated spatial replay along the timeline bar, inferred.
- **Chat-UI equivalent replaced.** Scrolling back through hundreds of lines of interleaved tool calls and chat messages across four agent sessions to reconstruct what happened while you stepped out, inferred.

### Rank 8. Stale lease or dead agent holding up a territory

- **What the developer sees in under 2 seconds.** The `Claude Code` drone on `paypal-payouts` loses its color fill and turns hollow grey, while the territory fence switches from a solid line to a decaying dashed outline with an expired-clock ring, inferred.
- **Visual channel.** Desaturation of the hollow grey drone silhouette and territory border decay from solid stroke to dashed stale stroke, inferred.
- **Chat-UI equivalent replaced.** Wondering why a task has not progressed for ten minutes, only to discover in a background terminal that the CLI process hit a network timeout or expired its coordination lease, inferred.

### Rank 9. Cross-plant contract breakage across repositories in World view

- **What the developer sees in under 2 seconds.** Zoomed out to the World plane, the belt connecting `Acquit` to `Kvarm` turns amber with a red gate bar at `Kvarm`, showing immediately that a change in `Acquit` is blocked from publication by review rule `#184` in `Kvarm`, inferred.
- **Visual channel.** Inter-plant artery color and a physical gate-bar glyph across the cross-repo belt, inferred.
- **Chat-UI equivalent replaced.** Discovering only after `git push` or in a separate GitHub pull request tab that a cross-repo schema or review policy blocks deployment, inferred.

---

## 3. Encoding system

The map replaces prose with a strict visual grammar, inferred. Every mark on the canvas obeys two rules from `explore/ui-v2/TEXT.md:7-9,59-85`, measured. At rest the map shows state, actor, and bound number with minimal words, and holding `Alt` reveals the full sentence explanation and origin provenance binding `[data-binding]`, measured.

### 3.1 Core visual primitives on the plant

| Domain object | Visual encoding at rest in 0 to 3 words | Visual channel | Under `Alt` or selection |
|---|---|---|---|
| **Machine or store** | Crisp isometric solid with `#ffffff` top face in light and `#1e1e22` in dark. A 2-character mono stamp etched on the roof such as `PP`, `RT`, `SQ`, `OT`, `VF` plus a 32px roof sparkline or bar for its primary metric. | Position, 3D volume, roof micro-gauge | Full service name, exact metric string `4.1% err · p99 184ms`, freshness age `41s`, and source locator. |
| **Belt or contract** | Isometric track with moving directional chevrons or packets. Speed encodes throughput in rps, packet spacing encodes queue depth, red sparks encode error rate above budget, and a gate bar across the track encodes a blocked contract. | Motion speed, density, color | Contract name `payment + payout events`, schema version `paypal.result v1`, rps, and error numbers. |
| **Agent drone** | Distinct geometric drone per agent family with cobalt circle `#2563eb` for Claude Code, viridian hex `#0d9488` for Droid, and ochre square `#d97706` for Codex, stamped with a 2-letter mono cap `CC`, `DR`, or `CX`. | Shape, hue, and spatial anchor | Full agent name, session ID `claude-payouts`, principal auth class `authenticated` versus `declared`, and lease generation `g1`. |
| **Order and claim** | Territory floor perimeter drawn as a 1.5px fence. Unclaimed is neutral dashed grey, open order has pulsing accent corner posts, and claimed has a solid fence in the claiming agent's color plus a corner lock glyph and 3-word header `CLAIMED · CC · g1`. | Enclosure boundary, stroke style, color | Full order sentence, sheet revision `3f2a91c`, lease countdown timer `4:12`, and Kvarm task locator `t-41`. |
| **Unmatched lease** | Territory interior stays fogged with a hatched pattern while the rogue agent drone sits outside the fence gate with a dashed amber ring and `?` bezel reading `UNMATCHED · Codex · g1`. | Spatial exclusion, hatch fog, `?` glyph | Explanation that `Codex` claimed `t-41` in Kvarm without an Acan readback match. |
| **Witness pin** | A 16px physical pin planted into the machine roof using a red circle-slash `⊘` for `must-not` or a green solid dot `●` for `must-keep`, plus `w1` or `w2` tag and zero sentence pills on the canvas. | Shape polarity `⊘` versus `●`, color, roof pin | Witness timestamp `15:44`, observed metric `loop depth 3 of 3`, and locked check clause. |
| **Readback score** | A 3-dot micro-matrix `[●][●][?]` attached directly to each competing agent drone badge, colored green for pass, red for fail, and amber for differs or pending. | Tufte small-multiple dot array on the actor | Full readback interpretation paragraph with conflicting phrase highlighted in `<mark>` and `READBACK · ACAN` source tag. |
| **Readback fork** | Pulsing amber fork glyph `⑂` planted on the contested entity `sqlite` with a thin dashed tether to the two disagreeing agent drones. | Fork glyph and tether lines between actors and entity | Question card with the two one-key choices `Shift 1` and `Shift 2` and their readback consequences. |
| **Clash before code** | Two colored footprint wireframes using solid stroke for declared order and dashed stroke for proposal or history, intersecting on a belt or machine and crowned by a diamond clash pin `◇ c1`. | Overlapping wireframe footprints and `◇` beacon | Clash settlement card with `Split at port`, `Retry wins`, `Breaker wins`, `Serialize`, and `Bench it`. |
| **Egress and Kvarm** | Top-right island pill `.egress` showing a live status dot in green for synced or amber for held and offline, origin short name, and byte counter `local + kvarm · 1,336 B`. | Corner pill, dot color, byte counter | Full network ledger drawer in the right card slot showing held writes, RPC rows, and decisions. |
| **Time and replay** | Compact bottom scrub bar when in Replay or Returning from Away. Machines that changed during the window carry a bright rim highlight while unchanged machines sit at 45% opacity. | Temporal scrub and differential opacity | Exact event timestamps, commit SHAs, and per-event replay jump buttons. |

### 3.2 Deliberate borrowings and what each buys

1. **Factorio alt-mode and belt physics.** Factorio never prints paragraphs on assembling machines, inferred from `explore/research/agentic-ux/b-games-softvis.md`. Normal view shows physical flow and machine animation, while pressing `Alt` overlays crisp icons for recipes and inventories, inferred. Borrowing Factorio's belt density where packets bunch up behind a slow machine and `Alt` overlay discipline buys instant bottleneck recognition at rest and zero-clutter inspection on demand, inferred.
2. **Mini Metro line identity and overcrowding rings.** Mini Metro represents complex transit networks with pure geometric station shapes, distinct line colors, and radial timer rings that fill up when a station is overloaded, inferred. Borrowing radial pressure rings around machines waiting on human review buys a zero-text urgency indicator directly on the affected service, inferred.
3. **Airbus and Garmin G1000 dark-cockpit discipline.** Modern flight decks keep healthy instruments monochrome grey or white so that any amber caution or red failure mark captures peripheral vision in under 200ms, inferred. Borrowing dark-cockpit color discipline fixes the current brass-everywhere clutter where `#c9a45c` appears on borders, icons, pins, headers, and buttons in `explore/ui-v2/concepts/orders.mjs:23-26`, inferred.
4. **Tufte small multiples and sparklines.** Instead of printing `15 rps · p99 184 ms · 0.6% err` as a string or rendering a 9-cell HTML text table for bench attempts, etching a 32x10px sparkline on a machine roof and repeating identical 3-lamp isometric rigs on the bench lets the eye compare three attempts in a single fixation, inferred.
5. **Bret Victor linked direct manipulation.** Scrubbing the replay timeline or hovering a witness clause immediately highlights the exact machine state and belt packet at `15:44` on the canvas, eliminating the mental translation between a specification rule and runtime behavior, inferred.
6. **Figma multiplayer cursors and presence tags.** Agent drones and teammate presence indicators use Figma's compact color-coded pill `CC`, `DR`, or `Sam` anchored to the exact coordinate they are inspecting or editing, making multi-agent and multiplayer activity legible without a dedicated sidebar roster, inferred.
7. **Linear restraint in hairline borders and typography.** Replacing heavy `16px` blurs, thick brass borders, and multi-font sizes with `1px` neutral borders `#dfdfd8` in pure white and `#2a2a30` in dark, subtle 2px elevation surfaces, and strict `11px` mono and `13px` sans typography makes cards feel weightless and modern, inferred.

### 3.3 Honesty rule enforcement

Every visual mark on the canvas still satisfies `explore/ui-v2/TEXT.md:59-85`, measured.

- The six mandatory at-rest facts remain visible in text at all times, namely outbound byte count `local + kvarm · 1,336 B out`, order state and holder `CLAIMED · Claude Code · g1`, readback scorer `READBACK · ACAN`, agent evidence class `authenticated` versus `declared`, lease holder row when unmatched, and the next blocking action in `.hint`, measured.
- Every number or status badge on a machine, drone, or card carries `[data-binding]` so holding `Alt` opens the provenance popover with `Channel`, `Value · state`, `Source`, `Locator`, `Revision`, `Freshness`, and `Meaning`, matching `explore/ui-v2/concepts/clash.mjs:123-149`, measured.

---

## 4. Infinite canvas model for world

### 4.1 Limits of the current `1600x900` implementation in `concepts/world.mjs`

The current World concept is not an infinite canvas, measured. It is a fixed-aspect slide deck that swaps DOM nodes, measured in `explore/ui-v2/concepts/world.mjs`.

1. **Hard-coded `1600x900` and `1100x620` boxes.** `explore/ui-v2/concepts/world.mjs:57` defines `WORLD` as `1600` by `900` and `STAGE` as `1100` by `620`, and `explore/ui-v2/concepts/world.mjs:829,878,1026-1027` hard-code `viewBox="0 0 1600 900"` on `#worldRoutes` and `viewBox="0 0 1100 620"` on `#worldCut`, measured.
2. **Auto-fit camera that locks out user panning.** `worldTransform` in `explore/ui-v2/concepts/world.mjs:200-208` forces the five plant coordinates to fit inside `freeRect` and resets `state.pan.x` and `state.pan.y` to `0` whenever a right-hand card or left-hand queue is open or `state.level` is not `"world"`, measured. Furthermore, pointer panning in `explore/ui-v2/concepts/world.mjs:739` aborts immediately if `state.level` is not `"world"` or if `column` is truthy, meaning a developer cannot pan the map while inspecting a card or looking at a plant, measured.
3. **Discrete DOM swaps instead of continuous zoom.** `onWheel` in `explore/ui-v2/concepts/world.mjs:716-736` accumulates wheel delta until `wheel.sum` exceeds `110` and then calls `focusPlant`, `enterMachine`, or `toggleCutaway`, which hides `#worldViewport` at `explore/ui-v2/concepts/world.mjs:222` and unhides `#worldStage` at `explore/ui-v2/concepts/world.mjs:280`, measured. In `explore/ui-v2/JOURNEY.md:12`, focusing Acquit performs another hard swap from `#worldViewport` to the `ui-v1` `#stage`, measured.
4. **Dead static thumbnails at world level.** `explore/ui-v2/concepts/world.mjs:62` pre-renders each plant thumbnail once at boot with every entity state forced to `"stale"`, so every machine inside every plant on the world overview is permanently grey and dead, measured.

### 4.2 Unbounded world plane and continuous camera model

Replace the multi-stage swap with one unbounded 2D world plane projected isometrically via `iso-kit.mjs`, governed by a single camera state `{ x, y, zoom, tilt }` where `zoom` is continuous from `0.08` to `4.0`, inferred.

- **Coordinate space.** The world plane has no outer width or height clamp, inferred. Each plant has a world origin and local entity coordinates that transform directly into world space, inferred. Cross-plant contracts are belts connecting port coordinates between plants on the same plane, inferred.
- **Viewport culling.** A spatial bounding-box check per plant and entity against the camera frustum skips DOM and SVG updates for off-screen plants and entities, keeping frame times under 4ms even with 50 plants and 500 machines, guess.

### 4.3 Five semantic zoom levels

As the user pans and zooms continuously with wheel or trackpad pinch, elements cross semantic zoom thresholds smoothly with a 5% hysteresis band to prevent boundary flicker, inferred.

| Level | Zoom range | What renders | What hides |
|---|---|---|---|
| **Z0 Org** | `0.08` to `0.22` | Plant plinth silhouettes, inter-plant contract arteries colored by health, plant title plus 1-badge blocker count `Acquit · ◇2`, and constant-screen-size agent and alert beacons. | Individual machines, internal belts, territory fences, witness pins, machine labels. |
| **Z1 Site** | `0.22` to `0.55` | Live miniature machines inside each plant plinth showing real-time state colors such as red on `paypal` and `retry` and amber on `sqlite`, animated inter-plant contract belts, agent drones orbiting their active plant, and plant header bar `02 Acquit · CLAIMED · CC`. | Internal machine text labels, witness pin stems, footprint wireframes, roof sparklines. |
| **Z2 Plant** | `0.55` to `1.35` | Full isometric machines from `iso-kit.mjs`, animated internal belts, territory fences and 3-word claim headers, witness pins `⊘ w1` and `● w2`, clash diamonds `◇ c1`, agent drones with 3-dot readback matrices, and bench rigs. | Distant plants outside the frustum and internal code module layers. |
| **Z3 Machine** | `1.35` to `2.40` | Machine roof micro-gauges including 32px error and latency sparklines, retry loop rings, and sqlite queue depth bars, port contract fittings `paypal.result v1`, witness clauses on hover, and declared write file counts on machine faces. | Unrelated territory headers and distant plant contract labels. |
| **Z4 Cutaway** | `2.40` to `4.00` or `X` key | Exploded vertical cutaway of the focused machine showing internal code layers and files such as `payouts/retry.ts` and `db/migrations/042.sql`, exact agent write footprints per file, and pinned witness assertions. | Exterior machine shell roof, which fades to a 15% ghost wireframe. |

### 4.4 Label collision and keeping agents and activity visible when zoomed out

- **Constant screen-space beacons for agents and blockers.** Agent drones, blocking clash diamonds `◇`, and unanswered question forks `⑂` scale inversely with zoom clamped to a minimum screen size of `16px`, inferred. When zoomed out to Z0 or Z1, if three agents and two clashes are active inside `Acquit`, they cluster cleanly into a live dock row on `Acquit`'s plinth corner reading `[CC][DR][CX] · ◇2 · ⑂1` rather than shrinking into sub-pixel noise or overlapping into a blob, inferred.
- **Deterministic screen-space label collision.** Only entities at Z2 and above request screen-space pills, and even then only for non-healthy or active states, inferred. A screen-space occupancy grid with `16px` cells places labels in strict priority order from blocking clash `◇`, to open question `⑂`, to active agent drone, to selected or hovered machine, to claimed territory header, to healthy machine stamp, inferred. Lower-priority pills that collide with an occupied cell or a shell island `.fl` hide their text label and leave only their geometric pin on the machine roof, inferred.

### 4.5 Navigation and how the island shell sits over the infinite canvas

- **Direct pan and zoom everywhere.** Pointer drag or two-finger trackpad scroll pans the plane at every zoom level, whether a card is open or closed, inferred. Wheel or pinch zooms smoothly around the cursor position so the world point under the cursor stays fixed, inferred.
- **Keyboard reach.** `WASD` or arrow keys pan the plane, inferred. `+` and `-` zoom smoothly, `F` frames the current plant or selection inside the unobstructed `freeRect`, and `Shift F` frames all plants with active agents or blockers, inferred. `Alt 1` through `Alt 9` fly smoothly in under 220ms to plants 1 through 9, `Alt Left` and `Alt Right` traverse the camera history stack, and `Ctrl K` opens the unified `Go to` palette to jump to any plant, machine, agent, witness, or clash, inferred.
- **No minimap, replaced by edge beacons.** On a true infinite canvas, zooming out with `Shift F` or pinch-out is the overview map, inferred. Dropping `#worldMinimap` at `184x139px` in `explore/ui-v2/SHELL.md:53` frees the top-right rail slot `[data-nav-slot]` and eliminates a redundant box, inferred. When zoomed into Z2 or Z3, any off-screen plant or machine that spawns a new blocking clash or question projects a compact directional pill on the edge of the `freeRect` reading `Kvarm · #184 blocks`, and clicking or pressing `I` flies the camera there, inferred.
- **Shell overlay relationship.** The persistent islands in `explore/ui-v2/SHELL.md:28-37` float above the full-bleed stage plane, inferred. Opening a card in the right slot at `392px` width computes `freeRect` and nudges the camera target `goal.x` only if the inspected machine currently lies underneath the newly opened card, never locking out subsequent user panning, inferred.

---

## 5. Three competing visual directions

All three directions obey the hard rules in `explore/ui-v2/PARKED.md:16-26` with one floating-island shell, the honesty rule with `Alt` reveal, pure white `#f2f2ef`, `#fbfbfa`, and `#ffffff` from `explore/ui-v2/vendor/anatomy/iso-kit.mjs:580-589` in light mode, and dark mode parity, measured. They differ fundamentally in how the map and cards represent state, inferred.

### Direction 1. Swiss Cartographic

**Thesis.** Treat the software plant like an architectural model built by Dieter Rams and annotated by Edward Tufte, inferred. Strip all game-like brass, sepia, drop shadows, and floating black text chips, and render the isometric machines as crisp matte architectural solids with `#ffffff` faces on `#f2f2ef` stone in light and `#1e1e22` faces on `#0c0c0e` carbon in dark, where health, throughput, and agent ownership are etched directly onto machine roofs and territory borders as high-precision micro-graphics, inferred.

- **Typography.** Inter or system sans at `12px` and `13px` with medium weight for headers and actions, paired with JetBrains Mono or monospace at `10.5px` and `11px` with `tabular-nums` for metrics, timestamps, and keycaps, inferred. Zero all-caps sentence banners appear on the floor, inferred.
- **Pure white palette.** Adopted directly from `explore/ui-v2/vendor/anatomy/iso-kit.mjs:580-589` with page `#f2f2ef`, island and card `#fbfbfa` at `88%` opacity with `10px` blur, machine top `#ffffff`, left face `#f3f3f0`, right face `#e4e4e0`, stroke `#222220` at `0.9px`, subtle shadow `2px 8px` at `6%` black, and border `1px solid #dfdfd8`, measured.
- **Dark palette.** Tuned from `explore/ui-v2/vendor/anatomy/iso-kit.mjs:567-578` for machine contrast with page `#0c0c0e`, island and card `#141417e0`, machine top `#1e1e22`, left face `#17171a`, right face `#121215`, stroke `#484852` at `0.9px`, and border `1px solid #2a2a30`, inferred. Raising dark machine top faces from `#141414` in `explore/ui-v2/build.mjs:230` to `#1e1e22` and strokes to `#484852` makes the 3D geometry pop against `#0c0c0e` without floating chips, inferred.
- **Semantic ink.** Healthy and normal geometry stays achromatic in both light and dark, inferred. Color means something happened, with cobalt `#2563eb` and `#60a5fa` for Claude Code, viridian `#0d9488` and `#2dd4bf` for Droid, ochre `#d97706` and `#fbbf24` for Codex, vermilion `#dc2626` and `#f87171` for blocking clashes, must-not witnesses, and errors, amber `#d97706` and `#f59e0b` for waiting on you and open questions, and emerald `#059669` and `#34d399` for verified must-keep witnesses, inferred.
- **Card weight and chrome.** Only one 392px right-slot card can be open at a time, while `.orders-dock` and on-canvas `.clash-order` and `.bench-order` plates are deleted and replaced by a 1-line summary in the territory floor header, inferred. `.fl.bl` shrinks from `168px` tall in `explore/ui-v2/SHELL.md:36` to a single `40px` pill reading `Waiting on you 2 · 3 agents`, inferred.
- **Landing value moment 1, clash before code.** Two crisp colored wireframe footprints in solid `#2563eb` and solid `#0d9488` overlap on the belt from `api` to `paypal`, crowned by a vermilion `◇ c1` pin while the rest of the plant stays calm monochrome white or carbon so the eye hits the collision in under 0.5 seconds, inferred.
- **Landing value moment 2, blast radius.** Belts carry clean geometric chevrons whose spacing tightens and turns vermilion along `api` to `retry` to `paypal` when the error rate crosses the 2% budget line etched on the `paypal` roof sparkline, inferred.
- **Landing value moment 3, readback fork.** Agent drones sit at the territory gate with `[●][●][?]` micro-dots, while a thin amber vector arc connects both drones to the `⑂` pin on `sqlite`, inferred.
- **Infinite canvas handling.** Uses a subtle cartographic graticule with a `64px` major grid and `16px` minor grid fading out smoothly across Z0 to Z4, inferred. At Z1, plant plinths look like architectural site models with live colored machine roofs and crisp inter-site vector arteries, inferred.
- **Main risk.** If roof sparklines and etched stamps are drawn too small, they can become hard to read at `1280x800` without zooming in to Z3, so this direction requires a strict minimum glyph size of `12px` in screen space on machine roofs, guess.

### Direction 2. Quiet Cockpit

**Thesis.** Borrow the uncompromising signal-to-noise discipline of a modern Airbus primary flight display and Garmin G1000 glass cockpit, inferred. Eliminate every floating HTML badge, leader line, and pop-up pin over the isometric stage, render all telemetry as high-contrast vector instruments projected directly into the isometric floor plane, and consolidate all text interaction into a structured right-hand flight-strip rack, inferred.

- **Typography.** Uses 100% monospace at `11px` and `13px` tabular across all canvas callouts and flight strips for instant columnar scanning, inferred.
- **Pure white and dark palettes.** In pure white, uses a high-contrast technical drawing look with `#ffffff` machine faces, `#111111` `1.2px` outlines on `#f2f2ef` paper, and zero gradients, inferred. In dark, uses a true OLED cockpit look with `#08090c` background, `#13161c` machine faces, and `#525b6c` crisp vector edges, inferred.
- **Color use.** Enforces a strict aviation alert hierarchy with cyan `#06b6d4` for active agent claims and data flow, amber `#f59e0b` for caution and human action required, magenta `#ec4899` for pinned witnesses and targets, and red `#ef4444` for blocking clashes and contract breaches, inferred.
- **Card weight and chrome.** Instead of free-floating cards with leader lines, the right slot at `392px` wide acts as a vertical stack of collapsible flight strips for Order, Active Clash, Queue, and Kvarm with `1px` crisp borders and zero blur or shadow, inferred.
- **Landing value moment 1, clash before code.** The belt from `api` to `paypal` renders an aviation-style red crosshatch conflict zone directly on the track with a flashing `C1` vector callout box locked to the isometric grid, inferred.
- **Landing value moment 2, blast radius.** Each machine displays a vertical tape gauge along its front isometric face showing load percentage and error threshold ticks, inferred.
- **Landing value moment 3, readback fork.** The right-hand flight strip displays a compact 3-column truth table `W1 | W2 | Q1` aligned with cyan and amber vector beams pointing to `sqlite`, inferred.
- **Infinite canvas handling.** Uses radar-style vector level-of-detail where zooming out to Z0 and Z1 collapses plants into crisp geometric sector polygons with vector heading lines for inter-plant contracts and alphanumeric data blocks `ACQ / FL02 / C1`, inferred.
- **Main risk.** Stripping all floating HTML pins in favor of isometric-projected SVG text and a right-hand flight-strip rack makes the UI feel austere and clinical, and isometric-skewed text on the floor is harder to read at a 30-degree tilt than screen-aligned badges, guess.

### Direction 3. Living Factorio

**Thesis.** Lean all the way into the spatial simulation metaphor where software behavior is visible as physical mechanics on the factory floor, inferred. Machines visibly cycle, belts carry discrete typed payload tokens that pile up or spark on failure, retry loops spin physical rings, and agents move along overhead rails between the services they inspect and modify, inferred.

- **Typography.** Uses geometric sans at `12.5px` for labels and condensed mono at `10.5px` for counters, inferred.
- **Pure white and dark palettes.** In pure white, uses a bright industrial laboratory look with `#f2f2ef` floor, subtle recessed conveyor trenches `#e6e6e1`, and `#ffffff` machines with soft ambient shading and colored status LEDs, inferred. In dark, uses a richly lit night-shift plant with `#0e1013` floor and `#1a1d24` machines with glowing status lamps and illuminated belt tracks, inferred.
- **Color use.** Uses material coding where database machines like `sqlite` carry slate-blue storage drums, external APIs like `paypal` carry coral gateway arches, retry loops carry kinetic copper coils, and agent drones project a soft colored spotlight cone onto the machine they are actively reading or editing, inferred.
- **Card weight and chrome.** Uses compact HUD islands with `8px` radius, while selecting a clash or bench experiment unfolds an interactive schematic tray at the bottom-right where clicking resolution options `Split at port`, `Retry wins`, or `Serialize` live-previews the physical pipe and belt rerouting on the canvas before pressing `Enter` to commit, inferred.
- **Landing value moment 1, clash before code.** Both agents project ghost blueprints onto the belt from `api` to `paypal` at once, inferred. Where the two ghost blueprints intersect, red interference sparks animate until the user hovers a resolution button, which immediately morphs the ghost geometry into the settled port or serialized queue, inferred.
- **Landing value moment 2, blast radius.** Watching discrete payout packets `p-2307` travel down the belt from `api` to `retry` to `paypal`, bounce three times inside `retry`, and pile up in front of `sqlite` makes the retry storm self-evident without reading a single word, inferred.
- **Landing value moment 3, readback fork.** Replaying the order sends a test packet through the plant, and at `sqlite` the packet splits into two ghost paths, one marked `pending` for Claude Code and one marked `failed` for Droid, letting the user click the path to keep, inferred.
- **Infinite canvas handling.** Provides continuous physical zoom from macro supply-chain view at Z0 and Z1, where inter-plant belts visibly pump batches of events between plant buildings, down to micro machine internals at Z3 and Z4, where individual function stages and file slots operate like sub-assemblers, inferred.
- **Main risk.** Continuous particle animation and richer machine detail can violate `audit.mjs` transition rules unless strictly scoped to a `<canvas>` or SVG telemetry layer, and can become visually noisy when five plants are visible at once unless Z0 and Z1 throttle animation to aggregate pulses, guess.

### 5.1 Recommended bet

**Bet on Direction 1, Swiss Cartographic, as the shell, surface, typographic, and color foundation, and fuse in Direction 3's physical belt packets and ghost-resolution previews on the plant canvas, inferred.**

1. **Fixes every item in the user's diagnosis immediately.** Direction 1 adopts `explore/ui-v2/vendor/anatomy/iso-kit.mjs:580-589` with `#f2f2ef`, `#fbfbfa`, and `#ffffff` verbatim, eliminates the dated brass and brown game palette `#c9a45c` and `#19160f`, unpins the dark cards in light mode, and replaces heavy blurred boxes with weightless `1px`-bordered Swiss islands, inferred.
2. **Makes the map informative with less text.** Combining Direction 1's quiet monochrome base and Tufte roof sparklines with Direction 3's animated belt packets and live ghost previews on hover lets the plant itself tell the story of the retry storm, the `sqlite` readback fork, and the `api` to `paypal` clash before the user reads a card, inferred.
3. **Avoids the failure modes of Pure 2 and Pure 3.** Pure Direction 2 skews text onto the isometric floor where 30-degree foreshortening hurts legibility, while Pure Direction 3 risks looking like a video game if its HUD chrome and lighting get too ornate, inferred. Swiss Cartographic chrome paired with tactile physical belts gives Acan a signature look that feels like a precision engineering instrument built in 2026, inferred.

---

## 6. Kvarm placement

### 6.1 What is wrong with current Kvarm placement

Currently, Kvarm status is fragmented across four overlapping places, measured.

1. **Top-right island pill.** `.egress` in `.fl.tr` at `explore/ui-v2/SHELL.md:32` and `explore/ui-v2/concepts/orders.mjs:391-405` displays `local + kvarm · 1,336 B out` or `kvarm offline · 2 held`, measured.
2. **A separate 380px panel over the compass slot.** `#orders-kv-panel` at `explore/ui-v2/concepts/orders.mjs:118-121` and `#clashKvPanel` at `explore/ui-v2/concepts/clash.mjs:613` anchor at `top: 64px` and `right: 16px`, which is the exact right rail slot occupied by the compass `#nav` at `explore/ui-v2/SHELL.md:34`, measured. Because they occupy the same spot, `shellYield` in `explore/ui-v2/build.mjs:701-728` has to hide `#nav` whenever a panel opens, measured.
3. **Bottom-right island inline connection readout.** In `explore/ui-v2/JOURNEY.md:23` and `explore/ui-v2/SHELL.md:52,157`, World packs `kvarm · git.acan.local · 5 repos · fresh 8 s` into `.world-br`, ballooning the bottom-right island width from `570px` to `1151px`, measured.
4. **Duplicated inline strips inside every concept card and dock.** `explore/ui-v2/concepts/orders.mjs:166,507`, `explore/ui-v2/concepts/clash.mjs:266`, `explore/ui-v2/concepts/gate.mjs:88`, and `explore/ui-v2/concepts/bench.mjs:305` each waste 50px to 90px of vertical height repeating the last two to three Kvarm RPC rows, which is a primary reason the orders, clash, and bench cards overflow and scroll at `1280x800` in `explore/ui-v2/SHELL.md:153`, measured.

### 6.2 Recommendation

Move Kvarm off the compass and out of concept cards into one top-right pill plus a right-slot drawer, inferred.

1. **Keep the compass `#nav` unobstructed at `explore/ui-v2/SHELL.md:34`.** Never mount `#orders-kv-panel` or `#clashKvPanel` at `top: 64px` over the compass, inferred. Spatial orientation with `#compass` tilt, rotate, and reset and coordination-server network telemetry are unrelated mental models and should never fight for the same slot, inferred.
2. **Consolidate all at-rest Kvarm status into the top-right island pill `.fl.tr`.** When online and fresh, the pill in `.fl.tr` reads `[●] git.acan.local · 1,336 B out` with a green dot, inferred. When offline or holding writes, it reads `[▲] git.acan.local · offline · 2 held` with an amber `--wait` triangle, inferred. When a lease is stale or unmatched, it reads `[▲] git.acan.local · 1 unmatched`, inferred.
3. **Remove the duplicate connection string from `.fl.br`.** Let `.fl.br` hold only canvas and time telemetry for zoom percentage, plant rps, p99, error rate, and the LIVE or REPLAY clock, restoring `.fl.br` to a compact `420px` width at all levels and fixing the `1151px` `.world-br` bloat noted in `explore/ui-v2/SHELL.md:157`, inferred.
4. **Open Kvarm detail in the standard right card slot via click or `Shift V`.** As `explore/ui-v2/SHELL.md:63,100` already does for `#worldNetwork`, clicking the `.egress` pill or pressing `Shift V` opens the single unified Kvarm and Egress card in the `392px` right card slot, showing connection authority, freshness, lease table, held writes with `Enter` to flush, and the append-only session network log, inferred.
5. **Delete all inline `.orders-kv`, `.clash-kv`, `.gate-kvlog`, and `.bench-kvarm` footers from inside concept cards.** Removing those 3-row RPC tables saves 60px to 85px per card, fixes the `1280x800` card scroll violation in `explore/ui-v2/SHELL.md:153`, and cuts 12 to 18 words per screen while keeping outbound bytes visible at rest in `.fl.tr` and full RPC logs one key away on `Shift V`, inferred.

---

## 7. Prototype plan

To judge the three visual directions fairly in Step 3b of `explore/ui-v2/PARKED.md:74`, all three prototypes `proto-swiss`, `proto-cockpit`, and `proto-factorio` must render the exact same high-signal multi-agent scenario on the same fixtures, sizes, and appearances, inferred.

### 7.1 Shared scenario and fixtures

- **Scenario beat.** Journey Beat 8 and Beat 9 on `Acquit` with World zoom-out, using canonical data from `explore/ui-v2/concepts/core-data.mjs` and `explore/ui-v2/concepts/world.mjs`, measured.
- **Plant state on `Acquit`.** Territory `paypal-payouts` is claimed by `Claude Code` with `bot-cc`, lease `g1`, witness `w1` must-not on `retry`, witness `w2` must-keep on `paypal`, and witness `w3` must-keep on `sqlite`, measured. `Droid` with `bot-d2` is active on `radar-otel`, and `Codex` with `bot-cx` is at `paypal` waiting on a tool prompt `blocked on you · 9m`, measured.
- **Active conflicts.** Blocking clash `c1` "Retry meets breaker" breaking `w3` sits on the belt from `api` to `paypal`, blocking clash `c2` "One table, two migrations" sits at `sqlite`, and the bench zone `bench-1` is visible adjacent to `paypal-payouts` with rigs `A1`, `A2` disproved on `w3`, and `A3` held, measured.
- **World context.** All five plants `Acquit`, `Acan`, `Kvarm` with `#184 blocks publication`, `acan-format`, and `acan-site` live on the same infinite plane so the prototype can zoom continuously from `Z1-world` to `Z2-plant-rest` with no card open to `Z2-plant-card-c1` with the `c1` Clash Card open in the 392px right slot, plus `Alt` reveal mode, inferred.
- **Required matrix of shots per prototype.** Capture 12 shots per prototype across 3 states `Z1-world`, `Z2-plant-rest`, and `Z2-plant-card-c1`, 2 appearances `dark` and `light` using pure white from `explore/ui-v2/vendor/anatomy/iso-kit.mjs:580-589`, and 2 viewport sizes `1280x800` and `1440x900`, plus 1 `Alt`-held provenance shot at `1440x900`, inferred.

### 7.2 Scoring rubric totaling 100 points

| Criterion | Weight | How it is measured and scored |
|---|---|---|
| **1. Ten-second chat-UI developer value test** | **30%** | Cold test on `Z2-plant-rest` and `Z1-world` shots. Within 10 seconds, an engineer who has never used Acan must identify how many agents are running and where, which two agents are about to collide before writing code, which service is unhealthy, and why this map helped more than three terminal tabs. |
| **2. Scan speed for under-2s value moments** | **20%** | Time-to-fixation and visual pop of the top three moments, namely `c1` belt clash footprint overlap, `paypal` and `retry` error backpressure versus healthy machines, and `A1`, `A2`, `A3` bench witness lamp comparison. Penalizes any design where the eye must read a paragraph before spotting the problem on the floor. |
| **3. Words on screen and `TEXT.md` budget** | **15%** | Automated `textCount` run on all three states. `Z2-plant-rest` must be at or below 85 words total with `plant` stage text at or below 8 words, `Z2-plant-card-c1` must be at or below 125 words total below the 136 solo cap in `explore/ui-v2/TEXT.md:31`, and zero surfaces may exceed budget. |
| **4. Visual craft and Pure White and Dark parity** | **15%** | Uses `explore/ui-v2/vendor/anatomy/iso-kit.mjs:580-589` with `#f2f2ef` page, `#fbfbfa` card, and `#ffffff` faces in light mode with zero dark-pinned cards or decks. Machine geometry must have clear 3D contrast against the floor in both dark and light with zero overlap or scrollbars at `1280x800` in `explore/ui-v2/audit.mjs`. |
| **5. Honesty rule and 1-key `Alt` provenance** | **10%** | All six mandatory at-rest values in `explore/ui-v2/TEXT.md:65-72`, namely egress bytes, order state and holder, readback scorer, agent evidence class, unmatched holder, and blocking action, pass `textSeen`. Holding `Alt` reveals full witness and readback clauses and `[data-binding]` provenance with zero layout jump. |
| **6. Keyboard reach and infinite canvas fluidity** | **10%** | Smooth cursor-centered wheel zoom across Z0 to Z4 on a single coordinate plane with no DOM swap flicker between World and Plant. Pan works even when a right-slot card is open, and every action `I`, `V`, `U`, `Shift V`, `Shift 1-5`, `Ctrl K`, `Alt 1-5`, and `F8` is reachable in one keystroke. |

---

## 8. What changes in the plan

Adopting the new visual direction and infinite canvas requires targeted amendments to `explore/ui-v2/JOURNEY.md`, `explore/ui-v2/SHELL.md`, and `explore/ui-v2/TEXT.md`, inferred.

### 8.1 Shared changes required across all three directions

| Spec file and lines | Current plan rule | What changes |
|---|---|---|
| `explore/ui-v2/JOURNEY.md:100` | Light values come from the `l-light-mode.md` table. | **Overturned.** Light values come from `explore/ui-v2/vendor/anatomy/iso-kit.mjs:580-589` with `#f2f2ef` page, `#fbfbfa` card, `#ffffff` top face, `#f3f3f0` left face, `#e4e4e0` right face, and `#161616` ink. Every concept card, dock, pin, and deck uses these tokens in light mode. |
| `explore/ui-v2/SHELL.md:159` and `explore/ui-v2/build.mjs:56-57` | The decks and inspector stay dark in light appearance and are pinned to graphite tokens. | **Overturned.** Remove the dark pin on `.simdeck`, `.insp`, `#rpdeck`, and all concept cards `.orders-card`, `.clash-card`, `.gate-card`, `.gate-station`, and `.bench-card`. In light appearance, every island, card, and deck uses light surface tokens `#fbfbfa`. |
| `explore/ui-v2/JOURNEY.md:12,26,105` and `explore/ui-v2/concepts/world.mjs:57,222,280` | Two separate canvases where a `1600x900` world viewBox swaps for `ui-v1` `#stage` on focus and the camera locks pan when a card is open. | **Overturned.** One continuous infinite canvas plane across Z0 to Z4. Focusing `Acquit` smoothly interpolates the camera `{ x, y, zoom }` from Z1 at `0.35` to Z2 at `1.0` without swapping SVG roots or locking out pointer panning. |
| `explore/ui-v2/SHELL.md:36,53,137,156` and `explore/ui-v2/JOURNEY.md:22,24` | `.fl.bl` is `168px` tall with `Waiting on you`, 3 agent text rows, and `Floor timeline`, while `#worldMinimap` sits in the right rail at world level. | **Overturned.** `.fl.bl` collapses to a `40px` single-row island `Waiting on you N · 3 agents · G timeline` at all levels, matching `.world-bl` in `explore/ui-v2/SHELL.md:51` and freeing `128px` of vertical canvas height. `#worldMinimap` is dropped because zooming out on the infinite canvas is the map, and off-screen blockers use edge beacons. |
| `explore/ui-v2/JOURNEY.md:20,23` and `explore/ui-v2/SHELL.md:32,37,52,157` | Egress bytes live in `.fl.tr`, while connection authority, origin, freshness, and lease live in `.fl.br` making `.world-br` up to `1151px` wide, and concepts render inline `.orders-kv`, `.clash-kv`, `.gate-kvlog`, and `.bench-kvarm` strips inside cards. | **Overturned.** All Kvarm and egress status consolidates into the `.fl.tr` pill `[●] git.acan.local · 1,336 B out`, and clicking or pressing `Shift V` opens the unified Kvarm and Network card in the `392px` right card slot. Inline Kvarm log strips inside concept cards and docks are deleted. |
| `explore/ui-v2/SHELL.md:60-64,140,152` and `explore/ui-v2/JOURNEY.md:28` | Concept cards violate the `392px` right card slot because `clash` is `560px`, `orders` is `470px` plus a `340px` dock, `bench` is `466px` at left, and `gate` is `400px` at left plus a `460px` card. | **Enforced.** One active card slot at `392px` wide at `right: 16px` and `top: 100px` holds all inspection, order, clash, bench, and Kvarm cards. On-canvas `.clash-order`, `.bench-order`, and `.orders-dock` are replaced by a 1-line territory floor header that opens the right card on click or `P`. |
| `explore/ui-v2/TEXT.md:28` | `plant` stage text budget is `20` words, and floating `.chip` labels print metric strings `PAYPAL 2.3% err` on every machine. | **Tightened.** `plant` stage text budget drops from `20` words to `8` words at rest for the territory claim header plus 2-char machine and drone mono stamps skipped via `.mono` in `explore/ui-v2/TEXT.md:40`. Metric strings on `.chip` are replaced by roof sparklines and belt animations at rest, and shown as text under `Alt` or selection. |

### 8.2 Direction-specific overturns

- **Direction 1, Swiss Cartographic, recommended.** `explore/ui-v2/build.mjs:8` replaces `--focus:#c9a45c` antique brass with neutral ink borders at rest and semantic state colors in cobalt `#2563eb`, viridian `#0d9488`, ochre `#d97706`, and vermilion `#dc2626`, inferred. `explore/ui-v2/TEXT.md:98-110` keeps Direction E state at rest and sentences under `Alt` for the right-slot card, while upgrading the plant canvas from text chips to Tufte roof micro-gauges and animated belt chevrons, inferred.
- **Direction 2, Quiet Cockpit.** `explore/ui-v2/SHELL.md:60-64` replaces the single active right card with a persistent vertical stack of collapsible 1-line flight strips in the right slot for `Order`, `Clashes`, `Gate Queue`, and `Kvarm`, inferred. `explore/ui-v2/SHELL.md:144` Rule 11 on `.chip` DOM nodes is deleted because all HTML `.chip` and `.clash-pin` overlays are replaced by isometric SVG floor callouts, inferred.
- **Direction 3, Living Factorio.** `explore/ui-v2/PARKED.md:68` on the `audit.mjs` transition rule adds an explicit allowlist for continuous `<canvas>` and SVG belt-particle and machine-cycle animations in Live and Replay modes, inferred. `explore/ui-v2/JOURNEY.md:28` splits the right card slot so resolution options `Shift 1-5` dock as a bottom-center schematic bar that live-morphs ghost belts on hover before commit, inferred.
