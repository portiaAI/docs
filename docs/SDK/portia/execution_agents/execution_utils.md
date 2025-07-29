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
- `MEMORY_EXTRACTION` _str_ - A node representing the memory extraction step.

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

#### get\_arg\_value\_with\_templating

```python
def get_arg_value_with_templating(step_inputs: list[StepInput],
                                  arg: Any) -> Any
```

Return the value of an argument, handling any templating required.

#### template\_in\_required\_inputs

```python
def template_in_required_inputs(response: BaseMessage,
                                step_inputs: list[StepInput]) -> BaseMessage
```

Template any required inputs into the tool calls.

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

- `messages` _list[BaseMessage]_ - The set of messages received from the agent&#x27;s plan_run.
- `tool` _Tool | None_ - The tool associated with the agent, if any.
- `clarifications` _list[Clarification] | None_ - A list of clarifications, if any.
  

**Returns**:

- `Output` - The processed output, which can be an error, tool output, or clarification.
  

**Raises**:

- `ToolRetryError` - If there was a soft error with the tool and retries are allowed.
- `ToolFailedError` - If there was a hard error with the tool.
- `InvalidAgentOutputError` - If the output from the agent is invalid.

#### is\_soft\_tool\_error

```python
def is_soft_tool_error(message: BaseMessage) -> bool
```

Check if the message is a soft tool error.

