---
sidebar_label: llm_tool
title: portia.open_source_tools.llm_tool
---

Tool for responding to prompts and completing tasks that don&#x27;t require other tools.

## LLMToolSchema Objects

```python
class LLMToolSchema(BaseModel)
```

Input for LLM Tool.

## LLMTool Objects

```python
class LLMTool(Tool[str | BaseModel])
```

General purpose LLM tool. Customizable to user requirements. Won&#x27;t call other tools.

#### process\_task\_data

```python
@staticmethod
def process_task_data(task_data: list[Any] | str | None) -> str
```

Process task_data into a string, handling different input types.

**Arguments**:

- `task_data` - Data that can be a None, a string or a list of objects.
  

**Returns**:

  A string representation of the data, with list items joined by newlines.

#### run

```python
def run(ctx: ToolRunContext,
        task: str,
        task_data: list[Any] | str | None = None) -> str | BaseModel
```

Run the LLMTool.

