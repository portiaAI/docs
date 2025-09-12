---
sidebar_label: default_execution_agent
title: portia.execution_agents.default_execution_agent
---

The Default execution agent for hardest problems.

This agent uses multiple models (verifier, parser etc) to achieve the highest accuracy
in completing tasks.

## ExecutionState Objects

```python
class ExecutionState(MessagesState)
```

State for the execution agent.

## ToolArgument Objects

```python
class ToolArgument(BaseModel)
```

Represents an argument for a tool as extracted from the goal and context.

**Attributes**:

- `name` _str_ - The name of the argument, as requested by the tool.
- `explanation` _str_ - Explanation of the source for the value of the argument.
- `value` _Any | None_ - The value of the argument, as provided in the goal or context.
- `valid` _bool_ - Whether the value is a valid type and/or format for the given argument.

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

- `model` _Model_ - The language model used for argument parsing.
- `context` _str_ - The context for argument generation.
- `agent` _DefaultExecutionAgent_ - The agent using the parser model.
  

**Attributes**:

- `arg_parser_prompt` _ChatPromptTemplate_ - The prompt template for argument parsing.
- `model` _Model_ - The language model used.
- `context` _str_ - The context for argument generation.
- `agent` _DefaultExecutionAgent_ - The agent using the parser model.
- `previous_errors` _list[str]_ - A list of previous errors encountered during parsing.
- `retries` _int_ - The number of retries attempted for parsing.

#### \_\_init\_\_

```python
def __init__(model: GenerativeModel, agent: DefaultExecutionAgent,
             tool_context: ToolRunContext) -> None
```

Initialize the model.

**Arguments**:

- `model` _Model_ - The language model used for argument parsing.
- `agent` _DefaultExecutionAgent_ - The agent using the parser model.
- `tool_context` _ToolRunContext_ - The context for the tool.

#### invoke

```python
def invoke(state: ExecutionState) -> dict[str, Any]
```

Invoke the model with the given message state.

**Arguments**:

- `state` _ExecutionState_ - The current state of the conversation.
  

**Returns**:

  dict[str, Any]: The response after invoking the model.
  

**Raises**:

- `InvalidRunStateError` - If the agent&#x27;s tool is not available.

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
- `model` _Model_ - The model used to invoke the verification process.
- `agent` _DefaultExecutionAgent_ - The agent responsible for handling the verification process.

#### \_\_init\_\_

```python
def __init__(model: GenerativeModel, agent: DefaultExecutionAgent,
             tool_context: ToolRunContext) -> None
```

Initialize the model.

**Arguments**:

- `model` _Model_ - The model used for argument verification.
- `context` _str_ - The context for argument generation.
- `agent` _DefaultExecutionAgent_ - The agent using the verifier model.
- `tool_context` _ToolRunContext_ - The context for the tool.

#### invoke

```python
def invoke(state: ExecutionState) -> dict[str, Any]
```

Invoke the model with the given message state.

**Arguments**:

- `state` _ExecutionState_ - The current state of the conversation.
  

**Returns**:

  dict[str, Any]: The response after invoking the model.
  

**Raises**:

- `InvalidRunStateError` - If the agent&#x27;s tool is not available.

## ToolCallingModel Objects

```python
class ToolCallingModel()
```

Model to call the tool with the verified arguments.

#### \_\_init\_\_

```python
def __init__(model: GenerativeModel, tools: list[StructuredTool],
             agent: DefaultExecutionAgent) -> None
```

Initialize the model.

**Arguments**:

- `model` _GenerativeModel_ - The language model used for argument parsing.
- `agent` _DefaultExecutionAgent_ - The agent using the parser model.
- `tools` _list[StructuredTool]_ - The tools to pass to the model.

#### invoke

```python
def invoke(state: ExecutionState) -> dict[str, Any]
```

Invoke the model with the given message state.

**Arguments**:

- `state` _ExecutionState_ - The current state of the conversation.
  

**Returns**:

  dict[str, Any]: The response after invoking the model.
  

**Raises**:

- `InvalidRunStateError` - If the agent&#x27;s tool is not available.

## DefaultExecutionAgent Objects

```python
class DefaultExecutionAgent(BaseExecutionAgent)
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
def __init__(plan: Plan,
             plan_run: PlanRun,
             config: Config,
             agent_memory: AgentMemory,
             end_user: EndUser,
             tool: Tool | None = None,
             execution_hooks: ExecutionHooks | None = None,
             model: GenerativeModel | str | None = None) -> None
```

Initialize the agent.

**Arguments**:

- `plan` _Plan_ - The plan containing the steps.
- `plan_run` _PlanRun_ - The run that defines the task execution process.
- `config` _Config_ - The configuration settings for the agent.
- `agent_memory` _AgentMemory_ - The agent memory to be used for the task.
- `end_user` _EndUser_ - The end user for this execution
- `tool` _Tool | None_ - The tool to be used for the task (optional).
- `execution_hooks` _ExecutionHooks | None_ - The execution hooks for the agent.
- `model` _GenerativeModel | str | None_ - The model to use for the agent.

#### clarifications\_or\_continue

```python
def clarifications_or_continue(
        state: ExecutionState) -> Literal[AgentNode.TOOL_AGENT, END]
```

Determine if we should continue with the tool call or request clarifications instead.

**Arguments**:

- `state` _ExecutionState_ - The current state of the conversation.
  

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

