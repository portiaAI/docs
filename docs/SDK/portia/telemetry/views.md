---
sidebar_label: views
title: portia.telemetry.views
---

Portia telemetry views.

## BaseTelemetryEvent Objects

```python
@dataclass
class BaseTelemetryEvent(ABC)
```

Base class for all telemetry events.

This abstract class defines the interface that all telemetry events must implement.
It provides a common structure for event name and properties.

#### name

```python
@property
@abstractmethod
def name() -> str
```

Get the name of the telemetry event.

**Returns**:

- `str` - The name of the telemetry event.

#### properties

```python
@property
def properties() -> dict[str, Any]
```

Get the properties of the telemetry event.

**Returns**:

  dict[str, Any]: A dictionary containing all properties of the event,
  excluding the &#x27;name&#x27; property.

## PortiaFunctionCallTelemetryEvent Objects

```python
@dataclass
class PortiaFunctionCallTelemetryEvent(BaseTelemetryEvent)
```

Telemetry event for tracking Portia function calls.

**Attributes**:

- `function_name` - The name of the function being called.
- `function_call_details` - Additional details about the function call.

#### name

type: ignore reportIncompatibleMethodOverride

## ToolCallTelemetryEvent Objects

```python
@dataclass
class ToolCallTelemetryEvent(BaseTelemetryEvent)
```

Telemetry event for tracking tool calls.

**Attributes**:

- `tool_id` - The identifier of the tool being called, if any.

#### name

type: ignore reportIncompatibleMethodOverride

## PlanV2StepExecutionTelemetryEvent Objects

```python
@dataclass
class PlanV2StepExecutionTelemetryEvent(BaseTelemetryEvent)
```

Telemetry event for tracking PlanV2 step execution.

**Attributes**:

- `step_type` - The type of the step being executed.
- `success` - Whether the step execution was successful.
- `tool_id` - The identifier of the tool being used, if any.

#### name

type: ignore reportIncompatibleMethodOverride

## PlanV2BuildTelemetryEvent Objects

```python
@dataclass
class PlanV2BuildTelemetryEvent(BaseTelemetryEvent)
```

Telemetry event for tracking PlanV2 builds.

**Attributes**:

- `plan_length` - The number of steps in the plan.
- `step_type_counts` - A dictionary mapping step types to their counts in the plan.

#### name

type: ignore reportIncompatibleMethodOverride

## LLMToolUsageTelemetryEvent Objects

```python
@dataclass
class LLMToolUsageTelemetryEvent(BaseTelemetryEvent)
```

Telemetry event for tracking LLM tool usage.

**Attributes**:

- `model` - The model being used.
- `sync` - Whether the tool was called synchronously.

#### name

type: ignore reportIncompatibleMethodOverride

## ExecutionAgentUsageTelemetryEvent Objects

```python
@dataclass
class ExecutionAgentUsageTelemetryEvent(BaseTelemetryEvent)
```

Telemetry event for tracking execution agent usage.

**Attributes**:

- `agent_type` - The type of the execution agent (e.g., &quot;one_shot&quot;, &quot;default&quot;).
- `model` - The model being used.
- `sync` - Whether the agent was called synchronously.
- `tool_id` - The identifier of the tool being used, if any.

#### name

type: ignore reportIncompatibleMethodOverride

