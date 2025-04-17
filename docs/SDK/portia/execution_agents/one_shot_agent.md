---
sidebar_label: one_shot_agent
title: portia.execution_agents.one_shot_agent
---

A simple OneShotAgent optimized for simple tool calling tasks.

This agent invokes the OneShotToolCallingModel up to four times, but each individual
attempt is a one-shot call. It is useful when the tool call is simple, minimizing cost.
However, for more complex tool calls, the DefaultExecutionAgent is recommended as it will
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

It is recommended to use the DefaultExecutionAgent for more complex tasks.

**Arguments**:

- `model` _GenerativeModel_ - The language model to use for generating responses.
- `context` _str_ - The context to provide to the language model when generating a response.
- `tools` _list[StructuredTool]_ - A list of tools that can be used during the task.
- `agent` _OneShotAgent_ - The agent responsible for managing the task.
  

**Methods**:

- `invoke(MessagesState)` - Invokes the LLM to generate a response based on the query, context,
  and past errors.

#### \_\_init\_\_

```python
def __init__(model: GenerativeModel, context: str, tools: list[StructuredTool],
             agent: OneShotAgent) -> None
```

Initialize the OneShotToolCallingModel.

**Arguments**:

- `model` _GenerativeModel_ - The language model to use for generating responses.
- `context` _str_ - The context to be used when generating the response.
- `tools` _list[StructuredTool]_ - A list of tools that can be used during the task.
- `agent` _OneShotAgent_ - The agent that is managing the task.

#### invoke

```python
def invoke(state: MessagesState) -> dict[str, Any]
```

Invoke the model with the given message state.

This method formats the input for the language model using the query, context,
and past errors, then generates a response by invoking the model.

**Arguments**:

- `state` _MessagesState_ - The state containing the messages and other necessary data.
  

**Returns**:

  dict[str, Any]: A dictionary containing the model&#x27;s generated response.

## OneShotAgent Objects

```python
class OneShotAgent(BaseExecutionAgent)
```

Agent responsible for achieving a task by using langgraph.

This agent performs the following steps:
1. Calls the tool with unverified arguments.
2. Retries tool calls up to 4 times.

**Arguments**:

- `step` _Step_ - The current step in the task plan.
- `plan_run` _PlanRun_ - The run that defines the task execution process.
- `config` _Config_ - The configuration settings for the agent.
- `tool` _Tool | None_ - The tool to be used for the task (optional).
  

**Methods**:

- `execute_sync()` - Executes the core logic of the agent&#x27;s task, using the provided tool

#### \_\_init\_\_

```python
def __init__(step: Step,
             plan_run: PlanRun,
             config: Config,
             agent_memory: AgentMemory,
             tool: Tool | None = None) -> None
```

Initialize the OneShotAgent.

**Arguments**:

- `step` _Step_ - The current step in the task plan.
- `plan_run` _PlanRun_ - The run that defines the task execution process.
- `config` _Config_ - The configuration settings for the agent.
- `agent_memory` _AgentMemory_ - Not supported in this execution agent.
- `tool` _Tool | None_ - The tool to be used for the task (optional).

#### execute\_sync

```python
def execute_sync() -> Output
```

Run the core execution logic of the task.

This method will invoke the tool with arguments

**Returns**:

- `Output` - The result of the agent&#x27;s execution, containing the tool call result.

