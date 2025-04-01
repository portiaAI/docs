---
sidebar_label: llm_wrapper
title: portia.llm_wrapper
---

Wrapper around different LLM providers, standardizing their usage.

WARNING: This module is deprecated. It will be removed in a future version.

This module provides an abstraction layer around various large language model (LLM) providers,
allowing them to be treated uniformly in the application. It defines an `LLMWrapper` that wraps
a `Model` instance and provides methods to convert the provider&#x27;s model to LangChain-compatible
models and to generate responses using the instructor tool.

Classes in this file include:

- `LLMWrapper`: A concrete implementation that supports different LLM providers and provides
functionality for converting to LangChain models and generating responses using instructor.

## LLMWrapper Objects

```python
class LLMWrapper()
```

LLMWrapper class for different LLMs.

This class provides functionality for working with various LLM providers, such as OpenAI,
Anthropic, and MistralAI. It includes methods to convert the LLM provider&#x27;s model to a
LangChain-compatible model and to generate responses using the instructor tool.

**Attributes**:

- `model_name` _LLMModel_ - The name of the model to use.
- `api_key` _SecretStr_ - The API key for the LLM provider.
- `model_seed` _int_ - The seed for the model&#x27;s random generation.
- `api_endpoint` _str | None_ - The API endpoint for the LLM provider (Optional, many API&#x27;s don&#x27;t
  require it).
  

**Methods**:

- `to_langchain` - Converts the LLM provider&#x27;s model to a LangChain-compatible model.
- `to_instructor` - Generates a response using instructor for the selected LLM provider.

#### \_\_init\_\_

```python
def __init__(model: GenerativeModel) -> None
```

Initialize the wrapper.

**Arguments**:

- `model` _Model_ - The language model to use.

#### for\_usage

```python
@classmethod
def for_usage(cls, usage: str, config: Config) -> LLMWrapper
```

Create an LLMWrapper from a LLMModel.

#### to\_langchain

```python
def to_langchain() -> BaseChatModel
```

Return a LangChain chat model based on the LLM provider.

Converts the LLM provider&#x27;s model to a LangChain-compatible model for interaction
within the LangChain framework.

**Returns**:

- `BaseChatModel` - A LangChain-compatible model.

#### to\_instructor

```python
def to_instructor(response_model: type[T], messages: list[Message]) -> T
```

Use instructor to generate an object of the specified response model type.

**Arguments**:

- `response_model` _type[T]_ - The Pydantic model to deserialize the response into.
- `messages` _list[Message]_ - The messages to send to the LLM.
  

**Returns**:

- `T` - The deserialized response from the LLM provider.

