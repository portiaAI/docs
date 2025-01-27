---
sidebar_label: summarizer
title: portia.agents.agent_node_utils.summarizer
---

Summarizer model implementation.

The Summarizer model can be used by agents to summarize the output of a given tool.

## LLMSummarizer Objects

```python
class LLMSummarizer()
```

Model to generate a summary for the textual output of a tool.

This model is used only on the tool output message.

Attributes:
    summarizer_prompt (ChatPromptTemplate): The prompt template used to generate the summary.
    llm (BaseChatModel): The language model used for summarization.
    summary_max_length (int): The maximum length of the summary.

#### invoke

```python
def invoke(state: MessagesState) -> dict[str, Any]
```

Invoke the model with the given message state.

This method processes the last message in the state, checks if it&#x27;s a tool message with an
output, and if so, generates a summary of the tool&#x27;s output. The summary is then added to
the artifact of the last message.

Args:
    state (MessagesState): The current state of the messages, which includes the output.

Returns:
    dict[str, Any]: A dict containing the updated message state, including the summary.

Raises:
    Exception: If an error occurs during the invocation of the summarizer model.

