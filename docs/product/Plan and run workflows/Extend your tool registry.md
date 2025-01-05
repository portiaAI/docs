---
sidebar_position: 3
---

# Extend your tool definitions 
Understand tools at Portia and add your own.
:::tip[TL;DR]
- Stuff goes here (<a href="/SDK/portia/runner" target="_blank">**SDK reference ↗**</a>).
:::

## Tools at Portia
A tool is a natural language wrapper around a data source or software service that the LLM can point to in order to accomplish tasks beyond its inherent capabilities. As a simple example, an LLM could respond to the user query `email avrana@kern.ai and tell her that spiders are now sentient` by suggesting a call to the email sending service wrapped in the `send_email` tool.

We represent a tool with the `tool` class (<a href="/SDK/portia/tool" target="_blank">**SDK reference ↗**</a>). Let's look at the `weather_tool` provided with our SDK as an example:
```python weather_tool.py
class WeatherToolSchema(BaseModel):
    """Input for WeatherTool."""

    city: str = Field(..., description="The city to get the weather for")

class WeatherTool(Tool):
    """Get the weather for a given city."""

    id: str = "weather_tool"
    name: str = "Weather Tool"
    description: str = "Get the weather for a given city"
    args_schema: type[BaseModel] = WeatherToolSchema
    output_schema: tuple[str, str] = ("str", "String output of the weather with temp and city")

    def run(self, city: str) -> str:
        """Run the WeatherTool."""
        # Function logic here
        api_key = OPENWEATHERMAP_API_KEY
        url = (
            f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
        )
        client = Client(timeout=10.0, default_encoding="utf-8", transport=HTTPTransport(retries=3))
        response = client.get(url)
        
        data = response.json()
        weather = data["weather"][0]["description"]
        temp = data["main"]["temp"]
        return f"The current weather in {city} is {weather} with a temperature of {temp}°C."

```
Here are the key points to look out for:
- All properties of a tool are parsed by the LLM to determine whether that tool is salient to a user's query and should therefore be invoked in response to it.
- The `args_schema` property describes the tool inputs. This is important to help the LLM understand what parameters it can invoke a tool with.
- The `output_schema` property describes the expected output of the tool. This helps the LLM know what to expect from the tool and informs its sequencing decisions for tool calls as well.
- Every tool has a `run` function which is the actual tool implementation.

To see how an LLM invokes tools in real-time, we can enable logging and look at the workflow run...
[NEED LOGGING FROM TOM@ HERE]

## Adding your own custom tools

### Tool registries
Before we attempt to create custom tools, let's touch on the concept of tool registries. A tool registry is a collection of tools and is represented by the `tool_registry` class (<a href="/product/Use%20Portia%20tools%20and%20workflow%20service/Run%20Portia%20tools" target="_blank">**SDK reference ↗**</a>). Tool registries are useful to group frequently used tools together, e.g. you could imagine having a tool registry by function in your organisation. You can load tool registries from different sources as well e.g. from memory, disk or Portia's cloud (<a href="/SDK/portia/tool_registry" target="_blank">**Run Portia tools ↗**</a>). In the next section we're going to use registries to group our custom tools together.

### Add a custom tool
Let's build a custom tool that allows an LLM to write content to a local file. We're going to create our custom tools in a separate folder called `my_custom_tools` at the root of the project directory and create a `file_writer_tool.py` file within it, with the following:
```python title="file_writer_tool.py"
from pathlib import Path
from pydantic import BaseModel, Field
from portia.tool import Tool

class FileWriterToolSchema(BaseModel):
    """Schema defining the inputs for the FileWriterTool."""

    filename: str = Field(
        description="The location where the file should be saved",
    )
    content: str = Field(
        description="The content to write to the file",
    )

class FileWriterTool(Tool):
    """Writes content to a file."""

    id: str = "file_writer_tool"
    name: str = "File writer tool"
    description: str = "Writes content to a file locally"
    args_schema: type[BaseModel] = FileWriterToolSchema
    output_schema: tuple[str, str] = ("str", "A string indicating where the content was written to")

    def run(self, filename: str, content: str) -> str:
        """Run the FileWriterTool."""
        print(f"Writing content to {filename}")
        filepath = Path(filename)
        if filepath.is_file():
            with open(filepath, "w") as file:
                file.write(content)
        else:
            with open(filepath, "x") as file:
                file.write(content)
        return f"Content written to {filename}"
```

The tool expects a `filename` (including the file path) and the `content` that needs to be written into it. If a file already exists at the specified location its content will be overwritten.

Now we're going to load the demo tools we've looked at in previous sections into their own tool registry, `demo_tool_registry`, while our custom tool (along with any future ones) will be loaded into its own registry `my_custom_tool_registry`. We can easily combine any number of tool registries into a single one as we then do when we define `complete_tool_registry` with `complete_tool_registry = demo_tool_registry + my_custom_tool_registry`.
```python title="main.py"
from portia.runner import Runner
from portia.config import default_config
from portia.tool_registry import InMemoryToolRegistry
from demo_tools.addition_tool import AdditionTool
from demo_tools.weather_tool import WeatherTool
from my_custom_tools.file_writer_tool import FileWriterTool

# Load demo tools into a tool registry and custom tools into its own tool registry.
demo_tool_registry = InMemoryToolRegistry.from_local_tools([AdditionTool(), WeatherTool()])
my_custom_tool_registry = InMemoryToolRegistry.from_local_tools([FileWriterTool()])
# Aggregate all tools into a single tool registry.
complete_tool_registry = demo_tool_registry + my_custom_tool_registry
# Instantiate a Portia runner. Load it with the default config and with the tools above
runner = Runner(config=default_config(), tool_registry=complete_tool_registry)

# Execute the workflow from the user query
output = runner.run_query('Check the temperature in Cooladdi, Australia and write the result to "demo_runs/weather_result.txt"')
# Serialise into JSON an print the output
print(output.model_dump_json())

```
You should expect to see the weather information about the smallest town in Australia printed in a weather_results.text file inside a demo_runs folder as specified.
```text title="demo runs > weather_results.txt"
The current weather in Cooladdi, Australia is clear sky with a temperature of 26.55°C.
```

With custom tools you can now wrap any internal and external utilities, software services and data stores in natural language and expose them to your LLM. There will be instances when you want to signal to the LLM that human input is required before proceeding further. Let's look at how we unlock this feature in the next section.