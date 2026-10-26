# Multiplayer synthesis under the open-core decision

Date 2026-10-26. Paths are relative to `explore/` unless they start with `ui-v2/`, which is `explore/ui-v2/`. Inputs are `research/agentic-ux/n-multiplayer-ux.md` (n), `research/agentic-ux/o-multiplayer-architecture.md` (o), `research/agentic-ux/p-kvarm-rewrite.md` (p), `ui-v2/PARKED.md`, `ui-v2/READINESS.md`, `ui-v2/CORE.md`, `ui-v2/JOURNEY.md`, `proposals/ui-v2.md` and `ui-v2/TEXT.md`. A [sourced] claim cites a file and line. An [inferred] claim is a design conclusion from sourced material. A [guess] is untested.

Privacy. p is not committed. This file uses p's adapter contract shape, its census and its replacement list only. Server features that may appear later are called "optional capabilities discovered at connect time". This file names no future server feature and states no license or price for the Kvarm rewrite.

## Summary

The reconciled model in five sentences.

1. [inferred] The open single-player app connects to a Kvarm origin through one open adapter, and it draws every fact that origin reports about claims, leases, declarations, publication blocks and egress, whoever caused them.
2. [inferred] The paid team product is a people layer on top of that record, with names, presence, a team row, handoffs, proposals, follow and shared world layouts, delivered as a team plug behind a seam the open app defines and never needs.
3. [inferred] Authority never moves into the people layer, so claims stay with Kvarm's fenced lease, and every team write that must have one winner (handoff accept, cross-person settle, site move) lands as a compare-and-swap git write through the same origin.
4. [inferred] The paid layer ships first as a licensed team module that runs against the customer's own origin, and the paid hosted Acan later runs that same module, so the two paid forms differ only in who operates them.
5. [inferred] Multiplayer adds one cheap line to the single-player go bar, a proof that the open build is complete and silent with no team module loaded, and everything else about teams goes on a separate team bar that does not delay the core.

## What the decisions overrule

The user's decisions of 2026-10-26 (`ui-v2/PARKED.md:16`, `research/agentic-ux/decisions.tsv:81`) postdate n and o. Where they conflict, the decisions win.

| Research position | Source | Under the decisions |
|---|---|---|
| Every team feature works against a self-hosted origin, and hosting sells operation only. | [sourced] n:14, n:392 | Overruled. The team features are paid in both forms, self-managed and hosted. |
| Self-hosters get "the whole shared world" in the open client. Collaboration with your own origin is a core feature, not an account feature. | [sourced] o:163-173, o:197 | Overruled for the people layer. It still holds for the safety record, which stays open (tension 1). |
| Membership stored as an open repository file. | [sourced] o:167 | Reworked. The member list file format stays readable in git, so nothing is locked in, but reading and editing it in the UI is paid. |
| A paid tier may not charge for "a feature the desktop needs in order to collaborate at all". | [sourced] o:181 | Reworked. The paid tier may charge for the people layer. It may still not charge for anything the open app needs to tell the truth about the shared origin. |
| An Acan relay breaks open core. | [sourced] o:78-81 | Half overruled. A paid team service is now allowed because the open app never needs it. The second half of o's argument, no second authority, still holds (tension 4). |
| Team sync and paid hosting are separate optional services. | [sourced] p:231, p:383 | Kept and sharpened. The team plug is paid, the hosted version is paid, and neither sits in the open app's import graph or startup path. |

[inferred] Every other finding in n, o and p survives, because each was argued from honesty, authority or attention, not from pricing.

## The model in three layers

| Layer | What it holds | Who owns it | Open or paid |
|---|---|---|---|
| Authority | Claims, leases, fences, publication rules, review records, remote decision records, git refs. | [sourced] Kvarm decides claims and publication (o:203-206). | Neither. It is the customer's origin. Acan only reads and writes it. |
| Record | Orders, witnesses as definitions, readback result references, declarations, choice files, blueprint files, and the egress ledger. | [sourced] Acan owns orders, witnesses, readback evaluation, declarations and choice files (p:65). | Open, including everything the origin reports about other principals. |
| People | Names for principals, presence, ownership of orders and plants, team row, handoffs, proposals, follow, point out, shared world layout, members, `Seen by team`. | [inferred] Each person's Acan, with the one-winner facts committed through the origin. | Paid team plug. |

[inferred] The rule that places a feature is this question. Would the open app lie, or let the user take an unsafe action, if this were missing when another principal shares the origin? If yes, it is open. If it only helps people find, name, route or coordinate with each other, it is paid.

## The open and paid line

| Open, in the free app with no team module | Paid, in the team plug (self-managed or hosted) |
|---|---|
| The adapter, its 13 base and six optional operations, capability discovery, and the current Kvarm driver. [sourced] p:104-131 | The team plug interface implementation, its member, presence, handoff, proposal and ownership records, and its presence service. |
| Lease holder as the origin's principal label, fence, expiry, `UNMATCHED`, `LEASE STALE`, `yields`. [sourced] CORE:81-83, TEXT.md:63-66 | The holder's human owner as a first name on chips, plates and card headers. [sourced] n:177-178 |
| An `other owner` mark on any principal you did not mint. | Presence states Here, Acting, Away until and Offline, plus `2 here`. [sourced] n:140-145 |
| Footprints and clash pins from other principals' declarations and forecasts, with their source. | `needs Sam`, proposals, two-person settles and the plant owner rule. [sourced] n:233-243 |
| Settle options that narrow only your own plan. You may always yield. | `Team · N waiting`, Take, Hand to, Accept, Accept with hold. [sourced] n:191-205 |
| Reviews and publication blocks the origin lists for your principal, and Approve or request changes where the origin permits. | Review routing to an eligible teammate and the row `#184 · waits on team`. [sourced] n:210 |
| A permission denial shown at the point of action, and `view only` when your own token cannot write. | `plant owner decides`, roles under Alt, and any member or role editing. [sourced] n:254-255 |
| The egress pill, the network log, consent to the origin, the offline switch, held writes and reconnect. [sourced] CORE:75-84 | The Share and Join world cards, the `Seen by team` log section, presence byte grouping. [sourced] n:311-320, n:334-336 |
| A personal world (`My world`) that may hold plants on a shared origin. [sourced] n:309 | A shared company world layout, world owner, site moves, world switcher rows. [sourced] n:250, n:282-283 |
| Local-only orders with a single-device authority, if the user accepts call 3. [sourced] p:233 | Team-audience orders (`OPEN · team`) and the per-agent opt-in to them. [sourced] n:216 |
| Export of `.acan` files with no entitlement check. [sourced] p:239 | Follow, `1 following`, Point out. [sourced] n:148-150 |

## Tension resolutions

### 1. The honesty floor

[sourced] Today the free app already prints `UNMATCHED · Codex holds g1 · no readback`, and TEXT.md lists the holder among values that may never hide (CORE:82, TEXT.md:63, TEXT.md:66). [inferred] Two people on one origin with the free app see each other's leases in exactly this way, because the lease comes from the origin, not from a team feature. Hiding it would draw a held order as open, which breaks the claim rule (CORE:5) and the honesty rule (TEXT.md:9).

