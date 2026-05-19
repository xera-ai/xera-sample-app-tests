## 🔴 xera test FAILED — XFB-7 (run 2026-05-19T14-33-16-017)
**Classification:** REAL_BUG (confidence: low)
**Scenarios:** 3 / 9 passed
### Scenario: Invalid credentials display an error message
- **Classification:** REAL_BUG (confidence: medium)
- **Diagnosis:** Direct probe of POST /api/v1/auth/login with bad creds returns 401 with body '{"error":"Invalid email or password"}'. AC explicitly mandates the literal string 'Invalid credentials'; the SUT's wording diverges from AC. Either the AC text or the SUT copy must be reconciled.

### Scenario: Access token can be refreshed via the refresh endpoint
- **Classification:** REAL_BUG (confidence: low)
- **Diagnosis:** POST /auth/refresh returned an access_token equal to the one issued by /auth/login (failure was `expect(...).not.toBe(redacted-value)`). AC says the token is 'automatically refreshed' which implies issuance of a new value. Low confidence — server may intentionally reuse a still-valid token, in which case this is a TEST_BUG over-asserting AC.

### Scenario: Rate limit blocks after 20 failed login attempts in one minute
- **Classification:** REAL_BUG (confidence: high)
- **Diagnosis:** 25 consecutive failed POSTs to /api/v1/auth/login from a fresh request context produced no 429 responses (sawRateLimit remained false). AC explicitly requires 429 after 20 failed attempts/min — rate limiter appears to be missing or disabled in the staging API.

### Scenario: Desktop layout shows the 2-panel design
- **Classification:** TEST_BUG (confidence: medium)
- **Diagnosis:** Spec used getByTestId('login-branding-panel') / 'login-form-panel'. Those data-testids were assumed by the generator and are not present in the SUT DOM. Needs to be rewritten with role/region/landmark selectors after inspecting the rendered login page.

### Scenario: Mobile layout collapses the branding panel
- **Classification:** TEST_BUG (confidence: medium)
- **Diagnosis:** Same invented testIds as the desktop-layout scenario. Needs a real DOM-anchor (e.g. role-based or text-based selector) for the branding/form regions.

### Scenario: Dashboard is reachable for an authenticated user
- **Classification:** TEST_BUG (confidence: high)
- **Diagnosis:** test.use({ storageState: '.xera/.auth/regular.json' }) failed because that file is in xera's internal auth-state envelope (`v1:0iW4...`), not Playwright's storageState JSON schema. This add-on smoke scenario should either be removed or pointed at the storageState path produced by xera's auth pipeline.
### Suggested next action
- Review the failing scenarios above.
- Re-run after changes: open Claude Code and run `/xera-run XFB-7`.


### Reproduce locally

```
bunx xera-internal exec XFB-7 --replay=2026-05-19T14-33-16-017
```
---
xera v0.16.1 • prompts v2.6.0