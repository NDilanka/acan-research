# Audit r1: the machine check of G3 and G4

2026-10-26. `audit.mjs` runs behind `AUDIT=1` in `drive.mjs` and checks the go-bar lines G3
(type floor, overlap, offscreen, contrast, focus ring, transition, focus steal) and G4
(egress sum) at every shot. This round ran it over all twelve steps files in dark and light.
Concepts were mid-edit by the shell agent during the runs, so findings are a snapshot, and
each run's time is noted.

## How to run it

```
node audit.mjs selftest                                    # fixtures in %TEMP%\audit-fixtures, 23 checks
node audit.mjs steps %TEMP%\audit-steps concepts\*.steps.json
$env:AUDIT="1"; $env:OUTROOT="$env:TEMP\audit\dark";  node run-steps.mjs %TEMP%\audit-steps\dark\*.steps.json
$env:AUDIT="1"; $env:OUTROOT="$env:TEMP\audit\light"; node run-steps.mjs %TEMP%\audit-steps\light\*.steps.json
node audit.mjs report %TEMP%\audit\dark %TEMP%\audit\light
```

`SIZE=WxH` on any drive run sets viewport and window (default 1600x900; verified at 1280x800
and 1440x900, and a bad value exits 2). Without `AUDIT=1` a drive run is byte-identical in
behavior to before: the import of `audit.mjs` and every audit step are skipped.

The `steps` subcommand writes dark and light variants. A light variant starts with
`shellAppearance('light')`, re-applies it after every `location.reload()` step, and for world,
which has its own F8 toggle and forces dark in its first step, swaps every quoted `dark` and
`light` so the run starts in light and its theme assertions stay consistent.

## Fixture proof

`node audit.mjs selftest` drives a deliberately broken page and a clean page through
`drive.mjs` under the shared lock. 23 of 23 checks pass (11:45). Each rule fires on the broken
page with the planted selectors and stays quiet on the clean page.

| rule | broken fixture fires on | clean fixture stays quiet on |
|---|---|---|
| type-floor | 9 px text, CSS-scaled text at 9.8 px, SVG text at 9 px effective | 11 px, scale(.75) of 16 px, SVG scale(.4) of 30 px |
| overlap | two tags overlapping 24x14 px | same overlap inside a `data-audit-stack` opt-out |
| offscreen | dialog 166 px past the right edge | dialog fully inside |
| contrast | dim 1.93:1, faded 2.68:1, mid-grey 4.37:1, black-on-glass 1.39:1 | bright, 85%-opacity, mid-grey at 24 px (large, 3:1 bar), white-on-glass 15:1 |
| focus-ring | three buttons with `outline:none`, caught twice in a row | nine buttons with a `:focus-visible` outline, mixed in with the broken ones |
| transition | `transition: opacity .3s`, a running keyframe pulse | `.orders-ink` clip-path transition (allowlist) |
| egress-sum | pill 100 B vs header 150 B, rows 140 B vs header 150 B, pill vs rows | pill 140 B, header 140 B, rows 100+40 B |
| focus-steal | a `setTimeout` focus() during a wait | real Tab key, and a refocus of an equal node after re-render |

Two clean-page cases report unknown rather than pass, on purpose. Focus landing on a successor
after its control was removed is unknown, because the removal is usually the late result of an
earlier key. Text still moving at the shot is contrast-unknown, because its sample would read
whatever happened to be there.

## Runs and step status

- Selftest 11:45, 23/23 PASS.
- Dark audit pass 11:56 to 12:03, light audit pass 12:03 to 12:13, reruns of quiet, orders,
  gate, and orders-kv-stale light 12:21 to 12:27 after the reload fix.
- Plain pass after all edits 12:13 to 12:19: 11 of 12 OK. Only orders-kv-offline fails, at
  step 14, a click before any audit activity in the drive. It fails the same way in plain
  isolation (12:26, two trials), as does orders-kv-stale step 13. Both are concept-side, not
  audit-caused. The orders step 10/11 geometry eval fails intermittently in both plain and
  audit runs (baseline had orders failing at step 9). Gate light step 107 failed once at 12:03
  and passed the 12:21 rerun. Compared with the 09:20 baseline (7 of 12), clash, gate, quiet,
  and world now pass their steps; the shell agent's in-flight edits moved that, not the audit.

