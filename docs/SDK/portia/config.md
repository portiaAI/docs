---
sidebar_label: config
title: portia.config
---

Configuration module for the SDK.

This module defines the configuration classes and enumerations used in the SDK,
including settings for storage, API keys, LLM providers, logging, and agent options.
It also provides validation for configuration values and loading mechanisms for
default settings.

## StorageClass Objects

```python
class StorageClass(Enum)
```

Enum representing locations plans and runs are stored.

**Attributes**:

- `MEMORY` - Stored in memory.
- `DISK` - Stored on disk.
- `CLOUD` - Stored in the cloud.

## LLMProvider Objects

```python
class LLMProvider(Enum)
```

Enum for supported LLM providers.

**Attributes**:

- `OPENAI` - OpenAI provider.
- `ANTHROPIC` - Anthropic provider.
- `MISTRALAI` - MistralAI provider.
- `GOOGLE_GENERATIVE_AI` - Google Generative AI provider.
- `AZURE_OPENAI` - Azure OpenAI provider.

#### to\_api\_key\_name

```python
def to_api_key_name() -> str
```

Get the name of the API key for the provider.

## Model Objects

```python
class Model(NamedTuple)
```

Provider and model name tuple.

**Attributes**:

- `provider` - The provider of the model.
- `model_name` - The name of the model in the provider&#x27;s API.

## LLMModel Objects

```python
class LLMModel(Enum)
```

Enum for supported LLM models.

Models are grouped by provider, with the following providers:
- OpenAI
- Anthropic
- MistralAI
- Google Generative AI
- Azure OpenAI

**Attributes**:

- `GPT_4_O` - GPT-4 model by OpenAI.
- `GPT_4_O_MINI` - Mini GPT-4 model by OpenAI.
- `GPT_3_5_TURBO` - GPT-3.5 Turbo model by OpenAI.
- `CLAUDE_3_5_SONNET` - Claude 3.5 Sonnet model by Anthropic.
- `CLAUDE_3_5_HAIKU` - Claude 3.5 Haiku model by Anthropic.
- `CLAUDE_3_OPUS` - Claude 3.0 Opus model by Anthropic.
- `CLAUDE_3_7_SONNET` - Claude 3.7 Sonnet model by Anthropic.
- `MISTRAL_LARGE` - Mistral Large Latest model by MistralAI.
- `GEMINI_2_0_FLASH` - Gemini 2.0 Flash model by Google Generative AI.
- `GEMINI_2_0_FLASH_LITE` - Gemini 2.0 Flash Lite model by Google Generative AI.
- `GPT_4_O_MINI`0 - Gemini 1.5 Flash model by Google Generative AI.
- `GPT_4_O_MINI`1 - GPT-4 model by Azure OpenAI.
- `GPT_4_O_MINI`2 - Mini GPT-4 model by Azure OpenAI.
- `GPT_4_O_MINI`3 - O3 Mini model by Azure OpenAI.
  
  Can be instantiated from a string with the following format:
  - provider/model_name  [e.g. LLMModel(&quot;openai/gpt-4o&quot;)]
  - model_name           [e.g. LLMModel(&quot;gpt-4o&quot;)]
  
  In the cases where the model name is not unique across providers, the earlier values in the enum
  definition will take precedence.

#### \_missing\_

```python
@classmethod
def _missing_(cls, value: object) -> LLMModel
```

Get the LLM model from the model name.

#### api\_name

```python
@property
def api_name() -> str
```

Override the default value to return the model name.

#### provider

```python
def provider() -> LLMProvider
```

Get the associated provider for the model.

**Returns**:

- `LLMProvider` - The provider associated with the model.

## ExecutionAgentType Objects

```python
class ExecutionAgentType(Enum)
```

Enum for types of agents used for executing a step.

**Attributes**:

- `ONE_SHOT` - The one-shot agent.
- `DEFAULT` - The default agent.

## PlanningAgentType Objects

```python
class PlanningAgentType(Enum)
```

Enum for planning agents used for planning queries.

**Attributes**:

- `DEFAULT` - The default planning agent.

## LogLevel Objects

```python
class LogLevel(Enum)
```

Enum for available log levels.

**Attributes**:

- `DEBUG` - Debug log level.
- `INFO` - Info log level.
- `WARNING` - Warning log level.
- `ERROR` - Error log level.
- `CRITICAL` - Critical log level.

