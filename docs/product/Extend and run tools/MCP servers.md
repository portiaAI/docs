---
sidebar_position: 5
slug: /mcp-servers
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Integrating an MCP Server

The Model Context Protocol (MCP) (<a href="https://modelcontextprotocol.io/" target="_blank">**↗**</a>) makes it very easy to integrate third-party tools into your Portia Agent:

<Tabs>
  <TabItem value="mcp_stdio" label="mcp_stdio_example.py">
    ```python title="mcp_stdio_example.py"
    from portia import (
        DefaultToolRegistry,
        Portia,
        McpToolRegistry,
        Config,
    )

    config = Config.from_default()

    tool_registry = (
        # Integrates the Stripe MCP server from 
        # https://github.com/stripe/agent-toolkit/tree/main/modelcontextprotocol
        McpToolRegistry.from_stdio_connection(
            server_name="stripe",
            command="npx",
            args=[
                "-y",
                "@stripe/mcp",
                "--tools=all",
                f"--api-key={os.environ['STRIPE_API_KEY']}",
            ],
        )
        + DefailtToolRegistry()
    )

    portia = Portia(config=config, tools=tool_registry)
    ```
  </TabItem>
  <TabItem value="mcp_sse" label="mcp_sse_example.py">
    ```python title="mcp_sse_example.py"
    from portia import (
        DefaultToolRegistry,
        Portia,
        McpToolRegistry,
        Config,
    )

    config = Config.from_default()

    tool_registry = (
        # Assumes server is running on port 8000
        McpToolRegistry.from_sse_connection(
            server_name="mcp_sse_example_server",
            url="http://localhost:8000",
        )
        + DefailtToolRegistry()
    )

    portia = Portia(config=config, tools=tool_registry)
    ```
  </TabItem>
</Tabs>

There are two ways to integrate an MCP server:

- **stdio** (Standard input/output): The server runs as a subprocess of you main python process.
- **sse** (Server-Sent Events): Communication is over HTTP, you can run the server locally or deploy a server remotely.

To find out more, see the official MCP docs for more (<a href="https://modelcontextprotocol.io/docs/concepts/transports" target="_blank">**↗**</a>).

:::info[Pre-requisites]
To run the stdio example, you would need to make sure `npx` (<a href="https://docs.npmjs.com/cli/v8/commands/npx" target="_blank">**↗**</a>) is available in your environment. Many MCP servers are currently provided to run in this way, usually either run with the `npx` or `uvx` (<a href="https://docs.astral.sh/uv/guides/tools/" target="_blank">**↗**</a>) command.
:::

Portia will pull in the tool definitions from the MCP server, making them available to the Planner and Execution Agents.

There are many open source MCP servers already available: check out the list of servers on the official MCP github repository (<a href="https://github.com/modelcontextprotocol/servers" target="_blank">**↗**</a>).