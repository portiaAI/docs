---
sidebar_label: model
title: portia.model
---

LLM provider model classes for Portia Agents.

## Message Objects

```python
class Message(BaseModel)
```

Portia LLM message class.

#### from\_langchain

```python
@classmethod
def from_langchain(cls, message: BaseMessage) -> Message
```

Create a Message from a LangChain message.

**Arguments**:

- `message` _BaseMessage_ - The LangChain message to convert.
  

**Returns**:

- `Message` - The converted message.

#### to\_langchain

```python
def to_langchain() -> BaseMessage
```

Convert to LangChain BaseMessage sub-type.

**Returns**:

- `BaseMessage` - The converted message, subclass of LangChain&#x27;s BaseMessage.

## LLMProvider Objects

```python
class LLMProvider(Enum)
```

Enum for supported LLM providers.

**Attributes**:

- `OPENAI` - OpenAI provider.
- `ANTHROPIC` - Anthropic provider.
- `MISTRALAI` - MistralAI provider.
- `GOOGLE` - Google Generative AI provider.
- `AZURE_OPENAI` - Azure OpenAI provider.

#### GOOGLE\_GENERATIVE\_AI

noqa: PIE796 - Alias for GOOGLE member

## GenerativeModel Objects

```python
class GenerativeModel(ABC)
```

Base class for all generative model clients.

#### \_\_init\_\_

```python
def __init__(model_name: str) -> None
```

Initialize the model.

**Arguments**:

- `model_name` - The name of the model.

#### get\_response

```python
@abstractmethod
def get_response(messages: list[Message]) -> Message
```

Given a list of messages, call the model and return its response as a new message.

**Arguments**:

- `messages` _list[Message]_ - The list of messages to send to the model.
  

**Returns**:

- `Message` - The response from the model.

#### get\_structured\_response

```python
@abstractmethod
def get_structured_response(messages: list[Message],
                            schema: type[BaseModelT]) -> BaseModelT
```

Get a structured response from the model, given a Pydantic model.

**Arguments**:

- `messages` _list[Message]_ - The list of messages to send to the model.
- `schema` _type[BaseModelT]_ - The Pydantic model to use for the response.
  

**Returns**:

- `BaseModelT` - The structured response from the model.

#### \_\_str\_\_

```python
def __str__() -> str
```

Get the string representation of the model.

#### \_\_repr\_\_

```python
def __repr__() -> str
```

Get the string representation of the model.

#### to\_langchain

```python
@abstractmethod
def to_langchain() -> BaseChatModel
```

Get the LangChain client.

## LangChainGenerativeModel Objects

```python
class LangChainGenerativeModel(GenerativeModel)
```

Base class for LangChain-based models.

#### \_\_init\_\_

```python
def __init__(client: BaseChatModel, model_name: str) -> None
```

Initialize with LangChain client.

**Arguments**:

- `client` - LangChain chat model instance
- `model_name` - The name of the model

#### to\_langchain

```python
def to_langchain() -> BaseChatModel
```

Get the LangChain client.

#### get\_response

```python
def get_response(messages: list[Message]) -> Message
```

Get response using LangChain model.

#### get\_structured\_response

```python
def get_structured_response(messages: list[Message], schema: type[BaseModelT],
                            **kwargs: Any) -> BaseModelT
```

Get structured response using LangChain model.

**Arguments**:

- `messages` _list[Message]_ - The list of messages to send to the model.
- `schema` _type[BaseModelT]_ - The Pydantic model to use for the response.
- `**kwargs` - Additional keyword arguments to pass to the with_structured_output method.
  

**Returns**:

- `BaseModelT` - The structured response from the model.

## OpenAIGenerativeModel Objects

```python
class OpenAIGenerativeModel(LangChainGenerativeModel)
```

OpenAI model implementation.

#### \_\_init\_\_

```python
def __init__(*,
             model_name: str,
             api_key: SecretStr,
             seed: int = 343,
             max_retries: int = 3,
             temperature: float = 0,
             **kwargs: Any) -> None
```

Initialize with OpenAI client.

**Arguments**:

- `model_name` - OpenAI model to use
- `api_key` - API key for OpenAI
- `seed` - Random seed for model generation
- `max_retries` - Maximum number of retries
- `temperature` - Temperature parameter
- `**kwargs` - Additional keyword arguments to pass to ChatOpenAI

