---
tags: [best-prompt-ever]
max_turns: 30
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Bash, Edit, Write]
---

Fix the off-by-one in src/server/auth/session.ts: isExpired logs users out one minute early. Add a test for the 30-minute boundary.
