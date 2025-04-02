---
sidebar_label: step_summarizer
title: portia.execution_agents.utils.step_summarizer
---

StepSummarizer implementation.

The StepSummarizer can be used by agents to summarize the output of a given tool.

## StepSummarizer Objects

```python
class StepSummarizer()
```

Class to summarize the output of a tool using llm.

This is used only on the tool output message.

**Attributes**:

- `summarizer_prompt` _ChatPromptTemplate_ - The prompt template used to generate the summary.
- `model` _GenerativeModel_ - The language model used for summarization.
- `summary_max_length` _int_ - The maximum length of the summary.
- `step` _Step_ - The step that produced the output.

#### \_\_init\_\_

```python
def __init__(model: GenerativeModel,
             tool: Tool,
             step: Step,
             summary_max_length: int = 500) -> None
```

Initialize the model.

**Arguments**:

- `model` _GenerativeModel_ - The language model used for summarization.
- `tool` _Tool_ - The tool used for summarization.
- `step` _Step_ - The step that produced the output.
- `summary_max_length` _int_ - The maximum length of the summary. Default is 500 characters.

#### invoke

```python
def invoke(state: MessagesState) -> dict[str, Any]
```

Invoke the model with the given message state.

This method processes the last message in the state, checks if it&#x27;s a tool message with an
output, and if so, generates a summary of the tool&#x27;s output. The summary is then added to
the artifact of the last message.

**Arguments**:

- `state` _MessagesState_ - The current state of the messages, which includes the output.
  

**Returns**:

  dict[str, Any]: A dict containing the updated message state, including the summary.
  

**Raises**:

- `Exception` - If an error occurs during the invocation of the summarizer model.

