## 🔴 xera test FAILED — XFB-26 (run 2026-05-19T18-03-26-147)
**Classification:** REAL_BUG (confidence: high)
**Scenarios:** 5 / 7 passed
### Scenario: "View all" link navigates to the full tasks list
- **Classification:** REAL_BUG (confidence: high)
- **Diagnosis:** AC-3 says the View all link should lead to all the user's tasks. The implementation links to /projects/project-1 — a single project's task list, not a global view. Users in multiple projects will only see tasks from project-1, missing tasks from other projects. The link target violates the AC.

### Scenario: Statistics count only tasks from projects the user belongs to
- **Classification:** REAL_BUG (confidence: high)
- **Diagnosis:** The Dashboard's Total Tasks figure (50) does not equal the count returned by the user-scoped tasks API (60). The discrepancy means either (a) the Dashboard count excludes 10 tasks from projects the user actually belongs to, or (b) the API includes 10 tasks the Dashboard correctly filters out. Either way AC-4 ('Figures only count tasks in projects the user belongs to') is not consistently honoured — the two sources disagree on user scope, which is a bug in at least one of them.
### Suggested next action
- Review the failing scenarios above.
- Re-run after changes: open Claude Code and run `/xera-run XFB-26`.


### Reproduce locally

```
bunx xera-internal exec XFB-26 --replay=2026-05-19T18-03-26-147
```
---
xera v0.16.2 • prompts v2.6.0