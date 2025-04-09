---
sidebar_label: output
title: portia.execution_agents.output
---

Outputs from a plan run step.

These are stored and can be used as inputs to future steps

## BaseOutput Objects

```python
class BaseOutput(BaseModel, Generic[SERIALIZABLE_TYPE_VAR])
```

Base interface for concrete output classes to implement.

#### get\_value

```python
@abstractmethod
def get_value() -> Serializable | None
```

Return the value of the output.

This should not be so long that it is an issue for LLM prompts.

#### serialize\_value

```python
@abstractmethod
def serialize_value() -> str
```

Serialize the value to a string.

#### full\_value

```python
@abstractmethod
def full_value(agent_memory: AgentMemory) -> Serializable | None
```

Get the full value, fetching from remote storage or file if necessary.

This value may be long and so is not suitable for use in LLM prompts.

#### get\_summary

```python
@abstractmethod
def get_summary() -> str | None
```

Return the summary of the output.

## LocalOutput Objects

```python
class LocalOutput(BaseOutput, Generic[SERIALIZABLE_TYPE_VAR])
```

Output that is stored locally.

#### get\_value

```python
def get_value() -> Serializable | None
```

Get the value of the output.

#### serialize\_value

```python
def serialize_value() -> str
```

Serialize the value to a string.

#### full\_value

```python
def full_value(agent_memory: AgentMemory) -> Serializable | None
```

Return the full value.

As the value is stored locally, this is the same as get_value() for this type of output.

#### get\_summary

```python
def get_summary() -> str | None
```

Return the summary of the output.

#### serialize\_value\_field

```python
@field_serializer("value")
def serialize_value_field(value: Serializable | None) -> str
```

Serialize the value to a string.

**Arguments**:

- `value` _SERIALIZABLE_TYPE_VAR | None_ - The value to serialize.
  

**Returns**:

- `str` - The serialized value as a string.

## AgentMemoryOutput Objects

```python
class AgentMemoryOutput(BaseOutput, Generic[SERIALIZABLE_TYPE_VAR])
```

Output that is stored in agent memory.

#### get\_value

```python
def get_value() -> Serializable | None
```

Return the summary of the output as the value is too large to be retained locally.

#### serialize\_value

```python
def serialize_value() -> str
```

Serialize the value to a string.

We use the summary as the value is too large to be retained locally.

#### full\_value

```python
def full_value(agent_memory: AgentMemory) -> Serializable | None
```

Get the full value, fetching from remote storage or file if necessary.

#### get\_summary

```python
def get_summary() -> str
```

Return the summary of the output.

