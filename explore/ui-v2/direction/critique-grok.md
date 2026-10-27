# Critique, Grok (xAI) judge

Read `00-synthesis.md`, the three proto reports, `BRIEF-build.md`, the fixture, the three builds and their steps files, and every frame's shots at 1440x900 in both appearances (F1, F2 stops, F3, F4, F5, F6, F7-unmatched, F7-stale, F8), plus F3/F5/F6 dark. Scores are 0-4 per line, weighted to 100.

## Score table

| Line (weight) | A Live paper | B Living cartographic | C Transit |
|---|---|---|---|
| Ten-second chat-dev test (25) | 4 → 25.0 | 3 → 18.75 | 3 → 18.75 |
| Scan speed (15) | 3 → 11.25 | 3 → 11.25 | 3 → 11.25 |
| Honesty (15) | 4 → 15.0 | 3 → 11.25 | 4 → 15.0 |
| Words on screen (10) | 3 → 7.5 | 2 → 5.0 | 2 → 5.0 |
| Plant legibility (10) | 4 → 10.0 | 2 → 5.0 | 3 → 7.5 |
| Infinite canvas (10) | 4 → 10.0 | 2 → 5.0 | 4 → 10.0 |
| Keyboard reach (10) | 4 → 10.0 | 3 → 7.5 | 4 → 10.0 |
| Look (5) | 3 → 3.75 | 2 → 2.5 | 4 → 5.0 |
| **Total** | **92.5** | **66.25** | **82.5** |

## Ten-second answers (cold read of F3, then F6)

**A.** Needs you: Codex, amber ring plus "Codex · waiting on you · 12m" flag. Collide: Droid and Claude Code, teal and violet trails meeting at the red "c1 · breaks w3" pin on the api-to-paypal belt. Idle: the yielding Droid ("Droid yields · declared" near paypal). Egress: "local + kvarm · 4,494 B out" pill, yes, to kvarm. Away: ghost marks with change words on radar (passed), breaker (declared), github (approved); card holds only the offsite artifact. Lost going back to chat: where everything is, the meeting footprints, the blast radius, the away ghosts.

**B.** Needs you: Codex, amber-ringed drone plus "Codex · waits on you · 12m". Collide: the red diamond literally initials it, "c1 CC×DR" at the breaker, trails on the red belt. Idle: "Droid · declared · yields" by models. Egress: same pill. Away: dimmed map, "17:06 radar CI 5/5", "17:14 breaker declared", "acan-site · 17:22" beacon. All five answerable, but the grey box-field needs real parsing before the story lands. Lost: the etched facts (paypal 4.1% against its 2% line, verifier 1 busy 7 queued), clash geometry, option previews.

**C.** Needs you: Codex amber chip. Collide: the parallel teal/violet lines meet at the breaker diamond, but the pin is labelled "Retry meets breaker" (fixture title) and names machines, not agents; the who needs the line hues and the CLAIMED flag. Idle: "Droid · yields" dot. Egress: same pill. Away: minute dots on radar and breaker, "17:22 · acan-site" beacon. Lost: the minute-stamped changes and the session crossings; less place to lose, because there is less place.

All three pass the ten-second veto (3 or better). None is out.

## Veto check: bindings and paused motion

No disqualification. All three steps files assert `dirCheck()==[]` (no unbound marks, no unknown bindings) and `dirRunning()==0` with the stream paused on every frame, and the audit transition rule allows only allowlisted motion. A kills CSS animation/transition globally (`dir-a.mjs:568`) and animates only via WAAPI on `ctx.fired` (`dir-a.mjs:558`). B's packets and rings are WAAPI on events (`dir-b-lib.mjs:553-558`) with a pause wrapper that clears fx and finishes finite transitions (`dir-b.mjs:243-250`) — a workaround for a stall the proto admits; the coordinator's rerun passes all four configs, so it stands, but watch it. C's `tMotion` runs only on fired events (`dir-c-draw.mjs:346-363`). Two flags short of veto: B sets machine stamps and clash caps in `.mono`, which the audit word counter skips (`audit.mjs:34`), so B's visible words exceed its reported 45 on F3; and B's own steps gate perf at p95<50, not the rubric's 16 ms. C's veto-relevant numbers are self-reported; the coordinator's C rerun is still in progress.

