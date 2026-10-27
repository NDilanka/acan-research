# Direction memo: a map that informs with less text

Date 2026-10-27. Written from the shots, the specs, and the research named in the brief. Claims about the current UI cite a file and a line. Claims about a shot name the file. Precedents name the page that was read. Inferences are marked as such.

The person this is for is one engineer running Claude Code, Droid, and Codex over several of their own systems. They already have a chat transcript that works. The map earns the switch only when a glance answers a question the transcript would make them reconstruct. The next engineer who owns this inherits a visual language, a camera, and three prototypes that must be judged on the same fixtures.

## 1. Diagnosis

The redesign moved chrome onto islands and cut words. It did not change what the eye is asked to read. The plant is still a captioned illustration, the cards are still dark documents, and light is still warm paper. A chat-UI developer looking at these shots sees a dashboard of labels, not a system they can read.

**The shell round did not change the look.** `PARKED.md` records that the before and after light shots are almost pixel-identical, and that the round fixed alignment rather than appearance. The liked screen, `orders-kv-unmatched.png`, is clean because the stage is dark, the card is one document, and the islands are small. The after shots add islands and keep the same caption density.

**Light is warm paper, not the kit's white.** The anatomy kit's light theme sets page `#f2f2ef`, card `#fbfbfa`, and faces `#ffffff` (`vendor/anatomy/iso-kit.mjs:567-589`). The shell overrides that. `build.mjs:241` sets the light page to `#f4f1ea`. `build.mjs:242` paints the live stage as a cream radial from `#f8f5ed` to `#ebe7dc`. `build.mjs:248` paints machine faces `#F8F5ED`, not `#ffffff`. World does the same with its own tokens. `concepts/world.mjs:809` sets paper `#F4F1EA` and panel `#FCFAF5`. `concepts/world.mjs:1007` sets machine paper `#F2EEE4` and faces `#F8F5ED`. `shell-orders-after-light.png`, `shell-world-overview-after-light.png`, and `shell-world-after-light.png` all show that cream. The result reads as a stationery mock, not a working tool.

**Cards stay graphite in light, and they are heavy in both appearances.** `build.mjs:56-57` pins `.simdeck` and `.insp` to dark glass under `body[data-appearance=light]`, and the comment on line 56 says this is so their text keeps contrast. `SHELL.md` section 7 records the same pin. Concept cards hard-code the same graphite. `concepts/orders.mjs:24` sets `.orders-card` to `rgba(22,22,21,.97)` with a `#665333` border. `concepts/orders.mjs:72` sets the dock to `rgba(20,19,17,.96)`. In `shell-orders-after-light.png` the replay deck, the bottom-left panel, and the claim card are black slabs on cream. In `shell-gate-after-light.png` the inspection card is a near-full-height black column. In `shell-bench-after-light.png` the bench card and the claim card are the same. The contrast is the point of the pin, and it is also why the panels feel heavy. A 1 px hairline on white would weigh less and still clear 4.5:1.

**The plant does not read, because every fact is a floating sentence.** In `shell-world-after.png` each machine carries a caption such as `acquit-api p99 184 ms · 41 s`, `verifier 1 cell occupancy ?`, `retry loop 2/3 · 41 s`, and `paypal 4.1% errors · 41 s`. Territory words (`GATE SESSIONS`, `RADAR-OTEL`, `PAYPAL PAYOUTS`) sit on the machines as well. The code that emits this is `concepts/world.mjs:256-265`. Each machine button contains the name, `miniValue(b)`, and, when a runtime field exists, the literal `occupancy ?`. `declutter` (`concepts/world.mjs:315-336`) only lifts a label 12 px at a time, up to 12 times, so the fix for collision is more vertical text, not less text. The overview has the same habit at site scale. `siteHtml` (`concepts/world.mjs:209-215`) prints a number, a name, an Alt key cap, an environment, a freshness string, and a condition sentence. `shell-world-overview-after.png` shows `OTLP stale · 41 s` beside Acquit and `p-2307 needs an answer` under it. Position, which `k-multi-plant-canvas.md` says is the thing a stable layout is for, carries nothing. The words carry everything.

**The same fact is said in three places.** In `shell-orders-after.png` the claim is a brass plate on the plant (`CLAIMED · Claude Code · lease g1`), a row in the bottom-left panel (`Claude Code claimed payout order`), and the body of the right card, which repeats the order sentence and the checks. The plate markup is `concepts/orders.mjs:73-75` and the flag text is `concepts/orders.mjs:237`. In `shell-clash-after.png` the clash is a pin (`C1 #418`), a chip (`Retry meets breaker`), a footprint line (`retry · Claude Code · declared`), the left status card (`2 clashes before code`), the hint strip, and the right card. Six surfaces, one fact. `TEXT.md` cut the sentences and left the repetition.