[inferred] So the floor is every fact the origin reports that changes what the user may safely do next. That covers who holds a lease (as the origin's principal label), its fence and expiry, whether it is matched, declarations and forecasts that make a clash, publication blocks and the reviews the origin lists for you, permission denials, and every byte sent. Add one mark, `other owner`, on any principal the user did not mint. It changes the next action, because you cannot release or narrow it, so it is a safety fact and not a people fact.

[inferred] Two more open behaviors follow from the floor. A clash with another principal's plan offers only the options that narrow your own plan, since the open app has no way to write someone else's declaration and should not show a dead button. And the Kvarm consent card adds one sentence, `Anyone with access to this repository can read what you post.`, because that is true of any shared origin and the user should know it before the first byte.

[inferred] Above the floor everything is people. Turning `droid-sam` into `Sam`, showing that Sam is here or settling, routing a row to Sam, and offering `needs Sam` all help people coordinate, and none is needed to stay truthful. Those are paid.

[inferred] A shared readback result needs one fix to keep the floor honest. o keeps readbacks Acan-local (o:99, o:207), while p says another viewer may not assert a match it cannot verify (p:209, p:217). With two free users, Sam's viewer would see Dana's matched lease as `UNMATCHED`, which is false. Recommendation, publish the `MatchRef` (digest, order revision, witness digest, principal, verdict, no transcript) as part of the open adapter whenever the order lives on a shared origin. The viewer then shows `CLAIMED` with the evidence level `authenticated`, because the origin authenticated the principal that published it but the viewer did not run the evaluator (CORE:98). Where the record lives is open ask n2 below.

### 2. Shape of the paid offer

[inferred] Recommend the licensed team module against the customer's own origin first, with the hosted Acan as the second form running the same module. Reasons follow.

- [sourced] Using Kvarm today already means running an origin, since the solo app connects to the user's own origin (CORE:75, PARKED:22). [inferred] The first team buyers therefore already operate the one server the team product needs.
- [inferred] Building the self-managed module first forces the seam to stay clean. If hosted ships first, team logic tends to leak into the hosted service, and the self-managed form becomes a port.
- [inferred] Hosted adds tenancy, custody of customer code, backups and support, and it depends on a hosted origin whose availability is outside this design. [sourced] p asks that the first shared release carry no launch-date dependency on the rewrite (p:409).
- [sourced] The counterweight is setup cost. Current Kvarm deployment needs Cloudflare services and a paid Workers account (p:229), and o could not confirm a self-host without Cloudflare (o:342). [inferred] That favors hosted for teams that do not want to operate anything.

This is user call 1.

### 3. The seam

[inferred] The open app defines two boundaries. The coordination adapter (p) talks to the authority. The team plug talks to the people layer, and the open app ships its null implementation. A paid team plug is a second implementation. It never opens its own route to the origin. Every authoritative write it makes goes through the open adapter, and every byte it sends goes through the open egress ledger, so the open app's honesty guarantees cover the paid code too ([sourced] o:159, p:197).

Types that cross the boundaries, merged from o:141-154 and p:69-77.

| Type | Side | Carries | Notes |
|---|---|---|---|
| `AuthorityRef` | open | Connection id, origin, repository, binding epoch | [sourced] p:71 |
| `ObjectRef` | open | Authority-qualified id and revision | [sourced] p:72 |
| `OrderRef` | open | Order id, revision, drawing commit, witness digest | [sourced] p:73, o:146 |
| `Claim` (o's `ClaimLease`) | open | Work, principal, fence, server expiry, local deadline, bound match | [sourced] p:74, o:147. Includes other principals' claims. |
| `MatchRef` (o's `ReadbackVerdict`) | open | Evaluator result digest, order revision, witness digest, principal | [sourced] p:75, o:148. Published on shared origins (tension 1). |
| `Evidence` | open | Value, source, revision, age, level, coverage | [sourced] p:76 |
| `WriteReceipt` | open | Command id, steps, outcome | [sourced] p:77 |
| `Declaration` | open | Paths, revision read, source | [sourced] o:149 |
| `DecisionRef` | open | Choice path, commit, id, superseded-by | [sourced] o:150 |
| `PublicationHold` | open | Rule, failing check, head | [sourced] o:151 |
| `AgentPrincipal` | open | Agent id, owning human, scope, expiry | [sourced] o:145. Solo needs it to mint agents. |
| `ConnectionDescription` | open | Contract version, principal, grants, capabilities | [sourced] p:85-94 |
| `EgressRecord` | open, local only | Destination, bytes, reason | [sourced] o:154-156 |
| `WorldRef` | paid | Shared world repository, origin, purpose | [sourced] o:143. `My world` needs no `WorldRef`. |
| `Member` | paid | Principal, human, display name, role | [sourced] o:144 |
| `Presence` | paid | Principal, plant, acting machine, away-until, expiry | [sourced] o:153. Reworked, no cursor, per n:138 and n:151. |
| `Ownership` | paid | Order owner and audience, plant owner, world owner | [inferred] from n:170-172 |
| `Handoff` | paid | Object, giver, receiver, state, restriction | [inferred] from n:202 |
| `Proposal` | paid | Clash, option, proposer, waits-on, superseded-by | [inferred] from n:236-243 |
| `PointOut` | paid | Object, from, to person or team | [inferred] from n:150 |
| `RateSummary` | deferred | Entity, window, redacted rate | [sourced] o:152, o:261. Not in v1 (disagreement D4). |

Operations.

| Operation | Side |
|---|---|
| The 13 base operations, `describeConnection` to `requestPublication` | open [sourced] p:104-120 |
| The six optional operations, each gated by discovery | open [sourced] p:124-131 |
| `publishMatch` and `readMatch` for `MatchRef` on shared origins | open [inferred], new to p's list |
| `readMembers`, `resolvePrincipal` (principal to display name) | paid |
| `publishPresence`, `readPresence` | paid, through the presence service |
| `offerHandoff`, `acceptHandoff`, `take` | paid, committed through the adapter's git write |
| `propose`, `acceptProposal` | paid, the settle lands through `publishChoice` |
| `pointOut`, `follow`, `shareWorld`, `joinWorld`, `leaveWorld` | paid |

Extension points the open shell exposes, each empty under the null plug.

- [inferred] A principal label resolver. Open returns the origin's label plus `other owner`. Paid returns a first name.
- [inferred] Extra queue rows below the user's own rows. Open adds none.
- [inferred] A per-option gate on settle cards. Open hides options that narrow another principal's plan. Paid replaces their key cap with `needs Sam`.
- [inferred] Ctrl K verbs, top-left island words, a network log section and world menu rows. Open adds none.

[inferred] The open app never renders a disabled team control, an empty team row or an upgrade prompt (n:361, PARKED:16). The only hint that a team product exists lives outside the app, on the project's site.

### 4. Where the anti-relay argument still holds

[sourced] o's argument had two halves. An Acan relay made the open app depend on a vendor sign-in, and it put a second authority beside Kvarm (o:81). [inferred] The decisions remove the first half for the paid layer, because the open app never needs the team service. The second half is untouched and binds the open app, the team module and the hosted version alike.

- [sourced] Never a second lock. An Acan world lock that calls `claim_task` underneath is a second lock with a friendlier name (o:219). A team-sync service must not mint a competing lease (p:65).
- [inferred] The team service holds no claim, no lease, no fence and no publication state. It holds presence, which expires and decides nothing ([sourced] o:212).
- [inferred] Every one-winner team fact is a git write with an expected old value at the origin ([sourced] o:34). That covers handoff accept, take, cross-person settle, and site moves. The first write the origin accepts wins, which is n's "first recorded decision wins" (n:243) with the origin as referee.
- [inferred] Race safety never depends on presence latency. `Sam · settling` reduces wasted work. The origin's compare-and-swap prevents the double settle.
- [sourced] A partition creates no second authority (p:211), and moving between a self-managed origin and the hosted version never dual-writes claims, reviews or decisions (p:249).
- [sourced] The open app's single-device authority for local-only orders is not a second lock, because it never covers remote work (p:233, p:235).

## Answers to n's asks for architecture

| # | Ask (n:367-379) | Status | Answer |
|---|---|---|---|
| 1 | Can the team UX run on a self-hosted origin alone? | conflicting | n wants all of it open on a self-hosted origin (n:367, n:392). The decisions make it paid. [inferred] Recommendation, the licensed module runs against the customer's own origin and adds one small presence service the customer runs beside it. Everything else it needs is git files and the origin. |
| 2 | Where do layout, presence, readback one-liners, away, handoffs, proposals and `Seen by team` live? | answered, one part open | [inferred] Layout, world owner, plant owner, order owner and audience, handoffs and proposals are `.acan/` files committed through the origin, following o's rule that canonical copies live in git (o:304). Presence and away live in the presence service and expire (o:212). `Seen by team` is computed locally from the ledger. The open part is the `MatchRef` location, a small file on the order's branch or an origin comment. [inferred] Recommend the file, for portability (o:304), and validate it in the two-desktop tests (p:221). |
| 3 | Presence latency with outbound polling only? | answered | [inferred] Against the origin alone there is no presence object, so the presence service carries it over an outbound connection from each desktop, with no open port (proposals:29). About 5 s for Acting is then a service setting, not a Kvarm limit. It matters for comfort only, because the origin's compare-and-swap decides races (tension 4). |
| 4 | Presence inside 480 reads and 90 writes per token per minute? | answered | [inferred] Presence uses the presence service, so it spends none of the per-token origin budget (proposals:31). Team git writes are rare human actions. |
| 5 | Can order ownership change without changing the lease? Can a lease be released and reclaimed with no lost work? | answered, one part open | [inferred] Yes for ownership, since the owner is a field in the order file and the lease stays bound to the agent's principal (n:203, o:236). Release is open. [sourced] p invents no release endpoint (p:137), and current fencing renews an expired lease if no successor took it (p:51). Reclaim after release needs a real-server test. |
| 6 | Does author exclusion use the agent's owner? | open | [sourced] Kvarm excludes the recorded author (h-kvarm.md:151 via o:249). Whether the author is the agent principal or its human owner is unconfirmed (proposals:88). It decides user call 8 and solo approval both. |
| 7 | Can a settle be `proposed · waits on Sam`, then settle on accept with both authors? Who wins concurrent settles? | answered | [inferred] Yes. The proposal is a paid record, the accept commits the choice file naming both authors, and `publishChoice` mirrors it with one publisher per choice (p:182). The first commit the origin accepts wins, and the loser sees a superseding proposal (n:243). |
| 8 | Where is plant ownership stored? | answered | [inferred] A per-plant owners file in the plant repository's `.acan/`, edited by commit and covered by the protected-definition check like budgets (proposals:28). Per repository, since one plant is one repository. |
| 9 | Where is the world owner stored, and how are site moves ordered? | answered | [inferred] A shared world is its own small repository on the origin with `.acan/world.yaml`. Site moves are commits with an expected old value. Others see a move on their next focus change (n:250). |
| 10 | Can every team write be in the ledger, so the pill equals the log? | answered | [sourced] Yes. The seam writes the log itself, and a plug that opens its own socket is not an implementation of the seam (o:159). The same ledger counts discovery, retries and sockets (p:197). |
| 11 | Can the hosted tier encrypt the shared record end to end? | open | [inferred] Not for the git record, because origin-side merge, exact-tree checks and branch rules read plaintext. The presence service's data can be encrypted. A hosted end-to-end promise for the record would need the checks to move to clients, which weakens enforcement. |
| 12 | What does a teammate see while I am offline, and how do held writes land? | answered | [inferred] In the open app a teammate sees your last leases age toward expiry and nothing else. With the team plug they see `Dana offline · 3 held` (n:145). [sourced] Reconnect is not a FIFO flush. It refreshes revisions, leases and outcomes, invalidates obsolete intentions and confirms the rest (p:184). |
| 13 | Which asks does the rewrite change? | out of scope here | Kept in private notes, as n asked (n:379). |

## Answers to o's asks for UX

| # | Ask (o:314-320) | Status | Answer |
|---|---|---|---|
| 1 | The mark for a stale shared fact. | answered | [sourced] p separates connection, freshness and claim axes, refogs uncertain ownership and never infers takeover from expiry (p:160, p:163). CORE already draws `LEASE STALE · g1 expired` and refogs (CORE:83). A stale claim sits closer to unmatched than to offline, because ownership is unknown. |
| 2 | Presence must not read as authority. Do cursors exist? | answered | [sourced] No cursors (n:138, n:151). Presence is words on owned objects, and acting is a pill on a machine, never a lease mark (n:143). o's `Presence` type drops its cursor field. |
| 3 | The consent sentence before the first byte. | answered | [sourced] n's Share card names the origin, what is sent with a byte estimate, and what stays local (n:311-316). [inferred] The open Kvarm consent card adds the one visibility sentence from tension 1. |
| 4 | Does one person's settle appear to the other as settled or as waiting? | answered | [sourced] Settles that narrow only your plan land as settled, with a toast to the other person (n:235, n:297). Settles that narrow another's plan are proposals (n:236). |
| 5 | Is a teammate's rate summary drawn? | conflicting | [sourced] o allows an opt-in redacted rate summary (o:261). n draws a source this machine cannot see as unknown with `observed on Dana's machine only` (n:270). [inferred] Recommend n for v1 and defer `RateSummary` (D4). |
| 6 | Where the offline switch sits, and the minute after it is pressed. | answered, placement open | [sourced] Writes are held and counted, and teammates see `offline · N held` (n:338, CORE:84). Placement belongs to `SHELL.md`, which is not written (PARKED:39). |
| 7 | Whose queue gets an unmatched lease held by a teammate's agent? | answered | [inferred] The order owner's queue, because the row is about their order. Open names the holder by principal label and `other owner`. Paid adds the agent owner's first name and a row in the agent owner's queue (n:171). |

## Disagreements among n, o and p

| # | Topic | n | o | p | Resolution |
|---|---|---|---|---|---|
| D1 | Open-core line | All team features open on a self-hosted origin (n:392) | Same (o:173) | Team sync and hosting optional, separate (p:231) | The decisions. People layer paid, safety record open. |
| D2 | Readback storage | Shares readback one-liners (n:113) | Acan-local only (o:99, o:207) | Shared, durable, verifiable result reference (p:209, p:217) | p, as an open `MatchRef` on shared origins, shown as `authenticated`. Transcripts and one-liners stay local unless published. |
| D3 | Presence content | Plant focus, acting, away, offline, no cursor (n:140-151) | `Presence` carries a cursor (o:153), and cursors are a UX question (o:315) | Presence never grants ownership (p:211) | n. Drop the cursor field. |
| D4 | Shared telemetry | Not relayed, shown as unknown (n:268-270) | Opt-in redacted rate summary (o:261) | No new automatic egress (p:197) | n for v1. `RateSummary` deferred, and paid if it ever ships. |
| D5 | Where hosting fits | Hosting sells operation (n:392) | A hosted Kvarm origin (o:175-187) | The hosted origin is one selectable origin (p:195, p:231) | Acan's own hosted version is paid and runs the team module. Origin choice stays explicit in the connection, and a move is a new consent and binding (p:195). |
| D6 | Lease release on handoff | The receiver may release the lease (n:203) | Silent | No invented release endpoint (p:137) | p. Handoff moves decisions only. Release waits for a real-server test. |
| D7 | Roles | `view only` and plant owner (n:255) | Read and write roles only, design role as an Acan allowlist (o:240) | Permission denial separate from absence (p:88) | o's two roles. `view only` for your own token is open. Plant owner and world owner are paid ownership records, not server roles. |
| D8 | Concurrent settles | First recorded wins (n:243) | Decisions may arrive late (o:40) | One publisher per choice, no exactly-once (p:182) | First git write the origin accepts wins. Its author is the one publisher. |

## User calls

Ten calls only the user can make. Each has a recommended default.

1. **Which paid form ships first?** Default, the licensed team module against the customer's own origin, then the hosted version running the same module. Self-managed first keeps the seam honest, but every early team must operate an origin, which is costly on current Kvarm (p:229).
2. **May the open app take origin-native actions across people, such as approving a teammate's agent's change the origin lists for you?** Default yes, because the origin grants it and blocking it in the client is an artificial limit. It slightly narrows what the team product alone offers.
3. **Are local-only parallel claims part of the complete solo core?** Default yes, through a single-device authority labeled local (p:233, p:405). It makes "many agents in parallel" true without Kvarm, at the cost of a second claim path to test.
4. **May the first team beta ship with readback enforcement on managed clients only?** Default yes, with unmatched external leases visible to all (p:209, p:406). Waiting for server enforcement is safer but has no date.
5. **Are review and publication separate actions?** Default separate, with policy disclosed (p:407). One button is faster but hides that approval is not publication.
6. **Presence privacy.** Default, tell the followed person, and let a person hide Here but never Acting, Away or Offline (n:383, n:386). Telling builds trust, and it makes quiet observation impossible.
7. **May teammates take your overdue items while you are away?** Default yes after the latest safe response passes, with a switch per step-away (n:384). It keeps work moving at the cost of your items changing hands without you.
8. **Who may approve another person's agent's work?** Default anyone the origin counts as not the author, which is decided by ask n6 (n:388). GitHub's stricter rule also excludes whoever asked for the work.
9. **Do agents claim other people's orders?** Default only orders posted with audience `team`, and only agents whose owner opted in (n:389). It protects each person's token spend, and it adds one flag to learn.
10. **Does the team bar gate the single-player go signal?** Default no. Only G10, the open-core proof, joins the go bar. Gating on the team bar would prove the seam end to end before implementation, but it would delay the core by the whole team prototype.

[inferred] Calls that the synthesis resolved instead of passing on are handoff scope (decisions only, D6), whether a personal world may hold company plants (yes, n:390), telemetry relay (no, D4), the cross-person settle rule (n:385, resolved by tension 4), and organization defaults for members (never bypass each person's consent, p:408).

## Proposed READINESS change

[inferred] Add one line to the go bar and a separate team bar.

New go-bar line, after G9.

| # | Line | How it is checked | Status |
|---|---|---|---|
| G10 | **Open core is complete alone.** The open build contains no team module. The whole journey, every `kv` script and the `peer` script pass in it. No surface shows a team word, a disabled team control or an upgrade prompt. Facts the origin reports about other principals (holder, fence, declaration, publication block) still show. | The open build has no `data-team` attribute and no `team` global. `drive.mjs` passes `journey.steps.json` and `journey-peer.steps.json` on it, also with `team=1` in the hash, and the audit's per-shot word counts equal the run without that flag. The network log lists only destinations the user consented to. | red, the journey is not built |

[inferred] Why G10 belongs on the go bar. It costs one build flag, one short steps file and one scan, and it is the only check that the core stays complete when the seam is null. Retrofitting a seam after implementation starts is the expensive path that o warns about (o:306).

New team bar, after the Process section. It gates team implementation, not the core go signal (call 10).

| # | Line | How it is checked | Status |
|---|---|---|---|
| T1 | **The team pass runs.** The team build drives section 8 of JOURNEY.md by keyboard and by mouse, from your side and from Sam's side. | `journey-team.steps.json` and `journey-team-sam.steps.json` print `OK` with no page errors, in dark and light. | red, not built |
| T2 | **Team text fits.** Every team screen stays within `TEXT.md` budgets, and team marks add at most 14 words to any screen. | Audit word counts on every team shot, compared with the same beat in the open build. | red |
| T3 | **One winner, always.** Scripted fixtures for two desktops racing one claim, two concurrent settles, a handoff accepted while the giver is offline, and a revoked member all converge with one owner. These are fixture proofs, recorded apart from real-server conformance. | Steps files for each race, asserting one holder or one choice and the loser's superseding row. | red |
| T4 | **The user judges the team pass.** The user clicks through section 8 in a browser. | The user. | red |

## Doc-change plan

[sourced] p lists 25 replacement ranges at line addresses that still match the current files (p:267). [inferred] The plan below merges them with the multiplayer changes. It also redacts p's wording where it names future server features, and it replaces the word secret with credential in G4. Nothing has been applied.

Counts are CORE.md 8, JOURNEY.md 15, READINESS.md 6, PARKED.md 5, and `proposals/ui-v2.md` 14, for 48 changes. Of these, 25 come from p, several merged with multiplayer wording.

### CORE.md, 8 changes

**CORE-1, `ui-v2/CORE.md:5`** (p, merged).

Current.

> Round 3 adds three calls. Kvarm is an opt-in connection to your own origin, and every byte to it is drawn as declared egress. A claim needs both a matching Acan readback and a live Kvarm lease of the same generation; a lease holder with no matching readback is drawn as UNMATCHED, never as CLAIMED. We ask Kvarm to enforce that readback match server-side as a precondition on claim_task. The review gate stays advisory.

Replace with.

> Kvarm is an opt-in coordination authority behind Acan's thin adapter. The first request waits for consent to the origin and data classes. Every send is declared egress. An agent self-claims only after an applicable Acan readback match and an accepted live lease. Bind the match to the order revision, witness-definition digest, drawing revision, principal, and returned fence. A lease without that match is UNMATCHED, never CLAIMED. Server-enforced readback gating is a capability to discover, not a current guarantee. Leases, declarations and blocks that belong to principals you did not mint are drawn the same way, with the holder the origin names. The review allowance stays advisory.

**CORE-2, `ui-v2/CORE.md:14`** (p).

Current.

> 4. An agent whose readback matches every check **claims** the order on its own. Nobody assigns it.

Replace with.

> 4. An agent whose readback matches every current check requests the order's lease on its own. Show CLAIMED only after the selected authority accepts the lease and Acan binds it to that match. Nobody assigns the order.

**CORE-3, `ui-v2/CORE.md:75`** (p, redacted).

Current.

> Kvarm is an opt-in connection to the user's own origin (`git.acan.local`), so every op to it is declared egress. Each concept inlines its own scripted fixture from `concepts/core-data.mjs` (`KVARM`) and makes no network requests. A strip under the order plate logs each op with destination, bytes, and reason. The egress pill (top right) adds the bytes and opens the network log. The hash flag `kv=ok`, `kv=unmatched`, `kv=stale`, or `kv=offline` picks the script. No flag is `kv=ok`, and the default stays as calm as before.

Replace with.

> The production boundary is Acan's coordination adapter, not Kvarm tool names. A connection names its authority, repository, origin, capabilities, and principal. The prototypes inline fixtures from `concepts/core-data.mjs` and make no requests. Keep `kv=ok`, `kv=unmatched`, `kv=stale`, and `kv=offline` as scenarios, with `kv=ok` as the default. Connection, freshness, and match status are separate axes. The shared egress ledger records actual sends in production and explicitly scripted sends in these prototypes. Its pill opens the network log without changing connection state. Optional capabilities discovered at connect time stay off until the selected server reports compatible support and permission.

**CORE-4, `ui-v2/CORE.md:78-84`** (p).

Current.

> - Post writes order revision `r1` locally, then logs `create_issue` and `dispatch_issue`. The flag reads `POSTED LOCALLY` until both return, then `OPEN · kvarm #41`.
> - Readback rows say `readback · Acan`, because Kvarm stores no readback.
> - An answer that creates w3 bumps the order to `r2` and logs `comment_issue`. Readbacks show `re-scored on r2`.
> - A claim logs `claim_task` from the agent's own token. The flag reads `CLAIMED · Claude Code · lease g1` with a countdown. The other matched agent shows `yields`.
> - With `kv=unmatched`, Codex holds the Kvarm lease with no readback. The flag reads `UNMATCHED · Codex holds g1 · no readback` in amber, the territory stays fogged, and a Waiting-on-you row appears. Never draw this state as `CLAIMED`.
> - With `kv=stale`, a heartbeat fails. The flag reads `LEASE STALE · g1 expired`, the bot shows `stopped · STALE_GENERATION`, and the territory refogs.
> - With `kv=offline`, Post shows `POSTED LOCALLY · not in Kvarm` and a matching readback shows `MATCHED · claim waits for connection`. Writes are held and counted on the pill. Reconnect shows `checked heads and leases`, and Enter sends the held writes in order.

Replace with.

> - Post commits order revision `r1` locally, then calls `publishWork`. Show POSTED LOCALLY until both remote record creation and claimable-work publication are confirmed. The evidence card may show the backend issue and task locators.
> - Acan owns typed readbacks and their evaluation. Store an authorized revision-bound result reference wherever another viewer needs to verify the match. Never infer a match from a lease.
> - An answer adds w3 and creates order `r2`. Call `publishWork` for the new revision and invalidate matches for the old witness digest. Show the revision used for each score.
> - The agent calls `claimWork` with its own credential handle after matching. Bind the returned fence to that match. Show CLAIMED and the conservative lease deadline only after acceptance. Other matched agents yield.
> - With `kv=unmatched`, Codex holds a remote lease without an applicable readback. Show UNMATCHED with the holder and reason. Keep fog and add a Waiting-on-you row without moving focus.
> - With `kv=stale`, distinguish a failed observation, known expiry, and rejected fence. Refog uncertain ownership. Stop managed work under a known expired or rejected claim. Never infer successor takeover from expiry alone.
> - With `kv=offline`, keep local drafts and matched results, but show claim waiting for connection. Hold remote intentions without calling them published. On reconnect, refresh capabilities, permission, revisions, leases, policy, and unknown outcomes. Confirm only still-valid intentions. Never replay expired renewals or stale approvals.

**CORE-5, `ui-v2/CORE.md:87-90`** (p, plus one multiplayer bullet).

Current.

> - Footprint labels name their source, for example `declared · kvarm intent` or `static`.
> - Each clash card shows the Kvarm `forecast` evidence with age, or `forecast truncated`. c3 stays advisory.
> - Every settlement writes a choice file and logs `record_decision` with the choice path and the decision id. Split adds a contract commit (`git_push` of `contracts/paypal.result.v1.yaml`). Split, a winning side, and one migration owner each log `set_intent` for every narrowed side. Serialize shows `after · pin waits for upstream revision` and logs no `add_dependency`. Merge logs only the blueprint commit.
> - The settled mark shows `decision synced` or `decision pending`. Ctrl Z logs a superseding decision and marks the old one `superseded`, because Kvarm cannot delete a decision idempotently.

Replace with.

> - Footprints name their source as Acan declaration, remote path declaration, observed edit, static analysis, or history. Remote intent is advisory and non-exclusive.
> - Clash cards show `forecastInterference` evidence, analyzed revisions, age, and coverage when supported. Missing or truncated forecasts remain unknown. Low-confidence overlap stays advisory.
> - Every settlement writes a canonical choice file and calls `publishChoice` with its ID and commit. Split commits the contract. Narrowed declarations call `declareFootprint`. Serialize remains advice until an exact upstream revision can be accepted by `pinWork`. Merge commits the blueprint. Show partial or unsupported effects separately.
> - Settled marks show local, syncing, synced, partial, or outcome unknown. Undo writes a new canonical choice revision that supersedes the old one. Do not delete history or blindly repeat a decision write after a timeout.
> - When the other side of a clash belongs to a principal you did not mint, the card names that principal with `other owner` and offers only the options that narrow your own plan. Acan never writes another principal's declaration.

**CORE-6, `ui-v2/CORE.md:98`** (p).

Current.

> - Bot badges show principal, session, and evidence level: `declared`, `authenticated`, or `verified`.

Replace with.

> - Bot evidence shows the principal, session, source, and supported evidence basis. Preserve declared, authenticated, and verified only with their defined meaning. Unknown or missing evidence stays unknown. Authentication does not prove the model ran, and no lease proves the process is alive. A match published by another principal's Acan reads `authenticated`, never `verified`.

**CORE-7, insert after `ui-v2/CORE.md:98`** (multiplayer, new). Current text is none. Insert.

> **Other principals and the team seam.**
> - The open app draws every fact the origin reports that changes what the user may safely do, whoever caused it. That is the holder's principal label, fence, expiry, UNMATCHED, stale, declarations, forecasts, publication blocks, reviews the origin lists for you, and permission denials at the point of action. Mark a principal you did not mint `other owner`.
> - The Kvarm consent card says `Anyone with access to this repository can read what you post.`
> - The open app never turns a principal into a person's name and draws no presence, team row, handoff, proposal, follow, or shared world. Those belong to the paid team module behind the team seam (`JOURNEY.md` section 8). With no module loaded, nothing names it, and no control is disabled on its behalf.
> - With `peer=1`, droid-radar belongs to another principal on the same origin. Its chip reads `DROID · other owner · authenticated`, and the clash card follows the rule above. Nothing else changes.

**CORE-8, `ui-v2/CORE.md:110`** (multiplayer).

Current.

> The review gate, the bench, a witness taken from Simulate for a ghost (a predicted moment, labeled as a prediction), real persistence, and any change to ui-v1 modules.

Replace with.

> The review gate, the bench, a witness taken from Simulate for a ghost (a predicted moment, labeled as a prediction), real persistence, any change to ui-v1 modules, and the paid team module (`JOURNEY.md` section 8).

### JOURNEY.md, 15 changes

**JOURNEY-1, `ui-v2/JOURNEY.md:5`** (p, merged).

Current.

> The user's calls that shape it are these. An agent claims on its own after its readback matches and Kvarm grants the lease. The gate is advisory. A hold blocks publication only and never stops an agent. Kvarm is opt-in, on your own origin, and every byte to it is declared egress. The world is a canvas of systems, not of agents. Appearance is Light, Dark or System, with F8 per window. Core UX comes first. We dogfood with Droid.

Replace with.

> An agent self-claims after a current readback match and a live lease from the order's selected authority. The review allowance is advisory and never stops an agent or withholds an order. Enforced review rules block publication only. Kvarm is opt-in behind the coordination adapter, with consent to the selected origin and declared egress. Optional capabilities require compatible server reports and permission. Solo local use requires no hosted account. The single-player journey is complete in the open build, and the paid team pass in section 8 exists only in the team build. The world is a canvas of systems, not agents. Appearance stays Light, Dark or System, with F8 per window. Core UX comes first. We dogfood with Droid.

**JOURNEY-2, `ui-v2/JOURNEY.md:9`** (multiplayer). Section 1 is being rewritten by the shell agent (PARKED:55), so apply this to whichever sentence lists the load flags.

Current.

> **One page, no switching.** `node build.mjs journey` writes `live-journey.html`. The hash `c=journey` is read once at load. After that the URL never changes. There is no hash switching, no `pushState`, and no reload. Back and forward keep an in-memory place history. Optional load flags are `kv=ok|unmatched|stale|offline`, `appearance=light|dark|system`, and `beat=<id>`, which seeds a later beat (see section 6).

Replace with.

> **One page, no switching.** `node build.mjs journey` writes `live-journey.html`. The hash `c=journey` is read once at load. After that the URL never changes. There is no hash switching, no `pushState`, and no reload. Back and forward keep an in-memory place history. Optional load flags are `kv=ok|unmatched|stale|offline`, `appearance=light|dark|system`, `peer=1` (another principal's agent on the same origin), and `beat=<id>`, which seeds a later beat (see section 6). `TEAM=1 node build.mjs journey` writes `live-journey-team.html`, the only build that reads `team=1` and `me=you|sam` (section 8).

**JOURNEY-3, `ui-v2/JOURNEY.md:16`** (p).

Current.

> - **Kvarm strip.** Bottom bar, after the queue pill. It shows connection state and the live lease, for example `Kvarm · git.acan.local · connected · lease g1 · Claude Code · t-41`. Click opens the network log.

Replace with.

> - The connection readout in the chosen floating shell shows the selected authority, origin, freshness, and relevant lease. Detail stays in its evidence card. It exposes unavailable capabilities and unmatched claims without permanent extra chrome. Clicking opens detail and changes no connection setting.

**JOURNEY-4, `ui-v2/JOURNEY.md:43`** (p).

Current.

> | 1 | World [16:30] | load | load | Five plants. Queue pill `Waiting on you 3`. Acquit site reads `paypal over budget · 4.1% of 2%`. Kvarm strip `connected`. Pill `local + kvarm · 2304 B out`. No anchor. | queue `breaker, codex, digest`, ledger 4 rows |

Replace with.

> | 1 | World [16:30] | load | load | Five plants. Queue pill `Waiting on you 3`. Acquit reads `paypal over budget · 4.1% of 2%`. The connection readout shows the discovered scripted state. The egress pill equals the scripted ledger total, not a hard-coded counter. No anchor. | queue `breaker, codex, digest`, normalized connection description and initial snapshots |

**JOURNEY-5, `ui-v2/JOURNEY.md:46`** (p).

Current.

> | 4 | Order [16:31] | P, type, Enter | Post, click sentence, type, Post | Order card with the sentence field, locked checks w1 and w2, and budget `paypal.error_rate < 2%`. Post switches to Live. Kvarm opens issue #41 and task t-41. Anchor paypal. | `sentence` as typed, order r1 open |

Replace with.

> | 4 | Order [16:31] | P, type, Enter | Post, click sentence, type, Post | The order card shows the sentence, locked checks w1 and w2, and budget `paypal.error_rate < 2%`. Post switches to Live and calls `publishWork`. Show local, partial, and remote-open states honestly. Backend issue #41 and task t-41 are evidence locators. Anchor paypal. | `sentence` as typed, order r1 open only after confirmation |

**JOURNEY-6, `ui-v2/JOURNEY.md:49`** (p).

Current.

> | 7 | Claim | none | none | Rescoring 600 ms, then 1400 ms of visible evidence, then `claim_task`. Toast `Claude Code · claude-payouts claimed the order. Readback matched 3 of 3.` paypal-payouts unfogs. Kvarm strip shows lease g1. | `claimedBy Claude Code`, lease g1 |

Replace with.

> | 7 | Claim | none | none | Rescore the exact current witness set, then let the matched agent call `claimWork`. Announce the result without moving focus. Unfog paypal-payouts only after an accepted live fence is bound to that match. Show the accepted lease in the connection evidence. | `claimedBy Claude Code`, accepted fence bound to the current match |

**JOURNEY-7, `ui-v2/JOURNEY.md:52`** (p).

Current.

> | 10 | Settle [16:34] | I, Shift 1 | click the c2 pin, click Serialize | c2 card, then `Serialize, radar-otel first`. Toast `Settled before code. Decision logged to Kvarm. No file was edited.` Queue drops c2. c1 stays open. | `settled c2 serialize` |

Replace with.

> | 10 | Settle [16:34] | I, Shift 1 | click the c2 pin, click Serialize | c2 shows `Serialize, radar-otel first`. Toast `Settled before code. Choice saved locally.` Show remote choice sync separately. Queue drops c2. c1 stays open. | `settled c2 serialize`, choice receipt, dependency advisory until pinned |

**JOURNEY-8, `ui-v2/JOURNEY.md:53`** (p).

Current.

> | 11 | Gate [16:35] | U, Enter, Shift 2 | click the queue pill, click the breaker row, click Advise hold | Drawer header `40 min allowance · 9 to 18 min waiting`. Rows by class are breaker (live harm), c1 (undo cost grows), codex (agent idle), digest (publication waits). Breaker card offers Shift 1 Open review and Shift 2 Advise hold. Toast `Hold advised on the breaker. Droid keeps working. Only publication waits.` Anchor breaker. | `gate.held breaker` |

Replace with.

> | 11 | Gate [16:35] | U, Enter, Shift 2 | click the queue pill, click the breaker row, click Advise hold | The waiting card shows the allowance, estimates, their basis, and consequence classes. Advise hold records local advice. Toast `Hold advised on the breaker. Droid keeps working.` It neither sends a publication block nor changes task eligibility. Anchor breaker. | `gate.held breaker`, advisory only |

**JOURNEY-9, `ui-v2/JOURNEY.md:55`** (p).

Current.

> | 13 | Publish or hold [16:58] | U, Shift 4, Shift 1 (or Shift 2) | click the queue pill, click the #184 row, click Approve (or Hold) | 2000 ms after Record, Claude Code pushes and Kvarm opens review #184. Queue gains `Review #184 · blocks publication`. Card `Review #184 · paypal-payouts · Claude Code · 4 files · +96 −20`, with w1, w2 and w3 holding from bench A3. Approve toast `Approved #184 as you. Kvarm publishes on the next train.` Hold toast `Held #184. Claude Code keeps working. Nothing publishes until you approve.` Anchor paypal. | `review 184 approved` or `held` |

Replace with.

> | 13 | Publish or hold [16:58] | open the named #184 review, then Approve or Hold | click the #184 row, then Approve or Hold | The adapter exposes the actual head, reviewer role, frozen witness results, and remaining blockers. Approve calls `reviewChange` for that exact head. Publication is a separate authorized `requestPublication` action or a clearly disclosed existing server policy. Hold leaves the required human approval pending. If the server exposes a real hold, label its exact semantics. Agents keep working. Nothing says published until confirmed. Anchor paypal. | review receipt and queued, blocked, published, or unknown publication state |

**JOURNEY-10, `ui-v2/JOURNEY.md:105`** (p).

Current.

> | c1 can be settled by the clash card or the bench | Both are valid. Bench Record calls clash's settle with `via: "bench"`, which runs the split intents and the contract push but not a second `record_decision`. Ctrl Z on a bench-settled c1 reopens it, and Kvarm keeps both records. |

Replace with.

> | c1 can be settled by clash or bench | Both save the same canonical choice revision through one command ID. Bench selection and choice publication have separate receipts. Narrowed footprints and the contract commit keep their own receipts. Undo supersedes the choice. An uncertain remote decision remains unknown until reconciled. |

**JOURNEY-11, `ui-v2/JOURNEY.md:122`** (p).

Current.

> - **Kvarm ops.** Reused ops are world `list_repos 768`, `get_heads 512`, `get_leases 384`, gate `list_pending_reviews 640`, and every orders, clash and bench op as they are. New ops are `advise_hold 212 B` (`Advisory hold on the breaker until c1 settles. Agents keep working.`), `get_review 512 B`, `approve_review 264 B` and `hold_review 232 B`.

Replace with.

> - Adapter fixtures use domain operations and versioned normalized responses. Keep backend wire calls in the driver's evidence ledger, not in concept logic. Replace invented API names with mapped real operations or explicitly local actions. Advise hold is local and sends no request by itself. Discovery, snapshot reads, reviews, comparison actions, and writes each have scripted byte rows when the fixture sends them. Recompute every displayed total from those rows.

**JOURNEY-12, `ui-v2/JOURNEY.md:129-132`** (p).

Current.

> - If #184 was approved, 17:10 `Kvarm published #184 on the train.` If held, 17:18 `#184 is still held. Claude Code added 1 commit.` Both new.
> - 17:22 world's arrival row `Check waitlist artifact`. New stamp.
> - Catch-up reads on return are `get_heads`, `get_leases` and `list_pending_reviews`.
> - **Offline.** Under `kv=offline`, every Kvarm write is held, at 0 B out, and listed as held. The claim stays `MATCHED · claim waits for connection`. Bench Fund is disabled with `Kvarm records the arena. Fund waits for the connection.` #184 never opens. The brief adds `Kvarm was unreachable all 30 min. N writes are held.`, where N is the count of held rows.

Replace with.

> - If publication is confirmed, the brief names its observed commit and time. If only approval or queue acceptance is known, say approved or queued. A pending review remains held without implying the agent stopped.
> - Keep the 17:22 arrival row `Check waitlist artifact` as a scripted local event.
> - On return, call `readUpdates` and reconcile `readSnapshot` for authorized repositories. Show missing history and stale runtime evidence separately.
> - Offline holds remote intentions at zero new bytes for a disabled connection. Show MATCHED with claim waiting for connection, not CLAIMED. Shared bench actions wait for required capabilities and connection. Local isolated experiments remain available. Count only actual held actions. Reconnect refreshes capabilities, permissions, revisions, policies, leases, and unknown outcomes before confirmation.

**JOURNEY-13, `ui-v2/JOURNEY.md:159`** (p).

Current.

> - `concepts/journey-kv-offline.steps.json` with `kv=offline`. Short files for `kv=unmatched` and `kv=stale` that end at the claim beat.

Replace with.

> - Run the offline, unmatched, and stale scripts through the claim beat. Add adapter fixtures for absent optional capabilities, unidentified protocol, concurrent claim refusal, changed order, changed head, rejected fence, partial dispatch, and unknown decision outcome. These are behavior fixtures, not proof of a deployed server.

**JOURNEY-14, insert after `ui-v2/JOURNEY.md:160`** (multiplayer, new). Current text is none. Insert.

> - `concepts/journey-peer.steps.json` with `peer=1` on the open build, through the settle beat. Then the full keyboard pass on the open build with `team=1` in the hash. It must match the run without that flag in state, word counts and ledger. This is READINESS G10.

**JOURNEY-15, insert a new section before `ui-v2/JOURNEY.md:185`** (`## Open questions`). Current text is none. The section text is in "Prototype additions" below, under "Section 8 text".

### READINESS.md, 6 changes

**READINESS-1, `ui-v2/READINESS.md:8`** (p, merged).

Current.

> | G2 | **Every state passes.** Each concept and the journey pass their steps in dark and light, and in every `kv` script. Loaded but inactive, they change nothing. | `drive.mjs` prints `OK` for every steps file and every appearance, with no page errors. The all-concepts build with no hash still runs ui-v1 modes 1 to 4. | amber, light covered only by boot checks on some concepts |

Replace with.

> | G2 | **Every state passes.** Each concept and the journey pass in dark and light, including the four `kv` scripts, the `peer` script, and adapter failure and missing-capability fixtures. Loaded but inactive, they change nothing. Shared-claim fixtures reject duplicate ownership. | `drive.mjs` prints `OK` for every applicable steps file with no page errors. The no-hash build still runs ui-v1 modes 1 to 4. Record fixture proof separately from real-server conformance. | red until the expanded matrix is rerun |

**READINESS-2, `ui-v2/READINESS.md:10`** (p, merged, credential wording).

Current.

> | G4 | **Honest evidence.** Every number on screen comes from the fixture. The five evidence states look different from each other. The egress pill total equals the sum of the network log. Every agent claim shows its source. | Audit checks the pill sum and the evidence state classes. A reviewer checks the fixture trace. | amber, the polish pass is fixing the pill on gate |

Replace with.

> | G4 | **Honest evidence.** Every displayed number traces to a fixture or measured binding. The evidence states differ. The egress pill equals its ledger. CLAIMED requires a current applicable match and accepted live fence. A lease or declaration held by a principal you did not mint shows its holder and never reads as yours. Missing capabilities, unmatched leases, partial writes, unknown outcomes, and stale evidence remain explicit. No token or credential reaches UI evidence or logs. | Audit the pill sum and evidence classes. Review revision and authority joins. Test stale fences, missing capabilities, changed heads, ambiguous writes, the `peer` script, and credential-free fixtures. | red until the adapter evidence cases pass |

**READINESS-3, `ui-v2/READINESS.md:13`** (p, merged).

Current.

> | G7 | **The map agrees.** `proposals/ui-v2.md` matches what the prototypes prove, including the same-file decision. Every rewritten map row points to a prototype beat or a research finding. | Reviewer diff of the proposal against the prototypes. | amber, the prototype section is stale |

Replace with.

> | G7 | **The map agrees.** `proposals/ui-v2.md` matches the prototypes, same-file decision, selected-authority model, optional capabilities, and the open and paid line. Current Kvarm behavior, requested backend changes, and rewrite unknowns are distinct. Solo desktop use requires no hosted account. | Reviewer diff against prototype beats and this research. Every backend guarantee names a source or a real conformance result. | amber until the proposal and adapter wording agree |

**READINESS-4, insert after `ui-v2/READINESS.md:15`** (multiplayer, new). Current text is none. Insert the G10 row from "Proposed READINESS change" above.

**READINESS-5, `ui-v2/READINESS.md:19`** (p, merged).

Current.

> Each round goes critique, then a fresh fix round, then my own rerun of every steps file and a look at key shots. The status column changes only on evidence I reran myself. When G1 to G7 and G9 are green, I open the journey in a browser for G8 and give the go signal only after the user's yes.

Replace with.

> Each round goes critique, fresh fixes, then my own rerun and inspection of key shots. Change status only on rerun evidence. When G1 to G7, G9 and G10 are green, open the browser journey for G8. Give the implementation go signal only after the user's yes. Passing mock adapter scenarios does not certify a deployed Kvarm version. Validate real-server claims before enabling the corresponding production actions. The team bar below gates the paid team module only, never this go signal.

**READINESS-6, append after `ui-v2/READINESS.md:19`** (multiplayer, new). Current text is none. Append a `## Team bar` heading, one sentence `These lines gate implementation of the paid team module. They never gate the core go signal.`, and the T1 to T4 table from "Proposed READINESS change" above.

### PARKED.md, 5 changes

**PARKED-1, `ui-v2/PARKED.md:16`** (multiplayer). Keep the line and append one sentence.

Current, last sentence.

> Research is step 0.

Replace with.

> Research is step 0. The open and paid line, the team seam and the user calls are in `research/agentic-ux/02-synthesis-multiplayer.md`.

**PARKED-2, `ui-v2/PARKED.md:17`** (p, redacted).

Current.

> - **Kvarm is changing (2026-10-26).** Kvarm is mid-rewrite and rename, and its API shape may change. There is no date, and the user gets early beta access. Acan builds on current Kvarm behind a thin adapter. The private details live outside the repo in `recovered/kvarm-rewrite-notes.md`. Never put the new name or the unannounced features in a committed file.

Replace with.

> - **Kvarm is changing (2026-10-26).** The Kvarm rewrite has no committed integration date, and the user gets early beta access. Acan uses current Kvarm behind its own thin adapter and migrates only after behavior conformance. New server features are optional capabilities discovered at connect time, not product facts. The private details live outside the repo in `recovered/kvarm-rewrite-notes.md`. Never put the new name or the unannounced features in a committed file.

**PARKED-3, `ui-v2/PARKED.md:21-22`** (p, merged with the 2026-10-26 decision).

Current.

> - **Open core (user decision, 2026-10-18).** An open core keeps startup options open. The desktop app and the agent adapters are open. A possible team or hosted version stays separate. Keep that boundary clean in the design and the code. Anything team or hosted lives behind its own seam and is never required by the open desktop app.
> - **Kvarm** is opt-in to the user's own origin, with declared egress. Agents self-claim after a readback match plus a Kvarm lease. The gate is advisory and blocks publication only. The world is a canvas of systems, not agents.

Replace with.

> - **Open core (user decisions, 2026-10-18 and 2026-10-26).** The desktop, agent adapters, coordination adapter, current-Kvarm driver, local persistence and the whole single-player journey are open. The open app draws every fact the origin reports that affects safety, whoever caused it. The paid team module (the people layer) and the paid hosted version sit behind the team seam, outside the open app's import graph and startup path. Preserve portable repository files and export without paid entitlement checks. No component, paid or open, adds a second lock beside the origin's fenced claims.
> - **Kvarm** is opt-in to an explicitly selected origin with declared egress. Each order has one authority. Agents self-claim after an applicable readback match and that authority's accepted live lease. A lease without the match is UNMATCHED. Server-side readback enforcement is discovered, not presumed. Review allowance advice never blocks work. Enforced publication rules block publication only. The world is a canvas of systems, not agents.

**PARKED-4, `ui-v2/PARKED.md:49`** (p, rewritten for the finished research).

Current.

> 0. **Multiplayer and Kvarm research** (launched 2026-10-26, write-only to their own file). UX on Opus (174db624-7281-4def-a555-83e71a02993b) into `research/agentic-ux/n-multiplayer-ux.md`. Sync and hosting architecture on Grok (8ec08e57-13b8-47cb-96a8-2668f660fa29) into `o-multiplayer-architecture.md`. The Kvarm adapter and rewrite risk on Sol (6efa71af-7361-47e4-9d85-62c90fcc969b) into `p-kvarm-rewrite.md`. n and o are committed (45a01a9). p stays local and uncommitted, because its capability list mirrors the private rewrite plans, until the user decides. Synthesis on Opus (ba914135-9f76-43d5-bebb-df16a350dfda) into `02-synthesis-multiplayer.md`, briefed with the paid-multiplayer decision. Then update CORE.md, JOURNEY.md, READINESS.md and the proposal. Product calls go to the user.

Replace with.

> 0. **Multiplayer and Kvarm research** (done 2026-10-26). n and o are committed (45a01a9). p stays local and uncommitted, because its capability list mirrors the private rewrite plans. The synthesis is `research/agentic-ux/02-synthesis-multiplayer.md`. Next, take its ten user calls to the user, then apply its doc-change plan to CORE.md, JOURNEY.md, READINESS.md, this file and the proposal, rechecking each line address first. Keep the four connection scenarios, add `peer=1`, and add the capability, race and uncertain-outcome fixtures. Do not turn mock success into a deployed compatibility claim. The team pass (JOURNEY section 8) is built after the core journey and does not block it.

**PARKED-5, `ui-v2/PARKED.md:80`** (multiplayer).

Current.

> None blocking. The user may want the Kvarm panels moved off the compass, and the shell agent's SHELL.md decides that.

Replace with.

> Ten multiplayer and adapter calls, listed with defaults in `research/agentic-ux/02-synthesis-multiplayer.md` under "User calls". None blocks the shell, text or audit agents. The user may want the Kvarm panels moved off the compass, and the shell agent's SHELL.md decides that.

### proposals/ui-v2.md, 14 changes

[sourced] p asks to update W1 to W7, W15, W20, W24 and W25, with W20 and W25 kept as requests (p:46). [inferred] W3 and W6 need no change, because W3 names enforcement layers that stay the same and W6's per-token cap is unchanged by a presence service that spends no origin reads.

**PROP-1, `proposals/ui-v2.md:7`.**

Current.

> Two prefixes are used. **C** rows are the four concepts the user chose to prototype (orders, clash, gate, bench). **W** rows are the wave-3 rows (Kvarm, dogfood, fidelity, world, appearance), numbered as in the wave-3 synthesis candidate table, with W20 to W22 added. W23 to W27 are the same-file co-editing rows, added after the history replay.

Replace with.

> Three prefixes are used. **C** rows are the four concepts the user chose to prototype (orders, clash, gate, bench). **W** rows are the wave-3 rows (Kvarm, dogfood, fidelity, world, appearance), numbered as in the wave-3 synthesis candidate table, with W20 to W22 added. W23 to W27 are the same-file co-editing rows, added after the history replay. **M** rows are the multiplayer and open-core rows from `research/agentic-ux/02-synthesis-multiplayer.md`.

**PROP-2, `proposals/ui-v2.md:26`** (W1).

Current, first three sentences of the Decision cell.

> **Kvarm owns coordination. Acan owns the drawing, witnesses, readbacks and runtime evidence.** Kvarm is in all four modes from day one.

Replace with.

> **The selected authority, current Kvarm behind Acan's coordination adapter, owns claims, review enforcement and publication. Acan owns the drawing, witnesses, readbacks and runtime evidence.** The adapter is in all four modes from day one, and only its driver knows Kvarm routes.

Also replace the cell's last sentence before the amend note.

> Acan builds no second coordinator, lock or merge scheduler.

with

> Acan builds no second coordinator, lock or merge scheduler, in the open app, the team module or the hosted version.

**PROP-3, `proposals/ui-v2.md:27`** (W2). Replace the cell sentence.

> The adapter calls `claim_task` with the agent's own token.

with

> The agent calls the adapter's `claimWork` with its own credential handle, and Acan binds the returned fence to the exact match. On a shared origin the match is published as a result reference, and other viewers read it as `authenticated`.

**PROP-4, `proposals/ui-v2.md:29`** (W4). Replace the cell's bold sentence.

> **Kvarm is an opt-in connection to the user's own origin, shown as declared egress.**

with

> **Kvarm is an opt-in connection to an explicitly selected origin, shown as declared egress. Capabilities are discovered after consent.**

and append to the cell, before `**Refines Q16 and V6.**`.

> The consent card says that anyone with access to the repository can read what the user posts.

**PROP-5, `proposals/ui-v2.md:30`** (W5). Replace the cell sentence.

> Reconnect checks heads and leases, then waits for Enter before sending.

with

> Reconnect refreshes capabilities, permissions, heads, leases and unknown outcomes, invalidates obsolete intentions, and asks to confirm the rest. It is not a FIFO flush.

**PROP-6, `proposals/ui-v2.md:32`** (W7). Replace the cell's bold sentence.

> **Choice YAML stays canonical and is published to Kvarm `record_decision` with a sync status.**

with

> **Choice YAML stays canonical and is published through the adapter's `publishChoice`, with a receipt that reads local, syncing, synced, partial or outcome unknown. One publisher per choice.**

**PROP-7, `proposals/ui-v2.md:39`** (W14). Replace the cell's bold sentence.

> **One personal world canvas holds every project.**

with

> **One personal world canvas holds every project, including plants on a shared origin. A shared company world layout is the paid team product (M3).**

**PROP-8, `proposals/ui-v2.md:40`** (W15). Append to the Decision cell.

> In the open app the queue holds only the user's own decisions, including unmatched leases on the user's orders held by other principals. The `Team · N waiting` row belongs to the paid team module (M5).

**PROP-9, `proposals/ui-v2.md:45`** (W20). Replace the Decision cell.

> **Ask Kvarm for a server-side readback precondition on `claim_task`.** Until it ships, Acan labels unmatched claims (W2). When it ships, the gate moves into Kvarm.

with

> **Ask the authority for a server-side readback precondition on claims. It stays a request.** Acan discovers it at connect time. Until a server reports it, managed agents match before claiming and every viewer labels unmatched claims (W2).

**PROP-10, `proposals/ui-v2.md:56`** (W24). Replace the cell sentence.

> Acan computes this from `get_file_diff` and the declarations, with no Kvarm change.

with

> Acan computes this from the adapter's diff read and the declarations, with no backend change. A forecast from the server, when discovered, adds evidence and never removes a pin.

**PROP-11, `proposals/ui-v2.md:57`** (W25). Replace the cell's first sentence.

> **Ask Kvarm for read-blob admission.**

with

> **Ask the authority for read-blob admission. It stays a request, discovered at connect time.**

**PROP-12, insert after `proposals/ui-v2.md:61`** (multiplayer, new). Current text is none. Insert a `## Multiplayer rows` section with this table.

> | ID | Decision | Why | Source |
> |---|---|---|---|
> | M1 | **The single-player core is open and complete. Multiplayer is the paid team product, and a hosted Acan is paid too.** The open app never requires either, never nags, and loses nothing without them. **Amends the open-core directive.** | User decision [user, dec:81]. | PARKED:16, dec:81 |
> | M2 | **The honesty floor is open.** Every fact the origin reports that changes what the user may safely do shows in the open app, whoever caused it. Principals the user did not mint read `other owner`. A clash with another principal offers only options that narrow the user's own plan. | Hiding a foreign lease would draw a held order as open [inferred, CORE:5]. The holder may never hide [seen, TEXT:63-66]. | CORE:82, TEXT:9 |
> | M3 | **Shared record, private view.** The record is shared through the origin. Camera, selection, drafts, replay time and the review allowance stay on each machine. Transcripts, credentials and view history are never shared. | Direction B scored highest and met all three verbs [inferred, n:96-101]. | n:105-122 |
> | M4 | **People are names on owned objects, never cursors.** Presence is Here, Acting, Away until and Offline. Your own objects carry no name. | Cursors are motion without progress and move attention [inferred, n:49]. | n:136-152, n:174-180 |
> | M5 | **Waiting on you stays your decisions. One `Team · N waiting` row holds unowned, overdue-while-away and pointed-out items. Take, Hand to and Accept move decisions, never agents.** | One symptom, one decision [seen, syn:106]. Handoff follows air traffic practice [seen, n:161]. | n:182-206 |
> | M6 | **You may always yield, and you propose for others. The plant owner may settle either way. The first git write the origin accepts wins.** | Most settles stay one-person moves [inferred, n:240]. One publisher per choice [inferred, p:182]. | n:229-243 |
> | M7 | **The team plug is a seam with a null implementation in the open app. It writes authority only through the open adapter and counts every byte in the open ledger. Its service holds presence and no authority.** | A plug that skips the log is not the seam [inferred, o:159]. A team service must not mint a lease [inferred, p:65]. | o:131-159, p:63-65 |
> | M8 | **No telemetry relay.** A source a teammate's machine cannot see draws as unknown with its provenance. A shared rate summary is deferred. | Spans carry queries, headers and hostnames [inferred, o:257]. | n:266-273, o:259-261 |
> | M9 | **The licensed team module against the customer's own origin ships first. The hosted Acan runs the same module.** | The seam stays clean if self-managed comes first [inferred]. This is a user call. | 02-synthesis call 1 |

**PROP-13, `proposals/ui-v2.md:88`** (validation, solo-owner approval). Append to the bullet.

> In a team the same fact decides who may approve another person's agent's work (M6), so the test needs two humans and one agent principal.

**PROP-14, insert after `proposals/ui-v2.md:88`** (validation, new). Current text is none. Insert.

> - **Two-person behavior.** Two desktops racing one claim, two concurrent settles, a handoff accepted while the giver is offline, a stale holder returning after takeover, and a revoked member must converge with one owner [inferred, p:221]. Where the shared readback result lives, and whether a released lease can be reclaimed without lost work, need a real origin [inferred, p:137]. Self-hosting current Kvarm without Cloudflare is unconfirmed [seen, o:342].

## Prototype additions

The goal is to judge multiplayer in a browser before any implementation, and to prove the open build shows none of it.

### Build and flags

- [inferred] `TEAM=1 node build.mjs journey` adds `concepts/team.mjs` and `concepts/team-data.mjs` and writes `live-journey-team.html`. The plain build never imports them, so the open bundle has no team code to switch on. This mirrors the product seam, where the team module is outside the open app's import graph.
- [inferred] In the team build, `team=1` mounts the team module, and `me=you|sam` picks whose side the fixture renders. `me=sam` is short and exists to judge the receiving side of proposals and handoffs.
- [inferred] Every team element carries `data-team`, and every team global starts with `team`, following CORE's prefix rule (CORE:25).
- [inferred] `peer=1` works in the open build. It reassigns droid-radar (bot-d2) to principal `droid-sam`, owned by another human on the same origin. It tests the honesty floor without any team code.

### The simulated teammate

[inferred] One teammate, Sam, in `team-data.mjs`. Sam owns droid-radar, so Droid and its breaker are Sam's. This turns the journey's existing clashes into cross-person clashes without new plants or agents. c1 is your Claude Code's retry against Sam's Droid breaker. c2 is two migrations on effects queue rows, yours and Sam's. Sam's actions are scripted timers in the same fixture clock, like readback arrivals, and nothing moves your camera or focus (CORE:32).

### Section 8 text

The text below is the proposed new JOURNEY section, JOURNEY-15.

> ## 8. Team pass (paid module)
>
> This pass exists only in `live-journey-team.html` with `team=1`. It replays the journey with one teammate, Sam, who owns Droid on droid-radar. The open journey in section 2 is unchanged and complete without it.
>
> | # | On beat | What changes | Words added at rest |
> |---|---|---|---|
> | T1 | 1 World | Top left reads `Northwind / Acquit · 2 here`. The pill names the team origin. Ctrl K offers `Follow Sam`. Follow shows `following Sam · Esc`, and any key stops it. | 3 |
> | T2 | 5 to 7 Readbacks and claim | Droid's chip reads `DROID · Sam · authenticated`. Your Claude Code claims. Sam's side shows `yields · your lease`. | 1 per Sam chip |
> | T3 | 9 Clash | The c1 card names each side's owner. Breaker wins narrows your plan and settles alone. Split and Retry wins read `needs Sam`. At 16:33:40 the pin reads `Sam · settling` while Sam's card is open. | 2 to 6 |
> | T4 | 10 Settle | Serialize, radar-otel first narrows only your plan, so it settles alone. Toast `Settled c2. Sam's plan unchanged.` | 0 |
> | T5 | 11 Gate | Advise hold on Sam's breaker. Toast `Hold advised. Sam's Droid keeps working.` Sam's queue gets one row. | 0 |
> | T6 | 12 Bench | Record proposes Split for c1. The pin reads `proposed · waits on Sam`. Sam accepts after 2000 ms, and the toast reads `Sam accepted split on c1.` | 3 while waiting |
> | T7 | 13 Review | You own the authoring agent, so #184 goes to Sam. Your row reads `#184 · waits on team`. Sam approves, and the toast reads `Approved #184 as Sam.` | 4 |
> | T8 | 14 Step away | The chooser adds `Team may take overdue · yes`. Ctrl K `Hand r3 to Sam` shows `HANDOFF → Sam · pending` until Sam accepts. | 4 |
> | T9 | 15 Return brief | The brief lists `Sam accepted r3`, `Sam approved #184` and `Sam took · breaker`. `Team · 1 waiting` shows under your rows when an item is unowned. | 3 |
>
> Every team byte appends to the session ledger, and the network log gains a `Seen by team` section behind the pill. Team toasts and rows keep the toast and row budgets of 8 words, and option rows keep the choice budget of 12.

[sourced] The budgets cited are toast 8, row 8, choice 12, pill 6 and screen 150 (TEXT.md:17-20, TEXT.md:30). [sourced] n estimates 10 to 14 added words on a busy team screen, and the orders screens measured 89 to 136 (n:301). [inferred] The worst case reaches the 150 limit, so T2 on the team bar measures it, and the first cut if it fails is the `Team · N waiting` row label.

### Steps files

- [inferred] `journey-team.steps.json`, keyboard and mouse, both appearances, beats T1 to T9.
- [inferred] `journey-team-sam.steps.json` with `me=sam`, through T6 and T7, asserting the proposal and review rows land in Sam's queue.
- [inferred] `journey-peer.steps.json` on the open build with `peer=1`, through beat 10, asserting `DROID · other owner · authenticated`, the c1 card without Split and Retry wins, and no `data-team` element.
- [inferred] T3 race fixtures, one short file each, asserting one holder or one choice.

### Proof that the open build shows none of it

1. [inferred] Build without `TEAM`. Scan `live-journey.html` for `data-team`, `teamInit` and the team marker strings `here`, `HANDOFF`, `PROPOSED`, `needs Sam`, `waits on team` and `Seen by team` inside text nodes. Expect zero.
2. [inferred] Drive `journey.steps.json` on the open build twice, once plain and once with `team=1` in the hash. Compare `journeyState`, the ledger rows and the audit's per-shot word counts. Expect equality.
3. [inferred] Drive `journey-peer.steps.json` and `journey-kv-unmatched` on the open build. Expect the holder and `other owner` facts to show, which proves the floor is open and not removed with the team code.
4. [inferred] All four steps belong to READINESS G10.

## Open evidence gaps

- [sourced] Whether Kvarm's author exclusion uses the agent principal or its owner (proposals:88). It decides call 8 and solo approval.
- [sourced] Self-hosting current Kvarm without Cloudflare (o:342, p:229). It decides the cost of call 1's default.
- [inferred] Where the shared `MatchRef` lives and how a viewer verifies it, which needs the two-desktop tests (p:221).
- [sourced] Lease release and reclaim on current fencing (p:51, p:137).
- [guess] Whether teammates miss each other's work without live cursors. n names that as the test that would change the pick (n:103).
