---
Sidebar_Label: search_tool
Title: portia.open_source_tools.search_tool
---

Simple Search Tool.

## SearchToolSchema Objects

```python
class SearchToolSchema(BaseModel)
```

Input for SearchTool.

## SearchTool Objects

```python
class SearchTool(Tool[str])
```

Searches the internet to find answers to the search query provided..

#### Run

```python
def run(_: ToolRunContext, search_query: str) -> str
```

Run the Search Tool.

