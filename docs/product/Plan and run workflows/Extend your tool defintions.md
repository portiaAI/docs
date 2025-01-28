---
sidebar_position: 3
slug: /extend-tool-definitions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
from portia.execution_context import ExecutionContext


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

    def run(self, _: ExecutionContext, city: str) -> str:
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
- Every tool has a `run` function which is the actual tool implementation. The method always takes `ExecutionContext` which is contextual information implicitly passed by the runner. We will look into this more deeply in a future section (<a href="/manage-end-users" target="_blank">**Manage execution context ↗**</a>). The only thing to note now is that you have to include this argument and always import the underlying dependency.

:::note[Track tool calls in logs]
You can track tool calls live as they occur through the logs by setting `default_log_level` to DEBUG in the `Config` of your Portia `Runner` (<a href="/manage-config#manage-logging" target="_blank">**Manage logging ↗**</a>).
:::

## Adding your own custom tools
<details>
<summary>**API keys required**</summary>

We will use a simple GET endpoint from OpenWeatherMap in this section. Please sign up to obtain an API key from them (<a href="https://home.openweathermap.org/users/sign_in" target="_blank">**↗**</a>) and set it in the environment variable `OPENWEATHERMAP_API_KEY`.

We're assuming you already have a Tavily key provisioned from the previous sections in this doc. If not, then head over to their website and do so (<a href="https://tavily.com/" target="_blank">**↗**</a>). We will set it in the environment variable `TAVILY_API_KEY`.
</details>

### Add custom tools
Let's build two custom tools that allow an LLM to write / read content to / from a local file. We're going to create our custom tools in a separate folder called `my_custom_tools` at the root of the project directory and create a `file_writer_tool.py` and `file_reader_tool.py` file within it, with the following:
<Tabs>
  <TabItem value="file_reader" label="file_reader_tool.py">
    ```python title="my_custom_tools/file_reader_tool.py"
    from pathlib import Path
    import pandas as pd
    import json
    from pydantic import BaseModel, Field
    from portia.tool import Tool
    from portia.execution_context import ExecutionContext


    class FileReaderToolSchema(BaseModel):
        """Schema defining the inputs for the FileReaderTool."""

        filename: str = Field(..., 
            description="The location where the file should be read from",
        )


    class FileReaderTool(Tool[str]):
        """Finds and reads content from a local file on Disk."""

        id: str = "file_reader_tool"
        name: str = "File reader tool"
        description: str = "Finds and reads content from a local file on Disk"
        args_schema: type[BaseModel] = FileReaderToolSchema
        output_schema: tuple[str, str] = ("str", "A string dump or JSON of the file content")

        def run(self, _: ExecutionContext, filename: str) -> str | dict[str,any]:       
            """Run the FileReaderTool."""
            
            file_path = Path(filename)
            suffix = file_path.suffix.lower()

            if file_path.is_file():
                if suffix == '.csv':
                    return pd.read_csv(file_path).to_string()
                elif suffix == '.json':
                    with file_path.open('r', encoding='utf-8') as json_file:
                        data = json.load(json_file)
                        return data
                elif suffix in ['.xls', '.xlsx']:
                    return pd.read_excel(file_path).to_string
                elif suffix in ['.txt', '.log']:
                    return file_path.read_text(encoding="utf-8")
    ```
  </TabItem>
  <TabItem value="file_writer" label="file_writer_tool.py">
    ```python title="my_custom_tools/file_writer_tool.py"
    from pathlib import Path
    from pydantic import BaseModel, Field
    from portia.tool import Tool
    from portia.execution_context import ExecutionContext


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
    </TabItem>
</Tabs>

The tool expects a `filename` (including the file path) and the `content` that needs to be written into it. If a file already exists at the specified location its content will be overwritten.

### Organise tools in registries
A tool registry is a collection of tools and is represented by the `Tool_registry` class (<a href="/run-portia-tools" target="_blank">**SDK reference ↗**</a>). Tool registries are useful to group frequently used tools together, e.g. you could imagine having a tool registry by function in your organisation. You can load tool registries either from memory (i.e. from within your project) or Portia's cloud (<a href="/SDK/portia/tool_registry" target="_blank">**Run Portia tools ↗**</a>). We actually group a few of our open source tools into an `example_tool_registry`, which is what we've been importing into all the examples we've looked at in the docs so far (<a href="https://github.com/portiaAI/portia-sdk-python/tree/main/portia/open_source_tools" target="_blank">**Open source tools in our SDK repo ↗**</a>).

Let's group our custom tools into a registry so we can import it into code afterwards. Let's create a `registry.py` file in the `my_custom_tools` directory and declare our registry as follow:
```python title="registry.py"
"""Registry containing my custom tools."""

