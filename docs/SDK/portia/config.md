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

## Model Objects

```python
class Model(NamedTuple)
```

Provider and model name tuple.

**DEPRECATED** Use new model configuration options on Config class instead.

**Attributes**:

- `provider` - The provider of the model.
- `model_name` - The name of the model in the provider&#x27;s API.

## LLMModel Objects

```python
class LLMModel(Enum)
```

Enum for supported LLM models.

**DEPRECATED** Use new model configuration options on Config class instead.

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

#### to\_model\_string

```python
def to_model_string() -> str
```

Get the model string for the model.

**Returns**:

- `str` - The model string.

## \_AllModelsSupportedWithDeprecation Objects

```python
class _AllModelsSupportedWithDeprecation(Container)
```

A type that returns True for any contains check.

#### \_\_contains\_\_

```python
def __contains__(item: object) -> bool
```

Check if the item is in the container.

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

- `TRACE` - Trace log level (very verbose; below DEBUG).
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

## GenerativeModelsConfig Objects

```python
class GenerativeModelsConfig(BaseModel)
```

Configuration for a Generative Models.

These models do not all need to be specified manually. If an LLM provider is configured,
Portia will use default models that are selected for the particular use-case.

**Attributes**:

- `default_model` - The default generative model to use. This model is used as the fallback
  model if no other model is specified. It is also used by default in the Portia SDK
  tool that require an LLM.
  
- `planning_model` - The model to use for the PlanningAgent. Reasoning models are a good choice
  here, as they are able to reason about the problem and the possible solutions. If not
  specified, the default_model will be used.
  
- `execution_model` - The model to use for the ExecutionAgent. This model is used for the
  distilling context from the plan run into tool calls. If not specified, the
  default_model will be used.
  
- `introspection_model` - The model to use for the IntrospectionAgent. This model is used to
  introspect the problem and the plan. If not specified, the default_model will be used.
  
- `summarizer_model` - The model to use for the SummarizerAgent. This model is used to
  summarize output from the plan run. If not specified, the default_model will be used.

#### parse\_models

```python
@model_validator(mode="before")
@classmethod
def parse_models(cls, data: dict[str, Any]) -> dict[str, Any]
```

Convert legacy LLMModel values to str with deprecation warning.

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
- `aws_access_key_id` - The AWS access key ID.
- `aws_secret_access_key` - The AWS secret access key.
- `aws_default_region` - The AWS default region.
- `aws_credentials_profile_name` - The AWS credentials profile name.
- `portia_api_key`0 - The API key for Azure OpenAI.
- `portia_api_key`1 - The endpoint for Azure OpenAI.
- `portia_api_key`2 - The LLM provider. If set, Portia uses this to select the best models
  for each agent. Can be None if custom models are provided.
- `portia_api_key`3 - A configuration for the LLM models for Portia to use.
- `portia_api_key`4 - The storage class used (e.g., MEMORY, DISK, CLOUD).
- `portia_api_key`5 - The directory for storage, if applicable.
- `portia_api_key`6 - The default log level (e.g., DEBUG, INFO).
- `portia_api_key`7 - The default destination for logs (e.g., sys.stdout).
- `portia_api_key`8 - Whether to serialize logs in JSON format.
- `portia_api_key`9 - The planning agent type.
- `openai_api_key`0 - The execution agent type.
- `openai_api_key`1 - A dictionary of feature flags for the SDK.
- `openai_api_key`2 - Whether to enable clarifications for the execution agent.

#### parse\_feature\_flags

```python
@model_validator(mode="after")
def parse_feature_flags() -> Self
```

Add feature flags if not provided.

#### setup\_cache

```python
@model_validator(mode="after")
def setup_cache() -> Self
```

Set up LLM cache if Redis URL is provided.

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

#### exceeds\_output\_threshold

```python
def exceeds_output_threshold(value: str | list[str | dict]) -> bool
```

Determine whether the provided output value exceeds the large output threshold.

#### get\_agent\_default\_model

```python
def get_agent_default_model(
        agent_key: str,
        llm_provider: LLMProvider | None = None
) -> GenerativeModel | str | None
```

Get the default model for the given agent key.

#### fill\_default\_models

```python
@model_validator(mode="after")
def fill_default_models() -> Self
```

Fill in default models for the LLM provider if not provided.

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

#### from\_local\_config

```python
@classmethod
def from_local_config(cls,
                      profile: str = "default",
                      config_file: Path | None = None,
                      **overrides: Any) -> Config
```

Create Config instance from TOML profile with proper precedence.

Precedence order (highest to lowest):
1. Direct code overrides (**overrides)
2. Config file values
3. Environment variables

**Arguments**:

- `profile` - Profile name to load (default: &quot;default&quot;)
- `config_file` - Optional path to config file
- `**overrides` - Direct parameter overrides
  

**Returns**:

  Config instance with merged settings
  

**Example**:

  config = Config.from_local_config(profile=&quot;openai&quot;)
  config = Config.from_local_config(
  profile=&quot;gemini&quot;,
  default_model=&quot;google/gemini-2.5-pro&quot;,
  )

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

#### get\_default\_model

```python
def get_default_model() -> GenerativeModel
```

Get or build the default model from the config.

The default model will always be present. It is a general purpose model that is used
for the SDK&#x27;s LLM-based Tools, such as the ImageUnderstandingTool and the LLMTool.

Additionally, unless specified all other specific agent models will default to this model.

#### get\_planning\_model

```python
def get_planning_model() -> GenerativeModel
```

Get or build the planning model from the config.

See the GenerativeModelsConfig class for more information

#### get\_execution\_model

```python
def get_execution_model() -> GenerativeModel
```

Get or build the execution model from the config.

See the GenerativeModelsConfig class for more information

#### get\_introspection\_model

```python
def get_introspection_model() -> GenerativeModel
```

Get or build the introspection model from the config.

See the GenerativeModelsConfig class for more information

#### get\_summarizer\_model

```python
def get_summarizer_model() -> GenerativeModel
```

Get or build the summarizer model from the config.

See the GenerativeModelsConfig class for more information

#### get\_generative\_model

```python
def get_generative_model(
        model: str | GenerativeModel | None) -> GenerativeModel | None
```

Get a GenerativeModel instance.

**Arguments**:

- `model` _str | GenerativeModel | None_ - The model to get, either specified as a
  string in the form of &quot;provider/model_name&quot;, or as a GenerativeModel instance.
  Also accepts None, in which case None is returned.
  

**Returns**:

  GenerativeModel | None: The model instance or None.

#### llm\_provider\_default\_from\_api\_keys

```python
def llm_provider_default_from_api_keys(**kwargs) -> LLMProvider | None
```

Get the default LLM provider from the API keys.

**Returns**:

- `LLMProvider` - The default LLM provider.
- `None` - If no API key is found.

#### default\_config

```python
def default_config(**kwargs) -> Config
```

Return default config with values that can be overridden.

**Returns**:

- `Config` - The default config

