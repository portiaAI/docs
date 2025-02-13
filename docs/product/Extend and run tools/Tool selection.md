---
sidebar_position: 2
slug: /tool-selection
---

# Tool selection
Learn how to select the tools that the LLM can use to answer a user query.
:::tip[TL;DR]
- You must specify the tools that the LLM can use to answer a user query. This is done by specifying the `tools` argument in the runner definition.
- Tool registries are useful to group frequently used tools together. They are represented by the `Tool_registry` class (<a href="/SDK/portia/tool_registry" target="_blank">**SDK reference ↗**</a>).
:::

## Overview of tool selection
As part of defining a runner for a query, you must specify the tools that the LLM can use to answer the query. This is done by specifying the `tools` argument in the runner definition.

```python
from portia.runner import Runner
from portia.config import default_config
from portia.open_source_tools.calculator_tool import CalculatorTool
from portia.open_source_tools.search_tool import SearchTool
from portia.open_source_tools.weather import WeatherTool

# Instantiate a Portia runner. Load it with the default config and with the example tools.
runner = Runner(config=default_config(), tools=[CalculatorTool(), SearchTool(), WeatherTool()])
```

## Tool registries

A tool registry is a collection of tools and is represented by the `Tool_registry` class (<a href="/run-portia-tools" target="_blank">**SDK reference ↗**</a>). Tool registries are useful to group frequently used tools together, e.g. you could imagine having a tool registry by function in your organisation. You can access all of the Portia Cloud tools in the `PortiaToolRegistry` class (<a href="/run-portia-tools" target="_blank">**SDK reference ↗**</a>).

```python
from portia.runner import Runner
from portia.config import default_config
from portia.tool_registry import PortiaToolRegistry
from portia.open_source_tools.calculator_tool import CalculatorTool
from portia.open_source_tools.search_tool import SearchTool
from portia.open_source_tools.weather import WeatherTool

load_dotenv()

# Instantiate a Portia runner. Load it with the example tools and Portia's tools.
runner = Runner(config=default_config(),
                tools=([CalculatorTool(), SearchTool(), WeatherTool()]
                        + PortiaToolRegistry(default_config())))
```

You can also access individual tools from the `PortiaToolRegistry` class and combine them with your own tools:

```python
from dotenv import load_dotenv
from portia.runner import Runner
from portia.config import default_config
from portia.tool_registry import PortiaToolRegistry
from portia.open_source_tools.calculator_tool import CalculatorTool
from portia.open_source_tools.search_tool import SearchTool
from portia.open_source_tools.weather import WeatherTool

load_dotenv()

# Instantiate a Portia runner. Load it with the example tools and Portia's github search tool.
github_search_tool = PortiaToolRegistry(config=default_config()).get_tool("portia::search_github_repos_tool")

runner = Runner(config=default_config(),
                tools=([CalculatorTool(), SearchTool(), WeatherTool(), github_search_tool]))
```

If you wanted to group these into a tool registry for future use, you could do so like this:

```python
from portia.tool_registry import InMemoryToolRegistry

my_registry = InMemoryToolRegistry().from_local_tools(
    [CalculatorTool(), SearchTool(), WeatherTool(), github_search_tool])
```

In (<a href="/adding-custom-tools" target="_blank">**Adding custom tools ↗**</a>) you'll see how to create your own tool registries with custom tools.


