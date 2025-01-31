---
sidebar_position: 3
slug: /extend-tool-catalogue
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Extend your tool catalogue
Add your own tools and registries.
:::tip[TL;DR]
- You can use create and import your own tools to use with our framework.
- Tool registries are useful to group frequently used tools together. They are represented by the `Tool_registry` class (<a href="/SDK/portia/tool_registry" target="_blank">**SDK reference ↗**</a>).
:::

## Add custom tools
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

        def run(self, _: ExecutionContext, filename: str, content: str) -> str:
            """Run the FileWriterTool."""
            
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

:::note[On the local file tools]
If those tools look familiar it's because we actually offer them in our open source repo ready-made. We just wanted to walk you through building your own local version from scratch (<a href="https://github.com/portiaAI/portia-sdk-python/tree/main/portia/open_source_tools" target="_blank">**Open source tools in our SDK repo ↗**</a>). We will save adding clarifications to the next section though.
:::

## Manage tool registries

A tool registry is a collection of tools and is represented by the `Tool_registry` class (<a href="/run-portia-tools" target="_blank">**SDK reference ↗**</a>). Tool registries are useful to group frequently used tools together, e.g. you could imagine having a tool registry by function in your organisation. You can load tool registries either from memory using the `InMemoryToolRegistry` class (i.e. from within your project) or from Portia's cloud using the `PortiaToolRegistry` class (<a href="/run-portia-tools" target="_blank">**Run Portia tools ↗**</a>). We actually group a few of our open source tools into an `example_tool_registry`, which is what we've been importing into all the examples we've looked at in the docs so far (<a href="https://github.com/portiaAI/portia-sdk-python/tree/main/portia/open_source_tools" target="_blank">**Open source tools in our SDK repo ↗**</a>).

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

## Bringing it together in an example

Now let's bring it all together. We can combine any number of tool registries into a single one with the `+` operator. This can just as well be done to combine local and Portia tools together in one fell swoop! For this example, we will combine our custom tool(s) from the `custom_tool_registry` we created above with the `example_tool_registry` using `complete_tool_registry = example_tool_registry + custom_tool_registry`.<br/>
**Note: Make a `demo_runs` directory at this point. We will be using repeatedly.**

<details>
<summary>**API keys required**</summary>

We will use a simple GET endpoint from OpenWeatherMap in this section. Please sign up to obtain an API key from them (<a href="https://home.openweathermap.org/users/sign_in" target="_blank">**↗**</a>) and set it in the environment variable `OPENWEATHERMAP_API_KEY`.

We're assuming you already have a Tavily key provisioned from the previous sections in this doc. If not, then head over to their website and do so (<a href="https://tavily.com/" target="_blank">**↗**</a>). We will set it in the environment variable `TAVILY_API_KEY`.
</details>

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
