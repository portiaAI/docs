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

