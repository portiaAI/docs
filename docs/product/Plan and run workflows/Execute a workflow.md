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
- A workflow can be generated either from a plan using the `run_plan` method or directly from a user prompt using the `execute_query` method of the `Runner` class (<a href="/SDK/portia/runner" target="_blank">**SDK reference ↗**</a>).
:::

## Overview of workflows in Portia
A workflow is a unique instantiation of a plan. The purpose of a workflow is to capture the state of a unique plan run at every step in an auditable way. This includes:
- A step index tracking at which step we are in the execution of the workflow.
- The actual workflow state e.g. NOT_STARTED, IN_PROGRESS, COMPLETE, READY_TO_RESUME or NEED_CLARIFICATION.
- A list of step outputs that is populated throughout the workflow execution.

In a later section we will also see that the workflow state also tracks a list of instances where human input was solicited during workflow execution, known as `Clarification`.

Workflow states are captured in the `Workflow` class (<a href="/SDK/portia/workflow" target="_blank">**SDK reference ↗**</a>). In the previous section (<a href="/generate-plan" target="_blank">**Generate a plan ↗**</a>), we generated a plan in response to the query `Which stock price grew faster in 2024, Amazon or Google?`. Let's examine the final state once we run a workflow for that plan:
<Tabs>
  <TabItem value="plan" label="Generated plan >>">
    ```json title="plan-1dcd74a4-0af5-490a-a7d0-0df4fd983977.json"
    {
      "id": "1dcd74a4-0af5-490a-a7d0-0df4fd983977",
      "plan_context": {
        "query": "Which stock price grew faster, Amazon or Google?",
        "tool_ids": [
          "calculator_tool",
          "weather_tool",
          "search_tool"
        ]
      },
      "steps": [
        {
          "task": "Search for the latest stock price growth data for Amazon.",
          "inputs": [],
          "tool_name": "Search Tool",
          "output": "$amazon_stock_growth"
        },
        {
          "task": "Search for the latest stock price growth data for Google.",
          "inputs": [],
          "tool_name": "Search Tool",
          "output": "$google_stock_growth"
        },
        {
          "task": "Compare the stock price growth of Amazon and Google.",
          "inputs": [
            {
              "name": "$amazon_stock_growth",
              "value": null,
              "description": "The stock price growth data for Amazon."
            },
            {
              "name": "$google_stock_growth",
              "value": null,
              "description": "The stock price growth data for Google."
            }
          ],
          "tool_name": null,
          "output": "$stock_growth_comparison"
        }
      ]
  }
    ```
  </TabItem>
    <TabItem value="workflow" label="Workflow in final state" default>
    ```json title="workflow-18d9aa91-0066-413f-af32-b979bce89821.json"
    {
      "id": "18d9aa91-0066-413f-af32-b979bce89821",
      "plan_id": "a89efeb0-51ef-4f2c-b435-a936c27c3cfc",
      "current_step_index": 2,
      "state": "COMPLETE",
      "execution_context": {
        "end_user_id": null,
        "additional_data": {},
        "planner_system_context_extension": null,
        "agent_system_context_extension": null
      },
      "outputs": {
        "clarifications": [],
        "step_outputs": {
          "$amazon_stock_growth": {
            "value": "Amazon stock closed at an all-time high of $214.10 in November...",
            "summary": null
          },
          "$google_stock_growth": {
            "value": "In 2024, Google's parent company Alphabet surged 35.5% according to...",
            "summary": null
          },
          "$faster_growth": {
            "value": "In 2024, Amazon's stock price grew by 52%, while Google's parent company Alphabet saw a stock price surge of 35.5%.",
            "summary": null
          }
        },
        "final_output": {
          "value": "In 2024, Amazon's stock price grew by 52%, while Google's parent company Alphabet saw a stock price surge of 35.5%.",
          "summary": null
        }
      }
    }









    ```
  </TabItem>
</Tabs>

