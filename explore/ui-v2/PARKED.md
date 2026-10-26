# Parked session: Acan agentic UX (ui-v2)

Resume file for a fresh orchestrator chat. Updated 2026-10-26. No loops. Running subagents are the shell, text and audit agents (step 1). If this chat is gone, they are dead: launch fresh with the same briefs.

**Machine.** The project moved off the droid computer to Windows at `D:\dev\Experiments\Acan` (PowerShell 7). Translate any `/home/factory-user/acan` path. The shell, text and audit agents died on Oct 18 when compute ran out. Their edits were rebuilt from transcripts into the working tree. `SHELL.md` was never written.

## Hard rules and standing directives

- **No implementation of Acan until Droid gives the go signal.** The go signal requires every line of `ui-v2/READINESS.md` (G1 to G10) to be green, ending with the user's own browser walkthrough (G8). The team bar (T1 to T4) gates only the paid team module, never the core go signal. Until then, iterate on UI and UX only.
- **The user wants UI and UX that are excellent, with core features first.**
- **All design builds and critiques go to Opus.** Use pv-opus-high for builds and critiques, and pv-opus-medium for prose. The second lab on review panels is Grok (pv-grok-high or pv-grok-xhigh), or Haiku (pv-haiku-max).
- **One shell.** It is the full-bleed plant with floating glass islands in `ui-v2/shots/orders-kv-unmatched.png`. The user picked it as "the cleanest". The world-style top bar, toolbar row, framed stage and docked inspector (`shots/world-07-levels.png`) are rejected. World and the journey move onto the chosen shell.
- **There is too much text in the UI.** The text system (`TEXT.md`) sets measurable word budgets, and honesty stays one key away.
- **Run drive.mjs runs one at a time.** Parallel drivers cause timing flakes. `node ui-v2/run-steps.mjs [steps files]` builds and drives under a shared lock dir in the temp folder, so agents running in parallel still drive one at a time. It works on Windows, macOS and Linux. Every brief tells agents to use it. Env passes through (`AUDIT=1`, `SIZE=WxH`, `OUTROOT`, `CHROME`).
- **The build is self-contained.** The anatomy iso kit is vendored at `ui-v2/vendor/anatomy/` (MIT, source in `SOURCE`). Never import from a home folder again.
- **Multiplayer is the paid team product (user decision, 2026-10-26).** Acan becomes multiplayer. People land in the same world, such as their company's world, run agents in parallel, and monitor the system together. The single-player core is open source and complete: one person, many agents, Kvarm, the gate, the whole journey. Multiplayer (shared worlds, membership, presence, team rows, handoffs, cross-person clash) is paid and lives behind its own seam. A hosted Acan version is paid too. The open app never requires it, never nags about it, and loses nothing when it is absent. Research is step 0. The open and paid line, the team seam and the user calls are in `research/agentic-ux/02-synthesis-multiplayer.md`.
- **Kvarm is changing (2026-10-26).** The Kvarm rewrite has no committed integration date, and the user gets early beta access. Acan uses current Kvarm behind its own thin adapter and migrates only after behavior conformance. New server features are optional capabilities discovered at connect time, not product facts. The private details live outside the repo in `recovered/kvarm-rewrite-notes.md`. Never put the new name or the unannounced features in a committed file.
- **Verify every agent's work yourself.** Rerun its steps files and look at the key shots before you accept it. Log each decision with `~/.factory/plugins/marketplaces/pvstack/plugins/pvstack/skills/show-me-your-work/scripts/log.sh research/agentic-ux/decisions.tsv <phase> <decision> <why> <evidence> <result>`.
- **Write replies to the user in plain sentences.** No em dashes and no mid-sentence colons. Cite principles where they decide something.
- **Fresh-chat rule (user AGENTS.md).** At every boundary, update this file. Suggest a fresh chat when the chat is heavy and the moment is cheap. Never suggest while a subagent is running or a change is half-made. When you suggest, end with a copy-paste handoff prompt.
- **Open core (user decisions, 2026-10-18 and 2026-10-26).** The desktop, agent adapters, coordination adapter, current-Kvarm driver, local persistence and the whole single-player journey are open. The open app draws every fact the origin reports that affects safety, whoever caused it. The paid team module (the people layer) and the paid hosted version sit behind the team seam, outside the open app's import graph and startup path. Preserve portable repository files and export without paid entitlement checks. No component, paid or open, adds a second lock beside the origin's fenced claims.
- **Kvarm** is opt-in to an explicitly selected origin with declared egress. Each order has one authority. Agents self-claim after an applicable readback match and that authority's accepted live lease. A lease without the match is UNMATCHED. Server-side readback enforcement is discovered, not presumed. Review allowance advice never blocks work. Enforced publication rules block publication only. The world is a canvas of systems, not agents.

