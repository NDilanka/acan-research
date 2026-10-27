# q. Software factory talk (Warp) against Acan

Source: a recorded talk by Zach Lloyd, Warp's founder, on cloud "software factories". The raw transcript stays local and uncommitted, because it is someone else's talk and this repo is public. Compared against `ui-v2/CORE.md`, `ui-v2/PARKED.md` and `02-synthesis-multiplayer.md`. Written 2026-10-26, saved 2026-10-27.

The talk describes work flowing through a defined loop of agents (triage, spec, implement, review, verify, ship, monitor) with human checkpoints, a factory declared in code, and "factory engineering" that measures and improves the loop. Acan already shares about half of these ideas. Three are worth adopting after the go signal. Two of the talk's central claims go against decisions already made, so Acan does not adopt them.

## What Acan already does

- **Any model, any harness.** Warp says a factory should take any model and harness. Acan already runs Claude Code, Droid and a passive Codex session side by side.
- **Data stays on your systems.** Warp calls this AI sovereignty. Acan is local-first, every outbound send is declared and counted, and the paid team module runs on the customer's own server first.
- **Human checkpoints at chosen points.** Warp gates steps with humans. In Acan the engineer pins witnesses, answers one question when readbacks differ, and settles clashes before code.
- **A live view of everyone's agents.** The talk calls it "Google Docs for your team's coding agents". That is Acan's paid multiplayer. It suggests the paid line is in the right place, and that Warp is close to Acan's market.

## Worth adopting after the go signal

1. **Turn repeated failures into suggested rules.** Warp's agents notice a failure that keeps recurring (54 times in the example) and propose a fix to the factory definition. In Acan the signal is a clash or readback disagreement that keeps returning at the same place, such as the sqlite queue row in c2. Acan would suggest a standing must-keep witness for that spot, and the engineer accepts or dismisses it with one key. The human still decides, which CORE requires.
2. **Witnesses as your own benchmark.** Warp replays real past tasks across models to plot cost against correctness. Acan's witnesses are already pass or fail checks pinned on real moments, and readbacks already score each agent against the same witnesses. A later step could record first-try match rate per agent and the cost of each order.
3. **A few honest numbers in the return brief.** Warp tracks human touches per PR, time to ship and cost per PR. Acan's version is per order: times you were asked, time from post to claim, and bytes sent. They must come from the session ledger, never invented, matching CORE's rule that numbers come from the fixture.

**Maybe.** An alert could open a draft order with the broken budget prefilled, for example Acquit's `paypal over budget · 4.1% of 2%`. The draft waits for the engineer to post it, because in CORE the engineer posts orders.

## Not for Acan

- **Cloud-only.** The talk says a local factory is impossible. Acan's core is open, local and single-player by design. Hosted Acan is the paid option.
- **A foreman agent that assigns work.** CORE says nobody assigns an order. Agents self-claim after a matching readback. That is Acan's core difference.
- **Chat tools as the main way in.** Slack and Linear are the talk's main entry points. Acan's value is the spatial view on one shell. An order API that other tools can post to fits later, but it does not replace the canvas.
- **An AI judge as the gate.** An LLM judge may give advisory scoring after the fact. The gate stays deterministic witness checks, because that keeps the readback honest.

## Timing

Nothing here is built before the go signal (READINESS G1 to G10). The three ideas are post-go candidates listed in `ui-v2/PARKED.md`.
