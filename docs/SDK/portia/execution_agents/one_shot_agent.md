---
sidebar_label: one_shot_agent
title: portia.execution_agents.one_shot_agent
---

A simple OneShotAgent optimized for simple tool calling tasks.

This agent invokes the OneShotToolCallingModel up to four times, but each individual
attempt is a one-shot call. It is useful when the tool call is simple, minimizing cost.
However, for more complex tool calls, the DefaultExecutionAgent is recommended as it will
be more successful than the OneShotAgent.

## ExecutionState Objects

```python
class ExecutionState(MessagesState)
```

State for the execution agent.

## OneShotToolCallingModel Objects

```python
class OneShotToolCallingModel()
```

One-shot model for calling a given tool.

This model directly passes the tool and context to the language model (LLM)
to generate a response. It is suitable for simple tasks where the arguments
are already correctly formatted and complete. This model does not validate
arguments (e.g., it will not catch missing arguments).

It is recommended to use the DefaultExecutionAgent for more complex tasks.

**Arguments**:

- `model` _GenerativeModel_ - The language model to use for generating responses.
- `tools` _list[StructuredTool]_ - A list of tools that can be used during the task.
- `agent` _OneShotAgent_ - The agent responsible for managing the task.
  

**Methods**:

- `invoke(MessagesState)` - Invokes the LLM to generate a response based on the query, context,
  and past errors.

#### \_\_init\_\_

```python
def __init__(model: GenerativeModel, tools: list[StructuredTool],
             agent: OneShotAgent, tool_context: ToolRunContext) -> None
```

Initialize the OneShotToolCallingModel.

**Arguments**:

- `model` _GenerativeModel_ - The language model to use for generating responses.
- `tools` _list[StructuredTool]_ - A list of tools that can be used during the task.
- `agent` _OneShotAgent_ - The agent that is managing the task.
- `tool_context` _ToolRunContext_ - The context for the tool.

#### invoke

```python
def invoke(state: ExecutionState) -> dict[str, Any]
```

Invoke the model with the given message state.

This method formats the input for the language model using the query, context,
and past errors, then generates a response by invoking the model.

**Arguments**:

- `state` _ExecutionState_ - The state containing the messages and other necessary data.
  

**Returns**:

  dict[str, Any]: A dictionary containing the model&#x27;s generated response.

#### ainvoke

```python
async def ainvoke(state: ExecutionState) -> dict[str, Any]
```

Async implementation of invoke.

This method formats the input for the language model using the query, context,
and past errors, then generates a response by invoking the model.

**Arguments**:

- `state` _ExecutionState_ - The state containing the messages and other necessary data.
  

**Returns**:

  dict[str, Any]: A dictionary containing the model&#x27;s generated response.

## OneShotAgent Objects

```python
class OneShotAgent(BaseExecutionAgent)
```

Agent responsible for achieving a task by using langgraph.

This agent performs the following steps:
1. Extracts inputs from agent memory (if applicable)
2. Calls the tool with unverified arguments.
3. Retries tool calls up to 4 times.

**Methods**:

- `execute_sync()` - Executes the core logic of the agent&#x27;s task, using the provided tool

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

Initialize the OneShotAgent.

**Arguments**:

- `plan` _Plan_ - The plan containing the steps.
- `plan_run` _PlanRun_ - The run that defines the task execution process.
- `config` _Config_ - The configuration settings for the agent.
- `agent_memory` _AgentMemory_ - The agent memory for persisting outputs.
- `end_user` _EndUser_ - The end user for the execution.
- `tool` _Tool | None_ - The tool to be used for the task (optional).
- `execution_hooks` _ExecutionHooks | None_ - The execution hooks for the agent.
- `model` _GenerativeModel | str | None_ - The model to use for the agent.

#### execute\_sync

```python
def execute_sync() -> Output
```

Run the core execution logic of the task.

This method will invoke the tool with arguments

**Returns**:

- `Output` - The result of the agent&#x27;s execution, containing the tool call result.

#### execute\_async

```python
async def execute_async() -> Output
```

Run the core execution logic of the task.

This method will invoke the tool with arguments

**Returns**:

- `Output` - The result of the agent&#x27;s execution, containing the tool call result.

