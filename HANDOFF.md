# Handoff — Homepage Repositioning (design/front-end-first messaging)

Last updated: 2026-08-03
Base commit: 547683a (see `git log -1` to confirm — this session's changes
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

**Scroll-reveal gotcha (still relevant)**: elements use `.reveal` +
`IntersectionObserver` (`js/main.js:29-58`) to fade in as they cross the
viewport. Programmatic/instant scrolls (browser automation, jump-scrolling)
race this and can capture blank sections. `check.sh` already steps down the
page in viewport-height increments to avoid this — when spot-checking
manually in a live browser session, scroll incrementally and wait ~500ms-1s
before screenshotting, or just trust `check.sh`'s screenshots.

Run `./check.sh` before pushing — see prior session's entry for what it
covers (tag-balance, headless console/network checks, screenshots at three
breakpoints).

## What changed this session

Dave got a messaging brief arguing the homepage should lead with one
concrete promise instead of "fractional product team," with product
management, research, and marketing as supporting capabilities rather than
co-equal pillars. After discussion, scope was deliberately narrowed twice:

- **No rebrand.** "Pragmatic" stays the brand — logo, colors, visual
  design, nav, all untouched.
- **No structural/pricing change.** Two-Week Sprint ($1,999) and the
  Focus/Momentum/Scale/Embedded retainer tiers (redesigned two sessions
  ago) are untouched — copy and DOM element order only.

Dave's framing of the core wedge (broader than pure "UI design"): **we
build your web app, mobile app, or marketing website** — interface
delivery is the lead promise; product management, research, product
marketing, and things like slide decks become secondary, framed as
available à la carte rather than pitched up front (Dave's own analogy: a
restaurant menu — a few prominent "combos" up top, à la carte items like
slide decks are "combo #24," not competing for attention).

### Sections changed (all in `index.html`, copy + element order only)

1. **Hero** — new eyebrow/headline/subhead leading with "We build your web
   app, mobile app, or marketing website" (deliberately echoes the existing
   Device Showcase toggle's own three labels — that section didn't need to
   change, it was already aligned).
2. **Capabilities** (4 cards) — reordered so UX/UI Design + Front-End
   Engineering lead, Product Management + Product Marketing follow. Closing
   line reworded.
3. **Two-Week Sprint role cards** (pricing section) — same reorder
   (Designer/Front-End Engineer first).
4. **Deliverables tabs** — reordered (Design, Front End Engineering,
   Product Management, Product Marketing), Design is now the default tab.
   Added a new à la carte line naming investor/sales decks explicitly.
5. **"Sound familiar?" pain points** — reordered so the interface/design
   complaint leads; reworded the "can't afford a PM, designer, and
   front-end dev" quote to drop PM from that specific pain (now just
   designer + front-end).
6. **"Why not just hire?" equation** — reordered the four role cards
   (Designer, Front-End Engineer first) — math/total ($460–620K) untouched,
   order doesn't affect the sum.
7. **FAQ** — reworked one Q&A to explicitly state most clients start with
   just design/front-end, PM/marketing added later only if needed.
8. **About** paragraph — reworded to lead with build/interface.
9. **Footer tagline** — reworded to match.

### A copy-tone catch worth remembering

First pass at the Capabilities closing line and About paragraph used
phrasing like *"Mostly design and front-end engineering — with X support
when Y."* Dave flagged this as reading like an internal admission rather
than customer-facing copy ("we can't say the quiet part out loud"). Fixed
by restating the same hierarchy as a confident positioning choice — e.g.
*"Design and front-end engineering are the core of every engagement —
product management and marketing support are there when you need them."*
Watch for this "mostly... with... when" hedging pattern in future copy
passes; the fix is to assert the hierarchy, not apologize for it.

### Explicitly left untouched

- Nav labels, pricing structure/numbers, visual design/colors/logo.
- **Work carousel** — already aligned (shows finished web/mobile product
  work, no PM/marketing framing to demote).
- The $460–620K math itself in "Why not just hire?" — only card order
  changed.

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
passed. This session repositioned the homepage messaging per Dave's brief: design and
front-end engineering are now the clear lead offering ("we build your web app, mobile
app, or marketing website"), with product management, marketing, and things like slide
decks framed as available add-ons rather than co-equal pillars. This was copy and
element-reordering only — no rebrand (still "Pragmatic," same logo/colors/visual
design) and no pricing/structural changes (Two-Week Sprint + Focus/Momentum/Scale/
Embedded tiers untouched). Sections touched: hero, capabilities, sprint role cards,
deliverables tabs (new default tab + new à la carte line), pain points, why-not-hire
equation (reorder only, math unchanged), one FAQ answer, about paragraph, footer
tagline. Watch for hedging phrasing like "mostly X — with Y when Z" in future copy;
Dave flagged it as reading like an internal admission rather than customer-facing
copy — state the hierarchy confidently instead. No client feedback yet on any of this
or prior sessions' changes. check.sh is manual only — no hook enforces it before push.
```
