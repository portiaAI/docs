---
sidebar_label: browser_tool
title: portia._unstable.browser_tool
---

Browser tools.

This module contains tools that can be used to navigate to a URL, authenticate the user,
and complete tasks.

## BrowserToolSchema Objects

```python
class BrowserToolSchema(BaseModel)
```

Input for the BrowserTool.

## BrowserAuthOutput Objects

```python
class BrowserAuthOutput(BaseModel)
```

Output of the Browser tool&#x27;s authentication check.

## BrowserTaskOutput Objects

```python
class BrowserTaskOutput(BaseModel)
```

Output of the Browser tool&#x27;s task.

## BrowserTool Objects

```python
class BrowserTool(Tool[str])
```

General purpose browser tool. Customizable to user requirements.

#### run

```python
def run(ctx: ToolRunContext, url: str, task: str) -> str | ActionClarification
```

Run the BrowserTool.

