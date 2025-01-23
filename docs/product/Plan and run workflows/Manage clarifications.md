---
sidebar_position: 4
slug: /manage-clarifications
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Manage clarifications
Define clarifications to handle human input.
Understand the different types of clarifications and how to use them.
:::tip[TL;DR]
- An agent can raise a clarification during a workflow execution to pause it and solicit human input. This pauses the workflow, serialises and saves its state at the step where clarification was raised.
- We represent a clarification with the `Clarification` class (<a href="/SDK/portia/clarification" target="_blank">**SDK reference ↗**</a>). This includes useful information such as guidance to be surfaced to the user when soliciting their input. Because it is a structured object, you can easily serve it to an end user using a front end of your choosing when it is encountered. 
- The user response is captured in the `Clarification` object itself, which is part of the `Workflow` state. This means the workflow can be resumed, and the step at which the clarification was required can now be completed.
:::

# Intro to clarifications
Portia introduces the concept of clarifications. An agent can raise a clarification during a workflow execution to pause it and solicit human input. This is important because:
1. LLM-driven workflows can be brittle and unreliable e.g. if an input is missing the LLM may hallucinate it. Instead we allow you to pause the workflow and raise a clarification to the user so they can resolve the missing input for the LLM.
2. During workflow execution, there may be tasks where your organisation's policies require explicit approvals from specific people e.g. allowing bank transfers over a certain amount. Clarifications allow you to define these conditions so the agent running a particular step knows when to pause the workflow and solicit input in line with your policies.

When Portia encounters a clarification and pauses a workflow, it serialises and saves the latest workflow state. Once the clarification is handled, the obtained human input captured during clarification handling is added to the workflow state and the agent can resume step execution.

![Clarifications at work](/img/clarifications_diagram.png)

# Types of clarifications
Clarifications are represented by the `Clarification` class (<a href="/SDK/portia/clarification" target="_blank">**SDK reference ↗**</a>). Because it is a structured object, you can easily serve it to an end user using a front end of your choosing when it is encountered e.g. a chatbot or app like Slack, email etc.

We offer three types of clarifications at the moment. You can see the properties and behaviours specific to each type in the tabs below. The common properties across all clarifications are:
- `uuid`: Unique ID for this clarification
- `type`: Clarification type
- `response`: User's response to the clarification
- `step`: Workflow step where this clarification was raised
- `user_guidance`: Guidance provided to the user to explain the nature of the clarification
- `handled`: Boolean of the clarification state

<Tabs>
    <TabItem value="action_clar" label="Action clarifications" default>
    Action clarifications are useful when a user action is needed to complete a step e.g. clicking on an `action_url` to complete an authentication flow or to make a payment. You will need to have a way to receive a callback from such a flow in order to confirm whether the clarification was handled successfully.
    ```json title="action_clarification.json"
    {
        "uuid": b1c1e1c0-5c3e-9z22,
        "type": “Action Clarification”,
        "response": “success”,
        "step": 1,
        "user_guidance": "Click here to authenticate",
        "handled": true,
        "action_url": “https://accounts.google.com/o/oauth2/…”,
    }
    ```
    </TabItem>
    <TabItem value="input_clar" label="Input clarifications" default>
    Input clarifications are used when a tool call is missing one argument and the user needs to provide it e.g. a `send_email` tool needs to be invoked but no email is resolvable from the user query. The `argument` attribute points to the tool argument this clarification resolves.
    ```json title="input_clarification.json"
    {
        "uuid": b1c1e1c0-5c3e-8x97,
        "type": “Input Clarification”,
        "response": “avrana@kern.ai”,
        "step": 2, 
        "user_guidance": "Please provide me with Avrana's email address", 
        "handled": true,
        "argument": "$avrana_email",
    }
    ```
    </TabItem>
        <TabItem value="multi_clar" label="Multiple choice clarifications" default>
    Multiple choice clarifications are raised when a tool argument is restricted to a list of values but the agent attempting to invoke the tool is given an argument that falls outside that list. The clarification can be used to serve the acceptable list of values for the user to choose from via the `options` attribute.
    ```json title="multiple_choice_clarification.json"
    {
        "uuid": b1c1e1c0-5c3e-1984,
        "type": “Multiple Choice Clarification”,
        "response": “ron_swanson@pawnee.com,
        "step": 2, 
        "user_guidance": "Please select a recipient.", 
        "handled": true,
        "argument": "$recipient",
        "options": [
                "ron_swanson@pawnee.com",
                "ron_burgundy@kvwnchannel4.com",
                "ron@gone_wrong.com"
            ]
    }
    ```
    </TabItem>
