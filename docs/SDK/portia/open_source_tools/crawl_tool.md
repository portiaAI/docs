---
sidebar_label: crawl_tool
title: portia.open_source_tools.crawl_tool
---

Tool to crawl websites.

## CrawlToolSchema Objects

```python
class CrawlToolSchema(BaseModel)
```

Input for CrawlTool.

## CrawlTool Objects

```python
class CrawlTool(Tool[str])
```

Crawls websites using graph-based traversal tool.

#### run

```python
def run(_: ToolRunContext,
        url: str,
        instructions: str | None = None,
        max_depth: int = DEFAULT_MAX_DEPTH,
        max_breadth: int = DEFAULT_MAX_BREADTH,
        limit: int = DEFAULT_LIMIT,
        select_paths: list[str] | None = None,
        select_domains: list[str] | None = None,
        exclude_paths: list[str] | None = None,
        exclude_domains: list[str] | None = None,
        allow_external: bool = False) -> str
```

Run the crawl tool.

