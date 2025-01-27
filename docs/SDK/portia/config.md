---
sidebar_label: config
title: portia.config
---

Configuration module for the SDK.

This module defines the configuration classes and enumerations used in the SDK,
including settings for storage, API keys, LLM providers, logging, and agent options.
It also provides validation for configuration values and loading mechanisms for
config files and default settings.

## StorageClass Objects

```python
class StorageClass(Enum)
```

Enum representing locations plans and workflows are stored.

Attributes
----------
    MEMORY: Stored in memory.
    DISK: Stored on disk.
    CLOUD: Stored in the cloud.

## LLMProvider Objects

```python
class LLMProvider(Enum)
```

Enum for supported LLM providers.

Attributes:
    OPENAI: OpenAI provider.
    ANTHROPIC: Anthropic provider.
    MISTRALAI: MistralAI provider.

#### associated\_models

```python
def associated_models() -> list[LLMModel]
```

Get the associated models for the provider.

Returns:
    list[LLMModel]: List of supported models for the provider.

#### default\_model

```python
def default_model() -> LLMModel
```

Get the default model for the provider.

Returns:
    LLMModel: The default model for the provider.

## LLMModel Objects

```python
class LLMModel(Enum)
```

Enum for supported LLM models.

Models are grouped by provider, with the following providers:
- OpenAI
- Anthropic
- MistralAI

Attributes:
    GPT_4_O: GPT-4 model by OpenAI.
    GPT_4_O_MINI: Mini GPT-4 model by OpenAI.
    GPT_3_5_TURBO: GPT-3.5 Turbo model by OpenAI.
    CLAUDE_3_5_SONNET: Claude 3.5 Sonnet model by Anthropic.
    CLAUDE_3_5_HAIKU: Claude 3.5 Haiku model by Anthropic.
    CLAUDE_3_OPUS_LATEST: Claude 3.0 Opus latest model by Anthropic.
    MISTRAL_LARGE_LATEST: Mistral Large Latest model by MistralAI.

#### provider

```python
def provider() -> LLMProvider
```

Get the associated provider for the model.

Returns:
    LLMProvider: The provider associated with the model.

## AgentType Objects

```python
class AgentType(Enum)
```

Enum for types of agents used for executing a step.

Attributes:
    TOOL_LESS: A tool-less agent.
    ONE_SHOT: A one-shot agent.
    VERIFIER: A verifier agent.

## PlannerType Objects

```python
class PlannerType(Enum)
```

Enum for planners used for planning queries.

Attributes:
    ONE_SHOT: A one-shot planner.

## LogLevel Objects

```python
class LogLevel(Enum)
```

Enum for available log levels.

Attributes:
    DEBUG: Debug log level.
    INFO: Info log level.
    WARNING: Warning log level.
    ERROR: Error log level.
    CRITICAL: Critical log level.

#### is\_greater\_than\_zero

```python
def is_greater_than_zero(value: int) -> int
```

Ensure the value is greater than zero.

Args:
    value (int): The value to validate.

Raises:
    ValueError: If the value is less than or equal to zero.

Returns:
    int: The validated value.

#### parse\_str\_to\_enum

```python
def parse_str_to_enum(value: str | E, enum_type: type[E]) -> E
```

Parse a string to an enum or return the enum as is.

Args:
    value (str | E): The value to parse.
    enum_type (type[E]): The enum type to parse the value into.

Raises:
    InvalidConfigError: If the value cannot be parsed into the enum.

Returns:
    E: The corresponding enum value.

## Config Objects

```python
class Config(BaseModel)
```

General configuration for the SDK.

This class holds the configuration for the SDK, including API keys, LLM
settings, logging options, and storage settings. It also provides validation
for configuration consistency and offers methods for loading configuration
from files or default values.

Attributes:
    portia_api_endpoint: The endpoint for the Portia API.
    portia_api_key: The API key for Portia.
    openai_api_key: The API key for OpenAI.
    anthropic_api_key: The API key for Anthropic.
    mistralai_api_key: The API key for MistralAI.
    storage_class: The storage class used (e.g., MEMORY, DISK, CLOUD).
    storage_dir: The directory for storage, if applicable.
    default_log_level: The default log level (e.g., DEBUG, INFO).
    default_log_sink: The default destination for logs (e.g., sys.stdout).
    json_log_serialize: Whether to serialize logs in JSON format.
    llm_provider: The LLM provider (e.g., OpenAI, Anthropic).
    llm_model_name: The model to use for LLM tasks.
    llm_model_temperature: The temperature for LLM generation.
    llm_model_seed: The seed for LLM generation.
    default_agent_type: The default agent type.
    default_planner: The default planner type.

#### parse\_storage\_class

```python
@field_validator("storage_class", mode="before")
@classmethod
def parse_storage_class(cls, value: str | StorageClass) -> StorageClass
```

Parse storage class to enum if string provided.

#### parse\_default\_log\_level

```python
@field_validator("default_log_level", mode="before")
@classmethod
def parse_default_log_level(cls, value: str | LogLevel) -> LogLevel
```

Parse default_log_level to enum if string provided.

#### parse\_llm\_provider

```python
@field_validator("llm_provider", mode="before")
@classmethod
def parse_llm_provider(cls, value: str | LLMProvider) -> LLMProvider
```

Parse llm_provider to enum if string provided.

#### parse\_llm\_model\_name

```python
@field_validator("llm_model_name", mode="before")
@classmethod
def parse_llm_model_name(cls, value: str | LLMModel) -> LLMModel
```

Parse llm_model_name to enum if string provided.

#### parse\_default\_agent\_type

```python
@field_validator("default_agent_type", mode="before")
@classmethod
def parse_default_agent_type(cls, value: str | AgentType) -> AgentType
```

Parse default_agent_type to enum if string provided.

#### parse\_default\_planner

```python
@field_validator("default_planner", mode="before")
@classmethod
def parse_default_planner(cls, value: str | PlannerType) -> PlannerType
```

Parse default_planner to enum if string provided.

#### check\_config

```python
@model_validator(mode="after")
def check_config() -> Self
```

Validate Config is consistent.

#### from\_file

```python
@classmethod
def from_file(cls, file_path: Path) -> Config
```

Load configuration from a JSON file.

Returns:
    Config: The default config

#### from\_default

```python
@classmethod
def from_default(cls, **kwargs) -> Config
```

Create a Config instance with default values, allowing overrides.

Returns:
    Config: The default config

#### has\_api\_key

```python
def has_api_key(name: str) -> bool
```

Check if the given API Key is available.

#### must\_get\_api\_key

```python
def must_get_api_key(name: str) -> SecretStr
```

Retrieve the required API key for the configured provider.

Raises:
    ConfigNotFoundError: If no API key is found for the provider.

Returns:
    SecretStr: The required API key.

#### must\_get\_raw\_api\_key

```python
def must_get_raw_api_key(name: str) -> str
```

Retrieve the raw API key for the configured provider.

Raises:
    ConfigNotFoundError: If no API key is found for the provider.

Returns:
    str: The raw API key.

#### must\_get

```python
def must_get(name: str, expected_type: type[T]) -> T
```

Retrieve any value from the config, ensuring its of the correct type.

Args:
    name (str): The name of the config record.
    expected_type (type[T]): The expected type of the value.

Raises:
    ConfigNotFoundError: If no API key is found for the provider.
    InvalidConfigError: If the config isn&#x27;t valid

Returns:
    T: The config value

#### default\_config

```python
def default_config(**kwargs) -> Config
```

Return default config with values that can be overridden.

Returns:
    Config: The default config