</Tabs>

# Clarification triggers
Clarifications are raised in one of two scenarios:
1. LLM-triggered: During workflow execution, an agent attempting to complete a step notices that an input is missing, resulting in an Input clarification.
2. Tool-triggered: A clarification is explicitly raised in the python class definition of the tool in specific conditions e.g. if a requisite oauth token is missing to complete the underlying API call or if a tool argument is invalid, resulting in Action or a Multiple Choice clarification respectively.
:::info[On missing tool inputs]
The LLM may sometimes judge that making an assumption on a missing input is reasonable. Take for example the prompt "write 'hello' to a file": This should invoke the `FileWriterTool`, where the `content` argument is clear but the `filename` argument is ambiguous. It may result in an LLM-triggered Input clarification or the LLM may assume `hello.txt` as the value for `filename`. The latter would be a reasonable assumption rather than a "hallucination" per se. You can always enforce guardrails on such assumptions using explicit tool-triggered clarifications e.g. ensuring a `filename` is always within a specific directory as we'll see next.
:::

# Add a clarification to your custom tool
Let's pick up the custom tool example we looked at previously (<a href="/extend-tool-definitions#adding-your-own-custom-tools" target="_blank">**Adding your own custom tool ↗**</a>). We will now learn how to:
- Define a clarification in a tool explicitly
- Handle clarifications with the `Runner` and `Workflow` classes

### Define your clarification
 We're going to add a clarification to our `FileReaderTool` to handle cases where a file is not found. Instead of throwing an error directly, we will attempt to find the file in other folders in the project directory. We do that by adding the highlighted lines in the `FileReaderTool` class definition as shown below.

```python title="my_custom_tools/file_reader_tool.py"
from pathlib import Path
import pandas as pd
import json
from pydantic import BaseModel, Field
from portia.tool import Tool
from portia.context import ExecutionContext
from portia.errors import ToolHardError
# highlight-next-line
from portia.clarification import MultiChoiceClarification


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
            else:
               raise ToolHardError(f"Unsupported file format: {suffix}. Supported formats are .txt, .log, .csv, .json, .xls, .xlsx.")
        
        # highlight-start
        alt_file_paths = self.find_file(filename)
        if alt_file_paths:
            return MultiChoiceClarification(
                argument_name="filename",
                user_guidance=f"Found {filename} in these location(s). Pick one to continue:\n{alt_file_paths}",
                options=alt_file_paths,
            )
        # highlight-end

        raise ToolHardError(f"No file found on disk with the path {filename}.")

    # highlight-start
    def find_file(self, filename: str) -> list[Path]:
        """Returns a full file path or None."""

        search_path = Path("../")
        filepaths = []

        for filepath in search_path.rglob(filename):
            if filepath.is_file():
                filepaths.append(str(filepath))
        if filepaths:
            return filepaths
        return None
    # highlight-end
```

Most notably, this block below results in the tool using the `find_file` method to look for alternative locations and raising a clarification if multiple paths are found in the project directory:
```python
alt_file_paths = self.find_file(filename)
if alt_file_paths:
    return MultiChoiceClarification(
        argument_name="filename",
        user_guidance=f"Found {filename} in these location(s). Pick one to continue:\n{alt_file_paths}",
        options=alt_file_paths,
    )
```

### Handle clarifications with your `Runner`
When the conditions requiring a clarification are met, the relevant tool call returns a `Clarification` object, the workflow is paused and the workflow state becomes `NEED CLARIFICATION`. Portia has now passed control of the workflow execution to you, the developer, along with the `Clarification` object in order for you to resolve with human or machine input. At this stage we need to make some changes in the `main.py` file to handle clarifications.

