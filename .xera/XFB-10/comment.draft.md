## 🔴 xera test FAILED — XFB-10 (run 2026-05-20T07-17-37-869)
**Classification:** REAL_BUG (confidence: high)
**Scenarios:** 1 / 3 passed
### Scenario: Changing the display name and saving persists the new name
- **Classification:** REAL_BUG (confidence: high)
- **Diagnosis:** Submitting the name change fires PATCH /api/v1/users/user-1 which returns 404 because the backend only exposes PUT for that path (openapi.json registers `PUT /api/v1/users/{id}` only — see `grep -i users openapi.json`). The frontend then renders the inline text 'Failed to update profile', so no confirmation message ever appears and a page reload still shows the original name.

### Scenario: Changing the password with a valid new password shows a confirmation message
- **Classification:** REAL_BUG (confidence: high)
- **Diagnosis:** Same HTTP-verb mismatch as scenario 1: the form submits `PATCH /api/v1/users/user-1` and the backend responds 404. The UI surfaces 'Failed to change password' instead of any confirmation. AC3 cannot be verified until the password endpoint is wired up (either accept PATCH or change the frontend to PUT).
### Suggested next action
- Review the failing scenarios above.
- Re-run after changes: open Claude Code and run `/xera-run XFB-10`.


### Reproduce locally

```
bunx xera-internal exec XFB-10 --replay=2026-05-20T07-17-37-869
```
---
xera v0.16.3 • prompts v2.6.0