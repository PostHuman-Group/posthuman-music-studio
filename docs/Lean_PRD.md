# PostHuman Music: Studio — Stream Module PRD

### TL;DR

The Stream Module is the operational backbone of the PostHuman Music: Studio superagent, empowering Gen to go from a single prompt to a live 24/7 YouTube stream with zero manual RTMP or config work. It unifies four critical sub-modules: the **FFmpeg-on-GCP-e2-micro Broadcast Engine** (with OBS as silent fallback), an AI-native Stream Designer & Metadata Engine (Gemini-powered, algorithm-optimized metadata with Nano Banana 2-generated thumbnail), a calendar-based Bridge Scheduler for instant or recurring go-live, and a real-time Analytics Dashboard & Stream Control Hub embedded in ChatStudio. This is Module 1, setting the foundation for the entire PostHuman Music: Studio stack.

---

## Goals

### Business Goals

* Deliver a fully operational 24/7 YouTube livestream capability from a single prompt in under 15 minutes.
* Achieve **£0.00/month recurring infrastructure cost** using FFmpeg on Google Cloud's always-free e2-micro instance as the broadcast layer.
* Establish the Stream Module as the proven backbone before adding further superagent modules.
* Eliminate all manual stream configuration post-initial infra setup—no future stream keys, RTMP config, or YouTube Studio form entry.
* Build a multi-platform-ready architecture from day one (YouTube first; Twitch, Instagram, TikTok, Spotify slated for future phases).
* Maintain £0.00/month infrastructure cost until AdSense revenue is sufficient to cover essential operational costs (insurance and equivalents) first — infrastructure upgrades are a lower priority than bootstrapping core business costs.
* Accelerate infrastructure upgrade timelines by diversifying revenue (music asset licensing, sample pack sales, Bosrithek AI consulting tie-ins).

### User Goals

* Initiate a stream in ChatStudio with a single prompt—having the agent handle all planning, scheduling, metadata, and the go-live process automatically.
* Choose from AI-generated stream scenes or pre-set templates via ChatStudio—no manual layering or configuration.
* Instantly receive copy-paste-ready, algorithm-optimized metadata and an AI-generated thumbnail in ChatStudio—no need for YouTube Studio entry.
* Schedule one-off or recurring streams visually and trust the system to go live automatically without user intervention.
* Monitor, kill, restart, or adjust a live stream—all from within ChatStudio.

### Non-Goals

* Multi-platform streaming (Twitch, Instagram, TikTok, Spotify) is not included in the MVP (but architecture is future-ready).
* Music production and visual asset generation are out of scope (handled by other modules; this module only consumes pre-generated outputs).
* No public-facing or multi-user system—single-user, internal-only for launch.

---

## User Stories

**Persona:** Gen (Solo Operator and Founder at PostHuman Group)

* As Gen, I want to type a stream concept into ChatStudio and have the agent surface a stream plan, metadata, and scene options, so I can approve and move to go-live without touching any config.
* As Gen, I want the Broadcast Engine to handle all RTMP push to YouTube automatically via FFmpeg, so I never deal with stream keys, ingest URLs, or broadcast configuration manually.
* As Gen, I want to receive copy-paste-ready, AI-generated metadata (title, description, tags, category) and a thumbnail in ChatStudio, so I never fill out YouTube Studio forms by hand.
* As Gen, I want to schedule one-off or recurring streams on a calendar interface in ChatStudio, so streams fire automatically without any live intervention.
* As Gen, I want real-time stream health, concurrent viewers, watch hours, and monetisation progress to appear within ChatStudio, so I never need to open YouTube Studio.
* As Gen, I want to send a chat command in ChatStudio to kill, restart, or adjust a live stream, so I can intervene instantly without context switching.
* As Gen, I want OBS to be used only as a silent, automatic fallback if the FFmpeg process fails, ensuring the stream continues with no manual intervention.

---

## Functional Requirements

