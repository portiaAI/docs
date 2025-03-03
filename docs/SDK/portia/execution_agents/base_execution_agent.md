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
def __init__(step: Step,
             plan_run: PlanRun,
             config: Config,
             tool: Tool | None = None) -> None
```

Initialize the base agent with the given args.

Importantly, the models here are frozen copies of those used by the Portia instance.
They are meant as read-only references, useful for execution of the task
but cannot be edited. The agent should return output via the response
of the execute_sync method.

**Arguments**:

- `step` _Step_ - The step that defines the task to be executed.
- `plan_run` _PlanRun_ - The run that contains the step and related data.
- `config` _Config_ - The configuration settings for the agent.
- `tool` _Tool | None_ - An optional tool associated with the agent (default is None).

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

#### get\_system\_context

```python
def get_system_context() -> str
```

Build a generic system context string from the step and run provided.

This function retrieves the execution context and generates a system context
based on the step and run provided to the agent.

**Returns**:

- `str` - A string containing the system context for the agent.

## Output Objects

```python
class Output(BaseModel, Generic[SERIALIZABLE_TYPE_VAR])
```

Output of a tool with a wrapper for data, summaries, and LLM interpretation.

This class contains a generic value `T` bound to `Serializable`.

**Attributes**:

- `value` _SERIALIZABLE_TYPE_VAR | None_ - The output of the tool.
- `summary` _str | None_ - A textual summary of the output. Not all tools generate summaries.

#### serialize\_value

```python
@field_serializer("value")
def serialize_value(value: SERIALIZABLE_TYPE_VAR | None) -> str
```

Serialize the value to a string.

**Arguments**:

- `value` _SERIALIZABLE_TYPE_VAR | None_ - The value to serialize.
  

**Returns**:

- `str` - The serialized value as a string.

