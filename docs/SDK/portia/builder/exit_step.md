---
sidebar_label: exit_step
title: portia.builder.exit_step
---

Exit step implementation for plan termination.

## ExitStep Objects

```python
class ExitStep(StepV2)
```

A step that causes the plan to exit gracefully.

This step allows for early termination of a plan with an optional message and error flag. When
executed, the plan will stop execution and return the specified output.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="Exit Step - Run")
async def run(run_data: RunContext) -> ExitStepResult
```

Execute the exit step, causing the plan to terminate gracefully.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this ExitStep to a legacy Step.

