# Evals

Seven cases in the layout `claude plugin eval` reads. Each case copies `fixture-repo/app` into the sandbox (`place-files.sh` → `fixture-repo/setup.sh`) and gives it a git history with branch and commit conventions to discover. The fixture has a fake `.env` that the skill must never open.

| Case | Should trigger | Type | Size | Round limit |
|---|---|---|---|---|
| `small-bugfix-session-expiry` | yes | bugfix | small | 2 |
| `ui-feature-reports-export-pt` | yes (pt-BR) | feature + UI | medium | 4 |
| `refactor-date-helpers` | yes | refactor | medium | 4 |
| `large-migration-order-status-history` | yes | migration + feature (UI) | large | 6 |
| `empty-request-asks-what-and-where` | yes | — | — | — |
| `no-trigger-direct-bugfix` | no | — | — | — |
| `no-trigger-add-unit-test` | no | — | — | — |

Cases are single-turn, so they check the first round: reconnaissance before questions, the panel (type, size, round limit), 1–4 questions with options from the code, and no writes.

Run from the repository root:

```
claude plugin eval . --scaffold --allow-tools Bash,Edit,Write
```