* **Broadcast Engine (Priority: P0)**
  * FFmpeg on Google Cloud e2-micro (1 vCPU / 1GB RAM, always-free tier) as the broadcast layer—zero licensing, zero recurring cost.
  * FFmpeg composites audio and video assets and pushes the stream directly to YouTube's RTMP ingest endpoint. No broadcast server required.
  * Single stream at a time—e2-micro cannot support concurrent streams at broadcast quality; acceptable for MVP scope.
  * Target output resolution: 720p as the stable default; 1080p to be stress-tested in Phase 4.
  * Clean Feed management—FFmpeg receives composited audio+visual assets from Module 3 (Visual & Creative) and Module 2 (Music Production) as inputs.
  * OBS integrated as silent emergency fallback—activates automatically if the FFmpeg process fails; never surfaced to Gen.
  * Gen never handles stream keys or ingest URLs—all RTMP configuration handled internally.

* **AI-Native Stream Designer & Metadata Engine (Priority: P0)**
  * Gemini AI-powered generation of metadata: titles, descriptions, tags, categories, settings optimized for YouTube algorithm.
  * Nano Banana 2 for thumbnail generation.
  * Default category set as "Science & Technology," with "Music" selectively applied.
  * All metadata and thumbnails surfaced in ChatStudio as copy-paste-ready or auto-applied—zero YouTube Studio interaction.
  * AI analyses stream content to auto-assemble scene layouts, overlays, widgets, color palette, and visual assets.
  * Gen picks from AI-generated or template scenes—no manual layers.
  * **“Establish Uplink” single-action trigger:** initialises the FFmpeg composited feed and begins RTMP push to YouTube.

* **Bridge Scheduler (Priority: P0)**
  * Visual calendar-based scheduling within ChatStudio for one-off or recurring streams.
  * Automated triggers: stream launches at scheduled time with no Gen live intervention required.
  * Stage 1 (setup/arming) and Stage 2 (broadcast) are fully automated after plan approval.
  * Real-time tracking of all active and scheduled streams.
  * Multi-platform-ready database design (implementation for YouTube only at MVP).

* **Analytics Dashboard & Stream Control Hub (Priority: P1)**
  * Real-time health monitoring for video, audio, feed status, and platform connections internal to ChatStudio.
  * Chat-based Stream Control Hub—Gen uses chat commands to kill, restart, adjust stream, or modify scenes and settings live.
  * Live visual/audio-reactive asset controls surfaced in ChatStudio.
  * Aggregated YouTube Analytics showing watch time, concurrent viewers, subscribers, and monetisation progression.
  * Engagement analytics (retention, optimal timings, peak viewers).
  * Read-only for MVP—no analytics write-back to YouTube.

---

## User Experience

**Entry Point & First-Time User Experience**

* Gen launches ChatStudio and types a stream concept prompt (e.g. “dark ambient drone, 12 hours, Friday midnight”).
* System runs a brief onboarding if first time, explaining core actions (prompting, approving, scheduling).

**Core Experience**

* **Step 1:** Gen submits a stream prompt in ChatStudio.
  * Agent responds with clarifying questions (genre, length, vibe, constraints).
  * Minimal clicks—conversation-driven, with clear chat UI flows.
* **Step 2:** Agent surfaces a stream plan with metadata, timing, and scene options for approval.
  * Gen reviews, requests edits, or approves.
  * Success = plan locked in, proceeds to setup.
* **Step 3:** On approval, AI generates algorithm-optimized title, description, tags, and a fresh thumbnail.
  * 2–3 AI-composed scene options appear for Gen to pick or default.
  * All assets surface in a clear, copy-paste or auto-apply format.
* **Step 4:** Gen schedules stream via drag-and-drop calendar in ChatStudio (or takes AI-suggested timing).
  * Calendar is visual with clear color-coding (armed, live, complete, failed).
* **Step 5:** At scheduled go-live, **FFmpeg initialises the composited feed and pushes to YouTube via RTMP automatically**. Gen receives confirmation in ChatStudio.
* **Step 6:** During broadcast, Gen can live-check stream health, analytics, and monetisation numbers within ChatStudio’s dashboard.
* **Step 7:** Gen sends chat commands (e.g., “kill stream”, “restart”, “switch scene”) for live intervention.
  * Commands execute instantly, feedback appears in chat log.

**Advanced Features & Edge Cases**