Audit cost per shot is median 246 ms of page reads (max 1.1 s); pixel sampling for contrast
runs in Node after the steps finish, off the page clock. Focus audits are median about 150 ms.
Earlier in the day the sequential focus audit took up to 7.5 s per shot and broke
timing-sensitive steps; pipelining the CDP bursts and sharing verdicts across equal controls
removed that, and the paired rerun of orders and world then passed every step under AUDIT=1.

## Counts per steps file and appearance

Findings summed over audits, distinct (selector, text) in brackets, `?n` unknowns. World and
quiet shoot both appearances inside one run, so they appear once per measured appearance.

| steps file | pass | appearance | audits | type-floor | overlap | offscreen | contrast | focus-ring | transition | egress-sum | focus-steal |
|---|---|---|---|---|---|---|---|---|---|---|---|
| bench | dark | dark | 24 | 1034 (171) | 46 (4) | 0 | 275 (44) ?202 | 1 (1) | 0 | 0 | 0 |
| clash | dark | dark | 52 | 1057 (135) | 18 (4) | 0 | 382 (38) ?21 | 11 (6) | 0 | 0 | 0 |
| clash-kv-offline | dark | dark | 8 | 193 (101) | 0 | 0 | 59 (21) ?25 | 2 (1) | 0 | 0 | 0 ?1 |
| gate | dark | dark | 26 | 611 (138) | 2 (1) | 0 | 388 (78) ?40 | 1 (1) | 0 | 0 | 0 |
| orders | dark | dark | 30 | 630 (181) | 6 (2) | 0 | 205 (38) ?260 | 1 (1) ?3 | 0 | 0 | 0 |
| orders-kv-offline | dark | dark | 4 | 110 (59) | 0 | 0 | 36 (21) ?4 | 0 | 0 | 0 ?1 | 0 ?1 |
| orders-kv-stale | dark | dark | 4 | 108 (50) | 0 | 0 | 31 (16) ?4 | 1 (1) | 0 | 0 | 0 |
| orders-kv-unmatched | dark | dark | 6 | 171 (81) | 0 | 0 | 45 (20) ?4 | 3 (1) ?1 | 0 | 0 | 0 |
| quiet | dark | dark | 42 | 956 (246) | 17 (5) | 0 | 337 (49) ?209 | 6 (3) ?4 | 0 | 0 | 0 |
| quiet | dark | light | 8 | 183 (70) | 5 (3) | 0 | 84 (30) ?21 | 2 (1) | 0 | 0 | 0 |
| world | dark | dark | 40 | 1 (1) | 0 | 0 | 150 (9) | 1 (1) | 0 | 0 | 0 |
| world | dark | light | 14 | 1 (1) | 0 | 0 | 0 ?1 | 1 (1) | 0 | 0 | 0 |
| world-kv-offline | dark | dark | 6 | 0 | 1 (1) | 0 | 12 (4) | 1 (1) | 0 | 0 | 0 |
| world-kv-offline | dark | light | 2 | 0 | 1 (1) | 0 | 1 (1) | 0 | 0 | 0 | 0 |
| world-kv-stale | dark | dark | 4 | 0 | 0 | 0 | 13 (9) | 0 | 0 | 0 | 0 |
| world-kv-stale | dark | light | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| bench | light | light | 24 | 1034 (171) | 46 (4) | 0 | 187 (36) ?124 | 1 (1) | 0 | 0 | 0 |
| clash | light | light | 52 | 1057 (135) | 10 (2) | 0 | 208 (32) ?37 | 11 (6) | 0 | 0 | 0 |
| clash-kv-offline | light | light | 8 | 192 (100) | 0 | 0 | 32 (15) ?26 | 2 (1) | 0 | 0 | 0 ?1 |
| gate | light | light | 26 | 611 (138) | 2 (1) | 0 | 374 (87) ?97 | 1 (1) | 0 | 0 | 0 |
| orders | light | light | 30 | 633 (178) | 7 (2) | 0 | 212 (55) ?248 | 1 (1) ?3 | 0 | 0 | 0 |
| orders-kv-offline | light | light | 4 | 110 (59) | 0 | 0 | 32 (19) ?4 | 0 | 0 | 0 ?1 | 0 ?1 |
| orders-kv-stale | light | light | 4 | 108 (50) | 0 | 0 | 25 (14) ?4 | 1 (1) | 0 | 0 | 0 |
| orders-kv-unmatched | light | light | 6 | 171 (81) | 0 | 0 | 40 (17) ?6 | 3 (1) ?1 | 0 | 0 | 0 |
| quiet | light | light | 36 | 638 (133) | 13 (4) | 0 | 319 (84) ?153 | 4 (2) | 0 | 0 | 0 |
| quiet | light | dark | 14 | 500 (182) | 9 (4) | 0 | 105 (23) ?71 | 4 (2) | 0 | 0 | 0 |
| world | light | light | 40 | 1 (1) | 0 | 0 | 5 (4) ?59 | 1 (1) | 0 | 0 | 0 |
| world | light | dark | 14 | 1 (1) | 0 | 0 | 48 (9) | 1 (1) | 0 | 0 | 0 |
| world-kv-offline | light | light | 6 | 0 | 1 (1) | 0 | 0 ?41 | 1 (1) | 0 | 0 | 0 |
| world-kv-offline | light | dark | 2 | 0 | 1 (1) | 0 | 4 (4) | 0 | 0 | 0 | 0 |
| world-kv-stale | light | light | 4 | 0 | 0 | 0 | 0 ?21 | 0 | 0 | 0 | 0 |
| world-kv-stale | light | dark | 2 | 0 | 0 | 0 | 9 (9) | 0 | 0 | 0 | 0 |

