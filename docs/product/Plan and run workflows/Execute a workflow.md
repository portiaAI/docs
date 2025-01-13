---
sidebar_position: 2
slug: /execute-workflow
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Execute a workflow
Learn how to run a workflow from an existing plan or end-to-end.
:::tip[TL;DR]
- A workflow is a unique run of a plan. It is represented by the `Workflow` class (<a href="/SDK/portia/workflow" target="_blank">**SDK reference ↗**</a>).
- An agent is spun up to execute every step in the workflow. The `Workflow` object tracks the state of the workflow execution and is enriched at every step by the relevant agent.
- A workflow can be generated either from a plan using the `run_plan` method or directly from a user prompt using the `run_query` method of the `Runner` class (<a href="/SDK/portia/runner" target="_blank">**SDK reference ↗**</a>).
:::

## Overview of workflows in Portia
A workflow is a unique instantiation of a plan. The purpose of a workflow is to capture the state of a unique plan run at every step in an auditable way. This includes:
- A step index tracking at which step we are in the execution of the workflow.
- The actual workflow state e.g. NOT_STARTED, IN_PROGRESS, COMPLETE or NEED_CLARIFICATION.
- A list of step outputs that is populated throughout the workflow execution.

In a later section we will also see that the workflow state also tracks a list of instances where human input was solicited during workflow execution, known as `Clarification`.

Workflow states are captured in the `Workflow` class (<a href="/SDK/portia/workflow" target="_blank">**SDK reference ↗**</a>). In the previous section (<a href="/generate-plan" target="_blank">**Generate a plan ↗**</a>), we generated a plan in response to the query `add the temperature in London to the temperature in Beirut right now`. Let's examine the final state once we run a workflow for that plan:
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
If you'd like to inspect the individual state changes for the above workflow, feel free to cycle through them in the video below. Note how the workflow state is enriched with step outputs at every step of the execution.
<div style={{
  overflow: 'hidden',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '10px',
  width: '100%',
  maxWidth: '931px',
  position: 'relative'
}}>
  <div style={{
    width: '100%',
    paddingBottom: '59.07626208378088%'
  }}></div>
  <iframe 
    width="931" 
    height="550" 
    title="Embedded content"
    src="https://snappify.com/embed/c8eb2bee-f784-4d24-b573-39bfca493eda?responsive=1&p=1&autoplay=1&b=0" 
    allow="clipboard-write" 
    allowFullScreen
    loading="lazy" 
    style={{
      background: '#eee',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%'
    }} 
    frameBorder="0"
  ></iframe>
</div>



## Execute a workflow from a plan
<details>
<summary>**OpenWeatherMap API key required**</summary>

We will use a simple GET endpoint from OpenWeatherMap in this section. Please sign up to obtain an API key from them (<a href="https://home.openweathermap.org/users/sign_in" target="_blank">**↗**</a>) and set it in the environment variable `OPENWEATHERMAP_API_KEY`.
</details>

Let's expand on the plan generation code we wrote the previous section and execute a workflow from that plan. This gives you the opportunity to serve the plan to the user and get their feedback / iterate on the plan before running it for example. Here is the code to do that:
```python title="main.py"
import json
from portia.runner import Runner
from portia.config import default_config
from portia.example_tools.registry import example_tool_registry

# Instantiate a Portia runner. Load it with the default config and with the example tools.
runner = Runner(config=default_config(), tool_registry=example_tool_registry)

# Generate the plan from the user query
plan = runner.plan_query('add the temperature in London to the temperature in Beirut right now')

# INSERT CODE WHERE YOU SERVE THE PLAN TO THE USER OR ITERATE ON IT IN ANY WAY

# Execute workflow from the generated plan
# highlight-next-line
output = runner.run_plan(plan)

# Serialise into JSON and print the output
print(output.model_dump_json(indent=2))
```

Here we are storing the `Plan` object returned by the `plan_query` method and then using the `run_plan` method to instantiate a workflow from it. 

## Execute a workflow directly from a user query
<details>
<summary>**OpenWeatherMap API key required**</summary>

We will use a simple GET endpoint from OpenWeatherMap in this section. Please sign up to obtain an API key from them (<a href="https://home.openweathermap.org/users/sign_in" target="_blank">**↗**</a>) and set it in the environment variable `OPENWEATHERMAP_API_KEY`.
</details>

You can also run a workflow immediately from the user query, without examining the `Plan` object in between. This would generate a plan as intermediate step as well but will also immediately spawn a workflow run from it. You would simply use the `run_query` method from your `Runner` class like so:
```python title="main.py"
import json
from portia.runner import Runner
from portia.config import default_config
from portia.example_tools.registry import example_tool_registry

# Instantiate a Portia runner. Load it with the default config and with the example tools.
runner = Runner(config=default_config(), tool_registry=example_tool_registry)

# Generate the plan from the user query
output = runner.run_query('add the temperature in London to the temperature in Beirut right now')

# Serialise into JSON and print the output
print(output.model_dump_json(indent=2))
```
:::note[Track workflow states in logs]
You can track workflow state changes live as they occur through the logs by setting `default_log_level` to DEBUG in the `Config` of your Portia `Runner` (<a href="/manage-config#manage-logging" target="_blank">**Manage logging ↗**</a>).
:::

You should now be able to generate plans and spawn workflow runs from them. We have used a couple of example tools so far. Head on over to the next section to look at how we can add custom tools to the mix!