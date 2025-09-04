---
sidebar_label: react_clarification_tool
title: portia.execution_agents.react_clarification_tool
---

Tool for raising clarifications if unsure on an arg.

## ReActClarificationToolSchema Objects

```python
class ReActClarificationToolSchema(BaseModel)
```

Schema defining the inputs for the ClarificationTool.

## ReActClarificationTool Objects

```python
class ReActClarificationTool(Tool[InputClarification])
```

Raises a clarification if the agent does not have enough information to proceed.

#### run

```python
def run(ctx: ToolRunContext, guidance: str) -> InputClarification
```

Run the ReActClarificationTool.

