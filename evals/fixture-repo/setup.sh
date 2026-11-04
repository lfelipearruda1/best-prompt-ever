#!/usr/bin/env bash
# Copies the fixture app into the current directory and gives it a git history
# with branch and commit conventions for the skill to discover.
set -eu
cp -R "$(dirname "$0")/app/." .
g() { git -c user.name=Fixture -c user.email=fixture@example.com "$@"; }
git init -q -b main
g add migrations package.json .nvmrc AGENTS.md .env.example
g commit -q -m "chore(ORD-1): bootstrap shop-admin"
g add src/server src/legacy
g commit -q -m "feat(ORD-7): orders API with CSV export"
g add src/web
g commit -q -m "feat(ORD-12): orders page with filters"
g branch feat/ORD-40-report-filters
g branch fix/ORD-31-orders-pagination
g branch chore/ORD-35-bump-vitest
