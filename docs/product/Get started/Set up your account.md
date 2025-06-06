---
sidebar_position: 4
slug: /setup-account
---

# Set up your Portia account
Set up your Portia cloud account. This will allow you to:
- Store and retrieve plan runs in the Portia cloud.
- Access our library of cloud hosted tools.
- Use the Portia dashboard to:
    - View your plan run history, unhandled clarifications, tool call logs.
    - Manage users, orgs and Portia API keys.

You first need to obtain a Portia API key. Head over to (<a href="https://app.portialabs.ai" target="_blank">**app.portialabs.ai ↗**</a>) and navigate to the `Manage API keys` tab from the left hand nav. There you can generate a new API key.
:::note[On org users]
You will notice a `Manage orgs and users` tab. You can set up multiple orgs in Portia. Users under the same org can all see each others' plan runs and tool call logs.
:::

By default, Portia will look for the API key in the `PORTIA_API_KEY` environment variable. You can choose to override it for a specific `Portia` instance instance by configuring the `portia_api_key` variable as well. For now let's simply set the environment variable with the key value you generated and proceed to the next section. You can use the command below but it's always preferable to set your API keys in a .env file ultimately.
```bash
export PORTIA_API_KEY='your-api-key-here'
``` 

:::tip[Upgrading your account]
You can upgrade your account to a Pro plan to increase your Portia tool and plan run usage limits. Head over to the <a href="https://app.portialabs.ai/dashboard/billing" target="_blank">**Billing page ↗**</a> to upgrade or manage your current plan.
:::
