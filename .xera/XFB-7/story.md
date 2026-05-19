---
ticketId: XFB-7
summary: "US-102 — Log In"
storyHash: sha256:f3d347ec38f6e1bf97083488f5e02888b45ee46c87f86e9c75405b3ea48493bb
acceptanceCriteria:
  - "Form has Email and Password fields"
  - "Successful login → redirect to Dashboard"
  - "Invalid credentials → display \"Invalid credentials\" error (401)"
  - "Session is persisted after page reload"
  - "After 15 minutes of inactivity, the access token is automatically refreshed"
  - "Rate limit: blocked after 20 failed attempts per minute (429)"
  - "Layout: 2-panel design — dark branding panel (left) + form panel (right). On mobile (<768px), branding panel collapses; form takes full width."
acceptanceCriteriaSource: body-extraction
---
# XFB-7: US-102 — Log In

## Story

**As a** Guest, **I want to** log in with my email and password, **so that** I can access my account.

## Acceptance Criteria

- [ ] Form has Email and Password fields
- [ ] Successful login → redirect to Dashboard
- [ ] Invalid credentials → display "Invalid credentials" error (401)
- [ ] Session is persisted after page reload
- [ ] After 15 minutes of inactivity, the access token is automatically refreshed
- [ ] Rate limit: blocked after 20 failed attempts per minute (429)
- [ ] Layout: 2-panel design — dark branding panel (left) + form panel (right). On mobile (<768px), branding panel collapses; form takes full width.
