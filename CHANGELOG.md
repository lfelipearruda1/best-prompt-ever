# Changelog

## [0.2.0] - 2026-11-04

- Project memory: each interview reads `.best-prompt-ever/context.md` (committed in the repository) as hints checked against the code, and at delivery proposes an update that is saved only with the user's OK. It records architecture, service connections and integrations, stack, conventions (branches, commits, PRs, migrations, lint and tests), patterns, preferences and work in progress.
- `references/project-memory.md`: reading, writing and curation rules, what never to record, and the file template.
- `SKILL.md`, `anatomy.md`, `output-template.md`: memory as a discovered source, branch name options follow the recorded pattern, memory proposal at delivery.

## [0.1.1] - 2026-11-04

- Repository cleanup: removed evals, the design document and the Portuguese README; the skill is Markdown only.
- `references/anatomy.md`: added the general definition of the six levels, previously only in the design document.

## [0.1.0] - 2026-11-04

First release.

- `SKILL.md`: interview flow (input → read-only reconnaissance → gap analysis → question rounds → delivery), ground rules and reference map.
- References: `anatomy.md` (20 points with level criteria, dependencies and question banks), `task-types.md` (types, size, units of work, required points), `output-template.md` (final prompt template and filling rules), `examples.md` (a small bugfix and a large migration + UI feature).
- Task size (small, medium, large) with round limits of 2, 4 and 6.
- Delivery in the conversation, asking before executing; no file is saved.
- Never reads secret files during reconnaissance.
- Evals: 7 cases (5 should trigger, 2 should not) with a shared fixture repository.
- `DESIGN.md` as the source of truth; README in English and Brazilian Portuguese.
