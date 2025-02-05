---
sidebar_position: 5
slug: /error-handling
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Handle errors
Understand tools at Portia and add your own.
:::tip[TL;DR]
You can use Portia's `Error` class to signal to the LLM that an error was encountered and whether to attempt a retry or fail the workflow (<a href="/SDK/portia/errors" target="_blank">**SDK reference ↗**</a>).
:::

<details>
<summary>**API keys required**</summary>

We will use a simple GET endpoint from OpenWeatherMap in this section. Please sign up to obtain an API key from them (<a href="https://home.openweathermap.org/users/sign_in" target="_blank">**↗**</a>) and set it in the environment variable `OPENWEATHERMAP_API_KEY`.

We're assuming you already have a Tavily key provisioned from the previous sections in this doc. If not, then head over to their website and do so (<a href="https://tavily.com/" target="_blank">**↗**</a>). We will set it in the environment variable `TAVILY_API_KEY`.
</details>

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
runner = Runner(config=default_config(), tools=complete_tool_registry)

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