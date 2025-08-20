---
sidebar_position: 2
slug: /build-plan
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Build a plan manually

:::tip[Alpha]
PlanBuilderV2 is currently in Alpha so please expect changes in this area and we'd love your feedback on our <a href="https://discord.gg/DvAJz9ffaR" target="_blank">**Discord channel (↗)**</a>!
:::

If you prefer to explicitly define a plan step by step rather than rely on our planning agent, e.g. for established processes in your business, you can use the `PlanBuilderV2` interface. This requires outlining all the steps, inputs, outputs and tools for your agent manually.

The `PlanBuilderV2` offers methods to create each part of the plan iteratively:
- `.llm_step()` adds a step that sends a query to the underlying LLM
- `.invoke_tool_step()` adds a step that directly invokes a tool. Requires mapping of step outputs to tool arguments.
- `.single_tool_agent_step()` is similar to `.invoke_tool_step()` but an LLM call is made to map the inputs to the step to what the tool requires creating flexibility.
- `.function_step()` is identical to `.invoke_tool_step()` but calls a Python function rather than a tool with an ID.
- `.if_()`, `.else_if_()`, `.else_()` and `.endif()` are used to add conditional branching to the plan.

## Example

```python title='plan_builder.py'
from portia.builder import PlanBuilderV2, StepOutput, Input

plan = (
    PlanBuilderV2("Write a poem about the price of gold")
    .input(name="purchase_quantity", description="The quantity of gold to purchase in ounces")
    .input(name="currency", description="The currency to purchase the gold in", default_value="GBP")
    .invoke_tool_step(
        step_name="Search gold price",
        tool="search_tool",
        args={
            "search_query": f"What is the price of gold per ounce in {Input('currency')}?",
        },
        output_schema=CommodityPriceWithCurrency,
    )
    .function_step(
        function=lambda price_with_currency, purchase_quantity: (
            price_with_currency.price * purchase_quantity
        ),
        args={
            "price_with_currency": StepOutput("Search gold price"),
            "purchase_quantity": Input("purchase_quantity"),
        },
    )
    .llm_step(
        task="Write a poem about the current price of gold",
        inputs=[StepOutput(0), Input("currency")],
    )
    .single_tool_agent_step(
        task="Send the poem to Robbie in an email at donotemail@portialabs.ai",
        tool="portia:google:gmail:send_email",
        inputs=[StepOutput(2)],
    )
    .final_output(
        output_schema=FinalOutput,
    )
    .build()
)
```

<Tabs>
  <TabItem value="sync" label="Sync" default>
```python
portia.run_plan(plan, plan_run_inputs={"country_name": "France"})
```
  </TabItem>
  <TabItem value="async" label="Async">
```python
await portia.arun_plan(plan, plan_run_inputs={"country_name": "France"})
```
  </TabItem>
</Tabs>
```

## Available Step Types

### LLM step
Use `.llm_step()` to add a step that directly queries the LLM tool:

```python
builder.llm_step(
    task="Analyze the given data and provide insights",
    inputs=[StepOutput("previous_step")],
    output_schema=AnalysisResult,
    name="analyze_data"
)
```

The `output_schema` is a Pydantic model that is used for the structured output.

### Invoke Tool step
Use `.invoke_tool_step()` to add a step that directly invokes a tool:

```python
builder.invoke_tool_step(
    tool="portia:tavily::search",
    args={"query": "latest news about AI"},
    name="search_news"
)
```

### Function step
Use `.function_step()` to add a step that calls a function. This is useful for manipulating data from other steps using code, streaming updates on the plan as it is run or adding in guardrails.

```python
def process_data(data):
    return {"processed": data.upper()}

