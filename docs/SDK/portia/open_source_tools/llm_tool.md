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
class LLMTool(Tool[str])
```

General purpose LLM tool. Customizable to user requirements. Won&#x27;t call other tools.

#### run

```python
def run(ctx: ToolRunContext, task: str, input_data: Sequence[str] = ()) -> str
```

Run the LLMTool.

