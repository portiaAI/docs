---
sidebar_label: invoke_tool_step
title: portia.builder.invoke_tool_step
---

Implementation of the invoke tool step.

## InvokeToolStep Objects

```python
class InvokeToolStep(StepV2)
```

A step that directly invokes a tool with specific arguments.

This performs a direct tool call without LLM involvement, making it suitable
for deterministic operations where you know exactly which tool to call and
what arguments to pass.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="Invoke Tool Step - Run")
async def run(run_data: RunContext) -> Any
```

Execute the tool and return its result.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this InvokeToolStep to a legacy Step.

