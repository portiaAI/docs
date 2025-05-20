---
sidebar_position: 5
slug: /mcp-servers
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Integrating an MCP Server

The Model Context Protocol (MCP) makes it very easy to integrate third-party tools into your Portia AI project. To find out more you can visit the official MCP docs (<a href="https://modelcontextprotocol.io/" target="_blank">**↗**</a>). We offer the two methods currently available to interact with MCP servers:

- **stdio** (Standard input/output): The server runs as a subprocess of your main python process. Below we interact with that process via an npx command and a docker command provided with the correct arguments.
- **sse** (Server-Sent Events): Communication is over HTTP, you can run the server locally or deploy a server remotely. Per below, you just need to specify the current server name and URL.

To find out more about these options, see the official MCP docs (<a href="https://modelcontextprotocol.io/docs/concepts/transports" target="_blank">**↗**</a>).

The `server_name` argument is used by Portia to identify where tools have come from, you can set this to whatever makes most sense for the MCP server you are integrating. If you re-use old `Plan` objects later on, make sure to use the same `server_name` with the MCP server.

<Tabs>
  <TabItem value="mcp_stdio" label="mcp_stdio_example.py">
    ```python title="mcp_stdio_example.py"
    import os

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
                f"--api-key={os.getenv('STRIPE_API_KEY')}",
            ],
        )
        # Integrates an MCP server using docker
        + McpToolRegistry.from_stdio_connection(
            server_name="github",
            command="docker",
            args=[
                "run",
                "-i",
                "--rm",
                "-e",
                "GITHUB_PERSONAL_ACCESS_TOKEN",
                "ghcr.io/github/github-mcp-server"
            ],
            "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR TOKEN>"
            }
        )
        + DefaultToolRegistry(config)
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
        + DefaultToolRegistry(config)
    )

    portia = Portia(config=config, tools=tool_registry)
    ```
  </TabItem>
</Tabs>

:::info[Pre-requisites]
To run the stdio example, make sure `npx` is available in your environment. Many MCP servers are currently provided to run in this way, usually either run with the `npx` or `uvx` command. For other MCP servers that use `docker`, make sure that `docker` is available and running in your environment.
:::

When you provide a `McpToolRegistry`, Portia will pull in the tool definitions from the MCP server, making them available to the Planner and Execution Agents during a plan run. To see an example of this implementation, head over to our agent-examples repo where we built an agent to manage customer refunds (<a href="https://github.com/portiaAI/portia-agent-examples/tree/main/refund-agent-mcp" target="_blank">**↗**</a>).

There are many open source MCP servers already available: check out the list of servers on the official MCP github repository (<a href="https://github.com/modelcontextprotocol/servers" target="_blank">**↗**</a>).