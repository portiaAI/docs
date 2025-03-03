---
sidebar_position: 2
slug: /run-plan
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Run a plan
Learn how to run a plan run from an existing plan or end-to-end.
:::tip[TL;DR]
- A plan run is (uncontroversially) a unique run of a plan. It is represented by the `PlanRun` class (<a href="/SDK/portia/plan_run" target="_blank">**SDK reference ↗**</a>).
- An agent is spun up to execute every step in the plan run. The `PlanRun` object tracks the state of the plan run and is enriched at every step by the relevant agent.
- A plan run can be generated from a plan using the `run_plan` method. 
- You can also plan a query response, then create and execute a plan run in one fell swoop using the `run` method of the `Portia` instance class (<a href="/SDK/portia/portia" target="_blank">**SDK reference ↗**</a>).
:::

## Overview of plan runs in Portia
Portia captures the state of a plan run at every step in an auditable way. This includes:
- A step index tracking at which step we are in the plan run.
- The actual plan run state e.g. NOT_STARTED, IN_PROGRESS, COMPLETE, READY_TO_RESUME or NEED_CLARIFICATION.
- A list of step outputs that is populated throughout the plan run.

In a later section we will also see that a plan run state also tracks the list of instances where human input was solicited during plan run, known as `Clarification`.

Plan run states are captured in the `PlanRun` class (<a href="/SDK/portia/plan_run" target="_blank">**SDK reference ↗**</a>). In the previous section (<a href="/generate-plan" target="_blank">**Generate a plan ↗**</a>), we generated a plan in response to the query `Which stock price grew faster in 2024, Amazon or Google?`. Let's examine the final state once we run that plan:
<Tabs>
  <TabItem value="plan" label="Generated plan">
    ```json title="plan-1dcd74a4-0af5-490a-a7d0-0df4fd983977.json"
    {
      "id": "plan-1dcd74a4-0af5-490a-a7d0-0df4fd983977",
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
    <TabItem value="plan_run" label="Plan run in final state" default>
    ```json title="prun-18d9aa91-0066-413f-af32-b979bce89821.json"
    {
      "id": "prun-18d9aa91-0066-413f-af32-b979bce89821",
      "plan_id": "plan-a89efeb0-51ef-4f2c-b435-a936c27c3cfc",
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

Every plan run has a unique `id` and relates to a unique `plan_id`. If you were to attempt running the same plan multiple times, you would generate multiple `PlanRun` objects each with a unique `id` but all with the same `plan_id` property.

## Plan run state changes
As Portia cycles through a plan run, an execution agent is instantiated at every step and that agent will call the tool designated for that. The plan run state is enriched with step outputs at every step of the execution as well. Note that in this example the main tool used is the 'Search Tool' provided in this SDK in the `example_tool_registry`, and wraps around the Tavily API. We will discuss tools in more depth in the next section.
You should be able to inspect the state changes for the above plan run in the logs when you run the code.
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
<small>Animation above made on the brilliant <a href="https://snappify.com" target="_blank">**snappify.com ↗**</a>.</small>




## Run from a pre-expressed plan
<details>
<summary>**Tavily API key required**</summary>

We will use a simple GET endpoint from Tavily in this section. Please sign up to obtain an API key from them (<a href="https://tavily.com/" target="_blank">**↗**</a>) and set it in the environment variable `TAVILY_API_KEY`.
</details>

To get to an output that looks like the plan run example above, let's expand on the code we used to generate a plan in the previous section (<a href="/generate-plan" target="_blank">**↗**</a>) by adding code to create and execute a plan run from that plan. This approach gives you the opportunity to serve that plan to the user and get their feedback / iterate on it before running the plan run for example. Here is the code to do that:
```python title="main.py"
from dotenv import load_dotenv
from portia import (
    Portia,
    default_config,
    example_tool_registry,
)

load_dotenv()

# Instantiate Portia. Load it with the default config and with the example tools.
portia = Portia(tools=example_tool_registry)

# Generate the plan from the user query
plan = portia.plan('Which stock price grew faster in 2024, Amazon or Google?')

# [OPTIONAL] INSERT CODE WHERE YOU SERVE THE PLAN TO THE USER OR ITERATE ON IT IN ANY WAY

# Run the generated plan
plan_run = portia.run_plan(plan)

# Serialise into JSON and print the output
print(plan_run.model_dump_json(indent=2))
```

Here we are storing the `Plan` object returned by the `plan` method. We then use the `run_plan` method to start a `PlanRun`.

:::info
If you want to see an example where a user iterates on a plan before we proceed with plan run, take a look at the intro example in our <a href="https://github.com/portiaAI/portia-agent-examples/blob/main/get_started_google_tools/README.md" target="_blank">**examples repo (↗)**</a>.
:::

## Run a plan directly from a user query
<details>
<summary>**Tavily API key required**</summary>

We will use a simple GET endpoint from Tavily in this section. Please sign up to obtain an API key from them (<a href="https://tavily.com/" target="_blank">**↗**</a>) and set it in the environment variable `TAVILY_API_KEY`.
</details>

You can also run a plan immediately from the user query, without examining the `Plan` object in between. This would generate a plan as an intermediate step as well but will also immediately spawn a plan run from it. You would simply use the `run` method from your `Portia` instance class like so:
```python title="main.py"
from dotenv import load_dotenv
from portia import (
    Portia,
    default_config,
    example_tool_registry,
)

load_dotenv()

# Instantiate Portia. Load it with the default config and with the example tools.
portia = Portia(tools=example_tool_registry)

# Generate the plan from the user query
plan_run = portia.run('Which stock price grew faster in 2024, Amazon or Google?')

# Serialise into JSON and print the output
print(plan_run.model_dump_json(indent=2))
```
:::note[Track plan run states in logs]
You can track plan run state changes live as they occur through the logs by setting `default_log_level` to DEBUG in the `Config` of your `Portia` instance (<a href="/manage-config#manage-logging" target="_blank">**Manage logging ↗**</a>).
:::
