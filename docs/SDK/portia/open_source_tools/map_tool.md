---
sidebar_label: map_tool
title: portia.open_source_tools.map_tool
---

Tool to map websites.

## MapToolSchema Objects

```python
class MapToolSchema(BaseModel)
```

Input for MapTool.

## MapTool Objects

```python
class MapTool(Tool[str])
```

Maps websites using Tavily&#x27;s graph-based traversal to generate comprehensive site maps.

#### run

```python
def run(_: ToolRunContext,
        url: str,
        max_depth: int = 1,
        max_breadth: int = 20,
        limit: int = 50,
        instructions: str | None = None,
        **kwargs: Any) -> str
```

Run the map tool.