**The hint strip is a second manual.** `SHELL.md` section 2.1 measures the clash hint at 730 px and the gate hint at 670 px at 1600 x 900. `shell-clash-after.png` shows `V FOOTPRINTS · I NEXT CLASH · SHIFT 1-4 SETTLE · CTRL Z UNDO · U KVARM · ALT HOVER PROVENANCE · ESC CLOSE` across the top of the plant. `shell-gate-after.png` and `shell-bench-after.png` do the same. The strip is an island, so `TEXT.md` budgets it at 12 words, and these strips are past that. A key cap belongs on the control it names, or nowhere until the control is focused.

**The bottom-left panel is a transcript in a corner.** `SHELL.md` section 2.1 measures `.fl.bl` at 168 px tall, and section 7 says it cuts 120 px into the free rect. `shell-orders-after.png` fills it with `Waiting on you 3`, three agent rows, and `Floor timeline`. `shell-gate-after.png` shows 7. `shell-clash-after.png` shows 9. The count and the rows disagree with each other across concepts, which `review/core4-xai-r2.md` already flagged. The panel is the chat transcript the map was supposed to replace, docked at the corner.

**Agents are name chips, so activity is illegible at a glance.** `build.mjs:73-75` draws `.chip` as a glass pill with a 9.5 px mono cap, 10.5 px uppercase type, and a 1 px stem. `concepts/orders.mjs:137-140` adds a second line of 9 px type. In `shell-clash-after.png` the Claude Code chip reads `CLAUDE CODE · claude-payouts · authenticated · lease g1` and sits on top of the Codex chip and the paypal machine. Nothing in the chip's shape says the agent is working, blocked, or idle. The lettering does, and it only does so from close up.

**Motion and color do not carry state.** The belts in `shell-orders-after.png` and `shell-clash-after.png` are static rails. No cargo moves, so a backed-up belt and an idle belt look the same. `j-plant-fidelity.md` already binds cargo to sampled events and forbids motion without evidence. The shots have neither. Saturated color is spent on the mode wash (blueprint blue, replay brown) and on brass, which `CORE.md` assigns to plates. Amber and red, which should be the only alarm colors, appear as small dots inside text rows. Healthy and waiting look alike until you read.

**World is a poster, not a canvas.** `#worldRoutes` is a `viewBox="0 0 1600 900"` SVG, and `#worldViewport` is a 1600 by 900 box (`concepts/world.mjs:772`, `concepts/world.mjs:829`, `concepts/world.mjs:1026`). The five sites are placed inside that box at fixed coordinates (`concepts/world-data.mjs:5,27,28,44,56`). `worldTransform` (`concepts/world.mjs:200-207`) computes a scale that fits those five rects into the free rect, and never lets the user leave the bounding box of the five. The wheel handler (`concepts/world.mjs:718-736`) does not zoom continuously. It waits for 110 px of inward delta, then calls `goPlant`, which swaps the canvas for a separate stage. Drag exists (`concepts/world.mjs:737-746`) but only while no card is open and only at world level. `JOURNEY.md` section 4 records the decision in one line. "World coordinates are 1600 x 900. The canvas keeps its viewBox and the camera fits the free rect." That is the limit the user already rejected.

**Where text does a job a mark could do.** Counted on the current shots, these are jobs that position, shape, color, motion, or size could carry, and that a sentence carries instead.

1. Who holds an order. A chip sentence, `shell-orders-after.png`. A colored body at the machine would do it.
2. Whether the readback matched. A paragraph in the card, `shell-orders-after.png`. A halo on the claimant would do it.
3. Which witness a claim breaks. `Breaks w3` in the card, `shell-clash-after.png`. A red tick on the witness pin would do it.
4. That two agents share a belt. Footprint captions, `shell-clash-after.png`. Two trails on one rail would do it.
5. That a lease has no matching readback. `UNMATCHED` text. A broken ring would do it.
6. Lease age. A countdown string. A shrinking arc would do it.
7. That an agent is blocked on the user. A row in `.fl.bl`. A still body with a raised hand would do it.
8. That an agent is idle with nothing to do. No mark at all today. A dim body off the machine would do it.
9. Freshness. `41 s` repeated on five captions, `shell-world-after.png`. A dim last value, already specified in `CORE.md`, would do it.
10. Unknown versus zero. `occupancy ?` as words, `concepts/world.mjs:265`. An empty bezel versus a drawn `0`, already specified in `CORE.md`, would do it.
11. Budget breach. `paypal over budget · 4.1% of 2%` under the site, `shell-world-overview-after.png`. A needle past a notch would do it.
12. Cross-plant contract kind. `OTLP / HTTP` as a text label on the route, `concepts/world.mjs:750`. A dash pattern already exists in CSS (`concepts/world.mjs:833-836`) and is then undone by the words.
13. How many decisions wait. A digit in a pill, plus a list. The digit alone, placed on the plant that owns the decisions, would do it.
14. What changed while the user was away. A brief card of sentences, `JOURNEY.md` beat 15. A trail of new marks with one age would do it.
15. Whose write is a forecast. `forecast` as a word in the card footer, `shell-clash-after.png`. A dashed outline would do it.
16. Connection health. A sentence in the bottom-right island, `shell-world-after.png`. One lamp would do it.
17. Egress. `local + kvarm · 1,664 B out` as a pill, `shell-gate-after.png`. A meter segment would do it, with the bytes one key away.
18. Which plant a route belongs to. A sentence at each end, `shell-world-after.png`. The route's endpoints already are that fact.

