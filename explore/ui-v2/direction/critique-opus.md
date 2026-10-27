# Direction critique, judge: Opus (cross-lab, cold)

Evidence: every frame F1, F2-1..F2-5, F3, F4, F5, F6, F7-unmatched, F7-stale, F8 for all three
directions at 1440x900 in both appearances (shots/dir-*.png), the three steps files, dir-base.mjs,
direction-data.mjs for ground truth. Scores 0-4 per line, weighted (score/4 x weight).

## Score table

| Line (weight) | A Live paper | B Living cartographic | C Transit |
|---|---|---|---|
| Ten-second chat-dev test (25) | 4 -> 25.0 | 3 -> 18.75 | 4 -> 25.0 |
| Scan speed (15) | 3 -> 11.25 | 3 -> 11.25 | 3 -> 11.25 |
| Honesty (15) | 4 -> 15.0 | 3 -> 11.25 | 4 -> 15.0 |
| Words on screen (10) | 3 -> 7.5 | 2 -> 5.0 | 2 -> 5.0 |
| Plant legibility (10) | 3 -> 7.5 | 2 -> 5.0 | 3 -> 7.5 |
| Infinite canvas (10) | 4 -> 10.0 | 2 -> 5.0 | 4 -> 10.0 |
| Keyboard reach (10) | 4 -> 10.0 | 3 -> 7.5 | 4 -> 10.0 |
| Look (5) | 4 -> 5.0 | 3 -> 3.75 | 3 -> 3.75 |
| **Total (100)** | **91.25** | **67.5** | **87.5** |

## Ten-second answers (F3 10 s, then F6 10 s, cold)

Ground truth from the fixture: Codex waits on you; c1 is Claude Code x Droid at the breaker on the
api->paypal belt, breaks w3; droid-payouts yields (the idle one); the pill reports local + kvarm
egress; while away: 17:06 radar CI passed, 17:14 breaker declared, 16:58 #184 approved, 17:22
artifact offsite.

- **A.** Codex (amber chip, 12m) instantly; Claude Code x Droid at the red `c1 - breaks w3` pin where
  the teal and violet trails meet; the second Droid `yields` by paypal; yes, pill says 4,494 B out;
  F6 puts `declared`/`passed`/`approved` dots on the changed machines and the card holds only the
  offsite artifact. All five in time. Lost going back to chat: the live spatial state itself.
- **B.** Codex (amber-ringed CX drone plus chip); `c1 CCxDR` diamond on the red belt, agents via the
  caps; `Droid - declared - yields` chip; yes, same pill; F6 dims unchanged machines and tags 17:06
  and 17:14 in place. All five answerable, but the breaker-paypal corner is crowded and the clash
  wants one extra beat. 3, not below.
- **C.** Codex chip pops on the near-empty map; the violet and teal lines meet at the
  `Retry meets breaker` diamond, agents traced by hue to the CLAIMED flag and the radar chip;
  `Droid - yields`; yes, pill; F6 minute dots (17:06, 17:14) plus the away card. Fastest scan of
  the three; the collision's who costs one hue-tracing step.

No direction falls under 3 on this line, so no ten-second veto fires.

## Veto check (bindings, paused motion)

- Every frame check in all three steps files asserts `dirCheck()` (each plane/card element under a
  `data-binding` whose value is a fixture key) with `expect []`, and `dirRunning()===0` plus a
  `getAnimations()` sweep after a play/pause cycle. No unbound mark, no paused animation on current
  evidence. Coordinator reruns confirm A and B pass all four configs; C's rerun is still in flight,
  so C's zero-findings claim is builder-reported only.
- Flag, not a veto: B's report admits the zero-running check kept failing at 1440x900 because its
  pause wrapper force-finishes shell transitions and hidden-layer transitions stalled in headless
  Chrome. It passes now, but that failure mode should be re-run on a clean machine before shipping.
- Flag, not a veto: B's steps file prints its perf number with no p95<16 gate (A and C both gate),
  and B's word counts skip `.mono` text (machine stamps, clash caps, the order watermark), so B's
  real on-screen word load is visibly higher than the reported 28/45/66.

## Per-line justification

- Ten-second: A and C answer all five questions inside the window; B answers them too but with a
  denser, cap-coded collision corner.
- Scan speed: all three name their marks at rest and beacon off-screen blockers; none earns a 4
  (A's org is sparse, B crowds at paypal, C makes you trace hues).
- Honesty: A and C clean on every audit plus fog/hatch for unknown; B loses a point for the .mono
  word-count dodge and the pause-wrapper episode.
- Words: A 33/53/65 reads as counted; B undercounts (see flags); C 36/61/88-89 is honestly counted
  but the wordiest at rest.
- Plant legibility: A's iso model names six roles and reads as a plant in both appearances (dark
  line art dimmer); C names everything but roles ride on glyphs alone; B's light model is strong
  but its dark machine edges are admittedly under 3:1 and it shows.
- Infinite canvas: identity holds across the F2 sweep in all three; A (10-11 ms) and C (7.6-9.8 ms)
  beat 16 ms, B misses at 30-41 ms by its own report.
- Keyboard: A and C cover camera, blockers, cards, log, replay and Alt fully; B's digit keys only
  preview a resolution instead of picking it.
- Look: A's white paper model is the calmest and most distinctive answer to the user's complaints;
  B is handsome in light, murky in dark; C is clean but generic-diagram and empty at plant level.

## Winner: A, Live paper (91.25)

Three reasons: (1) it is the only direction where the plant reads as a plant in both appearances
while the waiting agent and the clash stay the loudest marks - the user's core complaint, answered;
(2) it clears every gate with margin and no measurement caveats (p95 ~10-11 ms, bindings,
paused-motion, words at 33/53/65); (3) it passes the ten-second test without teaching a new
grammar. C (87.5) is a strong second - fastest, best dark, best F6 dots - but names every stop,
drops the silhouette, and its rerun is unconfirmed. B (67.5) is out on perf, dark contrast, and
counted-versus-visible words.

Salvage into A: from B, the live clash-resolution preview on the map (dashed trails and port square
on hover or digit) and the roof gauges etched on machines (budget line, queue cells); from C, the
minute-stamped change dots on F6 (17:06, 17:14 beat change words) and the transform-based camera
behind its 7.6 ms p95.
