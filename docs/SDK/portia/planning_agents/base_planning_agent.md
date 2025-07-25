---
sidebar_label: base_planning_agent
title: portia.planning_agents.base_planning_agent
---

PlanningAgents module creates plans from queries.

This module contains the PlanningAgent interfaces and implementations used for generating plans
based on user queries. It supports the creation of plans using tools and example plans, and
leverages LLMs to generate detailed step-by-step plans. It also handles errors gracefully and
provides feedback in the form of error messages when the plan cannot be created.

## BasePlanningAgent Objects

```python
class BasePlanningAgent(ABC)
```

Interface for planning.

This class defines the interface for PlanningAgents that generate plans based on queries.
A PlanningAgent will implement the logic to generate a plan or an error given a query,
a list of tools, and optionally, some example plans.

**Attributes**:

- `config` _Config_ - Configuration settings for the PlanningAgent.

#### \_\_init\_\_

```python
def __init__(config: Config) -> None
```

Initialize the PlanningAgent with configuration.

**Arguments**:

- `config` _Config_ - The configuration to initialize the PlanningAgent.

#### generate\_steps\_or\_error

```python
@abstractmethod
def generate_steps_or_error(
        query: str,
        tool_list: list[Tool],
        end_user: EndUser,
        examples: list[Plan] | None = None,
        plan_inputs: list[PlanInput] | None = None) -> StepsOrError
```

Generate a list of steps for the given query.

This method should be implemented to generate a list of steps to accomplish the query based
on the provided query and tools.

**Arguments**:

- `query` _str_ - The user query to generate a list of steps for.
- `tool_list` _list[Tool]_ - A list of tools available for the plan.
- `end_user` _EndUser_ - The end user for this plan
- `examples` _list[Plan] | None_ - Optional list of example plans to guide the PlanningAgent.
- `plan_inputs` _list[PlanInput] | None_ - Optional list of PlanInput objects defining
  the inputs required for the plan.
  

**Returns**:

- `StepsOrError` - A StepsOrError instance containing either the generated steps or an error.

#### agenerate\_steps\_or\_error

```python
async def agenerate_steps_or_error(
        query: str,
        tool_list: list[Tool],
        end_user: EndUser,
        examples: list[Plan] | None = None,
        plan_inputs: list[PlanInput] | None = None) -> StepsOrError
```

Generate a list of steps for the given query asynchronously.

This method should be implemented to generate a list of steps to accomplish the query based
on the provided query and tools.

**Arguments**:

- `query` _str_ - The user query to generate a list of steps for.
- `tool_list` _list[Tool]_ - A list of tools available for the plan.
- `end_user` _EndUser_ - The end user for this plan
- `examples` _list[Plan] | None_ - Optional list of example plans to guide the PlanningAgent.
- `plan_inputs` _list[PlanInput] | None_ - Optional list of PlanInput objects defining
  the inputs required for the plan.
  

**Returns**:

- `StepsOrError` - A StepsOrError instance containing either the generated steps or an error.

## StepsOrError Objects

```python
class StepsOrError(BaseModel)
```

A list of steps or an error.

This model represents either a list of steps for a plan or an error message if
the steps could not be created.

**Attributes**:

- `steps` _list[Step]_ - The generated steps if successful.
- `error` _str | None_ - An error message if the steps could not be created.

