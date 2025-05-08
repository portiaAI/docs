---
sidebar_position: 1
slug: /generate-plan
---

# Generate a plan
Learn how to create structured, multi-agent plans using your LLM of choice and familiarise yourself with the structure of plans created using Portia.
:::tip[TL;DR]
- A plan is the set of steps an LLM thinks it should take in order to respond to a user prompt.
- A plan is represented by the `Plan` class and can be generated from a user prompt using the `plan` method of the `Portia` class (<a href="/SDK/portia/portia" target="_blank">**SDK reference ↗**</a>).
    - Portia uses optimised system prompts and structured outputs to ensure adherence to a plan.
    - You can create your own plans manually or reload existing plans, which is especially useful for repeatable plan runs.
:::

## Overview of plans in Portia
A plan is the set of steps an LLM thinks it should take in order to respond to a user prompt. Plans are:
- **Immutable**: Once a plan is generated, it cannot be altered. This is important for auditability.
- **Structured**: We use optimised system prompts to guide the LLM along a simple design language when generating a plan. This makes the plan format predictable and easy to process for the purposes of automation.
- **Human-readable**: Our planning language is in a simple, serialisable format. It is easy to render and present to users in a human readable front-end experience. This helps your users easily stay on top of your LLM's reasoning.

While Portia generates a plan in response to a user prompt and then runs it, you also have the option to create plans yourself manually. This is especially suitable for your users' more repeatable routines.

## Introducing a Plan
Let's bring this one to life by looking at an example plan below, created in response to the query `Search for the latest SpaceX news from the past 48 hours and if there are at least 3 articles, email Avrana (avrana@kern.ai) a summary of the top 3 developments with subject 'Latest SpaceX Updates'`.
```json title="plan.json"
{
  "steps": [
    {
      "task": "Search for the latest SpaceX news from the past 48 hours using the search tool.",
      "inputs": [],
      "tool_id": "search_tool",
      "output": "$spacex_news_results",
    },
    {
      "task": "Summarize the top 3 developments from the SpaceX news articles.",
      "inputs": [
        {
          "name": "$spacex_news_results",
          "description": "The list of SpaceX news articles returned by the search tool."
        }
      ],
      "tool_id": "llm_tool",
      "output": "$spacex_summary",
      "condition": "if $spacex_news_results contains at least 3 articles"
    },
    {
      "task": "Email Avrana (avrana@kern.ai) a summary of the top 3 SpaceX developments with the subject 'Latest SpaceX Updates'.",
      "inputs": [
        {
          "name": "$spacex_summary",
          "description": "The summary of the top 3 SpaceX developments."
        }
      ],
      "tool_id": "portia:google:gmail:send_email",
      "output": "$email_sent",
      "condition": "if $spacex_news_results contains at least 3 articles"
    }
  ]
}
```

A plan includes a series of steps defined by 
- `"task"` A task describing the objective of that particular step.
- `"input"` The inputs required to achieve the step. Notice how the LLM is guided to weave the outputs of previous steps as inputs to the next ones where applicable e.g. `$spacex_news_results` coming out of the first step acts as an input to the second one.
- `"tool_id"` Any relevant tool needed for the completion of the step. Portia is able to filter for the relevant tools during the multi-shot plan generation process. As we will see later on in this tutorial you can specify the tool registries (directories) you want when handling a user prompt, including local / custom tools and ones provided by third parties. In this example we are referencing tools from Portia's cloud-hosted library, prefixed with `portia:`. 
- `"output"` The step's final output. As mentioned above, every step output can be referenced in future steps. As we will see shortly, these outputs are serialised and saved in plan run state as it is being executed.
- `"condition"` An optional condition that's used to control the execution of the step. If the condition is not met, the step will be skipped. This condition will be evaluated by our introspection agent, with the context of the plan and plan run state.


## Create a plan from a user prompt
When responding to a user's prompt with Portia, you can either chain the plan generation process to the subsequent instantiation of a plan run from it, or you can choose to decouple them. The latter option allows you for example to display the plan to the user and tweak it before running a plan.

