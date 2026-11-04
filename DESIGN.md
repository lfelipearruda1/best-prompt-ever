# Best Prompt Ever — Design

This document is the source of truth for the `best-prompt-ever` skill. When the skill, its references or its evals disagree with this file, this file wins until it is changed on purpose.

## 1. What it is and what makes it different

Best Prompt Ever interviews a developer to turn a vague request ("add export to reports", "fix the login bug") into a complete, ticket-quality prompt that a coding agent can execute on the first try.

It is not a generic "clarify your intent" helper. Two things set it apart:

1. **Repository-informed questions.** Before asking anything, the skill reads the code. Its questions offer concrete options taken from the repository: "I found similar flows in `src/billing/export.ts` and `src/reports/csv.ts` — which one should this follow?" The developer picks instead of describing from memory.
2. **An executable prompt with validation.** The output is not a summary of the conversation. It is a prompt with the target files, the patterns to follow and avoid, an execution plan (branches, PRs, migration order) and numbered validation scenarios with the evidence the agent must show.

## 2. Anatomy of the final prompt

Every final prompt has these sections. Each item below is a **point** the interview tracks. `references/anatomy.md` defines, per point, what it means, the criteria for each level, its dependencies, its question bank and the task types that require it.

1. **Objective** — the outcome in one or two sentences.
2. **Task context** — why the change is needed, who is affected, what triggered it, and the visual reference when the task changes UI.
3. **Repository context**
   - Stack and versions
   - Area (module, package, service, layer)
   - Files to change
   - Similar flows
   - Patterns to follow
   - Forbidden patterns
   - UI and design system (only when the task changes UI)
   - Constraints
   - Out of scope
4. **Execution**
   - Base branch, branch name and commit convention
   - One branch or several
   - Split into PRs
   - Migration order
   - Risks
5. **Validation**
   - Numbered scenarios (action → expected result)
   - Edge cases
   - How to verify
   - Expected evidence
6. **Open questions and assumptions** — anything that stayed vague, plus every delegated decision and the criterion the agent will use for it.

## 3. Flow

```
input → silent reconnaissance → gap analysis → question rounds → delivery
```

1. **Input.** The user's initial prompt. If it is empty, ask only two things: *what* (the change) and *where* (repository area, or "I don't know").
2. **Silent reconnaissance (read-only).** Without asking anything, read:
   - agent instruction files (`CLAUDE.md`, `AGENTS.md`, and similar);
   - stack and versions (manifests, lockfiles, runtime version files);
   - the likely area of the change;
   - similar flows already in the code (and similar screens and shared components when the task changes UI);
   - branch and commit conventions (`git branch -a`, `git log`).

   Rule: **never ask what can be discovered.** If the lockfile says which framework version is used, the skill states it; it does not ask it.

   Rule: **never read secret files.** Reconnaissance skips `.env*` (except `.env.example` and similar templates), credential files, private keys, `*.pem`, `*.key`, keystores and any file whose name or location marks it as holding secrets. Their existence can be noted; their contents are never opened.
3. **Gap analysis.** Rate every point (section 4), guess the task type (section 6) and the task size (section 7), and decide which points are required.
4. **Question rounds.** Ask about the gaps (section 8), re-rating after each answer.
5. **Delivery.** Show the consolidated prompt and ask whether to execute (section 10).

## 4. Levels per point

| Level | Meaning |
|---|---|
| **empty** | Nothing known yet. |
| **vague** | Something was said, but an agent could not act on it without guessing. |
| **partial** | Actionable for part of the work; a specific piece is still missing. |
| **complete** | An agent can act on it without asking anything. |
| **delegated** | The user said "you decide". Recorded together with the criterion the agent will use to decide. Counts as resolved. |
| **not applicable** | The point does not apply to this task (e.g. migration order in a docs change). Counts as resolved. |

The criteria for vague, partial and complete are defined **per point** in `references/anatomy.md`. A generic definition is not enough: "complete" for *Files to change* is different from "complete" for *Validation scenarios*.

## 5. Parking

A point that is still vague after **2 attempts** is **parked**. The skill moves on to another point and returns to the parked one when an answer elsewhere unblocks a dependency (for example, choosing a similar flow often settles the patterns to follow).

Natural order of the interview:

```
objective → where (area) → task type / split → similar flows → files
→ patterns / forbidden patterns → execution → validation
```

The order is a default, not a script. Dependencies in `anatomy.md` decide when a parked point is worth retrying.

## 6. Task type and units of work

- The skill makes an initial **guess** of the task type from the input and the reconnaissance, and adjusts it after each answer.
- Base task types: `feature`, `bugfix`, `refactor`, `migration`, `performance`, `dependency-upgrade`, `config-infra`, `tests`, `docs`. Details live in `references/task-types.md`.
- A **composite task** is split into **units of work** (for example: a schema migration, a refactor and a feature). Each unit has its own required points.
- Changing UI is a trait, not a type: a `feature`, `bugfix` or `refactor` unit can change UI. When it does, the *UI and design system* point becomes required for that unit.
- The execution questions (one branch or several, PR split, order of merges and migrations) come out of this split. A single-unit task usually has a short execution section.

