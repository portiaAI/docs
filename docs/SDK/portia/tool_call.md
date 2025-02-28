---
sidebar_label: tool_call
title: portia.tool_call
---

Tool Call module contains classes that record the outcome of a single tool call.

The `ToolCallStatus` enum defines the various states a tool call can be in, such
as in progress, successful, requiring clarification, or failing.

The `ToolCallRecord` class is a Pydantic model used to capture details about a
specific tool call, including its status, input, output, and associated metadata.

## ToolCallStatus Objects

```python
class ToolCallStatus(PortiaEnum)
```

The status of the tool call.

**Attributes**:

- `IN_PROGRESS` - The tool is currently in progress.
- `NEED_CLARIFICATION` - The tool raise a clarification.
- `SUCCESS` - The tool executed successfully.
- `FAILED` - The tool raised an error.

## ToolCallRecord Objects

```python
class ToolCallRecord(BaseModel)
```

Model that records the details of an individual tool call.

This class captures all relevant information about a single tool call
within a workflow, including metadata, input and output data, and status.

**Attributes**:

- `tool_name` _str_ - The name of the tool being called.
- `workflow_id` _WorkflowUUID_ - The unique identifier of the workflow to which this tool call
  belongs.
- `step` _int_ - The step number of the tool call in the plan_run.
- `end_user_id` _str | None_ - The ID of the end user, if applicable. Can be None.
- `additional_data` _dict[str, str]_ - Additional data from the execution context.
- `status` _ToolCallStatus_ - The current status of the tool call (e.g., IN_PROGRESS, SUCCESS).
- `input` _Any_ - The input data passed to the tool call.
- `output` _Any_ - The output data returned from the tool call.
- `latency_seconds` _float_ - The latency in seconds for the tool call to complete.