Offscreen, transition, egress-sum, and focus-steal have zero findings on every concept. Their
logs confirm the rules were measuring: egress logs were found and summed (stats in each
`<shot>.audit.json`), the motion scan covers about 3800 elements per shot, and surfaces were
checked on every shot.

## Who owns a finding

`island` is shell chrome from build.mjs, `plant` is the shell-drawn plant and chips, `concept`
is a concept's own cards and pins. An overlap names both sides. Distinct findings (steps file,
appearance, selector, text):

| rule | owner | distinct |
|---|---|---|
| type-floor | concept | 1684 |
| type-floor | plant | 423 |
| type-floor | island | 106 |
| contrast | concept | 338 |
| contrast | island | 256 |
| contrast | plant | 117 |
| focus-ring | concept | 31 |
| focus-ring | island | 4 |
| overlap | island x plant | 11 |
| overlap | concept x concept | 8 |
| overlap | concept x plant | 8 |
| overlap | plant x plant | 4 |
| overlap | concept x island | 2 |

The shell owns the largest single share of real work. The island chrome fails contrast in both
appearances, the hint row and top-left island collide with plant chips, and the plant's own
labels render at 6.5 to 9.5 px everywhere.

## Worst findings

Shots live under `%TEMP%\audit\<dark|light>\<steps name>\<shot>.png`; each has a matching
`.audit.json` with every finding and its measured value.

**type-floor.** The plant's iso-face labels are the bulk: 6.5 px for terrains
(`#plant ... g.terr[data-id="radar-otel"] > text.iso-face-text`, "RADAR-OTEL · VERIFYING",
bench-01-empty and 11 more shots), 7.5 to 8.4 px for entities (gate-01-queue, orders-01-replay).
Chips render at 8.6 to 9.5 px (`#chips div.chip.show[data-id="radar"]`, every clash shot).
Concept text at 10 px: bench pins and `#benchWaiting` (bench-01-empty), orders and quiet
witness chips at 8.6 to 9 px (orders-02-must-not). World's only miss is DOCKER at 10.3 px
(world-07-levels).

**overlap.** `div.hint` overlaps the radar chip by 98x2 px on every bench shot
(bench-01-empty). `div.fl.tc` "Live" overlaps the same chip by 98x7 px. `#clashNext` and
`#clashToolbar` overlap `div.hint` by 28x13 px and 16x13 px (clash-15-mouse-footprints,
clash-02-footprints). `#clashAdvisory` overlaps a plant note by 137x10 px (clash-07-done).
Bench plates overlap plant labels (`#benchPlates button.bench-plate` over the SQLITE label,
bench-03-funded). Quiet's D2 and Claude Code chips overlap each other by 21x13 px
(quiet-after-09b-rescored). `#worldAnnouncement` overlaps a site condition diamond by 11x4 px
(world-kv-offline-03-checked).

**contrast.** Shell chrome is the repeat offender in both appearances: the "▾" and "Ctrl K"
key caps in the top-left island at 2.25:1 and 3.49:1 (every bench, clash, and gate shot), the
mode buttons' digits at 2.76 to 3.49:1. Worst single misses are in light: gate's
`button.agent.blocked` "blocked on you" at 1.33:1 and `button.gate-cap > kbd` "M" at 1.22:1
(gate-01-queue), plant labels at 1.10 to 1.65:1 (quiet-after-03a-palette, orders-04a-long-draft),
the orders retry witness chip at 2.56:1 (orders-04a-long-draft). World dark has its own chrome
at 3.44:1 (`#worldApp ... kbd` "Ctrl K", world-07a-light-plant).