## Repo and name

- The product was renamed from Orrery to Acan on 2026-10-18, at the user's request. All text files, the folder (`/home/factory-user/orrery` became `/home/factory-user/acan`), the plants (`acan-format`, `acan-site`) and the Kvarm origin (`git.acan.local`) changed. The screenshots and builds were regenerated.
- This is now a git repo on `main`: `3db036b` initial import, `e9cbe5a` rename, `1d7661c` open-core decision, then this update.
- It is pushed to the public repo https://github.com/NDilanka/Acan (`origin`, `main` tracks `origin/main`). Push finished work to `main` after each commit. The repo is public, so never commit secrets.
## Where things stand

- **Done.** Research waves (a to m), syntheses, interviews 1 to 3, and the map proposal (`proposals/ui-v2.md`, including same-file rows W23 to W27).
- **Same-file editing.** Tenure is killed. Kept: a declaration-level advisory clash forecast, read-blob admission as a Kvarm ask, and a narrow Slots pilot (`research/agentic-ux/same-file/00-judging.md`).
- **Five standalone prototypes** in `ui-v2/concepts/`: orders, clash, gate, bench, world.
- **`ui-v2/JOURNEY.md`** is the spec that stitches all five into one session. Its section 1 still describes the rejected bar-and-dock shell.
- **Health check, Windows, 2026-10-26.** At HEAD 861dc59, 8 of 12 steps files print OK (clash step 2, orders step 9, quiet step 41 and world-kv-offline step 15 fail; world-kv-offline is timing flaky). In the rebuilt tree, 7 of 12 (clash 2, gate 70, orders 9, quiet page error, world 17). On Linux before the crash only clash step 4 failed, so clash and orders also fail from Windows font metrics. The shell and text agents own these.
- **Partial files from stopped agents.**
  - `ui-v2/audit.mjs` (41 KB). The AUDIT-gated code in `drive.mjs` is partly there, and plain runs still print OK.
  - `ui-v2/concepts/quiet.mjs` (79 KB), registered in `concepts/index.mjs:13`.
  - `TEXT.md` and `SHELL.md` do not exist yet.
- **Backups.** `ui-v2/.backups/shell-before/` and `ui-v2/.backups/uiv2-before/`.
- **Reviews in.**
  - `review/world-xai-r2.md`: world not ready, 3 must-fix (connector lines, queue clip, arrival message).
  - `review/core4-xai-r2.md`: all four not ready. Badge counts disagree with the rows. Readback rows say pending and failed after the claim. Gate I skips the blocking row. Bench says "8 of 9 replayed". Light mode is unread.
  - `review/journey-spec-xai.md`: 11 must-change. Items 1 and 2 are superseded by the shell. Items 3 to 11 are still open.
- **Dropped.** The Haiku world r2 and core4 r2 reviews. They judged the pre-shell layout. The second-lab review moves to the journey.

## Next steps, in order

