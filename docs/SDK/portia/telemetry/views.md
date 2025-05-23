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

