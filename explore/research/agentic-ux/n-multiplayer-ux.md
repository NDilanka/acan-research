# Many people in one world

Date 2026-10-26. Paths are relative to `explore/`. Labels follow the other slices. A [sourced] claim has a link or a file and line. An [inferred] claim is a design conclusion drawn from sourced material. A [guess] is untested.

## Summary

1. [inferred] Share the record and keep the view private. Orders, witnesses, claims, declarations, settle decisions, holds and reviews are shared through the team's coordination origin. Camera, selection, mode, replay time, drafts and the review allowance stay on each person's machine.
2. [inferred] People show up as names on the system objects they own, never as cursors or bodies on the canvas. Your own things carry no name. Other people's things are named.
3. [inferred] Waiting on you stays one queue of your own decisions. One row under it, `Team · N waiting`, holds only what nobody owns, what is overdue while its owner is away, and what someone pointed at the team.
4. [inferred] When two people's agents collide, you may always yield your own agent's plan. You may only propose that someone else's agent yields. The plant owner may settle either way. Every settle names its author.
5. [inferred] Handoff borrows from air traffic control. The giver offers, the receiver reads the order card and accepts, and ownership changes only on accept.
6. [inferred] Solo Acan stays exactly as it is, with zero added words. Team marks appear only when another person works on the same plant's origin.
7. [inferred] Every team byte goes through the existing egress pill and network log, including presence. Presence is sent on focus changes only, so the byte count stays meaningful.
8. [guess] The whole team experience should work against a self-hosted team origin. The hosted tier would then sell operation, not features, which keeps the open-core line clean.

## Scope and evidence

- [sourced] Inputs from the repo are `ui-v2/PARKED.md`, `ui-v2/CORE.md`, `ui-v2/JOURNEY.md`, `ui-v2/TEXT.md`, `ui-v2/DECISIONS.md`, `research/agentic-ux/00-synthesis.md`, `01-synthesis-wave3.md`, `c-supervisory-control.md`, `e-attention.md`, `k-multi-plant-canvas.md`, `same-file/m3-agent-collisions.md`, parts of `h-kvarm.md` and `g-engineering-analogies.md`, and the shot `ui-v2/shots/orders-kv-unmatched.png`.
- [sourced] In that shot the islands are these. Top left holds the Acan mark, the plant switcher `Acquit ▾` and `Go to Ctrl K`. Top centre holds the four modes with the hint line under them. Top right holds `Layers`, `Export` and the egress pill `local + kvarm · 1,336 B out`, with the compass under it. Bottom left holds `Waiting on you 8`, four rows and `Floor timeline`. Bottom right holds zoom, `15 rps · p99 184 ms · 0.6% err`, `LIVE 08:37:22` and `still in 1:57`. The order card floats on the right, and bot chips such as `CODEX codex-paypal · authenticated · holds g1` sit on the plant.
- [sourced] FetchUrl opened discovered pages in this session, unlike earlier slices (`research/agentic-ux/00-synthesis.md:113`). Two pages failed. The EVE University wiki returned HTTP 530, and one Google support URL returned 404. Claims from those rest on search excerpts, which the Sources list marks.
- [inferred] Product documentation proves that an interaction exists, not that it helps. No source here measures how a team supervises agents together. Every recommendation is a hypothesis for the bakeoff.
- [sourced] Sibling slices own sync and hosting (`o-multiplayer-architecture.md`) and the Kvarm dependency (`p-kvarm-rewrite.md`). This file stays on UX and lists its questions in "Asks for architecture".

## What multiplayer must not break

| Constraint | Source |
|---|---|
| One shell of floating glass islands. No top bar, toolbar row or docked inspector. | [sourced] `ui-v2/PARKED.md:12` |
| There is already too much text. Budgets per surface, 150 words per screen, and the honesty rule override them. | [sourced] `ui-v2/PARKED.md:13`, `ui-v2/TEXT.md:9`, `ui-v2/TEXT.md:15-30` |
| The world is a canvas of systems, not agents, terminals or notes. | [sourced] `ui-v2/PARKED.md:22`, `research/agentic-ux/01-synthesis-wave3.md:11`, `:61-65` |
| Nothing moves under the user. Nothing moves the camera for the human. | [sourced] `ui-v2/CORE.md:32`, `research/agentic-ux/01-synthesis-wave3.md:19` |
| Motion and agent busyness are not progress. | [sourced] `research/agentic-ux/00-synthesis.md:9` |
| Kvarm owns coordination. There is no second coordinator and no manager agent. | [sourced] `research/agentic-ux/01-synthesis-wave3.md:7`, `:18`, `research/agentic-ux/00-synthesis.md:109` |
| The gate is advisory and blocks publication only. | [sourced] `ui-v2/PARKED.md:22`, `ui-v2/JOURNEY.md:5` |
| Every byte off the machine is declared egress, and the pill equals the network log. | [sourced] `ui-v2/CORE.md:5`, `ui-v2/DECISIONS.md:19`, `ui-v2/READINESS.md:10` |
| Open core. The desktop app and adapters are open. Any team or hosted part sits behind its own seam and is never required. | [sourced] `ui-v2/PARKED.md:21`, `research/agentic-ux/decisions.tsv:79` |
| Review capacity belongs to one person. | [sourced] `research/agentic-ux/k-multi-plant-canvas.md:176` |
| Shared presentation does not imply shared authority. | [sourced] `research/agentic-ux/k-multi-plant-canvas.md:110` |

