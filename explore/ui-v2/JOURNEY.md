# Journey spec: one session through the core loop

This is the build spec for go-bar line G1 in `READINESS.md`. It joins the five concepts into one shell and one continuous session. Read `CORE.md` and `DECISIONS.md` first. Their quality bar still holds, and this spec only adds what the join needs.

An agent self-claims after a current readback match and a live lease from the order's selected authority. The review allowance is advisory and never stops an agent or withholds an order. Enforced review rules block publication only. Kvarm is opt-in behind the coordination adapter, with consent to the selected origin and declared egress. Optional capabilities require compatible server reports and permission. Local solo use uses a single-device authority labeled local and requires no hosted account. The single-player core is open source. Multiplayer and hosted Acan are paid. The single-player journey is complete in the open build, and the paid team pass in section 8 exists only in the team build. The world is a canvas of systems, not agents. Appearance stays Light, Dark or System, with F8 per window. Core UX comes first. We dogfood with Droid.

## 1. Shell

**One page, no switching.** `node build.mjs journey` writes `live-journey.html`. The hash `c=journey` is read once at load. After that the URL never changes. There is no hash switching, no `pushState`, and no reload. Back and forward keep an in-memory place history. Optional load flags are `kv=ok|unmatched|stale|offline`, `appearance=light|dark|system`, `peer=1` (another principal's agent on the same origin), and `beat=<id>`, which seeds a later beat (see section 6). `TEAM=1 node build.mjs journey` writes `live-journey-team.html`, the only build that reads `team=1` and `me=you|sam` (section 8).

Other principals on the selected origin remain visible with their ownership and authentication evidence. Origin-authorized actions across people, including review, remain available in the open build. These facts and actions do not require the team module.

**Two levels, one canvas.** The world level is the world concept's canvas of five plants. Focusing Acquit eases the camera into the Acquit site, then swaps the world canvas for the ui-v1 stage, which is Acquit's real plant. The swap is instant, with no transition. The other four plants keep the world concept's own plant stage. Leaving Acquit reverses this.

**The island shell.** The journey runs on the one shell in `SHELL.md`. The stage draws full-bleed, and every control lives on a floating glass island. There are no bars and no docked panels. The world concept's old top bar, toolbar row, framed stage and docked inspector (`shots/world-07-levels.png`) are retired.

**Persistent chrome.** These islands never unmount and never move. `SHELL.md` fixes each slot and size.
- **Top left.** Brand, Back and Forward, the breadcrumb `My world / Acquit / paypal-payouts`, and Go to (Ctrl K). At plant level the palette results include Acquit's machines.
- **Top centre.** The mode chips Live, Blueprint, Simulate, Replay (1 to 4). They show at plant level only.
- **Top right.** Layers (L), Export, and the egress pill `local + kvarm · N B out`, where N is the sum of the session ledger (section 5). Click or Shift V opens the network log in the right card slot. Appearance is a select in the Layers menu, and F8 cycles System, Light, Dark. The choice is stored in `sessionStorage`, so it holds per window.
- **Hint strip.** The one hint line, centred in the strip row between the flanking islands. It always starts with the focused target (section 3).
- **Bottom left.** Waiting on you, one queue for the whole session, with its count. U opens the queue as the bottom-left card above the island. The count is the only waiting count on screen. The ui-v1 status panel's `.bl .wait b` shows the same number.
- **Bottom right.** Zoom, the readout, the live clock, and the connection readout. The connection readout shows the selected authority, origin, freshness, and relevant lease. Detail stays in its evidence card. It exposes unavailable capabilities and unmatched claims without permanent extra chrome. Clicking opens detail and changes no connection setting.
- **Right rail.** The compass. At world level the minimap takes the rail slot and yields to any card that covers it.

**Layout.** The camera fits its subject inside the free rect, which is the stage minus the islands and any open card. `SHELL.md` gives the rect at 1280 x 800, 1440 x 900 and 1600 x 900. The world level's canvas keeps its 1600 x 900 viewBox and fits the free rect. Toasts sit centred at the bottom of the free rect. The jump palette is a centred modal just under the strip row. The concept bar `#cbar` is hidden.

**Cards.** Every card renders in the right card slot, 392 px wide, from below the strip row to one row above the bottom islands, and fits without scrolling at 1280 x 800. The queue is the one exception and opens at bottom left. A card about a machine draws a leader from its header to that machine. If the machine is outside the free rect, the camera eases to it, and no other motion happens. This replaces each concept's own anchoring (orders top 100, clash left of nav, gate and bench at left). The stack order is concept card first, then the ui-v1 inspector. Opening a card closes the card below it in the slot. Esc reopens nothing.

## 2. Beats

T0 is 16:30, the end of the recorded hour that every fixture already uses. The journey clock in `journey-data.mjs` stamps each beat. Keys are the keyboard route, and Mouse is the mouse route. Both routes reach the same state. Times in brackets are journey clock stamps.

| # | Beat | Key | Mouse | What appears, and its anchor | Hands off |
|---|---|---|---|---|---|
| 1 | World [16:30] | load | load | Five plants. Queue pill `Waiting on you 3`. Acquit reads `paypal over budget · 4.1% of 2%`. The connection readout shows the discovered scripted state. The egress pill equals the scripted ledger total, not a hard-coded counter. No anchor. | queue `breaker, codex, digest`, normalized connection description and initial snapshots |
| 2 | Intent | Alt 2 | click Acquit | Camera eases in, then the ui-v1 stage replaces the canvas at Replay 15:44:30 with retry selected. Dock shows the orders guide `Point to what matters. Pin real moments. Agents replay their reading before they claim.` It is the dock's resting card until Post. Anchor retry. | `plant: acquit` |
| 3 | Pins | M, Enter, Home, `.` x5, Ctrl K `paypal` Enter, Shift M, Enter | `Retry · 15:44`, `Pin must not`, Keep, `PayPal · 15:35`, `Pin must keep`, Keep | Witness cards `MUST NOT · 15:44 · retry · loop depth 3 of 3` and `MUST KEEP · 15:35 · paypal · 1 try`. Anchor retry, then paypal. | `witnesses w1, w2` |
| 4 | Order [16:31] | P, type, Enter | Post, click sentence, type, Post | The order card shows the sentence, locked checks w1 and w2, and budget `paypal.error_rate < 2%`. Post switches to Live and calls `publishWork`. Show local, partial, and remote-open states honestly. Backend issue #41 and task t-41 are evidence locators. Anchor paypal. | `sentence` as typed, order r1 open only after confirmation |
| 5 | Readbacks | none | none | bot-cc arrives at 1400 ms and bot-d2 at 2600 ms. The card grows below its fold and keeps focus. The question pin appears at sqlite. Queue gains `p-2307 · keep pending?`. | `arrived claude-payouts, droid-radar` |
| 6 | Answer [16:32] | I, Shift 1 | click the sqlite pin, click option 1 | Question card `PayPal accepted payout p-2307, but the response was lost. What should happen to it?` Answer pins w3 at sqlite. Order is r2. Queue drops p-2307. Anchor sqlite. | `answer 1`, `w3 pending`, r2 |
| 7 | Claim | none | none | Rescore the exact current witness set, then let the matched agent call `claimWork`. Announce the result without moving focus. Unfog paypal-payouts only after an accepted live fence is bound to that match. Show the accepted lease in the connection evidence. | `claimedBy Claude Code`, accepted fence bound to the current match |
| 8 | Declarations [16:33] | none | none | 1200 ms after the claim, d1, d2 and d3 arrive. Clash pins c1 at the api to paypal belt and c2 at sqlite. Status `2 clashes before code`. Queue gains c1 and c2. Focus stays. | `declarations d1 d2 d3` |
| 9 | Clash | I | click the c1 pin | c1 card `Retry meets breaker`, `Breaks w3 · payout p-2307`. Options Shift 1 Split at the port (suggested), Shift 2 Retry wins, Shift 3 Breaker wins, Shift 4 Serialize, Shift 5 Test on the bench. V shows footprints with their sources. Anchor breaker. | `open c1` |
| 10 | Settle [16:34] | I, Shift 1 | click the c2 pin, click Serialize | c2 shows `Serialize, radar-otel first`. Toast `Settled before code. Choice saved locally.` Show remote choice sync separately. Queue drops c2. c1 stays open. | `settled c2 serialize`, choice receipt, dependency advisory until pinned |
| 11 | Gate [16:35] | U, Enter, Shift 2 | click the queue pill, click the breaker row, click Advise hold | The waiting card shows the allowance, estimates, their basis, and consequence classes. Advise hold records local advice. Toast `Hold advised on the breaker. Droid keeps working.` It neither sends a publication block nor changes task eligibility. Anchor breaker. | `gate.held breaker`, advisory only |
| 12 | Bench [16:36 to 16:55] | Esc, I, Enter, Shift 5, Enter, Enter, Shift 3, Enter | click the c1 row, click Test on the bench, Fund, Extend, A3, Record | Bench card with the three witness clauses. Fund, then results stream. A2 is disproved by w3. A1 holds. A3 is spent at 300000 tokens, Extend adds 100000 and 5 min, and A3 holds w3. Pick A3, Record. Toast `Recorded A3. Order is now r3. c1 settled as Split at the port.` Queue drops c1. | `bench a3`, r3, `settled c1 split via bench` |
| 13 | Publish or hold [16:58] | open the named #184 review, then Approve or Hold | click the #184 row, then Approve or Hold | The adapter exposes the actual head, reviewer role, frozen witness results, and remaining blockers. Approve calls `reviewChange` for that exact head. Publication is a separate authorized `requestPublication` action or a clearly disclosed existing server policy. Hold leaves the required human approval pending. If the server exposes a real hold, label its exact semantics. Agents keep working. Nothing says published until confirmed. Anchor paypal. | review receipt and queued, blocked, published, or unknown publication state |
| 14 | Step away [17:00] | Shift U, Shift 1 | click Step away, click `in 30 min` | Chooser with `in 30 min`, `in 1 h`, `in 2 h`, `tomorrow`. The stage dims with no animation. Top bar reads `Away until 17:30`. Hint `Shift U I'm back`. | `away backAt 17:30` |
| 15 | Return brief [17:30] | Shift U, I, Esc | click I'm back, click each item, close | Brief card `While you were away · 17:00 to 17:30`. I flies to each item's machine or plant. Items are listed in section 5. Esc closes, and the session stays live. | `returned`, queue updated |

The keyboard pass answers option 1 and approves #184. The mouse pass answers option 1 and holds #184, so both outcomes are covered.

## 3. Key map

One key, one verb. New bindings use only CORE's free keys (I, M, P, U, V, their Shift forms, and Shift with a digit), plus F8 and Alt with a digit or arrow from world. Every other key keeps its ui-v1 meaning. The hint line always starts with the focused target, for example `Clash c1 · Shift 1 to 5 settle · I next clash · V footprints · Esc close`. A key marked context changes its target with the focused layer, and the hint names that target.

The focused layer is the dock card if one is open, or the left drawer if it was opened last. While a dock card is open, only card keys and global keys act. Plant keys are inert then, as clash does today.

| Key | Does | Context | Replaces |
|---|---|---|---|
| Ctrl K | Jump to a place, machine, or decision. At plant level the results include Acquit's machines. | no | ui-v1 palette and world jump, merged |
| Alt 1 to 5, Alt ← → | Fly to plant N in world order. Back and forward in place history. | no | world |
| U | Waiting on you drawer, opened with row 1 focused. A row leaves when its decision is made (answered, settled, recorded, approved). An advised hold stays listed, marked `hold advised`. | no | gate U queue, world U |
| Shift U | Step away, and I'm back | no | gate P |
| Shift V | Network log | no | orders and clash U panel |
| F8 | Appearance, System then Light then Dark | no | world F8 |
| F | Fit the plant, or fit the world at world level | context | ui-v1 F, world P and Shift P |
| X | Explode the Acquit stage, or cut away another plant | context | ui-v1 X, world X |
| 1 to 4 | Mode of the focused plant. Inert at world level and while a card is open. | context | ui-v1, world |
| M, Shift M | Pin must not, pin must keep, at the selection | plant only | orders. World bookmark moves to the palette as `Mark this place`. Gate allowance is the drawer header button. |
| P | Post, which opens the order card | plant only | orders. Gate step away moves to Shift U. Bench open moves to Shift 5. |
| I | Next question, clash, witness result, review or brief item. With no card open, the next queue row. | context | orders, clash, gate, bench, world I |
| V | Show declared footprints at plant level, contracts at world level | context | clash V, world V. Gate advise hold moves to Shift 2. |
| Enter | The card's primary action. Keep, Post, Open, Fund, Extend, Record. | context | orders, gate, bench |
| Shift 1 to 5 | Pick option N in the focused card. Answer, Settle, Advise hold, Pick, Approve or Hold, Back in. In the drawer it opens row N. | context | orders, clash, gate, bench, world Shift digits |
| Ctrl Z | Undo the last settle while its toast stands | context | clash |
| Esc | Close the top layer only | no | all |

Retired in the journey are bench U (Extend is Enter when the attempt is spent), bench P (Esc closes the bench), and world M. Shift 5 is new, and it appears only on the c1 card.

## 4. Seams and decisions

| Seam | Decision |
|---|---|
| Four egress counters (orders, clash, gate's fixed 1664 B, world) and four pills | One session ledger. Every concept's send appends to it when hosted. The pill shows its sum. The network log lists its rows. |
| Four waiting counts (ui-v1 7, world 5, gate list, clash 9) | One queue model in `journey-data.mjs`. Rows arrive from journey events. |
| Session names differ (`droid-payouts`, `cc-42`, `cx-17`) | Canonical table. `claude-payouts` is Claude Code on bot-cc. `droid-radar` is Droid on bot-d2. `codex-paypal` is Codex on bot-cx, passive. `claude-port` is Claude Code's bench workspace ws-a3. Hosted concepts take aliases from the seed, so standalone fixtures stay as they are. |
| Clash plate uses the placeholder sentence and assumes answer 1 | Clash and bench read sentence, answer and w3 from the orders handoff. |
| Clash seeds the orders end state and its own Kvarm log | Seeding happens only when standalone. Hosted, clash mounts on the live orders state and appends to the ledger. |
| Orders opens in Replay at 15:44:30 | Only on the first entry to Acquit, before any pin. Later entries keep the last mode and time. |
| Gate's away window replays 16:00 to 16:30 | The journey steps away forward, 17:00 to 17:30, from a new away fixture. Gate's past window stays for standalone. |
| World queue has p-2307 and c1 at boot, and an acan `claim` row where Codex holds g1 | p-2307, c1 and c2 rows come from journey events. The acan `claim` row is dropped under `kv=ok`. Under `kv=unmatched` it appears on Acquit, where orders' unmatched script puts Codex on g1. |
| Gate items not in the loop (webhook #212, traceparent, DatabaseSync, radar choices, verifier, retry x2) | Not in the journey queue. The retry x2 item conflicts with the live claude-payouts session. |
| World review #184 exists at boot on the Kvarm plant | #184 is created at beat 13 as Claude Code's paypal-payouts change. Its row lives on Acquit. The Kvarm site's condition reads `Review #184 blocks publication` while it waits, and `fresh · nothing waits` before. |
| World Acquit stage art against the ui-v1 stage | The ui-v1 stage is Acquit. World draws no stage for Acquit when hosted. |
| World Acquit revision `55825fe` on `radar/otel` | Override to sheet `3f2a91c` on `main`. |
| c1 can be settled by clash or bench | Both save the same canonical choice revision through one command ID. Bench selection and choice publication have separate receipts. Narrowed footprints and the contract commit keep their own receipts. Undo supersedes the choice. An uncertain remote decision remains unknown until reconciled. |
| Card anchoring differs per concept | One dock and a leader (section 1). Clash at 560 px and the gate brief at 540 px reflow to dock width. |
| Light mode exists only in world | One token sheet in `concepts/shell.mjs`. Light values come from the `l-light-mode.md` table. World's `--w-*` alias to it. Every hard-coded colour in hosted CSS moves to a token. |
| Two palettes on Ctrl K | World jump wins, with Acquit machines merged in at plant level. |
| One hint per concept | One hint line, built from the focused layer's `hint()`. |
| World owns appearance and F8 | The shell owns them. World standalone calls the same shell code. |
| `ordersActive()` checks the hash itself | Moves into `conceptActive()` in `build.mjs`, which reads the hash on each call, so orders' steps that switch hash mid-run keep passing. |
| World coordinates are 1600 x 900 | The canvas keeps its viewBox and the camera fits the free rect. |

## 5. Fixtures that make the concepts agree

New file `concepts/journey-data.mjs`. It imports the other data files and adds only what the join needs. New numbers are marked new.

- **Sessions.** The canonical table from section 4.
- **Clock.** Beat stamps from section 2. Bench result stamps follow `EVENTS.minute` from 16:36, so A3's extension lands at 16:55.
- **Queue rows.** Boot rows `breaker`, `codex` (gate-data) and `digest` (world-data). New row `c2 · two migrations on effects queue rows`, class undo cost grows, 3 to 5 min, guess. Row c1 takes world-data's copy with class undo cost grows. New row `review-184`, class publication waits, 4 to 7 min, from world-data's review row.
- **Plants.** Acquit revision `3f2a91c`, branch `main`. Conditions by state, starting with `paypal over budget · 4.1% of 2%`.
- Adapter fixtures use domain operations and versioned normalized responses. Keep backend wire calls in the driver's evidence ledger, not in concept logic. Replace invented API names with mapped real operations or explicitly local actions. Advise hold is local and sends no request by itself. Discovery, snapshot reads, reviews, comparison actions, and writes each have scripted byte rows when the fixture sends them. Recompute every displayed total from those rows.
- **Timers.** New `declareMs 1200` after the claim. New `reviewMs 2000` after Record.
- **Review #184.** Author Claude Code on claude-payouts, rule `Required reviewer is not the author`, diff from bench A3 `4 files · +96 −20`.
- **Away, 17:00 to 17:30.** Back-at choices from `GATE.backAt`. Items sort by gate class.
  - 17:06 `CI #418 passed 5 of 5. Seal radar-otel is ready for your review.` It was forecast for 17:00 to 17:20. New stamp.
  - Codex, if its row is still open. `Codex has waited 69 min at its own prompt.` Derived from its 16:21 ask.
  - 17:14 `Droid declared the breaker through paypal.result v1. Your hold is still advised.` New stamp.
  - If publication is confirmed, the brief names its observed commit and time. If only approval or queue acceptance is known, say approved or queued. A pending review remains held without implying the agent stopped.
  - Keep the 17:22 arrival row `Check waitlist artifact` as a scripted local event.
  - On return, call `readUpdates` and reconcile `readSnapshot` for authorized repositories. Show missing history and stale runtime evidence separately.
- Offline holds remote intentions at zero new bytes for a disabled connection. Show MATCHED with claim waiting for connection, not CLAIMED. Shared bench actions wait for required capabilities and connection. Local isolated experiments remain available. Count only actual held actions. Reconnect refreshes capabilities, permissions, revisions, policies, leases, and unknown outcomes before confirmation.

## 6. Architecture

**Compose. Do not merge.** New `concepts/journey.mjs` owns the shell, the key router, the beat machine, the queue, the ledger, the dock and drawer, the brief and `beat=` seeding. New `concepts/shell.mjs` holds what world and the journey share, which is the token sheet, appearance and F8, the ledger, and `dockPlace(card, entity)`. Each concept stays one module with its own steps files.

**Activation** (a shared change in `build.mjs`). `conceptActive(id)` reads the hash on each call. It is true when `c=<id>`, or when `c=journey` and the journey has mounted `id`. A new `conceptKeys(id)` is true only when `c=<id>`. Each concept guards its raw key listener with `conceptKeys` and its logic with `conceptActive`. With no hash, nothing is active, so ui-v1 modes 1 to 4 behave as today. The camera gains `fitRect(rect)` for the free rect.

**What each concept exposes.** Each registers `window.acanConcepts[id] = { mount(seed), unmount(), act(verb, ...args), state(), hint(), advance(ms) }`. `act` reaches every step the keys reach. `advance` steps its scripted timers synchronously, for `beat=` seeding. Concepts emit `acan:<event>` DOM events and never call each other.

| Concept | Seed in | Verbs | Events out |
|---|---|---|---|
| orders | sessions, ledger | pin, keep, post, question, answer, next, close | posted, readbacks, answered, claimed, stale |
| clash | order (sentence, rev, claimedBy, lease), witnesses, ledger | footprints, open, next, settle, undo, close | settled (id, kind, via), undone |
| gate | queue, allowance 40, away fixture | queue, next, open, advise, review, stepAway, backIn, return | advised, opened, away, returned |
| bench | order r2, witnesses w1 to w3, c1, ledger | fund, next, extend, pick, record, close | funded, recorded (attempt, kind, rev) |
| world | plant overrides, queue, ledger | focus, back, forward, fit, contracts, jump | focus (plant, level) |

When hosted, each concept hides its own pill, network panel, hint and queue, and renders its card into the dock. World also hides its top bar, footer, bottom-left buttons, queue and network columns. Gate's station becomes the drawer body.

**Shared-file changes needing sign-off.** `build.mjs` for `conceptActive`, `conceptKeys`, `fitRect` and hiding `#cbar`. `drive.mjs` for a `SIZE=WxH` environment variable in place of the fixed 1600 x 900. `concepts/index.mjs` to register journey. Each concept gets the small edits above. Every existing steps file must pass unchanged afterwards.

## 7. Verification

**Runs.** Each prints `OK`.
- `SIZE=1280x800 AUDIT=1 node drive.mjs live-journey.html c=journey concepts/journey.steps.json shots/journey-1280`
- The same at `SIZE=1440x900`, then both again with `c=journey&appearance=light`.
- Run the offline, unmatched, and stale scripts through the claim beat. Add adapter fixtures for absent optional capabilities, unidentified protocol, concurrent claim refusal, changed order, changed head, rejected fence, partial dispatch, and unknown decision outcome. These are behavior fixtures, not proof of a deployed server.
- Every existing concept steps file, and the no-hash build in ui-v1 modes 1 to 4.
- `concepts/journey-peer.steps.json` with `peer=1` on the open build, through the settle beat. Then the full keyboard pass on the open build with `team=1` in the hash. It must match the run without that flag in state, word counts and ledger. This is READINESS G10.

**`journey.steps.json` outline.**
1. Boot. Assert `journeyState.beat`, queue `breaker, codex, digest`, pill sum equal to the ledger sum, and `location.href` stored for the end check. Shot `journey-01-world`.
2. Keyboard pass, beats 2 to 15, with one shot per beat (`journey-02-intent` to `journey-15-brief`). At each beat, assert the handoff from section 2, pill sum equal to ledger sum, queue count equal to `.bl .wait b`, and focus unchanged across every timed arrival.
3. `eval location.reload()`, the one reload, outside the journey under test.
4. Mouse pass, beats 2 to 15, clicks only, holding #184. Shots `journey-m02` to `journey-m15`.
5. Seed pass. For each `beat=` id, load and compare `state()` of every mounted concept with the snapshot the keyboard pass took at that beat.
6. End checks. `location.href` is unchanged within each pass, and `performance.getEntriesByType("navigation").length` is 1.

Colour asserts compare against resolved tokens, not rgb literals, so the same file runs in both appearances. `AUDIT=1` runs `audit.mjs` at every shot.

**G6 cold tasks.** Each starts from a seeded load. Each predicate is evaluated 3 s after the agent's last input.

| # | Start | One-line task | Success predicate | Expert steps |
|---|---|---|---|---|
| 1 | `beat=intent` | Post an order for paypal-payouts backed by one thing that must not happen and one that must keep working. | `ordersState.witnesses.some(w=>w.polarity==="must-not") && ordersState.witnesses.some(w=>w.polarity==="must-keep") && ordersState.order.state!=="draft"` | 10 |
| 2 | `beat=readbacks` | The two agents read your order differently. Resolve it so one of them can take the work. | `ordersState.question.answered!==null && ordersState.order.state==="claimed"` | 2 |
| 3 | `beat=declarations` | Two planned changes collide before any code is written. Settle both. | `!!clashState.settled.c1 && !!clashState.settled.c2` | 4 |
| 4 | `beat=gate` | Droid wants to add a paypal breaker while c1 is still open. Decide what happens to it. | `journeyState.gate.held.includes("breaker") \|\| journeyState.gate.opened.includes("breaker")` | 3 |
| 5 | `beat=bench` | Test the fixes for c1 against your witnesses and record the one to build. | `benchState.phase==="recorded" && !!clashState.settled.c1` | 3 |
| 6 | `beat=world` | Find the plant where publication is blocked and open it. | `journeyState.plant==="format"` | 2 |

`window.journeyState` holds `{ beat, clock, plant, level, queue, ledger, gate: { held, opened }, review, away, appearance }`.

## 8. Team pass (paid module)

This pass exists only in `live-journey-team.html` with `team=1`. It replays the journey with one teammate, Sam, who owns Droid on droid-radar. The open journey in section 2 is unchanged and complete without it.

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

1. **Answer 2 on p-2307.** Answering `Mark it failed and refund the client` makes Droid's readback match, so Droid claims, as orders does today. **Default.** Droid on droid-radar holds g1, and its own breaker becomes its plan. With one agent in both territories, c1 and c2 never form. The journey shows `0 clashes before code`, skips the bench, and #184's author is Droid. This adds a `branch.failed` block in `journey-data.mjs` and a short steps file.
2. **Away time.** **Default.** Step away goes forward, 17:00 to 17:30, with the new away fixture in section 5. The alternative is to start the journey with the user just back at 16:30 and reuse gate's recorded window, but then the brief comes before the loop, not after it.
3. **Light scope.** **Default.** All hard-coded colours in the ui-v1 stage and the five concepts move to tokens in this round, so G2 passes in light. The alternative is light for the shell and cards only, with the stage dark, which fails G2 and the contrast audit.