builder.function_step(
    function=process_data,
    args={"data": StepOutput(0)},
    name="process_raw_data"
)
```

### Single Tool Agent step
Use `.single_tool_agent_step()` to add a step that calls a tool using arguments that are worked out dynamically from the inputs:

```python
builder.single_tool_agent_step(
    tool="web_scraper",
    task="Extract key information from the webpage provided",
    inputs=[StepOutput("text_blob_with_url")],
    name="scrape_webpage"
)
```

## Conditionals

Use `.if_()` to start a conditional block for advanced control flow:

```python
(
    builder
    .if_(
        condition=lambda web_page: len(web_page) > 100_000,
        args={
            "web_page": StepOutput("scrape_webpage")
        }
    )
    .llm_step(
        task="Summarise the web page",
        inputs=[StepOutput("scrape_webpage")],
        name="summarise_webpage"
    )
    .endif()
)
```

`if_()` takes a predicate (named `condition`), which can either be a function, or a natural language string. If it is a function, then the function will be run to return a boolean indicating whether the condition passed. If it is a natural language string, then an LLM will be used to determine whether the string is true or false.

`args` is a dictionary of arguments to pass to the predicate. Like other step types, you can pass references or values (see the [Inputs and Outputs](#inputs-and-outputs) section below for more details).

Also note that you need to add an endif() at the end of the flow to indicate the end of the conditional branch.

Alternative branches can be added to the conditional block using `.else_if_()` and `.else_()`:

```python
(
    builder
    .if_(
        condition=lambda web_page: len(web_page) > 100_000,
        args={
            "web_page": StepOutput("scrape_webpage")
        }
    )   # ...
    .else_if_(
        condition=lambda web_page: len(web_page) < 100,
        args={
            "web_page": StepOutput("scrape_webpage")
        }
    )
    .function_step(
        function=lambda: raise_exception("Web page is too short"),
    )
    .else_()
    .function_step(
        function=lambda: print("All good!"),
    )
    .endif()
)
```

As mentioned, the condition can be a natural language string. Just write a statement that can be evaluated to true or false and pass the relevant context via the `args`.


```python
(
    builder
    .if_(
        condition="The web page is about large cats",
        args={
            "web_page": StepOutput("scrape_webpage")
        }
    )
)
```

Conditional blocks can be nested to create _even_ more complex control flow!

```python
(
    builder
    .if_(
        condition=lambda web_page: len(web_page) > 100_000,
        args={
            "web_page": StepOutput("scrape_webpage")
        }
    )
    # Nested conditional block
    .if_(
        condition=lambda web_page: len(web_page) > 1_000_000,
        args={
            "web_page": StepOutput("scrape_webpage")
        }
    )
    .function_step(
        function=lambda: raise_exception("Web page is too long"),
    )
    .endif()
    # ... back to the outer conditional block
)
```


## Inputs and Outputs

### Adding Plan Inputs
Use `.input()` to define inputs that the plan expects:

```python
builder.input(
    name="user_query",
    description="The user's question or request"
)
```

You can also provide the default value for the input, e.g 
```python
builder.input(
    name="user_query",
    description="The user's question or request"
    # Default values can be overriden in plan_run_inputs but will be used as the fallback.
    default_value="What is the capital of France?"
)
```

You can dynamically add the value of the plan at run time, e.g
```python
portia.run_plan(plan, plan_run_inputs={"user_query": "What is the capital of Peru?"})
```

### Referencing Step Outputs
You can reference outputs from previous steps using `StepOutput`:

```python
from portia import StepOutput

builder.invoke_tool_step(
    tool="calculator",
    args={"expression": f"This is some string {StepOutput("previous_step")} interpolation"}
)
```

You can also reference previous step outputs using their index:
```python
from portia import StepOutput

builder.invoke_tool_step(
    tool="calculator",
    args={"expression": StepOutput(1)"}
)
```

:::tip[Note]

The index of a step is the order in which it was added to the plan.

Conditional clauses (`.if_()`, `.else_if_()`, `.else_()` and `.endif()`) _are_ counted as steps and do have an index. Steps within a conditional branch are also counted - the step index is the order the steps appear in the plan, not the runtime index.
:::

### Final Output Configuration
Use `.final_output()` to configure the final output:

```python
plan = builder.final_output(
    output_schema=FinalResult,
    summarize=True
).build()
```

<Tabs>
  <TabItem value="sync" label="Sync" default>
```python
plan_run = portia.run(plan)
```
  </TabItem>
  <TabItem value="async" label="Async">
```python
plan_run = await portia.arun(plan)
```
  </TabItem>
</Tabs>
# Will match `FinalResult` schema
final_output_value = plan_run.outputs.final_output.value

# Provides a succinct summary of the outputs (calls LLM to populate)
final_output_summary = plan_run.outputs.final_output.summary
```

## Building the Plan

Once you've defined all your steps, call `.build()` to create the final plan:

```python
plan = builder.build()
```

The returned `PlanV2` object is ready to be executed with your Portia instance.


## [DEPRECATED] Build a plan manually

:::tip[Deprecation warning]

There is an older form of the plan builder described below which is still functional in the SDK but over time we will be replacing it will PlanBuilderV2.

:::

If you prefer to explicitly define a plan step by step rather than rely our planning agent, e.g. for established processes in your business, you can use the PlanBuilder interface. This obviously implies outlining all the steps, inputs, outputs and tools.

The `PlanBuilder` offers methods to create each part of the plan iteratively

- `.step` method adds a step to the end of the plan. It takes a `task`, `tool_id` and `output` name as arguments.
- `.input` and `.condition` methods add to the last step added, but can be overwritten with a `step_index` variable, and map outputs from one step to inputs of chosen (default last step), or considerations
- `.build` finally builds the `Plan` objective

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

