---
sidebar_label: plan
title: portia.plan
---

Plan primitives used to define and execute runs.

This module defines the core objects that represent the plan for executing a PlanRun.
The `Plan` class is the main structure that holds a series of steps (`Step`) to be executed by an
agent in response to a query. Each step can have inputs, an associated tool, and an output.
Variables can be used within steps to reference other parts of the plan or constants.

Classes in this file include:

- `Variable`: A variable used in the plan, referencing outputs of previous steps or constants.
- `Step`: Defines a single task that an agent will execute, including inputs and outputs.
- `ReadOnlyStep`: A read-only version of a `Step` used for passing steps to agents.
- `PlanContext`: Provides context about the plan, including the original query and available tools.
- `Plan`: Represents the entire series of steps required to execute a query.

These classes facilitate the definition of runs that can be dynamically adjusted based on the
tools, inputs, and outputs defined in the plan.

## PlanBuilder Objects

```python
@deprecated("Use PlanBuilderV2 instead")
class PlanBuilder()
```

A builder for creating plans.

This class provides an interface for constructing plans step by step. Requires a step to be
added to the plan before building it.

**Example**:

  plan = PlanBuilder()                 .step(&quot;Step 1&quot;, &quot;tool_id_1&quot;, &quot;output_1&quot;)                 .step(&quot;Step 2&quot;, &quot;tool_id_2&quot;, &quot;output_2&quot;)                 .input(&quot;input_1&quot;, &quot;value_1&quot;)                 .build()
  
  This class is now deprecated. Use PlanBuilderV2 instead.

#### \_\_init\_\_

```python
def __init__(query: str | None = None,
             structured_output_schema: type[BaseModel] | None = None) -> None
```

Initialize the builder with the plan query.

**Arguments**:

- `query` _str_ - The original query given by the user.
- `structured_output_schema` _type[BaseModel] | None_ - The optional structured output schema
  for the query.

#### step

```python
def step(
        task: str,
        tool_id: str | None = None,
        output: str | None = None,
        inputs: list[Variable] | None = None,
        condition: str | None = None,
        structured_output_schema: type[BaseModel] | None = None
) -> PlanBuilder
```

Add a step to the plan.

**Arguments**:

- `task` _str_ - The task to be completed by the step.
- `tool_id` _str | None_ - The ID of the tool used in this step, if applicable.
- `output` _str | None_ - The unique output ID for the result of this step.
- `inputs` _list[Variable] | None_ - The inputs to the step
- `condition` _str | None_ - A human readable condition which controls if the step should run
  or not.
- `structured_output_schema` _type[BaseModel] | None_ - The optional structured output schema
  for the step. Will override the tool output schema if provided by calling step
  summarizer with structured response.
  

**Returns**:

- `PlanBuilder` - The builder instance with the new step added.

#### input

```python
def input(name: str,
          description: str | None = None,
          step_index: int | None = None) -> PlanBuilder
```

Add an input variable to the chosen step in the plan (default is the last step).

Inputs are outputs from previous steps.

**Arguments**:

- `name` _str_ - The name of the input.
- `description` _str | None_ - The description of the input.
- `step_index` _int | None_ - The index of the step to add the input to. If not provided,
  the input will be added to the last step.
  

**Returns**:

- `PlanBuilder` - The builder instance with the new input added.

#### plan\_input

```python
def plan_input(name: str, description: str) -> PlanBuilder
```

Add an input variable to the plan.

**Arguments**:

- `name` _str_ - The name of the input.
- `description` _str_ - The description of the input.
  

**Returns**:

- `PlanBuilder` - The builder instance with the new plan input added.

#### condition

```python
def condition(condition: str, step_index: int | None = None) -> PlanBuilder
```

Add a condition to the chosen step in the plan (default is the last step).

**Arguments**:

- `condition` _str_ - The condition to be added to the chosen step.
- `step_index` _int | None_ - The index of the step to add the condition to.
  If not provided, the condition will be added to the last step.
  

**Returns**:

- `PlanBuilder` - The builder instance with the new condition added.

#### build

```python
def build() -> Plan
```

Build the plan.

**Returns**:

- `Plan` - The built plan.

## Variable Objects

```python
class Variable(BaseModel)
```

A reference to an output of a step.

**Arguments**:

- `name` _str_ - The name of the output or plan input to reference, e.g. $best_offers.
- `description` _str_ - A description of the output or plan input.

