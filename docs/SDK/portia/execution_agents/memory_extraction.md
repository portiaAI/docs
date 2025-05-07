---
sidebar_label: memory_extraction
title: portia.execution_agents.memory_extraction
---

Memory extraction step for execution agents.

This module provides a step that extracts memory from previous outputs for use in execution agents.

## MemoryExtractionStep Objects

```python
class MemoryExtractionStep()
```

A step that extracts memory from the context.

#### \_\_init\_\_

```python
def __init__(agent: BaseExecutionAgent) -> None
```

Initialize the memory extraction step.

**Arguments**:

- `agent` _BaseExecutionAgent_ - The agent using the memory extraction step.

#### invoke

```python
def invoke(_: dict[str, Any]) -> dict[str, Any]
```

Invoke the model with the given message state.

**Returns**:

  dict[str, Any]: The LangGraph state update to step_inputs

