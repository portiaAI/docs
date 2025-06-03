---
sidebar_label: clarification_tool
title: portia.execution_agents.clarification_tool
---

Tool for raising clarifications if unsure on an arg.

## ClarificationToolSchema Objects

```python
class ClarificationToolSchema(BaseModel)
```

Schema defining the inputs for the ClarificationTool.

## ClarificationTool Objects

```python
class ClarificationTool(Tool)
```

Raises a clarification if the agent is unsure of an argument.

#### run

```python
def run(ctx: ToolRunContext, argument_name: str) -> str
```

Run the ClarificationTool.