## Per-line justification

A — Ten-second 4: all five questions answered from the two frames without a click, and the iso plant gives the strongest sense of where. Scan 3: flags named at rest, beacons work; org-level workers shrink to dots. Honesty 4: clean bindings, zero paused motion, hatched unknown, coordinator-confirmed. Words 3: 33/53/65 all inside cap, F3 a hair over the 50 line. Legibility 4: six roles read from the shapes themselves (tank, cylinder, crane, gate), paypal belt findable, both appearances hold. Canvas 4: identity across F2, p95 10-11 ms asserted under 16. Keys 4: Tab cycle, Enter, Esc, Shift V, beacon flight all asserted. Look 3: calm white paper; org level is sparse to a fault.

B — Ten-second 3: the CC×DR diamond is the fastest collision decode of the three, but the box grid slows everything else. Scan 3: red and amber pop; chips crowd near paypal. Honesty 3: checks pass, but the pause wrapper finishes transitions rather than never starting them, and textBind/textSeen were not run by the builder. Words 2: the `.mono` skip hides stamps and caps from the counter; visually the wordiest at rest. Legibility 2: kinds read as labelled boxes, and dark machine edges are ~1.3:1 (self-reported, confirmed in shots), failing the 3:1 edge bar. Canvas 2: p95 30-41 ms misses 16 ms in every config, and the steps gate was set to <50. Keys 3: good coverage, but digits 1-4 only preview a resolution, never apply one. Look 2: the floating "APPROVE THE PAYPAL BREAKER" stamp is brash; dark is murky.

C — Ten-second 3: everything answers, but the clash pin names machines, not agents, and the hue-is-agent legend takes the longest to learn. Scan 3: calmest map, color only on agents and abnormal; the right-edge flag stack crowds. Honesty 4: verbatim kv flags, hatched unknown, event-gated motion, zero audit findings claimed (rerun pending). Words 2: honest count, but F3 61 and F6 88-89 are the worst of the three; every stop is named by design. Legibility 3: roles ride on glyphs alone once the iso silhouette is gone; the red paypal segment still finds the belt. Canvas 4: p95 7.6-9.8 ms with margin, identity asserted. Keys 4: full set, i/Esc/Ctrl K asserted, Alt-digit flies. Look 4: the most modern and calm of the three; minor blemish: a stray duplicate "Codex · 12m" chip floats mid-map in F5.

## Winner: A, Live paper (92.5 vs C 82.5, B 66.25)

Three reasons decided it. (1) The ten-second test with the most place: A is the only direction where "where" needs no legend — the plant reads as a plant, agents are the only color, and the collision is two visible trails meeting at a named pin. (2) It passes every hard gate with margin and no caveats: p95 10-11 ms against 16, bindings and paused-motion checks green in the coordinator's own reruns, contrast clean in both appearances, while B fails the perf gate and C's rerun is still pending with the worst word counts. (3) F6 is the best return-home of the three: the map itself carries every change as a ghost with a word, and the card is down to the one thing the map cannot show.

## Salvage from the losers

- From B: put the colliding agents' initials on the clash diamond (CC×DR), so the pin names the who without following trails; the roof-gauge idea of etching a ratio against its budget line (paypal 4.1% of 2%) is worth keeping on A's machines; and the clash card's live option previews on the map (dashed trails plus the port square, keys 1-4) are better than A's static suggestion row.
- From C: the minute-stamped away dots read faster than A's ghost words — add the minute to each ghost; and C's org-level badge row (wait count, clash count, agent dots) would fix A's sparse org level without adding words to the plant level.
