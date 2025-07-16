---
Sidebar_Label: token_counter
Title: portia.token_counter
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

