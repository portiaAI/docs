---
sidebar_label: react_agent
title: portia.execution_agents.react_agent
---

A simple ReAct agent that reasons and acts (using tools) in a loop until the task is complete.

## WrappedToolNode Objects

```python
class WrappedToolNode(ToolNode)
```

ToolNode subclass that adds logging before and after tool calls.

#### \_\_init\_\_

```python
def __init__(run_data: RunContext, tools: list[Tool],
             langchain_tools: list[StructuredTool]) -> None
```

Initialize WrappedToolNode.

#### ainvoke

```python
async def ainvoke(input: Any,
                  config: Any = None,
                  **kwargs: Any) -> dict[str, Any]
```

Execute tools asynchronously with logging.

#### get\_tool\_by\_name

```python
def get_tool_by_name(name: str) -> Tool | None
```

Get the tool by the name.

## FinalResultToolSchema Objects

```python
class FinalResultToolSchema(BaseModel)
```

Schema defining the inputs for the FinalResultTool.

## FinalResultTool Objects

```python
class FinalResultTool(Tool[str])
```

Tool for providing the final result when a task is completed.

#### run

```python
def run(ctx: ToolRunContext, final_result: str) -> str
```

Run the FinalResultTool.

## ReasoningNode Objects

```python
class ReasoningNode()
```

Node that handles planning, reasoning, and tool selection in a unified approach.

#### \_\_init\_\_

```python
def __init__(task: str, task_data: dict[str, Any] | list[Any] | str | None,
             model: GenerativeModel, tools: list[Tool],
             langchain_tools: list[StructuredTool],
             prev_clarifications: list[Clarification]) -> None
```

Initialize ReasoningNode.

#### invoke

```python
async def invoke(state: MessagesState) -> dict[str, Any]
```

Run the reasoning step of the ReAct agent.

## ReActAgent Objects

```python
class ReActAgent()
```

ReAct (Reasoning and Acting) agent that combines planning, reasoning, and tool selection.

#### \_\_init\_\_

```python
def __init__(task: str,
             task_data: dict[str, Any] | list[Any] | str | None,
             tools: Sequence[Tool],
             run_data: RunContext,
             tool_call_limit: int = 25,
             allow_agent_clarifications: bool = False,
             output_schema: type[BaseModel] | None = None) -> None
```

Initialize the ReActAgent.

#### execute

```python
async def execute() -> Output
```

Run the ReAct agent.

#### process\_output

```python
def process_output(messages: list[BaseMessage]) -> Output
```

Process the output of the agent.

#### next\_state\_after\_tool\_call

```python
def next_state_after_tool_call(
        state: MessagesState) -> Literal[END, AgentNode.REASONING]
```

Decide the next state after a tool call.

