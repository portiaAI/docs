---
sidebar_position: 5
slug: /inputs-outputs
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Inputs and Outputs
Inputs and outputs are the core of any agentic workflow, and Portia provides a flexible way to define and use them. Inputs are managed via the plan input interface, while structured outputs are managed via the plan structured output interface in conjunction with Pydantic BaseModels.

## Plan Inputs

So far the starting point for all plan runs is a user query for a specific set of inputs e.g. "get the weather in Beirut". This is in contrast to a generalised query e.g. "get the weather for a given city" where the city is provided dynamically per plan run. The PlanInput abstraction allows you to use a generalised query or plan "template" where the input differs with every plan run.

In the planning stage, you would define the list of plan inputs, providing a name and optional description for each, and pass those along with a generalised query as arguments to the portia.plan method. The planning agent is capable of generating a plan with "placeholders" for each plan input. To run that generalised plan, Portia then expects you to provide specific values for the inputs at each run.

For example, consider a simple agent that tells you the weather in a particular city, with the city provided as a plan input.
To set this up, we define the plan input for the planner as follows:
<Tabs groupId="sync-async">
  <TabItem value="sync" label="Sync" default>
```python id=plan_with_inputs
from portia import Portia

portia = Portia()

# Specify the inputs you will use in the plan
plan_input = {"name":"$city", "description": "The city to get the temperature for"}
plan = portia.plan("Get the temperature for the provided city", plan_inputs=[plan_input])

# This will create a single step plan that uses the weather tool with $city as an input to that tool.
# Then, when running the plan, we pass in a value for the input. In this case, we select "London".
# This value will then be used for the `$city` input in the plan and we will find the temperature in London.

# Specify the values for those inputs when you run the plan
plan_run_inputs = {"name": "$city", "value": "London"}
plan_run = portia.run("Get the temperature for the provided city", plan_run_inputs=[plan_run_inputs])
```
  </TabItem>
  <TabItem value="async" label="Async">
```python id=plan_with_inputs
import asyncio
from portia import Portia

portia = Portia()

async def main():
    # Specify the inputs you will use in the plan
    plan_input = {"name":"$city", "description": "The city to get the temperature for"}
    plan = await portia.aplan("Get the temperature for the provided city", plan_inputs=[plan_input])

    # This will create a single step plan that uses the weather tool with $city as an input to that tool.
    # Then, when running the plan, we pass in a value for the input. In this case, we select "London".
    # This value will then be used for the `$city` input in the plan and we will find the temperature in London.

    # Specify the values for those inputs when you run the plan
    plan_run_inputs = {"name": "$city", "value": "London"}
    plan_run = await portia.arun("Get the temperature for the provided city", plan_run_inputs=[plan_run_inputs])

# Run the async function
asyncio.run(main())
```
  </TabItem>
</Tabs>

## Plan Structured Outputs

For some plans you might want to have a structured output at the end of a plan, for this we allow the ability to attach a structured output schema to the plan that the summarizer agent will attempt to coerce the results to. This is optional and is based on <a href="https://docs.pydantic.dev/latest/#pydantic-examples" target="_blank">**Pydantic BaseModels ↗**</a>. To use, attach to the Plan object, and any Plan Runs that are created from this will attempt to use structured output for the final result, this can pull information from any point of the plan steps and is not just the final step. To attach a schema, you can do it through the PlanBuilder or the Plan interfaces, as below.

<Tabs>
  <TabItem value="sync" label="Sync" default>
```python title='plan_structured_output.py'
from portia.plan import PlanBuilder
from pydantic import BaseModel
from dotenv import load_dotenv
from portia import (
    Portia,
    default_config,
    example_tool_registry,
)

load_dotenv()
portia = Portia(tools=example_tool_registry)

# Final output schema type to coerce to
class FinalPlanOutput(BaseModel):
    result: float # result here is an integer output from calculator tool, but will be converted 
    # to a float via structured output you can also add other fields here, and they will be 
    # included in the output, as per any other Pydantic BaseModel

# Example via plan builder, attach to the plan at top level
plan = PlanBuilder(
  "Add 1 + 1", structured_output_schema=FinalPlanOutput
).step(
  "Add 1 + 1", tool_id='calculator_tool'
).build()

# Example via plan interface
plan2 = portia.plan("Add 1 + 1", structured_output_schema=FinalPlanOutput) 
```
  </TabItem>
  <TabItem value="async" label="Async">