* If the **FFmpeg process fails**, **OBS silent fallback fires instantly**—Gen is notified but no manual action required.
* For streams exceeding 12 hours, agent prompts to refresh metadata/thumbnail for better algorithm reach.
* Recurring streams auto-suggest prior configurations, prompting Gen for quick adjust/confirm.
* All user feedback, errors, and system statuses surface directly in ChatStudio—never in disparate tools.

**UI/UX Highlights**

* Cyberpunk/glassmorphic look and feel; British English throughout.
* All interface elements reside within ChatStudio—no window or context switching.
* Visual scheduler offers drag-and-drop simplicity; strong color contrasts for status types.
* **“Establish Uplink” is a bold, single-action button with confirmation modal to avoid accidents.**
* All commands, analytics, and feed health visualizations consolidate on a single, adaptive dashboard.

---

## Narrative

Gen is a solo founder running PostHuman Music: a 24/7 AI music livestream channel on YouTube. Previously, a single stream launch required wrangling OBS, wrestling with YouTube Studio, copying obscure stream keys, scouring forums for metadata tips, and cobbling together thumbnails in separate tools. The process was fragmented, manual, and hours-long—streamlining was impossible.

With the PostHuman Music: Studio Stream Module, Gen’s workflow is revolutionized. Gen now types a seed idea (“dark ambient drone, 12 hours, Friday midnight”) into ChatStudio. The agent asks three targeted questions, assembles a professional-grade stream plan, generates algorithm-optimized metadata and a striking thumbnail, and suggests AI-assembled scene designs. On Gen’s approval, a drag-and-drop calendar enables true set-and-forget scheduling. At the chosen time, the system takes the baton, launching the stream seamlessly to YouTube—no RTMP configs, no key management, no midnight panic.

Most importantly, Gen remains in control: monitoring health, adjusting creative or technical elements, and even killing or restarting streams—all from the ChatStudio chat interface. No context switching. No manual interventions. The result? PostHuman Music is always live, on schedule, and tracking toward the 4,000 watch hours and 1,000 subscribers mark required for monetisation—unlocking real revenue and validating the broader superagent vision. The stream module is not just infrastructure—it’s proof that PostHuman Music: Studio’s fully automated, AI-driven ethos is viable.

---

## Success Metrics

### Tracking Plan

* `stream_plan_initiated` (stream concept submitted)
* `stream_plan_approved` (plan locked and approved)
* `metadata_generated` (AI output for title/description/tags/thumbnail)
* `scene_selected` (user picks stream scene)
* `stream_scheduled` (calendar entry made)
* `stream_armed` (setup staged for go-live)
* `broadcast_started` (FFmpeg RTMP push to YouTube begins)
* `broadcast_ended` (stream concluded)
* `fallback_triggered` (OBS silent failover event)
* `kill_stream_command` (kill/restart command issued and executed)
* `analytics_viewed` (dashboard accessed)
* `monetisation_milestone_reached` (notifications at 4,000 hrs or 1,000 subs)

---

## Technical Considerations

### Technical Needs

* **FFmpeg on Google Cloud e2-micro (always-free, 1 vCPU / 1GB RAM)** — composites audio and video assets and pushes directly to YouTube RTMP ingest. No broadcast server required.
* OBS as silent fallback at the infra layer—never surfaced in the UI.
* Gemini API for metadata/tags/category/title generation.
* Nano Banana 2 for real-time thumbnail imagery.
* YouTube Live Streaming API for scheduling and analytics.
* React (ChatStudio frontend); Neon/Postgres + Drizzle ORM for metadata, schedule, and state storage; S3-compatible storage for feeds and thumbnails.

### Integration Points

* YouTube Live Streaming API (stream creation, status, scheduling, analytics)
* Gemini API (metadata generation)
* Nano Banana 2 (thumbnail generation)
* Internal: ChatStudio/Superagent Core; Module 2 (Music Production) and Module 3 (Visual/Creative) for ingest feeds; Module 6 (Asset Vault)

### Data Storage & Privacy

