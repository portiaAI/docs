---
sidebar_label: token_check
title: portia.token_check
---

Token counting utilities with fallback for offline environments.

#### estimate\_tokens

```python
def estimate_tokens(text: str) -> int
```

Estimate the number of tokens in a string using character-based estimation.

We used to do a proper count using tiktoken, but that loads encodings from the internet at
runtime, which doens&#x27;t work in environments where we don&#x27;t have internet access / where network
access is locked down. As our current usages only require an estimate, this suffices for now.

#### exceeds\_context\_threshold

```python
def exceeds_context_threshold(value: Any,
                              model: GenerativeModel,
                              threshold_percentage: float = 1) -> bool
```

Check if a value is under a given threshold percentage of a model&#x27;s context window size.

**Arguments**:

- `value` - The value to check (will be converted to string for token estimation)
- `model` - The generative model to get context window size from
- `threshold_percentage` - A percentage threshold to apply. For example, 0.9 means that this will
  return True if the value exceeds 90% of the context window size.
  

**Returns**:

- `bool` - True if the estimated tokens are less than the threshold, False otherwise

