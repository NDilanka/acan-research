# Direction prototype build brief

You build ONE competing visual direction for Acan. Two other agents build the other two at the same time. Load the `poteto-delegate` skill first and follow its reply and comment rules.

Repo `D:\dev\Experiments\Acan` (Windows, PowerShell 7). Work in `explore/ui-v2`.

## Why this exists
The user is not satisfied with the current UI. It looks dated and generic, it is cluttered, the plant does not read, and cards feel heavy. The user says the map must be more informative with less text. A developer coming from chat UIs must feel the value of the live map within seconds. World must be a true infinite canvas. Light appearance is the anatomy kit's pure white. Three model labs wrote memos, and the coordinator picked three directions to prototype and judge side by side. The winner goes to the user for approval.

## Read first
- `direction/00-synthesis.md`. It holds the shared rules every direction must follow, the three directions, frames F1 to F8, and the rubric you will be judged on. The ten-second chat-dev test is a veto.
- The memo that defines your direction (named below), in full. Skim the other two memos for ideas only.
- `concepts/dir-base.mjs` header. It is the builder contract: the hooks, ctx, the checks the steps file runs, and the tokens. `concepts/direction-data.mjs` is the read-only fixture.
- `PARKED.md` hard rules (honesty, Kvarm rules, one island shell), `TEXT.md` budgets and the six at-rest honesty values, `SHELL.md` slots.
- `vendor/anatomy/iso-kit.mjs`, for the machine drawings if your direction uses iso.

## Build
- Edit only `concepts/dir-<x>.mjs`, any new `concepts/dir-<x>-*.mjs` it imports, and `concepts/dir-<x>.steps.json`. You may add checks and shots to your steps file, but never remove or weaken the base checks. Never edit `dir-base.mjs`, `direction-data.mjs`, `build.mjs`, `run-steps.mjs`, `drive.mjs`, `audit.mjs`, other concepts, or anything under `recovered/`. If the base blocks you, work around it inside your files and report the blocker.
- Render every frame F1 to F8 (including F2-1 to F2-5, F7-unmatched, F7-stale) from the fixture only. Invent no data.
- Infinite canvas, for real. One plane and one camera. Continuous wheel zoom centered on the cursor, and drag to pan. Semantic levels switch on thresholds with no DOM swap, and plant nodes stay the same elements across the sweep. Labels stay a fixed screen size and are culled by priority. The blocked agent and the clashes stay visible at org level, and off-screen blockers show as edge beacons. Keys pan and zoom, and Go to flies the camera. Add a perf check with `stubPlants(20)`: measure p95 frame time during a scripted zoom and report it.
- Motion only on events in `ctx.fired`. With the stream paused, nothing animates.
- Alt shows the words for every mark in place, and nothing moves.
- Light uses the kit tokens through the `--d-*` variables only, with no literal colors. Dark uses the kit dark tokens. No dark card on light.
- Kvarm uses one top-right status pill plus the network log card in the right slot on click or Shift V, and stays out of the cards. The origin may also appear on the map if your direction suits it.
- Cards sit in the 392 px right slot, with at most six rows at rest and a hairline border.

## Prove
- Run your steps file with `node run-steps.mjs concepts/dir-<x>.steps.json` at `SIZE=1280x800` and `SIZE=1440x900`, with `APPEARANCE=light` and `APPEARANCE=dark`, and `AUDIT=1`. All four runs must print OK. run-steps locks, so it is safe alongside the other builders. Never call drive.mjs directly.
- Copy the final shots into `shots/` as `dir-<x>-<frame>-<WxH>-<light|dark>.png` (from the run's OUTROOT, default `%TEMP%\acan-steps\dir-<x>`).
- LOOK at your own F1, F3, F5, F6 and F8 shots in both appearances, and fix what reads badly. Iterate at least twice on the look. Judge it against the user's complaints above.
- Write `direction/proto-<x>.md` with the following. Keep it under 80 lines.
  - What the direction is.
  - How each top value moment lands, citing shots.
  - The textCount totals at rest for F1, F3 and F6.
  - The p95 frame time.
  - Your honest self-score on each rubric line.
  - Known weaknesses.

## Do not commit. Report back with the files changed, run results, shot paths, word counts, p95, and the weaknesses.
