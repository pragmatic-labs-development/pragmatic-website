# Handoff — Pricing Section Rework

Last updated: 2026-08-01
Latest commit: `e6d81b0` on `main` (pushed, working tree clean)

## Where things stand

All work described below is committed and pushed to `origin/main`. No local
uncommitted changes, no open branches.

Preview locally with:

```
python3 -m http.server 8123
```

then open `http://localhost:8123/index.html`. Jump to the pricing section
via the "Pricing" nav link or `#pricing`; "Why not just hire?" sits earlier
on the page, right after the "How it starts" steps.

## What changed this session

### 1. Start with a Sprint (`.pricing__hero*` in index.html / styles.css)

Rebuilt from a plain two-column card into a "hero" layout: left-aligned
title + subtitle, three icon value badges (low-risk / clear scope / retainer
teaser), a featured blue-bordered card ($1,999, "Best way to start" badge,
"View retainer pricing" link), and 5 role cards in one row (added a
"Flexible Mix" option) that stretch to match the featured card's height.
Each role card has a color-coded top accent and a bottom "Available in
every sprint" footer (mirrors the retainer tier checkmark pattern) so the
stretched height doesn't read as empty space.

**Pricing is intentionally $1,999 for up to 10 hours, not 20.** The retainer
is a flat $150/hr at every tier ($3,000/20h, $6,000/40h, etc.). A two-week
sprint prorates to ~10 hours at that rate for $1,500 — $1,999 sits above
that on purpose, so the sprint reads as a premium, low-commitment option
rather than a discount. Don't "round up" the hours without also raising the
price, or the premium framing breaks.

### 2. Monthly Retainers (`.pricing__retainer*`)

This block was already functional before this session's redesign work (pill
selector + tier cards, JS-synced) — this session only added copy: each tier
card now shows a weekly-hour equivalent ("Approximately 5 hours per week")
and a "what it feels like" tagline + supporting sentence, e.g.:

- 20h → "One focused work block each week"
- 40h → "More than a full working day each week" (10 hrs/week is *more*
  than an 8-hour day — don't revert to "about one full working day," that
  undersells it)
- 80h → "A part-time specialist or blended team" (not "half-time" — reads
  as a sports idiom to the client)
- 160h → "Full-time capacity without the full-time hire"

### 3. Why Not Just Hire (`.whynothire*`)

Reframed as a literal equation: 4 role cards joined by "+", an "=", into a
muted red/gray "Hiring all four" box reading **"Half a million dollars"**
(exact range $460–620K/yr as supporting text) — deliberately styled to look
unappealing. Below that, a "BY THE WAY" divider pivots into the existing
full-width blue "Pragmatic" result box ($3,000/mo, badge, checklist, CTA),
which the client has explicitly approved and called "brilliant" — don't
restyle that box without re-confirming.

## Open items / things to revisit

- No outstanding client feedback as of the last message in this session.
- If further pricing-section changes come in, keep testing at ~1140px
  (desktop container width), ~900px (tablet breakpoint), and ~390px
  (mobile) — several rounds of feedback in this session were about content
  wrapping oddly at the actual container width vs. how it looked in
  reference mockups (which were designed at a much wider viewport).
- Browser caching gotcha while testing locally: `python3 -m http.server`
  serves `js/main.js` and `css/styles.css` with normal HTTP caching, so a
  plain reload can silently serve a stale script/stylesheet after an edit.
  Force a fresh fetch (`fetch(url, {cache: 'reload'})` for each asset, or a
  true hard-refresh) before trusting what you see when verifying JS-driven
  interactions.
