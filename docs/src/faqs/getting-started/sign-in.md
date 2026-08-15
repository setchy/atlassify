---
title: "How do I sign in to my Atlassian account?"
category: "Getting Started"
order: 1
---

Atlassify supports two ways to authenticate with your Atlassian account:

- **API token with scopes** — recommended
- **Classic API token** — supported, but not recommended

### API token with scopes

When you create your API token, give it the Jira scopes `read:account` and `read:jira-work`:

- `read:account` — see your account details
- `read:jira-work` — read your Jira notifications

Refer to the [Atlassian documentation](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token-with-scopes) for help creating and managing an API token with scopes.
