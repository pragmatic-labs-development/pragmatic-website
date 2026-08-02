# Handoff — Hero Rebuild + Low-Risk Engagement Section

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

### 1. Hero rebuilt around the four capabilities (`.hero__*`, `.capability-card*`)

Replaced the old headline+trust-badges hero with a three-layer structure:
eyebrow ("Fractional Product Team") + headline ("Build the right team around
the work.") + subtitle + two CTAs, then four capability cards (Product
Management / UX-UI Design / Product Marketing / Front-End Engineering) inline
in the hero itself, then a unifying line ("One flexible team. Built around
what you need now."). Cards use accent colors blue/green/purple/orange per
capability, reusing icons already established elsewhere on the site (open
book for PM, pen for design, chat bubble for marketing, code brackets for
front-end) rather than inventing new iconography.

Primary CTA → `#pricing`. Secondary CTA → `#retainer-tiers`.

**Note:** the `bestfit` section directly below the hero ("4 roles. 0 new
hires." + role tags) now reads as fairly redundant with the hero — the hero
already shows all four roles in much more detail immediately above it. Left
untouched since it wasn't part of the brief, but worth revisiting.

### 2. "What We Make" replaced with "Built Around the Problem" (`.combos*`, still `id="work"`)

The old 4-card `.whatwemake` section duplicated the new hero cards almost
exactly, so it's gone. Replaced with a combos section showing how
capabilities pair up: Product Discovery (PM+Design), A New Customer
Experience (Design+FE), A Launch (PM+Marketing), An End-to-End Initiative
(all four) — each shown as small role-icon chips joined by "+". Kept the
`id="work"` anchor since nav links to it twice ("What We Do" and "Work").

### 3. New "Low-Risk Way to Start" section (`.lowrisk*`)

Inserted between the combos section and "How It Starts". Three-column layout
(`0.9fr 1.15fr 1fr`): intro/CTA column, engagement-checklist card with a pale
green callout, and a cost-comparison card (~$7,500 fully-loaded two-week
hire cost vs. $1,999 Pragmatic engagement, ~27%, plus a
commitment-comparison table and disclaimer). Closes with "Hire when the role
is clear. Start with Pragmatic when the work can't wait."

The three dollar figures ($180,000 annual, $7,500 two-week, $1,999
engagement, and the derived 27%) are **not hardcoded in the HTML** — they're
set by a small config object in `js/main.js` (last IIFE in the file) that
writes into `#lowrisk-annual-cost`, `#lowrisk-twoweek-cost`,
`#lowrisk-engagement-price`, `#lowrisk-percent`. Update the numbers there,
not in the markup.

Mobile: cards stack in order (intro → checklist → cost → repeated CTA
button, `.lowrisk__cta-repeat`, hidden above 768px).

### 4. Sprint pricing box now leads with $1,999, mentions $3,000/mo and $30,000/yr as follow-on

The full-width blue "whole product side, handled" result box (still the
approved/"brilliant" box — only the copy changed, not the styling) now shows
**$1,999/sprint** as the big number, with "Like it? Continue for $3,000/mo —
or $30,000/yr paid annually" underneath. Previously this box led with
$3,000/mo.

**New pricing concept introduced this session: annual prepay = pay 10
months, get 12** (a ~16.7% discount). Applied consistently to all four
retainer tiers as a new `.pricing__tier-annual` line under each monthly
price:
- 20h: $3,000/mo → $30,000/yr
- 40h: $6,000/mo → $60,000/yr
- 80h: $12,000/mo → $120,000/yr
- 160h: $24,000/mo → $240,000/yr

Also referenced briefly in the FAQ ("Minimum engagement is $3,000/month, or
pay annually and save"). This is a real pricing-policy decision (confirmed
with the client rep in-session), not just copy — if the "pay 10, get 12"
math ever changes, all four tiers plus the blue box plus the FAQ line need
to move together.

### 5. Why Not Just Hire subtitle de-duplicated

Old subtitle repeated the same "$400–600K/year" figure that also appears
in the red "Half a million dollars" box right below it. Changed to "Four
full-time product roles means four salaries, four benefits packages, and
months of recruiting before anyone starts." — same "expensive" point,
no duplicate number.

### 6. Bug fix: `<br>` + mobile `display:none` collapses text together

Found and fixed three places where a `<br>` inside a heading gets
`display:none` on mobile (to let the heading flow as one line), but the
source HTML had no space before the word after the `<br>` — so hiding it
mashed the words together (e.g. "team" + "around" → "teamaround"). Fixed by
adding a literal space after the `<br>` in the source for: `.hero__title`,
`.lowrisk__title`, and the pre-existing `.cta-section__title` (this last one
was a latent bug from before this session, unrelated to today's hero work,
just found while auditing). **If you add a new `<br>` to any heading that
gets hidden on mobile, check this same trap.**

## Open items / things to revisit

- `bestfit` section redundancy with the new hero (see note above) — not
  fixed, flagged for a future session.
- No client feedback yet on the new Low-Risk section or the $1,999-first /
  annual-pricing changes — this was all built from direct chat instructions
  this session, not yet reviewed by the client.
- Retest at ~1140px (desktop container), ~900px (tablet breakpoint), and
  ~390px (mobile) if more changes land nearby — confirmed working at all
  three this session, including the new `.lowrisk__grid` (3-col →
  intro-full-width+2-col → 1-col stack) and `.hero__capabilities` /
  `.combos__grid` (4-col → 2-col → 1-col) responsive rules.

## Other ideas worth considering (not done, just flagged)

- **Resolve the bestfit redundancy** — either cut that section or repurpose
  it now that the hero carries the "4 roles" message.
- **A pre-push checklist as an actual script** — a tiny `check.sh` that runs
  the tag-balance sanity check and a headless screenshot pass at the three
  breakpoints, so "pineapple" doesn't rely on manually driving a browser
  every time.
- **Move the illustrative comparison numbers to one place** — the
  `js/main.js` config object pattern used for the Low-Risk section (single
  object, IDs written into by JS) worked well and is easy to update. Worth
  reusing that pattern anywhere else on the page that has numbers repeated
  in multiple spots (e.g. the $460–620K figure appears in three places
  across the equation section and combos/lowrisk copy).
- **Client review is the real open loop** — most of what shipped this
  session (Low-Risk section, $1,999-first pricing, annual billing) came
  from direct instructions in chat, not client-approved copy the way the
  blue result box was. Get eyes on it before treating any of this pricing
  language as final.

## Next-session prompt (copy/paste this in cold)

```
Working on /Users/dave/pragmatic-website (GitHub: pragmatic-labs-development/pragmatic-website).
Read HANDOFF.md at the repo root first, including the "Pineapple" section at the top —
that's a standing codeword: when I say "pineapple," push all changes live, check the
GitHub Pages deploy gate, tell me what's still open, update HANDOFF.md, and hand me a
fresh copy-paste prompt like this one for the session after that.

Current state: [fill in — e.g. "clean, no open feedback" or "client sent feedback on
the Low-Risk section, see below"]
```
