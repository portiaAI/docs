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
class ToolRegistry(ABC)
```

ToolRegistry is the base interface for managing tools.

This class defines the essential methods for interacting with tool registries, including
registering, retrieving, and listing tools. Specific tool registries should implement these
methods.

**Methods**:

- `register_tool(tool` - Tool) -&gt; None:
  Registers a new tool in the registry.
- `get_tool(tool_id` - str) -&gt; Tool:
  Retrieves a tool by its ID.
  get_tools() -&gt; list[Tool]:
  Retrieves all tools in the registry.
- `match_tools(query` - str | None = None, tool_ids: list[str] | None = None) -&gt; list[Tool]:
  Optionally, retrieve tools that match a given query and tool_ids. Useful to implement
  tool filtering.

#### register\_tool

```python
@abstractmethod
def register_tool(tool: Tool) -> None
```

Register a new tool.

**Arguments**:

- `tool` _Tool_ - The tool to be registered.

#### get\_tool

```python
@abstractmethod
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
@abstractmethod
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

- `AggregatedToolRegistry` - A new tool registry containing tools from both registries.

## AggregatedToolRegistry Objects

```python
class AggregatedToolRegistry(ToolRegistry)
```

An interface over a set of tool registries.

This class aggregates multiple tool registries, allowing the user to retrieve tools from
any of the registries in the collection.

#### \_\_init\_\_

```python
def __init__(registries: list[ToolRegistry]) -> None
```

Initialize the aggregated tool registry with a list of registries.

**Arguments**:

- `registries` _list[ToolRegistry]_ - A list of tool registries to aggregate.

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

**Arguments**:

- `tool_id` _str_ - The ID of the tool to retrieve.
  

**Returns**:

- `Tool` - The requested tool.
  

**Raises**:

- `ToolNotFoundError` - If the tool with the given ID does not exist in any registry.

#### get\_tools

```python
def get_tools() -> list[Tool]
```

Get all tools from all registries.

**Returns**:

- `list[Tool]` - A list of all tools across all registries.

#### match\_tools

```python
def match_tools(query: str | None = None,
                tool_ids: list[str] | None = None) -> list[Tool]
```

Get all tools from all registries that match the query and tool_ids.

**Arguments**:

- `query` _str | None_ - The query to match tools against.
- `tool_ids` _list[str] | None_ - The list of tool ids to match.
  

**Returns**:

- `list[Tool]` - A list of tools matching the query from all registries.

## InMemoryToolRegistry Objects

```python
class InMemoryToolRegistry(ToolRegistry)
```

Provides a simple in-memory tool registry.

This class stores tools in memory, allowing for quick access without persistence.

#### \_\_init\_\_

```python
def __init__() -> None
```

Initialize the registry with an empty list of tools.

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

#### register\_tool

```python
def register_tool(tool: Tool) -> None
```

Register tool in the in-memory registry.

**Arguments**:

- `tool` _Tool_ - The tool to register.
  

**Raises**:

- `DuplicateToolError` - If the tool ID already exists in the registry.

#### get\_tool

```python
def get_tool(tool_id: str) -> Tool
```

Get the tool from the in-memory registry.

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

Get all tools in the in-memory registry.

**Returns**:

- `list[Tool]` - A list of all tools in the registry.

## PortiaToolRegistry Objects

```python
class PortiaToolRegistry(ToolRegistry)
```

Provides access to Portia tools.

This class interacts with the Portia API to retrieve and manage tools.

#### \_\_init\_\_

```python
def __init__(config: Config,
             tools: dict[str, Tool] | None = None,
             client: httpx.Client | None = None) -> None
```

Initialize the PortiaToolRegistry with the given configuration.

**Arguments**:

- `config` _Config_ - The configuration containing the API key and endpoint.
- `tools` _list[Tool] | None_ - A list of tools to create the registry with.
  If not provided, all tools will be loaded from the Portia API.
- `client` _httpx.Client | None_ - An optional httpx client to use. If not provided, a new
  client will be created.

#### with\_default\_tool\_filter

```python
@classmethod
def with_default_tool_filter(cls, config: Config) -> ToolRegistry
```

Create a PortiaToolRegistry with a default tool filter.

#### default\_tool\_filter

```python
@classmethod
def default_tool_filter(cls, tool: Tool) -> bool
```

Filter to get the default set of tools offered by Portia cloud.

#### register\_tool

```python
def register_tool(tool: Tool) -> None
```

Throw not implemented error as registration can&#x27;t be done in this registry.

#### get\_tool

```python
def get_tool(tool_id: str) -> Tool
```

Get the tool from the tool set.

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

Get all tools in the registry.

**Returns**:

- `list[Tool]` - A list of all tools in the registry.

#### filter\_tools

```python
def filter_tools(filter_func: Callable[[Tool], bool]) -> ToolRegistry
```

Return a new registry with the tools filtered by the filter function.

## McpToolRegistry Objects

```python
class McpToolRegistry(ToolRegistry)
```

Provides access to tools within a Model Context Protocol (MCP) server.

See https://modelcontextprotocol.io/introduction for more information on MCP.

#### \_\_init\_\_

```python
def __init__(mcp_client_config: McpClientConfig) -> None
```

Initialize the MCPToolRegistry with the given configuration.

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

Create a new MCPToolRegistry using an SSE connection.

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

Create a new MCPToolRegistry using a stdio connection.

#### register\_tool

```python
def register_tool(tool: Tool) -> None
```

Register a new tool.

**Arguments**:

- `tool` _Tool_ - The tool to be registered.

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

## DefaultToolRegistry Objects

```python
class DefaultToolRegistry(AggregatedToolRegistry)
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

