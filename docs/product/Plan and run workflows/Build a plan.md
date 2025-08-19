---
sidebar_position: 2
slug: /build-plan
---

# Build a plan manually

:::tip[Alpha]
PlanBuilderV2 is currently in Alpha so please expect changes in this area and we'd love your feedback on our discord!
:::

If you prefer to explicitly define a plan step by step rather than rely on our planning agent, e.g. for established processes in your business, you can use the `PlanBuilderV2` interface. This requires outlining all the steps, inputs, outputs and tools.

The `PlanBuilderV2` offers methods to create each part of the plan iteratively:

## Steps
- `.llm_step()` adds a step that sends a query to the underlying LLM
- `.tool_call()` adds a step that directly invokes a tool. Requires mapping of step outputs to tool arguments.
- `.single_tool_agent()` is similar to `.tool_call()` but an LLM call is made to map the inputs to the step to what the tool requires creating flexibility.
- `.function_call()` is identical to `.tool_call()` but uses a `Callable` rather than a tool with an ID.

## Inputs and outputs
- `.input()` method adds inputs to the plan that can then be used in 
- `.final_output()` method sets the final output configuration (output schema and summarisation settings).

## Building the plan
- `.build()` finally builds the `PlanV2` object

## Example

```python title='plan_builder.py'
from portia.builder import PlanBuilder
from portia.builder.step import StepOutput, Input

# Example: Build a plan to research a city
plan = PlanBuilderV2(
    label="Research information about Paris including its capital status and population"
).input(
    name="country_name",
    description="The name of the country to research"
).llm_step(
    task="Find the capital of the country provided",
    inputs=[Input("country_name")],
    name="capital_name"
).tool_run(
    tool="portia:tavily::search",
    args={"search_query": f"population of {StepOutput('capital_name')}"},
    name="find_population"
).input(
    name="email_address",
    description="The email address to send the search result to",
    value="doesntexist@portialabs.ai"
).single_tool_agent(
    tool="portia:google:gmail:send_email",
    task="Send me an email summarizing the search result",
    inputs=[StepOutput("find_population"), StepOutput("capital_name"), Input("email_address")],
    name="send_email"
).final_output(
    output_schema=None,
    summarize=True
).build()

portia.run_plan(plan, plan_run_inputs={"country_name": "France"})
```
'''

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

### Tool run
Use `.tool_run()` to add a step that directly invokes a tool:

```python
builder.tool_run(
    tool="portia:tavily::search",
    args={"query": "latest news about AI"},
    name="search_news"
)
```

### Function Call
Use `.function_call()` to add a step that calls a function. This is useful for streaming updates on the plan as it is run or adding in guardrails.

```python
def process_data(data):
    return {"processed": data.upper()}

builder.function_call(
    function=process_data,
    args={"data": StepOutput(0)},
    name="process_raw_data"
)
```

### Single Tool Agent
Use `.single_tool_agent()` to add a step that calls a tool using arguments that are worked out dynamically from the inputs:

```python
builder.single_tool_agent(
    tool="web_scraper",
    task="Extract key information from the webpage",
    inputs=[StepOutput("text_blob_with_url")],
    name="scrape_webpage"
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

You can also provide the value to the input, e.g 
```python
builder.input(
    name="user_query",
    description="The user's question or request"
    # Default values can be overriden in plan_run_inputs but will be used as the fallback.
    default_value="What is the capital of France?"
)
```

Or you can dyamically add the value of the plan at run time, e.g
```python
portia.run_plan(plan, plan_run_inputs={"user_query": "What is the capital of France?"})
```

### Referencing Step Outputs
You can reference outputs from previous steps using `StepOutput`:

```python
from portia.builder.step import StepOutput

builder.tool_call(
    tool="calculator",
    args={"expression": f"{StepOutput("previous_step")}"}
)
```

You can also reference previous step outputs using their index:
```python
from portia.builder.step import StepOutput

builder.tool_call(
    tool="calculator",
    args={"expression": f"{StepOutput(1, "result")}"}
)
```

### Final Output Configuration
Use `.final_output()` to configure the final output:

```python
plan = builder.final_output(
    output_schema=FinalResult,
    summarize=True
).build()

plan_run = portia.run(plan)
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

There is an older form of the plan builder described below which is still functional in the SDK but overtime we will be replacing it will PlanBuilderV2.

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

