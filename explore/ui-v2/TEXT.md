# Text system

This document sets how many words the ui-v2 concepts may show, how those words are counted, and which words must never be hidden. `concepts/quiet.mjs` follows it, and `concepts/quiet.steps.json` checks it on every beat.

## The rule

At rest, a screen shows state, not explanation. Each surface shows the state word, the actor, and the number that drives the next decision. Sentences that explain the state come one key away. Hold Alt to show them, or open the layer that owns them.

A value that changes what the user does next is visible at rest or one key away, never further. That is the honesty rule, and it overrides every budget below.

## Budgets

Words are counted per surface and per row, at rest. A screen passes when no surface, no row, and no screen total goes over its budget. Numbers on a surface are words, so `3/3` counts as one.

| Class | Budget | What it covers |
|---|---|---|
| pill | 6 | One chip on the stage, a mark, or the egress pill. |
| row | 8 | One line inside a card or the queue, such as a readback, a check, or a kv row. |
| choice | 12 | One answer row in a question, or one palette row. |
| toast | 8 | The toast. |
| island | 12 | A shell island: nav, hint strip, watermark, command bar, or a corner panel. |
| queue | 24 | The bottom-left queue panel. |
| deck | 30 | The replay deck or simulation deck. |
| card | 60 | The open card, the kv panel, or the provenance popover. |
| rest | 24 | The dock or guide while no card is open. |
| empty | 20 | A surface marked `data-empty`, such as the guide before any witness arrives. |
| palette | 40 | The whole command palette. |
| plant | 20 | All stage text that is not covered by an island, summed. |
| other | 0 | Text outside every known surface. Any word here is a failure. |
| screen | 150 | Every counted word on a team screen. |
| solo | 136 | Every counted word on a solo screen. The 14 between solo and screen is the team reserve. |

Budgets do not apply while the screen is in reveal mode. Reveal mode means `body.alt` is set, or one of `#P-prov`, `#P-kv-panel`, `#net`, `#layers`, or `#ex` is visible. Reveal mode is where the long text lives, so the count is still recorded but not judged.

## Counting rule

The counter is `textCount(P)`, where `P` is the concept prefix (`quiet`). It is defined by the eval step that starts with `window.TEXT_BUDGET` in `concepts/quiet.steps.json`, once after each page load. `textBudget(P)` returns the list of overruns, and the steps file expects it to be empty after every shot. The code uses only the DOM and the selectors below, so `audit.mjs` can lift it without changes.

1. Walk every text node under `body` with a TreeWalker.
2. Skip text inside `script, style, title, desc, defs, noscript, textarea, input, select, option, kbd, .mono, .pal-row .ic, [data-text=glyph]`. Key caps, code, and glyph art are not words.
3. Skip hidden text. Text is hidden when any ancestor has `display: none`, `visibility` other than `visible`, or `content-visibility: hidden`. It is also hidden when the product of ancestor opacities is below 0.05, or when it sits inside a closed `<details>` outside the `<summary>`.
4. Skip text that is not on screen. The text needs a client rect larger than 1 px that intersects the viewport. Its centre must not be clipped by an ancestor whose `overflow` is not `visible`. Stage text whose centre sits under a visible island is skipped, because the island covers it.
5. Count user text apart. Text inside `[data-text=user]` or `.P-sentence` goes to a separate `user` tally and not to the screen total. The user wrote it, so it is not copy the product added.
6. Split on whitespace. A token is a word when it holds a letter or a digit. A unit token (`B, KB, MB, GB, ms, s, S, min, m, h, %, rps`) right after a number is not a second word, so `1,336 B` counts as one.
7. Assign each word to the nearest ancestor that matches a surface, checked in this order:
   - toast is `#toast`;
   - palette is `#pal`;
   - pill is `#chips .chip, .P-mark, .egress`;
   - card is `#P-card, #P-dock, #P-guide, #P-kv-panel, #P-prov, #insp, .pop`, refined to `empty` for `[data-empty]` and to `rest` for the dock and guide;
   - island is `.fl, #nav, .hint, #watermark, #cbar`, refined to `queue` for `.fl.bl` and to `deck` for `#rpdeck` and `.simdeck`;
   - plant is `#stage`;
   - anything else is `other`.
8. Also assign each word to the nearest row, if any. Rows are `.bl .wait, .bl .agent, .bl .tl, .P-reading, .P-mini, .P-check, .P-kv-row, .P-answer, .P-bindings summary, .P-bindings button, #P-guide button, .pal-list > *`. Rows matching `.P-answer` or `.pal-row` use the choice budget.

`textBudget` judges the total against `solo` unless an element on the page carries `[data-team]`.

`textBind(P)` adds one more check. Any token with a digit inside the card, the dock, a bot chip, or a witness chip must sit inside `[data-P-binding]`, so a number on screen always links to its source. It ignores `kbd`, `textarea`, `[data-P-meta]`, and `.P-kv`.

## Honesty rule

