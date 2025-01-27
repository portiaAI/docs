---
sidebar_label: toolless_agent
title: portia.agents.toolless_agent
---

Agent designed for tasks that do not require external tools.

This agent is useful for solving tasks where the language model (LLM) intrinsically
has the necessary knowledge or for creative tasks. Any task that an LLM can handle
on its own, without the need for additional tools, can use the ToolLessAgent.

## ToolLessModel Objects

```python
class ToolLessModel()
```

Model to invoke the toolless agent.

This model uses the language model (LLM) to generate responses based on a
predefined prompt, combining a system message and a user input message.
It is invoked by the ToolLessAgent to perform tasks.

Args:
    llm (BaseChatModel): The language model to use for generating responses.
    context (str): The context to be used when generating the response.
    agent (BaseAgent): The agent that manages the task.

Methods:
    invoke(MessagesState): Invokes the LLM to generate a response based on the
                            current task and context.

#### invoke

```python
def invoke(_: MessagesState) -> dict[str, Any]
```

Invoke the model with the given message state.

This method formats the input to the LLM using the current task and context,
then generates a response.

Args:
    _ (MessagesState): The message state (not used in this method).

Returns:
    dict[str, Any]: A dictionary containing the model&#x27;s response.

## ToolLessAgent Objects

```python
class ToolLessAgent(BaseAgent)
```

Agent responsible for achieving a task by using langgraph.

This agent is designed to solve tasks that do not require any external tools.
It leverages the ToolLessModel to generate responses based on the given task
and context.

Methods:
    execute_sync(): Executes the core logic of the agent&#x27;s task by invoking the
                    ToolLessModel with the appropriate inputs.

#### execute\_sync

```python
def execute_sync() -> Output
```

Run the core execution logic of the task.

This method generates a task-specific prompt and invokes the ToolLessModel
within a StateGraph to produce a response based on the current context and task.

Returns:
    Output: The result of the agent&#x27;s execution, containing the generated response.

