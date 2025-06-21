---
sidebar_position: 5
slug: /add-custom-tools
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Add custom tools

Let's build two custom tools that allow an LLM to write / read content to / from a local file. We'll start building the tool using the `@tool` decorator, which provides a simple and straightforward way to create custom tools from Python functions.

## Using the @tool decorator

The `@tool` decorator converts your functions into portia tools, eliminating the need to manually create [jsonschema](https://json-schema.org/) and map jsonschema to function. Let's create our custom tools in a separate folder called `my_custom_tools` at the root of the project directory:

<Tabs>
  <TabItem value="file_reader" label="file_reader_tool.py">
    ```python title="my_custom_tools/file_reader_tool.py" id=file_reader_tool
    from pathlib import Path
    import pandas as pd
    import json
    from typing import Annotated
    from portia import tool

    @tool
    def file_reader_tool(
        filename: Annotated[str, "The location where the file should be read from"]
    ) -> str | dict:
        """Finds and reads content from a local file on Disk."""
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
                return pd.read_excel(file_path).to_string()
            elif suffix in ['.txt', '.log']:
                return file_path.read_text(encoding="utf-8")
    ```
  </TabItem>
  <TabItem value="file_writer" label="file_writer_tool.py">
    ```python title="my_custom_tools/file_writer_tool.py"
    from pathlib import Path
    from typing import Annotated
    from portia import tool

    @tool
    def file_writer_tool(
        filename: Annotated[str, "The location where the file should be saved"],
        content: Annotated[str, "The content to write to the file"]
    ) -> str:
        """Writes content to a file."""
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

The file reader tool expects a `filename` argument, which includes the file path and specifies the file to be read, and then returns the contents of the file as an output. The file writer tool expects the content to be written alongside the `filename` tool and then returns a string summarising the successful action. If a file already exists at the specified location its content will be overwritten. In general, a custom tool can return any type that can be safely serialised to a string, though we suggest basic data types (e.g. `str`, `int`, `float`, `bool`), collections of these types (e.g. `list`, `set`, `dict`) or [Pydantic models](https://docs.pydantic.dev/latest/concepts/models/) as they are easier to work with.

:::note[On the local file tools]
If those tools look familiar it's because we actually offer them in our open source repo ready-made. We just wanted to walk you through building your own local version from scratch (<a href="https://github.com/portiaAI/portia-sdk-python/tree/main/portia/open_source_tools" target="_blank">**Open source tools in our SDK repo ↗**</a>). We will save adding clarifications to the next section though.
:::

## Manage tool registries

Let's group our custom tools into a registry so we can import it into code afterwards. Let's create a `registry.py` file in the `my_custom_tools` directory and declare our registry as follow:
```python title="registry.py" depends_on=file_reader_tool
"""Registry containing my custom tools."""

from portia import ToolRegistry
from my_custom_tools.file_reader_tool import file_reader_tool
from my_custom_tools.file_writer_tool import file_writer_tool

custom_tool_registry = ToolRegistry([
    file_reader_tool(),
    file_writer_tool(),
])
```

Here we are loading our freshly minted local tools into a tool registry called `custom_tool_registry` represented by the `ToolRegistry` class. This takes a list of instantiated tool functions as a parameter.<br/>

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
from portia import (
    Portia,
    example_tool_registry,
)
from my_custom_tools.registry import custom_tool_registry

load_dotenv()

# Load example and custom tool registries into a single one
complete_tool_registry = example_tool_registry + custom_tool_registry
# Instantiate Portia with the tools above
portia = Portia(tools=complete_tool_registry)

# Execute the plan from the user query
plan_run = portia.run('Get the weather in the town with the longest name in England'
                                + 'and write it to demo_runs/weather.txt.')

# Serialise into JSON and print the output
print(plan_run.model_dump_json(indent=2))
```

This should result in a plan and subsequent plan run automatically weaving in the `WeatherTool` and `SearchTool` from the `example_tool_registry` as well as our hot-off-the-press `file_writer_tool` from our `custom_tool_registry`.
You should expect the weather information in Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch to be printed in a weather.txt file inside a `demo_runs` folder as specified. If you're in the mood, now is a good time to practise your Welsh pronunciation.
```text title="demo_runs/weather.txt"
The current weather in Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch is broken clouds with a temperature of 6.76°C.
```

## Class-based approach (Alternative)

For more complex scenarios requiring advanced customisation, you can also use the class-based approach. This provides more control over tool configuration and is equivalent to the decorator approach shown above:

<Tabs>
  <TabItem value="class_file_reader" label="file_reader_tool.py (class-based)">
    ```python title="my_custom_tools/file_reader_tool.py"
    from pathlib import Path
    import pandas as pd
    import json
    from pydantic import BaseModel, Field
    from portia.tool import Tool, ToolRunContext


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

        def run(self, _: ToolRunContext, filename: str) -> str | dict[str,any]:
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
                    return pd.read_excel(file_path).to_string()
                elif suffix in ['.txt', '.log']:
                    return file_path.read_text(encoding="utf-8")
    ```
  </TabItem>
  <TabItem value="class_file_writer" label="file_writer_tool.py (class-based)">
    ```python title="my_custom_tools/file_writer_tool.py"
    from pathlib import Path
    from pydantic import BaseModel, Field
    from portia.tool import Tool, ToolRunContext

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

        def run(self, _: ToolRunContext, filename: str, content: str) -> str:
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

When using the class-based approach, you would create the registry using `InMemoryToolRegistry.from_local_tools()` instead:

```python title="registry.py (class-based)"
"""Registry containing my custom tools."""

from portia import InMemoryToolRegistry
from my_custom_tools.file_reader_tool import FileReaderTool
from my_custom_tools.file_writer_tool import FileWriterTool

custom_tool_registry = InMemoryToolRegistry.from_local_tools(
    [
        FileReaderTool(),
        FileWriterTool(),
    ],
)
```

The `@tool` decorator approach is recommended for most use cases due to its simplicity and ease of use, while the class-based approach provides more flexibility for advanced scenarios.