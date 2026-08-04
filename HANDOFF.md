# Handoff — Production Deploy to get-pragmatic.com

Last updated: 2026-08-04
Base commit: 4c4ce01 (see `git log -1` to confirm)

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

**This session's production push already happened** — verified live:
`https://get-pragmatic.com/` now serves this repo's current `index.html`
(confirmed via title tag and a fresh `css/styles.css` timestamp).

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

No code changes to the site itself. This was entirely about production
infrastructure:

1. Discovered `get-pragmatic.com` was running a completely different,
   unrelated site (not this repo) on DreamHost — see "Production deploy"
   above for full detail.
2. Set up SSH key auth + enabled SSH access for the DreamHost SFTP user
   `dh_urv63i`, all via the DreamHost web panel (no credentials ever
   typed in chat).
3. Added `deploy-production.sh` to the repo.
4. Ran it for real — `get-pragmatic.com` now serves this repo's actual
   homepage for the first time.
5. Clarified with Dave that "pineapple" stays GitHub-Pages-only;
   production deploys remain a separate, explicitly-requested action.

## Open items / things to revisit

- **Showcase heading copy is still a placeholder** — Dave deferred
  polishing it in an earlier session; still not revisited.
- **No client feedback yet** on anything shipped, now including the first
  real production push.
- **`check.sh` is manual, not enforced** — no pre-push hook.
- **GitHub Actions Node.js 20 deprecation warning** in
  `.github/workflows/deploy.yml` — not urgent, still not addressed.
- **Orphaned files on production** (`Pragmatic-Logo.svg`, `favicon.ico`,
  `favicon.gif`) — harmless, not cleaned up, ask before deleting.
- **No CI automation for production deploys** — by design for now
  (Dave's choice this session). If that changes, it would need the
  deploy key added as a GitHub Actions secret — a bigger step than
  today's manual script.
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

Current state: this session made no code changes — it set up production deploy
infrastructure instead. get-pragmatic.com was discovered to be a completely separate,
outdated site on DreamHost, disconnected from this repo's GitHub Actions (which only ever
reached the GitHub Pages preview URL). Set up SSH key auth for the DreamHost SFTP user
(dh_urv63i @ iad1-shared-b8-43.dreamhost.com), enabled SSH access for that user, and added
deploy-production.sh to the repo. Ran it for real — get-pragmatic.com now serves this
repo's actual homepage for the first time, verified live. Pineapple stays GitHub-Pages-only
by Dave's choice; production pushes remain a separate explicit step via
./deploy-production.sh (dry-run flag available). Open: showcase heading copy still a
placeholder, no client feedback yet, check.sh still not enforced via a hook, Node 20
deprecation warning in deploy.yml still pending, three harmless orphaned legacy files
still sit on production (Pragmatic-Logo.svg/favicon.ico/favicon.gif — deploy-production.sh
deliberately never uses --delete so ask before removing them), and no CI automation exists
for production deploys (deliberate for now — would need the deploy key as a GitHub Actions
secret if that changes later).
```