Eighteen jobs. The honesty rule in `TEXT.md` is right that a value which changes the next action cannot hide. It is wrong, in practice, that the value has to be a sentence at rest. The value can be a mark whose legend is one key away, provided the mark is learnable in one sitting and the legend names the same binding.

## 2. The value case

Each moment below is one the live map can show in under two seconds and a chat transcript cannot without the engineer reconstructing it. The visual channel is the one a glance uses. The chat equivalent is the work the transcript imposes. Rank is how hard this moment is to get from chat, and how often it happens in a session with three agents. Rank 1 sells the switch. Rank 10 is real but rare.

The scene for all ten is the journey's Acquit plant plus the other four sites. Claude Code holds the paypal order. Droid is on the radar belt. Codex holds a lease with no readback. Witnesses w1, w2, and w3 are pinned. Two clashes are open. The user stepped away for thirty minutes.

**1. Two agents converge on the same belt.** Claude Code's declared write and Droid's declared write both land on the api-to-paypal belt, at the breaker. The engineer sees two colored trails ending at one point on one rail, with a single clash pin where they meet. Channel is position plus two hues on one line. A chat transcript has this as two diffs in two sessions, and the shared belt is something the engineer has to notice by reading both. `g-engineering-analogies.md` calls this the semantic clash, and `00-synthesis.md` row 21 says worktrees do not catch it. This is the moment that justifies the map.

**2. An agent is idle and blocked on the engineer.** Codex has waited at its own prompt. The engineer sees one still body, off any machine, with a raised hand and a waiting age on the body, and the machine it is stuck on is marked rather than described. Channel is stillness against moving cargo elsewhere, plus a pose. Chat shows a session that has not produced a token recently, which looks the same as a session that is thinking. `f-frontier.md` quotes a developer who cannot tell whether to wait or switch. The pose answers that.

**3. What changed while the engineer was away.** On return, the plant shows only the marks that moved during the away window, drawn brighter than the settled plant, each with an age and none with a sentence. A new pin at sqlite, a settled mark on the belt, a budget needle that crossed its notch. Channel is brightness plus age, on the same geography the engineer left. Chat requires reading every session from the departure timestamp. `00-synthesis.md` row 13 calls the return brief a checked handover, and `e-attention.md` is the source. The map version is the brief drawn on the plant, not a card of sentences.

**4. A readback disagreement, pinned where the two readings differ.** Claude Code keeps p-2307 pending. Droid removes it. The engineer sees one question pin on the sqlite tank's effects-queue layer, and two short reading marks beside it that do not match. Channel is a pin at the contested part, not a toast. Chat has this as two paraphrases the engineer has to diff by eye. `JOURNEY.md` beat 5 already places the pin. The current UI then explains it in a toast, a queue row, and a card (`shell-orders-after.png` shows the card half of this). The pin alone is the value.

**5. Cost and blast radius of a change before any file is edited.** Droid's breaker declaration reaches paypal, the retry loop, and the witness w3 pin. The engineer sees the declaration as a translucent outline over exactly the machines it touches, and sees w3's pin turn red because the outline covers it. Channel is extent of a ghost plus one red pin. Chat has a plan in prose, and the blast radius is a guess. `b-games-softvis.md` section 1 describes proof-bearing ghosts. `CORE.md` already stores the footprint. The shots draw it as captioned boxes (`shell-clash-after.png`), so the extent is there and then covered in labels.

**6. A stale lease.** Claude Code's lease was accepted and has not been renewed. The engineer sees the claimant's body still on the machine, its ring dimmed, and a gap in the ring where the remaining time ran out. Fog returns on the territory only when the binding says the renewal is unknown, not merely because time passed. Channel is a ring's arc and a dimmed body. Chat has a tool result somewhere in the scrollback. `CORE.md` already separates failed observation, known expiry, and rejected fence. The ring is how that difference becomes visible without a sentence.

**7. A lease with no matching readback.** Codex holds g1 and never matched. The engineer sees a body on the paypal dock with a broken ring, the territory still fogged, and no claim halo. Channel is a broken ring against fog, where a matched claim would be a closed ring and clear ground. Chat cannot show this at all unless the engineer asks each tool. `orders-kv-unmatched.png` shows the current answer, which is the word `UNMATCHED` in the card and again on the plate. The word is honest. It is also the whole UI.