0. **Multiplayer and Kvarm research** (done 2026-10-26). n and o are committed (45a01a9). p stays local and uncommitted, because its capability list mirrors the private rewrite plans. The synthesis is `research/agentic-ux/02-synthesis-multiplayer.md` (9272073). Its defaults stand for the ten user calls until the user answers. The plan is applied to CORE.md, READINESS.md (G10 and the team bar T1 to T4), the proposal and this file (9959f5a). The 15 JOURNEY changes wait until the shell agent finishes section 1, then recheck each line address. Keep the four connection scenarios, add `peer=1`, and add the capability, race and uncertain-outcome fixtures. Do not turn mock success into a deployed compatibility claim. The team pass (JOURNEY section 8) is built after the core journey and does not block it.
1. **Shell, text and audit agents**, all pv-opus-high, as poteto-agent. Text done: TEXT.md and quiet committed (16b381c), quiet OK twice on the coordinator's own runs, screens down 41 to 62 percent. Audit done: audit.mjs, SIZE in drive.mjs and review/audit-r1.md committed (8acce6b), selftest 23 of 23. Shell agent e6f82ecc died 2026-10-26 (model provider unreachable); relaunched as bfc7a7d0, which died on a usage limit; relaunched again as 8d93d25d-02aa-4a6a-975b-aa814bdd8ad1. JOURNEY.md section 1 is already rewritten for the island shell (uncommitted). Baseline at that relaunch: 8 of 12 OK (gate 70, orders 9, orders-kv-offline 14, orders-kv-stale 13 fail). The text-budget audit rule delegate is 810f77ae-b130-40bf-afc5-45c323ebdad9. Its brief now also covers the audit findings and the orders-kv concept-side failures. Agents do not commit; the coordinator verifies and commits.
   - **Shell** (resume id 8f886fb1-0f0c-46f1-b44d-6322cba54ce2).
     - Write `ui-v2/SHELL.md`, the one shell spec, based on the liked orders layout. Give island positions and sizes at 1280x800, 1440x900 and 1600x900.
     - Fold world's extras into the islands. The breadcrumb and Back/Forward go in the top-left island, the search becomes Go to (Ctrl K), and the toolbar items become Layers menu items or palette commands with their keys. Appearance goes in Layers or the top-right island. The inspector becomes a floating card. The minimap goes in the compass slot or is dropped.
     - Fix the orphaned top-left hint line, island alignment, the compass-card collisions, light islands and focus rings. Add no new chrome, and do not rewrite copy.
     - Rewrite JOURNEY.md section 1 to match.
     - Move world onto the shell. Update the world steps files, and keep every world key.
     - Fix the clash step 4 failure.
     - Put side-by-side shots in `shots/shell-*.png`.
     - Every steps file must print OK, run one at a time.
     - It may edit `build.mjs` and the ui-v1 shell CSS, with backups. It must not edit `quiet.mjs`, `TEXT.md` or `audit.mjs`.
   - **Text** (resume id f7310e8b-45ab-4e59-b6da-eb673ee9c7dc).
     - Exhaust the design space: at least four directions, drawing on Factorio and Mini Metro HUDs, Linear, Figma, Things, Tufte and HIG progressive disclosure. Score each on scan speed, honesty and keyboard reach.
     - Write `ui-v2/TEXT.md` with measurable word budgets per surface and per screen, the counting selector logic for the audit, and the honesty rule.
     - Prove it on `concepts/quiet.mjs`, a copy of orders, with `quiet.steps.json` and before and after shots `shots/quiet-*`. Use the kv=unmatched flow and the claimed end state, in dark and light. Put the word-count table in TEXT.md.
     - Do not restyle the shell, and do not edit `orders.mjs`.
   - **Audit** (resume id 956577d1-ed0d-49e4-94d4-80b4ae7de42d).
     - Finish `audit.mjs` behind `AUDIT=1` in `drive.mjs`. The rules are type-floor (11 px), overlap (with a `data-audit-stack` opt-out), offscreen, contrast (4.5:1, and 3:1 for large text, with background blending), focus-ring (as the `{"audit":"focus"}` step), transition (with an allowlist), egress-sum, and focus-steal.
     - Add `SIZE=WxH` to `drive.mjs`.
     - Run it over every steps file in dark and light, with shots to `/tmp/audit-<id>`. Write `review/audit-r1.md`.
     - Edit only `audit.mjs`, the AUDIT and SIZE code in `drive.mjs`, and the review.
2. **When they return**, verify each yourself and show the user the before and after shots. Add the word-budget and island-position rules from TEXT.md and SHELL.md to `audit.mjs`.
3. **Revise `JOURNEY.md`** (Opus). Apply spec-review items 3 to 11, and reconcile it with SHELL.md and TEXT.md.
4. **Build the journey** (Opus). Inputs are the revised JOURNEY.md, SHELL.md, TEXT.md, and every must-fix in `review/*-r2.md`. Verify at 1280x800 and 1440x900, in light, with kv=offline, and with AUDIT=1.
5. **Run a cross-lab journey critique** (G5), then fix rounds.
6. **Run the cold first-use test** (G6): six tasks, two models.
7. **Finish up.** Update the READINESS status column, refresh the proposal's prototype section (G7), do the browser walkthrough with the user (G8), then give the go signal.

## Open questions for the user

Ten multiplayer and adapter calls, listed with defaults in `research/agentic-ux/02-synthesis-multiplayer.md` under "User calls". None blocks the shell, text or audit agents. Also open: whether `research/agentic-ux/p-kvarm-rewrite.md` may be committed, since its capability list mirrors the private rewrite plans. The user may want the Kvarm panels moved off the compass, and the shell agent's SHELL.md decides that.