#### get\_structured\_response

```python
def get_structured_response(messages: list[Message], schema: type[BaseModelT],
                            **kwargs: Any) -> BaseModelT
```

Call the model in structured output mode targeting the given Pydantic model.

**Arguments**:

- `messages` _list[Message]_ - The list of messages to send to the model.
- `schema` _type[BaseModelT]_ - The Pydantic model to use for the response.
- `**kwargs` - Additional keyword arguments to pass to the model.
  

**Returns**:

- `BaseModelT` - The structured response from the model.

#### get\_structured\_response\_instructor

```python
def get_structured_response_instructor(messages: list[Message],
                                       schema: type[BaseModelT]) -> BaseModelT
```

Get structured response using instructor.

## AzureOpenAIGenerativeModel Objects

```python
class AzureOpenAIGenerativeModel(LangChainGenerativeModel)
```

Azure OpenAI model implementation.

#### \_\_init\_\_

```python
def __init__(*,
             model_name: str,
             api_key: SecretStr,
             azure_endpoint: str,
             api_version: str = "2025-01-01-preview",
             seed: int = 343,
             max_retries: int = 3,
             temperature: float = 0,
             **kwargs: Any) -> None
```

Initialize with Azure OpenAI client.

**Arguments**:

- `model_name` - OpenAI model to use
- `azure_endpoint` - Azure OpenAI endpoint
- `api_version` - Azure API version
- `seed` - Random seed for model generation
- `api_key` - API key for Azure OpenAI
- `max_retries` - Maximum number of retries
- `temperature` - Temperature parameter (defaults to 1 for O_3_MINI, 0 otherwise)
- `**kwargs` - Additional keyword arguments to pass to AzureChatOpenAI

#### get\_structured\_response

```python
def get_structured_response(messages: list[Message], schema: type[BaseModelT],
                            **kwargs: Any) -> BaseModelT
```

Call the model in structured output mode targeting the given Pydantic model.

**Arguments**:

- `messages` _list[Message]_ - The list of messages to send to the model.
- `schema` _type[BaseModelT]_ - The Pydantic model to use for the response.
- `**kwargs` - Additional keyword arguments to pass to the model.
  

**Returns**:

- `BaseModelT` - The structured response from the model.

#### get\_structured\_response\_instructor

```python
def get_structured_response_instructor(messages: list[Message],
                                       schema: type[BaseModelT]) -> BaseModelT
```

Get structured response using instructor.

## AnthropicGenerativeModel Objects

```python
class AnthropicGenerativeModel(LangChainGenerativeModel)
```

Anthropic model implementation.

#### \_\_init\_\_

```python
def __init__(*,
             model_name: str = "claude-3-5-sonnet-latest",
             api_key: SecretStr,
             timeout: int = 120,
             max_retries: int = 3,
             max_tokens: int = 8096,
             **kwargs: Any) -> None
```

Initialize with Anthropic client.

**Arguments**:

- `model_name` - Name of the Anthropic model
- `timeout` - Request timeout in seconds
- `max_retries` - Maximum number of retries
- `max_tokens` - Maximum number of tokens to generate
- `api_key` - API key for Anthropic
- `**kwargs` - Additional keyword arguments to pass to ChatAnthropic

#### get\_structured\_response

```python
def get_structured_response(messages: list[Message], schema: type[BaseModelT],
                            **kwargs: Any) -> BaseModelT
```

Call the model in structured output mode targeting the given Pydantic model.

**Arguments**:

- `messages` _list[Message]_ - The list of messages to send to the model.
- `schema` _type[BaseModelT]_ - The Pydantic model to use for the response.
- `**kwargs` - Additional keyword arguments to pass to the model.
  

**Returns**:

- `BaseModelT` - The structured response from the model.

#### get\_structured\_response\_instructor

```python
def get_structured_response_instructor(messages: list[Message],
                                       schema: type[BaseModelT]) -> BaseModelT
```

Get structured response using instructor.

#### map\_message\_to\_instructor

```python
def map_message_to_instructor(message: Message) -> ChatCompletionMessageParam
```

Map a Message to ChatCompletionMessageParam.

**Arguments**:

- `message` _Message_ - The message to map.
  

**Returns**:

- `ChatCompletionMessageParam` - Message in the format expected by instructor.