**8. Budget breach with its trail.** paypal.error_rate is 4.1% against a 2% budget. The engineer sees the paypal gauge needle past its notch, and a faint heat on the belts that feed it, so the breach and its likely sources are one picture. Channel is a needle and a heat overlay. Chat has a metric in a tool result, and the path that produced it is a second lookup. `j-plant-fidelity.md` binds the gauge to one named metric and the notch to a designed budget. `shell-world-overview-after.png` prints the breach as a sentence under the site and nowhere on the machine.

**9. Declared, checked, and observed disagree.** The blueprint says one verifier cell. The running process reports two busy. The last check passed against the old revision. The engineer sees three small marks on the verifier, in three fixed corners, and they do not agree. Channel is three marks that stay separate, never one green light. Chat collapses all three into "done" or "the agent says it works". `00-synthesis.md` row 1 is the strongest convergence in the research. The shots have no such separation. `shell-bench-after.png` comes closest and then puts it in a table of words.

**10. Egress at the moment it happens.** A publish leaves the machine. The engineer sees one segment added to a thin meter in the corner, and the belt that carried the send flashes once along its real path. Channel is a meter tick plus a path. Chat has an HTTP log the engineer does not open. `TEXT.md` already requires the byte total at rest. The path is the part chat cannot show.

Moments 1, 2, and 3 are the ones a prototype must land. A developer who has only used chat should be able to point at the converging trails, the blocked body, and the new marks after away, and say what each means, within ten seconds of first seeing the screen.

## 3. Encoding system

The language has eight channels. Each one is bound to a fact the fixtures already have, or to a fact `CORE.md` already requires the binding record to carry. No channel is decorative. Alt, or the equivalent held key, names every visible mark in place. The binding card is one more key away and reads the same record the mark reads, which is the rule `CORE.md` already states under "Bindings and provenance".

**Bodies, not chips.** An agent is a small body of a fixed silhouette, one hue per product. Claude is one hue, Droid a second, Codex a third. The hue is stable for the life of the product, so it survives the session. The body sits on the machine it is touching, or on the ground beside it when it is waiting. Pose carries state. Working is a body on the machine. Blocked on the engineer is a still body with one arm raised, and the age of the wait is a short tick beside it, not a sentence. Idle with nothing queued is a dim body, off the machine, no raised arm. Passive, the Codex case of "cannot see orders", is a body with no hands. The chip sentence in `build.mjs:73` goes. The name is one key away, on the body, and stays one key away rather than shipping as a default label. Figma's multiplayer cursors are the precedent. Evan Wallace's 2016 note says the cursor and the selection are shown because they answer who is here and where they are working. The body is that cursor for an agent that has no mouse.

**Rings for authority.** A closed ring under a body means a live lease bound to a matched readback. A broken ring means a lease with no match, which is the UNMATCHED case. A ring with a gap that grows means a lease whose renewal is ageing. No ring means no lease. The ring's color is the agent's hue at low saturation, so authority and identity stay one mark. Text states the authority only in the binding card.

**Halos for match.** A soft halo in the witness color means the claimant's readback matches every current check. No halo means the match is incomplete or absent. The halo is binary on purpose. `00-synthesis.md` row 15 forbids a single confidence number, so the halo does not fade with a score.

**Ghosts for intention.** A declaration is a translucent outline over the machines it names, in the agent's hue, drawn as Factorio draws a ghost. Hrusa's note in Friday Facts #380 says a ghost must be distinguishable from a built entity first, and only then typed, and that an assigned ghost changes tint once a robot has it. Acan uses the same split. An unbuilt declaration is a ghost. A declaration whose agent has started editing becomes solid only at the machines already observed to change, and stays a ghost everywhere else. A forecast from another principal stays dashed and never exclusive, which `CORE.md` already requires. The caption `declared · kvarm intent` in `shell-clash-after.png` becomes the ghost's provenance, one key away.

**Trails for convergence.** A declared write leaves a thin trail in the agent's hue along the belts it will touch. Two trails on one rail are the clash, and the pin sits at the shared point, not beside it. The trail is the moment ranked first. It replaces the footprint captions.

**Belt motion for observed traffic only.** Cargo moves on a belt when a sampled event says something crossed it. Speed is the observed rate, binned into three, never a continuous lie. A backed-up belt shows cargo queued at the sink. A belt with no sample shows no cargo and a fogged fitting. A known zero shows a still belt with a drawn `0` at the fitting. This is the Factorio tell `j-plant-fidelity.md` already specifies, and it is absent from every shot. Motion stops being a progress signal because it stops when the evidence stops. `00-synthesis.md` row 3 is explicit that motion must not read as progress.

**Heat for a named pressure.** One overlay at a time, chosen from Layers. Review load, retry amplification, or spend. Heat is a wash along the affected path, drawn over the unchanged layout. Oxygen Not Included's overlays are the precedent `b-games-softvis.md` cites. The base layout does not change color to mean the overlay. Heat is off by default, so the resting plant stays quiet.

