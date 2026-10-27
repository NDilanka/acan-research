# Prototype A, Live paper

Each plant is the anatomy kit's white paper model on one infinite plane, prerendered once at build time from the real
fixture scenes. Machines stay grey until abnormal. Agents are the only saturated marks: a colored body on the machine
it works, a name flag with its activity and evidence, an amber ring while it waits on you. Words sit in fixed-size
labels placed by priority; every other word is one held Alt away, and holding Alt moves nothing.

## Value moments

- Who needs you, from org level: Codex's flag and amber ring stay visible in the five-plant view, and its plant name
  carries the waiting count (`shots/dir-a-F1-1280x800-light.png`). Panned away, an edge beacon holds the same words
  (`shots/dir-a-beacon-1280x800-light.png`).
- The c1 collision before any selection: Droid's teal footprint up the belt and Claude Code's violet one down it meet
  at the red diamond pin with `c1 · breaks w3` beside it (`shots/dir-a-F3-1280x800-light.png`). Hovering d3 draws the
  blast band over the downstream belt and rings the three machines it reaches (`shots/dir-a-F4-1280x800-light.png`).
- The c1 card: four rows at rest, hue dots per declaration, the broken witness in red, the suggested split last
  (`shots/dir-a-F5-1280x800-dark.png`). Camera unchanged while it opens.
- What changed while away: F6 puts a new dot with its change word (passed, declared, approved) on each machine the
  fixture says changed, so the return card lists only what the map cannot show here, the one offsite artifact
  (`shots/dir-a-F6-1440x900-dark.png`).
- kv states read apart: unmatched shows the wait-amber flag `UNMATCHED · Codex holds g1 · no readback` on a dashed
  amber territory; stale shows `LEASE STALE · g1 expired` on a hatched territory with the holder row beside it
  (`shots/dir-a-F7-unmatched-1280x800-dark.png`, `shots/dir-a-F7-stale-1280x800-dark.png`).
- Alt on F3 shows every mark's words in place (`shots/dir-a-F8-1280x800-dark.png`); the steps file asserts no mark or
  island moved.

## Words at rest (textCount totals)

F1 33, F3 53, F6 65, identical at both sizes. F8 with Alt held counts 120/131 and is reveal mode, recorded but not
judged. The F3 plant surface holds six machine names plus the order flag and readback; the rest of the machines
answer under Alt.

## Frame time

p95 of synchronous frame work (draw plus forced style and layout) over a 180-frame 52x zoom sweep with twenty stub
plants, best of five runs, all runs listed: 1280 light 10.0 ms (10.0-13.4), 1280 dark 11.4 (11.4-13.4), 1440 light
10.0 (10.0-15.3), 1440 dark 10.7 (10.7-13.6). p50 is 5-6 ms. Plant nodes scale by one transform, the ink layer is
reused across camera moves until the zoom drifts 20 percent, and label sizes are cached by markup, so a steady zoom
frame is model rebuild, transforms, and label placement only.

## Self-score against the rubric

- Ten-second chat-dev test, 3/4. All five questions answer from F3 and F6 without a click, but a cold judge still
  has to parse an iso drawing.
- Scan speed, 3/4. Marks are named at rest and offscreen blockers beacon; at org the working agents shrink to dots.
- Honesty, 4/4. dirCheck and the audit pass in all four runs, every mark is data-bound, paused means zero animations,
  unclaimed and stale territories hatch.
- Words on screen, 3/4. F3 is 53 against the 50 full-marks line; F1 33 and F6 65 are inside the 136 cap with room.
- Plant legibility, 3/4. Six roles named at rest, audit contrast passes both appearances; dark line art is dimmer.
- Infinite canvas, 4/4. Same nodes across the F2 sweep, continuous cursor zoom, blocked agent visible at org, p95
  under 16 ms in every final run.
- Keyboard reach, 4/4. Arrows, + and -, 0 to 5, Tab issues, Enter, Esc, Shift V, R, Ctrl K Go to, Alt for words.
- Look, 3/4. Kit tokens only, no literal colors, calm white; beauty is the judge's call.

Weighted sum: 84/100.

## Known weaknesses

- Org level is sparse because the models stay true to scale; the waiting flag and counts carry the whole story there.
- The p95 check is contention-sensitive on this shared machine: loaded windows pushed runs to 20 ms and up while
  rafP50 tracked the load, which is why the step reports five runs.
- Ink reuse at a 20 percent zoom tolerance lets dot radii lag exact scale by under a pixel between rebuilds.
- The Go to box filters but offers only arrow keys and Enter, no section headers.
- Stub plants reuse the real plants' silhouettes, so the canvas test says nothing about drawing twenty distinct sites.
