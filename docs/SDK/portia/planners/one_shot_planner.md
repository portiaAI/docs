---
sidebar_label: one_shot_planner
title: portia.planners.one_shot_planner
---

One shot planner is a single best effort attempt at planning based on the given query + tools.

## OneShotPlanner Objects

```python
class OneShotPlanner(Planner)
```

planner class.

#### \_\_init\_\_

```python
def __init__(config: Config) -> None
```

Init with the config.

#### generate\_steps\_or\_error

```python
def generate_steps_or_error(
        ctx: ExecutionContext,
        query: str,
        tool_list: list[Tool],
        examples: list[Plan] | None = None) -> StepsOrError
```

Generate a plan or error using an LLM from a query and a list of tools.

