# Best Prompt Ever

[Português (Brasil)](README.pt-BR.md)

Best Prompt Ever is an agent skill that interviews you to turn a vague request into a complete, ticket-quality prompt that a coding agent can execute on the first try. Vague prompts make agents guess: they touch the wrong files, copy the wrong pattern, skip edge cases and stop without proof that the work is done. The rework that follows costs more than the questions that would have prevented it.

## What makes it different

- **Questions informed by your repository.** Before asking anything, the skill reads the code. Its questions come with concrete options taken from the repository, for example: "I found similar flows in `src/billing/export.ts` and `src/reports/csv.ts` — which one should this follow?" You pick instead of describing from memory.
- **An executable prompt with validation.** The result is not a summary of the chat. It lists the files to change, the patterns to follow and avoid, the execution plan (branches, PRs, migration order) and numbered validation scenarios with the evidence the agent must show.

## How it works

```
input → silent reconnaissance → gap analysis → question rounds → delivery
```

1. **Input.** Your initial request. If it is empty, the skill asks only *what* and *where*.
2. **Silent reconnaissance.** Read-only. It reads agent instruction files (`CLAUDE.md`, `AGENTS.md`), stack and versions, the area of the change, similar flows, and branch and commit conventions. It never asks what it can find out by itself.
3. **Gap analysis.** It rates every point of the final prompt, guesses the task type and size, and decides which points are required.
4. **Question rounds.** 1 to 4 questions per round, from general to specific, each with concrete options and a suggested answer. Vague answers get one follow-up; if a point stays vague, it is parked and revisited later.
5. **Delivery.** It shows the final prompt and asks whether it may execute.

### Levels per point

Each point of the prompt (objective, files to change, validation scenarios, and so on) has a level:

| Level | Meaning |
|---|---|
| empty | Nothing known yet. |
| vague | Something was said, but an agent would still have to guess. |
| partial | Actionable for part of the work. |
| complete | An agent can act without asking. |
| delegated | You said "you decide"; the prompt records the criterion the agent will use. |
| not applicable | Does not apply to this task. |

### Task size

The skill estimates the size from the objective, the area and the units of work, and adjusts it as you answer.

| Size | Round limit | Effect |
|---|---|---|
| small | 2 | Points with a clear repository default (base branch, commit convention, how to verify, expected evidence) are filled from what it found, with the source shown, instead of asked. |
| medium | 4 | Those defaults are offered as suggestions and confirmed with you. |
| large | 6 | Same as medium, and at the end it offers to move the prompt to a fresh session. |

The branch name is always your choice: the skill offers 2 or 3 names that follow the repository's pattern, or you write your own.

### The panel

Before each round, the skill shows where things stand:

```
Type: feature (guess) · Size: medium · Units: 1) migration 2) feature · Round 2/4
complete   objective, area, stack, similar flows
partial    files, validation scenarios
vague      patterns to follow
empty      risks
parked     forbidden patterns (2 tries)
n/a        migration order (unit 2)
```

### The end

The interview stops when every required point is resolved, when you say "enough", or when the round limit is reached. Anything left open goes to an "Open questions and assumptions" section. The skill then shows the prompt in the conversation, says it has the context it needs, and asks whether it may execute. For large tasks it also offers to copy the prompt into a fresh session. No file is saved.

## Installation

**Claude Code plugin**

```
/plugin marketplace add lfelipearruda1/best-prompt-ever
/plugin install best-prompt-ever@best-prompt-ever
```

**skills CLI** (Claude Code, Codex, Cursor and other agents)

```
npx skills add lfelipearruda1/best-prompt-ever
```

**Manual**

Copy `skills/best-prompt-ever/` into `~/.claude/skills/`.

## Usage

Start with a vague request in a repository:

> Add CSV export to the reports page.

The skill reads the repository first, then shows the panel and asks something like:

> I found two export flows: `src/billing/export.ts` (streams rows, has tests) and `src/legacy/csv.js` (no tests). Which one should this follow?
> 1. `src/billing/export.ts` (suggested: newer and tested)
> 2. `src/legacy/csv.js`
> 3. Neither

After a few rounds it shows a prompt along these lines:

```
Objective: A signed-in user can export the current report table as CSV from the report page,
with the same columns and filters as the screen.
Repository context: follow src/billing/export.ts; modify src/reports/ReportPage.tsx and
src/reports/api.ts; create src/reports/exportCsv.ts and its test. Out of scope: PDF export.
Execution: base main, branch feat/report-csv-export (chosen), one PR.
Validation:
  1. Report with filters → Export → CSV has only the filtered rows.
  2. Report with no rows → file has only the header.
  3. User without access → 403, no file.
  Evidence: passing test output for 1–3 and lint output for the changed files.
Open questions and assumptions: …
```

Then it asks whether it may execute.

## Language

The skill answers in the language of your first message. The questions, the panel and the final prompt are in that language; file names, functions and commands stay as they are in the code. You can ask for the prompt in another language.

## Privacy and security

- **Read-only interview.** Nothing is written during the interview: no edits, branches, commits or files. Implementation starts only after you confirm, as the agent's normal work under its own rules.
- **No secret files.** Reconnaissance never opens `.env*` files (except templates such as `.env.example`), credentials, private keys or `*.pem` files.
- **No secrets in the prompt.** The prompt cites files by path and never includes tokens, passwords, connection strings or personal data.

## Status

Version 0.1.0, the first release. The skill (`skills/best-prompt-ever/SKILL.md`) and its references are written; test cases live in `evals/`. Expect the wording of questions and prompts to change as it gets real use.

Contributions are welcome: open an issue or a pull request. `DESIGN.md` is the source of truth, so proposals that change behavior should start there.

## License

[MIT](LICENSE)
