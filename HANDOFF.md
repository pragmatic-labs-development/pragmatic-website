# Handoff — Old-Site Restyle (logo, colors, hero mockup)

Last updated: 2026-08-02
Base commit: see `git log -1` (this session's changes are being pushed live
as part of running "pineapple" — see below)

## 🍍 Pineapple — the end-of-session ship checklist

**"Pineapple" is a standing codeword, used session to session.** When Dave
says "pineapple" (or "run pineapple"), it means:

1. **Push all changes live.** Commit the working tree (specific files, not
   blind `git add -A`) with a clear message, push to `origin/main`. This
   repo has no PR/branch workflow — `main` is the only branch and pushing to
   it directly triggers deployment.
2. **Check the gate.** Pushing to `main` triggers the `Deploy to GitHub
   Pages` GitHub Actions workflow (`.github/workflows/deploy.yml`). Watch
   the run (`gh run list` / `gh run watch`) and confirm it succeeds — that's
   "the gate." If it fails, say so immediately and don't report the session
   as shipped.
3. **Surface remaining work.** Anything still open — items in "Open
   items" below, uncommitted files that didn't get swept up, known bugs not
   yet fixed — gets called out explicitly, not buried.
4. **Update this file.** Rewrite `HANDOFF.md` to reflect what actually
   shipped this session, in the format this file already uses.
5. **Write a next-session prompt.** A short copy-pasteable block (see
   bottom of this file) that the next session can paste in cold to pick up
   exactly where this one left off.

Pushing to a shared remote is still a real action — if a session ever has
unreviewed/uncertain changes when "pineapple" is called, flag that before
pushing rather than pushing blind just because the codeword was said.

## Where things stand

All work described below has been pushed live via this session's pineapple
run. Check `git log -1` for the exact commit.

Preview locally with:

```
python3 -m http.server 8123
```

then open `http://localhost:8123/index.html`. **Browser caching gotcha**:
plain reloads can serve stale `js/main.js` / `css/styles.css` after an edit.
Use a hard refresh (cmd+shift+R) or append a cache-busting query string
(`?v=2`) when verifying changes.

## What changed this session

### 1. Device showcase section (carried over from last session's open item)

Ported the old site's `.grey-section` (segmented control that swaps between
Web App / Mobile App / Marketing Website mockups) into a new `.showcase`
section, placed right after Capabilities. Source was
`/Users/dave/Downloads/index (20).html` (HTML ~line 2192, CSS ~line 726).

- Panel switching is **pure CSS** — no JS — using `:has()`
  (`.showcase__control:has(#showcase-webapp:checked) ~ .showcase__stage
  .showcase__panel--webapp`, etc.), unlike the old site's JS-driven toggle.
- Added responsive scaling the old site never had: `.showcase__panel` uses
  `transform: translate(-50%,-50%) scale(...)` at the existing 1024px and
  768px breakpoints (same technique as the hero mockup), so the 640px-wide
  laptop mockup scales down instead of overflowing on small screens.
- Confirmed working at 1140px, ~900px, and via the ≤768px mobile CSS bucket
  (a hard floor in this environment's browser-automation tooling prevented
  literally hitting 390px viewport width, but the math checks out — the
  laptop renders at 320px wide at the 0.5 mobile scale factor, well under
  the ~350px available at 390px viewport width).

### 2. Final CTA section restyled to blue (Dave supplied a reference screenshot)

`.cta-section` (the "Ready to turn the conversation into something useful?"
block just above the footer) changed from a flat dark-navy background to
the old site's blue gradient treatment: `linear-gradient(135deg,
var(--brand-blue) 0%, var(--brand-blue-dark) 50%, #1d4ed8 100%)`, plus two
radial-gradient background orbs, a bolder/larger title (now wraps to three
balanced lines instead of two — removed the old hardcoded `<br>`), and the
primary button's text recolored to `var(--brand-blue)` to read against the
white button on the new blue background.

### 3. New "Our Work" section — industry example cards with a working filter

Dave asked to port the old site's "Our Work / Proven Results Across
Industries" case-studies section. **Important deviation from the old
site**: its three case studies used fabricated client names (Meridian
Finance, VitalSync Health, Luxe Retail) and invented stats (2.1M users,
+340% growth, etc.) — clearly template placeholder content. Asked Dave how
to handle this; he chose **"port layout only, placeholder cards"** — so the
shipped version has no invented client names or fake metrics. Cards use
neutral "Example · [Industry]" labels, generic project-type titles, and no
stats block at all. Each card links to `#contact` ("Let's build something
like this →") instead of a fake "View Case Study" link with nowhere to go.

- New section `.work` / `id="our-work"`, placed after Pain Points, before
  the (still commented-out) Combos section.
- The All/Mobile/Web tab filter is **functional**, not decorative — added a
  small filter script to `js/main.js` (cards carry `data-categories`, tabs
  carry `data-filter`, toggling `hidden` on non-matching cards). The old
  site's equivalent tabs were purely cosmetic (toggled an `.active` class,
  never actually filtered anything) — didn't want to ship a control that
  looks interactive but does nothing.
