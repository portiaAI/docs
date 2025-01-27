---
sidebar_label: context
title: portia.context
---

Provides execution context to the planner and agents.

## ExecutionContext Objects

```python
class ExecutionContext(BaseModel)
```

Execution context provides runtime information to the runner, planner, and agents.

Unlike configuration settings, it is designed to be used on a per-request basis,
allowing customization at runtime. For example, this can pass end-user-specific
information to planners and agents for dynamic adjustments.

ExecutionContext

#### empty\_context

```python
def empty_context() -> ExecutionContext
```

Return an empty context.

#### execution\_context

```python
@contextmanager
def execution_context(
    context: ExecutionContext | None = None,
    end_user_id: str | None = None,
    additional_data: dict[str, str] | None = None,
    planner_system_context_extension: list[str] | None = None,
    agent_system_context_extension: list[str] | None = None
) -> Generator[None, None, None]
```

Set the execution context for the current thread for the duration of the workflow.

This context manager ensures thread safety by using thread-local storage,
meaning that the execution context set within this block will only affect
the current thread. This is particularly useful in multi-threaded
applications, such as web servers or task queues, where multiple threads
may need independent contexts simultaneously.

**Arguments**:

  ---------
- `context` _Optional[ExecutionContext]_ - The execution context to set for this thread.
  If not provided, a new `ExecutionContext` is created using the provided parameters.
- `end_user_id` _Optional[str]_ - An identifier for the end user, used to customize
  the execution for specific users. Defaults to `None`.
- `additional_data` _Optional[Dict[str, str]]_ - Arbitrary additional data to associate
  with the context. Defaults to an empty dictionary.
- `planner_system_context_extension` _Optional[list[str]]_ - Additional context for planner
  LLMs. This should be concise to stay within the context window.
- `agent_system_context_extension` _Optional[list[str]]_ - Additional context for agent
  LLMs. This should also be concise.
  

**Yields**:

  ------
- `None` - The block of code within the context manager executes with the specified context.
  
  Thread Safety:
  - The `_execution_context` object is a thread-local storage instance, ensuring that
  the `ExecutionContext` set in one thread does not affect others.
  - When the context manager exits, the context for the current thread is cleaned up
  to avoid memory leaks or unintended persistence of data.
  

**Example**:

  &gt;&gt;&gt; with execution_context(end_user_id=&quot;user123&quot;, additional_data={&quot;key&quot;: &quot;value&quot;}):
  &gt;&gt;&gt;     # Code here runs with the specified execution context
  &gt;&gt;&gt; # Outside the block, the execution context is cleared for the current thread.

#### get\_execution\_context

```python
def get_execution_context() -> ExecutionContext
```

Retrieve the current end-user from the context.

