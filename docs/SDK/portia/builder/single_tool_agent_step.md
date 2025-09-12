---
sidebar_label: single_tool_agent_step
title: portia.builder.single_tool_agent_step
---

Implementation of the single tool agent step.

## SingleToolAgentStep Objects

```python
class SingleToolAgentStep(StepV2)
```

A step where an LLM agent intelligently uses a specific tool to complete a task.

Unlike InvokeToolStep which requires you to specify exact tool arguments, this step
allows an LLM agent to determine how to use the tool based on the task description
and available context. The agent will call the tool at most once during execution.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="Single Tool Agent Step - Run")
async def run(run_data: RunContext) -> Any
```

Run the agent and return its output.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this SingleToolAgentStep to a Step.

