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

### 1. Combos section removed for good

Last session's open item — "confusing, revisit later" — got resolved this
session: Dave chose to cut it outright rather than rework or replace it.
Removed the commented-out `<section class="combos" id="work">` block from
`index.html`, its full CSS block (`.combos*` rules, including the
`prefers-reduced-motion` override), and the two stale `.combos__grid`
references left in the 1024px/768px responsive blocks. Nothing else
referenced `.combos` anywhere (confirmed via grep across html/css/js), so
this was a clean removal with no follow-on breakage.

### 2. "Work Across Industries" — converted to a horizontal carousel

Dave wanted the case-studies section to scroll horizontally instead of
stacking vertically, starting with Mobile Banking App on the left and
Healthcare peeking off the right edge. Recommended and built **CSS
scroll-snap** over an auto-advancing carousel (native momentum scroll,
no timers/pause-on-hover complexity, works with only 3 cards) — Dave
confirmed this approach before implementation.

- `.work__list` is now `display: flex; overflow-x: auto; scroll-snap-type:
  x mandatory` (scrollbar hidden cross-browser) instead of a vertical
  stack; `.work__card` is a fixed-width flex item (`width: min(760px,
  82vw)`, `scroll-snap-align: start`) instead of full-width.
- Added round prev/next arrow buttons (`.work__nav-btn`) next to the
  existing All/Mobile/Web filter tabs, wrapped together in a new
  `.work__controls` row. JS (`js/main.js`) scrolls by one card width per
  click, disables arrows at the scroll extremes, and resets scroll
  position to the start whenever the category filter changes.
- Existing filter script untouched apart from the scroll-reset addition —
  hidden cards (`[hidden]`) are simply removed from flex layout, so
  filtering and the carousel compose for free.
- Added responsive width/stacking rules for `.work__card` at the 1024px,
  768px, and 480px breakpoints (none existed before); card internals
  (content + visual) stack to a single column at ≤480px.

### 3. "Everything we deliver" — rebuilt as a tabbed deliverable board

Full redesign from a flat 24-item sticky-note grid to a tabbed board
matching reference designs Dave supplied, with one category active at a
time (Product Management / Design / Front End Engineering / Product
Marketing), a torn-washi-tape category label ("Plan the product" / "Design
the experience" / "Build the product" / "Tell the story"), and a 4-across
(then 3) grid of icon + label post-it cards per category.

**Icon style went through an explicit comparison round.** Reference images
used a hand-drawn/sketchy doodle aesthetic that doesn't match the rest of
the site's clean thin-line (feather-style) icons. Built Product Management
first in the true hand-drawn style (SVG `feTurbulence`/`feDisplacementMap`
wobble filter + Kalam handwriting font for card titles) as a "match
reference exactly" option, then built Design in the site's existing clean
icon language as a side-by-side comparison. **Dave chose clean over
hand-drawn** — all four tabs now use clean-line SVG icons (24×24 viewBox,
1.5 stroke, no filter), consistent with Capabilities/Pricing icons
elsewhere on the page. The Kalam handwriting font and torn-tape label
styling were kept (that part of the reference design stuck); only the icon
rendering changed. The wobble-filter machinery was fully removed after the
comparison (no dead CSS/SVG left behind).

- New Google Font: Kalam (400/700), used for `.deliverables__tape` and
  `.deliverables__postit-label` only.
- Tab switching reuses the same radio-input + CSS `:has()` pattern as the
  device showcase section (`.deliverables__control` / `.deliverables__panel`).
- Some icons are intentionally reused across categories where the
  underlying deliverable is the same thing (Internal tools/wrench in both
  PM and FE; Component systems in both Design and FE; Logos & identity in
  both Design and Marketing) — matches how the reference content repeats
  these too, not a bug.
- Old `.postit`/`.deliverables__grid` (24-item flat grid) CSS fully
  replaced, not left alongside the new styles.

## Open items / things to revisit

- **A pre-push `check.sh` script** — a tiny script that runs a tag-balance
  sanity check and a headless screenshot pass at the three breakpoints, so
  "pineapple" doesn't rely on manually driving a browser every time. Not
  started. Worth noting: browser-based screenshot verification in this
  environment hits a window-size floor around 750–800px CSS width and a
  capture-goes-blank issue past ~4000px scroll depth (worked around this
  session by temporarily hiding other sections before screenshotting the
  deliverables section, same trick used last session for the Low-Risk
  section) — a `check.sh` using a real headless tool (e.g. Playwright)
  would likely sidestep both.
- **Narrow-viewport (≤480px) verification of this session's new sections**
  — the Work carousel and the deliverables tab control both got responsive
  CSS rules added (card widths, tab wrapping, 2-column icon grid) but
  weren't pixel-verified at true small-phone widths, for the same tooling
  floor reason as above. The rules follow patterns already proven
  elsewhere on the page, but flag this if something looks off on a real
  phone.
- **The $460–620K figure** (`.whynothire__badresult-note`) — appears in
  exactly one place in the live HTML; nothing to centralize unless Combos
  (now permanently removed) or something like it comes back.
- No client feedback yet on anything shipped this session or prior
  sessions.

## Next-session prompt (copy/paste this in cold)

```
Working on /Users/dave/pragmatic-website (GitHub: pragmatic-labs-development/pragmatic-website).
Read HANDOFF.md at the repo root first, including the "Pineapple" section at the top —
that's a standing codeword: when I say "pineapple," push all changes live, check the
GitHub Pages deploy gate, tell me what's still open, update HANDOFF.md, and hand me a
fresh copy-paste prompt like this one for the session after that.

Current state: clean, pushed live (see `git log -1` for the exact commit), deploy gate
passed. This session permanently removed the commented-out Combos section, converted
"Work Across Industries" into a horizontal scroll-snap carousel with prev/next arrows,
and rebuilt "Everything we deliver" as a tabbed post-it board (Product Management /
Design / Front End Engineering / Product Marketing) with clean-line icons matching the
rest of the site (a hand-drawn icon style was prototyped and explicitly rejected in
favor of this). Top of the open-items list: a pre-push check.sh script (still not
started) and narrow-viewport (≤480px) verification of this session's two new/reworked
sections, which is blocked by the same browser-automation window-size floor noted in
prior sessions. No client feedback yet on any of this session's or prior sessions'
changes.
```
