---
sidebar_label: errors
title: portia.errors
---

Central definition of error classes.

This module defines custom exception classes used throughout the application. These exceptions
help identify specific error conditions, particularly related to configuration, planning, runs,
tools, and storage. They provide more context and clarity than generic exceptions.

Classes in this file include:

- `ConfigNotFoundError`: Raised when a required configuration value is not found.
- `InvalidConfigError`: Raised when a configuration value is invalid.
- `PlanError`: A base class for exceptions in the query planning_agent module.
- `PlanNotFoundError`: Raised when a plan is not found.
- `PlanRunNotFoundError`: Raised when a PlanRun is not found.
- `ToolNotFoundError`: Raised when a tool is not found.
- `DuplicateToolError`: Raised when a tool is registered with the same name.
- `InvalidToolDescriptionError`: Raised when a tool description is invalid.
- `ToolRetryError`: Raised when a tool fails after retries.
- `ToolFailedError`: Raised when a tool fails with a hard error.
- `InvalidConfigError`0: Raised when a run is in an invalid state.
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

**Arguments**:

- `value` _str_ - The name of the configuration value that is missing.

#### \_\_init\_\_

```python
def __init__(value: str) -> None
```

Set custom error message.

## InvalidConfigError Objects

```python
class InvalidConfigError(PortiaBaseError)
```

Raised when a configuration value is invalid.

**Arguments**:

- `value` _str_ - The name of the invalid configuration value.
- `issue` _str_ - A description of the issue with the configuration value.

#### \_\_init\_\_

```python
def __init__(value: str, issue: str) -> None
```

Set custom error message.

## PlanError Objects

```python
class PlanError(PortiaBaseError)
```

Base class for exceptions in the query planning_agent module.

This exception indicates an error that occurred during the planning phase.

**Arguments**:

- `error_string` _str_ - A description of the error encountered during planning.

#### \_\_init\_\_

```python
def __init__(error_string: str) -> None
```

Set custom error message.

## PlanNotFoundError Objects

```python
class PlanNotFoundError(PortiaBaseError)
```

Raised when a plan with a specific ID is not found.

**Arguments**:

- `plan_id` _PlanUUID_ - The ID of the plan that was not found.

#### \_\_init\_\_

```python
def __init__(plan_id: PlanUUID) -> None
```

Set custom error message.

## PlanRunNotFoundError Objects

```python
class PlanRunNotFoundError(PortiaBaseError)
```

Raised when a PlanRun with a specific ID is not found.

**Arguments**:

- `plan_run_id` _UUID | str | None_ - The ID or name of the PlanRun that was not found.

#### \_\_init\_\_

```python
def __init__(plan_run_id: PlanRunUUID | str | None) -> None
```

Set custom error message.

## ToolNotFoundError Objects

```python
class ToolNotFoundError(PortiaBaseError)
```

Raised when a tool with a specific ID is not found.

**Arguments**:

- `tool_id` _str_ - The ID of the tool that was not found.

#### \_\_init\_\_

```python
def __init__(tool_id: str) -> None
```

Set custom error message.

## DuplicateToolError Objects

```python
class DuplicateToolError(PortiaBaseError)
```

Raised when a tool is registered with the same name.

**Arguments**:

- `tool_id` _str_ - The ID of the tool that already exists.

#### \_\_init\_\_

```python
def __init__(tool_id: str) -> None
```

Set custom error message.

## InvalidToolDescriptionError Objects

```python
class InvalidToolDescriptionError(PortiaBaseError)
```

Raised when a tool description is invalid.

**Arguments**:

- `tool_id` _str_ - The ID of the tool with an invalid description.

#### \_\_init\_\_

```python
def __init__(tool_id: str) -> None
```

Set custom error message.

## ToolRetryError Objects

```python
class ToolRetryError(PortiaBaseError)
```

Raised when a tool fails after retrying.

**Arguments**:

- `tool_id` _str_ - The ID of the tool that failed.
- `error_string` _str_ - A description of the error that occurred.

#### \_\_init\_\_

```python
def __init__(tool_id: str, error_string: str) -> None
```

Set custom error message.

## ToolFailedError Objects

```python
class ToolFailedError(PortiaBaseError)
```

Raised when a tool fails with a hard error.

**Arguments**:

- `tool_id` _str_ - The ID of the tool that failed.
- `error_string` _str_ - A description of the error that occurred.

#### \_\_init\_\_

```python
def __init__(tool_id: str, error_string: str) -> None
```

Set custom error message.

## InvalidRunStateError Objects

```python
class InvalidRunStateError(PortiaBaseError)
```

Raised when a run is in an invalid state.

## InvalidAgentError Objects

```python
class InvalidAgentError(PortiaBaseError)
```

Raised when an agent is in an invalid state.

#### \_\_init\_\_

```python
def __init__(state: str) -> None
```

Set custom error message.

## InvalidAgentOutputError Objects

```python
class InvalidAgentOutputError(PortiaBaseError)
```

Raised when the agent produces invalid output.

**Arguments**:

- `content` _str_ - The invalid content returned by the agent.

#### \_\_init\_\_

```python
def __init__(content: str) -> None
```

Set custom error message.

## ToolHardError Objects

```python
class ToolHardError(PortiaBaseError)
```

Raised when a tool encounters an error it cannot retry.

**Arguments**:

- `cause` _Exception | str_ - The underlying exception or error message.

#### \_\_init\_\_

```python
def __init__(cause: Exception | str) -> None
```

Set custom error message.

## ToolSoftError Objects

```python
class ToolSoftError(PortiaBaseError)
```

Raised when a tool encounters an error that can be retried.

**Arguments**:

- `cause` _Exception | str_ - The underlying exception or error message.

#### \_\_init\_\_

```python
def __init__(cause: Exception | str) -> None
```

Set custom error message.

## StorageError Objects

```python
class StorageError(PortiaBaseError)
```

Raised when there&#x27;s an issue with storage.

**Arguments**:

- `cause` _Exception | str_ - The underlying exception or error message.

#### \_\_init\_\_

```python
def __init__(cause: Exception | str) -> None
```

Set custom error message.

