---
sidebar_label: llm_wrapper
title: portia.llm_wrapper
---

Wrapper around different LLM providers, standardizing their usage.

This module provides an abstraction layer around various large language model (LLM) providers,
allowing them to be treated uniformly in the application. It defines a base class `BaseLLMWrapper`
and a concrete implementation `LLMWrapper` that handles communication with different LLM providers
such as OpenAI, Anthropic, and MistralAI.

The `LLMWrapper` class includes methods to convert the provider&#x27;s model to LangChain-compatible
models and to generate responses using the instructor tool.

Classes in this file include:

- `BaseLLMWrapper`: An abstract base class for all LLM wrappers, providing a template for conversion
methods.
- `LLMWrapper`: A concrete implementation that supports different LLM providers and provides
functionality for converting to LangChain models and generating responses using instructor.

## BaseLLMWrapper Objects

```python
class BaseLLMWrapper(ABC)
```

Abstract base class for LLM wrappers.

This abstract class defines the interface that all LLM wrappers should implement.
It requires conversion methods for LangChain models (`to_langchain`) and for generating
responses using the instructor tool (`to_instructor`).

**Methods**:

- `to_langchain` - Convert the LLM to a LangChain-compatible model.
- `to_instructor` - Generate a response using the instructor tool.

#### \_\_init\_\_

```python
def __init__(api_key: SecretStr) -> None
```

Initialize the base LLM wrapper.

**Arguments**:

- `api_key` _str_ - The API key for the LLM provider.

#### to\_langchain

```python
@abstractmethod
def to_langchain() -> BaseChatModel
```

Return a LangChain chat model based on the LLM provider.

Converts the LLM provider&#x27;s model to a LangChain-compatible model for interaction
within the LangChain framework.

**Returns**:

- `BaseChatModel` - A LangChain-compatible model.
  

**Raises**:

- `NotImplementedError` - If the function is not implemented

#### to\_instructor

```python
@abstractmethod
def to_instructor(response_model: type[T],
                  messages: list[ChatCompletionMessageParam]) -> T
```

Generate a response using instructor.

**Arguments**:

- `response_model` _type[T]_ - The Pydantic model to deserialize the response into.
- `messages` _list[ChatCompletionMessageParam]_ - The messages to send to the LLM.
  

**Returns**:

- `T` - The deserialized response.
  

**Raises**:

- `NotImplementedError` - If the function is not implemented

## LLMWrapper Objects

```python
class LLMWrapper(BaseLLMWrapper)
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
def __init__(model_name: LLMModel,
             api_key: SecretStr,
             model_seed: int = 343,
             api_endpoint: str | None = None) -> None
```

Initialize the wrapper.

**Arguments**:

- `model_name` _LLMModel_ - The name of the LLM model to use.
- `api_key` _SecretStr_ - The API key for authentication with the LLM provider.
- `model_seed` _int, optional_ - Seed for model&#x27;s random generation. Defaults to 343.
- `api_endpoint` _str | None, optional_ - The API endpoint for the LLM provider

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
def to_instructor(response_model: type[T],
                  messages: list[ChatCompletionMessageParam]) -> T
```

Use instructor to generate an object of the specified response model type.

**Arguments**:

- `response_model` _type[T]_ - The Pydantic model to deserialize the response into.
- `messages` _list[ChatCompletionMessageParam]_ - The messages to send to the LLM.
  

**Returns**:

- `T` - The deserialized response from the LLM provider.

