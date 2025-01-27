---
sidebar_label: verifier_agent
title: portia.agents.verifier_agent
---

The Verifier Agent for hardest problems.

This agent uses multiple models (verifier, parser etc) to achieve the highest accuracy
in completing tasks.

## ToolArgument Objects

```python
class ToolArgument(BaseModel)
```

Represents an argument for a tool as extracted from the goal and context.

Attributes:
    name (str): The name of the argument, as requested by the tool.
    value (Any | None): The value of the argument, as provided in the goal or context.
    valid (bool): Whether the value is a valid type and/or format for the given argument.
    explanation (str): Explanation of the source for the value of the argument.

## ToolInputs Objects

```python
class ToolInputs(BaseModel)
```

Represents the inputs for a tool.

Attributes:
    args (list[ToolArgument]): Arguments for the tool.

## VerifiedToolArgument Objects

```python
class VerifiedToolArgument(BaseModel)
```

Represents an argument for a tool after being verified by an agent.

Attributes:
    name (str): The name of the argument, as requested by the tool.
    value (Any | None): The value of the argument, as provided in the goal or context.
    made_up (bool): Whether the value was made up or not. Should be false if the value was
    provided by the user.

## VerifiedToolInputs Objects

```python
class VerifiedToolInputs(BaseModel)
```

Represents the inputs for a tool after being verified by an agent.

Attributes:
    args (list[VerifiedToolArgument]): Arguments for the tool.

## ParserModel Objects

```python
class ParserModel()
```

Model to parse the arguments for a tool.

Args:
    llm (BaseChatModel): The language model used for argument parsing.
    context (str): The context for argument generation.
    agent (VerifierAgent): The agent using the parser model.

Attributes:
    arg_parser_prompt (ChatPromptTemplate): The prompt template for argument parsing.
    llm (BaseChatModel): The language model used.
    context (str): The context for argument generation.
    agent (VerifierAgent): The agent using the parser model.
    previous_errors (list[str]): A list of previous errors encountered during parsing.
    retries (int): The number of retries attempted for parsing.

#### invoke

```python
def invoke(state: MessagesState) -> dict[str, Any]
```

Invoke the model with the given message state.

Args:
    state (MessagesState): The current state of the conversation.

Returns:
    dict[str, Any]: The response after invoking the model.

Raises:
    InvalidWorkflowStateError: If the agent&#x27;s tool is not available.

## VerifierModel Objects

```python
class VerifierModel()
```

A model to verify the arguments for a tool.

This model ensures that the arguments passed to a tool are valid, determining whether they are
&quot;made up&quot; or not based on the context and specific rules. The verification process uses an LLM
to analyze the context and tool arguments and returns a structured validation output.

Attributes:
    arg_verifier_prompt (ChatPromptTemplate): The prompt template used for arg verification.
    llm (BaseChatModel): The language model used to invoke the verification process.
    context (str): The context in which the tool arguments are being validated.
    agent (VerifierAgent): The agent responsible for handling the verification process.

#### invoke

```python
def invoke(state: MessagesState) -> dict[str, Any]
```

Invoke the model with the given message state.

Args:
    state (MessagesState): The current state of the conversation.

Returns:
    dict[str, Any]: The response after invoking the model.

Raises:
    InvalidWorkflowStateError: If the agent&#x27;s tool is not available.

## ToolCallingModel Objects

```python
class ToolCallingModel()
```

Model to call the tool with the verified arguments.

#### invoke

```python
def invoke(state: MessagesState) -> dict[str, Any]
```

Invoke the model with the given message state.

Args:
    state (MessagesState): The current state of the conversation.

Returns:
    dict[str, Any]: The response after invoking the model.

Raises:
    InvalidWorkflowStateError: If the agent&#x27;s tool is not available.

## VerifierAgent Objects

```python
class VerifierAgent(BaseAgent)
```

Agent responsible for achieving a task by using verification.

This agent does the following things:
 1. It uses an LLM to make sure that we have the right arguments for the tool, with
    explanations of the values and where they come from.
 2. It uses an LLM to make sure that the arguments are correct, and that they are labeled
    as provided, inferred or assumed.
 3. If any of the arguments are assumed, it will request a clarification.
 4. If the arguments are correct, it will call the tool and return the result to the user.
 5. If the tool fails, it will try again at least 3 times.

Also, if the agent is being called a second time, it will just jump to step 4.

Possible improvements:
 1. This approach (as well as the other agents) could be improved for arguments that are lists

#### clarifications\_or\_continue

```python
def clarifications_or_continue(
        state: MessagesState) -> Literal[AgentNode.TOOL_AGENT, END]
```

Determine if we should continue with the tool call or request clarifications instead.

Args:
    state (MessagesState): The current state of the conversation.

Returns:
    Literal[AgentNode.TOOL_AGENT, END]: The next node we should route to.

#### get\_last\_resolved\_clarification

```python
def get_last_resolved_clarification(arg_name: str) -> Clarification | None
```

Return the last argument clarification that matches the given arg_name.

Args:
    arg_name (str): The name of the argument to match clarifications for

Returns:
    Clarification | None: The matched clarification

#### execute\_sync

```python
def execute_sync() -> Output
```

Run the core execution logic of the task.

This method will either invoke the tool with unverified arguments or fall back
to the ToolLessAgent if no tool is available. It handles task execution through
a workflow that includes retries for up to four tool calls.

Returns:
    Output: The result of the agent&#x27;s execution, containing the tool call result.

