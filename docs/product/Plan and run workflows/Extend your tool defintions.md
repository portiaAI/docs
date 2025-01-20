---
sidebar_position: 3
slug: /extend-tool-definitions
---

# Manage tool definitions 
Understand tools at Portia and add your own.
:::tip[TL;DR]
- Tools are used by LLMs as part of their response to indicate that a particular software service or data store is required to fulfil a user's query.
- We represent a tool with the `Tool` class (<a href="/SDK/portia/tool" target="_blank">**SDK reference ↗**</a>). The LLM parses the tool properties, namely its name, description, input and output schemas to determine whether the tool is relevant to its response and how to invoke it.
- Tool registries are useful to group frequently used tools together. They are represented by the `Tool_registry` class (<a href="/SDK/portia/tool_registry" target="_blank">**SDK reference ↗**</a>).
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
from portia.tool import Tool
from portia.context import ExecutionContext


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

    def run(self, _: ExecutionContext, filename: str, content: str) -> str:
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
- Every tool has a `run` function which is the actual tool implementation. The method always takes `ExecutionContext` which is contextual information implicitly passed by the runner. We will look into this more deeply in a future section (<a href="/manage-end-users" target="_blank">**Manage execution context ↗**</a>). The only thing to note now is that you have to include this argument and always import the underlying dependency.

:::note[Track tool calls in logs]
You can track tool calls live as they occur through the logs by setting `default_log_level` to DEBUG in the `Config` of your Portia `Runner` (<a href="/manage-config#manage-logging" target="_blank">**Manage logging ↗**</a>).
:::

## Adding your own custom tools
<details>
<summary>**OpenWeatherMap API key required**</summary>

We will use a simple GET endpoint from OpenWeatherMap in this section. Please sign up to obtain an API key from them (<a href="https://home.openweathermap.org/users/sign_in" target="_blank">**↗**</a>) and set it in the environment variable `OPENWEATHERMAP_API_KEY`.
</details>

### Tool registries
Before we attempt to create custom tools, let's touch on the concept of tool registries. A tool registry is a collection of tools and is represented by the `Tool_registry` class (<a href="/run-portia-tools" target="_blank">**SDK reference ↗**</a>). Tool registries are useful to group frequently used tools together, e.g. you could imagine having a tool registry by function in your organisation. You can load tool registries either from memory (i.e. from within your project) or Portia's cloud (<a href="/SDK/portia/tool_registry" target="_blank">**Run Portia tools ↗**</a>). In the next section we're going to use registries to group our custom tools together.

### Add a custom tool
Let's build a custom tool that allows an LLM to write content to a local file. We're going to create our custom tools in a separate folder called `my_custom_tools` at the root of the project directory and create a `file_writer_tool.py` file within it, with the following:
```python title="file_writer_tool.py"
from pathlib import Path
from pydantic import BaseModel, Field
from portia.tool import Tool
from portia.context import ExecutionContext


class FileWriterToolSchema(BaseModel):
    """Schema defining the inputs for the FileWriterTool."""

    filename: str = Field(..., 
        description="The location where the file should be saved",
    )
    content: str = Field(..., 
        description="The content to write to the file",
    )


class FileWriterTool(Tool):
    """Writes content to a file."""

    id: str = "file_writer_tool"
    name: str = "File writer tool"
    description: str = "Writes content to a file locally"
    args_schema: type[BaseModel] = FileWriterToolSchema
    output_schema: tuple[str, str] = ("str", "A string indicating where the content was written to")

    def run(self, _: ExecutionContext, city: str) -> str:
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

Now we're going to load our custom tool (along with any future ones) into its own in-memory registry called `my_custom_tool_registry`. To load a list of local tools into an in-memory tool registry, we can use the `from_local_tools` method, which takes a list of `Tool` objects as parameter.<br/>
We can combine any number of tool registries into a single one with the `+` operator. In this case we will now combine our custom tool(s) with the `example_tool_registry` using `complete_tool_registry = example_tool_registry + my_custom_tool_registry`.

```python title="main.py"
import json
from portia.runner import Runner
from portia.config import default_config
from portia.tool_registry import InMemoryToolRegistry
from portia.open_source_tools.registry import example_tool_registry
from my_custom_tools.file_writer_tool import FileWriterTool

# Load custom tools into its own tool registry.
my_custom_tool_registry = InMemoryToolRegistry.from_local_tools([FileWriterTool()])
# Aggregate all tools into a single tool registry.
complete_tool_registry = example_tool_registry + my_custom_tool_registry
# Instantiate a Portia runner. Load it with the default config and with the tools above
runner = Runner(config=default_config(), tool_registry=complete_tool_registry)

# Generate the plan from the user query
output = runner.run_query('Check the temperature in Cooladdi, Australia and write the result to "demo_runs/weather_result.txt"')

