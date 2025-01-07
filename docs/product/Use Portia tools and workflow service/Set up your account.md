---
sidebar_position: 1
---

# Set up your account
Set up your Portia cloud account.

Your cloud account allows you to:
- Store and retrieve workflows in the Portia cloud
- Access our library of cloud hosted tools
- Use the Portia dashboard to 
    - View your workflow history, unhandled clarifications, tool call logs
    - Manage users, orgs and Portia API keys

You first need to obtain a Portia API key. Head over to (<a href="https://app.portia.dev" target="_blank">**app.portia.dev ↗**</a>) and navigate to the `Manage API keys` tab from the left hand nav. There you can generate a new API key.
:::note[On org users]
You will notice a `Manage orgs and users` tab. You can set up multiple orgs in Portia. Users under the same org can all see each others' workflows and tool call logs.
:::

By default, Portia will look for the API key in the `PORTIA_API_KEY` environment variable. You can choose to override it for a specific `runner` instance by configuring the `portia_api_key` variable as well. For now let's simply set the environment variable with the key value you generated and proceed to the next section.
```bash
export PORTIA_API_KEY='your-api-key-here'
```



