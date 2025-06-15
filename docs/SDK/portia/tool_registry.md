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
    MCPToolRegistry: A tool registry that interacts with a locally running MCP server.

## ToolRegistry Objects

```python
class ToolRegistry()
```

ToolRegistry is the base class for managing tools.

This class implements the essential methods for interacting with tool registries, including
registering, retrieving, and listing tools. Specific tool registries can override these methods
and provide additional functionality.

**Methods**:

- `with_tool(tool` - Tool, *, overwrite: bool = False) -&gt; None:
  Inserts a new tool.
- `replace_tool(tool` - Tool) -&gt; None:
  Replaces a tool with a new tool.
  NB. This is a shortcut for `with_tool(tool, overwrite=True)`.
- `get_tool(tool_id` - str) -&gt; Tool:
  Retrieves a tool by its ID.
  get_tools() -&gt; list[Tool]:
  Retrieves all tools in the registry.
- `match_tools(query` - str | None = None, tool_ids: list[str] | None = None) -&gt; list[Tool]:
  Optionally, retrieve tools that match a given query and tool_ids. Useful to implement
  tool filtering.

#### \_\_init\_\_

```python
def __init__(tools: dict[str, Tool] | Sequence[Tool] | None = None) -> None
```

Initialize the tool registry with a sequence or dictionary of tools.

**Arguments**:

- `tools` _dict[str, Tool] | Sequence[Tool]_ - A sequence of tools or a
  dictionary of tool IDs to tools.

#### with\_tool

```python
def with_tool(tool: Tool, *, overwrite: bool = False) -> None
```

Update a tool based on tool ID or inserts a new tool.

**Arguments**:

- `tool` _Tool_ - The tool to be added or updated.
- `overwrite` _bool_ - Whether to overwrite an existing tool with the same ID.
  

**Returns**:

- `None` - The tool registry is updated in place.

#### replace\_tool

```python
def replace_tool(tool: Tool) -> None
```

Replace a tool with a new tool.

**Arguments**:

- `tool` _Tool_ - The tool to replace the existing tool with.
  

**Returns**:

- `None` - The tool registry is updated in place.

#### get\_tool

```python
def get_tool(tool_id: str) -> Tool
```

Retrieve a tool&#x27;s information.

**Arguments**:

- `tool_id` _str_ - The ID of the tool to retrieve.
  

**Returns**:

- `Tool` - The requested tool.
  

**Raises**:

- `ToolNotFoundError` - If the tool with the given ID does not exist.

#### get\_tools

```python
def get_tools() -> list[Tool]
```

Get all tools registered with the registry.

**Returns**:

- `list[Tool]` - A list of all tools in the registry.

#### match\_tools

```python
def match_tools(query: str | None = None,
                tool_ids: list[str] | None = None) -> list[Tool]
```

Provide a set of tools that match a given query and tool_ids.

**Arguments**:

- `query` _str | None_ - The query to match tools against.
- `tool_ids` _list[str] | None_ - The list of tool ids to match.
  

**Returns**:

- `list[Tool]` - A list of tools matching the query.
  
  This method is useful to implement tool filtering whereby only a selection of tools are
  passed to the PlanningAgent based on the query.
  This method is optional to implement and will default to providing all tools.

#### filter\_tools

```python
def filter_tools(predicate: Callable[[Tool], bool]) -> ToolRegistry
```

Filter the tools in the registry based on a predicate.

**Arguments**:

- `predicate` _Callable[[Tool], bool]_ - A predicate to filter the tools.
  

**Returns**:

- `Self` - A new ToolRegistry with the filtered tools.

#### \_\_add\_\_

```python
def __add__(other: ToolRegistry | list[Tool]) -> ToolRegistry
```

Return an aggregated tool registry combining two registries or a registry and tool list.

Tool IDs must be unique across the two registries otherwise an error will be thrown.

**Arguments**:

- `other` _ToolRegistry_ - Another tool registry to be combined.
  

**Returns**:

- `AggregatedToolRegistry` - A new tool registry containing tools from both registries.

#### \_\_radd\_\_

```python
def __radd__(other: ToolRegistry | list[Tool]) -> ToolRegistry
```

Return an aggregated tool registry combining two registries or a registry and tool list.

Tool IDs must be unique across the two registries otherwise an error will be thrown.

**Arguments**:

- `other` _ToolRegistry_ - Another tool registry to be combined.
  

**Returns**:

- `ToolRegistry` - A new tool registry containing tools from both registries.

## InMemoryToolRegistry Objects

```python
class InMemoryToolRegistry(ToolRegistry)
```

Provides a simple in-memory tool registry.

This class stores tools in memory, allowing for quick access without persistence.

Warning: This registry is DEPRECATED. Use ToolRegistry instead.

#### from\_local\_tools

```python
@classmethod
def from_local_tools(cls, tools: Sequence[Tool]) -> InMemoryToolRegistry
```

Easily create a local tool registry from a sequence of tools.

**Arguments**:

- `tools` _Sequence[Tool]_ - A sequence of tools to initialize the registry.
  

**Returns**:

- `InMemoryToolRegistry` - A new in-memory tool registry.

## PortiaToolRegistry Objects

```python
class PortiaToolRegistry(ToolRegistry)
```

Provides access to Portia tools.

This class interacts with the Portia API to retrieve and manage tools.

#### \_\_init\_\_