## 7. Task size

The skill deduces a **size** during gap analysis from the objective, the area and the units of work, and adjusts it during the interview as answers come in.

| Size | Typical shape | Round limit |
|---|---|---|
| **small** | One unit of work, one area, a few files, no schema or data change. | 2 |
| **medium** | One or two units, one area across a few layers, or a contained schema change. | 4 |
| **large** | Composite task, several packages or services, a migration with backfill, or new screens. | 6 |

A round is one block of 1 to 4 questions.

Size changes which points need a question:

- In **small** tasks, points with a clear repository default are resolved from what reconnaissance found and marked **complete with their source** instead of being asked. This covers the base branch, the commit convention, how to verify (the project's own lint and test scripts) and the expected evidence (passing output of those scripts, scoped to the changed files). PR split defaults to one PR. The user sees these in the panel and can override them.
- The branch name is never defaulted: in every size the user chooses it from the offered options (section 8).
- In **medium** and **large** tasks, these points are confirmed with the user, still offering the discovered default as the guess.

`references/anatomy.md` states, per point, how size affects whether it is required.

## 8. Question rounds

- **1 to 4 questions per round**, from general to specific.
- Every question offers **concrete options** (preferably taken from the code) and a **guess**: the option the skill would pick and why.
- **Branch name:** always offer 2 or 3 names following the pattern found in the repository, plus the option for the user to write their own. The user chooses; the skill does not decide alone.
- When an answer is vague, **insist** once with a narrower question; after the second vague answer, park the point (section 5).
- Before each round, show a **compact panel**:
  - task type, size and units of work;
  - points grouped by level;
  - parked points.

Example panel:

```
Type: feature (guess) · Size: medium · Units: 1) migration 2) feature · Round 2/4
complete   objective, area, stack, similar flows
partial    files, validation scenarios
vague      patterns to follow
empty      risks
parked     forbidden patterns (2 tries)
n/a        migration order (unit 2)
```

## 9. Stopping

The interview stops when any of these is true:

1. every required point is complete, delegated or not applicable;
2. the user says "enough" ("chega", "that's it", or equivalent in their language);
3. the round limit for the task size is reached (section 7).

Anything still empty, vague or partial goes to **"Open questions and assumptions"** in the final prompt, with the assumption the agent should make if no one answers.

## 10. Delivery

The skill saves no file. At the end it:

1. shows the consolidated prompt in the conversation: the anatomy sections (section 2) plus "Open questions and assumptions";
2. says it now has the context it needs and asks whether it may execute;
3. in **large** tasks, also offers to copy the prompt into a fresh session instead, because the interview has already used part of the context window.

If the user asks for changes, the skill updates the prompt and shows it again before asking.

If the user confirms, execution proceeds as the agent's normal work, under its own rules (`CLAUDE.md`, `AGENTS.md` and similar). The interview is over at that point; the skill does not govern the implementation.

The prompt:

- cites files by **path** (and line or symbol when useful), never pastes code;
- **never includes secrets** (tokens, passwords, connection strings, personal data);
- does **not depend on a specific agent**: no tool names, slash commands or agent-only features in the instructions, so it still works when pasted into another session or another agent.

## 11. Language

- All skill content (`SKILL.md`, references, this document) is written in **English**.
- The skill detects the language of the user's initial prompt and conducts the conversation (questions, panel) in that language.
- The final prompt is written in the conversation language. Code identifiers (files, functions, commands, branch names) stay as they are.
- If the user asks, the prompt is generated in another language.

## 12. Skill rules

- **Read-only interview.** During the interview the skill writes nothing: no file edits, no branches, no commits, no migrations, no saved prompt. Implementation happens only after the user confirms at delivery, outside the interview.
- **No secret files.** Reconnaissance never opens secret files (section 3), and the final prompt never contains secrets.
- **Questions.** In Claude Code, use the multiple-choice question tool (`AskUserQuestion`). In other agents, ask the same questions as plain text with numbered options.
- **Portable frontmatter.** Only `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. No `disable-model-invocation`. Activation depends on a precise `description`.
- **Size.** `SKILL.md` stays under 500 lines. Details go to `references/`.

## 13. Planned reference files

| File | Contents |
|---|---|
| `references/anatomy.md` | Every point: meaning, level criteria, dependencies, question bank, required-for task types and sizes. |
| `references/task-types.md` | Task types, how to guess them and the size, units of work, required points per type. |
| `references/output-template.md` | The final prompt template and the rules for filling it. |
| `references/examples.md` | End-to-end examples: input, panels, rounds, final prompt. |
