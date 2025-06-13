---
sidebar_position: 3
slug: /cloud-tool-registry
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Cloud tool registry

When your agents are connected to Portia Cloud, they gain access to an extensive tool registry with powerful integrations.
The registry includes popular services like Gmail, Google Calendar, Slack, GitHub, Zendesk, and many more.
You can check out the full list <a href="https://app.portialabs.ai/dashboard/tool-registry" target="_blank"> in the dashboard ↗</a>.
Authentication for these tools is handled seemlessly by Portia using MCP's OAuth flow.
This means all tools are available using just the Portia API key and you don't have to worry about implementing OAuth flows or tokens yourself!

<figure style={{ textAlign: 'center' }}>
  <img src="/img/tool_registry.png" alt="Tool registry" />
  <figcaption>A snippet of our tool registry</figcaption>
</figure>

The registry is fully configurable, giving you the ability to customise your agents and control which tools they have access to. We also support remote MCP execution within our tool registry, meaning the registry is growing rapidly as API providers bring out their own remote MCP server.

:::info[Coming soon - Register your own MCP server]
Support for connecting your own remote MCP servers is coming soon, allowing you to integrate custom tools and services directly into your Portia workflow.
:::


## Enabling and Disabling Tools

An application is a collection of tools. The application can either be developed by Portia or it could be a remote MCP server that we can establish a streamable HTTP connection to. When you enable an application, all tools in this app become available to your agent. Applications can be easily enabled and disabled in the UI by:
1. Clicking on the 'Enable' / 'Disable' button when you hover over the application.
2. Configuring access - for MCP OAuth, you'll automatically be redirected to the login page to provide access. This is needed because MCP requires authentication in order to list the available tools.
3. Once this is done, the tool is configured and you'll be able to view the available tools under the application in the dashboard.

<figure style={{ textAlign: 'center' }}>
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <video width="50%" autoPlay playsInline muted loop>
      <source src="/img/tool_hover.mp4" type="video/mp4" />
    </video>
  </div>
  <figcaption>Quickly enable and disable tools hovering over them</figcaption>
</figure>


It is important to choose your enabled tools carefully to avoid tool clashes. For example, if you wish to enable Microsoft Outlook, you should disable Gmail so that the agent knows which email provider to choose when you give it prompts like 'send an email'.
