---
sidebar_label: conditional_step
title: portia.builder.conditional_step
---

Implementation of Conditional Steps.

## ConditionalStep Objects

```python
class ConditionalStep(StepV2)
```

A step that represents a conditional clause within a conditional execution block.

This step handles conditional logic such as if, else-if, else, and end-if statements
that control which subsequent steps should be executed based on runtime conditions.

#### validate\_conditional\_block

```python
@field_validator("conditional_block", mode="after")
@classmethod
def validate_conditional_block(cls,
                               v: ConditionalBlock | None) -> ConditionalBlock
```

Validate the conditional block.

#### block

```python
@property
def block() -> ConditionalBlock
```

Get the conditional block for this step.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="Conditional Step - Run")
async def run(run_data: RunContext) -> Any
```

Evaluate the condition and return a ConditionalStepResult.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this ConditionalStep to a legacy Step.

