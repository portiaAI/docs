---
sidebar_label: plan
title: portia.plan
---

Plan primitives used to define and execute workflows.

This module defines the core objects that represent the plan for executing a workflow.
The `Plan` class is the main structure that holds a series of steps (`Step`) to be executed by an
agent in response to a query. Each step can have inputs, an associated tool, and an output.
Variables can be used within steps to reference other parts of the plan or constants.

Classes in this file include:

- `Variable`: A variable used in the plan, referencing outputs of previous steps or constants.
- `Step`: Defines a single task that an agent will execute, including inputs and outputs.
- `ReadOnlyStep`: A read-only version of a `Step` used for passing steps to agents.
- `PlanContext`: Provides context about the plan, including the original query and available tools.
- `Plan`: Represents the entire series of steps required to execute a query.

These classes facilitate the definition of workflows that can be dynamically adjusted based on the
tools, inputs, and outputs defined in the plan.

## Variable Objects

```python
class Variable(BaseModel)
```

A variable in the plan.

A variable is a way of referencing other parts of the plan, usually either another step&#x27;s output
or a constant input variable.

Args:
    name (str): The name of the variable starting with &#x27;$&#x27;. The variable should be the output
                of another step, or be a constant.
    value (Any): The value of the variable, which may be set by other preceding steps if not
                 defined.
    description (str): A description of the variable.

## Step Objects

```python
class Step(BaseModel)
```

A step in a workflow.

A step represents a task in the workflow to be executed. It contains inputs (variables) and
outputs, and may reference a tool to complete the task.

Args:
    task (str): The task that needs to be completed by this step.
    inputs (list[Variable]): The input to the step, which can include constants and variables.
    tool_id (str | None): The ID of the tool used in this step, if applicable.
    output (str): The unique output ID for the result of this step.

## ReadOnlyStep Objects

```python
class ReadOnlyStep(Step)
```

A read-only copy of a step, passed to agents for reference.

This class creates an immutable representation of a step, which is used to ensure agents
do not modify the original plan during execution.

Args:
    step (Step): A step object from which to create a read-only version.

#### from\_step

```python
@classmethod
def from_step(cls, step: Step) -> ReadOnlyStep
```

Create a read-only step from a normal step.

Args:
    step (Step): The step to be converted to read-only.

Returns:
    ReadOnlyStep: A new read-only step.

## PlanContext Objects

```python
class PlanContext(BaseModel)
```

Context for a plan.

The plan context contains information about the original query and the tools available
for the planner to use when generating the plan.

Args:
    query (str): The original query given by the user.
    tool_ids (list[str]): A list of tool IDs available to the planner.

## Plan Objects

```python
class Plan(BaseModel)
```

A plan represents a series of steps that an agent should follow to execute the query.

A plan defines the entire sequence of steps required to process a query and generate a result.
It also includes the context in which the plan was created.

Args:
    id (UUID): A unique ID for the plan.
    plan_context (PlanContext): The context for when the plan was created.
    steps (list[Step]): The set of steps that make up the plan.

#### serialize\_id

```python
@field_serializer("id")
def serialize_id(plan_id: UUID) -> str
```

Serialize the ID to a string.

Args:
    plan_id (UUID): The UUID of the plan.

Returns:
    str: The serialized string representation of the plan&#x27;s ID.

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

Args:
    plan (Plan): The original plan instance to create a read-only copy from.

Returns:
    ReadOnlyPlan: A new read-only instance of the provided plan.

