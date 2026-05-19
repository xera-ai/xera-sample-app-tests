---
ticketId: XFB-8
summary: "US-103 — Log Out"
storyHash: sha256:f610e8bbfb91824e4d1a81ac6b555a0786f6a30db0d7a43cbee0c911e7d3e066
acceptanceCriteria:
  - "\"Sign out\" button is always visible in the navigation bar"
  - "After logging out, redirect to the login page"
  - "Refresh token is immediately invalidated"
  - "Old access tokens cannot be reused after logout"
acceptanceCriteriaSource: body-extraction
---
# XFB-8: US-103 — Log Out

## Story

**As a** Member, **I want to** log out of the system, **so that** my account is protected on shared machines.

## Acceptance Criteria

- [ ] "Sign out" button is always visible in the navigation bar
- [ ] After logging out, redirect to the login page
- [ ] Refresh token is immediately invalidated
- [ ] Old access tokens cannot be reused after logout