**Witness pins, and a red tick when a ghost covers one.** A must-not pin is a small red mark at the machine and the time it was taken. A must-keep pin is the same shape in teal. Both already exist as ideas in `CORE.md`. The new part is the tick. When a ghost's extent covers a pin, the pin gains a red tick. The tick is the blast-radius moment, and it is binary. The witness id is one key away.

**Time as age, not a clock.** Every mark that can go stale carries its age as a dimming of the last value, and the age in seconds is one key away. A mark newer than the away window is drawn brighter than the settled plant. That brightness is the return brief. No scrolling timestamp, no `41 s` printed on five machines.

**Density and small multiples.** At world zoom, a plant is a footprint, a name, and at most three marks. Those marks are the worst waiting decision, the freshness state, and the budget state. They are the same three corners on every plant, so the row of plants reads as a small multiple. Tufte's rule, as stated in *The Visual Display of Quantitative Information* and summarized by Liu and Zhuang, is to maximize the ink that encodes data and to repeat a chart at the same scale so comparison is visual. The five sites in `shell-world-overview-after.png` are the same chart drawn five times with different sentences. They should be the same chart drawn five times with different marks. A sparkline of the one named budget sits in the footprint, word-sized, with no axis. The number is one key away.

**What each borrowing buys, and what it does not.**

- Factorio's ghost tint and alt mode buy a plan that is visibly not built, and a held key that reveals recipes in place. The shortcut-bar wiki describes alt mode as additional information on built entities, such as assembler recipes. Acan takes the held key and the ghost, and does not take the factory aesthetic as a pitch. `f-frontier.md` says that aesthetic is already a category.
- Factorio's remote view buys one set of actions at every zoom, so the engineer does not learn a second interface for the overview. Friday Facts #380 is explicit that a separate preview widget was a failure because people tried to click it. Acan's world zoom has to be the same plant, drawn with less, not a second picture.
- Mini Metro's shapes buy a passenger and a station that match without a label. The guide at minimetro.io states the rule as one sentence. A circle passenger needs a circle station. Acan takes the rule that a shape matches a shape, and uses it for witness pins against ghost extents. It does not take the game's palette or its demand for constant attention. `b-games-softvis.md` opens by saying Acan should borrow control loops, not attention demand.
- A flight deck's primary flight display buys redundant encoding. Attitude is a horizon and a number. Mode is a shape and a word, never a color alone. `00-synthesis.md` row 17 already requires mode and authority in text and shape. The ring plus the word in the binding card is that rule.
- Tufte's small multiples and sparklines buy comparison across plants without a sentence per plant. They do not buy the deletion of the number. The number moves one key away, and the honesty rule still holds.
- Bret Victor's ladder buys the zoom itself. His essay treats zoom as a change of representation, not a magnification, and requires a way to step back down to a concrete state. Semantic zoom below is that ladder. A wheel that only magnifies is the thing he argues against.
- Figma's cursors buy presence without a roster. Wallace's note says the cursor answers who is here and where they are. The paid team layer can reuse the same body with a second, smaller mark for the person. The open build shows agents only.
- Linear's 2024 redesign buys restraint in the chrome. Karri Saarinen's account says the work reduced visual noise, kept alignment, and raised the density of navigation by removing chrome rather than adding it. Acan takes the discipline of one accent, hairline surfaces, and no second manual in the header. It does not take Linear's issue-tracker layout.

**Honesty.** Every mark reads a binding record with channel, value, state, source class, locator, revision, and age, which is the record `CORE.md` already defines. A missing field draws the unknown state, never a demo default. Unknown is a fogged fitting and no motion. Stale is the last value, dimmed, with no motion. Zero is a drawn `0`. Stopped is a dark shell. Simulated is a hatched shell with the `SIM` tag. These five are already specified. The encoding adds no sixth. Alt names the mark under the pointer in one line, and the line is the binding's own text, so the legend cannot drift from the picture. Keyboard users reach the same line from the selected mark with one key. Nothing in this system is a value that changes the next action and lives only behind a second click.

## 4. Infinite canvas

**The plane.** World is one unbounded plane in world coordinates, with the origin at the user's first plant and no edges. Plants sit at stable coordinates the architect accepts, which is the rule `k-multi-plant-canvas.md` already gives. The camera is a translation and a scale, both continuous, stored per window. Pan is a drag on empty ground, and also the arrow keys. Zoom is the wheel, anchored at the pointer, and also plus and minus. There is no maximum zoom-out other than the one that fits every placed plant, and no maximum zoom-in other than the machine cutaway. The current code cannot do this. `#worldViewport` is 1600 by 900 (`concepts/world.mjs:1026`). `#worldRoutes` uses `viewBox="0 0 1600 900"` (`concepts/world.mjs:772`). `worldTransform` fits the bounding box of the five sites and then stops (`concepts/world.mjs:200-207`). The wheel snaps between levels instead of scaling (`concepts/world.mjs:718-736`). Those three are the limits to remove. The 1600 by 900 figure survives only as the size of one plant's stage art, which `STAGE` already is (`concepts/world.mjs:57`, `concepts/world.mjs:89`).

