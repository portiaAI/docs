---
sidebar_label: search_tool
title: portia.open_source_tools.search_tool
---

Simple Search Tool.

## SearchToolSchema Objects

```python
class SearchToolSchema(BaseModel)
```

Input for SearchTool.

## SearchTool Objects

```python
class SearchTool(Tool)
```

Searches the internet to find answers to the search query provided..

#### run

```python
def run(_: ToolRunContext, search_query: str) -> str
```

Run the Search Tool.