A value that changes what the user does next is either visible at rest or one key away. The steps file asserts each at-rest value with `textSeen`, which reads only shown text, on the beats `01-replay`, `10-claim`, `11-inspect`, `kv-unmatched-flag`, and `kv-unmatched`.

Visible at rest, on every beat where the value exists:

| Value | Example | Why it cannot hide |
|---|---|---|
| Bytes sent off the machine | `local + kvarm · 1,336 B out` | The user must know when data leaves. |
| Order state and holder | `UNMATCHED · Codex holds g1 · no readback`, `CLAIMED · Claude Code · lease g1` | It decides whether to act or wait. |
| Who scored the readback | `READBACK · ACAN` | A score without its source reads as the agent's own claim. |
| Evidence on each chip of an agent with an Acan session | `declared`, `authenticated` | A declared agent and an authenticated one look the same otherwise. |
| The lease holder row | `Codex unmatched · holds g1` | The holder is not in the queue, so this row is the only place it shows. |
| The blocking gate | `Select paypal at 15:35` | It is the next action. |

One key away, never further:

| Value | Example | Where | Reach |
|---|---|---|---|
| What an agent cannot see | `Codex cannot see orders` | The order card | `P` |
| Why a reading differs | the readback paragraph | Under Alt | `Alt` |
| Where a bound number came from | `declared · your order` | The provenance popover | click, or `Sources` in the card |
| The full kvarm status | issue, lease, egress per call | The kv panel | `U` |

These also move behind Alt or a layer: sentences that explain a state, session names, per-witness scores, the replay story, and palette sublines.

A glyph never carries one of the values above alone. The old quiet used `◇` and `◆` for declared and authenticated. They now read as words.
## Copy rules

- Put the state word first, in capitals: `OPEN`, `CLAIMED`, `UNMATCHED`, `DRAFT`.
- Name the actor, not the role: `Codex holds g1`, not `another agent holds the lease`.
- Join facts with ` · `, not with sentences.
- Show keys as `<kbd>`. The counter skips them, so a key hint costs nothing.
- Toasts are 8 words or fewer: `Claude Code claimed. Readback matched 3 of 3.`
- Concepts write hints into the shell's `.hint` strip and do not hide shell islands.
- Colours come from shell tokens (`--text`, `--ink`, `--dim`, `--faint`, `--focus`, `--line2`, `--hover`). Concept surfaces carry `pop open`, so light mode reaches them.

## Directions

Seven directions were weighed. Each is scored from 1 to 5 on scan speed (how fast the eye finds the state), honesty (whether the values in the honesty rule stay visible), and keyboard reach (how many keys it takes to reach the hidden text). Only A and E were built and measured. The others are scored by reading their precedent against the shots and the honesty table, so their scores are judgment, not measurement.

| Direction | Precedent | Scan | Honest | Keys | Total | Why |
|---|---|---|---|---|---|---|
| A. Full sentences everywhere | `orders.mjs` | 2 | 4 | 5 | 11 | Nothing is hidden, but cards reach 211 words and screens reach 309. The state word is lost in the paragraphs. |
| B. Copy edit only | Linear | 3 | 4 | 5 | 12 | Shorter strings in the same layout. Readback and check rows stay sentences, so cards still hold about 100 words. |
| C. Glyph HUD | Factorio, Mini Metro | 5 | 1 | 3 | 9 | The fastest scan for a trained eye. Evidence, holder, and source become shapes that a new user cannot read, which the honesty rule forbids. |
| D. Data-ink table | Tufte | 4 | 5 | 2 | 11 | A dense grid per card compares witnesses well. It needs cell navigation to reach anything, and the card goes past 60 words once headers are added. |
| E. State at rest, sentences under Alt | Apple HIG progressive disclosure | 4 | 5 | 4 | **13** | State words and bound numbers stay. Sentences are one held key away. |
| F. One-line summary per agent | Things | 5 | 2 | 3 | 10 | One line per agent with an inspector behind Enter. It hides the holder row and the readback source, which fails the honesty rule. |
| G. Labels on canvas, properties on selection | Figma | 4 | 3 | 3 | 10 | The plant shows names only, and the open card acts as a properties panel for the one selected thing. Evidence and holder on chips that are not selected drop out, and every fact costs a selection first. |

E is the pick. It is the only direction that scores 4 or more on every axis. G is the nearest runner-up in layout, and quiet already borrows its card-as-inspector shape. It loses because it ties honesty to selection. It keeps every value in the honesty table visible, and Alt reaches all other text without moving focus. It also cut every measured dark beat by 41 to 62 percent, with no surface over budget.

## Measured result

Before is `orders.mjs`, the concept quiet was cut from, run through its own steps with the same counter injected. After is `quiet.mjs`. Over is the number of surfaces, rows, and screen totals past budget, judged against the solo cap of 136. Alt is the count with `body.alt` set. Both runs were on 2026-10-26 at 1600x900, the drive.mjs default, in dark and light.

