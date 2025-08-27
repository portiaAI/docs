---
sidebar_label: tool_decorator
title: portia.tool_decorator
---

Tool decorator for creating tools from functions.

## DecoratedTool Objects

```python
class DecoratedTool(Tool[T])
```

Decorated tool class.

#### make\_run\_method

```python
def make_run_method(sig: inspect.Signature, fn: Callable) -> Callable
```

Make the run method for the tool.

#### make\_arun\_method

```python
def make_arun_method(sig: inspect.Signature, fn: Callable) -> Callable
```

Make the arun method for the tool.

#### make\_not\_implemented\_method

```python
def make_not_implemented_method() -> Callable
```

Make a run method that raises a NotImplementedError.

#### tool

```python
def tool(fn: Callable[..., T]) -> type[DecoratedTool]
```

Convert a function into a Tool class.

This decorator automatically creates a Tool subclass from a function by:
- Using the function&#x27;s docstring as the tool description
- Creating an ID and name based on the function name
- Generating input schema from function parameters and type hints
- Determining output schema from return type annotation

**Example**:

  @tool
  def add_numbers(a: int, b: int) -&gt; int:
  &quot;&quot;&quot;Add two numbers together.&quot;&quot;&quot;
  return a + b
  

**Arguments**:

- `fn` - The function to convert to a Tool class
  

**Returns**:

  A Tool subclass that wraps the original function
  

**Raises**:

- `ValueError` - If the function has invalid signature or return type

