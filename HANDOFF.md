# Handoff — Old-Site Restyle (logo, colors, hero mockup)

Last updated: 2026-08-03
Base commit: f7cbb5e (see `git log -1` to confirm — this session's changes
are live as of this "pineapple" run)

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

**New this session**: there's now a `check.sh` — run it before pushing.
See "1. Added check.sh" below for what it does and its first-run setup
(installs `node_modules` + a Playwright Chromium build, ~270MB, one time).

## What changed this session

### 1. Added `check.sh` — pre-push sanity check

Resolves last session's top open item. `./check.sh` (repo root):

- Installs `node_modules`/Playwright Chromium on first run (gitignored,
  `npm install` + `playwright install chromium`).
- Starts a local `python3 -m http.server`, runs `scripts/check.mjs`, tears
  the server down after.
- **Tag-balance check** on `index.html` (stack-based scan, strips comments
  and script contents, accounts for void elements and self-closing tags).
- **Headless load check** at 1024px/768px/480px: fails on any browser
  console error or failed (4xx/5xx) network request.
- Saves full-page screenshots to `.check-screenshots/` (gitignored) at all
  three breakpoints for manual visual review.

**Found a real bug in the testing approach itself**, not the site: early
screenshots of the deliverables section came back blank. Root cause is the
site's scroll-reveal (`.reveal` → `.is-visible` via `IntersectionObserver`
in `js/main.js:29-58`) — it only fires as elements actually cross into the
viewport, so an instant jump-scroll screenshot races the observer and
captures the pre-fade-in state. This is almost certainly what was behind
prior sessions' "capture goes blank past ~4000px scroll depth" issue seen
during manual browser-automation verification. Not a site bug — real users
scrolling normally never hit it. Fixed in `check.mjs` by stepping down the
page in viewport-height increments (with short waits) before every
screenshot, which mirrors real scroll behavior and resolved it.

### 2. ≤480px verification of last session's two sections — done

Also resolves a last-session open item. With the check.sh scroll-reveal fix
in place, captured clean isolated crops of both sections at 480px:

- **Work carousel**: card stacks to a single column (content over visual),
  filter tabs + prev/next arrows stay on one row, no overflow.
- **Deliverables board**: tab control wraps to two rows of two (Product
  Management/Design, then Front End Engineering/Product Marketing),
  2-column post-it grid, all readable.

Nothing looked broken; responsive rules added last session hold up at true
small-phone width.

### 3. Pricing tier cards redesigned (Ongoing Support section, `#pricing`)

Dave's ask: lead with the headline instead of the hours figure, move hours
into a parenthetical, drop the per-card exact annual-dollar text, and add
something annual-related back in near the bottom. Also asked for tier
names in a follow-up ("Focus / Momentum / Scale / Embedded" — recommended
to reuse language already present in each card's own copy rather than
generic SaaS names like Basic/Pro/Premium, which Dave accepted as-is).

Per card, new top-to-bottom order: blue eyebrow tier name → headline
(now the largest/lead text) → `(N hours)` → divider → price → weekly
detail → long description → dedicated-hours checkmark → green annual note
("Ask about locking in for a year to save with annual billing.") at the
very bottom, replacing the old per-card "or $X/yr paid annually" line.

- New `.pricing__tier-name` class (blue, uppercase, small) for Focus /
  Momentum / Scale / Embedded.
- `.pricing__tier-desc` (the headline) bumped up to lead size
  (0.875rem → 1.0625rem) and given a `min-height` (4.05em, ~3 lines) on
  desktop/tablet so the divider/price/etc. line up across the 4-card grid
  regardless of how many lines each card's headline wraps to — reset to
  `min-height: 0` in the ≤768px single-column layout where cross-card
  alignment doesn't apply.
- `.pricing__tier-hours` restyled from an uppercase standalone label to a
  quiet parenthetical caption under the headline.
- `.pricing__tier-annual` (green) repurposed and repositioned: same class,
  moved to the bottom of the card, reworded to the generic annual-billing
  prompt (no dollar figures, since it's shared across all four tiers now).

Verified at desktop (4-across) and 480px mobile via isolated Playwright
screenshots; ran `check.sh` clean after.

## Open items / things to revisit

- **No client feedback yet** on anything shipped this session or prior
  sessions.
- **`check.sh` is manual, not enforced** — nothing currently stops a push
  without running it. Worth considering a git pre-push hook if it starts
  getting skipped, but not set up (Dave hasn't asked for this).
- The $460–620K figure (`.whynothire__badresult-note`) — appears in
  exactly one place in the live HTML; nothing to centralize unless Combos
  (permanently removed) or something like it comes back.

## Next-session prompt (copy/paste this in cold)

```
Working on /Users/dave/pragmatic-website (GitHub: pragmatic-labs-development/pragmatic-website).
Read HANDOFF.md at the repo root first, including the "Pineapple" section at the top —
that's a standing codeword: when I say "pineapple," push all changes live, check the
GitHub Pages deploy gate, tell me what's still open, update HANDOFF.md, and hand me a
fresh copy-paste prompt like this one for the session after that.

Current state: clean, pushed live (see `git log -1` for the exact commit), deploy gate
passed. This session added check.sh (a pre-push script covering HTML tag balance +
headless load/console/network checks + screenshots at the three breakpoints — run it
before pushing; first run installs Playwright, ~270MB one-time), verified both of last
session's new sections at ≤480px (clean), and redesigned the pricing/ongoing-support
tier cards: headline-first layout, hours as a parenthetical, tier names (Focus /
Momentum / Scale / Embedded), and the annual-pricing mention moved from a per-card
dollar figure to a generic prompt at the bottom of each card. No client feedback yet on
any of this session's or prior sessions' changes. check.sh is manual only — no hook
enforces it before push.
```