| Beat | Before | After | Change | Over before | Over after | Alt after |
|---|---|---|---|---|---|---|
| 01-replay | 170 | 89 | -48% | 3 | 0 |  |
| 02-must-not | 204 | 103 | -50% | 3 | 0 |  |
| 03a-palette | 249 | 108 | -57% | 5 | 0 |  |
| 03-must-keep | 196 | 97 | -51% | 3 | 0 |  |
| 04-post-draft | 244 | 110 | -55% | 6 | 0 |  |
| 05-open | 197 | 108 | -45% | 7 | 0 |  |
| 06-first-readback | 235 | 111 | -53% | 7 | 0 |  |
| 07-readbacks | 267 | 116 | -57% | 8 | 0 |  |
| 08-question | 176 | 95 | -46% | 6 | 0 |  |
| 08b-question-pin | 154 | 91 | -41% | 6 | 0 |  |
| 09-answer | 169 | 95 | -44% | 7 | 0 |  |
| 09b-rescored | 180 | 96 | -47% | 7 | 0 |  |
| 10-claim | 180 | 101 | -44% | 7 | 0 | 207 |
| 10-claim-light | 169 | 101 | -40% | 6 | 0 |  |
| 11-inspect | 308 | 118 | -62% | 10 | 0 | 353 |
| 11-inspect-light | 308 | 118 | -62% | 10 | 0 |  |
| kv-unmatched-flag | 277 | 130 | -53% | 9 | 0 |  |
| kv-unmatched-flag-light | 277 | 130 | -53% | 9 | 0 |  |
| kv-unmatched | 309 | 135 | -56% | 10 | 0 | 408 |
| kv-unmatched-light | 309 | 135 | -56% | 10 | 0 |  |
| kv-provenance (reveal) | 361 | 180 | -50% | exempt | exempt |  |

Light gives the same counts as dark, with one exception. `orders` 10-claim-light reads 169 against 180 because its 11-word toast had faded by the time the light shot ran, a few hundred milliseconds after the dark one. Alt shows 207 to 408 words, so the cut text is still one key away.

The largest surfaces, before and after:

| Beat | Card | Longest row | Deck | Rest | Palette | Queue |
|---|---|---|---|---|---|---|
| 01-replay | none | 5 / 3 | 60 / 20 | 59 / 18 (empty) | none | none |
| 03a-palette | none | 14 / 8 (choice) | 62 / 22 | 65 / 18 | 92 / 38 | none |
| 07-readbacks | 164 / 32 | 41 / 6 | none | none | none | 24 / 16 |
| 10-claim | none | 14 / 5 | none | 67 / 14 | none | 24 / 16 |
| 11-inspect | 211 / 43 | 46 / 7 | none | none | none | 24 / 16 |
| kv-unmatched-flag | 165 / 34 | 41 / 6 | none | none | none | 28 / 23 |
| kv-unmatched | 194 / 44 | 47 / 7 | none | none | none | 30 / 20 |

Most of the cut came from two places. The 11-inspect card held readback paragraphs of 46 and 30 words and check rows of 19 to 25 words. The replay deck held a 60-word story paragraph. Both now sit behind Alt.

Shots are in `shots/`. `quiet-before-*` is orders and `quiet-after-*` is quiet. Before and after pairs exist for `10-claim`, `11-inspect`, `kv-unmatched-flag`, and `kv-unmatched`, each in dark and with a `-light` variant. Alt variants end in `-alt`.

## Team layer

Multiplayer is a paid layer, so a solo screen must never carry its words. The layer still needs room on a busy team screen. `research/agentic-ux/n-multiplayer-ux.md` §5 estimates it adds 10 to 14 words there.

- The team layer gets a reserve of 14 words. Solo screens are judged against `solo` (136). A team screen marks itself with `[data-team]` and is judged against `screen` (150). The worst solo beat today is kv-unmatched at 135, so a full team load fits.
- Team words go into surfaces that exist and spend those surfaces' budgets. The owner name costs 1 word on a pill. `2 here` and `following Dana · Esc` sit in the top-left island. `Team · 4 waiting` is a queue row. `needs Sam` replaces a key cap on a choice row. `HANDOFF → Sam · pending` is a row of 8. Teammate events reach you as a toast of 8 or go to the floor timeline. The layer adds no island and no key.
- The honesty rule gains three values that stay visible at rest: the owner on a claim held by another person's agent, `needs <name>` on a blocked option, and `HANDOFF → <name> · pending`. Each changes what you do next.
- Team bytes and the `Seen by team` list live behind the egress pill in the network log, which is reveal mode and exempt.

The reserve is an estimate until a team fixture runs through the counter.

## Rerun

```powershell
cd explore/ui-v2
$env:OUTROOT = "$env:TEMP\text-steps"
node run-steps.mjs concepts/quiet.steps.json
```

It prints `quiet OK` when every budget, binding, and honesty step passes. Each `audit` step prints the overruns it found, and each `count` step prints the full count with every surface and row. `run-steps.mjs` waits on a lock shared with every other caller, so a run can sit idle before it starts. The kv beats set `location.hash` and reload inside the steps file, then define the counter again.
