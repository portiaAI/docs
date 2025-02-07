---
sidebar_label: one_shot_agent
title: portia.agents.one_shot_agent
---

A simple OneShotAgent optimized for simple tool calling tasks.

This agent invokes the OneShotToolCallingModel up to four times, but each individual
attempt is a one-shot call. It is useful when the tool call is simple, minimizing cost.
However, for more complex tool calls, the VerifierAgent is recommended as it will
be more successful than the OneShotAgent.

## OneShotToolCallingModel Objects

```python
class OneShotToolCallingModel()
```

One-shot model for calling a given tool.

This model directly passes the tool and context to the language model (LLM)
to generate a response. It is suitable for simple tasks where the arguments
are already correctly formatted and complete. This model does not validate
arguments (e.g., it will not catch missing arguments).

It is recommended to use the VerifierAgent for more complex tasks.

Args:
    llm (BaseChatModel): The language model to use for generating responses.
    context (str): The context to provide to the language model when generating a response.
    tools (list[StructuredTool]): A list of tools that can be used during the task.
    agent (OneShotAgent): The agent responsible for managing the task.

Methods:
    invoke(MessagesState): Invokes the LLM to generate a response based on the query, context,
                           and past errors.

#### invoke

```python
def invoke(state: MessagesState) -> dict[str, Any]
```

Invoke the model with the given message state.

This method formats the input for the language model using the query, context,
and past errors, then generates a response by invoking the model.

Args:
    state (MessagesState): The state containing the messages and other necessary data.

Returns:
    dict[str, Any]: A dictionary containing the model&#x27;s generated response.

## OneShotAgent Objects

```python
class OneShotAgent(BaseAgent)
```

Agent responsible for achieving a task by using langgraph.

This agent performs the following steps:
1. Calls the tool with unverified arguments.
2. Retries tool calls up to 4 times.

Args:
    step (Step): The current step in the task plan.
    workflow (Workflow): The workflow that defines the task execution process.
    config (Config): The configuration settings for the agent.
    tool (Tool | None): The tool to be used for the task (optional).

Methods:
    execute_sync(): Executes the core logic of the agent&#x27;s task, using the provided tool

#### execute\_sync

```python
def execute_sync() -> Output
```

Run the core execution logic of the task.

This method will invoke the tool with arguments

Returns:
    Output: The result of the agent&#x27;s execution, containing the tool call result.

