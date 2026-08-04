#!/usr/bin/env bash
# Pushes the live site files to production (get-pragmatic.com, hosted on DreamHost).
# This is separate from the GitHub Pages deploy triggered by pushing to `main` —
# that only updates the pragmatic-labs-development.github.io preview URL.
#
# Requires: SSH key at ~/.ssh/id_ed25519_pragmatic_deploy, authorized on the
# DreamHost SFTP user dh_urv63i (see HANDOFF.md for how that was set up).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

DRY_RUN_FLAG=""
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN_FLAG="-n"
  echo "Dry run — no files will actually be transferred."
fi

rsync -avz $DRY_RUN_FLAG --exclude='.DS_Store' \
  -e "ssh -i $HOME/.ssh/id_ed25519_pragmatic_deploy" \
  index.html css js assets robots.txt sitemap.xml \
  dh_urv63i@iad1-shared-b8-43.dreamhost.com:~/get-pragmatic.com/

echo "Done. Verify at https://get-pragmatic.com/"
