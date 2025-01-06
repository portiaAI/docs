---
sidebar_position: 1
---

# Generate a plan
Learn how to create structured, multi-agent plans using your LLM of choice and damiliarise yourself with the structure of plans created using Portia.
:::tip[TL;DR]
- A plan is the set of steps an LLM thinks it should take in order to respond to a user prompt.
- A plan is represented by the `plan` class and can be generated from a user prompt using the `plan_query` method of the `runner` class (<a href="/SDK/portia/runner" target="_blank">**SDK reference ↗**</a>).
    - Portia uses optimised system prompts to guide the LLM along a simple design language when generating a plan.
    - You can create your own plans manually using plan design language, esp. for repeatable workflows.
:::

## Overview of plans in Portia
A plan is the set of steps an LLM thinks it should take in order to respond to a user prompt. Plans are:
- **Immutable**: Once a plan is generated, it can not be altered. This is important for auditability. For example, we will support re-planning in near future to allow agents to react to changing variables, but this will result in new plans rather than effect change on the original plan.
- **Structured**: We use optimised system prompts to guide the LLM along a simple design language when generating a plan. This makes the plan format predictable and easy to process for the purposes of workflow automation
- **Human-readable**: Our plan design language is in a simple, serialisable format. It is easy to render and present to users in a human readable front-end experience. This helps your users easily stay on top of your LLM's reasoning.

While Portia generates a plan in response to a user prompt and then executes it, you also have the option to create plans yourself manually using our plan design language. This is especially suitable for your users' more repeatable routines.

## Portia's plan design language
Let's bring this one down by looking at an example plan below, created in response to the query `Send Avrana (avrana@kern.ai) the latest news on SpaceX`.
```json title="plan.json"
{
    "steps": [
        {
            "task": "Find and summarise the latest news on SpaceX",
            "tool_name": "portia::search_tool",
            "output": "$spacex_search_results"
        },
        {
            "task": "Email $avrana_email with $spacex_search_results",
            "input": [
                {
                    "name": "$spacex_search_results",
                    "description": "summary of SpaceX news"
                },
                {
                    "name": "$avrana_email",
                    "description": "Avrana's email address"                    
                }
            ],
            "tool_name": "portia::send_email_tool",
            "output": "$email_send_outcome"
        }
    ]
}
```

A plan includes a series of steps defined by 
- A task describing the objective of that particular step.
- The inputs required to achieve the step. Notice how the LLM is guided to weave the outputs of previous steps as inputs to the next ones where applicable e.g. `$spacex_search_results` coming out of the first step acts as an input to the second one.
- Any relevant tool needed for the completion of the step. Portia is able to filter for the relevant tools during the multi-shot plan generation process. As we will see later on in this tutorial you can specify the tool registries (directories) you want when handling a user prompt, including local / custom tools and ones provided by third parties. In this example we are referencing tools from Portia's cloud-hosted library, prefixed with `portia::`. 
- The step's final output. As mentioned above, every step output can be referenced in future steps. As we will see shortly, these outputs are serialised and saved in Workflow state as it is being executed.

:::info[On plan logic]
While plans are currently a linear sequence of steps, we will be introducing more complex logic soon.
:::

## Create a plan from a user prompt
When responding to a user's prompt with Portia, you can either chain the plan generation process to the subsequent instantiation of a workflow run from it, or you can choose to decouple them. The latter option allows you for example to display the plan to the user and tweak it before running a workflow.

Let's look at how we generate a plan from a user prompt. Paste the code below into your project and run it (using `poetry run python3 main.py` in Poetry)
```python title="main.py"
import json
from portia.runner import Runner
from portia.config import default_config
from portia.example_tools.registry import example_tool_registry

# Instantiate a Portia runner. Load it with the default config and with the example tools.
runner = Runner(config=default_config(), tool_registry=example_tool_registry)

# Generate the plan from the user query
output = runner.plan_query('add the temperature in London to the temperature in Beirut right now')

# Serialise into JSON and print the output
string = output.model_dump_json()
json_body = json.loads(string)
print(json.dumps(json_body, indent=2))
```

As mentioned earlier in the documentation, the `runner` class is your main entrypoint to interact with Portia's libraries (<a href="/SDK/portia/runner" target="_blank">**SDK reference ↗**</a>). The `plan_query` method is available from the `Runner` class and allows you to generate a plan from the query. Running the `plan_query` method per the code above returns a `plan` object (<a href="/SDK/portia/plan" target="_blank">**SDK reference ↗**</a>) which looks as follows:
```json title="plan.json"
{
    "id":"661bf677-3259-46aa-99af-6314db8ee98f",
    "query":"add the temperature in London to the temperature in Beirut right now",
    "steps":
    [
        {
            "task":"Get the current temperature in London.",
            "input":null,
            "tool_name":"Weather Tool",
            "output":"$london_temperature"
        },
        {
            "task":"Get the current temperature in Beirut.",
            "input":null,
            "tool_name":"Weather Tool",
            "output":"$beirut_temperature"
        },
        {
            "task":"Add the temperature in London to the temperature in Beirut.",
            "input":[
                {
                    "name":"$london_temperature",
                    "description":"The current temperature in London."
                },
                {
                    "name":"$beirut_temperature",
                    "description":"The current temperature in Beirut."
                }
            ],
            "tool_name":"Add Tool",
            "output":"$total_temperature"
        }
    ]
}
```

The `plan_query` method can take the following additional parameters:
- `tools` in order to confine the plan generation to a narrower set of tools if required (for simplicity or for user-access considerations)
- `example_plans` expected a list of `plan` objects. This allows you to use existing plans as inspiration or templates, which improves repeatability for more routine workflows.

Now that you know how to generate plans in response to a user query, let's take a look at how to instantiate a workflow from a plan in the next section and run it.