**Semantic levels.** Zoom changes what is drawn, not just how large it is. Bederson and Hollan's Pad++ paper, cited in `k-multi-plant-canvas.md`, separates semantic zoom from geometric scaling. Victor's ladder is the same idea with a way back down. Thresholds use projected screen size with hysteresis, so a small wheel move does not flicker.

- Org. The whole world fits. A plant is a footprint of a fixed minimum size, a name, and the three corner marks from section 3. No machine labels, no cargo, no agent bodies. An agent that is blocked on the engineer survives as a raised-hand dot in the plant's waiting corner, so the away state is readable with every plant in view.
- Site. A few plants fill the view. Footprints grow into silhouettes. Cross-plant routes draw as single lines with the dash pattern that already encodes kind (`concepts/world.mjs:833-836`), and no text label. Agent bodies appear as dots in their hue, on the silhouette, and only when the agent is blocked or holding a lease. Working agents do not appear yet.
- Plant. One plant fills the free rect. Catalog silhouettes, belts, territories, ghosts, and trails draw. Agent bodies draw at full pose. Machine names appear for the selected machine and for any machine with a pin, a clash, or a breach. Other names stay off until Alt.
- Machine. One machine fills the view. Ports, the gauge, the witness pins, and the bindings draw on the machine. Neighboring machines shrink to silhouettes and stay in place, so the geography does not jump.
- File. The cutaway, and only on an explicit key. It is the current cutaway, kept as a step rather than a zoom, because a file is not a place on the plane. Esc returns to the same machine at the same camera.

**Level of detail and label collision.** Offscreen plants draw as summaries and do not animate. `k-multi-plant-canvas.md` already caps detailed machines and forbids one render loop per plant. Labels enter only at plant level, and only for marks that change the next action. Collision is resolved by dropping the lower-priority label, not by lifting it. The priority order is pin, clash, breach, selection, name. `declutter` (`concepts/world.mjs:315-336`) does the opposite. It lifts. Lifting is what makes `shell-world-after.png` a stack of captions. A dropped label remains one key away on the thing it names.

**Agents while zoomed out.** A blocked agent is a raised-hand dot at org zoom and a body from site zoom down. A lease holder is a ringed dot at site zoom. A working agent appears only at plant zoom, because working is not a decision. This is the inversion of the current chips, which are readable only when the camera is close and say the least useful thing loudest.

**Navigation.** The keyboard is the primary path, because `k-multi-plant-canvas.md` cites desert fog as the failure of a view with nothing to navigate by. Ctrl K stays the jump, and it already searches plants, machines, contracts, and decisions (`concepts/world.mjs:526-541`). Enter moves the camera to the target with no flight. Back and forward stay Alt Left and Alt Right and restore the camera, the selection, and the open card. Home fits every plant. F fits the focused plant. Alt with a digit still jumps to a bookmarked plant. The minimap stays, and it changes job. Today `#worldMinimap` is a 160 by 90 picture of the same 1600 by 900 box (`concepts/world.mjs:462-471`). On an unbounded plane that picture is a lie. The minimap becomes a strip of placed plants in the rail slot, each a mark, with the viewport drawn over the ones in frame. It is a locator, not a second map. Clicking a mark jumps. It hides when a card covers the rail, which it already does.

**The island shell over the plane.** The islands stay fixed to the viewport, exactly as `SHELL.md` places them, and the plane pans underneath. The free rect is the camera's home region. Cards still open in the right slot, and a card about a machine draws its leader across the plane to that machine, asking the camera to bring the machine into the free rect first. The camera never moves because an agent event arrived. That rule is already in `CORE.md` and it matters more on an infinite plane than on a fixed board. Toasts stay in the free rect. The hint strip stays, and it shrinks to the focused target plus the one or two keys that act on it.

**What this overturns in the current code.** The viewBox, the fixed viewport size, the fit-to-five transform, and the snap wheel. Also the edge labels that `edges` (`concepts/world.mjs:224-244`) computes against a 1100 by 620 stage. On a plane, a neighbor is either in view or it is a mark at the viewport edge pointing toward its real coordinate. The edge buttons in `shell-world-after.png` are a workaround for the bounded board, and they go.

## 5. Three directions

These three do not share a layout. One puts the system in the picture and the words one key away. One keeps the words and makes them a drawing. One drops the picture as the primary surface and keeps the map as an overview the engineer summons. All three use the kit's white in light and the existing graphite in dark. All three put the plane under the island shell.

### Quiet instruments

The plant is the instrument, and it is quiet unless something needs the engineer. Type is Inter for the rare label and IBM Plex Mono for readings, which is the current pair. In light, the page is `#f2f2ef`, cards are `#fbfbfa` with a 1 px line and no shadow heavier than the kit's own lift, and machine faces are `#ffffff`. In dark, the page stays `#0b0b0b` and cards stay `#131313`, but the card stops being a document and becomes a strip of readings. Brass survives only as the witness pin and the clash pin. Every other use of brass goes. Chrome is the island shell at half its current opacity, and the hint strip is one line of two keys.