```python title='plan_structured_output.py'
import asyncio
from portia.plan import PlanBuilder
from pydantic import BaseModel
from dotenv import load_dotenv
from portia import (
    Portia,
    default_config,
    example_tool_registry,
)

load_dotenv()
portia = Portia(tools=example_tool_registry)

# Final output schema type to coerce to
class FinalPlanOutput(BaseModel):
    result: float # result here is an integer output from calculator tool, but will be converted 
    # to a float via structured output you can also add other fields here, and they will be 
    # included in the output, as per any other Pydantic BaseModel

async def main():
    # Example via plan builder, attach to the plan at top level
    plan = PlanBuilder(
      "Add 1 + 1", structured_output_schema=FinalPlanOutput
    ).step(
      "Add 1 + 1", tool_id='calculator_tool'
    ).build()

    # Example via plan interface
    plan2 = await portia.aplan("Add 1 + 1", structured_output_schema=FinalPlanOutput)

# Run the async function
asyncio.run(main())
```
  </TabItem>
</Tabs>
Run the plan as normal and the final output will be an instance of the attached schema. It will be coerced to the type of the BaseModel provided and follows all the same rules as a pydantic model, including validation and description for fields.

## LLM Tool Outputs
The LLMTool allows structured outputs to be returned from a tool call, and these will be coerced to the type of the BaseModel provided. This follows all the same rules as a pydantic model, including validation and description for fields in the same way as the plan structured output above, but only for an LLM tool call within the plan. 

```python title='llm_tool_output.py'
from portia import Portia, config, PlanBuilder
from portia.open_source_tools.llm_tool import LLMTool
from portia.open_source_tools.weather import WeatherTool
import dotenv
from pydantic import BaseModel, Field

# basics
dotenv.load_dotenv(override=True)
config = config.Config.from_default()

# structured output schema
class WeatherOutput(BaseModel):
    temperature: float
    description: str = Field(description="A description of the weather")

structured_llm_tool = LLMTool(structured_output_schema=WeatherOutput) # structured output schema attached

tools = [structured_llm_tool, WeatherTool()] # structured_llm_tool has a structured output schema attached
portia = Portia(config, tools=tools) # register the tools with the portia instance, including the structured_llm_tool

plan = PlanBuilder(
  "get the weather in london and summarize the weather"
).step(
  "get the weather in london", tool_id=weather_tool.id
).step(
  "summarize the weather", tool_id=structured_llm_tool.id
).build()
```

## Browser Tool Outputs
The BrowserTool allows structured outputs to be returned from a browser tool call, and these will be coerced to the type of the basemodel provided and follows all the same rules as a pydantic model, including validation and description for fields in the same way as the plan structured output above, but only for a browser tool call within the plan. 

```python title='browser_tool_output.py'
from portia import Portia, config, PlanBuilder
from portia.open_source_tools.browser_tool import BrowserTool
import dotenv
from pydantic import BaseModel, Field

# basics
dotenv.load_dotenv(override=True)

config = config.Config.from_default()


class Recipes(BaseModel):
    recipe_names: list[str] = Field(description="List of recipe names found on the page")

browsertool = BrowserTool(structured_output_schema=Recipes) # structured output schema attached
tools = [browsertool]
portia = Portia(config, tools=tools)

plan = PlanBuilder(
    "Get the top recipes from bbcgoodfood"
).step(
    "get all the names of recipes on the frontpage of bbcgoodfood.com", tool_id=browsertool.id
).build()
```
