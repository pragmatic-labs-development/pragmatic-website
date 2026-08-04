---
name: pineapple
description: Dave's standing end-of-session ship checklist for pragmatic-website. Trigger whenever Dave says "pineapple" or "run pineapple" in this repo — push to GitHub Pages, check the deploy gate, update HANDOFF.md, hand back a next-session prompt.
---

# Pineapple — end-of-session ship checklist

Run all five steps below, in order, in the same turn. This is the
authoritative checklist — if `HANDOFF.md`'s "🍍 Pineapple" section ever
disagrees with this file, treat this file as correct and fix HANDOFF.md.

1. **Push all changes live.** Stage specific files (never blind
   `git add -A`), commit with a clear message, `git push origin main`.
   This repo has no PR/branch workflow — `main` is the only branch and
   pushing to it directly triggers deployment. If the working tree has
   unreviewed/uncertain changes, say so and confirm before pushing —
   the codeword authorizes the *workflow*, not a blind push of anything.

2. **Check the gate.** Pushing to `main` triggers the "Deploy to GitHub
   Pages" workflow (`.github/workflows/deploy.yml`). Watch it —
   `gh run list --branch main --limit 1` then `gh run watch <id>
   --exit-status` — and confirm it succeeds. If it fails, say so
   immediately; do not report the session as shipped.

3. **Surface remaining work.** State open items plainly — items already
   tracked in HANDOFF.md's "Open items" section, plus anything new from
   this session (uncommitted files, deferred scope, known issues).

4. **Rewrite `HANDOFF.md`** at the repo root to reflect what actually
   shipped this session, following its existing format. Keep the
   "🍍 Pineapple" section intact at the top.

5. **Output the next-session prompt in the chat reply itself.** Write the
   short copy-pasteable block into `HANDOFF.md`'s "Next-session prompt"
   section AND paste that exact block, as literal fenced text, in your
   visible chat response — the actual last thing you send, not "see
   HANDOFF.md" or a paraphrase. Saving it to the file only is not enough;
   Dave needs to copy it without opening anything.

   **Before ending the turn, check:** does the chat response you are
   about to send contain a fenced code block starting with "Working on
   /Users/dave/pragmatic-website"? If not, that's a bug — add it before
   finishing, don't finish and note it as an open item.

## Why this is a separate skill, not just HANDOFF.md prose

This exact step (5) was missed twice — 2026-08-02 area and again
2026-08-04 — because a prose instruction living only in HANDOFF.md and in
a memory file was too easy to satisfy halfway (updating the file, but
never actually pasting the block into the chat). Loading this skill
directly, with the explicit self-check, is the fix — it stops relying on
recalling a rule correctly and instead makes the deliverable's shape
checkable before the turn ends.