from portia.tool_registry import InMemoryToolRegistry
from my_custom_tools.file_reader_tool import FileReaderTool
from my_custom_tools.file_writer_tool import FileWriterTool

custom_tool_registry = InMemoryToolRegistry.from_local_tools(
    [
        FileReaderTool(),
        FileWriterTool(),
    ],
)
```

Here we are loading our freshly minted local tools into an in-memory tool registry called `custom_tool_registry` represented by the `InMemoryToolRegistry` class using the `from_local_tools` method. This method takes a list of `Tool` objects as a parameter.<br/>

### Using custom tools and registries

Now let's bring it all together. We can combine any number of tool registries into a single one with the `+` operator. In this case we will now combine our custom tool(s) from the `custom_tool_registry` we created above with the `example_tool_registry` using `complete_tool_registry = example_tool_registry + custom_tool_registry`.<br/>
**Note: Make a `demo_runs` directory at this point. We will be using repeatedly.**

```python title="main.py"
from dotenv import load_dotenv
from portia.runner import Runner
from portia.config import default_config
from portia.open_source_tools.registry import example_tool_registry
from my_custom_tools.registry import custom_tool_registry

load_dotenv()

# Load example and custom tool registries into a single one
complete_tool_registry = example_tool_registry + custom_tool_registry
# Instantiate a Portia runner. Load it with the default config and with the tools above
runner = Runner(config=default_config(), tool_registry=complete_tool_registry)

# Execute the plan from the user query
workflow = runner.execute_query('Get the weather in the town with the longest name in England' 
                                + 'and write it to demo_runs/weather.txt.')

# Serialise into JSON and print the output
print(workflow.model_dump_json(indent=2))
```

This should result in a plan and subsequent workflow automatically weaving in the `WeatherTool` and `SearchTool` from the `example_tool_registry` as well as our hot-off-the-press `FileWriterTool` from our `custom_tool_registry`.
You should expect the weather information in Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch to be printed in a weather.txt file inside a `demo_runs` folder as specified. If you're in the mood, now is a good time to practise your Welsh pronunciation.
```text title="demo_runs/weather.txt"
The current weather in Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch is broken clouds with a temperature of 6.76°C.
```

## Tool errors at Portia
If a tool returns a generic error (e.g. one of the many built-in Python error classes), the LLM may not always detect that an Agent failed at a particular step or adopt the behaviour we want them to. This is where Portia's two `Error` types come in (<a href="/SDK/portia/errors" target="_blank">**SDK reference ↗**</a>):
- `ToolSoftError` is used when the Agent fails during a tool call but it is worth a retry. For example sometimes the Agent constructs a tool call with incorrect arguments resulting a `400` API error and a useful error code. Passing that error code back to the `Runner` in a `ToolSoftError` informs it where things went wrong and it can often recover by rewriting its tool call as a result.
- `ToolHardError` is used when we know the Agent encounters a permanent error or exception. One example could be a `401` invalid API key error, or a permission breach. In such cases we return the error in a `ToolHardError` which signals to the `Runner` that it should exit the workflow in a FAILED state.

Let's test this by adding an error handler to our `FileReaderTool` from the previous section. This tool checks for various file formats but it currently doesn't do anything if either the file is not of a supported format or is not found. Let's go ahead and use `ToolHardError` calls to handle those cases.
```python title="my_custom_tools/file_reader_tool.py"
from pathlib import Path
import pandas as pd
import json
from pydantic import BaseModel, Field
from portia.tool import Tool
from portia.execution_context import ExecutionContext
# highlight-next-line
from portia.errors import ToolHardError


