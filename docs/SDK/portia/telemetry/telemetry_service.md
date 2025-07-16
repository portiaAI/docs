---
Sidebar_Label: telemetry_service
Title: portia.telemetry.telemetry_service
---

Telemetry service for capturing anonymized usage data.

#### xdg\_cache\_home

```python
def xdg_cache_home() -> Path
```

Get the XDG cache home directory path.

**Returns**:

- `Path` - The path to the cache directory, either from XDG_CACHE_HOME environment variable
  or the default ~/.portia location.

#### get\_project\_id\_key

```python
def get_project_id_key() -> str
```

Get the project ID key.

**Returns**:

- `str` - The project ID key

## BaseProductTelemetry Objects

```python
class BaseProductTelemetry(ABC)
```

Base interface for capturing anonymized telemetry data.

This class handles the collection and transmission of anonymized usage data to PostHog.
Telemetry can be disabled by setting the environment variable `ANONYMIZED_TELEMETRY=False`.

#### Capture

```python
@abstractmethod
def capture(event: BaseTelemetryEvent) -> None
```

Capture and send a telemetry event.

**Arguments**:

- `event` _BaseTelemetryEvent_ - The telemetry event to capture

## ProductTelemetry Objects

```python
@singleton
class ProductTelemetry(BaseProductTelemetry)
```

Service for capturing anonymized telemetry data.

This class handles the collection and transmission of anonymized usage data to PostHog.
Telemetry can be disabled by setting the environment variable `ANONYMIZED_TELEMETRY=False`.

**Attributes**:

- `USER_ID_PATH` _str_ - Path where the user ID is stored
- `PROJECT_API_KEY` _str_ - PostHog project API key
- `HOST` _str_ - PostHog server host URL
- `UNKNOWN_USER_ID` _str_ - Default user ID when user identification fails

#### \_\_init\_\_

```python
def __init__() -> None
```

Initialize the telemetry service.

Sets up the PostHog client if telemetry is enabled and configures logging.

#### Capture

```python
def capture(event: BaseTelemetryEvent) -> None
```

Capture and send a telemetry event.

**Arguments**:

- `event` _BaseTelemetryEvent_ - The telemetry event to capture

#### user\_id

```python
@property
def user_id() -> str
```

Get the current user ID, generating a new one if it doesn&#x27;t exist.

**Returns**:

- `str` - The user ID, either from cache or newly generated