The top three moments land as trails meeting at a pin, a still body with a raised hand, and brighter marks on an otherwise dim plant after away. Nothing else moves. The infinite canvas is this direction's home. Zoom is the ladder in section 4, and the org view is a row of quiet footprints. The risk is that a new user cannot read the marks, which is the failure `TEXT.md` scored against the glyph HUD. The mitigation is the ten-second test in section 7, and a legend that is one held key, not a tour.

### Drawn ledger

The plant is paper, and the state is hand-drawn on it. Type is a single humanist face for labels and a mono for numbers, set large. In light the page is `#ffffff` rather than the kit's off-white, and ink is `#18181a` at full strength, with color used only for the three agent hues and the two pin colors. Cards are ruled lines, not panels. There is no glass and no blur. In dark the paper is `#0b0b0b` and the ink is `#e6e6e6`, and the same ruled lines hold. The look owes Mini Metro the rule that a shape carries the meaning, and it owes nothing to the factory renders.

The top three moments land as two inked lines meeting at a drawn pin, a small drawn figure standing beside a machine with a question mark that is a mark and not a word, and a margin of tick marks down the side of the plant showing what changed, one tick per change, in order. The infinite canvas is a sheet that extends, with plants as titled blocks the engineer can rearrange. Zoom steps between a sheet of blocks and one block, not continuously, because a ruled drawing at arbitrary scale stops reading. The risk is charm. A hand-drawn plant can become the aesthetic pitch `f-frontier.md` says is already taken, and it fights the isometric catalog, which would have to be redrawn as line art. It also fits the honesty rule least well, because a ruled sheet invites annotation that is not a binding.

### Summoned map

The resting surface is the queue and the focused machine, set like Linear. A narrow left column holds the waiting decisions. The center holds the selected machine's readings and the keys that act on it. The map is not on screen until the engineer holds a key, and then it draws over the center at full bleed, and it dismisses when the key is released. Type is Inter, sizes match Linear's density, and color is limited to one accent plus the alarm colors. In light, page `#ffffff`, column `#fbfbfa`, no borders heavier than a hairline. In dark, page `#0b0b0b`, column `#131313`. Cards are rows, not panels.

The top three moments land only while the map is summoned. Trails and the pin appear over the plant. The blocked agent is a row in the column at rest, and a body on the plant while summoned. The away state is a count in the column at rest, and the brighter marks on the plant while summoned. The infinite canvas exists only inside the summoned view, which makes it cheap to build and easy to ignore. The risk is that this is the chat UI with a picture attached. A developer who never holds the key never sees the value, so the switch does not happen. `00-synthesis.md` says the remaining distinction is one persistent system entity. A map that is hidden by default is not that entity.

### The bet

Quiet instruments. It is the only direction where the three selling moments are on screen at rest, the infinite canvas is the navigation rather than a mode, and the honesty rule survives as a held key instead of a caption. Drawn ledger is the one to learn from if the ten-second test fails, because its shapes are more legible and its type is larger. Summoned map is the fallback if the plant cannot be made readable at all, and taking it means accepting that the map is a tool the engineer opens, not the place they work.

## 6. Kvarm placement

Kvarm status leaves the compass, and it does not gain a panel. The compass is a camera control. `SHELL.md` section 2.1 puts it in the rail at 74 px, and mixing a connection state into a camera control is why the user is unsure about it. Connection is a property of the session, not of the view.

The resting mark is one lamp in the bottom-right island, beside the clock, in the slot the connection readout already occupies (`SHELL.md` section 2.2). The lamp has five states and no words. Lit means a selected origin, fresh, with no unmatched lease. Dimmed means stale. Broken means an unmatched lease exists. Out means offline. Hatched means the last write's outcome is unknown. The color is the alarm color only for broken and unknown. Everything else is neutral, so a healthy connection does not paint the corner green.

The lamp is a button. Click, or the existing Shift V, opens the network log in the right card slot, which is where `SHELL.md` section 4 already sends it. The log keeps the byte rows, the origin, the capabilities, and the lease. The egress pill in the top-right island stays, because bytes leaving the machine are a different fact from connection health, and `TEXT.md` requires the bytes at rest. The pill loses the word `kvarm` and keeps the total. The lamp and the pill read the same ledger, so they cannot disagree.

This removes the `#worldKvarm` pill that `SHELL.md` section 2.2 puts in the top-right island, and it removes the connection sentence from `.world-br` that makes that island 936 to 1151 px wide at 1600 (`SHELL.md` section 7). The compass goes back to being a compass.

## 7. Prototype plan

Three prototypes, one per direction, built on the same fixture and judged side by side. The fixture is the journey at beat 9, with the away window applied on top so the return state is visible, plus the `kv=unmatched` lease on Codex. Same five plants, same three agents, same two clashes, same witnesses, same ledger. No direction brings its own data.

