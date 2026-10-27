# Direction round synthesis

Three independent memos from one brief (`BRIEF-memo.md`): `memo-opus.md` (Anthropic), `memo-grok.md` (xAI), `memo-gemini.md` (Google). Written 2026-10-27 by the coordinator.

## What all three agree on

These are not up for a vote in the prototypes. Every direction must do them.

- **Light is the anatomy kit's pure white** (`vendor/anatomy/iso-kit.mjs:580-589`): page `#f2f2ef`, cards `#fbfbfa`, faces `#ffffff`. No vellum, no brass as a general accent, no dark card on light. Dark uses the kit's dark tokens (`iso-kit.mjs:568-578`).
- **Cards are light.** Hairline border, no heavy shadow, at most about six rows at rest, one card open at a time in the 392 px right slot. Kvarm ledger strips leave the cards.
- **Healthy machines are achromatic.** Color means something happened. Hue identifies the agent, never status. Amber is reserved for "waits on you" and red for "breaks a witness or blocks".
- **A clash is visible before selection** as two agents' footprints or trails meeting at one pin.
- **Words live one key away.** Holding Alt reveals every mark's words in place with no layout jump. The six at-rest honesty values in `TEXT.md` stay visible.
- **Motion only on events.** With the event stream paused, the stage runs zero animations.
- **World is one infinite plane.** One camera, continuous wheel and pinch zoom centered on the cursor, five semantic levels (org, site, plant, machine, file), no DOM swap between world and plant, fixed screen-size labels culled by priority, agents and blockers stay visible as marks when zoomed out, off-screen blockers show as edge beacons.
- **Kvarm leaves the compass and the cards.** One status indicator plus the network log card in the right slot on click or Shift V. The bottom-right island drops the connection sentence. Two memos put the indicator in the top-right egress pill, one in the bottom-right island. The pill wins two to one.

## The three prototypes

- **A. Live paper** (Opus C, Grok Quiet instruments). The plant is a large white paper model in kit tokens. Agents are the only saturated things: colored bodies with Figma-style name flags on the machine they work on, still when waiting with an amber ring, ink trails that fade, ghosts under changed machines after away. Machines grey until abnormal.
- **B. Living cartographic** (Gemini Swiss Cartographic plus Living Factorio). The plant is a crisp matte architectural model. Facts are etched on the system: roof stamps and micro sparklines with budget lines, belts carrying packets whose spacing and color show throughput and errors, colored wireframe territories, live ghost previews of a clash resolution on hover. Agents are small drones with readback dots.
- **C. Transit** (Opus A). Flat 2D schematic at every level, 45-degree routing. Machines are stations, belts are lines, agents are colored lines running alongside the segments they work, trains stop with a filling ring when waiting. Tests whether the isometric drawing is itself the readability problem.

Grok's Summoned map and Drawn ledger, Opus's Instrument and Gemini's Quiet Cockpit were dropped. Summoned map hides the map by default, which defeats the point. Instrument and Cockpit replace words with numbers or strips, which the word budget counts as words. Drawn ledger fights the iso catalog and the honesty rule.

## Frames every prototype shows

Same fixture (`concepts/direction-data.mjs`), same island shell, 1280x800 and 1440x900, light and dark, `kv=ok` unless noted. Shots go to `shots/dir-<a|b|c>-<frame>-<WxH>-<light|dark>.png`.

| Frame | State | Proves |
|---|---|---|
| F1 | Org level, five plants | Agents visible per plant, waiting count, no machine labels |
| F2 | Zoom sweep org to Acquit, five stops | Same scene objects at every stop, no DOM swap, no label flicker |
| F3 | Acquit plant level at rest, no card | Waiting agent, two working agents, c1 collision readable with no selection |
| F4 | Hover Droid's breaker declaration | Blast radius on downstream belts only |
| F5 | c1 card open | Card weight, at most six rows at rest, camera unchanged |
| F6 | Return at 17:30 | What changed while away, from the map; return card lists only what the map cannot |
| F7 | `kv=unmatched` and `kv=stale` | Unmatched lease and stale state distinguishable, indicator wording |
| F8 | Alt held on F3 | Every mark shows its words in place, nothing moves |

## Rubric

Score 0 to 4 per line, weighted, sum to 100. Two vetoes. A direction under 3 on the ten-second line is out. Any mark without a binding, or any animation with no event, disqualifies until fixed.

| Line | Weight | Measured by |
|---|---|---|
| Chat-UI developer sees the value in 10 s | 25 | Show F3, then F6, 10 s each. Five questions: which agent needs you, which two agents collide and where, which agent is idle, is data leaving the machine, what changed while away. Plus "what would you lose going back to chat?" Judges are cold models from two labs, then the user. |
| Scan speed | 15 | Locate tasks from shots; marks named before the right answer; keys or hovers needed in the live build |
| Honesty | 15 | `textBind` and `textSeen` pass, every semantic mark has `data-binding`, zero animations with events paused, unknown draws fog hatch |
| Words on screen | 10 | `textCount` at rest on F1, F3, F6. Full marks at 50 words or fewer, zero at 136 |
| Plant legibility | 10 | Cold judge names six machine roles from F3 and points to the paypal belt; edge contrast at least 3:1 both appearances |
| Infinite canvas | 10 | Identity holds across F2, continuous zoom, org still shows the blocked agent, p95 frame under 16 ms with a twenty-plant stub |
| Keyboard reach | 10 | Every frame reachable by keys, every hidden word one key away |
| Look | 5 | Tokens only in light (audit grep), 4.5:1 text, panel judgment of modern and calm |
