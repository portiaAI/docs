---
sidebar_label: final_output_summarizer
title: portia.execution_agents.utils.final_output_summarizer
---

Utility class for final output summarizer.

## FinalOutputSummarizer Objects

```python
class FinalOutputSummarizer()
```

Utility class responsible for summarizing the run outputs for final output&#x27;s summary.

**Attributes**:

- `config` _Config_ - The configuration for the llm.
- `agent_memory` _AgentMemory_ - The agent memory to use for the summarizer.

#### \_\_init\_\_

```python
def __init__(config: Config, agent_memory: AgentMemory) -> None
```

Initialize the summarizer agent.

**Arguments**:

- `config` _Config_ - The configuration for the llm.
- `agent_memory` _AgentMemory_ - The agent memory to use for the summarizer.

#### get\_output\_value

```python
def get_output_value(output: Output) -> str | None
```

Get the value to use for the specified output.

This ensures that introspection outputs and outputs that are too large for the LLM context
window are handled correctly.

#### create\_summary

```python
def create_summary(plan: Plan, plan_run: PlanRun) -> str | BaseModel | None
```

Execute the summarizer llm and return the summary as a string.

**Arguments**:

- `plan` _Plan_ - The plan containing the steps.
- `plan_run` _PlanRun_ - The run to summarize.
  

**Returns**:

  str | BaseModel | None: The generated summary or None if generation fails.

