# Handoff — Hero Copy Rework (Agency, Not a Builder)

Last updated: 2026-08-04
Base commit: a609c95 (see `git log -1` to confirm)

## 🍍 Pineapple — the end-of-session ship checklist

**"Pineapple" is a standing codeword, used session to session.** The full,
authoritative checklist lives in the `pineapple` project skill —
`.claude/skills/pineapple/SKILL.md` — not here. Read that file when Dave
says "pineapple." Summary, kept in sync with the skill:

1. Push all changes live (specific files, not blind `git add -A`) to
   `origin/main` — this repo has no PR/branch workflow, pushing to `main`
   deploys directly.
2. Check the gate — watch the "Deploy to GitHub Pages" Actions run and
   confirm it succeeds before calling the session shipped.
3. Surface remaining open work explicitly.
4. Rewrite this file to reflect what shipped.
5. **Paste the next-session prompt as literal text in the chat reply
   itself** — not just saved into this file. This exact step has been
   missed twice (2026-08-02, 2026-08-04) by treating "write it down" as
   sufficient; the skill file has a hard self-check for this now.

Pushing to a shared remote is still a real action — if a session ever has
unreviewed/uncertain changes when "pineapple" is called, flag that before
pushing rather than pushing blind just because the codeword was said.

**IMPORTANT — "pineapple" is GitHub Pages only, not production.** Pushing
to `main` only updates the preview URL
`https://pragmatic-labs-development.github.io/pragmatic-website/`. It does
**not** touch the real live site at `https://get-pragmatic.com/` — that's a
separate DreamHost-hosted server with no connection to this repo's CI.
Pushing to production is a deliberate, separate, explicitly-requested step
(`./deploy-production.sh`) — see below. Dave confirmed this session that
pineapple should **not** be expanded to auto-deploy to production; keep
asking each time production should be updated.

## Production deploy (get-pragmatic.com) — new as of this session

Until this session, "pineapple" pushes had only ever reached the GitHub
Pages preview URL. Dave asked to actually ship to the real production
domain, `https://get-pragmatic.com/`, for the first time. Investigation
found:

- `get-pragmatic.com` / `www.get-pragmatic.com` resolve to a **DreamHost**
  shared-hosting Apache server — totally disconnected from this repo's
  GitHub Actions. It was serving an old, unrelated HTML file (different
  title, inline `<style>`, no Device Showcase/Capabilities work) — not an
  old build of this repo.
- DreamHost site: `get-pragmatic.com`, plan "Shared Unlimited", server
  `iad1-shared-b8-43.dreamhost.com`, US-East (Ashburn).
- SFTP/shell user for this site: `dh_urv63i`, home `/home/dh_urv63i`, with
  the actual web docroot at `/home/dh_urv63i/get-pragmatic.com/`.
- That user's **Secure Shell Access (SSH) was off** by default (SFTP-only).
  Dave approved turning it on (via DreamHost panel → Websites → SFTP Users
  & Files → this user → toggle) so `rsync` over SSH would work instead of
  plain file-by-file SFTP upload.
- Set up **key-based auth** instead of password: generated a dedicated
  local keypair at `~/.ssh/id_ed25519_pragmatic_deploy` (no passphrase),
  and added the public half to `/home/dh_urv63i/.ssh/authorized_keys` via
  DreamHost's browser File Manager (so the account password was never
  typed anywhere, chat included). Verified with a direct `ssh` test before
  using it for anything real.

### `deploy-production.sh`

New script at the repo root. Run `./deploy-production.sh --dry-run` first
to preview, then `./deploy-production.sh` for the real push. It rsyncs
exactly the production files — `index.html css js assets robots.txt
sitemap.xml` — to `dh_urv63i@iad1-shared-b8-43.dreamhost.com:~/get-pragmatic.com/`
using the dedicated key. It deliberately does **not** pass `--delete`, so
it only adds/overwrites those files and never removes anything else
already on the server.

**Orphaned legacy files still on production, untouched by the deploy
script:** `Pragmatic-Logo.svg`, `favicon.ico`, `favicon.gif` — leftovers
from the old site, no longer referenced by the current `index.html` (which
uses `assets/favicon.svg`). Harmless clutter, not cleaned up — ask Dave
before deleting anything from production since `deploy-production.sh`
intentionally avoids `--delete`.

**That production push happened in a prior session** (infra-setup session,
base commit `4c4ce01`) — verified live at the time. **Production is now
stale**: this session changed the hero copy (see below) and pushed it to
GitHub Pages only, per the pineapple rule. `get-pragmatic.com` still serves
the pre-rewrite hero. Run `./deploy-production.sh --dry-run` then
`./deploy-production.sh` when Dave wants that pushed live — don't do it
unprompted.

## Where things stand

Preview locally with:

```
python3 -m http.server 8123
```

then open `http://localhost:8123/index.html`. A `.claude/skills/run/SKILL.md`
covers this same launch step for Claude Code sessions specifically.

**Browser caching gotcha**: `python3 -m http.server` sends no
`Cache-Control` header on `index.html` *or* `css/styles.css`, and Chrome
will serve fully stale copies of *both* across plain navigations/reloads.
`location.reload(true)` is not sufficient, and even a new query string
(`?v=2`) can still serve cached CSS via the `<link>` tag. Workaround:
disable the stale `<link rel="stylesheet">`, `fetch('/css/styles.css',
{cache: 'no-store'})`, and inject the result into an ad-hoc `<style>` tag.
Prefer trusting `check.sh`'s screenshots (fresh server process each run)
over live browser reloads when possible.

