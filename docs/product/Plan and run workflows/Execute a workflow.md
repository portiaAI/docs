---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Execute a workflow
Learn how to run a workflow from an existing plan or end-to-end.

## Overview of workflows in Portia
A workflow is a unique instantiation of a plan. The purpose of a workflow is to capture the state of a unique plan run at every step in an auditable way. This includes:
- A step index tracking at which step we are in the execution of the workflow
- The actual workflow state e.g. NOT_STARTED, IN_PROGRESS, COMPLETE or NEED_CLARIFICATION
- A list of step outputs that is populated throughout the workflow execution.

In a later section we will also see that the worflow state also tracks a list of instances where human input was solicited during workflow execution, known as `clarifications`.

Workflow states are captured in the `Workflow` class (<a href="/SDK/portia/workflow" target="_blank">**SDK reference ↗**</a>). Let's examine the final workflow state for a plan we generate from a similar query to the previous section, namely `add the temperature in London to the temperature in Beirut right now`:
<Tabs>
  <TabItem value="plan" label="Generated plan >>">
    ```json title="plan-b5e013e8-6aae-461d-ac01-3a303f56935c.json"
    {
        "id": "b5e013e8-6aae-461d-ac01-3a303f56935c",
        "query": "add the temperature in London to the temperature in Beirut right now",
        "steps": [
            {
                "task": "Get the current temperature in London.",
                "tool_name": "Weather Tool",
                "output": "$london_temperature"
            },
            {
                "task": "Get the current temperature in Beirut.",
                "tool_name": "Weather Tool",
                "output": "$beirut_temperature"
            },
            {
                "task": "Add the temperatures from London and Beirut.",
                "input": [
                    {
                        "name": "$london_temperature",
                        "description": "The current temperature in London."
                    },
                    {
                        "name": "$beirut_temperature",
                        "description": "The current temperature in Beirut."
                    }
                ],
                "tool_name": "Add Tool",
                "output": "$total_temperature"
            }
        ]
    }
    ```
  </TabItem>
    <TabItem value="workflow" label="Workflow in final state" default>
    ```json title="workflow-9b594ac2-fe12-4e91-8283-602821cf8e63.json"
    {
        "id": "9b594ac2-fe12-4e91-8283-602821cf8e63",
        "plan_id": "b5e013e8-6aae-461d-ac01-3a303f56935c",
        "current_step_index": 2,
        "clarifications": [],
        "state": "COMPLETE",
        "step_outputs": 
        {
            "$london_temperature": {
                "value": "The current weather in London is clear sky with a temperature of 2.33°C."
            },
            "$beirut_temperature": {
                "value": "The current weather in Beirut is clear sky with a temperature of 14.41°C."
            },
            "$total_temperature": {
                "value": 16.740000000000002
            }
        },
        "final_output": {
            "value": 16.740000000000002
        }
    }









    ```
  </TabItem>
</Tabs>

Note that every workflow has a unique `id` and relates to a unique `plan_id`. If you were to attempt running a workflow from the same plan multiple times, you would generate multiple `Workflow` objects each with a unique `id` but all with the same `plan_id` property.

## Workflow state changes
If you'd like to inspect the individual state changes for the above workflow, feel free to cycle through them in the video below.
<iframe width="931" height="550" title="" src="https://snappify.com/embed/c8eb2bee-f784-4d24-b573-39bfca493eda?responsive=1&p=1&autoplay=1&b=0" allow="clipboard-write" allowfullscreen="" loading="lazy" frameborder="0"></iframe>

## Executing a workflow from plan or end-to-end
Let's expand on the plan generation code we wrote the previous section and execute a workflow from that plan. This gives you the opportunity to serve the plan to the user and get their feedback / iterate on the plan before running it for example. Here is the code to do that:
```python title="main.py"
from portia.runner import Runner
from portia.config import default_config
from portia.tool_registry import InMemoryToolRegistry
from demo_tools.addition_tool import AdditionTool
from demo_tools.weather_tool import WeatherTool

# Load required tools into a tool registry.
demo_tool_registry = InMemoryToolRegistry.from_local_tools([AdditionTool(), WeatherTool()])
# Instantiate a Portia runner. Load it with the default config and with the simple tool above.
runner = Runner(config=default_config(), tool_registry=demo_tool_registry)

# Generate the plan from the user query
plan = runner.plan_query('add the temperature in London to the temperature in Beirut right now')

# INSERT CODE WHERE YOU SERVE THE PLAN TO THE USER OR ITERATE ON IT IN ANY WAY

# Execute workflow from the generated plan
# highlight-next-line
output = runner.run_plan(plan)
# Serialise into JSON an print the output
print(output.model_dump_json())
```

Here we are storing the `Plan` object returned by the `plan_query` method and then using the `run_plan` method to instantiate a workflow from it. If you wanted to run a workflow immediately from the user query, without examining the `Plan` object in between you could simply use the 'run_query' method from your `Runner` class like so:
```python title="main.py"
from portia.runner import Runner
from portia.config import default_config
from portia.tool_registry import InMemoryToolRegistry
from demo_tools.addition_tool import AdditionTool
from demo_tools.weather_tool import WeatherTool

# Load required tools into a tool registry.
demo_tool_registry = InMemoryToolRegistry.from_local_tools([AdditionTool(), WeatherTool()])
# Instantiate a Portia runner. Load it with the default config and with the simple tool above.
runner = Runner(config=default_config(), tool_registry=demo_tool_registry)

# Execute a workflow directly from the user query
# highlight-next-line
output = runner.run_query('add the temperature in London to the temperature in Beirut right now')
# Serialise into JSON an print the output
print(output.model_dump_json())
```
