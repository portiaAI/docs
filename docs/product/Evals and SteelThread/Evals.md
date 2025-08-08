---
sidebar_position: 4
slug: /evals
---

# 📊 Evals

Evals are static datasets designed to be run multiple times against your agent.

The overall flow is:

1. From the Portia UI create a new eval dataset and create test cases for it.
2. Pass your Portia instance, and the name of the eval dataset to SteelThread.
3. SteelThread will run each test case through Portia, analyzing the results.
4. Visualize the metrics from each run in the Portia UI.

# 🆙 Basic Example

```python
from portia import Config, LogLevel, Portia
from steelthread.steelthread import SteelThread
from steelthread.evals import EvalConfig


config = Config.from_default(default_log_level=LogLevel.CRITICAL)
st = SteelThread()

portia = Portia(config)

st.run_evals(
    portia,
    EvalConfig(
        eval_dataset_name="evals_v1",  
        config=config,
        iterations=4,
    ),
)
```

## 🧠 Stream vs Eval — At a Glance

| Feature             | `process_stream(...)`        | `run_evals(...)`                             |
|---------------------|------------------------------|----------------------------------------------|
| **Input source**     | Dynamic, real-time           | Static, pre-defined test cases               |
| **Repetition/Retry** | 1 by default                 | N times via `iterations`                     |
| **Use case**         | Production runs, monitoring  | Ground truth benchmarking, regression        |
| **Tool stubbing**    | Optional                     | Recommended                                  |
| **Custom evaluation**| Yes                          | Yes                                          |



# 🛠️ Tool Stubbing for Reliable Evals

When running evals, your agent may call tools like “weather”, “search”, or “lookup_customer”. If those tools hit live systems, you'll get non-deterministic results — which can make evaluation noisy and inconsistent.

To solve this, **Steel Thread** supports stubbing tools with fixed, fake responses.

This makes your tests:

- ✅ **Deterministic** — the same input always produces the same output
- ✅ **Isolated** — no external API calls or flaky systems
- ✅ **Repeatable** — easy to track regressions across changes

---

## 🤔 When to Stub

Use tool stubs when:

- You're writing **evals**
- The tool response **affects the plan or output**
- You want **consistent scoring** across iterations

---

## ⚙️ How Tool Stubbing Works

Steel Thread provides a `ToolStubRegistry` — a drop-in replacement for Portia’s default registry.

You can wrap your existing tools and selectively override individual tools by ID.

---

### 🔁 Example: Stubbing the Weather Tool

```python
from steelthread.portia.tools import ToolStubContext

# Define stub behavior
def weather_stub_response(
    ctx: ToolStubContext,
) -> str:
    """Stub for weather tool to return deterministic weather."""
    city = ctx.kwargs.get("city", "").lower()
    if city == "sydney":
        return "33.28"
    if city == "london":
        return "2.00"

    return f"Unknown city: {city}"
```

---

## 🔬 Tool Stub Function Signature

Tool stubs are simple Python functions:

```python
from steelthread.portia.tools import ToolStubContext

def my_stub(
    ctx: ToolStubContext,
) -> Any:
    ...
```

The ToolStubContext contains all the information you should need to generate realistic stubs:

```python

class ToolStubContext(BaseModel):
    """Context passed to tool stubs."""

    tool_call_index: int
    original_context: ToolRunContext
    original_tool: Tool | None
    args: tuple[Any, ...]
    kwargs: dict[str, Any]
```

Return any value your real tool would return — a string, object, dict, etc.

---

## 🧪 Using Tool Stubs in Eval Runs

```python

from portia import Portia, Config, DefaultToolRegistry
from steelthread.portia.tools import ToolStubRegistry

config = Config.from_default(
    default_log_level=LogLevel.CRITICAL,
)

# Run evals with stubs 
portia = Portia(
    config,
    tools=ToolStubRegistry(
        DefaultToolRegistry(config),
        stubs={
            "weather_tool": weather_stub_response,
        },
    ),
)
```

With the stubbed tool in place, your evals will be clean, fast, and reproducible. The rest of your tools still work as normal with only the stubbed one being overridden.

---

## ✅ Best Practices

* ✅ Stub only the tools that matter for evaluation
* ✅ Use consistent return types (e.g. same as real tool)
* ✅ Use `tool_call_index` if you want per-run variance
* ✅ Combine stubbing with assertions to detect misuse (e.g. tool called too many times)

---