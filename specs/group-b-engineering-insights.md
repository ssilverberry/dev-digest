# Group B — engineering-insights skill + agent docs (handover for Claude Code)

**Goal:** add the `engineering-insights` skill that appends non-obvious discoveries to `INSIGHTS.md`, plus the CLAUDE.md / docs / specs agent-guide scaffolding. No app code, no LLM calls.

**Reference (do not copy blindly — use to verify shape):** `git show 5610909` and `git show d186657` on this repo. Skill lives at `.claude/skills/engineering-insights/SKILL.md` in that commit.

## Do
1. **Skill:** create `.claude/skills/engineering-insights/SKILL.md` with YAML frontmatter (`name`, `description` with trigger phrases: learned, discovered, gotcha, workaround, turns out, wrap-up…). Body = algorithm: detect touched module → rank candidates → quality filter ("obvious to anyone reading the code for 5 min?" → discard) → classify into 7 sections (What Works / What Doesn't Work / Codebase Patterns / Tool & Library Notes / Recurring Errors & Fixes / Session Notes / Open Questions). **Append-only; read existing entries first to avoid dupes.**
2. **Manual trigger:** add `/engineering-insights` command in `.claude/commands/engineering-insights.md` that invokes the skill on demand.
3. **INSIGHTS files:** create root `INSIGHTS.md` (rubric names this file explicitly) + per-package `client/INSIGHTS.md`, `server/INSIGHTS.md`, `reviewer-core/INSIGHTS.md`, `e2e/INSIGHTS.md`, each seeded with the 7 section headers.
4. **Agent guides:** root `CLAUDE.md` already exists — leave it. Add per-package `CLAUDE.md` (client/server/reviewer-core/e2e) with conventions + do-not-touch + session protocol.
5. **Docs/specs scaffolding:** `server/docs/architecture.md`, `server/docs/api-contracts.md`, `reviewer-core/docs/pipeline.md`, `client/docs/ui-architecture.md`, and matching `specs/*.md` per package (short is fine).
6. *(Optional, L06 preview)* add a `Stop` hook in `.claude/settings.json` that fires `/engineering-insights` automatically. Reference: `git show 7b38596` (keeps only the Stop hook).

## Verify
- `/engineering-insights` runs and appends a dated entry to the right module's `INSIGHTS.md` without rewriting existing content.
- Root `INSIGHTS.md` exists with a real session entry by end of homework.
- No source/app code changed; no LLM calls.
- Commit: `chore: add CLAUDE.md, docs/specs, engineering-insights skill`.
