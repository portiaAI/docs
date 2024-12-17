---
sidebar_label: tool_registry
title: portia.tool_registry
---

A ToolRegistry represents a source of tools.

## ToolSet Objects

```python
class ToolSet()
```

ToolSet is a convenience type for a set of Tools.

#### add\_tool

```python
def add_tool(tool: Tool) -> None
```

Add a tool to the set.

#### get\_tool

```python
def get_tool(name: str) -> Tool
```

Get a tool by name.

#### get\_tools

```python
def get_tools() -> list[Tool]
```

Get all tools.

## ToolRegistry Objects

```python
class ToolRegistry(ABC)
```

ToolRegistry is the base interface for managing tools.

#### register\_tool

```python
@abstractmethod
def register_tool(tool: Tool) -> None
```

Register a new tool.

#### get\_tool

```python
@abstractmethod
def get_tool(tool_name: str) -> Tool
```

Retrieve a tool&#x27;s information.

#### get\_tools

```python
@abstractmethod
def get_tools() -> ToolSet
```

Get all tools registered with registry.

#### match\_tools

```python
def match_tools(query: str) -> ToolSet
```

Provide a set of tools that match a given query.

This is optional to implement and will default to provide all tools.

## AggregatedToolRegistry Objects

```python
class AggregatedToolRegistry(ToolRegistry)
```

An interface over a set of tool registries.

#### register\_tool

```python
def register_tool(tool: Tool) -> None
```

Tool registration should happen in individual registries.

#### get\_tool

```python
def get_tool(tool_name: str) -> Tool
```

Search across all registries for a given tool, returning first match.

#### get\_tools

```python
def get_tools() -> ToolSet
```

Get all tools from all registries.

#### match\_tools

```python
def match_tools(query: str) -> ToolSet
```

Get all tools from all registries.

## LocalToolRegistry Objects

```python
class LocalToolRegistry(ToolRegistry)
```

Provides a simple in memory tool registry.

#### from\_local\_tools

```python
@classmethod
def from_local_tools(cls, tools: Sequence[Tool]) -> LocalToolRegistry
```

Easily create a local tool registry.

#### register\_tool

```python
def register_tool(tool: Tool) -> None
```

Register tool in registry.

#### get\_tool

```python
def get_tool(tool_name: str) -> Tool
```

Get the tool from the registry.

#### get\_tools

```python
def get_tools() -> ToolSet
```

Get all tools.