**focus-ring.** Every finding is a control that holds real focus and shows no outline or
box-shadow: `#clashCard` "Close clash" (4 shots, first step-91-focus), `#clashFootprints`,
`#clashPins button.clash-pin`, `#quiet-card button.quiet-close`, `#gateCard` "Close",
`#orders-card button.orders-close`, `#benchCard button` "w2 · must keep",
`#worldInspector button.world-action`, `#worldNetworkBody button.world-primary` "Reconnect",
and one island case, the palette input `#palIn` in quiet light (step-31-focus).

## False positives and how each rule handles them

- **type-floor** measures effective pixels through CSS transforms, `scale`, `zoom`, and the
  SVG screen CTM, so scaled-up small text passes (clean fixture) and scaled-down large text
  fails (broken fixture). Text hidden by `aria-hidden`, opacity under 0.05, or occlusion is
  skipped. No false positives seen; the counts are high because plant labels repeat per shot,
  and distinct counts are the honest figure.
- **overlap** measures painted boxes (background or border) for labels and glyph cells for
  skewed SVG text, then confirms with a five-point hit test through the element stack, so a
  label over empty canvas does not fire. Ancestor pairs never fire. `data-audit-stack` opts a
  subtree out; the clean fixture proves the opt-out is counted (stats.stackOptOuts) and
  skipped. The clash toolbar and hint collisions read as real in the shots.
- **offscreen** checks only top-level positioned surfaces and allows 1 px. Zero findings and
  no near misses.
- **contrast** samples the screenshot itself, so translucent glass and plant shading are
  composited, not guessed (the fixture's 85% black glass over white reads 1.39:1 for black
  text and 15:1 for white). Text that moved between the shot and the audit is unknown, never a
  finding; that is most of the `?n` counts (orders dark ?260, bench dark ?202). Text painted
  with `background-clip: text` or a gradient fill is unknown. Disabled controls are exempt.
- **focus-ring** forces `:focus`, `:focus-visible`, and `:focus-within` through CDP instead of
  pressing Tab, so the check never changes selection mid-flow. Verdicts are shared across
  controls with the same tag, classes, role, ARIA state, and parent classes in one appearance,
  which assumes same-styled siblings share a focus style; a control whose ring differs from its
  twin's would be masked, and the fixture guards the opposite error (broken and clean buttons
  interleaved are still told apart by class). A control with real focus is judged on its own
  computed style because forced pseudo states cannot lift real focus.
- **transition** allows only the ink-in selectors and animations in `MOTION_ALLOW`
  (`.orders-ink`, `.quiet-ink`, `.bench-ink`). Camera easing runs in JS and never fires. Zero
  findings on all concepts.
- **egress-sum** sums only complete logs: when a header's op count exceeds the rows shown, or a
  row shows no byte count (sending, held, or a result row), the log is skipped and reported
  unknown instead of guessed. That produced the two `?1` unknowns in orders-kv-offline.
- **focus-steal** compares focus across every scripted wait. A re-render that swaps in an equal
  node and refocuses it passes; a move from a control that was removed is unknown (the clash
  and orders-kv-offline `?1`); anything else is a finding. The broken fixture proves it catches
  a scripted `focus()`.

## Extension point

`PAGE_RULES` in `audit.mjs` (top of file) takes `{ rule, check(api) }` entries. `check` runs
inside the page with `api` = `{ cfg, W, H, items, sel, squash, shown, inView, cs }` and returns
finding objects; a rule's settings go in `CONFIG`. A new rule needs a planted case in
`FIXTURES.broken.expect` or the selftest fails it. The TEXT.md word budget can lift
`textCount(P)` from quiet.steps.json unchanged, and the SHELL.md island positions become one
more entry.

## Open questions

- The light-mode orders card keeps a dark panel ("Point to what matters", orders-01-replay
  light). The audit flags its text by measurement; whether the panel should re-theme is a
  shell and concept call.
- World dark chrome sits at 3.44:1, between the 3:1 large-text bar and 4.5:1. The caps are
  small text, so they fail; if the design intends them as decoration, that needs an explicit
  exemption, not silence.
- `data-audit-stack` has zero opt-outs in the tree. If the shell keeps intentional chip
  stacking, mark those containers rather than widening the overlap tolerance.
