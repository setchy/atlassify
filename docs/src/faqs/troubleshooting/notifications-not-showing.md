---
title: "Why aren't my notifications showing?"
category: "Troubleshooting"
order: 1
---

If your notification feed appears empty or is missing notifications, there are a few things you can check.

### 1. Check the unread-only toggle

By default, Atlassify only shows unread notifications. If you've read all of your notifications, the feed will appear empty. Toggle **Show only unread** (found in the sidebar) to confirm that previously-read notifications are still being fetched.

### 2. Verify the notification exists in Atlassian

Confirm the missing notification is actually visible in Atlassian by checking [your notification center](https://home.atlassian.com/notifications). If it isn't there, it's not an Atlassify issue.

### 3. Configure site hostnames for missing sites

Atlassify normally discovers all of your accessible Atlassian sites automatically. In rare cases, a site may not be discoverable this way, which can cause its notifications to be left out of your feed.

If you notice notifications missing for a specific Atlassian site (e.g. `your-domain.atlassian.net`), add the site's hostname:

1. Open the **Accounts** screen from the Atlassify sidebar
2. Click the **⚙️ gear icon** next to the account
3. Add the site's hostname (e.g. `your-domain.atlassian.net`) under **Account host names**

Only configure the hostnames you actually need — adding unnecessary ones can slow down notification checks.

If notifications are still missing after that, see [How do I debug Atlassify?](/faq/#debug).
