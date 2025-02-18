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

**Attributes**:

- `name` _str_ - The name of the argument, as requested by the tool.
- `value` _Any | None_ - The value of the argument, as provided in the goal or context.
- `valid` _bool_ - Whether the value is a valid type and/or format for the given argument.
- `explanation` _str_ - Explanation of the source for the value of the argument.

## ToolInputs Objects

```python
class ToolInputs(BaseModel)
```

Represents the inputs for a tool.

**Attributes**:

- `args` _list[ToolArgument]_ - Arguments for the tool.

## VerifiedToolArgument Objects

```python
class VerifiedToolArgument(BaseModel)
```

Represents an argument for a tool after being verified by an agent.

**Attributes**:

- `name` _str_ - The name of the argument, as requested by the tool.
- `value` _Any | None_ - The value of the argument, as provided in the goal or context.
- `made_up` _bool_ - Whether the value was made up or not. Should be false if the value was
  provided by the user.

## VerifiedToolInputs Objects

```python
class VerifiedToolInputs(BaseModel)
```

Represents the inputs for a tool after being verified by an agent.

**Attributes**:

- `args` _list[VerifiedToolArgument]_ - Arguments for the tool.

## ParserModel Objects

```python
class ParserModel()
```

Model to parse the arguments for a tool.

**Arguments**:

- `llm` _BaseChatModel_ - The language model used for argument parsing.
- `context` _str_ - The context for argument generation.
- `agent` _VerifierAgent_ - The agent using the parser model.
  

**Attributes**:

- `arg_parser_prompt` _ChatPromptTemplate_ - The prompt template for argument parsing.
- `llm` _BaseChatModel_ - The language model used.
- `context` _str_ - The context for argument generation.
- `agent` _VerifierAgent_ - The agent using the parser model.
- `previous_errors` _list[str]_ - A list of previous errors encountered during parsing.
- `retries` _int_ - The number of retries attempted for parsing.

#### \_\_init\_\_

```python
def __init__(llm: BaseChatModel, context: str, agent: VerifierAgent) -> None
```

Initialize the model.

**Arguments**:

- `llm` _BaseChatModel_ - The language model used for argument parsing.
- `context` _str_ - The context for argument generation.
- `agent` _VerifierAgent_ - The agent using the parser model.

#### invoke

```python
def invoke(state: MessagesState) -> dict[str, Any]
```

Invoke the model with the given message state.

**Arguments**:

- `state` _MessagesState_ - The current state of the conversation.
  

**Returns**:

  dict[str, Any]: The response after invoking the model.
  

**Raises**:

- `InvalidWorkflowStateError` - If the agent&#x27;s tool is not available.

## VerifierModel Objects

```python
class VerifierModel()
```

A model to verify the arguments for a tool.

This model ensures that the arguments passed to a tool are valid, determining whether they are
&quot;made up&quot; or not based on the context and specific rules. The verification process uses an LLM
to analyze the context and tool arguments and returns a structured validation output.

**Attributes**:

- `arg_verifier_prompt` _ChatPromptTemplate_ - The prompt template used for arg verification.
- `llm` _BaseChatModel_ - The language model used to invoke the verification process.
- `context` _str_ - The context in which the tool arguments are being validated.
- `agent` _VerifierAgent_ - The agent responsible for handling the verification process.

#### \_\_init\_\_

```python
def __init__(llm: BaseChatModel, context: str, agent: VerifierAgent) -> None
```

Initialize the model.

**Arguments**:

- `llm` _BaseChatModel_ - The language model used for argument parsing.
- `context` _str_ - The context for argument generation.
- `agent` _VerifierAgent_ - The agent using the parser model.

#### invoke

```python
def invoke(state: MessagesState) -> dict[str, Any]
```

Invoke the model with the given message state.

**Arguments**:

- `state` _MessagesState_ - The current state of the conversation.
  

**Returns**:

  dict[str, Any]: The response after invoking the model.
  

**Raises**:

- `InvalidWorkflowStateError` - If the agent&#x27;s tool is not available.

## ToolCallingModel Objects

```python
class ToolCallingModel()
```

Model to call the tool with the verified arguments.

#### \_\_init\_\_

```python
def __init__(llm: BaseChatModel, context: str, tools: list[StructuredTool],
             agent: VerifierAgent) -> None
```

Initialize the model.

**Arguments**:

- `llm` _BaseChatModel_ - The language model used for argument parsing.
- `context` _str_ - The context for argument generation.
- `agent` _VerifierAgent_ - The agent using the parser model.
- `tools` _list[StructuredTool]_ - The tools to pass to the model.

#### invoke

```python
def invoke(state: MessagesState) -> dict[str, Any]
```

Invoke the model with the given message state.

**Arguments**:

- `state` _MessagesState_ - The current state of the conversation.
  

**Returns**:

  dict[str, Any]: The response after invoking the model.
  

**Raises**:

- `InvalidWorkflowStateError` - If the agent&#x27;s tool is not available.

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

#### \_\_init\_\_

```python
def __init__(step: Step,
             workflow: Workflow,
             config: Config,
             tool: Tool | None = None) -> None
```

Initialize the agent.

**Arguments**:

- `step` _Step_ - The current step in the task plan.
- `workflow` _Workflow_ - The workflow that defines the task execution process.
- `config` _Config_ - The configuration settings for the agent.
- `tool` _Tool | None_ - The tool to be used for the task (optional).

#### clarifications\_or\_continue

```python
def clarifications_or_continue(
        state: MessagesState) -> Literal[AgentNode.TOOL_AGENT, END]
```

Determine if we should continue with the tool call or request clarifications instead.

**Arguments**:

- `state` _MessagesState_ - The current state of the conversation.
  

**Returns**:

  Literal[AgentNode.TOOL_AGENT, END]: The next node we should route to.

#### get\_last\_resolved\_clarification

```python
def get_last_resolved_clarification(arg_name: str) -> Clarification | None
```

Return the last argument clarification that matches the given arg_name.

**Arguments**:

- `arg_name` _str_ - The name of the argument to match clarifications for
  

**Returns**:

  Clarification | None: The matched clarification

#### execute\_sync

```python
def execute_sync() -> Output
```

Run the core execution logic of the task.

This method will invoke the tool with arguments that are parsed and verified first.

**Returns**:

- `Output` - The result of the agent&#x27;s execution, containing the tool call result.

