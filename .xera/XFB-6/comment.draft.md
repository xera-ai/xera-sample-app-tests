## 🔴 xera test FAILED — XFB-6 (run 2026-05-19T15-52-46-172)
**Classification:** REAL_BUG (confidence: medium)
**Scenarios:** 1 / 7 passed
### Scenario: Successful registration logs the user in and redirects to Dashboard
- **Classification:** REAL_BUG (confidence: medium)
- **Diagnosis:** After submitting a valid registration (8+ char password, unique email), the app navigated to /login instead of Dashboard. The AC explicitly requires automatic login and redirect to Dashboard after successful registration; redirecting to the login page contradicts this. Could also indicate the API call failed silently — investigation of the server response is needed to confirm. Marked medium because the test does not capture the /auth/register HTTP response in this scenario.

### Scenario: Duplicate email shows a clear error (HTTP 409)
- **Classification:** TEST_BUG (confidence: medium)
- **Diagnosis:** Test setup tried to pre-create a user via POST /auth/register at http://localhost:3000/api/v1/auth/register and received HTTP 404. The OpenAPI spec lists the endpoint at this path, so either the API base URL is misconfigured for this test or the API server is not running. The test never reached the duplicate-email branch — this is a setup defect, not an app failure.

### Scenario: Password shorter than 8 characters shows an error (HTTP 400)
- **Classification:** SELECTOR_DRIFT (confidence: medium)
- **Diagnosis:** Assertion waited on getByRole('alert') but no element with role=alert appeared within 5s. The AC requires showing a password-length error; the app likely renders the error in a different element (inline helper text, role=status, or a non-ARIA span). Marked SELECTOR_DRIFT pending DOM inspection — could be REAL_BUG if no validation occurs at all.

### Scenario: Invalid email format shows an error
- **Classification:** SELECTOR_DRIFT (confidence: medium)
- **Diagnosis:** Same as the password-length scenario: getByRole('alert') was not found after submitting an invalid email. The app may surface the validation message in a non-alert element.

### Scenario: Desktop layout shows the 2-panel design
- **Classification:** SELECTOR_DRIFT (confidence: medium)
- **Diagnosis:** Test assumed data-testid='register-branding-panel' and 'register-form-panel' but neither exists in the DOM. The AC requires a 2-panel desktop layout but does not specify test-id naming; the test invented these selectors. Likely the panels exist under different markup.

### Scenario: Mobile layout collapses the branding panel
- **Classification:** SELECTOR_DRIFT (confidence: medium)
- **Diagnosis:** Same invented data-testid selectors as the desktop-layout scenario. The 2-panel responsive behaviour cannot be verified until correct selectors are identified from the SUT DOM.
### Suggested next action
- Review the failing scenarios above.
- Re-run after changes: open Claude Code and run `/xera-run XFB-6`.


### Reproduce locally

```
bunx xera-internal exec XFB-6 --replay=2026-05-19T15-52-46-172
```
---
xera v0.16.1 • prompts v2.6.0