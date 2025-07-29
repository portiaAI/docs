---
sidebar_position: 7
slug: /st-stubs
---

# 🛠️ Tool Stubbing for Reliable Evals

When running offline evals, your agent may call tools like “weather”, “search”, or “lookup_customer”. If those tools hit live systems, you'll get non-deterministic results — which can make evaluation noisy and inconsistent.

To solve this, **Steel Thread** supports stubbing tools with fixed, fake responses.

This makes your tests:

- ✅ **Deterministic** — the same input always produces the same output
- ✅ **Isolated** — no external API calls or flaky systems
- ✅ **Repeatable** — easy to track regressions across changes

---

## 🤔 When to Stub

Use tool stubs when:

- You're writing **offline evaluations**
- The tool response **affects the plan or output**
- You want **consistent scoring** across iterations

---

## ⚙️ How Tool Stubbing Works

Steel Thread provides a `ToolStubRegistry` — a drop-in replacement for Portia’s default registry.

You can wrap your existing tools and selectively override individual tools by ID.

---

### 🔁 Example: Stubbing the Weather Tool

```python
from portia import Config, Portia, ToolRunContext, DefaultToolRegistry
from steelthread.portia.tools import ToolStubRegistry

# Define stub behavior
def weather_stub(index, ctx: ToolRunContext, args, kwargs):
    city = kwargs.get("city", "").lower()
    return {
        "sydney": "33.28",
        "london": "2.00",
    }.get(city, f"Unknown city: {city}")

# Wrap your registry with a stub registry
portia = Portia(
    config,
    tools=ToolStubRegistry(
        DefaultToolRegistry(config),
        stubs={
            "weather_tool": weather_stub,
        },
    )
)
````

> ✅ The rest of your tools still work as normal — only the stubbed one is overridden.

---

## 🔬 Tool Stub Function Signature

Tool stubs are simple Python functions:

```python
def my_stub(
    tool_call_index: int,
    ctx: ToolRunContext,
    args: tuple,
    kwargs: dict,
) -> Any:
    ...
```

You can use:

* `tool_call_index` to vary behavior across iterations
* `ctx` to access plan metadata, end user, etc.
* `args` and `kwargs` for tool inputs

Return any value your real tool would return — a string, object, dict, etc.

---

## 🧪 Using Tool Stubs in Offline Eval Runs

```python
from steelthread.steelthread import SteelThread, OfflineEvalConfig

SteelThread().run_offline(
    portia,
    OfflineEvalConfig(
        data_set_name="offline_eval_v1",
        config=config,
        iterations=3,
    )
)
```

With the stubbed tool in place, your offline evals will be clean, fast, and reproducible.

---

## ✅ Best Practices

* ✅ Stub only the tools that matter for evaluation
* ✅ Use consistent return types (e.g. same as real tool)
* ✅ Use `tool_call_index` if you want per-run variance
* ✅ Combine stubbing with assertions to detect misuse (e.g. tool called too many times)

---
