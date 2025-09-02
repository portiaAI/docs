---
sidebar_label: plan_v2
title: portia.builder.plan_v2
---

A plan built using the PlanBuilder.

## PlanV2 Objects

```python
class PlanV2(BaseModel)
```

A sequence of steps to be run by Portia.

#### validate\_plan

```python
@model_validator(mode="after")
def validate_plan() -> Self
```

Validate the plan.

#### to\_legacy\_plan

```python
def to_legacy_plan(plan_context: PlanContext) -> Plan
```

Convert the Portia plan to a legacy plan.

#### step\_output\_name

```python
def step_output_name(step: int | str | StepV2) -> str
```

Get the name of the output of a step in the plan.

#### idx\_by\_name

```python
def idx_by_name(name: str) -> int
```

Get the index of a step by name.

#### pretty\_print

```python
def pretty_print() -> str
```

Return the pretty print representation of the plan.

**Returns**:

- `str` - A pretty print representation of the plan.

