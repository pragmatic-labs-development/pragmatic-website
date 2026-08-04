# Handoff — Showcase Heading + Capabilities Hierarchy Fix

Last updated: 2026-08-04
Base commit: 4bca9e6 (see `git log -1` to confirm — this session's changes
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

then open `http://localhost:8123/index.html`. A `.claude/skills/run/SKILL.md`
now exists in this repo covering this same launch step for Claude Code
sessions specifically.

**Browser caching gotcha (sharper than previously noted)**: `python3 -m
http.server` sends no `Cache-Control` header on `index.html` *or*
`css/styles.css`, and Chrome will serve fully stale copies of *both* across
plain navigations/reloads — not just `js/main.js`. This bit hard this
session: `location.reload(true)` was not sufficient, and even navigating to
a URL with a new query string (`?v=2`) reloaded fresh HTML but still served
cached CSS via the `<link>` tag. What actually worked: disable the stale
`<link rel="stylesheet">`, `fetch('/css/styles.css', {cache: 'no-store'})`,
and inject the result into an ad-hoc `<style>` tag. When spot-checking
manually, prefer trusting `check.sh`'s screenshots (fresh server process
each run) over live browser reloads, or use the fetch/inject trick above if
you need to eyeball something interactively.

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

Two focused fixes to the homepage, both prompted by Dave looking at a live
screenshot and flagging what felt off — not a messaging brief this time.

### 1. Device Showcase section had no heading

The Web App / Mobile App / Marketing Website toggle section (`#showcase`)
had zero heading copy — straight from the capability cards into the tab
control. Added:

- `<h2 class="showcase__title">` — "The frontend firepower most teams
  don't have."
- `<p class="showcase__subtitle">` — "We build web apps, mobile apps, and
  marketing sites — bringing the design and product thinking your team
  doesn't have time to hire for."

Landed on this after Dave rejected three earlier drafts as too generic and
gave a longer brief on positioning: the site should read fast as "we build
frontend — web/mobile/marketing — and supplement teams that lack
frontend/PM/design horsepower, studio-style mastery across disciplines
without big-agency bespoke pricing." Three copy options were drafted
against that brief; Dave picked the "capability gap" framing (option B)
over a "team-in-a-box" framing and a "studio positioning" framing.

Note: the site already has exactly one `<h1>` (hero section). Deliberately
used `<h2>`/`<h3>` here, not `<h1>`/`<h2>` as literally first requested —
flagged the SEO/one-h1-per-page issue and Dave agreed to the substitution.

**Still explicitly unpolished** — Dave said "good enough for now, we'll
polish it later." Don't treat this copy as final if revisiting.

### 2. Capabilities section hierarchy was stated only in text, not structure

Previously: four visually-identical cards (UX/UI Design, Front-End
Engineering, Product Management, Product Marketing) followed by a caption
sentence — *"Design and front-end engineering are the core of every
engagement — product management and marketing support are there when you
need them."* Dave flagged this as awkward: the caption tries to establish
a hierarchy the four-equal-cards layout doesn't support visually, so a
reader has to read the sentence to learn what the cards themselves don't
show.

Ran a three-option design critique (asymmetric sizing / structural
grouping+divider / muted-color demotion) and recommended structural
grouping. Implemented:

- `.capability-card` markup unchanged; wrapped into two
  `.capabilities__group` containers — `--core` (UX/UI Design, Front-End
  Engineering) and `--support` (Product Management, Product Marketing) —
  each with an eyebrow `.capabilities__group-label` ("Always Included" /
  "Available When You Need It").
- `.capabilities__divider` — vertical rule between groups at desktop,
  becomes a horizontal rule at ≤1024px when groups stack.
- Old `.capabilities__grid` (4-col grid) replaced by `.capabilities__groups`
  (flex, row→column at 1024px) + `.capabilities__group-cards` (2-col grid,
  →1-col at ≤768px). Verified all three `check.sh` breakpoints (1024/768/
  480) render as intended — see `.check-screenshots/`.
- Removed `.capabilities__unify` (the old caption) — copy and CSS both
  deleted, not just hidden.

### 3. Added a project run skill

`.claude/skills/run/SKILL.md` — this is a static site with no build step;
the skill documents the `python3 -m http.server` launch + Chrome-view
pattern so future Claude Code sessions don't rediscover it. (Prompted by
Dave noting the first browser-view of this session felt slower than
expected — most of that was one-time Chrome-tool loading + server startup,
not something this skill file changes, but it saves the rediscovery cost.)

### Explicitly left untouched

- Everything outside the Device Showcase heading and Capabilities section
  — hero, pricing, FAQ, deliverables, About, footer, etc. all untouched
  from prior session's state.
- Nav labels, pricing structure/numbers, visual design/colors/logo.

## Open items / things to revisit

- **Showcase heading copy is a placeholder, not final** — Dave explicitly
  deferred polishing it. Revisit before treating as settled.
- **No client feedback yet** on anything shipped this session or prior
  sessions.
- **`check.sh` is manual, not enforced** — nothing currently stops a push
  without running it. Worth considering a git pre-push hook if it starts
  getting skipped, but not set up (Dave hasn't asked for this).
- **GitHub Actions Node.js 20 deprecation warning** — this session's deploy
  run succeeded but printed an annotation: `actions/checkout@v4`,
  `actions/configure-pages@v5`, `actions/deploy-pages@v4`,
  `actions/upload-artifact@v4` in `.github/workflows/deploy.yml` target
  Node 20, which GitHub is deprecating on Actions runners. Not urgent (still
  works, forced onto Node 24 automatically for now) but will eventually
  need an actions version bump.
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
passed. This session made two homepage fixes: (1) added a heading (h2/h3, not h1 — site
already has one h1 in the hero) to the previously-headingless Device Showcase section,
copy explicitly marked as a placeholder Dave wants to polish later; (2) restructured the
Capabilities section's four cards into two labeled/divided groups ("Always Included" vs
"Available When You Need It") to fix a hierarchy-only-stated-in-a-caption problem Dave
flagged from a screenshot — verified at all three check.sh breakpoints. Also added
.claude/skills/run/SKILL.md documenting the static-site local-preview pattern. Open:
showcase heading copy needs a polish pass, no client feedback yet on anything shipped,
check.sh still has no pre-push hook enforcing it, and this session's deploy run flagged
a Node.js 20 deprecation warning in .github/workflows/deploy.yml (not urgent, GitHub is
auto-forcing Node 24 for now). Also: this repo's static file server (python3 -m
http.server) sends no Cache-Control headers, so Chrome can serve fully stale HTML *and*
CSS across reloads — see the caching-gotcha note under "Where things stand" for the
fetch/inject workaround if live-previewing in a browser session.
```