**Scroll-reveal gotcha**: elements use `.reveal` + `IntersectionObserver`
(`js/main.js:29-58`) to fade in as they cross the viewport. Programmatic/
instant scrolls (browser automation, jump-scrolling) race this and can
capture blank sections. `check.sh` already steps down the page in
viewport-height increments to avoid this.

Run `./check.sh` before pushing — covers tag-balance, headless
console/network checks, screenshots at three breakpoints.

## What changed this session

Client feedback: the site read like a Squarespace/Wix-type company (a
builder tool) rather than an agency you hire. Diagnosed the hero
(`index.html:100-104`) as the cause — the old headline "We build your web
app, mobile app, or marketing website" is output-framed, the same pattern
builder tools use, and never signaled "team you hire" or the design+code
duality. Reworked hero copy only (no visual/mockup changes, no other
sections touched):

- Eyebrow: `Design & Front-End Engineering` → `The Front-End Agency
  Experts`
- H1: `We build your web app, mobile app, or marketing website.` →
  `UX/UI Design & Front-End Coding.` — states the two core disciplines
  directly, as the biggest text on the page.
- Subtitle: reworked to lead with speed ("a working interface up within
  hours") and frame product management/marketing as secondary ("what we
  do most" vs. "there too, for the full product stack when you need it").

Went through a few iterations live with Dave (tried leading with a
hire-cost framing first, then swapped in the "Front-End Agency Experts" /
"UX/UI Design & Front-End Coding" pairing, then caught and fixed an
eyebrow/H1 content swap) — final copy is in `index.html:102-104`. Verified
at 1024/768/480px via `check.sh` screenshots before pushing. Pushed to
`main`, GitHub Pages deploy gate passed (run `30934515799`).

## Open items / things to revisit

- **Production (`get-pragmatic.com`) is now stale** — it still has the
  pre-rewrite hero copy from the prior session's production push. Run
  `./deploy-production.sh` when Dave wants the new hero live there too.
- **Showcase heading copy is still a placeholder** — Dave deferred
  polishing it in an earlier session; still not revisited.
- **No client feedback yet** on the new hero copy itself — this was a
  reaction to earlier feedback ("looks like Squarespace/Wix"), not yet
  re-validated with whoever gave that feedback.
- **Hero visual mockup untouched** — the abstract laptop/tablet/phone
  dashboard art was flagged as part of the "looks like a builder tool"
  impression but explicitly deferred (copy-only pass this session, per
  Dave's call). Worth a follow-up if the copy fix alone doesn't land.
- **"Our Work" section uses illustrative/placeholder-labeled examples**
  (`index.html:391-492`, tagged "Example · FinTech" etc. with generic
  phone mockups, not real client work) — noticed while reading the page
  for this task, not addressed. Could reinforce the same "template" vibe
  the hero fix targets; flagged, not requested yet.
- **`check.sh` is manual, not enforced** — no pre-push hook.
- **GitHub Actions Node.js 20 deprecation warning** in
  `.github/workflows/deploy.yml` — not urgent, still not addressed.
- **Orphaned files on production** (`Pragmatic-Logo.svg`, `favicon.ico`,
  `favicon.gif`) — harmless, not cleaned up, ask before deleting.
- **No CI automation for production deploys** — by design for now. If
  that changes, it would need the deploy key added as a GitHub Actions
  secret — a bigger step than today's manual script.
- **DreamHost production credentials**: SFTP/SSH details and the deploy
  key live in this HANDOFF and `deploy-production.sh`, not in git secrets
  or a password manager entry — worth formalizing later if this becomes a
  regular workflow.

## Next-session prompt (copy/paste this in cold)

```
Working on /Users/dave/pragmatic-website (GitHub: pragmatic-labs-development/pragmatic-website).
Read HANDOFF.md at the repo root first, including the "Pineapple" section at the top —
that's a standing codeword: when I say "pineapple," push all changes live to GitHub Pages
(NOT production), check the deploy gate, tell me what's still open, update HANDOFF.md, and
hand me a fresh copy-paste prompt like this one for the session after that.

Current state: this session reworked the hero section copy in response to client feedback
that the site looked like a Squarespace/Wix builder rather than an agency you hire. Changed
the eyebrow ("The Front-End Agency Experts"), H1 ("UX/UI Design & Front-End Coding."), and
subtitle (leads with "a working interface up within hours," frames design + front-end
coding as the main focus and PM/marketing as secondary) in index.html:102-104. No other
code changed — device mockup, CTAs, and all other sections untouched by design. Verified at
1024/768/480px via check.sh before pushing. Pushed to GitHub Pages (main), deploy gate
passed. Pineapple stays GitHub-Pages-only; production (get-pragmatic.com) is now stale
relative to this new hero copy — run ./deploy-production.sh when Dave wants it live there
(dry-run flag available). Open: no client feedback yet on the new copy itself, hero visual
mockup (abstract dashboard art) was flagged as part of the "looks like a builder" impression
but deliberately left untouched this pass, "Our Work" section uses illustrative/placeholder
examples that may reinforce the same template vibe (not addressed, just flagged), showcase
heading copy still a placeholder, check.sh still not enforced via a hook, Node 20 deprecation
warning in deploy.yml still pending, three harmless orphaned legacy files still sit on
production (Pragmatic-Logo.svg/favicon.ico/favicon.gif — deploy-production.sh deliberately
never uses --delete so ask before removing them), and no CI automation exists for production
deploys (deliberate for now — would need the deploy key as a GitHub Actions secret if that
changes later).
```