# Serialise into JSON and print the output
print(output.model_dump_json(indent=2))
```
:::note[Register a single tool]
The `register_tool` method allows you to load individual tools into an in-memory tool registry. In the particular example above where we are looking to add a single local tool to the example ones, we could have started by initialising the `complete_tool_registry` with the tools from the `example_tool_registry`, and then added the `FileWriterTool` using the `register_tool` method like so:
```python
# Load custom tools into its own tool registry.
complete_tool_registry = example_tool_registry
complete_tool_registry.register_tool(FileWriterTool())
```
:::

You should now expect to see the weather information about the smallest town in Australia to be printed in a weather_results.text file inside a `demo_runs` folder as specified.
```text title="demo runs > weather_results.txt"
The current weather in Cooladdi, Australia is clear sky with a temperature of 26.55°C.
```

## Tool errors at Portia
If a tool returns a generic error (e.g. one of the many built-in Python error classes), the LLM may not always detect that an Agent failed at a particular step or adopt the behaviour we want them to. This is where Portia's two `Error` types come in (<a href="/SDK/portia/errors" target="_blank">**SDK reference ↗**</a>):
- `ToolSoftError` is used when the Agent fails during a tool call but it is worth a retry. For example sometimes the Agent constructs a tool call with incorrect arguments resulting a `400` API error and a useful error code. Passing that error code back to the `Runner` in a `ToolSoftError` informs it where things went wrong and it can often recover by rewriting its tool call as a result.
- `ToolHardError` is used when we know the Agent encounters a permanent error or exception. One example could be a `401` invalid API key error, or a permission breach. In such cases we return the error in a `ToolHardError` which signals to the `Runner` that it should exit the workflow in a FAILED state.

To test this you could add the following `ToolHardError` calls into the `FileWriterTool` from the previous section like so:
```python title=file_writer_tool.py
from pathlib import Path
from pydantic import BaseModel, Field
from portia.tool import Tool
from portia.context import ExecutionContext
from portia.errors import ToolHardError


class FileWriterToolSchema(BaseModel):
    """Schema defining the inputs for the FileWriterTool."""

    filename: str = Field(..., 
        description="The location where the file should be saved",
    )
    content: str = Field(..., 
        description="The content to write to the file",
    )


class FileWriterTool(Tool):
    """Writes content to a file."""

    id: str = "file_writer_tool"
    name: str = "File writer tool"
    description: str = "Writes content to a file locally"
    args_schema: type[BaseModel] = FileWriterToolSchema
    output_schema: tuple[str, str] = ("str", "A string indicating where the content was written to")

    def run(self, _: ExecutionContext, city: str) -> str:
        """Run the FileWriterTool."""

        # Check if the file path is valid
        # highlight-start
        if filename and not self.validate_file_path(filename):
            raise ToolHardError(f"{filename} is not within the 'demo_runs' directory. You are now dismissed.")
        #highlight-end

        filepath = Path(filename)
        if filepath.is_file():
            with open(filepath, "w") as file:
                file.write(content)
        else:
            with open(filepath, "x") as file:
                file.write(content)
        return f"Content written to {filename}"

    # highlight-start
    def validate_file_path(self, filename: str) -> bool:
        """Validate the file path."""

        valid_path = Path("demo_runs").resolve()
        file_path = Path(filename).resolve()
        return file_path.is_relative_to(valid_path)
    #highlight-end
```

The lines we added will raise a hard error if the file path is not with the `demo_runs` folder per the `validate_file_path` method. Throwing to test this such an error should result in a FAILED workflow state and a `final_output` elucidating the error. To test this you can run the code below where explicitly point the `FileWriterTool` to an invalid directory to trigger the hard error.
```python title=main.py
from portia.runner import Runner
from portia.config import default_config
from portia.tool_registry import InMemoryToolRegistry
from my_custom_tools.file_writer_tool import FileWriterTool

# Load demo tools into a tool registry and custom tools into its own tool registry.
my_custom_tool_registry = InMemoryToolRegistry.from_local_tools([FileWriterTool()])
# Instantiate a Portia runner. Load it with the default config and with the tools above
runner = Runner(config=default_config(), tool_registry=my_custom_tool_registry)

# Generate the plan from the user query
workflow = runner.run_query('Write hello world to a file called "demo_buns/file.txt"')
print(workflow.model_dump_json(indent=2))
```

You should expect to see an ERROR raised in the logs like so:
```bash
2025-01-13 18:52:06.936 | ERROR | portia.runner:_execute_workflow:156 - error: Tool File writer tool failed: Error: ToolHardError(
    # highlight-next-line
    "demo_buns/file.txt is not within the 'demo_runs' directory. You are now dismissed.")
 Please fix your mistakes.
 ```
 And a workflow with a FAILED state and an output outlining the error:
 ```json title=workflow_error.py
 {
  "id": "7fbd90e9-9546-4c42-a01d-c12736aca895",
  "plan_id": "912dda96-c20e-4c40-9e60-5388fd8055a0",
  "current_step_index": 0,
  "clarifications": [],
  # highlight-next-line
  "state": "FAILED",
  "step_outputs": {
    "$write_status": {
      "value": "Tool File writer tool failed: Error: ToolHardError(\"demo_buns/file.txt is not within the 'demo_runs' directory. You are now dismissed.\")\n Please fix your mistakes."
    }
  },
  # highlight-start
  "final_output": {
    "value": "Tool File writer tool failed: Error: ToolHardError(\"demo_buns/file.txt is not within the 'demo_runs' directory. You are now dismissed.\")\n Please fix your mistakes."
  # highlight-end
  }
}
```

## List tools in a registry

You can fetch all tools in a given `ToolRegistry` using the `get_tools` method or a specific tool by name using the `get_tool` method. Feel to free to try this out.
```python
from portia.example_tools import example_tool_registry

# Get all tools in a registry
for tool in example_tool_registry.get_tools():
    print(tool)

# Get a specific tool by name
single_tool = example_tool_registry.get_tool('Weather Tool')
print(f"\nFetched a single tool:\n{single_tool}")
```

With custom tools you can now wrap any internal and external utilities, software services and data stores in natural language and expose them to your LLM. There will be instances when you want to signal to the LLM that human input is required before proceeding further. Let's look at how we unlock this feature in the next section.