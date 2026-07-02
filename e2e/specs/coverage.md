# spec — e2e coverage

> Scaffold — what the flows cover and where the gaps are. The runnable flows are the
> `*.flow.json` files in this directory; this doc is the prose companion.

## Current flows (`specs/*.flow.json`, run in lexical order)
| Flow | Covers |
|------|--------|
| `01-app-boot` | app loads / smoke |
| `02-repo-pulls-detail` | repo → pulls → PR detail navigation |
| `03-agents` | agents view |
| `04-pr-findings` | PR findings render |
| `05-pr-diff` | PR diff view |
| `06-onboarding` | onboarding flow |
| `07-settings` | settings view |

## Principles
- Deterministic, seed-backed, **no LLM** — flows never trigger a review or need a key.
- A step passes iff its agent-browser command exits zero; light `stdoutContains` checks on top.

## Gaps / TODO (fill in)
- [ ] running a review end-to-end (needs a mockable path or a seeded completed run)
- [ ] severity filtering interactions on the findings panel
- [ ] error/empty states (repo not found, PR with zero findings)

## See also
- how flows work / how to add one → `../docs/flows.md`
