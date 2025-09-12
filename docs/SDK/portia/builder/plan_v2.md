---
sidebar_label: plan_v2
title: portia.builder.plan_v2
---

Data model for plans assembled with :class:`PlanBuilderV2`.

## PlanV2 Objects

```python
class PlanV2(BaseModel)
```

An ordered collection of executable steps that can be executed by Portia.

A PlanV2 defines a sequence of StepV2 objects that are executed in order to accomplish a
specific task. Plans can include inputs, conditional logic, tool invocations, agent calls
and structured outputs.

This class is the successor to the Plan class in Portia. You should use this class rather than
the Plan class.

#### validate\_plan

```python
@model_validator(mode="after")
def validate_plan() -> Self
```

Validate the plan structure and enforce uniqueness constraints.

Ensures that all step names and plan input names are unique within the plan,
preventing conflicts during execution and reference resolution.

**Raises**:

- `ValueError` - If duplicate step names or plan input names are found.

#### to\_legacy\_plan

```python
def to_legacy_plan(plan_context: PlanContext) -> Plan
```

Convert this plan to the legacy Plan format.

This method enables backward compatibility with systems that still use the
original plan representation. It transforms each StepV2 into its legacy
equivalent while preserving all execution semantics.

**Arguments**:

- `plan_context` - Context information including the original query and tool registry.

#### step\_output\_name

```python
def step_output_name(step: int | str | StepV2) -> str
```

Generate the output variable name for a given step.

Creates a standardized variable name that can be used to reference the output
of a specific step. If the step cannot be resolved, returns a placeholder
name.

**Arguments**:

- `step` - The step to get the output name for. Can be:
  - int: Index of the step in the plan (negative values count from the end)
  - str: Name of the step
  - StepV2: The step instance itself

#### idx\_by\_name

```python
def idx_by_name(name: str) -> int
```

Find the index of a step by its name.

Searches through the plan&#x27;s steps to find the one with the specified name
and returns its position in the execution order.

**Raises**:

- `ValueError` - If no step with the specified name exists in the plan.

#### pretty\_print

```python
def pretty_print() -> str
```

Return a human-readable summary of the plan.

