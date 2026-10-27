# Journey spec: one session through the core loop

This is the build spec for go-bar line G1 in `READINESS.md`. It joins the five concepts into one shell and one continuous session. Read `CORE.md` and `DECISIONS.md` first. Their quality bar still holds, and this spec only adds what the join needs. `SHELL.md` owns island positions and `TEXT.md` owns word budgets. Where this spec quotes their numbers, they must agree.

An agent self-claims after a current readback match and a live lease from the order's selected authority. The review allowance is advisory and never stops an agent or withholds an order. Enforced review rules block publication only. Kvarm is opt-in behind the coordination adapter, with consent to the selected origin and declared egress. Optional capabilities require compatible server reports and permission. Local solo use uses a single-device authority labeled local and requires no hosted account. The single-player core is open source. Multiplayer and hosted Acan are paid. The single-player journey is complete in the open build, and the paid team pass in section 8 exists only in the team build. The world is a canvas of systems, not agents. Appearance stays Light, Dark or System, with F8 per window. Core UX comes first. We dogfood with Droid.

## 1. Shell

**One page, no switching.** `node build.mjs journey` writes `live-journey.html`. The hash `c=journey` is read once at load. After that the URL never changes. There is no hash switching, no `pushState`, and no reload. Back and forward keep an in-memory place history. Optional load flags are `kv=ok|unmatched|stale|offline`, `appearance=light|dark|system`, `peer=1` (another principal's agent on the same origin), and `beat=<id>`, which seeds a later beat (see section 6). `TEAM=1 node build.mjs journey` writes `live-journey-team.html`, the only build that reads `team=1` and `me=you|sam` (section 8).

Other principals on the selected origin remain visible with their ownership and authentication evidence. Origin-authorized actions across people, including review, remain available in the open build. These facts and actions do not require the team module.

**Two levels, one canvas.** The world level is the world concept's canvas of five plants. Focusing Acquit eases the camera into the Acquit site, then swaps the world canvas for the ui-v1 stage, which is Acquit's real plant. The swap is instant, with no transition. The other four plants keep the world concept's own plant stage. Leaving Acquit reverses this.

**The island shell.** The journey runs on the one shell in `SHELL.md`. The stage draws full-bleed, and every control lives on a floating glass island. There are no bars and no docked panels. The world concept's old top bar, toolbar row, framed stage and docked inspector (`shots/world-07-levels.png`) are retired. Every rect in this section comes from `SHELL.md` sections 2 and 3, measured at 1280 x 800, 1440 x 900 and 1600 x 900, or is derived from its free-rect rule in section 3.1. Rects are `[left, top, width, height]` in CSS px.

**Persistent chrome.** These islands never unmount and never move. Only their width changes with copy.
- **Top left.** Brand, Back and Forward, the breadcrumb `My world / Acquit / paypal-payouts`, and Go to (Ctrl K). It sits at left 16, top 16, height 40. It is 273 wide on the Acquit stage and 358 wide at world level. At plant level the palette results include Acquit's machines.
- **Top centre.** The mode chips Live, Blueprint, Simulate, Replay (1 to 4). They show at plant level only. The island is centred on `vw / 2`, at top 16 and height 40.
- **Top right.** Layers (L), Export, and the egress pill `local + kvarm · N B out`, where N is the sum of the session ledger (section 5). Its right edge is `vw - 16`. Click or Shift V opens the network log in the right card slot. Appearance is a select in the Layers menu, and F8 cycles System, Light, Dark (section 3).
- **Hint strip.** The one hint line, at top 64 and height 28, centred on `vw / 2`. It always starts with the focused target (section 3).
- **Bottom left.** Waiting on you, one queue for the whole session, with its count. It is one row tall at both levels, `[16, vh - 56, w, 40]`, like the world's `.world-bl`. U opens the queue as the bottom-left card above the island. The count is the only waiting count on screen, and `.bl .wait b` shows it. The ui-v1 status panel's agent rows and floor timeline move into the queue card, below the rows.
- **Bottom right.** Zoom, the readout, the live clock, and the connection readout, at top `vh - 56`, height 40, right edge `vw - 16`. The connection readout shows the selected authority, origin, freshness, and relevant lease. Detail stays in its evidence card. It exposes unavailable capabilities and unmatched claims without permanent extra chrome. Clicking opens detail and changes no connection setting. The island is one width at both levels, at most 570 px, the ui-v1 measure.
- **Right rail.** The compass, `#nav`, at `[vw - 112, 64, 96, 135]`. At world level the minimap takes the rail slot at `[vw - 200, 64, 184, 139]`. The rail hides while a card covers it.

**Slots at each size.** The free rect is the stage minus the islands and any open card or queue. Its left is 16, its top is 100, and its bottom is `vh - 64`. Its right is `#nav` left minus 8, `#worldMinimap` left minus 8 at world level, or the open card's left minus 8. With the queue open, its left is 416.

| Slot | 1280 x 800 | 1440 x 900 | 1600 x 900 |
|---|---|---|---|
| Right card slot | `[872,100,392,636]` | `[1032,100,392,736]` | `[1192,100,392,736]` |
| Queue | `[16,100,392,636]` | `[16,100,392,736]` | `[16,100,392,736]` |
| Jump palette | `[330,100,620,242]` | `[410,100,620,242]` | `[490,100,620,242]` |
| Layers menu | `[1014,64,250,316]` | right edge 1424 | right edge 1584 |
| Free rect, plant level, nothing open | `[16,100,1144,636]` | `[16,100,1304,736]` | `[16,100,1464,736]` |
| Free rect, world level, nothing open | `[16,100,1056,636]` | `[16,100,1216,736]` | `[16,100,1376,736]` |
| Free rect, card open | `[16,100,848,636]` | `[16,100,1008,736]` | `[16,100,1168,736]` |
| Free rect, queue open, plant level | `[416,100,744,636]` | `[416,100,904,736]` | `[416,100,1064,736]` |
| Toast centre x, nothing open | 588 plant, 544 world | 668 plant, 624 world | 748 plant, 704 world |
| Toast centre x, card open | 440 | 520 | 600 |
| Toast bottom | 736 | 836 | 836 |

The world-level and queue-open free rects are derived from the `SHELL.md` rule, because `SHELL.md` section 3.1 measures only the plant level with the rail.

**Layout.** The camera fits its subject inside the free rect. The world level's canvas keeps its 1600 x 900 viewBox and fits the free rect. At boot neither the queue nor a card is open, so the five plants fit the world's free rect with nothing open. Opening the queue does not refit the camera. Moving between rows eases the camera to the row's machine or plant only when it is outside the free rect. A toast is centred on the free rect's horizontal centre, and its bottom sits at `vh - 64`. The jump palette is a centred modal just under the strip row. The concept bar `#cbar` is hidden.

**Cards.** Every card renders in the right card slot, `[vw - 408, 100, 392, vh - 164]`. The queue is the one exception and opens at bottom left, in `[16, 100, 392, vh - 164]`. A card never leaves the viewport and never overlaps an island. The rail is the one island a card may cover, and it hides while covered. A card has a fixed header, a body, and a fixed action row. Only the body scrolls. Values from the honesty table in `TEXT.md` sit at the top of the body, so they show without scrolling at 1280 x 800. The 60-word card budget comes first, and scroll is the fallback for evidence that does not fit. A card about a machine draws a leader from its header to that machine. If the machine is outside the free rect, the camera eases to it, and no other motion happens. This replaces each concept's own anchoring (orders top 100, clash left of nav, gate and bench at left). The stack order is concept card first, then the ui-v1 inspector. Opening a card closes the card below it in the slot. Esc reopens nothing.

**One focused layer.** At most one of the queue and a card is open. Opening a card closes the queue, and opening the queue closes the card. Beats that need the plant close the queue first. Beats that need the queue close the card. The palette and the Layers menu sit above both while open. They close on Esc, on their action, or on a click outside. A card never draws over an open Layers menu.

### Light appearance

The light appearance is the anatomy kit's default light theme, `.iso[data-theme="light"]` in `vendor/anatomy/iso-kit.mjs:580-589` (user decision, 2026-10-27). It replaces the warm vellum direction in `research/agentic-ux/l-light-mode.md`. Dark is unchanged.

Every light surface derives from the kit's neutral light tokens. That covers islands, cards, the queue, the palette, toasts, the replay and simulate decks, the inspector, plant faces, and chips. No light surface uses a vellum or warm tint. No card, deck or inspector stays dark on the light page.

| Shell token or surface | Light value | Kit source |
|---|---|---|
| Page, `html, body` and stage background | `#f2f2ef` | `--anatomy-page` |
| `--glass` | `#fbfbfa` at 0.92 | `--anatomy-card` |
| `--glass-hi`, card, deck and inspector fill | `#fbfbfa` | `--anatomy-card` |
| Chip fill | `#ffffff` at 0.92 | `--anatomy-face` |
| Plant faces, tops and shades | the kit's light values, with no override | `--anatomy-face`, `--anatomy-top`, `--anatomy-shade-0` to `-3` |
| `--line` | `#e5e5e2` | `--anatomy-shade-1` |
| `--line2` | `#dcdcd9` | `--anatomy-shade-0` |
| `--press` | `#ededea` | `--anatomy-shade-2` |
| `--hover` | `#f4f4f1` | `--anatomy-shade-3` |
| `--tick` | `#8a8a8f` | `--anatomy-mid` |
| `--text` | `#57575a` | `--anatomy-text` |
| `--ink` | `#18181a` | `--anatomy-strong` |
| `--dim` | `#6a6a6e` | darker text variant of `--anatomy-muted` |
| `--faint` | `#8c8c90`, for marks and disabled controls only | `--anatomy-muted` |
| `--focus` | `#3e63dd` | `--anatomy-blue` |
| `--shadow` | the light `--anatomy-lift` | kit |

Signal colours must stay legible on white. Each state colour was checked against the card `#fbfbfa`, the face `#ffffff`, and the page `#f2f2ef`, with the WCAG 2 relative-luminance formula. Text needs 4.5:1 and marks need 3:1. Where a kit colour fails as text, the journey names a darker text variant.

| State | Mark | Mark contrast on card, face, page | Text | Text contrast on card, face, page |
|---|---|---|---|---|
| fail | `#e5484d` | 3.78, 3.91, 3.49 | `#c62a2f` | 5.37, 5.57, 4.96 |
| ok | `#30a46c` on cards and faces, `#2b9763` on the page | 3.05, 3.16, 2.81 (`#2b9763` is 3.28 on the page) | `#1d7a50` | 5.13, 5.31, 4.74 |
| ghost | `#3e63dd` | 5.03, 5.21, 4.64 | `#3e63dd` | 5.03, 5.21, 4.64 |
| wait, strain | `#b97700` | 3.56, 3.68, 3.28 | `#9a5b00` | 5.24, 5.43, 4.84 |
| idle | `#8c8c90` | 3.24, 3.35, 2.99 | `#6a6a6e` | 5.20, 5.39, 4.80 |

The kit red fails as text (3.78 on the card). The kit green fails as text (3.05) and as a mark on the page (2.81). The kit muted grey fails as text (3.24). The kit has no amber, and the dark amber `#e1a43c` is 2.12 on the card, so wait and strain get the two values above. The brass focus `#c9a45c` is 2.27 on the card and fails 3:1, so light focus is the kit blue. State fills such as `--wait-fill` use the state's mark colour at 8 to 14 percent on a row, never as a card or page fill.

These sources of the current wrong look are deleted or moved to tokens.
- World's light overrides, `concepts/world.mjs:809-812` (vellum `--w-*` values and mode papers), `1007` (vellum `--anatomy-*` values) and `1066` (vellum minimap glass). World's `--w-*` names alias the shell tokens.
- The shell's warm light island tokens in `build.mjs:53-54`.
- The dark pin on decks and inspector in light, `build.mjs:56-57`.
- Hard-coded dark fills and white ink in concepts and ui-v1 modules. Examples are the `#161715` card fills at `clash.mjs:536`, `gate.mjs:400` and `bench.mjs:572`, and the chip fill `rgba(14,14,14,.72)` with ink `#d8d8d8` at `build.mjs:73`. On 2026-10-27 the ui-v2 modules held 76 matches of `rgba(255,255,255`, 26 of `#fff` outside `audit.mjs`, 23 dark fills, and 104 brass `#c9a45c` literals, most in the concept cards.
- Brass in light. Brass borders map to `--line2` and brass emphasis to `--ink`. Dark keeps brass.
- Mode papers in light. Every mode uses the kit page. The mode chip and the watermark carry the mode.

### Shell violations the build fixes

These come from `SHELL.md` section 7 and the step 2 audit (`PARKED.md`). Each is a build requirement for step 4, checked by `audit.mjs` at every shot.
1. Concept cards move into the right card slot. Measured at 1280 x 800 today, the orders card is 470 wide at left 360 to 720, clash is `[592,170,560,556]`, the gate card is 460 wide at left 692, bench is `[16,100,466,...]`, the gate station is `[16,100,400,508]`, and the orders guide is `[16,100,288,381]`. All become 392 wide at `vw - 408`. The gate station becomes the queue body.
2. World cards use the 392 px slot. `#worldCard` and `#worldNetwork` sit at `[vw - 408, 100, 392, ...]`.
3. The world queue's top is 100 at every size. The audit measured 180 at 1600 x 900.
4. The bottom-left island is one row, 40 tall, at both levels. `.fl.bl` measured 152 to 200 tall across concepts and 168 in `SHELL.md` rule 4.
5. Toasts centre on the free rect, not the viewport. `conceptToastPlace` (`build.mjs:679-691`) aims at `innerWidth / 2` and then searches the whole viewport. The journey places the toast by the rule in **Layout** instead.
6. Cards that scroll keep the header and action row fixed. The orders card at 1280 x 800, and the quiet and bench cards at 1280 x 800, scroll today with the action row inside the scroll.
7. A card never draws over the open Layers menu. Clash's card overlapped Layers at 1600 x 900.
8. No `[data-hint-row]` toolbar shares the strip row. `#clashToolbar` pushed a 730 px clash hint past `#nav` at 1280 x 800. Its items become Layers rows, and the hint keeps the 12-word island budget (section 3).
9. Pin labels clamp inside the free rect. A `.clash-pin-label` sat at left -6 at 1440 x 900, at the step "One table, two migrations · history advisory".
10. The world bottom-right island matches the ui-v1 one. It measured 936 to 1151 wide at 1600 x 900 against 570, because it carries the connection readout inline.
11. Replay deck and inspector type is at least 11 px. It measured 9 to 10.5 px.
12. Decks and inspector follow the light rule above. They no longer stay dark in light.

## 2. Beats

T0 is 16:30, the end of the recorded hour that every fixture already uses. The journey clock in `journey-data.mjs` stamps each beat. Keys are the keyboard route, and Mouse is the mouse route. Both routes reach the same state. Times in brackets are journey clock stamps. Steps poll for every timed arrival and never sleep.

| # | Beat | Key | Mouse | What appears, and its anchor | Hands off |
|---|---|---|---|---|---|
| 1 | World [16:30] | load | load | Five plants. Queue island `Waiting on you 3`. Acquit reads `paypal over budget · 4.1% of 2%`. acan-format reads `Digest blocks publication`. The connection readout shows the discovered scripted state. The egress pill reads `local + kvarm · 2,304 B out`, the sum of the four boot rows in section 5. Nothing is open, so the world fits its free rect. No anchor. | queue `breaker, codex, digest`, normalized connection description and initial snapshots |
| 2 | Intent | Alt 2 | click Acquit | Camera eases in, then the ui-v1 stage replaces the canvas at Replay 15:44:30 with retry selected. The orders guide is the right card slot's resting card until Post. At rest it reads `Pin real moments.` with rows `Retry · 15:44`, `PayPal · 15:35`, `Pin must not`, `Pin must keep` and `Post`. Its sentence `Agents replay their reading before they claim.` is under Alt. Anchor retry. | `plant: acquit` |
| 3 | Pins | M, Enter, Ctrl K `paypal` Enter, Shift M, Enter | `Retry · 15:44`, `Pin must not`, Keep, `PayPal · 15:35`, `Pin must keep`, Keep | Witness cards `MUST NOT · 15:44 · retry · loop depth 3 of 3` and `MUST KEEP · 15:35 · paypal · 1 try`. While w2 is unpinned, the palette's first result for `paypal` is the guide row `PayPal · 15:35`. Enter on it selects paypal and seeks Replay to 15:35, as the guide row does (`orders.mjs:853-859`). Home and five presses of `.` still reach 15:35. Anchor retry, then paypal. | `witnesses w1, w2` |
| 4 | Order [16:31] | P, type, Enter | Post, click sentence, type, Post | The order card shows the sentence, locked checks w1 and w2, and budget `paypal.error_rate < 2%`. Post switches to Live and calls `publishWork`. Toast `Posted r1. Witnesses are locked.` Show local, partial, and remote-open states honestly. Backend issue #41 and task t-41 are evidence locators. Anchor paypal. | `sentence` as typed, order r1 open only after confirmation |
| 5 | Readbacks | none | none | bot-cc arrives at 1400 ms and bot-d2 at 2600 ms. Readback rows append in the order card body, directly under its state line, so they show without scrolling. Focus stays. The question pin appears at sqlite. Toast `Two readings differ on p-2307. Answer at sqlite.` Queue gains `p-2307 · keep pending?`. | `arrived claude-payouts, droid-payouts` |
| 6 | Answer [16:32] | I, Shift 1 | click the sqlite pin, click option 1 | I opens the question, the next unresolved pin, and its card replaces the order card. Question card `PayPal accepted payout p-2307, but the response was lost. What should happen to it?` Answer pins w3 at sqlite. Order is r2. The order card returns, so the readbacks show while they rescore. Toast `Pinned w3. Order is now r2.` Queue drops p-2307. Anchor sqlite. | `answer 1`, `w3 value pending`, r2 |
| 7 | Claim | none | none | Rescore the exact current witness set, then let the matched agent call `claimWork`. The claim waits until the readback rows are fully on screen and uncovered for 1400 ms (`orders.mjs:828-834`, `orders.mjs:936-944`), so they must sit above the order card's fold. Toast `Claude Code claimed. Readback matched 3 of 3.` Focus does not move. Unfog paypal-payouts only after an accepted live fence is bound to that match. Show the accepted lease in the connection evidence. | `claimedBy Claude Code`, accepted fence bound to the current match |
| 8 | Declarations [16:33] | none | none | 1200 ms after the claim, d1, d2 and d3 arrive. Clash pins c1 at the api to paypal belt and c2 at sqlite. Status `2 clashes before code`. Queue gains c1 and c2. Focus stays. | `declarations d1 d2 d3` |
| 9 | Clash | I | click the c1 pin | I opens c1, the lowest unresolved pin. c1 card `Retry meets breaker`, `Breaks w3 · payout p-2307`. Options Shift 1 Split at the port (suggested), Shift 2 Retry wins, Shift 3 Breaker wins, Shift 4 Serialize, Shift 5 Test on the bench. The consequence sentence is under Alt, and declaration bodies stay in closed disclosures. V outlines footprints on the plant and lists their sources in the card, so no footprint label lands on the plant. Anchor breaker. | `open c1` |
| 10 | Settle [16:34] | I, Shift 1 | click the c2 pin, click `Serialize, radar-otel first` | With c1 open, I opens c2 and replaces the c1 card, as clash's `next()` does (`clash.mjs:180-184`, `clash.mjs:427-430`). The mouse route opens c2 from its pin, which also replaces the c1 card. Shift 1 on c2 is `Serialize, radar-otel first`. Settling closes the card and focuses the c2 pin (`clash.mjs:174-179`). c1 stays unsettled, with no card open. The settled mark reads `syncing` until the `record_decision` row returns, then `synced`. On that return the toast reads `Settled before code. Decision logged to Kvarm.` Offline it shows at once and reads `Settled before code. Decision pending · Kvarm offline.` Both are clash's toast (`clash.mjs:198`) without its last sentence, `No file was edited.`, which moves under Alt to fit the 8-word toast budget. Queue drops c2. | `settled c2 serialize`, choice receipt, dependency advisory until pinned |
| 11 | Gate [16:35] | U, Shift 1, Shift 2 | click the queue island, click the breaker row, click Advise hold | U opens the queue with row 1 focused. The queue keeps gate's class sort (`gate-data.mjs:17-24`, `gate.mjs:30`), so rows read breaker (live harm), codex (agent idle), c1 (undo cost grows), digest (publication waits). The header reads `9–18 min` and names the rows it sums. Shift 1, or Enter on the focused row, opens the breaker as a card, which closes the queue. At rest the card shows the estimate, its basis, the consequence class, and `Meanwhile · Droid keeps verifying radar-otel`. Shift 2 advises a hold, which records local advice. Toast `Hold advised on the breaker. Droid keeps working.` It sends no publication block and changes no task eligibility. The row stays listed, marked `hold advised`. Anchor breaker. | `gate.held breaker`, advisory only |
| 12 | Bench [16:36 to 16:55] | I, Shift 5, Enter, Enter, Shift 3, Enter | click the c1 pin, click Test on the bench, Fund, Extend, A3, Record | I opens c1, the one unresolved pin, and replaces the breaker card. Shift 5 opens the bench card in its place, with the three witness clauses. Enter funds, and results stream. A2 is disproved by w3. A1 holds. A3 is spent at 300000 tokens, and Enter becomes Extend, which adds 100000 tokens and 5 min. A3 then holds w3. Shift 3 drafts A3, and Enter records it. Toast `Recorded A3. Now r3. c1 settled as Split.` Queue drops c1. | `bench a3`, r3, `settled c1 split via bench` |
| 13 | Publish or hold [16:58] | Ctrl K `184` Enter, then Shift 1 Approve or Shift 2 Hold | click the queue island, click the #184 row, then Approve or Hold | #184 arrives 2000 ms after Record. It opens by name, never by row number, because rows shift as the queue changes. The adapter exposes the actual head, reviewer role, frozen witness results, and remaining blockers. Approve calls `reviewChange` for that exact head. Publication is a separate authorized `requestPublication` action or a clearly disclosed existing server policy. Hold leaves the required human approval pending. If the server exposes a real hold, label its exact semantics. Agents keep working. Nothing says published until confirmed. Anchor paypal. | review receipt and queued, blocked, published, or unknown publication state |
| 14 | Step away [17:00] | Shift U, Shift 1 | click the queue island, click Step away, click `in 30 min` | The chooser card opens in the right card slot with `in 30 min`, `in 1 h`, `in 2 h`, `tomorrow`. The stage dims with no animation. The hint reads `Away until 17:30 · Shift U I'm back`, and the bottom-left island shows an `I'm back` button. | `away backAt 17:30` |
| 15 | Return brief [17:30] | Shift U, I, Esc | click I'm back, click each item, close | Brief card `While you were away · 17:00 to 17:30` in the right card slot. I steps through the items and eases the camera to each item's machine or plant. Items are listed in section 5. Esc closes, and the session stays live. | `returned`, queue updated |

The keyboard pass answers option 1 and approves #184. The mouse pass answers option 1 and holds #184, so both outcomes are covered.

**Beat 12 when c1 is already settled.** The key map lets the user settle c1 on beat 9, before the bench. Record maps the picked attempt to a c1 resolution. A1 maps to Retry wins, and A3 maps to Split at the port. A2 cannot be picked once w3 disproves it.
- **c1 unsettled.** This is the route above. Record settles c1 through the same command ID clash uses. The bench pick and the choice each get a receipt.
- **c1 already settled the same way.** The user took Split on beat 9 and then records A3. Record keeps the bench pick and r3 and writes no new choice revision, as clash's same-kind settle is a no-op (`clash.mjs:188-191`). The ledger gains the bench rows and no c1 rows. Toast `Recorded A3. Now r3. c1 already split.`
- **c1 settled another way.** The user took Retry wins on beat 9 and then picks A3. Before Record, the action row reads `c1 is Retry wins · Record replaces it`. Record writes a new choice revision that supersedes the old one, as Undo does (`CORE.md`, clash rules). The plant draws only the new resolution. Toast `Recorded A3. c1 now Split, was Retry wins.`
- Ctrl Z never undoes a Record. The arena keeps one winner (`bench.mjs:217`).

**Copy at rest.** Every surface fits its `TEXT.md` budget at rest. Sentences that explain a state sit one key away, under Alt or in the layer named. Each toast shows a short form of at most 8 words, and the full sentence goes to the live region and under Alt, as quiet does (`quiet.mjs:209-213`).

| Surface and budget | At rest | One key away |
|---|---|---|
| Orders guide, rest 24 | `Pin real moments.`, two jump rows, two pin rows, Post | The guide sentence |
| Order card, card 60 | State line such as `CLAIMED · Claude Code · lease g1`, the sentence (user text, not counted), checks w1 to w3, budget, readback rows | Readback paragraphs, the Kvarm strip, evidence bindings (Alt, or `Sources`) |
| Question card, card 60 | The question and two answers of at most 12 words each | Each readback's reason |
| Clash card, card 60 | Title, place, breaks row, two declaration summaries, five options, forecast line | Consequence sentence, declaration bodies (disclosure), write paths |
| Gate card, card 60 | Title, agent and territory, `LIVE HARM · 4–8 min · guess`, the Meanwhile row, two actions | Cost, safe-to-wait and advice sentences, the advisory note |
| Bench card, card 60 | Header, three clauses, result grid, spend row, primary action | Question, wrong-if, not-proof and environment lines, each result's seen text |
| Review card, card 60 | Head, reviewer role, witness results, blockers, two actions | Rule text and diff summary |
| Brief card, card 60 | Header and one row per item, each at most 8 words (section 5) | Each item's full sentence |
| Queue, queue 24 at rest | Rows of at most 8 words, the header sum | Each row's why, cost and safe-to-wait |
| Toast, toast 8 | Short form | Full sentence in the live region and under Alt |

## 3. Key map

One key, one verb. New bindings use only CORE's free keys (I, M, P, U, V, their Shift forms, and Shift with a digit), plus F8 and Alt with a digit or arrow from world. Every other key keeps its ui-v1 meaning. The hint line always starts with the focused target, for example `Clash c1 · Shift 1–5 settle · I next clash · V footprints · Esc close`. A key marked context changes its target with the focused layer, and the hint names that target, so a Shift digit always says what it does before it is pressed.

The focused layer is the open card, or the queue, never both (section 1). The palette and the Layers menu sit above it while open. While a card is open, only card keys and global keys act. Plant keys are inert then, as clash does today (`clash.mjs:433`).

| Key | Does | Context | Replaces |
|---|---|---|---|
| Ctrl K | Jump to a place, machine, or decision. At plant level the results include Acquit's machines, the guide's jump rows while their pin is pending, and every queue row by id. | no | ui-v1 palette and world jump, merged |
| Alt 1 to 5, Alt ← → | Fly to plant N in world order. Back and forward in place history. | no | world |
| U | Waiting on you, opened with row 1 focused. It closes any open card. A row leaves when its decision is made (answered, settled, recorded, approved). An advised hold stays listed, marked `hold advised`. | no | gate U queue, world U |
| Shift U | Step away, and I'm back | no | gate P |
| Shift V | Network log | no | orders and clash U panel |
| F8 | Appearance. The journey cycles System, Light, Dark. Standalone concepts keep their Light and Dark toggle (`world.mjs:692`, `build.mjs:646`). | no | world F8 |
| F | Fit the plant, or fit the world at world level | context | ui-v1 F, world P and Shift P |
| X | Explode the Acquit stage, or cut away another plant | context | ui-v1 X, world X |
| 1 to 4 | Mode of the focused plant. Inert at world level and while a card is open. | context | ui-v1, world |
| M, Shift M | Pin must not, pin must keep, at the selection | plant only | orders. World bookmark moves to the palette as `Mark this place`. Gate allowance is the queue header button. |
| P | Post, which opens the order card. After Post, it opens the order card read-only. | plant only | orders. Gate step away moves to Shift U. Bench open moves to Shift 5. |
| I | Next decision. In the bench card, the brief card and the queue, I steps through that layer's own list (witness results, brief items, rows). Everywhere else, including the order, question, clash and gate cards, I opens the next unresolved decision pin on the focused plant, the question first and then clashes by id, cycling from the open one. With no unresolved pin, I opens the next queue row by class sort. | context | orders, clash, gate, bench, world I |
| V | Show declared footprints at plant level, contracts at world level. With a card open, footprints draw as outlines and their labels list in the card. | context | clash V, world V. Gate advise hold moves to Shift 2. |
| Enter | The focused layer's primary action. Keep, Post, Open, Fund, Extend, Record. In the queue it opens the focused row. In the bench, Record wins once a pick is drafted, then Extend while an attempt is spent and not extended, then Fund. | context | orders, gate, bench |
| Shift 1 to 5 | In a card, pick option N as numbered on the card. Answer, Settle, Open review, Advise hold, Pick, Approve or Hold, Back in. In the queue, open row N. The hint says which. | context | orders, clash, gate, bench, world Shift digits |
| Ctrl Z | Undo, in the focused mode only. In Blueprint it undoes the last blueprint edit (`blueprint.mjs:551`, `DECISIONS.md` 10). With a choices review open it undoes the last decision (`DECISIONS.md` 11). In Live it undoes the last clash settle while its toast stands. Elsewhere it does nothing. The hint shows `Ctrl Z undo` with its object only while it applies. | context | blueprint, choices, clash |
| Esc | Close the top layer only | no | all |

Retired in the journey are bench U (Enter is Extend while an attempt is spent) and world M. Bench P is also retired, because P is Post and the order card in orders and quiet (`orders.mjs:923`), and one key keeps one verb. The bench reopens from its plate on the plant, from the c1 card (open its settled mark, then Shift 5), and from Ctrl K `bench`. Shift 5 is new, and it appears only on the c1 card.

**Hints.** Every hint fits the island budget of 12 counted words in `TEXT.md`. Key names render as `<kbd>` and are not counted. The hint stays on one line, centred on `vw / 2`. Its right edge is at most `#nav` left minus 8, or `#worldMinimap` left minus 8 at world level, so it is at most 1040 px wide at plant level and 864 px at world level at 1280 x 800.

| Focused layer | Hint | Counted words |
|---|---|---|
| World level | `My world · Alt 1–5 plants · U waiting · Ctrl K go to · V contracts` | 7 |
| Plant, guide resting | `Retry · 15:44 · M must not · Shift M must keep · P post` | 7 |
| Witness card | `Witness w1 · Enter keep · Esc close` | 4 |
| Order card, draft | `Order r1 · type the sentence · Enter post · Esc close` | 7 |
| Order card, posted | `Order r2 · I next decision · Esc close` | 5 |
| Question card | `Question p-2307 · Shift 1–2 answer · Esc close` | 4 |
| Clash card | `Clash c1 · Shift 1–5 settle · I next clash · V footprints · Esc close` | 7 |
| Settle toast standing | the focused hint plus `· Ctrl Z undo settle` | at most 9 |
| Queue | `Waiting on you · Shift 1–N open row · I next · Esc close` | 7 |
| Gate card | `Breaker · Shift 1 open review · Shift 2 advise hold · Esc close` | 6 |
| Bench card | `Bench c1 · Enter fund · Shift 1–3 pick · I next result · Esc close`, with Enter's verb following the primary action | 7 |
| Review card | `Review #184 · Shift 1 approve · Shift 2 hold · Esc close` | 6 |
| Away | `Away until 17:30 · Shift U I'm back` | 5 |
| Brief card | `Back · 17:00 to 17:30 · I next item · Esc close` | 7 |

## 4. Seams and decisions

| Seam | Decision |
|---|---|
| Four egress counters (orders, clash, gate's 1664 B, world) and four pills | One session ledger. Every concept's send appends to it when hosted. The pill shows its sum, and the network log lists its rows (section 5). Gate's 1664 B is `list_pending_reviews` 640 plus two `get_reviews` of 512 (`gate-data.mjs:153-155`). The journey keeps the first and drops the two `get_reviews`, because their changes (#212 and #209) are not in the journey queue. World's 1664 B is its three reads (`world-data.mjs:92-94`). |
| Four waiting counts (ui-v1 7, world 5, gate list, clash 9) | One queue model in `journey-data.mjs`. Rows arrive from journey events. |
| Session names differ (`droid-payouts`, `cc-42`, `cx-17`) | Canonical table. `claude-payouts` is Claude Code on bot-cc. `droid-payouts` is Droid's readback session on bot-d2 (`core-data.mjs:58`). `droid-radar` stays Droid on `bot`, verifying radar-otel, and it owns d2, d3 and the breaker ghost (`acquit.mjs:155`, `core-data.mjs:79`, `core-data.mjs:88`). `codex-paypal` is Codex on bot-cx, passive (`acquit.mjs:165`). `claude-port` is Claude Code's bench workspace ws-a3. World's display names alias in, `cc-42` to `claude-payouts` and `cx-17` to `codex-paypal` (`world-data.mjs:97`). Standalone fixtures stay as they are. |
| Clash plate uses the placeholder sentence and assumes answer 1 | Clash and bench read sentence, answer and w3 from the orders handoff. |
| Clash seeds the orders end state and its own Kvarm log | Seeding happens only when standalone. Hosted, clash mounts on the live orders state and appends to the ledger. |
| Orders opens in Replay at 15:44:30 | Only on the first entry to Acquit, before any pin. Later entries keep the last mode and time. |
| Gate's away window replays 16:00 to 16:30 | The journey steps away forward, 17:00 to 17:30, from a new away fixture. Gate's past window stays for standalone. |
| World queue has p-2307 and c1 at boot, and an acan `claim` row where Codex holds g1 | p-2307, c1 and c2 rows come from journey events. The acan `claim` row is dropped under `kv=ok`. Under `kv=unmatched` it appears on Acquit, where orders' unmatched script puts Codex on g1. |
| Gate items not in the loop (webhook #212, traceparent, DatabaseSync, radar choices, verifier, retry x2) | Not in the journey queue. The retry x2 item conflicts with the live claude-payouts session. |
| World review #184 exists at boot on the Kvarm plant | #184 is created at beat 13 as Claude Code's paypal-payouts change. Its row lives on Acquit. The Kvarm site's condition reads `Review #184 blocks publication` while it waits, and `fresh · nothing waits` before. |
| World Acquit stage art against the ui-v1 stage | The ui-v1 stage is Acquit. World draws no stage for Acquit when hosted. |
| World Acquit revision `55825fe` on `radar/otel` | Override to sheet `3f2a91c` on `main`. |
| c1 can be settled by clash or bench | Both save the same canonical choice revision through one command ID. Bench selection and choice publication have separate receipts. Narrowed footprints and the contract commit keep their own receipts. Undo supersedes the choice. An uncertain remote decision remains unknown until reconciled. Section 2 covers a Record against a c1 that is already settled. |
| Card anchoring differs per concept | One right card slot, 392 px wide, and a leader (section 1). Orders 470, clash 560, gate 460, gate brief 540, bench 466, gate station 400 and orders guide 288 reflow to 392. |
| Light mode exists only in world, in warm vellum, and decks and inspector stay dark | One token sheet in `concepts/shell.mjs`, derived from the anatomy kit's neutral light theme (section 1). It replaces the `l-light-mode.md` vellum table. World's `--w-*` alias to it, and world's own light values are deleted. Every hard-coded colour in hosted CSS moves to a token. |
| Two palettes on Ctrl K | World jump wins, with Acquit machines merged in at plant level. |
| One hint per concept | One hint line, built from the focused layer's card (section 6). |
| World owns appearance and F8 | The shell owns them in the journey. One store serves the journey and the standalone concepts. The hash flag `appearance=` wins at load, and after that the choice lives in `sessionStorage` under `acan.appearance`. Today world and `build.mjs` read only the hash (`world.mjs:99`, `build.mjs:644`). Standalone concepts keep their two-stop F8, so their steps pass unchanged. |
| Three Ctrl Z meanings (blueprint, choices review, clash) | Ctrl Z acts in the focused mode only, and the hint names it (section 3). |
| `ordersActive()` checks the hash itself (`orders.mjs:188-190`) | Splits into `conceptKeys("orders")` for its key listener and `conceptActive("orders")` for its frame loop and clicks (section 6). |
| World coordinates are 1600 x 900 | The canvas keeps its viewBox and the camera fits the free rect. |

## 5. Fixtures that make the concepts agree

New file `concepts/journey-data.mjs`. It imports the other data files and adds only what the join needs. New numbers are marked new.

- **Sessions.** The canonical table from section 4.
- **Clock.** Beat stamps from section 2. The live clock island shows the stamp of the latest journey event. Bench results never read `EVENTS.minute`, which is each attempt's running spend (`bench-data.mjs:41-54`). journey-data gives each bench event a new `clock` field, from 16:36 at Fund to 16:53 when A3 is spent, and 16:55 for A3's extension result. Arrival still follows each event's `at` milliseconds after Fund, and the extension's 1300 ms after Extend (`bench-data.mjs:43-54`).
- **Queue rows.** Each row carries a gate class and an estimate from a fixture. Boot rows are `breaker` (live harm, 4 to 8 min, `gate-data.mjs:30-31`), `codex` (agent idle, 1 to 2 min, `gate-data.mjs:39-40`) and `digest` (publication waits, 1 to 3 min, `world-data.mjs:82`). Row `p-2307` takes world-data's 2 to 4 min, with class agent idle, new. Row c1 takes world-data's copy, 3 to 5 min, with class undo cost grows. New row `c2 · two migrations on effects queue rows`, class undo cost grows, 3 to 5 min, guess. New row `review-184`, class publication waits, 4 to 7 min, from world-data's review row. The queue header sums the estimates of the rows it lists, names those rows, and recomputes when a row arrives or leaves. At beat 11 it reads `9–18 min`, from breaker, codex, c1 and digest.
- **Plants.** Acquit revision `3f2a91c`, branch `main`. Conditions by state, starting with `paypal over budget · 4.1% of 2%`. acan-format's condition reads `Digest blocks publication`, new, in place of `Check digest needs review` (`world-data.mjs:44`). Its digest row already blocks publication (`world-data.mjs:82`), so the plant now says so at boot. Kvarm reads `fresh · nothing waits` until beat 13 (section 4).
- **Ledger.** Under `kv=ok` the ledger holds the rows below. Every displayed total is recomputed from these rows, and the network log lists the same rows. World's pending `record_decision` row for p-2307 (`world-data.mjs:96`) is dropped, because orders' `comment_issue` carries the answer.

| Beat | Rows and bytes | Source | Running total |
|---|---|---|---|
| 1 Boot | `list_repos` 768, `get_heads` 512, `get_leases` 384, `list_pending_reviews` 640 | `world-data.mjs:92-94`, `gate-data.mjs:153` | 2,304 |
| 4 Post | `create_issue` 612, `dispatch_issue` 148 | `core-data.mjs:135-136` | 3,064 |
| 6 Answer | `comment_issue` 296 | `core-data.mjs:138` | 3,360 |
| 7 Claim | `claim_task` 184, then `heartbeat_task` 88 every 120 s, kept as one row with a count (`orders.mjs:432`) | `core-data.mjs:133`, `core-data.mjs:139-140` | 3,544 plus heartbeats |
| 8 Declarations | `get_intent` 412, `forecast` 538 | `core-data.mjs:150-151` | 4,494 plus heartbeats |
| 10 Settle c2 | `record_decision` 356 | `core-data.mjs:160`, `core-data.mjs:175` | 4,850 plus heartbeats |
| 11 Advise hold | none, because the advice is local | | 4,850 plus heartbeats |
| 12 Bench | `create_arena` 1,184, `rank_arena` 412, `record_decision` 736, `select_arena_winner` 288, `resolve_escalation` 344, then c1's Split settle with `record_decision` 356, `git_push` 1,180, and `set_intent` 228 twice | `bench-data.mjs:56-64`, `core-data.mjs:160-169` | 9,806 plus heartbeats |
| 13 Review | `reviewChange`, and `requestPublication` when sent, as new rows with new byte counts | journey-data | |
| 15 Return | `readUpdates` and `readSnapshot`, as new rows with new byte counts | journey-data | |

- Adapter fixtures use domain operations and versioned normalized responses. Keep backend wire calls in the driver's evidence ledger, not in concept logic. Replace invented API names with mapped real operations or explicitly local actions. Advise hold is local and sends no request by itself. Discovery, snapshot reads, reviews, comparison actions, and writes each have scripted byte rows when the fixture sends them. Recompute every displayed total from those rows.
- **Timers.** New `declareMs 1200` after the claim. New `reviewMs 2000` after Record.
- **Review #184.** Author Claude Code on claude-payouts, rule `Required reviewer is not the author`, diff from bench A3 `4 files · +96 −20`.
- **Away, 17:00 to 17:30.** Back-at choices from `GATE.backAt`. Items sort by gate class. Each item is one brief row of at most 8 words, and its full sentence sits under Alt and in the live region.
  - 17:06 `CI #418 passed 5/5 · seal radar-otel ready`. Full sentence `CI #418 passed 5 of 5. Seal radar-otel is ready for your review.` It was forecast for 17:00 to 17:20. New stamp.
  - Codex, if its row is still open. `Codex waiting 69 min · own prompt`. The away fixture stores `codexAskedAt: "16:21"`, from `gate-data.mjs:125`, and `codexWaitedMin: 69`, which is 17:30 minus 16:21. The row prints the field.
  - 17:14 `Breaker declared via paypal.result v1 · hold advised`. Full sentence `Droid declared the breaker through paypal.result v1. Your hold is still advised.` New stamp.
  - If publication is confirmed, the brief names its observed commit and time. If only approval or queue acceptance is known, say approved or queued. A pending review remains held without implying the agent stopped.
  - Keep the 17:22 arrival row `Check waitlist artifact` as a scripted local event.
  - On return, call `readUpdates` and reconcile `readSnapshot` for authorized repositories. Show missing history and stale runtime evidence separately.
- Offline holds remote intentions at zero new bytes for a disabled connection. Show MATCHED with claim waiting for connection, not CLAIMED. Shared bench actions wait for required capabilities and connection. Local isolated experiments remain available. Count only actual held actions. Reconnect refreshes capabilities, permissions, revisions, policies, leases, and unknown outcomes before confirmation.
- **Seeds.** `SEEDS[<beat id>]` holds the snapshot of every mounted concept at each seed point in section 6. The keyboard pass and the seed pass both compare against it.

## 6. Architecture

**Compose. Do not merge.** New `concepts/journey.mjs` owns the shell, the key router, the beat machine, the queue, the ledger, the right card slot, the brief and `beat=` seeding. New `concepts/shell.mjs` holds what world and the journey share, which is the dark and light token sheet, appearance and F8, the ledger, and `slotPlace(card, entity)`, which puts a card in the right card slot and draws its leader. Each concept stays one module with its own steps files.

**Activation** (a shared change in `build.mjs`). Today `conceptActive` compares the hash read once at load (`build.mjs:636-637`), and orders adds its own hash check on every call (`orders.mjs:188-190`). The journey splits those two meanings.
- `conceptActive(id)` means mounted. It is true when the load hash was `c=<id>`, or when `c=journey` and the journey has mounted `id`. Timers, render loops and click handlers use it, so orders' frame loop (`orders.mjs:926-950`) and bench's timers (`bench.mjs:116`) run when hosted.
- `conceptKeys(id)` reads `location.hash` on each call and is true only when `c=<id>`. Each concept's raw key listener uses it, so no concept key listener fires under `c=journey`. The journey router calls the concept's verb instead. Orders' steps that switch the hash mid-run keep their behaviour, because orders' key check becomes `conceptKeys("orders")`.
- With no hash, nothing is active, so ui-v1 modes 1 to 4 behave as today.

**What each concept exports.** Each concept is a string of script inlined into one page, and its handlers are closures over its own state (`build.mjs` concatenates the scripts, and `clash.mjs`, `gate.mjs` and `bench.mjs` each define one `*Mount`). A uniform object interface would hide that world is unlike the others, so each concept exports only what the journey calls, prefixed with its id.
- Its existing init or mount, which now accepts a seed. A seed may be a snapshot from `SEEDS`.
- `<id>Card()` returns `{ html, entity, hint }` for the concept's card in its current state, or null. The journey puts the HTML in the right card slot, draws the leader to `entity`, and shows `hint` in the hint strip. Buttons in the HTML carry `data-verb` and `data-arg`.
- `<id>Verb(name, ...args)` runs one verb. The journey's key router maps the focused key to a verb, and one delegated click listener on the slot calls the same function, so keys and clicks reach the same code.
- `<id>Snapshot()` returns a plain object of the concept's state for the seed pass.

Concepts emit `acan:<event>` DOM events and never call each other. Timers stay inside the concepts, and the journey never steps a concept's clock. A `beat=` load mounts each concept from its seed, and the concept's timers start from there. Every seed point is a rest point, where no concept timer is pending except the lease heartbeat.

| `beat=` id | Seeds the state | Used by |
|---|---|---|
| `world` | After load, beat 1 | G6 task 6 |
| `intent` | End of beat 2, Replay 15:44:30, retry selected, guide resting | G6 task 1 |
| `readbacks` | End of beat 5, both readbacks in, question pin up | G6 task 2 |
| `declarations` | End of beat 8, c1 and c2 pinned, order card open | G6 task 3 |
| `gate` | End of beat 10, c2 settled, nothing open | G6 task 4 |
| `bench` | End of beat 11, breaker card open with a hold advised | G6 task 5 |
| `publish` | End of beat 12, after #184 arrives | seed pass |
| `away` | End of beat 13 | seed pass |
| `brief` | End of beat 14, at 17:30 before I'm back | seed pass |

| Concept | Seed in | Verbs | Events out |
|---|---|---|---|
| orders | sessions, ledger | pin, keep, post, question, answer, next, close | posted, readbacks, answered, claimed, stale |
| clash | order (sentence, rev, claimedBy, lease), witnesses, ledger | footprints, open, next, settle, undo, bench, close | settled (id, kind, via), undone |
| gate | queue, allowance 40, away fixture | queue, next, open, advise, review, stepAway, backIn, return | advised, opened, away, returned |
| bench | order r2, witnesses w1 to w3, c1 and its current choice, ledger | open, fund, next, extend, pick, record, close | funded, recorded (attempt, kind, rev) |
| world | plant overrides, queue, ledger | focus, back, forward, fit, contracts, jump | focus (plant, level) |

When hosted, each concept hides its own pill, network panel, hint, toolbar and queue, and the journey renders its card into the right card slot. World also hides its top bar, footer, bottom-left buttons, queue and network columns. Gate's station becomes the queue body.

**`fitRect` and anchoring.** The camera gains `fitRect(rect)`. It is more than one function, and these change with it.
- `fit()` scales the 1600 x 900 world into the whole stage (`build.mjs:368-373`). It fits the free rect instead.
- `select()` recentres the selection at `(innerWidth - 420) / 2` (`build.mjs:543-545`). It centres on the free rect's centre.
- `flyTo()` (`choices.mjs:162`) eases to the free rect's centre.
- Concept `anchor()` and `point()` read `world.getBoundingClientRect()` and `W` (`clash.mjs:151-158`, `gate.mjs:15-22`). They stay, because they read the live transform. Their visibility tests change. Clash's `inView` tests `x > 20`, `x < innerWidth - 20` and `y > 180` (`clash.mjs:172`). Orders' evidence check tests `top >= 100` and `bottom <= innerHeight - 40` (`orders.mjs:832`). Both test the free rect and the card slot instead.
- Each concept's own card placement code is removed, and `slotPlace` replaces it.
- Pin labels clamp inside the free rect.

**Shared-file changes needing sign-off.** `build.mjs` for `conceptActive`, `conceptKeys`, `fitRect`, `select` centring, the light token sheet, removing the dark pin on decks and inspector, the one-row bottom-left island, toast placement, and hiding `#cbar`. `run-steps.mjs` for an `APPEARANCE` variable that it appends to the hash as `&appearance=`, as it appends `&kv=` today. `concepts/index.mjs` to register journey. `drive.mjs` already reads `SIZE` (`drive.mjs:8`, `drive.mjs:18`), so it needs no change. Each concept gets the small edits above. Every existing steps file must pass unchanged afterwards, in dark. A step that asserts a light colour literal changes with the token sheet, and the step 4 report lists each one.

## 7. Verification

**Runs.** Each prints `OK`. Run them through `run-steps.mjs`, which holds the shared lock, one at a time.

```powershell
cd explore/ui-v2
$env:AUDIT = "1"
foreach ($a in "dark", "light") {
  $env:APPEARANCE = $a
  foreach ($s in "1280x800", "1440x900", "1600x900") {
    $env:SIZE = $s
    node run-steps.mjs concepts/journey.steps.json concepts/journey-mouse.steps.json
  }
}
```

- 1600 x 900 is in the matrix because `SHELL.md` measures there, and two audit findings (the world queue top and the clash card over Layers) showed only at that size.
- Run the offline, unmatched, and stale scripts through the claim beat, as `concepts/journey-kv-offline.steps.json`, `journey-kv-unmatched.steps.json` and `journey-kv-stale.steps.json`. Add adapter fixtures for absent optional capabilities, unidentified protocol, concurrent claim refusal, changed order, changed head, rejected fence, partial dispatch, and unknown decision outcome. These are behavior fixtures, not proof of a deployed server.
- `concepts/journey-seed.steps.json` (seed pass, below).
- Every existing concept steps file, and the no-hash build in ui-v1 modes 1 to 4.
- `concepts/journey-peer.steps.json` with `peer=1` on the open build, through the settle beat. Then the full keyboard pass on the open build with `team=1` in the hash. It must match the run without that flag in state, word counts and ledger. This is READINESS G10.

**Light checks.** These run at every shot of the light runs, as audit rules.
1. Contrast. `AUDIT=1` passes its contrast rule, 4.5:1 for text, and 3:1 for large text and marks, against the composited background.
2. Surface luminance. For every island, card, deck, inspector, queue, palette, toast and chip, composite its background colours over the page `#f2f2ef` and compute the relative luminance. Each must be at least 0.80. The darkest kit fill allowed for a surface, `#ededea`, is 0.845. The kit shade `#e5e5e2`, at 0.782, is a line or a plant side, never a surface fill. Graphite glass `rgba(18,18,18,.94)` composites to about 0.01 and fails.
3. No warm paper. The light build's CSS text, and the computed `background-color`, `color`, `border-color`, `fill` and `stroke` of every visible element, contain none of these values, compared without case and also as `rgb()`. World's light set is `#F4F1EA`, `#E5E0D5`, `#D6CFBF`, `#D4CFC3`, `#BDB5A5`, `#FCFAF5`, `#F8F5ED`, `#795A27`, `#E1D1AA`, `#17685D`, `#805400`, `#AC392B`, `#F6E1DC`, `#28658B`, `#EEEBE3`, `#EDF3F8`, `#F0F4EE`, `#F5ECDC`, `#F2EEE4`, `#C5C0B4`, `#D5D0C5`, `#E4E0D6`, `#343A40`, `#59616A`, `#929187`, `#CBC7BD`, `#1B1F24`, `#7B7465` and `rgba(252,250,245,…)`. The shell's warm light set adds `#A99F8C`, `#6B4700` and `#29251F`. The brass accents `#c9a45c`, `#B08D57` and `#D9B97A` are banned in light too.

**`journey.steps.json` outline.**
1. Boot. Assert `journeyState.beat`, queue `breaker, codex, digest`, pill sum equal to the ledger sum (2,304), and store `location.href` for the end check. Shot `journey-01-world`.
2. Keyboard pass, beats 2 to 15, with one shot per beat (`journey-02-intent` to `journey-15-brief`). At each beat, assert the handoff from section 2, pill sum equal to ledger sum, queue count equal to `.bl .wait b`, `journeyState.layer` naming at most one of card and queue, and focus unchanged across every timed arrival. At each seed point, assert each mounted concept's `<id>Snapshot()` equals `SEEDS[<id>]`.
3. End checks. `location.href` is unchanged, and `performance.getEntriesByType("navigation").length` is 1.

**`journey-mouse.steps.json`.** The mouse pass, beats 2 to 15, clicks only, holding #184. Shots `journey-m02` to `journey-m15`. Same end checks. It is its own file, so its single load is its one navigation, and no reload sits inside either pass.

**`journey-seed.steps.json`.** For each `beat=` id in section 6, set the hash, reload, and assert each mounted concept's `<id>Snapshot()` equals `SEEDS[<id>]`. Its navigation count equals the number of seeds loaded plus one.

Colour asserts compare against resolved tokens, not rgb literals, so the same file runs in both appearances. `AUDIT=1` runs `audit.mjs` at every shot.

**G6 cold tasks.** Each starts from a seeded load. Each predicate is evaluated 3 s after the agent's last input, unless the row names an event. An expert step is one key chord, one typed string, or one click, counted on the shortest route this spec ships.

| # | Start | One-line task | Success predicate | Expert steps |
|---|---|---|---|---|
| 1 | `beat=intent` | Post an order for paypal-payouts backed by one thing that must not happen and one that must keep working. | `ordersState.witnesses.some(w=>w.polarity==="must-not") && ordersState.witnesses.some(w=>w.polarity==="must-keep") && ordersState.order.state!=="draft"` | 10 (M, Enter, Ctrl K, `paypal`, Enter, Shift M, Enter, P, sentence, Enter) |
| 2 | `beat=readbacks` | The two agents read your order differently. Resolve it so one of them can take the work. | At 3 s, `ordersState.question.answered!==null`. Then `acan:claimed` fires within 10 s with no further input, and `ordersState.order.state==="claimed"`. | 2 (I, Shift 1) |
| 3 | `beat=declarations` | Two planned changes collide before any code is written. Settle both. | `!!clashState.settled.c1 && !!clashState.settled.c2` | 4 (I, Shift 1, I, Shift 1) |
| 4 | `beat=gate` | Droid wants to add a paypal breaker while c1 is still open. Ask Droid to hold off, without stopping it. | `journeyState.gate.held.includes("breaker")` | 3 (U, Shift 1, Shift 2) |
| 5 | `beat=bench` | Test the fixes for c1 against your witnesses and record the one to build. | `benchState.phase==="recorded" && !!clashState.settled.c1` | 6 (I, Shift 5, Enter, Enter, Shift 3, Enter). Picking A1 without Extend takes 5. |
| 6 | `beat=world` | Find the plant where publication is blocked and open it. | `journeyState.plant==="format"` | 1 (Alt 4, or one click on acan-format) |

`window.journeyState` holds `{ beat, clock, plant, level, layer, queue, ledger, gate: { held }, review, away, appearance }`. `layer` is `"card"`, `"queue"` or null. `gate.held` is an array of row ids with an advised hold.

## 8. Team pass (paid module)

This pass exists only in `live-journey-team.html` with `team=1`. It replays the journey with one teammate, Sam, who owns Droid on droid-radar and droid-payouts. The open journey in section 2 is unchanged and complete without it.

The paid team module uses the customer's own origin first. Hosted Acan runs the same module later. The first team beta enforces readback on managed clients. External leases without a matching readback remain visible as unmatched.

The origin decides who counts as an eligible reviewer other than the author. Anyone it counts as not the author may approve. Agents claim another person's order only when its audience is `team` and the agent's owner opted in.

| # | On beat | What changes | Words added at rest |
|---|---|---|---|
| T1 | 1 World | Top left reads `Team / Acquit · 2 here`. The pill names the team origin. Ctrl K offers `Follow Sam`. Follow shows `following Sam · Esc`, and any key stops it. | 3 |
| T2 | 5 to 7 Readbacks and claim | Droid's chip reads `DROID · Sam · authenticated`. Your Claude Code claims. Sam's side shows `yields · your lease`. | 1 per Sam chip |
| T3 | 9 Clash | The c1 card names each side's owner. Breaker wins narrows your plan and settles alone. Split and Retry wins read `needs Sam`. At 16:33:40 the pin reads `Sam · settling` while Sam's card is open. | 2 to 6 |
| T4 | 10 Settle | Serialize, radar-otel first narrows only your plan, so it settles alone. Toast `Settled c2. Sam's plan unchanged.` | 0 |
| T5 | 11 Gate | Advise hold on Sam's breaker. Toast `Hold advised. Sam's Droid keeps working.` Sam's queue gets one row. | 0 |
| T6 | 12 Bench | Record proposes Split for c1. The pin reads `proposed · waits on Sam`. Sam accepts after 2000 ms, and the toast reads `Sam accepted split on c1.` | 3 while waiting |
| T7 | 13 Review | Sam is an eligible reviewer under the origin's rule, so #184 goes to Sam. Your row reads `#184 · waits on team`. Sam approves, and the toast reads `Approved #184 as Sam.` | 4 |
| T8 | 14 Step away | The chooser adds `Team may take overdue · yes`. Ctrl K `Hand r3 to Sam` shows `HANDOFF → Sam · pending` until Sam accepts. | 4 |
| T9 | 15 Return brief | The brief lists `Sam accepted r3`, `Sam approved #184` and `Sam took · breaker`. `Team · 1 waiting` shows under your rows when an item is unowned. | 3 |

Following notifies the followed person. A person may hide Here, but never Acting, Away, or Offline. The overdue switch applies to each step-away and defaults to yes. A teammate may take an item only after its latest safe response time passes.

Every team byte appends to the session ledger, and the network log gains a `Seen by team` section behind the pill. Team toasts and rows keep the toast and row budgets of 8 words, and option rows keep the choice budget of 12.

The team pass does not gate the single-player go signal. Only the open-core proof in READINESS G10 joins the single-player go bar.

## Open questions

1. **Answer 2 on p-2307.** Answering `Mark it failed and refund the client` makes Droid's readback match, so Droid claims, as orders does today. **Default.** Droid on droid-payouts claims g1, and droid-radar's breaker becomes Droid's plan. With one agent in both territories, c1 and c2 never form. The journey shows `0 clashes before code`, skips the bench, and #184's author is Droid. This adds a `branch.failed` block in `journey-data.mjs` and a short steps file.
2. **Away time.** **Default.** Step away goes forward, 17:00 to 17:30, with the new away fixture in section 5. The alternative is to start the journey with the user just back at 16:30 and reuse gate's recorded window, but then the brief comes before the loop, not after it.
3. **Light scope.** **Decided (user, 2026-10-27).** All hard-coded colours in the ui-v1 stage and the five concepts move to the kit-derived tokens in this round, and the journey ships in both appearances. The review's proposal to ship dark first and leave light for a later round is rejected, because the user judged the light screens directly and named the dark cards on the light page as the defect.
4. **Stamped clock.** **Default.** The live clock shows the latest beat stamp, so it moves from 16:36 to 16:53 within about 5 s at the bench, and to 16:58 when #184 arrives 2000 ms after Record. The alternative is a clock that runs in real time from 16:30, which would move every later stamp and the away window.
5. **One-row bottom-left island.** **Default.** The bottom-left island is one row at both levels, and the ui-v1 agent rows and floor timeline move into the queue card. `SHELL.md` rule 4 still says `.fl.bl` is 168 tall and must change with it. The alternative keeps 168 and shortens the queue card to end above it, which cuts 120 px from the free rect's bottom-left corner.
