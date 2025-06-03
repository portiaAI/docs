---
sidebar_label: gemini_langsmith_wrapper
title: portia.gemini_langsmith_wrapper
---

Custom LangSmith wrapper for Google Generative AI (Gemini).

#### wrap\_gemini

```python
def wrap_gemini(client: genai.GenerativeModel) -> genai.GenerativeModel
```

Wrap a Google Generative AI model to enable LangSmith tracing.

