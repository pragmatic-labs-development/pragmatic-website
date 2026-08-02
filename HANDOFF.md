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

### 1. Full visual restyle to match get-pragmatic.com (the older live site)

Dave pointed at a different, older "Pragmatic" site — `get-pragmatic.com`
(saved locally as `/Users/dave/Downloads/index (20).html`, a different
positioning: "Standardized Software Development & Design") — and asked to
carry over its **look and feel** onto this site's **existing content**
(fractional-team hero copy, capability cards, pricing/retainer tiers,
Low-Risk section, etc. all stayed as-is). Decisions confirmed in-session:
full brand-color swap (not hero-only), no other old-site sections ported,
device mockup stays generic/decorative (no real screenshots).

- **Logo**: replaced the plain-text "Pragmatic." wordmark with the old
  site's inline SVG wordmark + blue accent square, in both nav and footer
  (`.nav__logo` / `.footer__logo`).
- **Brand colors**: introduced a `:root` custom-properties token layer in
  `css/styles.css` (`--brand-blue: #3B82F6`, `--brand-blue-dark: #2563EB`,
  `--brand-violet: #8B5CF6`, `--ink`, `--text-secondary`, `--text-muted`,
  `--border`, `--bg-subtle`, `--bg-muted`) and swapped every occurrence of
  the old Atlassian-style navy palette (`#0052cc`, `#172b4d`, `#505f79`,
  `#dfe1e6`, etc.) sitewide, including inline SVG icon colors in
  `index.html`. Capability-card accent colors and shadow tints (navy →
  blue-tinted) moved to match.
- **Typography**: swapped DM Sans / unused DM Serif Display for Plus
  Jakarta Sans + Instrument Serif. Added a `.title-italic` utility, used
  once on "work" in the hero headline as a restrained serif accent.
- **Hero rebuilt as two-column layout** (`index.html` hero section,
  `css/styles.css` Hero block): gradient/glow-orb/dotted background, left
  column keeps the existing copy + CTAs, right column is a new animated
  device mockup (laptop + tablet + phone, `@keyframes float` /
  `floatReverse` / `floatSlow`) with a page-load stagger-entrance
  (`.animate-up` / `.delay-1..4`, CSS-only, separate from the existing
  scroll-triggered `.reveal` system used elsewhere).
- **Capability cards extracted** into their own `<section class="capabilities"
  id="capabilities">` right after the hero, since the two-column hero no
  longer has room for them inline.
- **Buttons and cards** updated to the old site's hover recipe: bigger
  radius, `translateY` lift + colored shadow on hover instead of a flat
  color-darken.
- Followed up per Dave's feedback: **removed the two floating stat badges**
  ("4 roles, 0 new hires" / "~27% of a full-time hire") from the hero
  mockup — kept just the laptop/tablet/phone float animation, no pills.

### 2. Commented out the "Built Around the Problem" combos section

Dave flagged it as confusing. Wrapped the whole `<section class="combos"
id="work">` block in an HTML comment in `index.html` (not deleted — easy to
restore). Repointed the two nav links that pointed at `#work` (header
"Work" link, footer "What We Do" link) to `#capabilities` so navigation
doesn't silently break with a dead anchor.

### 3. `bestfit` bar removed (earlier in session, also shipped)

The "4 roles. 0 new hires." bar directly below the hero was fully redundant
with the new hero's capability cards. Removed the section, its CSS
(`.bestfit*`), and the matching mobile breakpoint rules — pure deletion, no
replacement content.

## Open items / things to revisit

- **Port the old site's "device showcase" section** (segmented control —
  Web App / Mobile App / Marketing Website — that swaps between a large
  laptop mockup and a phone mockup). Dave asked for this but then
  interrupted with the combos-section removal request before it was built;
  explicitly deferred to next session ("let's do it in next session").
  Notes for picking this up: old site source is `.grey-section` in
  `/Users/dave/Downloads/index (20).html` (HTML ~line 2192, CSS ~line
  726). It has **no responsive handling at all** in the old site (fixed
  900px-wide laptop, nothing in its `@media` blocks) — this repo's version
  will need its own mobile/tablet scaling added (same `transform: scale()`
  approach already used for the hero mockup). Recommend porting the
  interaction as pure CSS (`:checked ~` sibling selectors) rather than the
  old site's JS toggle — no need to touch `js/main.js`.
- **Combos section is commented out, not resolved.** Either bring it back
  reworked, replace it with something else, or remove it for good — "confusing"
  was the only feedback given, no direction yet on what (if anything)
  should replace it.
- No client feedback yet on any of this — the restyle, the hero rebuild,
  and the combos removal were all built from direct chat instructions this
  session, not yet reviewed by the client.
- Retest at ~1140px (desktop container), ~900px (tablet breakpoint), and
  ~390px (mobile) if more changes land near the hero or capabilities
  sections — confirmed working at all three this session after the restyle,
  including the new two-column hero collapsing to one column with a scaled
  mockup.

## Other ideas worth considering (not done, just flagged)

- **Move the illustrative comparison numbers to one place** — the
  `js/main.js` config object pattern used for the Low-Risk section (single
  object, IDs written into by JS) worked well and is easy to update. Worth
  reusing that pattern anywhere else on the page that has numbers repeated
  in multiple spots (e.g. the $460–620K figure appears in three places
  across the equation section and combos/lowrisk copy — note the combos
  section is currently commented out, so re-evaluate this once that's
  resolved).
- **A pre-push checklist as an actual script** — a tiny `check.sh` that runs
  the tag-balance sanity check and a headless screenshot pass at the three
  breakpoints, so "pineapple" doesn't rely on manually driving a browser
  every time.

## Next-session prompt (copy/paste this in cold)

```
Working on /Users/dave/pragmatic-website (GitHub: pragmatic-labs-development/pragmatic-website).
Read HANDOFF.md at the repo root first, including the "Pineapple" section at the top —
that's a standing codeword: when I say "pineapple," push all changes live, check the
GitHub Pages deploy gate, tell me what's still open, update HANDOFF.md, and hand me a
fresh copy-paste prompt like this one for the session after that.

Current state: clean, pushed live (see `git log -1` for the exact commit),
deploy gate passed. Top of the
open-items list: port the old site's device-showcase section (segmented control that
swaps between a laptop/phone mockup — see HANDOFF.md "Open items" for exact source
location and notes on why it needs new responsive CSS). Also unresolved: the "Built
Around the Problem" combos section is commented out (not deleted) pending a decision on
whether to rework it, replace it, or cut it for good. No client feedback yet on any of
this session's or the prior session's changes.
```
