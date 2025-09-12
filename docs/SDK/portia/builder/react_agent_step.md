---
sidebar_label: react_agent_step
title: portia.builder.react_agent_step
---

Implementation of the ReAct agent step.

## ReActAgentStep Objects

```python
class ReActAgentStep(StepV2)
```

A step where an LLM agent uses ReAct reasoning to complete a task with multiple tools.

Unlike SingleToolAgentStep which is limited to one specific tool and one tool call, this step
allows an LLM agent to reason about which tools to use and when to use them. The agent
follows the ReAct (Reasoning and Acting) pattern, iteratively thinking about the
problem and taking actions until the task is complete.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="ReAct Agent Step - Run")
async def run(run_data: RunContext) -> Any
```

Run the agent step.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this SingleToolAgentStep to a Step.

