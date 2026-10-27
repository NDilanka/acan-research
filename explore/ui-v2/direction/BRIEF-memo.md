You are writing a design strategy memo for Acan, a desktop UI where one engineer runs many coding agents (Claude Code, Droid, Codex) over a live isometric map of their software systems ("plants": machines are services, belts are data flows) instead of a chat transcript. Heavy reasoning is the point. Load the `poteto-delegate` skill first and follow its reply rules.

Repo: `D:\dev\Experiments\Acan` (Windows, PowerShell 7). Write only your memo file (path below). Do not edit any other file. Do not commit.

## The user's verdict (2026-10-27), verbatim in substance
- Not satisfied with the UI redesign. The look feels dated or generic. Screens are busy and cluttered. The plant canvas does not read well. Cards and panels feel heavy.
- "The map needs to be more informative. That is the whole point. It should be more informative with less text." Devs who switch from normal chat UIs to this must feel the value of the approach and see the benefit of the live map.
- World mode is not an infinite canvas yet, and the user asked for one earlier. It must be an infinite canvas.
- Light appearance is pure white: the anatomy kit's default light theme (`explore/ui-v2/vendor/anatomy/iso-kit.mjs` lines 567 to 589, page `#f2f2ef`, card `#fbfbfa`, faces `#ffffff`). Dark stays too.
- Unsure whether Kvarm panels (the coordination server's status) should move off the compass island.

## Read first
- `explore/ui-v2/PARKED.md` (hard rules: one island shell, honesty, open core, Kvarm rules), `explore/ui-v2/CORE.md`, `explore/ui-v2/SHELL.md`, `explore/ui-v2/TEXT.md`, `explore/ui-v2/JOURNEY.md`.
- Research: `explore/research/agentic-ux/00-synthesis.md`, `b-games-softvis.md`, `j-plant-fidelity.md`, `k-multi-plant-canvas.md`, `f-frontier.md`.
- Look at the shots (Read the PNGs): `explore/ui-v2/shots/shell-*-after.png`, `shell-*-after-light.png`, `shell-world-overview-after*.png`, `orders-kv-unmatched.png` (the shell the user liked as cleanest).
- Code to understand what exists: `explore/ui-v2/build.mjs`, `explore/ui-v2/concepts/world.mjs`, `explore/ui-v2/concepts/orders.mjs`.
- You may use web search for references if available to you.

## The memo must contain
1. **Diagnosis.** What exactly makes the current screens dated, cluttered, heavy and hard to read, tied to specific shots and elements. Count where text does a job that position, shape, color, motion or size could do.
2. **The value case.** At least eight concrete moments in a multi-agent session where the live map beats a chat transcript (for example two agents converging on the same belt, a readback disagreement, a stale lease, cost and blast radius of a change, an agent idle and blocked on you, what changed while you were away). For each, what the dev sees on the map in under two seconds, which visual channel carries it, and the chat-UI equivalent it replaces. Rank them by how strongly they sell the switch.
3. **Encoding system.** A text-light visual language for agents, orders, claims, clashes, witnesses, readbacks, egress and time on the plant: glyphs, belt animation, heat, halos, trails, ghosting, density. Borrow deliberately (Factorio and Mini Metro HUDs, flight decks, Tufte small multiples and sparklines, Bret Victor, Figma multiplayer cursors, Linear's restraint) and say what each borrowing buys. Honesty rule: every mark traces to an origin fact, and the detail stays one key away.
4. **Infinite canvas model for world.** Real pan and zoom over an unbounded plane. Semantic zoom levels (for example org, site, plant, machine, file), what renders and what is hidden at each, level-of-detail and label collision strategy, how agents and their activity stay visible when zoomed out, navigation (keys, minimap or none, Go to, back and forward), and how the island shell sits over it. Point at the limits of the current fixed 1600x900 viewBox in `concepts/world.mjs`.
5. **Three competing visual directions.** Genuinely different, not three tints of one. For each give a name, a one-paragraph thesis, the look (type, color use in pure white and in dark, card weight, chrome), how it lands the top three value moments, how it handles the infinite canvas, and its main risk. Say which you would bet on and why.
6. **Kvarm placement.** Where coordination-server status should live, with reasoning.
7. **Prototype plan.** What each of the three prototypes must show to be judged fairly (same scenario, same fixtures, same sizes 1280x800 and 1440x900, light and dark), and a scoring rubric with weights. The rubric must include "a chat-UI dev sees the value in 10 seconds", words on screen, scan speed, honesty, and keyboard reach.
8. **What changes in the plan.** Which parts of JOURNEY.md, SHELL.md and TEXT.md each direction would overturn.

Keep it dense and concrete. Short declarative sentences, no em dashes. Cite files and lines for every claim about the current UI.

Write the memo to: MEMO_PATH
Report back with the path and a ten-line summary including your bet.
