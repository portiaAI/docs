---
sidebar_label: conditional_evaluation_agent
title: portia.execution_agents.conditional_evaluation_agent
---

Conditional evaluation agent for PlanV2.

## BooleanResponse Objects

```python
class BooleanResponse(BaseModel)
```

Boolean response for conditional evaluation.

## ConditionalEvaluationAgent Objects

```python
class ConditionalEvaluationAgent()
```

Conditional evaluation agent for PlanV2.

#### \_\_init\_\_

```python
def __init__(config: Config) -> None
```

Initialize the conditional evaluation agent.

#### execute

```python
@traceable(name="Conditional Evaluation Agent - Execute")
async def execute(conditional: str, arguments: dict[str, Any]) -> bool
```

Execute the conditional evaluation agent.

