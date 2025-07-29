---
sidebar_label: base_execution_agent
title: portia.execution_agents.base_execution_agent
---

Agents are responsible for executing steps of a PlanRun.

The BaseAgent class is the base class that all agents must extend.

## BaseExecutionAgent Objects

```python
class BaseExecutionAgent()
```

An ExecutionAgent is responsible for carrying out the task defined in the given Step.

This BaseExecutionAgent is the class all ExecutionAgents must extend. Critically,
ExecutionAgents must implement the execute_sync function which is responsible for
actually carrying out the task as given in the step. They have access to copies of the
step, plan_run and config but changes to those objects are forbidden.

Optionally, new execution agents may also override the get_context function, which is
responsible for building the system context for the agent. This should be done with
thought, as the details of the system context are critically important for LLM
performance.

#### \_\_init\_\_

```python
def __init__(plan: Plan,
             plan_run: PlanRun,
             config: Config,
             end_user: EndUser,
             agent_memory: AgentMemory,
             tool: Tool | None = None,
             execution_hooks: ExecutionHooks | None = None) -> None
```

Initialize the base agent with the given args.

Importantly, the models here are frozen copies of those used by the Portia instance.
They are meant as read-only references, useful for execution of the task
but cannot be edited. The agent should return output via the response
of the execute_sync method.

**Arguments**:

- `plan` _Plan_ - The plan containing the steps.
- `plan_run` _PlanRun_ - The run that contains the step and related data.
- `config` _Config_ - The configuration settings for the agent.
- `end_user` _EndUser_ - The end user for the execution.
- `agent_memory` _AgentMemory_ - The agent memory for persisting outputs.
- `tool` _Tool | None_ - An optional tool associated with the agent (default is None).
- `execution_hooks` - Optional hooks for extending execution functionality.

#### step

```python
@property
def step() -> Step
```

Get the current step from the plan.

#### execute\_sync

```python
@abstractmethod
def execute_sync() -> Output
```

Run the core execution logic of the task synchronously.

Implementation of this function is deferred to individual agent implementations,
making it simple to write new ones.

**Returns**:

- `Output` - The output of the task execution.

#### execute\_async

```python
async def execute_async() -> Output
```

Run the core execution logic of the task asynchronously.

Implementation of this function is deferred to individual agent implementations,
making it simple to write new ones. If not implemented, the agent will return a threaded
version of the execute_sync method.

**Returns**:

- `Output` - The output of the task execution.

#### get\_system\_context

```python
def get_system_context(ctx: ToolRunContext,
                       step_inputs: list[StepInput]) -> str
```

Build a generic system context string from the step and run provided.

This function retrieves the execution context and generates a system context
based on the step and run provided to the agent.

**Arguments**:

- `ctx` _ToolRunContext_ - The tool run ctx.
- `step_inputs` _list[StepInput]_ - The inputs for the step.
  

**Returns**:

- `str` - A string containing the system context for the agent.

#### next\_state\_after\_tool\_call

```python
def next_state_after_tool_call(
    config: Config,
    state: MessagesState,
    tool: Tool | None = None
) -> Literal[AgentNode.TOOL_AGENT, AgentNode.SUMMARIZER, END]
```

Determine the next state after a tool call.

This function checks the state after a tool call to determine if the run
should proceed to the tool agent again, to the summarizer, or end.

**Arguments**:

- `config` _Config_ - The configuration for the run.
- `state` _MessagesState_ - The current state of the messages.
- `tool` _Tool | None_ - The tool involved in the call, if any.
  

**Returns**:

  Literal[AgentNode.TOOL_AGENT, AgentNode.SUMMARIZER, END]: The next state to transition
  to.
  

**Raises**:

- `ToolRetryError` - If the tool has an error and the maximum retry limit has not been
  reached.

