---
sidebar_label: tool
title: portia.tool
---

Tools module.

This module defines an abstract base class for tools, providing a structure for creating custom
tools that can integrate with external systems. It includes an implementation of a base `Tool` class
that defines common attributes and behaviors, such as a unique ID and name. Child classes should
implement the `run` method to define the specific logic for interacting with the external systems
or performing actions.

The module also contains `PortiaRemoteTool`, a subclass of `Tool`, which implements the logic to
interact with Portia Cloud, including handling API responses and tool errors.

The tools in this module are designed to be extendable, allowing users to create their own tools
while relying on common functionality provided by the base class.

## ToolRunContext Objects

```python
class ToolRunContext(BaseModel)
```

Context passed to tools when running.

**Attributes**:

- `plan_run(PlanRun)` - The run the tool run is part of.
- `plan(Plan)` - The plan the tool run is part of.
- `config(Config)` - The config for the SDK as a whole.
- `clarifications(ClarificationListType)` - Relevant clarifications for this tool plan_run.

## ReadyResponse Objects

```python
class ReadyResponse(BaseModel)
```

Response from the /ready endpoint.

## Tool Objects

```python
class Tool(BaseModel, Generic[SERIALIZABLE_TYPE_VAR])
```

Abstract base class for a tool.

This class serves as the blueprint for all tools. Child classes must implement the `run` method.

**Attributes**:

- `id` _str_ - A unique identifier for the tool.
  This must be unique as collisions in a tool registry will lead to errors.
- `name` _str_ - The name of the tool. The name is informational only but useful for debugging.
- `description` _str_ - Purpose of the tool and usage.
  This is important information for the planning_agent module to know when and
  how to use this tool.
- `args_schema` _type[BaseModel]_ - The schema defining the expected input arguments for the tool.
  We use Pydantic models to define these types.
- `output_schema` _tuple[str, str]_ - A tuple containing the type and description of the tool&#x27;s
  output. To maximize the advantages of using an agentic approach this doesn&#x27;t need to be
  tightly defined. Instead it should give just a high level overview of the type and
  contents of the tools output.
- `should_summarize` _bool_ - Indicates whether the tool&#x27;s output should be automatically summarized
  by the summarizer agent. For some tools summarization is useful (for example: a tool
  that fetches the latest news) whereas other tools it&#x27;s not (for example: a tool
  that fetches raw price data).

#### ready

```python
def ready(ctx: ToolRunContext) -> ReadyResponse
```

Check whether the tool can be plan_run.

This method can be implemented by subclasses to allow checking if the tool can be plan_run.
It may run any authentication logic or other required checks before returning its status.
If left unimplemented will always return true.

**Arguments**:

- `ctx` _ToolRunContext_ - Co
  ntext of the tool run
  

**Returns**:

- `ReadyResponse` - Whether the tool is ready to run and any clarifications that need to be
  resolved

#### run

```python
@abstractmethod
def run(ctx: ToolRunContext, *args: Any,
        **kwargs: Any) -> SERIALIZABLE_TYPE_VAR | Clarification
```

Run the tool.

This method must be implemented by subclasses to define the tool&#x27;s specific behavior.

**Arguments**:

- `ctx` _ToolRunContext_ - Context of the tool execution
- `args` _Any_ - The arguments passed to the tool for execution.
- `kwargs` _Any_ - The keyword arguments passed to the tool for execution.
  

**Returns**:

- `Any` - The result of the tool&#x27;s execution which can be any serializable type
  or a clarification.

#### check\_description\_length

```python
@model_validator(mode="after")
def check_description_length() -> Self
```

Check that the description is less than 1024 characters.

OpenAI has a maximum function description length of 1024 characters. This validator
ensures that the tool description does not exceed this limit.

**Returns**:

- `Self` - The current instance of the tool.
  

**Raises**:

- `InvalidToolDescriptionError` - If the description exceeds the maximum length.

#### to\_langchain

```python
def to_langchain(ctx: ToolRunContext) -> StructuredTool
```

Return a LangChain representation of this tool.

This function provides a LangChain-compatible version of the tool. The response format is
the default one without including artifacts. The ExecutionContext is baked into the
StructuredTool via a partial run function.

**Arguments**:

- `ctx` _ToolRunContext_ - The context for the tool.
  

**Returns**:

- `StructuredTool` - The LangChain-compatible representation of the tool, including the
  tool&#x27;s name, description, and argument schema, with the execution context baked
  into the function.

#### to\_langchain\_with\_artifact

```python
def to_langchain_with_artifact(ctx: ToolRunContext) -> StructuredTool
```

Return a LangChain representation of this tool with content and artifact.

