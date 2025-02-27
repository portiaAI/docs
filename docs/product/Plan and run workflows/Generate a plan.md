---
sidebar_position: 1
slug: /generate-plan
---

# Generate a plan
Learn how to create structured, multi-agent plans using your LLM of choice and familiarise yourself with the structure of plans created using Portia.
:::tip[TL;DR]
- A plan is the set of steps an LLM thinks it should take in order to respond to a user prompt.
- A plan is represented by the `Plan` class and can be generated from a user prompt using the `plan_query` method of the `Runner` class (<a href="/SDK/portia/runner" target="_blank">**SDK reference ↗**</a>).
    - Portia uses optimised system prompts and structured outputs to ensure adherence to a plan.
    - You can create your own plans manually or reload existing plans, which is especially useful for repeatable workflows.
:::

## Overview of plans in Portia
A plan is the set of steps an LLM thinks it should take in order to respond to a user prompt. Plans are:
- **Immutable**: Once a plan is generated, it can not be altered. This is important for auditability. For example, we will support re-planning in near future to allow agents to react to changing variables, but this will result in new plans rather than effect change on the original plan.
- **Structured**: We use optimised system prompts to guide the LLM along a simple design language when generating a plan. This makes the plan format predictable and easy to process for the purposes of workflow automation.
- **Human-readable**: Our planning language is in a simple, serialisable format. It is easy to render and present to users in a human readable front-end experience. This helps your users easily stay on top of your LLM's reasoning.

While Portia generates a plan in response to a user prompt and then executes it, you also have the option to create plans yourself manually. This is especially suitable for your users' more repeatable routines.

## Introducing a Plan
Let's bring this one to life by looking at an example plan below, created in response to the query `Send Avrana (avrana@kern.ai) the latest news on SpaceX`.
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
- `"task"` A task describing the objective of that particular step.
- `"input"` The inputs required to achieve the step. Notice how the LLM is guided to weave the outputs of previous steps as inputs to the next ones where applicable e.g. `$spacex_search_results` coming out of the first step acts as an input to the second one.
- "`tool_name`" Any relevant tool needed for the completion of the step. Portia is able to filter for the relevant tools during the multi-shot plan generation process. As we will see later on in this tutorial you can specify the tool registries (directories) you want when handling a user prompt, including local / custom tools and ones provided by third parties. In this example we are referencing tools from Portia's cloud-hosted library, prefixed with `portia::`. 
- "`output`" The step's final output. As mentioned above, every step output can be referenced in future steps. As we will see shortly, these outputs are serialised and saved in Workflow state as it is being executed.

:::info[On plan logic]
While plans are currently a linear sequence of steps, we will be introducing more complex logic soon.
:::

## Create a plan from a user prompt
When responding to a user's prompt with Portia, you can either chain the plan generation process to the subsequent instantiation of a workflow run from it, or you can choose to decouple them. The latter option allows you for example to display the plan to the user and tweak it before running a workflow.

Let's look at how we generate a plan from a user prompt. Paste the code below into your project and run it (using `poetry run python3 main.py` in Poetry)
```python title="main.py"
from dotenv import load_dotenv
from portia.runner import Runner
from portia.config import default_config
from portia.open_source_tools.registry import example_tool_registry

load_dotenv()

# Instantiate a Portia runner. Load it with the default config and with the example tools.
runner = Runner(config=default_config(), tools=example_tool_registry)

# Generate the plan from the user query
plan = runner.generate_plan('Which stock price grew faster in 2024, Amazon or Google?')

# Serialise into JSON and print the output
print(plan.model_dump_json(indent=2))
```

As mentioned earlier in the documentation, the `Runner` class is your main entrypoint to interact with Portia's libraries (<a href="/SDK/portia/runner" target="_blank">**SDK reference ↗**</a>). The `generate_plan` method is available from the `Runner` class and allows you to generate a plan from the query. Running the `generate_plan` method per the code above returns a `Plan` object (<a href="/SDK/portia/plan" target="_blank">**SDK reference ↗**</a>) which looks as follows:
```json title="plan.json"
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

The `generate_plan` method can take the following additional parameters:
- `tools` in order to confine the plan generation to a narrower set of tools if required (for simplicity or for user-access considerations). In our example above we provided the `example_tool_registry`, which is a collection of three open source tools in our SDK.
- `example_plans` expects a list of `Plan` objects. This allows you to use existing plans as inspiration or templates, which improves repeatability for more routine workflows.

Now that you know how to generate plans in response to a user query, let's take a look at how to instantiate a workflow from a plan in the next section and run it.
