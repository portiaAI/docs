---
sidebar_label: base_agent
title: portia.agents.base_agent
---

Agents are responsible for executing steps of a workflow.

The BaseAgent class is the base class that all agents must extend.

## BaseAgent Objects

```python
class BaseAgent()
```

An Agent is responsible for carrying out the task defined in the given Step.

This Base agent is the class all agents must extend. Critically, agents must implement the
execute_sync function which is responsible for actually carrying out the task as given in
the step. They have access to copies of the step, workflow, and config but changes to those
objects are forbidden.

Optionally, new agents may also override the get_context function, which is responsible for
the system context for the agent. This should be done with thought, as the details of the system
context are critically important for LLM performance.

#### \_\_init\_\_

```python
def __init__(step: Step,
             workflow: Workflow,
             config: Config,
             tool: Tool | None = None) -> None
```

Initialize the base agent with the given args.

Importantly, the models here are frozen copies of those used in the Runner.
They are meant as read-only references, useful for execution of the task
but cannot be edited. The agent should return output via the response
of the execute_sync method.

**Arguments**:

- `step` _Step_ - The step that defines the task to be executed.
- `workflow` _Workflow_ - The workflow that contains the step and related data.
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

Build a generic system context string from the step and workflow provided.

This function retrieves the execution context and generates a system context
based on the step and workflow provided to the agent.

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

