## 🔴 xera test FAILED — XFB-8 (run 2026-05-20T05-18-43-731)
**Classification:** REAL_BUG (confidence: high)
**Scenarios:** 3 / 5 passed
### Scenario: Refresh token is invalidated immediately after logout
- **Classification:** REAL_BUG (confidence: high)
- **Diagnosis:** After UI logout, POST /api/v1/auth/refresh with the pre-logout refresh_token returns HTTP 200 (expected 4xx). AC-2 "Refresh token is immediately invalidated" is not met server-side — client redirects to /login but the refresh token remains valid. Reproduces the prior run's REAL_BUG classification (2026-05-19T16:51:55Z); spec.ts and feature_hash unchanged since.

### Scenario: Old access token cannot be reused after logout
- **Classification:** REAL_BUG (confidence: high)
- **Diagnosis:** After UI logout, GET /api/v1/auth/me with the pre-logout access_token returns HTTP 200 (expected 401). AC-3 "Old access tokens cannot be reused after logout" is not met server-side. Reproduces the prior run's REAL_BUG classification.
### Suggested next action
- Review the failing scenarios above.
- Re-run after changes: open Claude Code and run `/xera-run XFB-8`.


### Reproduce locally

```
bunx xera-internal exec XFB-8 --replay=2026-05-20T05-18-43-731
```
---
xera v0.16.2 • prompts v2.6.0