```python title="main.py"
from portia.runner import Runner
from portia.config import default_config
from portia.open_source_tools.registry import example_tool_registry
from my_custom_tools.registry import custom_tool_registry
# highlight-next-line
from portia.workflow import WorkflowState

# Load example and custom tool registries into a single one
complete_tool_registry = example_tool_registry + custom_tool_registry
# Instantiate a Portia runner. Load it with the default config and with the tools above
runner = Runner(config=default_config(), tool_registry=complete_tool_registry)

# Execute the plan from the user query
workflow = runner.execute_query('Read the contents of the file "weather.txt".')

# highlight-start
# Check if the workflow was paused due to raised clarifications
while workflow.state == WorkflowState.NEED_CLARIFICATION:
    # If clarifications are needed, resolve them before resuming the workflow
    for clarification in workflow.get_outstanding_clarifications():
        # For each clarification, prompt the user for input
        user_input = input(f"{clarification.user_guidance}\n")
        # Resolve the clarification with the user input
        clarification.resolve(response=user_input)

    # Once clarifications are resolved, resume the workflow
    workflow = runner.execute_workflow(workflow)
# highlight-end

# Serialise into JSON and print the output
print(workflow.model_dump_json(indent=2))
```

For this test to successfully trigger a clarification, make sure you don't have a `weather.txt` file in the same folder as your python file AND try to have a few copies of a `weather.txt` file sprinkled around in other folders of the project directory. This will ensure that the prompt triggers the multiple choice clarifications on the `filename` argument of the `FileReaderTool`. The tool call will return a `Clarification` object per changes made in the previous section and pause the workflow.<br/>
The changes you need to make to enable this behaviour are as follows:
1. Check if the state of the `Workflow` object returned by the `execute_query` method is `WorkflowState.NEED_CLARIFICATION`. This means the workflow paused before completion due to a clarification.
2. Use the `get_outstanding_clarifications` method of the `Workflow` object to access all clarifications where `handled` is false.
3. For each `Clarification`, surface the `user_guidance` to the relevant user and collect their input.
4. Use the `resolve` method of the `Clarification` to capture the user input in the `response` attribute of the relevant clarification. Because clarifications are part of the workflow state itself, this means that the workflow now captures the latest human input gathered and can be resumed with the new information.
5. Once this is done you can resume the workflow using the `execute_workflow` method. We have seen this `Runner` method as a way to kick off a `Workflow` object after the `create_workflow` method. In fact `execute_workflow` can take a `Workflow` in any state as a parameter and will kick off that workflow from that current state. In this particular example, it resumes the workflow from the step where the clarifications were encountered.

For the example query above `Read the contents of the file "weather.txt".`, where the user resolves the clarification by entering one of the options offered by the clarification (in this particular case `demo_runs/weather.txt` in our project directory `momo_sdk_tests`), you should see the following workflow state, nothing that:
- The multiple choice clarification where the `user_guidance` was generated by Portia based on your clarification definition in the `FileReaderTool` class,
- The `response` in the second workflow snapshot reflecting the user input, and the change in `handled` to `true` as a result
- The workflow `state` will appear to `NEED_CLARIFICATION` if you look at the logs at the point when the clarification is raised. It then progresses to `COMPLETE` once you respond to the clarification and the workflow is able to resume:
```json title="workflow_state.json"
{
  "id": "54d157fe-4b99-4dbb-a917-8fd8852df63d",
  "plan_id": "b87de5ac-41d9-4722-8baa-8015327511db",
  "current_step_index": 0,
  "state": "COMPLETE",
  "execution_context": {
    "end_user_id": null,
    "additional_data": {},
    "planner_system_context_extension": null,
    "agent_system_context_extension": null
  },
  "outputs": {
    "clarifications": [
      {
        "id": "216c13a1-8342-41ca-99e5-59394cbc7008",
        "type": "Multiple Choice Clarification",
        "response": "../momo_sdk_tests/demo_runs/weather.txt",
        "step": 0,
        "user_guidance": "Found weather.txt in these location(s). Pick one to continue:\n['../momo_sdk_tests/demo_runs/weather.txt', '../momo_sdk_tests/my_custom_tools/__pycache__/weather.txt']",
        "resolved": true,
        "argument_name": "filename",
        "options": [
          "../momo_sdk_tests/demo_runs/weather.txt",
          "../momo_sdk_tests/my_custom_tools/__pycache__/weather.txt"
        ]
      }
    ],
    "step_outputs": {
      "$file_contents": {
        "value": "The current weather in Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch is broken clouds with a temperature of 6.76°C.",
        "summary": null
      }
    },
    "final_output": {
      "value": "The current weather in Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch is broken clouds with a temperature of 6.76°C.",
      "summary": null
    }
  }
}
```

You now know how to add your own custom tools and how to raise custom clarifications. In the next section we explore the various configuration options Portia offers for LLM management and for plan and workflow storage.
