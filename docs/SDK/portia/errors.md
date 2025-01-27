---
sidebar_label: errors
title: portia.errors
---

Central definition of error classes.

This module defines custom exception classes used throughout the application. These exceptions
help identify specific error conditions, particularly related to configuration, planning, workflows,
tools, and storage. They provide more context and clarity than generic exceptions.

Classes in this file include:

- `ConfigNotFoundError`: Raised when a required configuration value is not found.
- `InvalidConfigError`: Raised when a configuration value is invalid.
- `PlanError`: A base class for exceptions in the query planner module.
- `PlanNotFoundError`: Raised when a plan is not found.
- `WorkflowNotFoundError`: Raised when a workflow is not found.
- `ToolNotFoundError`: Raised when a tool is not found.
- `DuplicateToolError`: Raised when a tool is registered with the same name.
- `InvalidToolDescriptionError`: Raised when a tool description is invalid.
- `ToolRetryError`: Raised when a tool fails after retries.
- `ToolFailedError`: Raised when a tool fails with a hard error.
- `InvalidConfigError`0: Raised when a workflow is in an invalid state.
- `InvalidConfigError`1: Raised when the agent produces invalid output.
- `InvalidConfigError`2: Raised when a tool encounters an unrecoverable error.
- `InvalidConfigError`3: Raised when a tool encounters an error that can be retried.
- `InvalidConfigError`4: Raised when an issue occurs with storage.

## PortiaBaseError Objects

```python
class PortiaBaseError(Exception)
```

Base class for all our errors.

## ConfigNotFoundError Objects

```python
class ConfigNotFoundError(PortiaBaseError)
```

Raised when a required configuration value is not found.

Args:
    value (str): The name of the configuration value that is missing.

## InvalidConfigError Objects

```python
class InvalidConfigError(PortiaBaseError)
```

Raised when a configuration value is invalid.

Args:
    value (str): The name of the invalid configuration value.
    issue (str): A description of the issue with the configuration value.

## PlanError Objects

```python
class PlanError(PortiaBaseError)
```

Base class for exceptions in the query planner module.

This exception indicates an error that occurred during the planning phase.

Args:
    error_string (str): A description of the error encountered during planning.

## PlanNotFoundError Objects

```python
class PlanNotFoundError(PortiaBaseError)
```

Raised when a plan with a specific ID is not found.

Args:
    plan_id (UUID): The ID of the plan that was not found.

## WorkflowNotFoundError Objects

```python
class WorkflowNotFoundError(PortiaBaseError)
```

Raised when a workflow with a specific ID is not found.

Args:
    workflow_id (UUID | str | None): The ID or name of the workflow that was not found.

## ToolNotFoundError Objects

```python
class ToolNotFoundError(PortiaBaseError)
```

Raised when a tool with a specific ID is not found.

Args:
    tool_id (str): The ID of the tool that was not found.

## DuplicateToolError Objects

```python
class DuplicateToolError(PortiaBaseError)
```

Raised when a tool is registered with the same name.

Args:
    tool_id (str): The ID of the tool that already exists.

## InvalidToolDescriptionError Objects

```python
class InvalidToolDescriptionError(PortiaBaseError)
```

Raised when a tool description is invalid.

Args:
    tool_id (str): The ID of the tool with an invalid description.

## ToolRetryError Objects

```python
class ToolRetryError(PortiaBaseError)
```

Raised when a tool fails after retrying.

Args:
    tool_id (str): The ID of the tool that failed.
    error_string (str): A description of the error that occurred.

## ToolFailedError Objects

```python
class ToolFailedError(PortiaBaseError)
```

Raised when a tool fails with a hard error.

Args:
    tool_id (str): The ID of the tool that failed.
    error_string (str): A description of the error that occurred.

## InvalidWorkflowStateError Objects

```python
class InvalidWorkflowStateError(PortiaBaseError)
```

Raised when a workflow is in an invalid state.

## InvalidAgentOutputError Objects

```python
class InvalidAgentOutputError(PortiaBaseError)
```

Raised when the agent produces invalid output.

Args:
    content (str): The invalid content returned by the agent.

## ToolHardError Objects

```python
class ToolHardError(PortiaBaseError)
```

Raised when a tool encounters an error it cannot retry.

Args:
    cause (Exception | str): The underlying exception or error message.

## ToolSoftError Objects

```python
class ToolSoftError(PortiaBaseError)
```

Raised when a tool encounters an error that can be retried.

Args:
    cause (Exception | str): The underlying exception or error message.

## StorageError Objects

```python
class StorageError(PortiaBaseError)
```

Raised when there&#x27;s an issue with storage.

Args:
    cause (Exception | str): The underlying exception or error message.

