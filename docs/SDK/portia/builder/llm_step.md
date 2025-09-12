---
sidebar_label: llm_step
title: portia.builder.llm_step
---

Implementation of the LLM step.

## LLMStep Objects

```python
class LLMStep(StepV2)
```

A step that executes a task using an LLM without any tool access.

This step is used for pure language model tasks like text generation,
analysis, or transformation that don&#x27;t require external tool calls.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="LLM Step - Run")
async def run(run_data: RunContext) -> str | BaseModel
```

Execute the LLM task and return its response.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this LLMStep to a legacy Step.