#### pretty\_print

```python
def pretty_print() -> str
```

Return the pretty print representation of the variable.

**Returns**:

- `str` - A pretty print representation of the variable&#x27;s name, and description.

## PlanInput Objects

```python
class PlanInput(BaseModel)
```

An input to a plan.

**Arguments**:

- `name` _str_ - The name of the input, e.g. $api_key.
- `description` _str_ - A description of the input.

#### pretty\_print

```python
def pretty_print() -> str
```

Return the pretty print representation of the plan input.

**Returns**:

- `str` - A pretty print representation of the input&#x27;s name, and description.

## Step Objects

```python
class Step(BaseModel)
```

A step in a PlanRun.

A step represents a task in the run to be executed. It contains inputs (variables) and
outputs, and may reference a tool to complete the task.

**Arguments**:

- `task` _str_ - The task that needs to be completed by this step.
- `inputs` _list[Variable]_ - The input to the step, as a reference to an output of a previous
  step or a plan input
- `tool_id` _str | None_ - The ID of the tool used in this step, if applicable.
- `output` _str_ - The unique output ID for the result of this step.

#### pretty\_print

```python
def pretty_print() -> str
```

Return the pretty print representation of the step.

**Returns**:

- `str` - A pretty print representation of the step&#x27;s task, inputs, tool_id, and output.

## ReadOnlyStep Objects

```python
class ReadOnlyStep(Step)
```

A read-only copy of a step, passed to agents for reference.

This class creates an immutable representation of a step, which is used to ensure agents
do not modify the original plan during execution.

**Arguments**:

- `step` _Step_ - A step object from which to create a read-only version.

#### from\_step

```python
@classmethod
def from_step(cls, step: Step) -> ReadOnlyStep
```

Create a read-only step from a normal step.

**Arguments**:

- `step` _Step_ - The step to be converted to read-only.
  

**Returns**:

- `ReadOnlyStep` - A new read-only step.

## PlanContext Objects

```python
class PlanContext(BaseModel)
```

Context for a plan.

The plan context contains information about the original query and the tools available
for the planning agent to use when generating the plan.

**Arguments**:

- `query` _str_ - The original query given by the user.
- `tool_ids` _list[str]_ - A list of tool IDs available to the planning agent.

#### serialize\_tool\_ids

```python
@field_serializer("tool_ids")
def serialize_tool_ids(tool_ids: list[str]) -> list[str]
```

Serialize the tool_ids to a sorted list.

**Returns**:

- `list[str]` - The tool_ids as a sorted list.

## Plan Objects

```python
class Plan(BaseModel)
```

A plan represents a series of steps that an agent should follow to execute the query.

A plan defines the entire sequence of steps required to process a query and generate a result.
It also includes the context in which the plan was created.

**Arguments**:

- `id` _PlanUUID_ - A unique ID for the plan.
- `plan_context` _PlanContext_ - The context for when the plan was created.
- `steps` _list[Step]_ - The set of steps that make up the plan.
- `inputs` _list[PlanInput]_ - The inputs required by the plan.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return the string representation of the plan.

**Returns**:

- `str` - A string representation of the plan&#x27;s ID, context, and steps.

#### from\_response

```python
@classmethod
def from_response(cls, response_json: dict) -> Plan
```

Create a plan from a response.

**Arguments**:

- `response_json` _dict_ - The response from the API.
  

**Returns**:

- `Plan` - The plan.

#### pretty\_print

```python
def pretty_print() -> str
```

Return the pretty print representation of the plan.

**Returns**:

- `str` - A pretty print representation of the plan&#x27;s ID, context, and steps.

#### validate\_plan

```python
@model_validator(mode="after")
def validate_plan() -> Self
```

Validate the plan.

Checks that all outputs + conditions are unique.

**Returns**:

- `Plan` - The validated plan.

## ReadOnlyPlan Objects

```python
class ReadOnlyPlan(Plan)
```

A read-only copy of a plan, passed to agents for reference.

This class provides a non-modifiable view of a plan instance,
ensuring that agents can access plan details without altering them.

#### from\_plan

```python
@classmethod
def from_plan(cls, plan: Plan) -> ReadOnlyPlan
```

Create a read-only plan from a normal plan.

**Arguments**:

- `plan` _Plan_ - The original plan instance to create a read-only copy from.
  

**Returns**:

- `ReadOnlyPlan` - A new read-only instance of the provided plan.