## Five directions

### A. Shared live room

Everyone in the company world sees everyone's cursor, selection and viewport in real time, with an avatar stack, follow, and "bring everyone to me".

- [sourced] tldraw's default presence sends cursor position, selected shapes and viewport bounds, and its demo rooms are "publicly accessible by ID" ([tldraw collaboration](https://tldraw.dev/sdk-features/collaboration)).
- [sourced] Miro's "Bring everyone to me" auto-follows all participants until each one moves, zooms or clicks ([Miro attention management](https://help.miro.com/hc/en-us/articles/360013358479-Attention-management)).
- [sourced] Figma users ask to disable observation, calling it "the digital version of someone looking over your shoulder" ([Figma forum](https://forum.figma.com/suggest-a-feature-11/disable-observe-mode-18772)).
- [inferred] Moving cursors are motion that is not progress, and "bring everyone to me" moves the camera for the human. Both break rules above.
- [inferred] A live room needs an always-on relay, so the solo app either looks broken or gains a mode switch. That pulls the team seam into the open app.

### B. Shared record, private view

The durable objects of the loop are shared. Each person keeps their own camera and working state. Presence is a small layer on top. It shows who focuses on which plant, who is acting on which machine, and who is away.

- [sourced] Linear assigns each issue to one person. An agent can be delegated the issue while "the assigned teammate maintains ownership", and delegated issues stay in the person's My Issues ([Linear assigning issues](https://linear.app/docs/assigning-issues)).
- [sourced] Screeps runs one persistent world where units act without the player, and "it is quite enough just to check once in a while" ([Screeps introduction](https://docs.screeps.com/introduction.html)).
- [sourced] Kvarm already gives humans ownership of agent principals (`research/agentic-ux/h-kvarm.md:193`) and excludes the recorded author from approval counts (`research/agentic-ux/h-kvarm.md:151`).
- [inferred] This is the Kvarm connection the solo app already makes, with more principals on the same origin. The shell keeps its islands.

### C. My world plus subscriptions

Each person keeps a private world and subscribes to teammates' plants or orders, which arrive as references.

- [sourced] Anno 1800 links separate sessions through goods transfer and designs for players who prefer a home session (`research/agentic-ux/k-multi-plant-canvas.md:91`).
- [sourced] Air traffic handoffs relay a target's position "relative to a fix, map symbol, or radar target known and displayed by both" controllers ([FAA JO 7110.65, 5-4](https://www.faa.gov/air_traffic/publications/atpubs/atc_html/chap5_section_4.html)).
- [inferred] If every person places sites differently, "the breaker on Acquit, top left" means nothing to a teammate. A shared layout is the common map that handoff and point-out need.
- [inferred] Subscribing is an extra concept to teach, and the first question a newcomer asks ("whose world is this?") has no clean answer.

### D. Control room with sectors

The company world is a wall display with sector owners per plant, formal roles and a shared alarm list, like a control room or an incident channel.

- [sourced] incident.io says every incident needs one lead, that roles should be few, and that handovers must keep new joiners up to date on who leads ([incident.io roles](https://incident.io/guide/foundations/roles)).
- [sourced] PagerDuty escalates until someone acknowledges, and acknowledging does not resolve ([PagerDuty escalation policies](https://support.pagerduty.com/main/docs/escalation-policies)).
- [sourced] EVE fleets broadcast to everyone or only to superiors, and fleet members watch the broadcast list for commands (EVE University fleet interface, search excerpt).
- [sourced] An ecological air traffic display improved fault detection but prompted takeovers unrelated to faults (`research/agentic-ux/c-supervisory-control.md:34`).
- [inferred] Roles and a shared alarm wall suit an incident, not a normal day. Everyone seeing every alarm multiplies attention cost by team size.

### E. Pair on demand

Acan stays solo. A person invites a teammate into a temporary session to follow their view, like a pairing call.

- [sourced] Zed channels share a project read-only to guests, joining starts by following the inviter, and following is a click on an avatar ([Zed channels](https://zed.dev/docs/collaboration/channels)).
- [sourced] Live Share invitation links are valid for one session, and its service sees no session content ([Live Share security](https://learn.microsoft.com/en-us/visualstudio/liveshare/reference/security)).
- [sourced] Tuple is built around shared control and quick driver switching ([Tower on Tuple](https://www.git-tower.com/blog/tuple-guide-to-remote-collaboration)).
- [inferred] It does not give a persistent company world or shared monitoring, so it misses two of the user's three verbs. It is a good add-on, not a model.

## Scores and the pick

Each axis is scored 1 to 5 by judgment [inferred]. The reasons are in the direction sections above. "Goal" checks the user's three verbs: land in the same world, run agents in parallel, and monitor together.

| Direction | Newcomer clarity | Attention cost (5 is low) | Honesty | One-shell fit | Open-core fit | Total | Goal |
|---|---|---|---|---|---|---|---|
| A. Shared live room | 4 | 1 | 2 | 2 | 2 | 11 | yes |
| **B. Shared record, private view** | 4 | 4 | 5 | 5 | 5 | **23** | yes |
| C. My world plus subscriptions | 2 | 4 | 4 | 3 | 5 | 18 | partly |
| D. Control room with sectors | 3 | 2 | 4 | 2 | 3 | 14 | yes |
| E. Pair on demand | 4 | 3 | 4 | 4 | 4 | 19 | no |

**Pick B, with one piece from each runner-up.** [inferred] B is the only direction that scores 4 or more on every axis and meets the goal. It also adds the least new UI, because the loop's objects already live in Kvarm or in git. From E it takes follow, on request and announced. From D it takes the handoff protocol and the one-decision-holder rule. From C it takes the idea that coordination follows the plant's origin, so a personal world can still hold a team plant.

**What would change the pick.** [guess] If a bakeoff shows teammates miss each other's work without live cursors, add plant-level live focus before considering A. If the team origin cannot carry presence within about 30 s, presence shrinks to away status only.

## The model in one table

[inferred] Each item has one home. Shared items go through the team origin as declared writes. Private items never leave the machine. Never-shared items have no path off the machine through Acan.

| Shared with the world by default | Private to you by default | Never shared by Acan |
|---|---|---|
| World layout and site positions | Camera, selection, level, mode | Agent transcripts and message content |
| Plant list and each plant's repo origin | Replay time and Simulate scenarios | Tokens and credentials |
| Posted orders, their witnesses as definitions, readback one-liners | Draft pins and `POSTED LOCALLY` orders | Uncommitted file contents |
| Claims and leases, declarations and forecasts | Departure notes ("leave a thought") | View history and dwell time |
| Settle decisions and proposals, with author | Your review allowance and its numbers | Activity timers and agent-utilization per person |
| Holds advised, reviews and approvals | Network log and Alt provenance views | Cursor and keystrokes |
| Your focus plant, acting presence, away until | Bench drafts before Fund | Local runtime traces, unless you publish one |

- [sourced] Agent message content export is off by default, and Droid runs with content-free GenAI telemetry (`ui-v2/DECISIONS.md:12`, `research/agentic-ux/01-synthesis-wave3.md:157`).
- [sourced] Google Docs lets each person hide their view history from the Activity dashboard, and views made while hidden "will never show" ([Google Docs activity](https://support.google.com/docs/answer/7378739?hl=en&co=GENIE.Platform%3DDesktop)). [inferred] Acan goes further and keeps no view history at all.
- [sourced] Figma drafts are private to their author until shared ([Figma drafts](https://help.figma.com/hc/en-us/articles/18409526530967-Updates-to-how-drafts-work)). [inferred] Acan's local drafts and `POSTED LOCALLY` state already match that.
- [inferred] The review allowance stays private because a team-visible review budget becomes a performance score, which `research/agentic-ux/k-multi-plant-canvas.md:253` warns against for agent rankings.

## 1. Presence

### Precedent

- [sourced] Figma follow is a click on an avatar. The followed person is not told, though the follower's cursor stays visible. Spotlight asks everyone to follow and gives a few seconds to click "Not now" ([Figma spotlight](https://help.figma.com/hc/en-us/articles/360040322673-Present-to-collaborators-using-spotlight)).
- [sourced] Miro does tell the followed person, with a note on their avatar. Following stops on any click, cursor move or zoom ([Miro attention management](https://help.miro.com/hc/en-us/articles/360013358479-Attention-management)).
- [sourced] tldraw lets an app remove the viewport from presence to disable follow, or return null to hide a user entirely ([tldraw collaboration](https://tldraw.dev/sdk-features/collaboration)).
- [sourced] A Figma user reports turning off all multiplayer cursors as a personal preference, and asking viewers to explain why they are peeking ([Threads post](https://www.threads.com/@bfigas/post/C52mINOM25B), search excerpt).
- [sourced] StarCraft II pings put a signal on an ally's minimap with Alt and a click, without moving the ally's view ([Blizzard team strategies](https://news.blizzard.com/en-us/article/4552959/game-guide-team-strategies)).
- [sourced] Air traffic control separates a point out, which transfers identification without communications, from a handoff, which transfers control ([FAA JO 7110.65, 5-4-1](https://www.faa.gov/air_traffic/publications/atpubs/atc_html/chap5_section_4.html)).
- [sourced] Semantic presence should describe anticipated work, not cursor location (`research/agentic-ux/g-engineering-analogies.md:161-166`).

### Recommendation

[inferred] Presence has four states per person, and none of them is a cursor.

| State | What teammates see | Where |
|---|---|---|
| Here | The plant you focus. Not your camera or machine. | `2 here` in the top-left island, names on hover or Alt |
| Acting | You have a card open that writes on a machine, such as Settle, Answer or Review. | A pill on that machine, `Sam · settling` |
| Away until | You stepped away with Shift U. | Your name in the team row reads `Dana away · 17:30` |
| Offline | Your connection is down or you pressed the offline switch. | Your owned rows read `Dana offline · 3 held` |

- [inferred] Show viewing at plant grain and acting at machine grain. Viewing is mostly curiosity, so a coarse mark is enough and keeps the canvas quiet. Acting is coordination, because two people settling c1 at once is a real race.
- [inferred] Follow is on request. Start it with Ctrl K `Follow Dana` or a click on a name in the `2 here` list. The follower's camera follows Dana's focus plant, machine and open card, read-only. Any key or click stops it, as in Miro.
- [inferred] Tell the followed person. Dana's top-left island reads `1 following`. Silent watching is the complaint in the Figma forum, and a work tool that hides observation erodes trust.
- [inferred] Replace "look here" with Point out. Point out on a machine or a queue row sends one row to a teammate's Waiting on you, `Dana points out · breaker`. Nothing moves their camera. They open it when they choose, which keeps `ui-v2/CORE.md:32`.
- [inferred] Do not ship "bring everyone to me", cursor chat, an avatar stack, or idle and active timers. Each one either moves someone's view or turns presence into monitoring of people.
- [inferred] A person can hide the Here state. Acting, away and offline cannot be hidden, because teammates need them to avoid races and to know who can decide.

## 2. Ownership and attention

### Precedent

- [sourced] Linear keeps a human assignee responsible while an agent works the issue, and lets views filter by delegate ([Linear assigning issues](https://linear.app/docs/assigning-issues), [Linear agents](https://linear.app/docs/agents-in-linear)).
- [sourced] GitHub does not count your approval of a Copilot pull request you asked for. "Another reviewer must approve" ([GitHub, review Copilot output](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output), search excerpt).
- [sourced] Kvarm humans own agent principals and mint their tokens (`research/agentic-ux/h-kvarm.md:193-195`). The journey's review #184 uses the rule `Required reviewer is not the author` (`ui-v2/JOURNEY.md:124`).
- [sourced] A receiving controller checks the target and may issue restrictions before accepting a handoff ([FAA JO 7110.65, 5-4-6](https://www.faa.gov/air_traffic/publications/atpubs/atc_html/chap5_section_4.html)).
- [sourced] Handover is preparation, transfer and checking, and I-PASS includes receiver synthesis (`research/agentic-ux/e-attention.md:40`). Acknowledging is not approving (`research/agentic-ux/e-attention.md:242-244`).
- [sourced] StarCraft II shared control lets allies command your units but not spend your money or build with your workers ([Blizzard team strategies](https://news.blizzard.com/en-us/article/4552959/game-guide-team-strategies)).
- [sourced] Adaptable automation that the human assigns is favoured over adaptive automation that the system assigns (`research/agentic-ux/c-supervisory-control.md:29`).

### Owners

[inferred] Three kinds of owner exist, and each has one person.

- **Order owner.** The person who posted it. They answer readback questions and decide holds on it.
- **Agent owner.** The person who minted the agent's principal. They get the agent's own problems, such as a credential, an agent stuck at its prompt, or Codex being passive.
- **Plant owner.** Named per plant, like CODEOWNERS ([GitHub code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)). They break ties on that plant and own unowned conditions such as `paypal over budget`.

### How the world shows whose agents do what

- [inferred] An owner is a word on the object that already exists, never an avatar or a per-person colour. Footprints already use a colour per agent (`ui-v2/CORE.md:58`), so a colour per person would double the code.
- [inferred] Your own objects carry no name. Others carry the owner's first name. The bot chip becomes `CODEX · Dana · authenticated · holds g1`, five words under the pill budget of 6 (`ui-v2/TEXT.md:17`). The session name `codex-paypal` moves behind Alt, which `ui-v2/TEXT.md:70` already asks for.
- [inferred] The order card header adds the owner only when it is not you, for example `PAYPAL-PAYOUTS · R2 · DANA`.
- [inferred] Layers gains one filter, `Agents · mine · all`. With many people on one plant, `mine` dims other people's bot chips and footprints to outlines. It changes nothing for teammates.
- [guess] When more than four other people's agents sit on one territory, collapse them into one chip, `3 agents · Dana, Sam`, with the list on hover. The limit needs a test.

### Waiting on you, split

[inferred] Waiting on you keeps its meaning. It holds decisions where you are the decision-holder. A row is yours when one of these is true.

- You own the order, the agent, or the plant the row is about.
- Someone handed it to you and you accepted, or pointed it out to you.
- It is a review where you are an eligible reviewer, which means you do not own the authoring agent.
- It is a cross-person clash or proposal that needs you.

[inferred] Under your rows, one more row reads `Team · 4 waiting`. Enter expands it in place. It holds only three kinds of item.

- Rows with no owner, such as a condition on a plant without a plant owner.
- Rows whose latest safe response has passed while the owner is away or offline, `Dana away · overdue 6m`.
- Rows someone pointed out to the team instead of a person.

[inferred] The team row is not everyone's queue. Showing every teammate's queue would multiply attention by team size and become a view of people, which D shows and `research/agentic-ux/00-synthesis.md:106` argues against with one symptom, one decision.

### Take, hand off and escalate

- [inferred] **Take** moves a team row to you. The row leaves the team row for everyone, and the Floor timeline logs `Sam took · breaker`. It follows the incident lead idea, where one named person holds the decision.
- [inferred] **Hand to** offers an order, a hold or a row to a named person. Until they accept, ownership stays with the giver, and the row reads `HANDOFF → Sam · pending`. The receiver opens the order card as the handover brief, with its witnesses, checks, claim and open questions. Accept makes it theirs. Accept with hold lets them add a restriction first, as a controller may.
- [inferred] A handoff moves decisions, not agents. The agent keeps running under its owner's token, because Kvarm ties the token to the person who minted it (`research/agentic-ux/h-kvarm.md:193`). The receiver may release the lease and let their own agents read back instead.
- [inferred] Escalation is not automatic by default. When the latest safe response passes and the owner is away or offline, the row appears in the team row. Nobody is paged. This keeps the calm, quiet world of `research/agentic-ux/e-attention.md:6`.
- [inferred] Step away (Shift U) gains one choice in a team world, `Team may take overdue · yes`. With yes, a teammate's Take is immediate. With no, Take becomes a handoff that waits for you. This is a play the human sets, not the system adapting on its own.
- [guess] A plant owner may later opt a production plant into a PagerDuty-style policy. It is out of scope for v0.1.

### Reviews belong to the team

[inferred] Kvarm's author exclusion makes solo approval awkward (`research/agentic-ux/h-kvarm.md:151-152`). In a team it is the natural flow. `Review #184 · blocks publication` lands in an eligible teammate's queue, and the author's own row reads `#184 · waits on team`. The approve toast reads `Approved #184 as Sam.`, which names the person as the journey already does (`ui-v2/JOURNEY.md:55`).

### Who may claim

[sourced] Agents claim open orders on their own after a readback match (`ui-v2/CORE.md:14`). [inferred] In a shared world, that would let Dana's agent spend Dana's tokens on Sam's order without Dana knowing. StarCraft's rule fits here. Allies may command your units, but they may not spend your money.

- [inferred] An order has an audience. `mine` is the default, and only the poster's agents read back. `team` lets any agent whose owner opted it into team orders read back. The plate flag reads `OPEN · team` only for team orders.
- [inferred] The claim rule does not change. A matching readback plus a live Kvarm lease of the same generation is still the claim (`research/agentic-ux/01-synthesis-wave3.md:8`).

## 3. Collisions between people

### Precedent

- [sourced] Kvarm forecasts are non-exclusive and claims are generation-fenced (`research/agentic-ux/h-kvarm.md:209`). [sourced] Semantic overlap stays advisory (`research/agentic-ux/h-kvarm.md:211`).
- [sourced] Figma viewers cannot merge a branch and must request review from an editor ([Figma branching](https://www.figma.com/best-practices/branching-in-figma/)).
- [sourced] GitHub can require code-owner approval before merge ([GitHub code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)).
- [sourced] Cross-plant changes need explicit scope and approval for each affected owner (`research/agentic-ux/k-multi-plant-canvas.md:160`).
- [sourced] Shared locks cut Cursor's twenty agents to the throughput of two or three (`research/agentic-ux/same-file/m3-agent-collisions.md:86`). [inferred] Approval chains across people could do the same to humans, so the rule must let most settles happen alone.

### The rule

[inferred] Classify every Settle option by whose declaration it narrows.

| The option narrows | Who may take it | What happens |
|---|---|---|
| Only your agent's plan | You, alone | Settles at once, as today. |
| Only the other person's agent's plan | The other person | From you, it becomes a proposal in their queue, `PROPOSED · Sam · retry wins · c1`. |
| Both plans, such as Split at the port | Both, or the plant owner | It settles when the second person accepts. |
| Anything on a plant you own | You, as plant owner | Settles at once and names you on both sides. |

- [inferred] This means you may always yield and only propose that others yield. Most real settles become one-person moves, because the common fix is narrowing your own plan.
- [inferred] The clash card shows the owner on each side, and the option row replaces the key cap with `needs Sam` when you cannot take it alone. `Retry wins · needs Sam` is four words under the choice budget of 12 (`ui-v2/TEXT.md:19`).
- [inferred] While a proposal waits, the clash pin stays open with `proposed · waits on Sam`. Agents keep working, as with every advisory state.
- [inferred] If two people settle the same clash at once, the first recorded decision wins. The second person's card shows `Sam settled · split` and offers their choice as a superseding proposal. Ctrl Z already logs a superseding decision instead of deleting (`ui-v2/CORE.md:90`).

### Other cross-person collisions

- [inferred] **Claim race on one order.** No change. Kvarm rejects the second claim, and the losing agent shows `yields`, now with its owner's name when it is not yours.
- [inferred] **Two orders on one territory.** Before Post, the order card adds one row, `overlaps Dana's order · paypal-payouts`. It does not block Post. It lets you read Dana's order first, which is cheaper than a clash later.
- [inferred] **A hold on someone else's work.** The gate stays advisory. Sam's row reads `hold advised · Dana`. Lifting someone else's hold is allowed, is logged with the name, and sends one row to Dana.
- [inferred] **Moving sites.** World layout belongs to the world owner, as layout belongs to the architect in K5 (`research/agentic-ux/k-multi-plant-canvas.md:122`). Others see the move only on their next focus change, so nothing slides under them.

### Permissions as visible state

- [inferred] Show a permission only where it stops an action, as the words that replace the key, such as `needs Sam`, `view only` or `plant owner decides`.
- [inferred] When your Kvarm role on the focused plant is read-only, the top-left island adds `view only`. The inspector card lists your role under Alt, as `research/agentic-ux/k-multi-plant-canvas.md:185` asks the inspector to say whether an object is editable.
- [inferred] Never colour a permission, and never add a permissions panel to the canvas.

## 4. Monitoring

### Precedent

- [sourced] Information radiators put team state where anyone can read it at a glance, and Acan inverts that by radiating many workers to one decision-maker (`research/agentic-ux/e-attention.md:94-95`).
- [sourced] Grafana scopes dashboards by organization roles and folder permissions ([Grafana roles](https://grafana.com/docs/grafana/latest/administration/roles-and-permissions/)).
- [sourced] Local-first software treats the local copy as primary and the server as secondary ([Ink & Switch, local-first](https://www.inkandswitch.com/essay/local-first/)).

### Recommendation

- [inferred] Monitoring together means everyone sees the same state for shared sources. It does not mean Acan relays one person's telemetry to everyone.
- [inferred] Runtime evidence is shared when its source is shared. A staging or production collector is read by each person's Acan directly, with its own declared egress. A process running on Dana's laptop is Dana's local evidence.
- [inferred] A teammate whose Acan cannot see a source sees that layer as unknown, with Alt provenance `observed on Dana's machine only`. This uses the unknown state that already exists (`ui-v2/CORE.md:95`) instead of a new one.
- [inferred] A witness pinned from local replay is shared as its definition, which is the assertion, the trace reference and the time. The trace body stays local until its owner publishes it, and publishing is a declared write with bytes.
- [inferred] Site conditions at world level are the same for everyone, because they come from shared sources and the shared record. The bottom-right readout keeps naming its source and freshness.
- [inferred] No wall mode in v0.1. A shared screen on a TV is one person's Acan in follow mode, which already works.
- [guess] An incident view can come later as a filter of the same world, not a second layout.

## 5. Island placement and text budget

[inferred] Every multiplayer element lives in an island that exists today. None needs a new island, and none adds words in a solo world.

| Element | Island | Words at rest, solo | Words at rest, team | Notes |
|---|---|---|---|---|
| World name in the breadcrumb | Top left | 0 (`My world` unchanged) | 0 to 1 | `Northwind / Acquit` |
| World switcher with Share and Join | Top left, the existing `▾` menu | 0 | 0 | Menu rows, not at rest |
| `2 here` presence | Top left, after the plant name | 0 | 2 | Shown only with another person on the plant |
| `1 following`, or `following Dana · Esc` | Top left | 0 | 2 to 3 | Replaces `2 here` while active |
| `view only` | Top left | 0 | 2 | Only when your role is read |
| Hint for a focused blocked option | Top centre hint line | 0 | 0 to 2 | `needs Sam` inside the existing hint |
| Egress pill `local + team · N B out` | Top right | 0 | 0 | Replaces `kvarm` with the origin's short name |
| `Agents · mine · all` filter | Top right, Layers menu | 0 | 0 | Menu row, not at rest |
| Your rows | Bottom left, Waiting on you | 0 | 0 | Unchanged |
| `Team · 4 waiting` | Bottom left, one row above Floor timeline | 0 | 3 | Hidden when the count is 0 |
| Owner name on others' bot chips and plates | Plant | 0 | 1 per chip | Your own carry none |
| `Sam · settling` acting pill | Plant, at the machine | 0 | 2 | Only while their card is open |
| Owner in card header and on clash sides | Floating card | 0 | 1 to 2 | Only when not you |
| `needs Sam` on option rows | Floating card | 0 | 2 per row | Replaces the key cap |
| Handoff and proposal rows | Bottom left queue, then the card | 0 | row budget 8 | `HANDOFF → Sam · pending` |
| Teammate events that affect you | Toast | 0 | toast budget 8 | `Sam settled c1. Your plan narrowed.` |
| All other teammate events | Floor timeline | 0 | 0 at rest | History, not alarms |
| Team bytes, `Seen by team` list | Network log, behind the pill | 0 | 0 at rest | Reveal mode, exempt from budgets |

- [inferred] A busy team screen adds about 10 to 14 words, on a budget of 150 (`ui-v2/TEXT.md:30`). The `orders` screens measured 89 to 136 words after the text pass (`ui-v2/TEXT.md:103-120`), so the worst case stays under budget. [guess] The real count needs the audit on a team fixture.
- [inferred] No new keys. Follow, Point out, Hand to, Take and Share are Ctrl K verbs and card actions. The team row is reached with the arrows in the open queue. CORE's free keys stay free (`ui-v2/CORE.md:27`).
- [inferred] Honesty rule additions are the owner on a claim held by another person's agent, `needs <name>` on a blocked option, and `HANDOFF → <name> · pending`. Each changes what the user does next, so none goes behind Alt (`ui-v2/TEXT.md:9`).

## 6. Solo stays first-class

- [inferred] With zero teammates Acan looks exactly like the shot. It shows no avatar slot, no `0 here`, no empty team row and no invite prompt. The word "team" appears only in the world menu and in Ctrl K.
- [inferred] Team marks are triggered by data, not by a mode. They appear when a plant's origin holds another human principal. A solo user connected to their own Kvarm sees nothing new.
- [inferred] Coordination follows the plant's origin, not the world. A personal world can hold a company plant, and that plant then shows team marks even in `My world`. A team world is a shared layout of the company's plants. One plant has one coordinator in any world, which keeps `research/agentic-ux/01-synthesis-wave3.md:18`.

**Create a shared world.** [inferred] The world menu row `Share this world…` opens one card.

1. Pick the team origin. It is a coordination origin the company runs, or the hosted tier. The card names the origin before any request, as Kvarm connection does (`research/agentic-ux/h-kvarm.md:176`).
2. Read what will be sent, with an estimate in bytes. That covers the layout, the plant list with repo URLs, open orders with witness definitions, and your presence.
3. Read what stays local. That covers camera, drafts, departure notes, local traces, transcripts and your review allowance.
4. Press Enter to share. The egress pill changes to `local + team`, and the first writes appear in the network log.

**Join a world.** [inferred] A link or Ctrl K `Join a world…` opens the same card from the other side. It shows the origin, the world owner, the people in it, and what you will send. Joining adds the world to the menu and does not merge it into `My world`.

**Leave.** [inferred] `Leave world` removes your presence and stops team writes. Your local copy of the record stays readable, marked stale, which follows local-first ownership (Ink & Switch).

## 7. Honesty and consent

### Precedent

- [sourced] The egress pill opens the network log, whose empty state says "Nothing has left this machine" (`ui-v2/DECISIONS.md:19`). Share-safe export previews redaction on the plant before saving (`ui-v2/DECISIONS.md:16-18`).
- [sourced] Kvarm egress must be shown even when the destination belongs to the user, and the log covers API calls, git traffic, sockets, redirects and retries without tokens or bodies (`research/agentic-ux/h-kvarm.md:177-178`).
- [sourced] Excalidraw sends nothing by default and encrypts shared scenes with a key the server never sees ([Excalidraw end-to-end encryption](https://plus.excalidraw.com/blog/end-to-end-encryption)).
- [sourced] Live Share's service handles only authentication and session discovery, and content flows end-to-end encrypted between peers ([Live Share security](https://learn.microsoft.com/en-us/visualstudio/liveshare/reference/security)).

### Recommendation

- [inferred] Consent is given once per world on the Share or Join card, with categories named. A new category, such as publishing a local trace, asks once at first use with its byte size.
- [inferred] The pill counts every byte this machine sends to the team origin, including presence. The network log groups small repeated writes, such as `presence · 14 updates · 2.1 KB`, so the log stays readable.
- [inferred] Presence is sent on focus change, on opening or closing a write card, on step away and on return. Nothing is sent on cursor movement or on a timer, apart from the lease heartbeats that already exist.
- [inferred] The network log gets a `Seen by team` section. It lists what teammates can see about you now, which is your focus plant, acting state, away status, your posted orders and your agents' claims. This answers "what do they see of me" without a settings page.
- [inferred] Inbound team data is labelled by source. A witness from Dana reads `pinned by Dana` under Alt, so a teammate's evidence never looks like your own.
- [inferred] The offline switch works in a team world exactly as it does with Kvarm today. Writes are held and counted (`ui-v2/CORE.md:84`), and teammates see `Dana offline · 3 held` on your rows instead of silence.
- [guess] The hosted tier should offer end-to-end encryption of the shared record, as Excalidraw and Live Share do. Whether Kvarm's checks can run on encrypted data is an architecture question.

## Team beats for the journey

[inferred] A short team pass for a later JOURNEY revision. It uses the same fixture with a second person, Sam.

1. **Land.** The world menu shows `Northwind`. The top-left island reads `Northwind / Acquit · 2 here`. The pill reads `local + team`.
2. **Yield across people.** Sam's Claude Code wins the lease on a team order. Your Droid shows `yields · Sam's lease`.
3. **Clash across people.** c1 forms between your breaker and Sam's retry. You pick Breaker wins. The card shows `needs Sam`, and Sam's queue gets `PROPOSED · you · breaker wins · c1`.
4. **Acting presence.** Sam opens c1. The pin shows `Sam · settling`. Sam accepts, and your toast reads `Sam settled c1. Breaker wins.`
5. **Hand off before leaving.** You hand order r3 to Sam and step away with `Team may take overdue · yes`.
6. **Review by a teammate.** #184 lands in Sam's queue. Your row reads `#184 · waits on team`.
7. **Return.** The brief lists `Sam accepted r3`, `Sam approved #184`, and one overdue row Sam took.

## What to avoid

- [inferred] Avoid cursors, avatar stacks and per-person colours on the plant. They make people the subject, as agent bodies would (`research/agentic-ux/01-synthesis-wave3.md:62`).
- [inferred] Avoid any feature that moves another person's camera, including "bring everyone to me" and auto-follow on join.
- [inferred] Avoid views that rank people or agents by activity, review speed or idle time (`research/agentic-ux/k-multi-plant-canvas.md:253`).
- [inferred] Avoid sending everyone the same alarm. One condition has one decision-holder, and the team row is the fallback.
- [inferred] Avoid automatic reassignment. Ownership moves only by Take, Hand to plus Accept, or a play the owner set.
- [inferred] Avoid team chat inside Acan. Free-form shared notes bypass typed choices (`research/agentic-ux/01-synthesis-wave3.md:63`), and Point out covers "look at this".
- [inferred] Avoid making the open app show a disabled team surface or an upgrade prompt. A user who never joins a world never sees the seam.

## Asks for architecture

For `o-multiplayer-architecture.md` unless marked. Each question decides a UX choice above.

1. Can the full team UX in this file run against a self-hosted team origin alone, with no Acan-run service? If not, which items need one?
2. Where do the items that Kvarm does not store live? These are world layout, presence, readback one-liners (`ui-v2/CORE.md:79` says Kvarm stores none), away status, handoffs, proposals and the `Seen by team` list.
3. What presence latency is possible with outbound polling only? Kvarm webhooks need public HTTPS (`research/agentic-ux/h-kvarm.md:168-170`). Acting presence needs about 5 s to prevent most settle races. Here and away can tolerate about 30 s. [guess]
4. How does presence fit the per-token budget of 480 reads and 90 writes per minute (`research/agentic-ux/01-synthesis-wave3.md:153`), with ten people on one origin?
5. Can an order's owner change without changing the lease or the agent's token? Can a lease be released by its holder's owner and reclaimed by another person's agent with no lost work?
6. Does Kvarm's author exclusion use the agent's owner? Confirm that Sam's approval counts on a change by Dana's agent and that Dana's does not (`research/agentic-ux/h-kvarm.md:151`).
7. Can a settle decision exist as `proposed · waits on Sam` and become settled on the second person's accept, with both authors recorded? Who wins two concurrent settles?
8. Where is plant ownership stored, who may edit it, and is it per plant or per repo?
9. Where is the world owner stored, and how are site moves ordered between people?
10. Can every team write be listed in the session ledger with destination, bytes and reason, including presence and retries, so the pill still equals the log?
11. Can the hosted tier encrypt the shared record end to end? Which Kvarm checks would stop working?
12. What does a teammate see when I am offline with held writes, and in what order do my held writes land after reconnect when a teammate changed the same order?
13. For `p-kvarm-rewrite.md`. Which of asks 2, 5, 6, 7 and 10 does the Kvarm rewrite change? Answer in the private notes, not in a committed file, if the answer depends on unannounced features.

## Open product calls for the user

1. **Tell the followed person?** [inferred] Recommended yes, as Miro does, rather than Figma's silent follow.
2. **May teammates take your overdue items while you are away?** [inferred] Recommended yes by default, only after the latest safe response passes, with a per-step-away switch.
3. **Who settles a clash between two people's agents?** [inferred] Recommended. You may yield alone, you propose for others, and the plant owner may decide either way.
4. **May a person hide the Here state?** [inferred] Recommended yes for viewing, and never for acting, away or offline.
5. **Does a handoff move the agent, or only the decisions?** [inferred] Recommended decisions only. The agent keeps running on its owner's token.
6. **Who may approve another person's agent's work?** [inferred] Recommended anyone who does not own the authoring agent, including the order's poster. GitHub is stricter and also excludes the person who asked ([GitHub, review Copilot output](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output)).
7. **Do agents claim other people's orders?** [inferred] Recommended only for orders posted with audience `team`, and only by agents whose owner opted them in.
8. **May a personal world hold company plants?** [inferred] Recommended yes, because coordination follows the plant's origin.
9. **Is telemetry relayed between people?** [inferred] Recommended no. Each person reads shared environments directly, and local runtime stays local.
10. **Where is the open-core line?** [guess] Recommended. Every feature in this file works with a self-hosted team origin, and the hosted tier sells running that origin, its uptime and optional end-to-end encryption.

## Sources

Opened with FetchUrl this session unless marked as a search excerpt.

- Figma, spotlight and follow. https://help.figma.com/hc/en-us/articles/360040322673-Present-to-collaborators-using-spotlight
- Figma forum, disable observe mode. https://forum.figma.com/suggest-a-feature-11/disable-observe-mode-18772 (search excerpt)
- Threads post on hiding Figma cursors. https://www.threads.com/@bfigas/post/C52mINOM25B (search excerpt)
- Figma, drafts. https://help.figma.com/hc/en-us/articles/18409526530967-Updates-to-how-drafts-work (search excerpt)
- Figma, branching best practices. https://www.figma.com/best-practices/branching-in-figma/ (search excerpt)
- Miro, attention management. https://help.miro.com/hc/en-us/articles/360013358479-Attention-management
- tldraw, collaboration. https://tldraw.dev/sdk-features/collaboration
- Zed, channels. https://zed.dev/docs/collaboration/channels
- Visual Studio Live Share, security. https://learn.microsoft.com/en-us/visualstudio/liveshare/reference/security
- Tower blog on Tuple. https://www.git-tower.com/blog/tuple-guide-to-remote-collaboration (search excerpt)
- Google Docs, Activity dashboard. https://support.google.com/docs/answer/7378739?hl=en&co=GENIE.Platform%3DDesktop
- Linear, assigning and delegating issues. https://linear.app/docs/assigning-issues
- Linear, agents. https://linear.app/docs/agents-in-linear
- GitHub, review output from Copilot. https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output (search excerpt)
- GitHub, code owners. https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
- Screeps, introduction. https://docs.screeps.com/introduction.html
- Factorio, permissions. https://wiki.factorio.com/Permissions
- EVE University, fleet interface. https://wiki.eveuniversity.org/Fleet_interface (search excerpt, fetch returned HTTP 530)
- Blizzard, StarCraft II team strategies. https://news.blizzard.com/en-us/article/4552959/game-guide-team-strategies
- FAA JO 7110.65, chapter 5 section 4, transfer of radar identification. https://www.faa.gov/air_traffic/publications/atpubs/atc_html/chap5_section_4.html
- incident.io, roles. https://incident.io/guide/foundations/roles
- PagerDuty, escalation policies. https://support.pagerduty.com/main/docs/escalation-policies
- Grafana, roles and permissions. https://grafana.com/docs/grafana/latest/administration/roles-and-permissions/ (search excerpt)
- Excalidraw, end-to-end encryption. https://plus.excalidraw.com/blog/end-to-end-encryption
- Ink & Switch, local-first software. https://www.inkandswitch.com/essay/local-first/

[sourced] Factorio's permission groups are the precedent for read-only roles in a shared world, set by an admin through `/permissions` (Factorio permissions page). That page is marked outdated for 2.0, so it supports the idea only.
