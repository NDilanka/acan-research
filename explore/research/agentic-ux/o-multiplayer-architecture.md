# Shared company world: where state lives

Date 2026-10-26. Research and design reasoning only. No product code. A sibling file covers the multiplayer UX, and another covers the Kvarm adapter and the rewrite risk. This file stays on architecture.

## Summary

[inferred] A company world is a shared view of one git repository, not a second copy of the plant and not a room of cursors.
[inferred] The team's self-hosted Kvarm origin is the source of truth for the facts that must have one owner. Each Acan desktop keeps its own copy and keeps working when that origin is absent.
[inferred] Do not add an Acan team server, and do not make a CRDT the authority for claims, leases, or publication.
[inferred] The open desktop app ships the seam and a null plug. A hosted Kvarm is an optional convenience behind that seam, and the open app never requires it.
[inferred] Telemetry stays on each machine. Only a redacted rate summary may cross the seam, and every byte is declared egress.

## How to read the labels

[inferred] `[sourced]` marks a claim I read this session, in a page or in a file in this repo.
[inferred] `[inferred]` marks a design conclusion drawn from those sources.
[inferred] `[guess]` marks a prediction I did not measure.
[inferred] The Kvarm product is mid-rewrite. This file refers to that work only as "the Kvarm rewrite", and it depends on no new API.

## What a world is

[sourced] The drawing already merges three sources: designed (blueprint), declared (code and infra files), and observed (runtime telemetry), and disagreements are drift (`explore/map.md:29`).
[sourced] The blueprint lives as YAML in the repo under `.acan/`, and the file is the truth (`explore/map.md:45`, `explore/map.md:297`).
[sourced] The world is a canvas of systems, not of agents (`explore/ui-v2/PARKED.md:20`).
[inferred] A shared world is therefore several people looking at the same systems, the same orders, and the same measured consequences. It is not a shared canvas of notes, and it is not a shared terminal.

[sourced] Kvarm is a git platform for humans and agents, with workspaces, intents, fenced claims, and decisions, and Acan connects to the user's own origin with declared egress (`explore/research/agentic-ux/h-kvarm.md:9`, `explore/ui-v2/PARKED.md:20`).
[inferred] Multiplayer adds teammates to a connection Acan already has. It does not add a new kind of server.

## The four models

### (a) The team's Kvarm origin is the source of truth

[sourced] Kvarm stores git in Artifacts and coordination metadata in D1, and server-side ref writes use receive-pack with an expected old value (`explore/research/agentic-ux/h-kvarm.md:14`).
[sourced] Tasks carry a holder, a generation, and an expiry. Claiming rejects a competing live claim and rejects a stale generation (`explore/research/agentic-ux/h-kvarm.md:34`).
[inferred] Each Acan client reads and writes that origin over the existing outbound connection, and caches what it read. The origin decides claims, leases, and publication. Git history decides the blueprint.

What is shared. Blueprint files, orders, claims and leases, declarations, decisions, and publication state. Readbacks stay in Acan until Kvarm can store them. Gate holds that Kvarm enforces travel with the change. Advisory holds stay local. Telemetry does not travel. Presence is a side channel, not a Kvarm object.

Consistency. Claims, leases, and publication need one writer and a fencing token. Blueprint files need git's merge, not a live merge. Decisions, annotations, and presence can arrive late.

Offline. The plant, the local files, the local agents, and the local telemetry keep working. Remote claims and permissions are marked stale. A write is not called published until the origin accepts it.

When the server is gone. Solo work continues. Two people cannot safely take the same order, and nobody can publish. That is the right failure. A missing server should stop the shared action, not invent an answer.

### (b) Peer-to-peer CRDT sync, no server

