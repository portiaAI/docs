---
sidebar_label: common
title: portia.common
---

Types and utilities useful across the package.

This module defines various types, utilities, and base classes used throughout the package.
It includes a custom Enum class, helper functions, and base models with special configurations for
use in the Portia framework.

## PortiaEnum Objects

```python
class PortiaEnum(str, Enum)
```

Base enum class for Portia enums.

This class provides common functionality for Portia enums, including the ability to retrieve all
choices as (name, value) pairs through the `enumerate` method.

#### enumerate

```python
@classmethod
def enumerate(cls) -> tuple[tuple[str, str], ...]
```

Return a tuple of all choices as (name, value) pairs.

This method iterates through all enum members and returns their name and value in a tuple
format.

Returns:
    tuple: A tuple containing pairs of enum member names and values.

#### combine\_args\_kwargs

```python
def combine_args_kwargs(*args: Any, **kwargs: Any) -> Any
```

Combine Args + Kwargs into a single dictionary.

This function takes arbitrary positional and keyword arguments and combines them into a single
dictionary. Positional arguments are indexed as string keys (e.g., &quot;0&quot;, &quot;1&quot;, ...) while keyword
arguments retain their names.

Args:
    *args: Positional arguments to be included in the dictionary.
    **kwargs: Keyword arguments to be included in the dictionary.

Returns:
    dict: A dictionary combining both positional and keyword arguments.

