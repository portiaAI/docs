---
sidebar_position: 3
slug: /intro-to-tools
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Cloud tool registry

When your agents are connected to Portia Cloud, they gain access to an extensive tool registry with powerful integrations.
The registry includes popular services like Gmail, Google Calendar, Slack, GitHub, Zendesk, and many more.
You can check out the full list <a href="https://app.portialabs.ai/dashboard/tool-registry" target="_blank"> in the dashboard ↗</a>.

<figure style={{ textAlign: 'center' }}>
  <img src="/img/tool_registry.png" alt="Tool registry" />
  <figcaption>A snippet of our tool registry</figcaption>
</figure>

The registry is fully configurable, giving you the ability to customise your agents and control which tools they have access to. We also support remote MCP execution within our tool registry, meaning the registry is growing rapidly as API providers bring out their own remote MCP server.

:::info[Coming soon - Register your own MCP server]
Support for connecting your own remote MCP servers is coming soon, allowing you to integrate custom tools and services directly into your Portia workflow.
:::



## Enabling and Disabling Tools

Applications can be easily enabled and disabled in the UI by clicking on the 'Enable' / 'Disble' button when you hover over the application.
When you enable a tool, it immediately becomes available for your agents to use in their tasks.

<figure style={{ textAlign: 'center' }}>
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <video width="50%" autoPlay playsInline muted loop>
      <source src="/img/tool_hover.mp4" type="video/mp4" />
    </video>
  </div>
  <figcaption>Quickly enable and disable tools hovering over them</figcaption>
</figure>


When you enable an application, you may be required to authenticate that application.
This is due to the way MCP is implemented - you must authenticate in order for the tools list to be available.

It is important to choose your enabled tools carefully to avoid tool clashes. For example, if you wish to enable Microsoft Outlook, you should disable Gmail so that the agent knows which email provider to choose when you give it prompts like 'send an email'.
