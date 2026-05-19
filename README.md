# xera-sample-app-tests

End-to-end test project for the **FlowBoard** sample app, powered by [`@xera-ai`](https://www.npmjs.com/org/xera-ai) and Playwright.

xera orchestrates the lifecycle of each test:

```
Jira ticket → story.md → test.feature (Gherkin) → spec.ts (Playwright)
            → run → diagnose → comment back on the ticket
```

You drive the pipeline through slash commands inside an AI agent (Claude Code, Cursor, Codex, …) or directly through the `xera-internal` CLI exposed by the package scripts.

## Prerequisites

- [Bun](https://bun.sh) 1.2+
- A running FlowBoard SUT
  - web: `http://localhost:5173`
  - api: `http://localhost:3000/api/v1`
- Access to Jira project `XFB` at `trinitytechvn.atlassian.net` (or use the Atlassian MCP in your agent session)

## Setup

```bash
bun install
cp .env.example .env   # then fill in Jira + test user creds
bunx playwright install
```

The base URLs, adapters, auth strategy and tracker config all live in [`xera.config.ts`](./xera.config.ts) — that's the single source of truth.

## Common workflows

Run from an agent (recommended):

| Slash command | What it does |
| --- | --- |
| `/xera-run XFB-<n>` | Full pipeline end-to-end for a ticket |
| `/xera-fetch XFB-<n>` | Pull the Jira story into `.xera/<TICKET>/story.md` |
| `/xera-feature XFB-<n>` | Generate Gherkin from the story |
| `/xera-script XFB-<n>` | Generate Playwright spec + POMs from Gherkin |
| `/xera-exec XFB-<n>` | Run the spec (auto-refreshes auth state) |
| `/xera-report XFB-<n>` | Classify the run and post a comment on the ticket |
| `/xera-coverage` | Area + AC coverage report |
| `/xera-impact XFB-<n>` | Pre-flight risk graph walk |

Or directly via the CLI:

```bash
bun run xera:fetch XFB-6
bun run xera:exec  XFB-6
bun run xera:report XFB-6
```

## Repo layout

```
.
├── .agents/skills/   # Agent-agnostic skill specs
├── .claude/skills/   # Claude Code slash commands
├── .cursor/          # Cursor commands + rules
├── .xera/            # Per-ticket artifacts, graph events, coverage state
├── shared/           # Shared page objects + auth setup
├── openapi.json      # FlowBoard API spec (http adapter)
├── playwright.config.ts
└── xera.config.ts
```

## Working with this repo via an AI agent

If you're an AI coding agent, read [`AGENTS.md`](./AGENTS.md) before editing anything — it documents the per-ticket artifact layout, POM rules, hash gates, untrusted-input handling, and git conventions you're expected to follow.
