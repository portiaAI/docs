---
sidebar_position: 4
slug: /manage-end-users
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Handle multiple end users

How to pass end user specific context to Portia.

:::tip[TL;DR]
The `ExecutionContext` class can be used to enrich your `Portia` instance with pertinent information about the execution context:
- `end_user_id` in your `ExecutionContext` object uniquely represents the end user in your system e.g. an internal ID or an email address.
- `additional_data` can be used to pass user specific info that may be relevant to the response such as title and department. It can also be used to pass execution context specific info e.g. related to the app through which the query was submitted to Portia (e.g. a Slack thread ID).
- Providing an execution context to the `Portia` instance is optional. It's mostly relevant when you want end user level traceability.
:::


## The plan run context at Portia

In Production, you will be running plans for many stakeholders including customers, employees and partners. You may want to pass information specific to these individuals when they submit a prompt and / or information specific to the current context they are operating in (e.g. the particular app they are using when they submit their prompt to initiate a plan run).

We refer to these "person" entities as **end users** and represent the current context in which they submitted their prompt through a `Context` object that is passed to the `Portia` instance:
- You can define an `end_user_id` property in your `Context` object. This can be any string value that uniquely represents the end user in your system e.g. an internal ID or an email address.
- Alongside the `end_user_id` you can also provide a set of additional attributes in the `additional_data` field. You can imagine passing a person's name, department, title etc. You could also pass useful information about the context in which Portia was called for example a Slack or Gmail thread ID so that Portia's planner may fetch the full conversation history if relevant.

## Pass the execution context to the plan run

```python title="main.py"
from dotenv import load_dotenv
from portia.config import default_config
from portia.execution_context import execution_context
from portia.open_source_tools.registry import example_tool_registry
from portia import Portia

load_dotenv()

portia = Portia(tools=example_tool_registry)

# We can also provide additional execution context to the process
# highlight-start
with execution_context(end_user_id="DemoUser123", additional_data={"email_address": "demo@portialabs.ai", "name": "Nicholas of Patara"}):
    plan_run = portia.run_query(
        "Get the temperature in Svalbard and write me a personalized greeting with the result.",
    )
# highlight-end

print(plan_run.model_dump_json(indent=2))
```

The result of this code block will be the addition of an `execution_context` section within the `PlanRun` state, and a `final_output` that is indeed personalised to Saint Nicholas (known by his stage name Santa Claus):
```json title="run_state.json"
{
  "id": "pr-d9991518-92d7-447f-bf28-4f7b9b8110ce",
  "plan_id": "plan-4f497c60-c33e-40ea-95b4-cd2054559fff",
  "current_step_index": 1,
  "clarifications": [],
  "state": "COMPLETE",
  # highlight-start
  "execution_context": {
    "end_user_id": "DemoUser123",
    "additional_data": {
      "email_address": "demo@portialabs.ai",
      "name": "Nicholas of Patara"
    },
    "planner_system_context_extension": null,
    "agent_system_context_extension": null
  },
  # highlight-end
  "step_outputs": {
    "$svalbard_temperature": {
      "value": "The current weather in Svalbard is light snow with a temperature of -11.53°C."
    },
    "$personalized_greeting": {
      "value": "Hello Nicholas of Patara, I hope you are keeping warm. With the current weather in Svalbard showing light snow and a temperature of -11.53°C, make sure to bundle up and stay cozy!"
    }
  },
  # highlight-start
  "final_output": {
    "value": "Hello Nicholas of Patara, I hope you are keeping warm. With the current weather in Svalbard showing light snow and a temperature of -11.53°C, make sure to bundle up and stay cozy!"
  }
  # highlight-end
}
```

Running `with execution_context` like this will:
- Pass the `end_user_id` and `additional_data` to the planner and agent LLMs.
- Persist the `end_user_id` and `additional_data` as part of the `PlanRun` as you saw in the output above:
    - You can use this information for granular usage traceability. If using Portia Cloud, you will be able to see and filter stored plan runs down to specific end users (via SDK or in the Dashboard).
    - You may want to persist the `end_user_id` on your side and use it consistently when interacting with Portia to uniquely identify the end user across plan runs. This may also be useful if you build authenticated tools with reusable oauth tokens, so that you can maintain the user association and leverage the tokens' reusability.
    - Some Portia cloud tools are OAuth-based. For those tools, we store oauth tokens for reusability if and only if an `end_user_id` was passed with the plan run during which the tokens were created. During any subsequent plan run using this same `end_user_id`, we will be able to identify reusable tokens and leverage those for the relevant tool calls if needed (<a href="/run-portia-tools" target="_blank">**Run Portia tools ↗**</a>). .

:::info[On persisting execution context]
A `PlanRun` object inherits the `ExecutionContext` with which it was created as we have seen from the output above. Whenever such a plan run is resumed it will by default resume with this execution context persisted within it. You may choose to override this execution context with a `with execution_context({new execution context here})` when resuming
```python skip=true
...
# if we want to resume the plan run with a new execution context, we can override it
with execution_context(context={new execution context here}):
    portia.run(plan_run)
...
```
:::
