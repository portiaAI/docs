---
sidebar_label: execution_utils
title: portia.execution_agents.execution_utils
---

Agent execution utilities.

This module contains utility functions for managing agent execution flow.

## AgentNode Objects

```python
class AgentNode(str, Enum)
```

Nodes for agent execution.

This enumeration defines the different types of nodes that can be encountered
during the agent execution process.

**Attributes**:

- `TOOL_AGENT` _str_ - A node representing the tool agent.
- `SUMMARIZER` _str_ - A node representing the summarizer.
- `TOOLS` _str_ - A node representing the tools.
- `ARGUMENT_VERIFIER` _str_ - A node representing the argument verifier.
- `ARGUMENT_PARSER` _str_ - A node representing the argument parser.

#### next\_state\_after\_tool\_call

```python
def next_state_after_tool_call(
    state: MessagesState,
    tool: Tool | None = None
) -> Literal[AgentNode.TOOL_AGENT, AgentNode.SUMMARIZER, END]
```

Determine the next state after a tool call.

This function checks the state after a tool call to determine if the run
should proceed to the tool agent again, to the summarizer, or end.

**Arguments**:

- `state` _MessagesState_ - The current state of the messages.
- `tool` _Tool | None_ - The tool involved in the call, if any.
  

**Returns**:

  Literal[AgentNode.TOOL_AGENT, AgentNode.SUMMARIZER, END]: The next state to transition to.
  

**Raises**:

- `ToolRetryError` - If the tool has an error and the maximum retry limit has not been reached.

#### is\_clarification

```python
def is_clarification(artifact: Any) -> bool
```

Check if the artifact is a clarification or list of clarifications.

#### tool\_call\_or\_end

```python
def tool_call_or_end(state: MessagesState) -> Literal[AgentNode.TOOLS, END]
```

Determine if tool execution should continue.

This function checks if the current state indicates that the tool execution
should continue, or if the run should end.

**Arguments**:

- `state` _MessagesState_ - The current state of the messages.
  

**Returns**:

  Literal[AgentNode.TOOLS, END]: The next state to transition to.

#### process\_output

```python
def process_output(
        messages: list[BaseMessage],
        tool: Tool | None = None,
        clarifications: list[Clarification] | None = None) -> Output
```

Process the output of the agent.

This function processes the agent&#x27;s output based on the type of message received.
It raises errors if the tool encounters issues and returns the appropriate output.

**Arguments**:

- `messages` _list[BaseMessage}_ - The set of messages received from the agent&#x27;s plan_run.
- `tool` _Tool | None_ - The tool associated with the agent, if any.
- `clarifications` _list[Clarification] | None_ - A list of clarifications, if any.
  

**Returns**:

- `Output` - The processed output, which can be an error, tool output, or clarification.
  

**Raises**:

- `ToolRetryError` - If there was a soft error with the tool and retries are allowed.
- `ToolFailedError` - If there was a hard error with the tool.
- `InvalidAgentOutputError` - If the output from the agent is invalid.

