---
Sidebar_Label: tool_decorator
Title: portia.tool_decorator
---

Tool decorator for creating tools from functions.

#### Tool

```python
def tool(fn: Callable[..., T]) -> type[Tool[T]]
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

