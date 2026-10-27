# Direction C: Transit

The plant is a transit map at every zoom level. Machines are stations with a role glyph, belts are
grey lines routed at 45 degrees, and each agent session is a coloured line laid beside the belts it
declared. A working agent is a train at the end of its line. An agent waiting on you is a still puck
with an amber ring that fills over an hour. Two lines sharing a segment meet at a diamond. While you
were away the map fades and each changed station gets a dot with the minute it changed.

One SVG per plant site lives on one plane under one camera. HTML labels stay a fixed size and are
placed by priority; blockers off screen clamp to the edge as beacons.

## How the top moments land

- F1 org: five sites, contracts as dashed lines, the blocked agent reads three ways on Acquit (wait
  badge, clash badge, agent dots) plus the order flag and readback. `shots/dir-c-F1-1280x800-light.png`
- F2 sweep: five zoom stops from org to machine; plant nodes keep identity (checked in steps), level
  order org to plant verified. `shots/dir-c-F2-3-1440x900-light.png`
- F3 order flag: CLAIMED and READBACK hang as one stack under the holder's chip next to the gate;
  the holder chip keeps only its evidence because the flag already names the agent.
  `shots/dir-c-F3-1280x800-light.png`
- F4 hover a declaration: the line heats and the blast radius shows downstream in the session hue.
  `shots/dir-c-F4-1280x800-light.png`
- F5 clash card: camera unchanged (checked), card 392 px with at most six rows; the label whose
  anchor sits under the card is dropped because the beacon already points there.
  `shots/dir-c-F5-1280x800-light.png`
- F6 away at 17:30: dots with minutes on changed stations, away card lists the rest.
  `shots/dir-c-F6-1280x800-light.png`
- F7 kv: unmatched flag shows the unmatched holder row, stale flag shows the stale ring, both verbatim
  from the fixture. `shots/dir-c-F7-unmatched-1280x800-light.png`
- F8 Alt: word layer appears, no F3 mark moves and no shell island moves (both checked).
  `shots/dir-c-F8-1280x800-light.png`

## Numbers

- Text on screen at rest (audit textBudget.total, cap 136, zero findings in all four runs):
  F1 = 36, F3 = 61, F6 = 88 at 1280x800; F6 = 89 at 1440x900. F3 sits over the 50-word bar because
  every stop is named; that is the design, see weaknesses.
- Frame time, twenty-plant stub beside the real five (180 frames, scripted 52x zoom, render plus
  forced layout): p95 = 7.6 / 9.7 / 7.9 / 9.8 ms for 1280x800 light/dark and 1440x900 light/dark.
  p50 = 5 to 8 ms. Under 100 percent CPU from parallel agents the same run measured 17 to 26 ms.
- Audits: zero findings in every rule (type floor, overlap, offscreen, contrast, focus ring,
  transition, egress sum, focus steal, text budget, island) across all four runs.

## Self-score against direction/00-synthesis.md

- 10-second chat-dev test (25): 22. Flag, waiting ring, clash diamond and beacons all read in one
  glance; the leak of quiet station names costs a little focus.
- Scan speed (15): 12. Grey-quiet map, colour only on agents and abnormal states; the org view still
  carries the flag stack.
- Honesty (15): 13. Hatched unknown and simulated sites, stale and unmatched kv flags verbatim, fail
  station shows its reading, witness pin breaks on the clash.
- Words on screen (10): 6. F1 and F6 are inside cap with zero findings; F3 rests at 61, over the
  50-word full bar.
- Plant legibility (10): 8. Six roles plus the paypal belt are present as glyphs and names, contrast
  audit clean; role recognition depends on learning the pictograms because the iso drawing is gone.
- Infinite canvas (10): 9. Identity holds across F2, wheel zoom is continuous at the cursor, org
  shows the blocked agent, p95 under 16 ms with margin on an idle machine.
- Keyboard reach (10): 9. Arrows pan, - and = zoom, f and F fit, i cycles attention, Shift V network,
  Tab cycles hits, Enter activates, Escape clears, Ctrl K go to, Alt+digit flies. Steps check i,
  Escape and Ctrl K.
- Look (5): 4. Clean transit grammar; the flag stack at org level is the weakest visual.
- Total: 83.

## Weaknesses

- The flat 45-degree schematic throws away the iso plant silhouette, so machine roles ride on glyphs
  alone.
- Session hues come from rotating --d-focus in OKLCH; they are not checked for colour-vision
  deficiency, and droid-radar sits close to the focus blue.
- F3 rests at 61 words because Transit names every stop; trimming quiet stops would buy rubric words
  at the cost of the map's main promise.
- Go to is the direction's own box on Ctrl K, not the shell palette.
- The p95 gate passed on every final run, but the machine was shared: under full external load the
  same steps measured up to 26 ms and needed retries.
