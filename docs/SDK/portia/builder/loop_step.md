---
sidebar_label: loop_step
title: portia.builder.loop_step
---

Types to support Loops.

## LoopStep Objects

```python
class LoopStep(StepV2)
```

A step that represents a loop in a loop block.

This step handles loop logic such as while, do-while, and for-each loops that
control which subsequent steps should be executed based on runtime conditions.

#### validate\_model

```python
@model_validator(mode="after")
def validate_model() -> Self
```

Validate the loop.

#### run

```python
@override
@traceable(name="Loop Step - Run")
async def run(run_data: RunContext) -> Any
```

Run the loop step.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this LoopStep to a PlanStep.

