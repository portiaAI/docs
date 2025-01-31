---
sidebar_label: tool_registry
title: portia.tool_registry
---

A ToolRegistry represents a source of tools.

This module defines various implementations of `ToolRegistry`, which is responsible for managing
and interacting with tools. It provides interfaces for registering, retrieving, and listing tools.
The `ToolRegistry` can also support aggregation of multiple registries and searching for tools
based on queries.

Classes:
    ToolRegistry: The base interface for managing tools.
    AggregatedToolRegistry: A registry that aggregates multiple tool registries.
    InMemoryToolRegistry: A simple in-memory implementation of `ToolRegistry`.
    PortiaToolRegistry: A tool registry that interacts with the Portia API to manage tools.

## ToolRegistry Objects

```python
class ToolRegistry(ABC)
```

ToolRegistry is the base interface for managing tools.

This class defines the essential methods for interacting with tool registries, including
registering, retrieving, and listing tools. Specific tool registries should implement these
methods.

Methods:
    register_tool(tool: Tool) -&gt; None:
        Registers a new tool in the registry.
    get_tool(tool_id: str) -&gt; Tool:
        Retrieves a tool by its ID.
    get_tools() -&gt; list[Tool]:
        Retrieves all tools in the registry.
    match_tools(query: str | None = None, tool_ids: list[str] | None = None) -&gt; list[Tool]:
        Optionally, retrieve tools that match a given query and tool_ids. Useful to implement
        tool filtering.

#### register\_tool

```python
@abstractmethod
def register_tool(tool: Tool) -> None
```

Register a new tool.

Args:
    tool (Tool): The tool to be registered.

#### get\_tool

```python
@abstractmethod
def get_tool(tool_id: str) -> Tool
```

Retrieve a tool&#x27;s information.

Args:
    tool_id (str): The ID of the tool to retrieve.

Returns:
    Tool: The requested tool.

Raises:
    ToolNotFoundError: If the tool with the given ID does not exist.

#### get\_tools

```python
@abstractmethod
def get_tools() -> list[Tool]
```

Get all tools registered with the registry.

Returns:
    list[Tool]: A list of all tools in the registry.

#### match\_tools

```python
def match_tools(query: str | None = None,
                tool_ids: list[str] | None = None) -> list[Tool]
```

Provide a set of tools that match a given query and tool_ids.

Args:
    query (str | None): The query to match tools against.
    tool_ids (list[str] | None): The list of tool ids to match.

Returns:
    list[Tool]: A list of tools matching the query.

This method is useful to implement tool filtering whereby only a selection of tools are
passed to the Planner based on the query.
This method is optional to implement and will default to providing all tools.

## AggregatedToolRegistry Objects

```python
class AggregatedToolRegistry(ToolRegistry)
```

An interface over a set of tool registries.

This class aggregates multiple tool registries, allowing the user to retrieve tools from
any of the registries in the collection.

#### register\_tool

```python
def register_tool(tool: Tool) -> None
```

Throw not implemented error as registration should happen in individual registries.

#### get\_tool

```python
def get_tool(tool_id: str) -> Tool
```

Search across all registries for a given tool, returning the first match.

Args:
    tool_id (str): The ID of the tool to retrieve.

Returns:
    Tool: The requested tool.

Raises:
    ToolNotFoundError: If the tool with the given ID does not exist in any registry.

#### get\_tools

```python
def get_tools() -> list[Tool]
```

Get all tools from all registries.

Returns:
    list[Tool]: A list of all tools across all registries.

#### match\_tools

```python
def match_tools(query: str | None = None,
                tool_ids: list[str] | None = None) -> list[Tool]
```

Get all tools from all registries that match the query and tool_ids.

Args:
    query (str | None): The query to match tools against.
    tool_ids (list[str] | None): The list of tool ids to match.

Returns:
    list[Tool]: A list of tools matching the query from all registries.

## InMemoryToolRegistry Objects

```python
class InMemoryToolRegistry(ToolRegistry)
```

Provides a simple in-memory tool registry.

This class stores tools in memory, allowing for quick access without persistence.

#### from\_local\_tools

```python
@classmethod
def from_local_tools(cls, tools: Sequence[Tool]) -> InMemoryToolRegistry
```

Easily create a local tool registry from a sequence of tools.

Args:
    tools (Sequence[Tool]): A sequence of tools to initialize the registry.

Returns:
    InMemoryToolRegistry: A new in-memory tool registry.

#### register\_tool

```python
def register_tool(tool: Tool) -> None
```

Register tool in the in-memory registry.

Args:
    tool (Tool): The tool to register.

Raises:
    DuplicateToolError: If the tool ID already exists in the registry.

#### get\_tool

```python
def get_tool(tool_id: str) -> Tool
```

Get the tool from the in-memory registry.

Args:
    tool_id (str): The ID of the tool to retrieve.

Returns:
    Tool: The requested tool.

Raises:
    ToolNotFoundError: If the tool with the given ID does not exist.

#### get\_tools

```python
def get_tools() -> list[Tool]
```

Get all tools in the in-memory registry.

Returns:
    list[Tool]: A list of all tools in the registry.

## PortiaToolRegistry Objects

```python
class PortiaToolRegistry(ToolRegistry)
```

Provides access to Portia tools.

This class interacts with the Portia API to retrieve and manage tools.

#### register\_tool

```python
def register_tool(tool: Tool) -> None
```

Throw not implemented error as registration can&#x27;t be done in this registry.

#### get\_tool

```python
def get_tool(tool_id: str) -> PortiaRemoteTool
```

Get the tool from the tool set.

Args:
    tool_id (str): The ID of the tool to retrieve.

Returns:
    Tool: The requested tool.

Raises:
    ToolNotFoundError: If the tool with the given ID does not exist.

#### get\_tools

```python
def get_tools() -> list[Tool]
```

Get all tools in the registry.

Returns:
    list[Tool]: A list of all tools in the registry.