class FileReaderToolSchema(BaseModel):
    """Schema defining the inputs for the FileReaderTool."""

    filename: str = Field(..., 
        description="The location where the file should be read from",
    )


class FileReaderTool(Tool[str]):
    """Finds and reads content from a local file on Disk."""

    id: str = "file_reader_tool"
    name: str = "File reader tool"
    description: str = "Finds and reads content from a local file on Disk"
    args_schema: type[BaseModel] = FileReaderToolSchema
    output_schema: tuple[str, str] = ("str", "A string dump or JSON of the file content")

    def run(self, _: ExecutionContext, filename: str) -> str | dict[str,any]:       
        """Run the FileReaderTool."""
        
        file_path = Path(filename)
        suffix = file_path.suffix.lower()

        if file_path.is_file():
            if suffix == '.csv':
                return pd.read_csv(file_path).to_string()
            elif suffix == '.json':
                with file_path.open('r', encoding='utf-8') as json_file:
                    data = json.load(json_file)
                    return data
            elif suffix in ['.xls', '.xlsx']:
                return pd.read_excel(file_path).to_string
            elif suffix in ['.txt', '.log']:
                return file_path.read_text(encoding="utf-8")
            # highlight-start
            else:
               raise ToolHardError(f"Unsupported file format: {suffix}. Supported formats are .txt, .log, .csv, .json, .xls, .xlsx.")
            # highlight-end

        # highlight-next-line
        raise ToolHardError(f"No file found on disk with the path {filename}.")
```

Throwing a hard tool error should result in a FAILED workflow state and a `final_output` elucidating the error. To test this you can run the code below where attempt to read a non-existent file:
```python title=main.py
from portia.runner import Runner
from portia.config import default_config
from portia.open_source_tools.registry import example_tool_registry
from my_custom_tools.registry import custom_tool_registry

# Load example and custom tool registries into a single one
complete_tool_registry = example_tool_registry + custom_tool_registry
# Instantiate a Portia runner. Load it with the default config and with the tools above
runner = Runner(config=default_config(), tool_registry=complete_tool_registry)

# Execute the plan from the user query
workflow = runner.execute_query('Read the contents of the file Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch.txt.')

# Serialise into JSON and print the output
print(workflow.model_dump_json(indent=2))
```

You should expect to see an ERROR raised in the logs like so:
```bash
2025-01-23 17:04:05.868 | ERROR | portia.runner:_execute_workflow:190 - error: Tool File reader tool failed
Error: ToolHardError('No file found on disk with the path Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch.txt.')
Please fix your mistakes.
 ```
 And a workflow with a FAILED state and an output outlining the error:
 ```json title=workflow_error.py
{
    "id": "b5837285-d58a-4273-be1a-5aa84b19fd7a",
    "plan_id": "b08d18a3-2a63-4a7b-ab38-9cceea7a3616",
    "current_step_index": 0,
    "state": "FAILED",
    "execution_context": {
        "end_user_id": null,
        "additional_data": {},
        "planner_system_context_extension": null,
        "agent_system_context_extension": null
    },
    "outputs": {
        "clarifications": [],
        "step_outputs": {
        "$file_contents": {
            "value": "Tool File reader tool failed: Error: ToolHardError('No file found on disk with the path Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch.txt.')\n Please fix your mistakes.",
            "summary": null
        }
        },
        "final_output": {
        "value": "Tool File reader tool failed: Error: ToolHardError('No file found on disk with the path Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch.txt.')\n Please fix your mistakes.",
        "summary": null
        }
    }
}
```

## List tools in a registry

You can fetch all tools in a given `ToolRegistry` using the `get_tools` method or a specific tool by name using the `get_tool` method. Feel to free to try this out.
```python
from my_custom_tools.registry import custom_tool_registry

# Get all tools in a registry
for tool in custom_tool_registry.get_tools():
    print(f"{tool}\n")

# # Get a specific tool by name
single_tool = custom_tool_registry.get_tool('File writer tool')
print(f"\nFetched a single tool:\n{single_tool}")
```

With custom tools you can now wrap any internal and external utilities, software services and data stores in natural language and expose them to your LLM. There will be instances when you want to signal to the LLM that human input is required before proceeding further. Let's look at how we unlock this feature in the next section.