---
sidebar_position: 2
slug: /tool-selection
---

# Tool selection
Learn how to select the tools that the LLM can use to answer a user query.
:::tip[TL;DR]
- You can specify the tools that the LLM can use to answer a user query by using the `tools` argument in your `Portia` instance. If you don't specify this, the `Portia` instance will use a default set of tools.
- Tool registries are useful to group frequently used tools together. They are represented by the `ToolRegistry` class (<a href="/SDK/portia/tool_registry" target="_blank">**SDK reference ↗**</a>).
:::

## Overview of tool selection
As part of defining your `Portia` instance for a query, you can specify the tools that the LLM can use to answer the query. This is done by specifying the `tools` argument in the `Portia` instance definition.

```python
from portia import (
  default_config, 
  Portia,
)
from portia.open_source_tools.calculator_tool import CalculatorTool
from portia.open_source_tools.search_tool import SearchTool
from portia.open_source_tools.weather import WeatherTool

# Instantiate a Portia instance. Load it with the default config and with the example tools.
portia = Portia(tools=[CalculatorTool(), SearchTool(), WeatherTool()])
```

If you don't specify the `tools` argument, your `Portia` instance will use a default set of tools.

:::info[Default tools]
The default tool set comprises:
* The [open source tool set](https://docs.portialabs.ai/open-source-tools), with the Search tool and Weather tool only included if you have the corresponding Tavily / OpenWeatherMap API keys specified.
* If you have an API key for Portia Cloud, the tools from your cloud tool registry.
Further information on this tool registry, including how it can be configured, can be found on the <a href="/cloud-tool-registry" target="_blank">Cloud tool registry page ↗</a>. Our cloud tool registry contains an extensive tool catalog, including:
  * [Slack tools](https://docs.portialabs.ai/slack-tools)
  * [Google gSuite tools](https://docs.portialabs.ai/gsuite-tools)§
  * [Zendesk tools](https://docs.portialabs.ai/zendesk-tools)
  * [GitHub tools](https://docs.portialabs.ai/github-tools)
:::

## Tool registries

A tool registry is a collection of tools and is represented by the `ToolRegistry` class (<a href="/run-portia-tools" target="_blank">**SDK reference ↗**</a>). Tool registries are useful to group frequently used tools together, e.g. you could imagine having a tool registry by function in your organisation. Portia's default tool registry can be accessed by calling `DefaultToolRegistry(config=default_config())`.

```python
from dotenv import load_dotenv
from portia import (
    DefaultToolRegistry,
    Portia,
    default_config,
)
from portia.open_source_tools.calculator_tool import CalculatorTool
from portia.open_source_tools.search_tool import SearchTool
from portia.open_source_tools.weather import WeatherTool

load_dotenv()

# Instantiate a Portia instance. Load it with the example tools and Portia's tools.
portia = Portia(tools=DefaultToolRegistry(default_config()))
```

## Available tools

When setting up your tool registry, there are four sources of tools you can use: our open-source tools, our Portia cloud tools, your own MCP tool registry and custom code tools.

### Open source tools

Portia provides an open source tool registry that contains a selection of general-purpose utility tools. For example, it includes a Tavily tool for web search, an OpenWeatherMap tool for determining weather and a PDF reader tool, among many others.
The open source tool registry can be used as follows, though for some of the tools you will need to retrieve an API key first:

```python
from portia import open_source_tool_registry, Portia

portia = Portia(tools=open_source_tool_registry)
```

For more details, check out our <a href="https://docs.portialabs.ai/portia-tools/open-source/" target="_blank">open-source tool documentation ↗</a>.

### Portia cloud registry

Portia cloud provides an extensive tool registry to speed up your agent development, with authentication handled seamlessly by Portia for you.
You can select any MCP server with an official remote server implementation from our Tool registry dashboard and connect it to your account. We are rapidly growing our library as providers bring out new remote MCP servers. If you'd like to add a missing or proprietary remote MCP server to your Portia cloud registry and rely on Portia to handle authentication for you, you can do that from the dashboard as well.
Finally Portia cloud also includes some in-house-built tools that don't have an official MCP server implementation e.g. Google and Microsoft productivity tools.

Your Portia tool registry is available through the  `PortiaToolRegistry` class (<a href="/run-portia-tools" target="_blank">**SDK reference ↗**</a>). This gives access to all the tools you have enabled in your registry:

```python
from portia import Portia, PortiaToolRegistry

portia = Portia(tools=PortiaToolRegistry())
```

More details can be found on our <a href="https://docs.portialabs.ai/cloud-tool-registry" target="_blank">Cloud tool registry ↗</a> page, including how to enable / disable tools within the registry and how to connect in your own remote MCP server.

### Integrate your own MCP servers [SDK-only option]

You can easily add any local or remote MCP servers directly into a Portia agent through our `McpToolRegistry` class.
The key difference between integrating an MCP server this way and through the Portia cloud registry is that authentication needs to be handled manually when integrating directly into the Portia instance.
The MCP server can be added to your Portia instance as follows, with more details available on our <a href="/mcp-servers" target="_blank">integrating MCP servers ↗</a> page.

```python
from portia import Portia, McpToolRegistry

tool_registry = (
    # Assumes server is running on port 8000
    McpToolRegistry.from_sse_connection(
        server_name="mcp_sse_example_server",
        url="http://localhost:8000",
    )
)
portia = Portia(tools=tool_registry)
```

### Custom tools

As outlined in the <a href="/mcp-servers" target="_blank">Introduction to tools ↗</a>, it is easy to define your own tools in python code with Portia. In (<a href="/adding-custom-tools" target="_blank">**Adding custom tools ↗**</a>), we'll walk through how to do this in more detail by creating our own tool registries with custom tools.

## Filtering tool registries

You can create new tool registries from existing ones by filtering tools to your desired subset. For example, you might want to prevent one of your agents from accessing emails in Gmail. This can be done by setting up a filter to exclude the Gmail tools from the registry:

```python
from dotenv import load_dotenv
from portia import (
    Portia,
    PortiaToolRegistry,
    Tool,
    default_config,
)

load_dotenv()

def exclude_gmail_filter(tool: Tool) -> bool:
    return not tool.id.startswith("portia:google:gmail:")

registry = PortiaToolRegistry(config=default_config()).filter_tools(exclude_gmail_filter)
portia = Portia(tools=registry)
```
