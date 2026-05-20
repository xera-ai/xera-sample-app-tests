---
ticketId: XFB-9
summary: "US-104 — Manage API Keys"
storyHash: sha256:b40ba189b83d6f472da14fdd626b7b2c394a858b97e76e4ac588146aa8b44918
acceptanceCriteria:
  - "The `/settings/api-keys` page displays a list of existing keys"
  - "Creating a new key requires entering a name (label)"
  - "The raw key is displayed **only once** after creation — it cannot be viewed again"
  - "Any key can be revoked (deleted)"
  - "A revoked key stops working immediately"
acceptanceCriteriaSource: body-extraction
---
# XFB-9: US-104 — Manage API Keys

## Story

**As a** Member, **I want to** create and revoke API keys, **so that** I can access the API from external tools (Postman, scripts) without a password.

## Acceptance Criteria

- [ ] The `/settings/api-keys` page displays a list of existing keys
- [ ] Creating a new key requires entering a name (label)
- [ ] The raw key is displayed **only once** after creation — it cannot be viewed again
- [ ] Any key can be revoked (deleted)
- [ ] A revoked key stops working immediately
