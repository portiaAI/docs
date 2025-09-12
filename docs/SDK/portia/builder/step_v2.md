---
sidebar_label: step_v2
title: portia.builder.step_v2
---

Implementation of the various step types used in :class:`PlanV2`.

## StepV2 Objects

```python
class StepV2(BaseModel, ABC)
```

Abstract base class for all steps executed within a plan.

Each step represents an action that can be performed during plan execution,
such as calling an LLM / agent, invoking a tool, or requesting user input.

#### run

```python
@abstractmethod
async def run(run_data: RunContext) -> Any | LocalDataValue
```

Execute the step and return its output.

**Returns**:

  The step&#x27;s output value, which may be used by subsequent steps.

#### to\_legacy\_step

```python
@abstractmethod
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this step to the legacy Step format.

This is primarily used to determine how the steps should be presented in the Portia
Dashboard.

