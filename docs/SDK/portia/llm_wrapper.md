---
sidebar_label: llm_wrapper
title: portia.llm_wrapper
---

Wrapper around different LLM providers allowing us to treat them the same.

## LLMWrapper Objects

```python
class LLMWrapper()
```

LLMWrapper class for different LLMs.

#### to\_langchain

```python
def to_langchain() -> BaseChatModel
```

Return a langchain chat model.

#### to\_instructor

```python
def to_instructor(response_model: type[T],
                  messages: list[ChatCompletionMessageParam]) -> T
```

Use instructor to generate an object of response_model type.