Each prototype is shown at 1280 x 800 and 1440 x 900, in light and in dark, which is four shots per direction and twelve in all. Light uses the kit's white. Dark uses the kit's graphite. The island shell is present and in the same slots, so a difference in the shots is a difference in the direction and not in the chrome. Each prototype implements the plane far enough to pan, zoom continuously, and show org and plant levels. A still shot cannot show the zoom, so each prototype also records one five-second capture of a zoom from org to plant and back, at 1440 x 900, in light.

The task the judge runs, on each prototype, with no briefing other than the ten-second limit.

1. Point at the place where two agents' work collides.
2. Point at the agent that is waiting on you, and say how you can tell.
3. Say what changed while you were away, from the picture alone.

Then, with no time limit, the judge opens the legend and checks three honesty items. The unmatched lease is distinguishable from a matched one. The stale reading is distinguishable from a zero. The byte total is reachable in one key.

**Rubric.** Scored 0 to 4 on each line. Weights sum to 100.

| Line | Weight | What a 4 looks like |
|---|---|---|
| A chat-UI developer sees the value in 10 seconds | 25 | All three pointing tasks correct, on the first look, in both sizes and both appearances. |
| Words on screen | 15 | At plant zoom, at rest, under 40 words outside the islands. The legend is exempt because it is held. |
| Scan speed | 15 | The collision, the blocked agent, and the away marks are findable without reading a sentence. |
| Honesty | 15 | The three honesty checks pass, and every mark on screen names a binding in the legend. |
| Keyboard reach | 10 | Pan, zoom, jump, legend, and the network log are all reachable without a pointer. |
| Canvas | 10 | The plane pans past the five plants, zoom is continuous, and org zoom still shows the blocked agent. |
| Light and dark | 5 | Light is the kit's white with white faces. Dark is the kit's graphite. Neither appearance adds a second card color. |
| Weight | 5 | No panel heavier than a hairline. No card occludes a machine that has a pin. |

A direction that scores under 3 on the ten-second line is out, regardless of its total. That line is the switch.

## 8. What changes in the plan

**Quiet instruments, if it wins.**

- `JOURNEY.md` section 1 changes the world level from a canvas that swaps for a stage into one plane with semantic zoom. The sentence "the world level's canvas keeps its 1600 x 900 viewBox and fits the free rect" goes. Beats 2 and 15 change. Beat 2 no longer swaps canvases. Beat 15 draws the return brief on the plant first, and the card becomes the legend for those marks.
- `JOURNEY.md` section 3 keeps every key. The hint line stops listing keys and names the focused target plus the keys that act on it.
- `SHELL.md` section 2.2 loses the Kvarm pill and the connection sentence. Section 7's note about the wide bottom-right island is resolved by that cut. The minimap row in section 4 becomes the plant strip.
- `TEXT.md` gains a mark budget beside the word budget. A mark that has a legend one key away does not also need a label at rest. The honesty table stays, and its "visible at rest" column gains a second allowed form, which is a mark whose legend text is exactly the current cell. The glyph ban in the copy rules narrows. A glyph may carry a value when the legend names it and the ten-second test passes.

**Drawn ledger, if it wins.**

- `JOURNEY.md` section 1 changes more. The isometric stage stops being the plant. The catalog silhouettes in the ui-v1 stage are replaced by line drawings, which is a new art pass the journey build does not currently contain. Zoom becomes two steps, not a plane, so the infinite-canvas requirement is met by an extending sheet rather than by continuous scale.
- `SHELL.md` loses glass. The island tokens in section 1 stay, and the glass treatment in `build.mjs:45-56` goes. Cards become ruled lines, so the card-slot measurements in section 3 stay and the fill changes.
- `TEXT.md` loosens the island budget and tightens the plant budget, because this direction spends words as hand-lettered labels and has no captions anywhere else. The Alt rule stays.

**Summoned map, if it wins.**

- `JOURNEY.md` section 1 changes the most. The stage is no longer full-bleed. The resting surface is the queue and the focused machine, and the plant is a held-key overlay. This contradicts the one-shell decision in `PARKED.md`, which picked the full-bleed plant. Taking this direction means reopening that decision with the user before any build.
- `SHELL.md` gains a left column the current shell does not have. Section 2's persistent islands stay. The column is a new region, and the free rect shrinks by its width.
- `TEXT.md` applies as written to the resting surface, because the resting surface is mostly words. The plant overlay is exempt from the word budget and bound by the mark rules instead.

Across all three, `JOURNEY.md` section 4's row "World coordinates are 1600 x 900" is replaced by the plane in section 4 of this memo. `JOURNEY.md` section 6's `fitRect` note stays, and it becomes the camera's home region rather than the canvas size. The open-core and Kvarm rules in `PARKED.md` are untouched. No direction moves a team concept into the open build, and no direction lets a mark draw a fact the binding record does not have.
