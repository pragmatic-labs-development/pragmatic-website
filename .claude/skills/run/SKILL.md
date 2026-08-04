---
name: run
description: Launch pragmatic-website locally and view it in the browser. Static HTML site, no build step.
---

# Running pragmatic-website locally

This is a static site — a single `index.html` plus `css/` and `js/`. No build step, no framework.

## Launch

From the repo root:

```bash
(lsof -i :8080 -sTCP:LISTEN >/dev/null 2>&1 && echo "PORT 8080 IN USE") || \
  (nohup python3 -m http.server 8080 > /tmp/pragmatic-website-server.log 2>&1 & echo "started pid $!")
```

Verify it's serving:

```bash
curl -sI http://localhost:8080/index.html | head -5
```

## View it

Navigate Chrome (claude-in-chrome) to `http://localhost:8080/index.html`, then screenshot to confirm it rendered.

If the Chrome tools aren't loaded yet, load them first in one batched call:

```
ToolSearch: select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__tabs_create_mcp
```

## Stop the server

```bash
lsof -ti :8080 | xargs kill
```

## Notes

- `check.sh` in the repo root runs a Playwright-based pre-push sanity check (tag balance, headless load, screenshots) — separate from just viewing the site.
- No `npm run dev`/build needed; editing `index.html`/`css/`/`js/` and refreshing the browser is enough.
