---
sidebar_label: sub_plan_step
title: portia.builder.sub_plan_step
---

Step that executes a sub-plan within a parent plan.

## SubPlanStep Objects

```python
class SubPlanStep(StepV2)
```

A step that executes a nested PlanV2 and returns its final result.

This step allows for modular plan composition by executing a complete sub-plan
within the context of a larger plan. The sub-plan runs with its own input values
and execution context, but shares the same tool registry, configuration, and
execution hooks as the parent plan.

This is useful for creating reusable sub-workflows, organizing complex plans
into manageable components, or implementing conditional execution of entire
plan segments. The sub-plan&#x27;s final output becomes the output of this step,
which can then be referenced by subsequent steps in the parent plan.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="Subplan Step - Run")
async def run(run_data: RunContext) -> Any
```

Run the sub-plan using the current Portia configuration.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this SubPlanStep to a legacy Step.

