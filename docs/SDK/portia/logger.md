---
sidebar_label: logger
title: portia.logger
---

Logging functions for managing and configuring loggers.

This module defines functions and classes to manage logging within the application. It provides a
`LoggerManager` class that manages the package-level logger and allows customization.
The `LoggerInterface` defines the general interface for loggers, and the default logger is provided
by `loguru`. The `logger` function returns the active logger, and the `LoggerManager` can be used
to configure logging behavior.

Classes in this file include:

- `LoggerInterface`: A protocol defining the common logging methods (`debug`, `info`, `warning`,
`error`, `LoggerInterface`0).
- `LoggerManager`: A class for managing the logger, allowing customization and configuration from
the application&#x27;s settings.

This module ensures flexible and configurable logging, supporting both default and custom loggers.

## LoggerInterface Objects

```python
class LoggerInterface(Protocol)
```

General Interface for loggers.

This interface defines the common methods that any logger should implement. The methods are:

- `debug`: For logging debug-level messages.
- `info`: For logging informational messages.
- `warning`: For logging warning messages.
- `error`: For logging error messages.
- `critical`: For logging critical error messages.

These methods are used throughout the application for logging messages at various levels.

## Formatter Objects

```python
class Formatter()
```

A class used to format log records.

Attributes
----------
max_lines : int
    The maximum number of lines to include in the formatted log message.

Methods
-------
format(record)
    Formats a log record into a string.

#### \_\_init\_\_

```python
def __init__() -> None
```

Initialize the logger with default settings.

**Attributes**:

- `max_lines` _int_ - The maximum number of lines the logger can handle, default is 30.

#### format

```python
def format(record: Any) -> str
```

Format a log record into a string with specific formatting.

**Arguments**:

- `record` _dict_ - A dictionary containing log record information.
  Expected keys are &quot;message&quot;, &quot;extra&quot;, &quot;time&quot;, &quot;level&quot;, &quot;name&quot;,
  &quot;function&quot;, and &quot;line&quot;.
  

**Returns**:

- `str` - The formatted log record string.

#### \_sanitize\_message\_

```python
def _sanitize_message_(msg: str, truncate: bool = True) -> str
```

Sanitize a message to be used in a log record.

#### \_get\_function\_color\_

```python
def _get_function_color_(record: Any) -> str
```

Get color based on function/module name. Default is white.

## SafeLogger Objects

```python
class SafeLogger(LoggerInterface)
```

A logger that catches exceptions and logs them to the child logger.

#### \_\_init\_\_

```python
def __init__(child_logger: LoggerInterface) -> None
```

Initialize the SafeLogger.

#### debug

```python
def debug(msg: str, *args: Any, **kwargs: Any) -> None
```

Wrap the child logger&#x27;s debug method to catch exceptions.

#### info

```python
def info(msg: str, *args: Any, **kwargs: Any) -> None
```

Wrap the child logger&#x27;s info method to catch exceptions.

#### warning

```python
def warning(msg: str, *args: Any, **kwargs: Any) -> None
```

Wrap the child logger&#x27;s warning method to catch exceptions.

#### error

```python
def error(msg: str, *args: Any, **kwargs: Any) -> None
```

Wrap the child logger&#x27;s error method to catch exceptions.

#### exception

```python
def exception(msg: str, *args: Any, **kwargs: Any) -> None
```

Wrap the child logger&#x27;s exception method to catch exceptions.

#### critical

```python
def critical(msg: str, *args: Any, **kwargs: Any) -> None
```

Wrap the child logger&#x27;s critical method to catch exceptions.

## LoggerManager Objects

```python
class LoggerManager()
```

Manages the package-level logger.

The `LoggerManager` is responsible for initializing and managing the logger used throughout
the application. It provides functionality to configure the logger, set a custom logger,
and adjust logging settings based on the application&#x27;s configuration.

**Arguments**:

- `custom_logger` _LoggerInterface | None_ - A custom logger to be used. If not provided,
  the default `loguru` logger will be used.
  

**Attributes**:

- `logger` _LoggerInterface_ - The current active logger.
- `custom_logger` _bool_ - A flag indicating whether a custom logger is in use.
  

**Methods**:

- `logger` - Returns the active logger.
- `set_logger` - Sets a custom logger.
- `configure_from_config` - Configures the logger based on the provided configuration.

#### \_\_init\_\_

```python
def __init__(custom_logger: LoggerInterface | None = None) -> None
```

Initialize the LoggerManager.

**Arguments**:

- `custom_logger` _LoggerInterface | None_ - A custom logger to use. Defaults to None.

#### logger

```python
@property
def logger() -> LoggerInterface
```

Get the current logger.

**Returns**:

- `LoggerInterface` - The active logger being used.

#### set\_logger

```python
def set_logger(custom_logger: LoggerInterface) -> None
```

Set a custom logger.

**Arguments**:

- `custom_logger` _LoggerInterface_ - The custom logger to be used.

#### configure\_from\_config

```python
def configure_from_config(config: Config) -> None
```

Configure the global logger based on the library&#x27;s configuration.

This method configures the logger&#x27;s log level and output sink based on the application&#x27;s
settings. If a custom logger is in use, it will skip the configuration and log a warning.

**Arguments**:

- `config` _Config_ - The configuration object containing the logging settings.

#### logger

```python
def logger() -> LoggerInterface
```

Return the active logger.

**Returns**:

- `LoggerInterface` - The current active logger being used.

