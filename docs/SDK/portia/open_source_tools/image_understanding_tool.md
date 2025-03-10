---
sidebar_label: image_understanding_tool
title: portia.open_source_tools.image_understanding_tool
---

Tool for responding to prompts and completing tasks that are related to image understanding.

## ImageUnderstandingToolSchema Objects

```python
class ImageUnderstandingToolSchema(BaseModel)
```

Input for Image Understanding Tool.

## ImageUnderstandingTool Objects

```python
class ImageUnderstandingTool(Tool[str])
```

General purpose image understanding tool. Customizable to user requirements.

#### run

```python
def run(ctx: ToolRunContext, **kwargs: Any) -> str
```

Run the ImageTool.