```python
def __init__(config: Config | None = None,
             client: httpx.Client | None = None,
             tools: dict[str, Tool] | Sequence[Tool] | None = None) -> None
```

Initialize the PortiaToolRegistry with the given configuration.

**Arguments**:

- `config` _Config | None_ - The configuration containing the API key and endpoint.
- `client` _httpx.Client | None_ - An optional httpx client to use. If not provided, a new
  client will be created.
- `tools` _dict[str, Tool] | None_ - A dictionary of tool IDs to tools to create the
  registry with. If not provided, all tools will be loaded from the Portia API.

#### with\_default\_tool\_filter

```python
def with_default_tool_filter() -> PortiaToolRegistry
```

Create a PortiaToolRegistry with a default tool filter.

## McpToolRegistry Objects

```python
class McpToolRegistry(ToolRegistry)
```

Provides access to tools within a Model Context Protocol (MCP) server.

See https://modelcontextprotocol.io/introduction for more information on MCP.

#### from\_sse\_connection

```python
@classmethod
def from_sse_connection(cls,
                        server_name: str,
                        url: str,
                        headers: dict[str, Any] | None = None,
                        timeout: float = 5,
                        sse_read_timeout: float = 60 * 5) -> McpToolRegistry
```

Create a new MCPToolRegistry using an SSE connection (Sync version).

#### from\_sse\_connection\_async

```python
@classmethod
async def from_sse_connection_async(
        cls,
        server_name: str,
        url: str,
        headers: dict[str, Any] | None = None,
        timeout: float = 5,
        sse_read_timeout: float = 60 * 5) -> McpToolRegistry
```

Create a new MCPToolRegistry using an SSE connection (Async version).

#### from\_stdio\_connection

```python
@classmethod
def from_stdio_connection(
    cls,
    server_name: str,
    command: str,
    args: list[str] | None = None,
    env: dict[str, str] | None = None,
    encoding: str = "utf-8",
    encoding_error_handler: Literal["strict", "ignore", "replace"] = "strict"
) -> McpToolRegistry
```

Create a new MCPToolRegistry using a stdio connection (Sync version).

#### from\_stdio\_connection\_async

```python
@classmethod
async def from_stdio_connection_async(
    cls,
    server_name: str,
    command: str,
    args: list[str] | None = None,
    env: dict[str, str] | None = None,
    encoding: str = "utf-8",
    encoding_error_handler: Literal["strict", "ignore", "replace"] = "strict"
) -> McpToolRegistry
```

Create a new MCPToolRegistry using a stdio connection (Async version).

#### from\_streamable\_http\_connection

```python
@classmethod
def from_streamable_http_connection(
        cls,
        server_name: str,
        url: str,
        headers: dict[str, Any] | None = None,
        timeout: float = 30,
        sse_read_timeout: float = 60 * 5,
        *,
        terminate_on_close: bool = True,
        auth: httpx.Auth | None = None) -> McpToolRegistry
```

Create a new MCPToolRegistry using a StreamableHTTP connection (Sync version).

#### from\_streamable\_http\_connection\_async

```python
@classmethod
async def from_streamable_http_connection_async(
        cls,
        server_name: str,
        url: str,
        headers: dict[str, Any] | None = None,
        timeout: float = 30,
        sse_read_timeout: float = 60 * 5,
        *,
        terminate_on_close: bool = True,
        auth: httpx.Auth | None = None) -> McpToolRegistry
```

Create a new MCPToolRegistry using a StreamableHTTP connection (Async version).

## DefaultToolRegistry Objects

```python
class DefaultToolRegistry(ToolRegistry)
```

A registry providing a default set of tools.

This includes the following tools:
- All open source tools that don&#x27;t require API keys
- Search tool if you have a Tavily API key
- Weather tool if you have an OpenWeatherMap API key
- Portia cloud tools if you have a Portia cloud API key

#### \_\_init\_\_

```python
def __init__(config: Config) -> None
```

Initialize the default tool registry with the given configuration.

## GeneratedBaseModel Objects

```python
class GeneratedBaseModel(BaseModel)
```

BaseModel that is generated from a JSON schema.

Handles serialization of fields that must omit None values: fields that are not required in
the JSON schema, but that are not nullable. Pydantic has no concept of an omissible field,
so we must for it to be nullable and then make sure we don&#x27;t serialize None values.

#### \_\_init\_subclass\_\_

```python
def __init_subclass__(cls) -> None
```

Ensure omissible fields are isolated between models.

#### serialize

```python
@model_serializer(mode="wrap")
def serialize(handler: SerializerFunctionWrapHandler) -> dict[str, Any]
```

Serialize the model to a dictionary, excluding fields for which we must omit None.

#### extend\_exclude\_unset\_fields

```python
@classmethod
def extend_exclude_unset_fields(cls, fields: list[str]) -> None
```

Extend the list of fields to exclude from serialization.

#### generate\_pydantic\_model\_from\_json\_schema

```python
def generate_pydantic_model_from_json_schema(
        model_name: str, json_schema: dict[str, Any]) -> type[BaseModel]
```

Generate a Pydantic model based on a JSON schema.

**Arguments**:

- `model_name` _str_ - The name of the Pydantic model.
- `json_schema` _dict[str, Any]_ - The schema to generate the model from.
  

**Returns**:

- `type[BaseModel]` - The generated Pydantic model class.

