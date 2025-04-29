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

**Attributes**:

- `model_config` _ConfigDict_ - Pydantic configuration that allows arbitrary types.
- `_child_tool` _Tool_ - The child tool to be wrapped and executed.
- `_storage` _AdditionalStorage_ - Storage mechanism to save tool call records.
- `_plan_run` _PlanRun_ - The run context for the current execution.

#### \_\_init\_\_

```python
def __init__(child_tool: Tool, storage: AdditionalStorage,
             plan_run: PlanRun) -> None
```

Initialize parent fields using child_tool&#x27;s attributes.

**Arguments**:

- `child_tool` _Tool_ - The child tool to be wrapped.
- `storage` _AdditionalStorage_ - The storage to save execution records.
- `plan_run` _PlanRun_ - The PlanRun to execute.

#### ready

```python
def ready(ctx: ToolRunContext) -> ReadyResponse
```

Check if the child tool is ready and return ReadyResponse.

#### run

```python
def run(ctx: ToolRunContext, *args: Any, **kwargs: Any) -> Any | Clarification
```

Run the child tool and store the outcome.

This method executes the child tool with the provided arguments, records the input,
output, latency, and status of the execution, and stores the details in `AdditionalStorage`.

**Arguments**:

- `ctx` _ToolRunContext_ - The context containing user data and metadata.
- `*args` _Any_ - Positional arguments for the child tool.
- `**kwargs` _Any_ - Keyword arguments for the child tool.
  

**Returns**:

  Any | Clarification: The output of the child tool or a clarification request.
  

**Raises**:

- `Exception` - If an error occurs during execution, the exception is logged, and the
  status is set to `FAILED`.