Every workflow has a unique `id` and relates to a unique `plan_id`. If you were to attempt running a workflow from the same plan multiple times, you would generate multiple `Workflow` objects each with a unique `id` but all with the same `plan_id` property.

## Workflow state changes
As Portia cycles through a workflow, an agent is instantiated at every step and that agent will call the tool designated for that. The workflow state is enriched with step outputs at every step of the execution as well. Note that in this example the main tool used is the 'Search Tool' provided in this SDK in the `example_tool_registry`, and wraps around the Tavily API. We will discuss tools in more depth in the next section.
You should be able to inspect the state changes for the above workflow in the logs when you run the code.
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
:::note
Animation above made on the brilliant <a href="https://snappify.com" target="_blank">**snappify.com ↗**</a>.
:::




## Execute a workflow from a plan
<details>
<summary>**Tavily API key required**</summary>

We will use a simple GET endpoint from Tavily in this section. Please sign up to obtain an API key from them (<a href="https://tavily.com/" target="_blank">**↗**</a>) and set it in the environment variable `TAVILY_API_KEY`.
</details>

To get to an output that looks like the workflow example above, let's expand on the code we used to generate a plan in the previous section (<a href="/generate-plan" target="_blank">**↗**</a>) by adding code to create and execute a workflow from that plan. This approach gives you the opportunity to serve that plan to the user and get their feedback / iterate on it before running the workflow for example. Here is the code to do that:
```python title="main.py"
from dotenv import load_dotenv
from portia.runner import Runner
from portia.config import default_config
from portia.open_source_tools.registry import example_tool_registry

load_dotenv()

# Instantiate a Portia runner. Load it with the default config and with the example tools.
runner = Runner(config=default_config(), tool_registry=example_tool_registry)

# Generate the plan from the user query
plan = runner.generate_plan('Which stock price grew faster in 2024, Amazon or Google?')

# [OPTIONAL] INSERT CODE WHERE YOU SERVE THE PLAN TO THE USER OR ITERATE ON IT IN ANY WAY

# Create and execute the workflow from the generated plan
workflow = runner.create_workflow(plan)
workflow = runner.execute_workflow(workflow)

# Serialise into JSON and print the output
print(workflow.model_dump_json(indent=2))
```

Here we are storing the `Plan` object returned by the `generate_plan` method and then using the `create_workflow` method to instantiate a workflow from it in the `NOT_STARTED` state. And finally we launch that workflow using the uncontroversially named method `execute_workflow`.

## Execute a workflow directly from a user query
<details>
<summary>**Tavily API key required**</summary>

We will use a simple GET endpoint from Tavily in this section. Please sign up to obtain an API key from them (<a href="https://tavily.com/" target="_blank">**↗**</a>) and set it in the environment variable `TAVILY_API_KEY`.
</details>

You can also run a workflow immediately from the user query, without examining the `Plan` object in between. This would generate a plan as intermediate step as well but will also immediately spawn a workflow run from it. You would simply use the `execute_query` method from your `Runner` class like so:
```python title="main.py"
from dotenv import load_dotenv
from portia.runner import Runner
from portia.config import default_config
from portia.open_source_tools.registry import example_tool_registry

load_dotenv()

# Instantiate a Portia runner. Load it with the default config and with the example tools.
runner = Runner(config=default_config(), tool_registry=example_tool_registry)

# Generate the plan from the user query
workflow = runner.execute_query('Which stock price grew faster in 2024, Amazon or Google?')

# Serialise into JSON and print the output
print(workflow.model_dump_json(indent=2))
```
:::note[Track workflow states in logs]
You can track workflow state changes live as they occur through the logs by setting `default_log_level` to DEBUG in the `Config` of your Portia `Runner` (<a href="/manage-config#manage-logging" target="_blank">**Manage logging ↗**</a>).
:::

You should now be able to generate plans and spawn workflow runs from them. We have used a couple of example tools so far. Head on over to the next section to look at how we can add custom tools to the mix!