Let's look at how we generate a plan from a user prompt. Paste the code below into your project and run it:
```python title="main.py"
from dotenv import load_dotenv
from portia import (
    Portia,
    default_config,
    example_tool_registry,
)

load_dotenv()

# Instantiate a Portia instance. Load it with the default config and with the example tools.
portia = Portia(tools=example_tool_registry)

# Generate the plan from the user query
plan = portia.plan('Which stock price grew faster in 2024, Amazon or Google?')

# Serialise into JSON and print the output
print(plan.model_dump_json(indent=2))
```

As mentioned earlier in the documentation, the `Portia` instance class is your main entrypoint to interact with Portia's libraries (<a href="/SDK/portia/" target="_blank">**SDK reference ↗**</a>). The `plan` method is available from the `Portia` instance class and allows you to generate a plan from the query. Running the `plan` method per the code above returns a `Plan` object (<a href="/SDK/portia/plan" target="_blank">**SDK reference ↗**</a>) which looks as follows:
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
      "tool_id": "search_tool",
      "output": "$amazon_stock_growth"
    },
    {
      "task": "Search for the latest stock price growth data for Google.",
      "inputs": [],
      "tool_id": "search_tool",
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
      "tool_id": "llm_tool",
      "output": "$stock_growth_comparison"
    }
  ]
}
```

The `plan` method can take the following additional parameters:
- `tools` in order to confine the plan generation to a narrower set of tools if required (for simplicity or for user-access considerations). In our example above we provided the `example_tool_registry`, which is a collection of three open source tools in our SDK.
- `example_plans` expects a list of `Plan` objects. This allows you to use existing plans as inspiration or templates, which improves repeatability for more routine plan runs.

## Plan Builder
If you don't want to create plans via LLM, and instead have structured steps that you know in advance or can create with templating or other structured methods, then the PlanBuilder interface can be used. The process to create a plan via the PlanBuilder interface is to outline all the steps, inputs and outputs needed, and the build the object into a Plan Object.

The plan is built up iteratively, with each function building on the previous part, `.step` adds a step to the end of a plan, `.input` and `.condition` adds to the last step added (but can be overwritten with a step_index variable). Finally, it needs to be built via `.build`
```python title='plan_builder.py'
from portia.plan import PlanBuilder

query = "What is the capital of france and what is the population of the city? If the city has a population of over 1 million, then find the mayor of the city."

plan = PlanBuilder(
  query # optional to provide, as the steps are built below, but provides context for storage and plan purpose
).step(
    task="Find the capital of france", # step task
    tool_id="google_search", # tool id maps to a tool in the tool registry
    output="$capital_of_france", # output variable name maps step output to variable
).step(
    task="Find the population of the capital of france",
    tool_id="google_search",
    output="$population_of_capital",
).input( # add an input to step 2
    name="$capital_of_france", # input variable name maps to a variable in the plan run outputs from step 1
    description="Capital of france" # optional description for the variable
).step(
    task="Find the mayor of the city",
    tool_id="google_search",
    output="$mayor_of_city",
).condition(
    condition="$population_of_capital > 1000000", # adding a condition to the step
).build() # build the plan once finalized

```
## User Led Learning

Example plans can be used to bias the planner towards actions, tool use and behaviours, while also improving the planners ability to generate more complex plans. Broadly, the process for doing this with portia is 3 steps below

- "Like" plans saved to Portia Cloud from the dashboard to signal that they are patterns you want to reinforce.
- Pull "Liked" plans based on semantic similarity to the user intent in a query by using our freshly minted `portia.storage.get_similar_plans` method (<a href="/SDK/portia/storage#get_similar_plans" target="_blank">**SDK reference ↗**</a>).
- Finally, ingest those similar plans as example plans in the Planning agent using the `portia.plan` method's `example_plans` property (<a href="/SDK/portia/" target="_blank">**SDK reference ↗**</a>).

For a deep dive into this feature and a practical example, check out our <a href="https://blog.portialabs.ai/improve-planning-with-user-led-learning" target="_blank">**ULL blog post on example plans ↗**</a>.

Now that you know how to generate plans in response to a user query, let's take a look at how to run a plan in the next section.
