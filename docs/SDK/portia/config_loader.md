---
sidebar_label: config_loader
title: portia.config_loader
---

Configuration loader for TOML-based profile system.

This module provides functionality to load configuration from TOML files,
handle profile selection, and merge settings with proper precedence:
1. Direct code overrides (highest)
2. Config file values
3. Environment variables (lowest)

## ConfigLoader Objects

```python
class ConfigLoader()
```

Handles loading and merging of TOML configuration files with profiles.

#### \_\_init\_\_

```python
def __init__(config_file: Path | None = None) -> None
```

Initialize the config loader.

**Arguments**:

- `config_file` - Optional path to config file. Defaults to ~/.portia/config.toml

#### load\_config\_from\_toml

```python
def load_config_from_toml(profile: str = "default") -> dict[str, Any]
```

Load configuration from TOML file for the specified profile.

**Arguments**:

- `profile` - Profile name to load (e.g., &quot;default&quot;, &quot;openai&quot;, &quot;gemini&quot;)
  

**Returns**:

  Dictionary containing the profile configuration
  

**Raises**:

- `ConfigNotFoundError` - If config file or profile doesn&#x27;t exist
- `InvalidConfigError` - If TOML file is malformed

#### merge\_with\_env

```python
def merge_with_env(config: dict[str, Any]) -> dict[str, Any]
```

Fill missing values in config with environment variables.

**Arguments**:

- `config` - Configuration dictionary from TOML file
  

**Returns**:

  Configuration dictionary with environment variables merged in

#### apply\_overrides

```python
def apply_overrides(config: dict[str, Any],
                    overrides: dict[str, Any]) -> dict[str, Any]
```

Apply code-based overrides to the configuration.

**Arguments**:

- `config` - Base configuration dictionary
- `overrides` - Override values from code
  

**Returns**:

  Configuration with overrides applied

#### get\_config

```python
def get_config(profile: str = "default", **overrides: Any) -> dict[str, Any]
```

Load complete configuration with proper precedence.

Precedence order (highest to lowest):
1. Direct code overrides (**overrides)
2. Config file values
3. Environment variables

**Arguments**:

- `profile` - Profile name to load
- `**overrides` - Direct overrides from code
  

**Returns**:

  Final merged configuration dictionary

#### list\_profiles

```python
def list_profiles() -> list[str]
```

List all available profiles in the config file.

**Returns**:

  List of profile names

#### get\_default\_profile

```python
def get_default_profile() -> str
```

Get the default profile name.

**Returns**:

  Default profile name, with fallback to &quot;default&quot;

#### load\_config\_from\_toml

```python
def load_config_from_toml(profile: str = "default",
                          config_file: Path | None = None) -> dict[str, Any]
```

Load configuration from TOML file for the specified profile.

**Arguments**:

- `profile` - Profile name to load
- `config_file` - Optional path to config file
  

**Returns**:

  Profile configuration dictionary

#### merge\_with\_env

```python
def merge_with_env(config: dict[str, Any]) -> dict[str, Any]
```

Fill missing values in config with environment variables.

**Arguments**:

- `config` - Configuration dictionary
  

**Returns**:

  Configuration with environment variables merged

#### apply\_overrides

```python
def apply_overrides(config: dict[str, Any],
                    overrides: dict[str, Any]) -> dict[str, Any]
```

Apply code-based overrides to configuration.

**Arguments**:

- `config` - Base configuration
- `overrides` - Override values
  

**Returns**:

  Configuration with overrides applied

#### get\_config

```python
def get_config(profile: str = "default",
               config_file: Path | None = None,
               **overrides: Any) -> dict[str, Any]
```

Load complete configuration with proper precedence.

**Arguments**:

- `profile` - Profile name to load
- `config_file` - Optional path to config file
- `**overrides` - Direct overrides from code
  

**Returns**:

  Final merged configuration dictionary

#### ensure\_config\_directory

```python
def ensure_config_directory() -> Path
```

Ensure the config directory exists and return its path.

**Returns**:

  Path to the config directory

#### get\_config\_file\_path

```python
def get_config_file_path() -> Path
```

Get the path to the config file.

**Returns**:

  Path to the config file

