## 🔴 xera test FAILED — XFB-6 (run 2026-05-19T16-46-05-389)
**Classification:** REAL_BUG (confidence: medium)
**Scenarios:** 1 / 7 passed
### Scenario: Successful registration logs the user in and redirects to Dashboard
- **Classification:** REAL_BUG (confidence: medium)
- **Diagnosis:** After submitting a valid registration (8+ char password, unique email), the app navigated to /login instead of Dashboard. AC-2 explicitly requires automatic login and redirect to Dashboard after successful registration.

### Scenario: Duplicate email shows a clear error
- **Classification:** SELECTOR_DRIFT (confidence: medium)
- **Diagnosis:** Setup TEST_BUG was fixed in this run (Playwright newContext baseURL + leading-slash path was dropping the /api/v1 prefix; now uses full URL). The test now reaches its assertion and reveals the same pattern as the other validation scenarios: getByRole('alert') is not present in the DOM. The app likely surfaces the error in a non-ARIA-alert element.

### Scenario: Password shorter than 8 characters shows an error
- **Classification:** SELECTOR_DRIFT (confidence: medium)
- **Diagnosis:** Assertion waited on getByRole('alert') but no element with role=alert appeared within 5s. The AC requires showing a password-length error; the app likely renders the error in a non-ARIA element (inline helper text, role=status, or plain span).

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
bunx xera-internal exec XFB-6 --replay=2026-05-19T16-46-05-389
```
---
xera v0.16.1 • prompts v2.6.0