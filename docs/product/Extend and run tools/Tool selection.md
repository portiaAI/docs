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
* If you have an API key for Portia Cloud, the default Portia Cloud tools, which consists of:
  * [Slack tools](https://docs.portialabs.ai/slack-tools)
  * [Google gSuite tools](https://docs.portialabs.ai/gsuite-tools)§
  * [Zendesk tools](https://docs.portialabs.ai/zendesk-tools)
  * [GitHub tools](https://docs.portialabs.ai/github-tools)
:::

## Tool registries

A tool registry is a collection of tools and is represented by the `ToolRegistry` class (<a href="/run-portia-tools" target="_blank">**SDK reference ↗**</a>). Tool registries are useful to group frequently used tools together, e.g. you could imagine having a tool registry by function in your organisation. Portial's default tool registry can be accessed by calling `DefaultToolRegistry(config=default_config())`.

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

All of Portia's Cloud tools are available in the `PortiaToolRegistry` class (<a href="/run-portia-tools" target="_blank">**SDK reference ↗**</a>). You can access individual tools from this registry and combine them with your own tools to produce a new tool registry:

```python
from dotenv import load_dotenv
from portia import (
    default_config,
    InMemoryToolRegistry,
    Portia,
    PortiaToolRegistry,
)
from portia.open_source_tools.calculator_tool import CalculatorTool
from portia.open_source_tools.search_tool import SearchTool
from portia.open_source_tools.weather import WeatherTool


load_dotenv()

# Instantiate a Portia instance. Load it with the example tools and Portia's github search tool.
github_search_tool = PortiaToolRegistry(config=default_config()).get_tool("portia:github::search_repos")
my_registry = InMemoryToolRegistry().from_local_tools(
    [CalculatorTool(), SearchTool(), WeatherTool(), github_search_tool])

portia = Portia(tools=([CalculatorTool(), SearchTool(), WeatherTool(), github_search_tool]))
```

You can also create a new tool registry by filtering tools from `PortiaToolRegistry` to create the subset you want. For example, the default tool registry includes Gmail as the email client but you might want to instead use Outlook. This can be done by setting up a filter to only include the Outlook tools from the registry:

```python
from dotenv import load_dotenv
from portia import (
    Portia,
    PortiaToolRegistry,
    Tool,
    default_config,
)

load_dotenv()

def include_outlook_filter(tool: Tool) -> bool:
    return tool.id.startswith("portia:microsoft:outlook:")

registry = PortiaToolRegistry(config=default_config()).filter_tools(include_outlook_filter)
portia = Portia(tools=registry)
```

In (<a href="/adding-custom-tools" target="_blank">**Adding custom tools ↗**</a>) you'll see how to create your own tool registries with custom tools.


