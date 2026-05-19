## 🔴 xera test FAILED — XFB-8 (run 2026-05-19T16-50-10-160)
**Classification:** REAL_BUG (confidence: high)
**Scenarios:** 3 / 5 passed
### Scenario: Refresh token is invalidated immediately after logout
- **Classification:** REAL_BUG (confidence: high)
- **Diagnosis:** Previous run's TEST_BUG (URL resolution dropped /api/v1 prefix) was fixed. The test now reaches the assertion and proves a real server-side defect: POST /api/v1/auth/refresh with the pre-logout refresh_token returns HTTP 200 after the user logs out via UI. AC-2 requires the refresh token to be invalidated immediately on logout — the server is not honouring that. Client-side state is cleared (redirect to /login fires), but the refresh token remains valid server-side.

### Scenario: Old access token cannot be reused after logout
- **Classification:** REAL_BUG (confidence: high)
- **Diagnosis:** Previous run's TEST_BUG was fixed. The test now reaches the assertion and proves a real server-side defect: GET /api/v1/auth/me with the pre-logout access token returns HTTP 200 (expected 401) after the user logs out. AC-3 requires the access token to be unusable post-logout — the server is not invalidating it.
### Suggested next action
- Review the failing scenarios above.
- Re-run after changes: open Claude Code and run `/xera-run XFB-8`.


### Reproduce locally

```
bunx xera-internal exec XFB-8 --replay=2026-05-19T16-50-10-160
```
---
xera v0.16.1 • prompts v2.6.0