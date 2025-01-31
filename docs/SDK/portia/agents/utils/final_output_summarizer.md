---
sidebar_label: final_output_summarizer
title: portia.agents.utils.final_output_summarizer
---

Utility class for final output summarizer.

## FinalOutputSummarizer Objects

```python
class FinalOutputSummarizer()
```

Utility class responsible for summarizing the workflow outputs for final output&#x27;s summary.

Attributes:
    config (Config): The configuration for the llm.

#### create\_summary

```python
def create_summary(plan: Plan, workflow: Workflow) -> str | None
```

Execute the summarizer llm and return the summary as a string.

Args:
    plan (Plan): The plan containing the steps.
    workflow (Workflow): The workflow to summarize.

Returns:
    str | None: The generated summary or None if generation fails.