This function provides a LangChain-compatible version of the tool, where the response format
includes both the content and the artifact. The ToolRunContext is baked into the
StructuredTool via a partial run function for capturing output directly.

**Arguments**:

- `ctx` _ToolRunContext_ - The context for the tool.
  

**Returns**:

- `StructuredTool` - The LangChain-compatible representation of the tool, including the
  tool&#x27;s name, description, argument schema, and the ability to return both content
  and artifact.

#### args\_json\_schema

```python
def args_json_schema() -> dict[str, Any]
```

Return the json_schema for the tool args.

This function retrieves the JSON schema for the tool&#x27;s arguments, which defines the expected
input structure.

**Returns**:

  dict[str, Any]: The JSON schema representing the tool&#x27;s arguments.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return the string representation.

This method generates a string representation of the tool, including its ID, name,
description, argument schema, and output schema.

**Returns**:

- `str` - A string representation of the tool.

#### serialize\_args\_schema

```python
@field_serializer("args_schema")
def serialize_args_schema(value: type[BaseModel]) -> str
```

Serialize the args_schema by returning its class name.

This function serializes the arguments schema by returning the class name of the schema.

**Arguments**:

- `value` _type[BaseModel]_ - The argument schema class.
  

**Returns**:

- `str` - The class name of the argument schema.

#### pretty

```python
def pretty() -> str
```

Return a pretty string representation of the tool.

## PortiaRemoteTool Objects

```python
class PortiaRemoteTool(Tool, Generic[SERIALIZABLE_TYPE_VAR])
```

Tool that passes run execution to Portia Cloud.

#### parse\_response

```python
def parse_response(ctx: ToolRunContext, response: dict[str, Any]) -> Output
```

Parse a JSON response into domain models or errors.

This method handles the response from the Portia Cloud API, converting it into domain
specific models. It also handles errors, including `ToolSoftError` and `ToolHardError`,
as well as clarifications of different types.

**Arguments**:

- `ctx` _ToolRunContext_ - Context of the environment
- `response` _dict[str, Any]_ - The JSON response returned by the Portia Cloud API.
  

**Returns**:

- `Output` - The parsed output wrapped in an `Output` object.
  

**Raises**:

- `ToolSoftError` - If a soft error is encountered in the response.
- `ToolHardError` - If a hard error is encountered in the response.

#### ready

```python
def ready(ctx: ToolRunContext) -> ReadyResponse
```

Check if the remote tool is ready by calling the /ready endpoint.

**Arguments**:

- `ctx` _ToolRunContext_ - Context of the environment
  

**Returns**:

- `ReadyResponse` - Whether the tool is ready to run and any clarifications that
  need to be resolved

#### run

```python
def run(ctx: ToolRunContext, *args: Any,
        **kwargs: Any) -> SERIALIZABLE_TYPE_VAR | None | Clarification
```

Invoke the run endpoint and handle the response.

This method sends the execution request to the Portia Cloud API, passing the arguments and
execution context. It then processes the response by calling `parse_response`. Errors
during the request or parsing are raised as `ToolHardError`.

**Arguments**:

- `ctx` _ToolRunContext_ - The context of the execution, including end user ID, run ID
  and additional data.
- `*args` _Any_ - The positional arguments for the tool.
- `**kwargs` _Any_ - The keyword arguments for the tool.
  

**Returns**:

  SERIALIZABLE_TYPE_VAR | None | Clarification: The result of the run execution, which
  could either be a serialized value, None, or a `Clarification` object.
  

**Raises**:

- `ToolHardError` - If the request fails or there is an error parsing the response.

#### batch\_ready\_check

```python
@classmethod
def batch_ready_check(cls, config: Config, tool_ids: set[str],
                      tool_run_context: ToolRunContext) -> ReadyResponse
```

Batch check readiness for Portia cloud tools.

**Arguments**:

- `config` _Config_ - The config for the SDK as a whole.
- `tool_ids` _set[str]_ - The list of tool IDs to check readiness for.
- `tool_run_context` _ToolRunContext_ - The context of the execution.
  

**Returns**:

- `ReadyResponse` - The readiness response for the tools.

## PortiaMcpTool Objects

```python
class PortiaMcpTool(Tool[str])
```

A Portia Tool wrapper for an MCP server-based tool.

#### run

```python
def run(_: ToolRunContext, **kwargs: Any) -> str
```

Invoke the tool by dispatching to the MCP server.

**Arguments**:

- `_` - The tool run context
- `**kwargs` - The arguments to pass to the MCP tool invocation
  

**Returns**:

- `str` - The result of the tool call

#### call\_remote\_mcp\_tool

```python
async def call_remote_mcp_tool(name: str,
                               arguments: dict | None = None) -> str
```

Call a tool using the MCP session.

