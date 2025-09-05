---
sidebar_label: run_context
title: portia.run_context
---

Context for a PlanV2 run.

## StepOutputValue Objects

```python
class StepOutputValue(BaseModel)
```

Value that can be referenced by name.

## RunContext Objects

```python
class RunContext(BaseModel)
```

Data that is returned from a step.

#### get\_tool\_run\_ctx

```python
def get_tool_run_ctx() -> ToolRunContext
```

Get the tool run context.