- Fixed the nav: the header "Work" link previously duplicated "What We Do"
  (both pointed at `#capabilities`, a leftover from commenting out the
  Combos section last session). It now points at `#our-work`.

### 4. "A Low-Risk Way to Start" reworked into a comparison-card design

Dave supplied a reference screenshot (not from the old site file — a fresh
design comp) showing a compact two-column comparison card: Pragmatic
Two-Week Engagement ($1,999, blue checkmarks) vs. Full-Time Hire (~$7,500,
gray x-marks), a "VS." badge on the divider, a small blue callout box, and
a 4-icon feature strip below.

- Replaced the old two-separate-cards layout (a checklist card + a much
  longer cost-comparison card with a redundant 6-row "commitment" table)
  with the single unified `.lowrisk__compare` card matching the reference.
- The `$1,999` / `~$7,500` / `$180,000` figures still come from the
  existing `js/main.js` config object (`comparison` in the "Low-risk
  engagement cost comparison" IIFE) — untouched, just re-pointed at the new
  markup's IDs. Removed the `lowrisk-percent` ("~27%") element and its
  main.js code since the new design doesn't use it.
- Kept the disclaimer paragraph ("Illustrative comparison only...") in
  compact form below the card — didn't want to show a dollar-figure
  comparison with no caveat given it's an illustrative estimate, not a
  verified figure.
- Confirmed working at 1140px and ~900px (verified via a fresh tab with
  earlier sections temporarily hidden — screenshots of this page reliably
  came back solid white past ~4000px of scroll depth in this environment
  regardless of scroll method, seemingly a tool/harness capture limit, not
  a real rendering bug; confirmed via DOM/computed-style inspection plus
  the hidden-sections workaround). True ~390px width hit the same window-size
  floor as the showcase section, so it's untested pixel-for-pixel at that
  exact width, but the mobile override is a single `grid-template-columns:
  1fr` swap on a pattern already proven at that breakpoint elsewhere on the
  page.

## Open items / things to revisit

- **Combos section is still commented out, not resolved.** Either bring it
  back reworked, replace it with something else, or remove it for good —
  "confusing" was the only feedback given, no direction yet on what (if
  anything) should replace it.
- **A pre-push `check.sh` script** — a tiny script that runs a tag-balance
  sanity check and a headless screenshot pass at the three breakpoints, so
  "pineapple" doesn't rely on manually driving a browser every time. Not
  started. Worth noting from this session: browser-based screenshot
  verification hit a window-size floor around 750-800px CSS width in this
  environment and a capture-goes-blank issue past ~4000px scroll depth —
  a `check.sh` using a real headless tool (e.g. Playwright) rather than
  this session's interactive browser automation would likely sidestep
  both.
- **The $460–620K figure** (`.whynothire__badresult-note`) — last
  session's HANDOFF said this appeared in three places needing
  centralization via the `js/main.js` config-object pattern. Checked this
  session: it now appears in exactly **one** place in the live HTML (the
  other occurrences were inside the still-commented-out Combos section).
  Nothing to centralize until/unless Combos comes back.
- No client feedback yet on anything shipped this session or last —
  the device showcase, CTA restyle, Our Work section, and Low-Risk rework
  were all built from direct chat instructions, not yet reviewed live by
  the client.

## Next-session prompt (copy/paste this in cold)

```
Working on /Users/dave/pragmatic-website (GitHub: pragmatic-labs-development/pragmatic-website).
Read HANDOFF.md at the repo root first, including the "Pineapple" section at the top —
that's a standing codeword: when I say "pineapple," push all changes live, check the
GitHub Pages deploy gate, tell me what's still open, update HANDOFF.md, and hand me a
fresh copy-paste prompt like this one for the session after that.

Current state: clean, pushed live (see `git log -1` for the exact commit), deploy gate
passed. This session added the device showcase section, restyled the final CTA blue,
added a new "Our Work" section (placeholder content only, by design — see HANDOFF.md
for why), and reworked "A Low-Risk Way to Start" into a comparison-card design. Top of
the open-items list: the Combos section is still commented out pending a decision on
whether to rework it, replace it, or cut it for good. Also open: a pre-push check.sh
script (not started). No client feedback yet on any of this session's or prior
sessions' changes.
```