#### parse\_str\_to\_enum

```python
def parse_str_to_enum(value: str | E, enum_type: type[E]) -> E
```

Parse a string to an enum or return the enum as is.

**Arguments**:

- `value` _str | E_ - The value to parse.
- `enum_type` _type[E]_ - The enum type to parse the value into.
  

**Raises**:

- `InvalidConfigError` - If the value cannot be parsed into the enum.
  

**Returns**:

- `E` - The corresponding enum value.

## Config Objects

```python
class Config(BaseModel)
```

General configuration for the SDK.

This class holds the configuration for the SDK, including API keys, LLM
settings, logging options, and storage settings. It also provides validation
for configuration consistency and offers methods for loading configuration
from files or default values.

**Attributes**:

- `portia_api_endpoint` - The endpoint for the Portia API.
- `portia_api_key` - The API key for Portia.
- `openai_api_key` - The API key for OpenAI.
- `anthropic_api_key` - The API key for Anthropic.
- `mistralai_api_key` - The API key for MistralAI.
- `google_api_key` - The API key for Google Generative AI.
- `azure_openai_api_key` - The API key for Azure OpenAI.
- `azure_openai_endpoint` - The endpoint for Azure OpenAI.
- `llm_provider` - The LLM provider.
- `models` - A dictionary of LLM models for each usage type.
- `portia_api_key`0 - The storage class used (e.g., MEMORY, DISK, CLOUD).
- `portia_api_key`1 - The directory for storage, if applicable.
- `portia_api_key`2 - The default log level (e.g., DEBUG, INFO).
- `portia_api_key`3 - The default destination for logs (e.g., sys.stdout).
- `portia_api_key`4 - Whether to serialize logs in JSON format.
- `portia_api_key`5 - The planning agent type.
- `portia_api_key`6 - The execution agent type.

#### parse\_feature\_flags

```python
@model_validator(mode="after")
def parse_feature_flags() -> Self
```

Add feature flags if not provided.

#### add\_default\_models

```python
@model_validator(mode="after")
def add_default_models() -> Self
```

Add default models if not provided.

#### model

```python
def model(usage: str) -> LLMModel
```

Get the LLM model for the given usage.

#### resolve\_model

```python
def resolve_model(usage: str) -> GenerativeModel
```

Resolve a model from the config.

#### resolve\_langchain\_model

```python
def resolve_langchain_model(usage: str) -> LangChainGenerativeModel
```

Resolve a LangChain model from the config.

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

#### parse\_execution\_agent\_type

```python
@field_validator("execution_agent_type", mode="before")
@classmethod
def parse_execution_agent_type(
        cls, value: str | ExecutionAgentType) -> ExecutionAgentType
```

Parse execution_agent_type to enum if string provided.

#### parse\_planning\_agent\_type

```python
@field_validator("planning_agent_type", mode="before")
@classmethod
def parse_planning_agent_type(
        cls, value: str | PlanningAgentType) -> PlanningAgentType
```

Parse planning_agent_type to enum if string provided.

#### check\_config

```python
@model_validator(mode="after")
def check_config() -> Self
```

Validate Config is consistent.

#### from\_default

```python
@classmethod
def from_default(cls, **kwargs) -> Config
```

Create a Config instance with default values, allowing overrides.

**Returns**:

- `Config` - The default config

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

**Raises**:

- `ConfigNotFoundError` - If no API key is found for the provider.
  

**Returns**:

- `SecretStr` - The required API key.

#### must\_get

```python
def must_get(name: str, expected_type: type[T]) -> T
```

Retrieve any value from the config, ensuring its of the correct type.

**Arguments**:

- `name` _str_ - The name of the config record.
- `expected_type` _type[T]_ - The expected type of the value.
  

**Raises**:

- `ConfigNotFoundError` - If no API key is found for the provider.
- `InvalidConfigError` - If the config isn&#x27;t valid
  

**Returns**:

- `T` - The config value

#### llm\_provider\_default\_from\_api\_keys

```python
def llm_provider_default_from_api_keys(**kwargs) -> LLMProvider
```

Get the default LLM provider from the API keys.

#### default\_config

```python
def default_config(**kwargs) -> Config
```

Return default config with values that can be overridden.

**Returns**:

- `Config` - The default config