* All schedule and stream state data in Neon/Postgres.
* Thumbnails and clean feed recordings in S3-compatible storage buckets.
* YouTube API tokens securely stored—never exposed in frontend.
* Only Gen’s internal credentials/PII present; single-user system.

### Scalability & Performance

* MVP supports a single YouTube channel and user.
* Hosting must remain at £0.00/month until the channel generates sufficient AdSense revenue to cover essential operational costs (insurance and equivalents) first, and only then infrastructure upgrades.
* **Google Cloud e2-micro (always-free, permanent — no trial expiry) is the designated MVP host.** Oracle Cloud Always Free was evaluated and ruled out: the $300 credit trial expires after 30 days and switches to PAYG with no hard spend cap. Railway, Render, and Fly.io are also ruled out (Railway caps at $5/month credit, Render spins down on inactivity, Fly.io free tier deprecated). e2-micro handles single-stream broadcasts of 12–60 hours continuously. **720p is the stable target resolution; 1080p to be validated under sustained load in Phase 4.**
* API-first and modular—future multi-platform support requires no core refactoring.

### Potential Challenges

* **GCP e2-micro RAM constraint (1GB) under sustained 12–60 hour FFmpeg encode**—stress test in Phase 4 before committing to 1080p; 720p is the safe fallback.
* If e2-micro proves insufficient under real broadcast conditions, the first paid fallback is **Hetzner’s lowest-tier VPS (\~€4/month)**, deferred until revenue justifies it.
* YouTube API quota ceilings—implement cache and throttle analytics queries.
* OBS fallback must be seamless and silent; allow for robust failover handling.
* Ongoing updates needed for Gemini-powered metadata to remain YouTube algorithm-aware.

---

## Milestones & Sequencing

### Project Estimate

* **Medium:** 2–4 weeks from kick-off to stable backbone.

### Team Size & Composition

* **Extra-Small:** 1 person (Gen, solo coder/operator).
* Covers product ownership, engineering, design, and deployment.

### Suggested Phases

**Phase 1 — Broadcast Engine & Infra (Week 1)**
* Key Deliverables: **GCP e2-micro provisioned; FFmpeg broadcast pipeline operational; RTMP push to YouTube confirmed end-to-end; YouTube API connection live; OBS fallback integrated silently; silent test stream verified at 720p over a minimum 1-hour window.**
* Dependencies: YouTube API credentials; infra/cloud environment.

**Phase 2 — Stream Designer, Metadata Engine & Scheduler (Week 2)**
* Key Deliverables: Gemini metadata output; Nano Banana 2 integration; scene assembly UI; Bridge Scheduler calendar operational; auto go-live firing confirmed.
* Dependencies: Phase 1 completion; Gemini API key; Nano Banana 2 access.

**Phase 3 — Analytics Dashboard & Control Hub + Full E2E Test (Week 3)**
* Key Deliverables: Real-time stream health and analytics in ChatStudio; monetisation tracker; live chat-based control commands; E2E (prompt → go-live → monitor → intervene) test run.
* Dependencies: Phase 2 complete; YouTube Analytics API access.

**Phase 4 — Hardening & Handoff (Week 4)**
* Key Deliverables: **720p vs 1080p sustained load test on e2-micro over 12+ hours—output a clear resolution recommendation before sign-off;** OBS fallback test; infra/YouTube quota optimisation; Dev sign-off for consumption by future modules.
* Dependencies: Full feature battery coverage; all critical errors resolved.

---

## Future Infrastructure Roadmap

* (1) **Hetzner lowest-tier VPS (\~€4/month)** — first paid compute upgrade, unlocks higher sustained stream quality and concurrent stream capability, to be adopted only once AdSense revenue covers all essential operational costs.
* (2) **Multi-platform streaming** (Twitch, Instagram, TikTok, Spotify) — architecture is already designed for this, implementation follows after revenue validation.
* **Revenue diversification** (music asset licensing, sample pack sales, Bosrithek AI consulting tie-ins) will be pursued in parallel to further bootstrap infrastructure as needed.

**No mention or future use of OvenMediaEngine or OvenLiveKit.** The only broadcast stack now and going forward is FFmpeg-on-GCP-e2-micro with OBS as the silent fallback.
