---
sidebar_label: mcp_session
title: portia.mcp_session
---

Configuration and client code for interactions with Model Context Protocol (MCP) servers.

This module provides a context manager for creating MCP ClientSessions, which are used to
interact with MCP servers. It supports SSE, stdio, and StreamableHTTP transports.

NB. The MCP Python SDK is asynchronous, so care must be taken when using MCP functionality
from this module in an async context.

Classes:
    SseMcpClientConfig: Configuration for an MCP client that connects via SSE.
    StdioMcpClientConfig: Configuration for an MCP client that connects via stdio.
    StreamableHttpMcpClientConfig: Configuration for an MCP client that connects via StreamableHTTP.
    McpClientConfig: The configuration to connect to an MCP server.

## SseMcpClientConfig Objects

```python
class SseMcpClientConfig(BaseModel)
```

Configuration for an MCP client that connects via SSE.

## StdioMcpClientConfig Objects

```python
class StdioMcpClientConfig(BaseModel)
```

Configuration for an MCP client that connects via stdio.

## StreamableHttpMcpClientConfig Objects

```python
class StreamableHttpMcpClientConfig(BaseModel)
```

Configuration for an MCP client that connects via StreamableHTTP.

#### get\_mcp\_session

```python
@asynccontextmanager
async def get_mcp_session(
        mcp_client_config: McpClientConfig) -> AsyncIterator[ClientSession]
```

Context manager for an MCP ClientSession.

**Arguments**:

- `mcp_client_config` - The configuration to connect to an MCP server
  

**Returns**:

  An MCP ClientSession

