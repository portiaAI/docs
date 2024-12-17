---
sidebar_label: config
title: portia.config
---

Configuration for the SDK.

## StorageClass Objects

```python
class StorageClass(Enum)
```

Represent locations plans and workflows are written to.

## LLMProvider Objects

```python
class LLMProvider(Enum)
```

Enum of LLM providers.

## Config Objects

```python
class Config(BaseModel)
```

General configuration for the library.

#### from\_file

```python
@classmethod
def from_file(cls, file_path: Path) -> Config
```

Load configuration from a JSON file.

#### must\_get\_api\_key

```python
def must_get_api_key(name: str) -> SecretStr
```

Get an api key as a SecretStr or error if not set.

#### must\_get\_raw\_api\_key

```python
def must_get_raw_api_key(name: str) -> str
```

Get a raw api key as a string or errors if not set.

#### must\_get

```python
def must_get(name: str, expected_type: type[T]) -> T
```

Get a given value in the config ensuring a type match.

