---
sidebar_label: tool_wrapper
title: portia.tool_wrapper
---

Tool Wrapper that intercepts run calls and records them.

This module contains the `ToolCallWrapper` class, which wraps around an existing tool and records
information about the tool&#x27;s execution, such as input, output, latency, and status. The recorded
data is stored in `AdditionalStorage` for later use.

Classes:
    ToolCallWrapper: A wrapper that intercepts tool calls, records execution data, and stores it.

## ToolCallWrapper Objects

```python
class ToolCallWrapper(Tool)
```

Tool Wrapper that records calls to its child tool and sends them to the AdditionalStorage.

This class is a wrapper around a child tool. It captures the input and output, measures latency,
and records the status of the execution. The results are then stored in the provided
`AdditionalStorage`.

Attributes
----------
    model_config (ConfigDict): Pydantic configuration that allows arbitrary types.
    _child_tool (Tool): The child tool to be wrapped and executed.
    _storage (AdditionalStorage): Storage mechanism to save tool call records.
    _workflow (Workflow): The workflow context for the current execution.

#### ready

```python
def ready(ctx: ToolRunContext) -> bool
```

Check if the child tool is ready.

Args:
    ctx (ToolRunContext): Context of the tool run

Returns:
    bool: Whether the tool is ready to run

#### run

```python
def run(ctx: ToolRunContext, *args: Any, **kwargs: Any) -> Any | Clarification
```

Run the child tool and store the outcome.

This method executes the child tool with the provided arguments, records the input,
output, latency, and status of the execution, and stores the details in `AdditionalStorage`.

Args:
    ctx (ToolRunContext): The context containing user data and metadata.
    *args (Any): Positional arguments for the child tool.
    **kwargs (Any): Keyword arguments for the child tool.

Returns:
    Any | Clarification: The output of the child tool or a clarification request.

Raises:
    Exception: If an error occurs during execution, the exception is logged, and the
        status is set to `FAILED`.

