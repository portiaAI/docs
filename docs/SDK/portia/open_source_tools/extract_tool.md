---
sidebar_label: extract_tool
title: portia.open_source_tools.extract_tool
---

Tool to extract web page content from one or more URLs.

## ExtractToolSchema Objects

```python
class ExtractToolSchema(BaseModel)
```

Input for ExtractTool.

## ExtractTool Objects

```python
class ExtractTool(Tool[str])
```

Extracts the web page content from one or more URLs provided.

#### run

```python
def run(_: ToolRunContext,
        urls: list[str],
        include_images: bool = True,
        include_favicon: bool = True,
        extract_depth: str = "basic",
        format: str = "markdown") -> str
```

Run the extract tool.

