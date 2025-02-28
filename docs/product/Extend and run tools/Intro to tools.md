---
sidebar_position: 1
slug: /intro-to-tools
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Introduction to tools
Understand tools at Portia and add your own.
:::tip[TL;DR]
- Tools are used by LLMs as part of their response to indicate that a particular software service or data store is required to fulfil a user's query.
- We represent a tool with the `Tool` class (<a href="/SDK/portia/tool" target="_blank">**SDK reference ↗**</a>). The LLM parses the tool properties, namely its name, description, input and output schemas to determine whether the tool is relevant to its response and how to invoke it.
:::

## Tools at Portia
A tool is a natural language wrapper around a data source or software service that the LLM can point to in order to accomplish tasks beyond its inherent capabilities. As a simple example, an LLM could respond to the user query `email avrana@kern.ai and tell her that spiders are now sentient` by suggesting a call to the email sending service wrapped in the `send_email` tool.

We represent a tool with the `Tool` class (<a href="/SDK/portia/tool" target="_blank">**SDK reference ↗**</a>). Let's look at the `weather_tool` provided with our SDK as an example:
```python title="weather_tool.py"
"""Tool to get the weather from openweathermap."""
import os
import httpx
from pydantic import BaseModel, Field
from portia.errors import ToolHardError, ToolSoftError
from portia.tool import Tool, ToolRunContext


class WeatherToolSchema(BaseModel):
    """Input for WeatherTool."""

    city: str = Field(..., description="The city to get the weather for")


class WeatherTool(Tool[str]):
    """Get the weather for a given city."""

    id: str = "weather_tool"
    name: str = "Weather Tool"
    description: str = "Get the weather for a given city"
    args_schema: type[BaseModel] = WeatherToolSchema
    output_schema: tuple[str, str] = ("str", "String output of the weather with temp and city")

    def run(self, _: ToolRunContext, city: str) -> str:
        """Run the WeatherTool."""
        api_key = os.getenv("OPENWEATHERMAP_API_KEY")
        if not api_key or api_key == "":
            raise ToolHardError("OPENWEATHERMAP_API_KEY is required")
        url = (
            f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
        )
        response = httpx.get(url)
        response.raise_for_status()
        data = response.json()
        if "weather" not in data:
            raise ToolSoftError(f"No data found for: {city}")
        weather = data["weather"][0]["description"]
        if "main" not in data:
            raise ToolSoftError(f"No main data found for city: {city}")
        temp = data["main"]["temp"]
        return f"The current weather in {city} is {weather} with a temperature of {temp}°C."
```

Here are the key points to look out for:
- All properties of a tool are parsed by the LLM to determine whether that tool is salient to a user's query and should therefore be invoked in response to it.
- The `args_schema` property describes the tool inputs. This is important to help the LLM understand what parameters it can invoke a tool with.
- The `output_schema` property describes the expected output of the tool. This helps the LLM know what to expect from the tool and informs its sequencing decisions for tool calls as well.
- Every tool has a `run` function which is the actual tool implementation. The method always takes `ToolRunContext` which is contextual information implicitly passed by the portia. We will look into this more deeply in a future section (<a href="/manage-end-users" target="_blank">**Manage execution context ↗**</a>). The only thing to note now is that you have to include this argument and always import the underlying dependency.

:::note[Track tool calls in logs]
You can track tool calls live as they occur through the logs by setting `default_log_level` to DEBUG in the `Config` of your Portia `Portia` instance (<a href="/manage-config#manage-logging" target="_blank">**Manage logging ↗**</a>).
:::