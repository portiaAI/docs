---
sidebar_label: base_agent
title: portia.agents.base_agent
---

Agents for doing things.

## AgentType Objects

```python
class AgentType(Enum)
```

Type of agent to use for executing a step.

## RequestClarificationInput Objects

```python
class RequestClarificationInput(BaseModel)
```

Input arguments for RequestClarification Tool.

## RequestClarificationTool Objects

```python
class RequestClarificationTool(BaseTool)
```

RequestClarification Tool.

## BaseAgent Objects

```python
class BaseAgent()
```

Base agent that can be implemented by different mechanisms.

#### execute\_sync

```python
@abstractmethod
def execute_sync(llm: BaseChatModel, step_outputs: dict[str, Output]) -> Any
```

Run the core execution logic of the task.

