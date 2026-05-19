---
ticketId: XFB-6
summary: "US-101 — Register an Account"
storyHash: sha256:aea29504a9d65c79829611eaa7402d554ae797d21e75d0120b7b693c903ae394
acceptanceCriteria:
  - "Form has 3 fields: Name, Email, Password (≥8 characters)"
  - "Email must be valid and not already registered in the system"
  - "After successful registration, automatically log in and redirect to Dashboard"
  - "Display a clear error if the email is already taken (409)"
  - "Display an error if the password is fewer than 8 characters (400)"
  - "Layout: 2-panel design — dark branding panel (left) + form panel (right). On mobile (<768px), branding panel collapses; form takes full width."
acceptanceCriteriaSource: body-extraction
---
# XFB-6: US-101 — Register an Account

## Story

**As a** Guest, **I want to** create a new account with a name, email, and password, **so that** I can log in and use the system.

## Acceptance Criteria

- [ ] Form has 3 fields: Name, Email, Password (≥8 characters)
- [ ] Email must be valid and not already registered in the system
- [ ] After successful registration, automatically log in and redirect to Dashboard
- [ ] Display a clear error if the email is already taken (409)
- [ ] Display an error if the password is fewer than 8 characters (400)
- [ ] Layout: 2-panel design — dark branding panel (left) + form panel (right). On mobile (<768px), branding panel collapses; form takes full width.