[sourced] Ink & Switch define local-first as the device holding the primary copy, with servers in a supporting role, and name CRDTs as the way to merge concurrent edits (https://www.inkandswitch.com/essay/local-first/).
[sourced] Automerge documents merge by history and can sync over any transport, including a server, a peer, or a USB stick (https://automerge.org/docs/reference/concepts/).
[sourced] Yjs splits document sync from awareness. Awareness is ephemeral, expires after 30 seconds, and is not authenticated (https://github.com/yjs/y-protocols/blob/master/PROTOCOL.md).
[sourced] The same essay reports that CRDT history grows without bound, that NAT traversal was unreliable, and that a closed laptop cannot deliver an edit unless some peer stays up (https://www.inkandswitch.com/essay/local-first/).

What is shared. A CRDT can share presence, cursors, free annotations, and draft layout. It cannot be the authority for a lease.

Consistency. CRDTs converge. They do not elect one owner. Two peers can both add a claim for the same order, and the merge keeps both.

Offline. Excellent for documents. Useless for mutual exclusion, because the peer who is offline cannot hear that someone else took the order.

When the server is gone. Nothing central is gone, which is the appeal. What is also gone is any check a teammate cannot bypass. A peer who already holds the document can edit it, and the protocol cannot take that back.

[sourced] Ink & Switch say it plainly for permissions: a user who holds a copy cannot be stopped from editing it locally, and other users can only choose whether to accept the result (https://www.inkandswitch.com/essay/local-first/).
[inferred] That property is fatal for claims, for the publication gate, and for K16. A CRDT is a broadcast medium. A lease needs a referee.

### (c) A separate Acan team relay or hosted service

[sourced] Figma runs one server process per document, and that server orders edits. Clients download a fresh copy on reconnect and replay offline edits on top (https://www.figma.com/blog/how-figmas-multiplayer-technology-works/).
[sourced] tldraw's production multiplayer is a `TLSocketRoom` per room, and the server is authoritative for conflict resolution (https://tldraw.dev/sdk-features/collaboration).
[sourced] Liveblocks keeps permissions on the room, checks them when a user enters, and supports a default, a group, and a user grant (https://liveblocks.io/docs/guides/managing-rooms-users-permissions).
[sourced] Zed's realtime editing requires a sign-in, and sharing a project gives collaborators access to the local filesystem (https://zed.dev/docs/collaboration).
[sourced] Zed's collab server crate is public, but a self-host still depends on Zed's own authentication, so it is not a local-only deployment (https://github.com/zed-industries/zed/discussions/13503).

What is shared. Everything the vendor decides to put in the room: document, presence, comments, permissions.

Consistency. Strong, because one process orders writes. Figma keeps that order per property and accepts last-writer-wins inside one property.

Offline. Figma and tldraw both queue local edits and reconcile on reconnect. The room itself is unreachable while the server is down, so a new teammate cannot join.

When the server is gone. The shared world stops. If that server is an Acan service, the desktop app has grown a dependency the open-core rule forbids.

[sourced] The open desktop app must never require a team or hosted backend (`explore/ui-v2/PARKED.md:19`).
[inferred] An Acan-operated relay fails that rule even if the code is open, because the simplest path becomes "sign in to Acan". It also creates a second authority next to Kvarm, which the earlier research already rejected.

### (d) Hybrid

[inferred] The hybrid that fits is small. Kvarm is the authority. Git is the document merge. A CRDT, if one is ever added, carries only presence and free annotations. Telemetry stays local.

[inferred] The hybrid that does not fit is a CRDT for the plant plus a server for the locks. That is two sync systems, two failure modes, and a lock that can disagree with the document it protects.

[sourced] Electric's current design is a read-path sync engine. It copies a Postgres shape to clients, and writes go through the application's own API (https://electric.ax/sync/postgres-sync).
[inferred] Electric is the wrong store. Acan's truth is git files plus a lease, not a Postgres table. The lesson to keep is the split: a read path may fan out, and a write path stays at the authority.

## Comparison

| | (a) Kvarm origin | (b) Peer CRDT, no server | (c) Acan relay | (d) Hybrid, recommended |
|---|---|---|---|---|
| Blueprint | Git through the origin. Merges as text. | CRDT document, or file sync with conflicts. | Room state, owned by the relay. | Git through the origin. Same as (a). |
| Orders | Issue plus an Acan order file. | Two peers can both create one. | Relay row. | Same as (a). |
| Claims and leases | One authority. Generation fencing. | No mutual exclusion. | A second lock beside Kvarm. | Kvarm only. No second lock. |
| Readbacks | Acan-local. Verdict joins the lease. | Mergeable, and forgeable. | Relay row. | Acan-local. Same as (a). |
| Decisions | Decision record plus a choice file. | Mergeable annotation. | Relay row. | Decision record for the published choice. Annotation for the rest. |
| Gate holds | Kvarm enforces publication. Advisory holds stay local. | Nobody can enforce a hold. | Relay enforces, Kvarm also enforces. | Kvarm enforces. Advisory stays local. |
| Telemetry | Not shared. | Not shared. | Tempting to upload. | Not shared. Redacted rates only, opt-in. |
| Presence | Not a Kvarm object. | Native, and unauthenticated. | Native. | Ephemeral side channel. Never authoritative. |
| Offline | Local work continues. Shared actions wait. | Documents work. Locks do not. | Room unreachable. | Same as (a). |
| Server gone | Solo continues. Publish and claim stop. | No server to lose. No referee either. | Shared world stops. | Solo continues. Publish and claim stop. |
| Open core | Fits, if the origin is theirs. | Fits, and loses the gate. | Breaks, unless the relay is optional and unused by default. | Fits. |

[inferred] (d) is (a) plus a narrow side channel. It is not a fourth system.

## What is shared, and how fresh it must be

[inferred] Consistency follows the cost of being wrong, not the cost of building a sync engine.

| Fact | Shared how | Needs | Offline | Wrong if merged blindly |
|---|---|---|---|---|
| Blueprint files | Git commit through the origin | Text merge, one published head | Local edits wait | A silent layout or budget merge |
| Order | Issue on the origin, order file in `.acan/` | One open order per id | Draft stays local and unlabeled | Two agents claim one order |
| Claim and lease | Kvarm task, generation, expiry | One holder | Shown stale, never refreshed locally | Two holders, or a dead holder forever |
| Declaration | Intent on the origin | Advisory overlap | Last fetched intent, marked stale | A clash the other client cannot see |
| Readback | Acan file, scored locally | Joined to the lease before `CLAIMED` | Match waits for the lease | A lease drawn as a matched claim |
| Decision | Decision record plus choice file | Published choice has one id | File is local, record waits | A decision that disagrees with the file |
| Publication gate | Branch rule and required check | One enforcer | Cannot publish | A self-approved budget change |
| Advisory hold | Local policy | None. Never blocks a claim | Unchanged | A hold that silently stops dispatch |
| Telemetry | Not shared | Each client reads its own | Full | A teammate's spans leaving the machine |
| Presence | Ephemeral, expiring | None | Absent, which is honest | A cursor treated as a lock |

[sourced] A claim reads `CLAIMED` only when a matching readback and a live lease of the same generation both exist (`explore/ui-v2/CORE.md:3`).
[sourced] The review gate is advisory and blocks publication only (`explore/ui-v2/PARKED.md:20`).
[inferred] Those two rules survive multiplayer unchanged. Team presence does not get a vote on either.

## The seam

[inferred] The seam is a small interface in the open app. Solo mode is the null implementation of that interface. A team backend is a second implementation. The plant, the orders loop, and the local telemetry store call the interface and do not know which one is behind it.

[inferred] This is the same shape as a repository remote. Git works with no remote. Adding one does not change the commit model.

### Data types that cross it

[inferred] Every type below is a record the open app already has a local version of. The seam copies facts. It does not copy a canvas, a frame buffer, or a span.

| Type | Direction | Carries | Does not carry |
|---|---|---|---|
| `WorldRef` | out, once | Origin URL, repository, declared purpose | A token |
| `Member` | in | Principal id, human owner, role | A password |
| `AgentPrincipal` | out | Agent id, owning human, scope, expiry | The human's credential |
| `OrderRef` | both | Order id, revision, paths, witness ids | The trace behind a witness |
| `ClaimLease` | in | Task id, holder, generation, expiry | A promise that the readback matched |
| `ReadbackVerdict` | out | Order revision, witness set, pass or fail, agent | The transcript |
| `Declaration` | both | Paths, revision read, source | File contents |
| `DecisionRef` | both | Choice path, commit, id, superseded-by | Confidence math |
| `PublicationHold` | in | Rule, failing check, head | The advisory queue |
| `RateSummary` | out, opt-in | Entity, window, redacted rate | Spans, labels, hostnames |
| `Presence` | both | Principal, plant, cursor, expiry | Authority of any kind |
| `EgressRecord` | local only | Destination, bytes, reason | Bodies, tokens |

[inferred] `EgressRecord` is not synced. It is the local proof that the other types left the machine. Q16 already requires it.

[sourced] Q16 requires an outbound log of destination, bytes, and reason, a hard offline switch, and a published data statement (`explore/map.md:230`).
[inferred] The seam writes that log itself. A plug that opens its own socket and skips the log is not an implementation of the seam.

### What stays open

[inferred] Open, in the desktop repo, with no feature flag and no call home:

- The seam interface and the null plug.
- The git remote implementation that talks to a Kvarm origin the user already runs.
- Membership stored as a file in the repository, so a self-hoster can read and edit it.
- Token handling that accepts an origin-issued token and stores it in the OS credential store.
- The egress log, the offline switch, and the data statement.
- Redaction of anything that could be shared.

[sourced] GitLab's own stewardship promise says the open source edition has no artificial limits, installs without an account, and keeps essential forge features open (https://handbook.gitlab.com/handbook/company/stewardship/).
[inferred] That is the bar. A self-hoster who runs a Kvarm origin and points Acan at it gets the whole shared world. They do not get a degraded client.

### What a hosted tier could charge for

[sourced] GitLab prices by who cares most. A feature aimed at an individual stays open. A feature a manager is more likely to buy can be paid (https://handbook.gitlab.com/handbook/company/stewardship/).
[sourced] The same page limits that promise to the codebase, and allows the hosted service its own usage limits (https://handbook.gitlab.com/handbook/company/stewardship/).
[inferred] Apply the split one level up. Kvarm is the open core of the server. Acan does not grow a second open core.

[inferred] A paid hosted Kvarm may charge for running the origin, for accounts, for backups, and for support. It may not charge for the protocol, for the seam, or for a feature the desktop needs in order to collaborate at all.

[inferred] Allowed paid conveniences, all replaceable by a self-hosted origin:

- Operating the origin so a team does not run Cloudflare itself.
- Account recovery and an admin console.
- A durable event export beyond what the open origin stores.

[inferred] Not allowed, because each one locks the open app to a vendor:

- A sync protocol that only the hosted service speaks.
- An identity that only the hosted service can mint.
- A telemetry inbox that the plant cannot draw without.
- A presence channel that is required for claims.

[sourced] Zed is the cautionary case. The editor is open, the collab server crate is public, and sign-in still gates the feature (https://zed.dev/docs/collaboration, https://github.com/zed-industries/zed/discussions/13503).
[inferred] Acan should not repeat that. Collaboration with your own origin is a core feature, not an account feature.

## Authority

[inferred] One fact has one owner. Sharing a fact does not move its owner.

| Fact | Owner | Why |
|---|---|---|
| Claim, lease, generation | Kvarm | It already rejects a competing live claim and a stale generation. |
| Publication, branch rules | Kvarm | It already blocks a protected ref. |
| Readback match | Acan | Kvarm stores no readback. The verdict is local. |
| `CLAIMED` | Both, joined | Neither fact alone is enough. |
| Blueprint head | Git, through Kvarm | The file is the truth. The origin publishes the head. |
| Budget and check definitions | A human, through K16 | Agents must not grade themselves. |
| Advisory hold | The local user | It informs. It never withholds a task. |
| Presence, cursors, view state | Nobody | Last write wins, and expiry deletes it. |
| Annotations on the plant | The choice file, if published | A free note is not a decision. |

[sourced] Kvarm's `claim_task` rejects a competing live claim and rejects a stale-generation heartbeat or completion (`explore/research/agentic-ux/h-kvarm.md:34`).
[sourced] A lease is not mutual exclusion. A paused holder can still send a late write after the lease expires, and only a fencing token checked at the resource stops it (https://system-design.space/en/chapter/distributed-locks-leases-fencing/).
[inferred] Kvarm's generation is that fencing token. Acan must send it with every lease renewal and every completion, and must treat `STALE_GENERATION` as a dead claim. Building a second lock in Acan would throw this away and reintroduce the bug the generation already closes.

[inferred] Reuse, do not wrap. An Acan "world lock" that calls `claim_task` underneath is a second lock with a friendlier name. Agents that talk to Kvarm directly would skip it. The world draws the Kvarm lease, and Acan adds the readback verdict beside it.

[sourced] Figma's server is the authority for document state, and it orders property writes so two clients do not need a timestamp (https://www.figma.com/blog/how-figmas-multiplayer-technology-works/).
[inferred] That pattern fits presence and annotations. It does not fit a lease. Figma can accept last-writer-wins on a color. Acan cannot accept last-writer-wins on who holds an order.

## Identity and permissions

[sourced] A human owns an agent principal and mints a repository-scoped token with an expiry, a role, and a ref restriction (`explore/research/agentic-ux/h-kvarm.md:198`).
[sourced] Read-agent and write-agent tokens do not receive the `ci` scope (`explore/research/agentic-ux/h-kvarm.md:200`).
[sourced] Jazz checks permissions server-side per row, denies anything not granted, and treats a local permission check as advice rather than enforcement (https://jazz.tools/docs/auth/permissions).
[inferred] Copy the Jazz rule. The client may hide a button. The origin decides.

### Minimum viable model

[inferred] Four facts, all stored where Kvarm already stores access.

1. A world has members. A member is a human principal on the repository.
2. An agent is not a member. An agent acts under a human, with that human's minted token.
3. The token's role is the permission. Observe reads. Build writes workspace refs, claims, and intents. Neither writes a protected ref, and neither holds `ci`.
4. The origin checks the token on every write. A stale cache of "Alice is a member" is not a grant.

[inferred] Roles for v1 are read and write. A third "design" role is an Acan allowlist on top of a read token, not a new server role. Adding server roles couples the desktop to the Kvarm rewrite.

[sourced] K2 names solo developers and tech leads of small teams as the users (`explore/map.md:27`).
[inferred] The minimum model is enough for that team. Groups, per-plant grants, and outside reviewers can wait until a real team asks. Liveblocks' three-level grant is the shape to copy later, not the thing to build now (https://liveblocks.io/docs/guides/managing-rooms-users-permissions).

### What an agent may do

[inferred] An agent may claim an order, set an intent, and push a workspace branch, using its own token. It may not mint a token, change a member, edit a budget, or satisfy a required check. Those stay with the human, and the check stays with the `ci` credential.

[sourced] Protected-branch approval counting excludes the change's recorded author (`explore/research/agentic-ux/h-kvarm.md:151`).
[inferred] A team makes this easier, not harder. A teammate can be the independent approver that a solo owner cannot be. The agent still cannot approve its own change.

## Telemetry

[sourced] The observed source is runtime telemetry, and the receiver binds to loopback only (`explore/map.md:53`, `explore/map.md:222`).
[sourced] Transcripts are plaintext and can contain a `.env` a tool read (`explore/map.md:210`).
[sourced] The Collector fans out by running several exporters on one pipeline, and each exporter gets a copy (https://opentelemetry.io/docs/collector/architecture/).
[inferred] Fan-out is the wrong default. The plant is drawn from spans that include queries, headers, and hostnames. One shared inbox would export every teammate's production traffic to every other desktop.

[inferred] Each client reads the telemetry of the systems it can already reach, on loopback or on a network the user already operates. The world agrees on blueprint, orders, and decisions. It does not agree on spans.

[inferred] The one thing worth sharing is a rate summary: entity, time window, and a redacted number. It is opt-in, it is a declared egress to the origin, and it is the only telemetry type that crosses the seam. A client that never opts in still draws its own plant.

[inferred] Cost follows from that split. N clients scraping one production endpoint is N times the load, and it is still cheaper and safer than copying spans. A team that wants one scraper runs a Collector they already trust, in their network, and points each desktop at it. That Collector is theirs. It is not an Acan service.

[sourced] A global `OTEL_EXPORTER_OTLP_ENDPOINT` would make every instrumented program report to Acan, so each agent is configured through its own setting (`explore/map.md:210`).
[inferred] The same rule applies to teammates. Acan never sets a shared endpoint for them. The data statement names the rate summary, and names nothing else.

## Security and honesty

[inferred] Declared egress grows by destination, not by a new rule. A byte to a teammate's origin is still a byte out. The pill counts it. The log names the origin, the operation, and the size. The offline switch blocks it, including the git subprocess.

[sourced] The hard offline switch blocks all egress, and the loopback OTLP and MCP listeners keep working (`explore/map.md:230`).
[inferred] Multiplayer must not punch a hole in that switch for "just presence". Presence is egress too.

### A malicious teammate

[inferred] A member with write can push a branch, open a change, and take a lease. They cannot change a protected ref without the required check, and they cannot mint a token for someone else. The damage is the damage a coworker with repository write already has. The world does not widen it.

[inferred] A member with read can see the blueprint, the orders, and the decisions. They cannot see another machine's spans unless that machine opted in to the rate summary, and the summary has no labels.

[sourced] Zed warns that sharing a project gives collaborators access to the local filesystem (https://zed.dev/docs/collaboration).
[inferred] Acan does not share a filesystem. A teammate sees git objects the origin already serves. They do not get a handle to the other person's disk, transcripts, or credential store.

### A compromised agent

[sourced] An agent holds its own expiring token, never the human credential (`explore/research/agentic-ux/h-kvarm.md:199`).
[inferred] A stolen agent token can do what that agent could do, until expiry, and no more. It cannot edit budgets, satisfy `ci`, or read another member's credential. Revocation is the human deleting the token at the origin. Acan shows the lease as unmatched the moment the readback no longer fits.

[inferred] The honest gap: Acan cannot stop an agent the user launched outside Acan. The data statement says so. A shared world does not change that.

### What the origin learns

[inferred] The origin learns the operations Acan already sends for one user, plus the member list and presence. It does not learn span bodies, prompt text, or transcript lines. If a future plug needs any of those, the data statement changes first and the default stays off.

## The Kvarm rewrite

[sourced] Kvarm is mid-rewrite, its API may change, and there is no launch date (`explore/ui-v2/PARKED.md:17`).
[inferred] The multiplayer path survives that if it depends on capabilities instead of routes.

[inferred] Five rules.

1. Talk to the origin through one adapter. The plant never calls a Kvarm route itself.
2. Pin the adapter to the capabilities this file uses: a git remote, a fenced claim, an intent, a decision record, a token with a role. Anything the rewrite adds is invisible until the adapter grows a typed method for it.
3. Keep the canonical copy in git files. An order, a choice, and a member list that live only in a vendor table vanish when the API changes. A file in `.acan/` does not.
4. Treat the hosted tier as one possible origin URL. Switching from self-hosted to hosted is a remote change, not a client change.
5. Ship the null plug first. Multiplayer that needs the rewrite to ship has already failed open core.

[inferred] If the rewrite slips, the desktop still draws a plant, still runs agents, and still talks to today's origin through the adapter. The shared world waits. Nothing in the open app has to be rewritten, because nothing in the open app named the new API.

## Asks for UX

These are decisions this architecture cannot make. Each one changes the plant, the copy, or the consent flow.

1. A stale shared fact needs a visible state. The architecture marks remote claims, permissions, and intents stale when the origin is unreachable. UX decides the mark, and whether a stale claim is visually closer to unmatched or to offline.
2. Presence must not read as authority. A teammate's cursor on a machine is not a claim and not a lock. UX decides whether cursors exist at all, and how a person tells a cursor from a bot that holds a lease.
3. The opt-in to a shared origin is a consent step, not a toggle buried in settings. UX writes the sentence that names the origin, the member list, and the rate summary before the first byte leaves.
4. Two people settling the same clash need a rule for who is asked. The architecture keeps the advisory gate local and per person. UX decides whether a settlement one person makes appears for the other as already settled, or as a decision waiting to be read.
5. A rate summary from a teammate is a different source than local telemetry. UX decides whether a shared number is drawn at all, and how it is labeled so it cannot be mistaken for a span this machine saw.
6. Disconnect is a first-class action. UX decides where the offline switch sits, and what the plant shows in the minute after it is pressed, while held writes are still unsent.
7. An unmatched lease held by a teammate's agent is a waiting item. UX decides whose queue it enters, and whether the human who owns that agent is named.

## Sources read

- `explore/ui-v2/PARKED.md`, `explore/ui-v2/CORE.md`, `explore/map.md`, `explore/research/agentic-ux/h-kvarm.md`, `explore/research/agentic-ux/00-synthesis.md`.
- Evan Wallace, "How Figma's multiplayer technology works" (https://www.figma.com/blog/how-figmas-multiplayer-technology-works/).
- Ink & Switch, "Local-first software: You own your data, in spite of the cloud" (https://www.inkandswitch.com/essay/local-first/).
- Replicache, "How Replicache Works" (https://doc.replicache.dev/concepts/how-it-works).
- Zed, "How CRDTs make multiplayer text editing part of Zed's DNA" (https://zed.dev/blog/crdts) and "Collaboration" (https://zed.dev/docs/collaboration).
- tldraw, "Collaboration" (https://tldraw.dev/sdk-features/collaboration).
- Liveblocks, authentication and room permissions (https://liveblocks.io/docs/guides/managing-rooms-users-permissions).
- Jazz, "Permissions" (https://jazz.tools/docs/auth/permissions).
- Electric, "Postgres Sync" (https://electric.ax/sync/postgres-sync).
- Automerge, "Concepts" (https://automerge.org/docs/reference/concepts/).
- Yjs, awareness and sync protocol (https://github.com/yjs/y-protocols/blob/master/PROTOCOL.md).
- GitLab Handbook, "Our stewardship of GitLab" (https://handbook.gitlab.com/handbook/company/stewardship/).
- OpenTelemetry, "Collector architecture" (https://opentelemetry.io/docs/collector/architecture/).
- "Distributed Locks: Leases and Fencing Tokens" (https://system-design.space/en/chapter/distributed-locks-leases-fencing/).

## Facts still unconfirmed

[inferred] No Kvarm checkout was found on this machine, so claims about Kvarm's current API cite `explore/research/agentic-ux/h-kvarm.md` rather than a fresh read of the source.
[inferred] This file does not confirm that a self-hosted Kvarm origin can run without Cloudflare. The earlier assessment says Artifacts is remote-only (`explore/research/agentic-ux/h-kvarm.md:184`).
[guess] A team of the size K2 describes will not outgrow a git remote plus a lease. A larger team may want partial replication. Nothing measured supports that guess.
