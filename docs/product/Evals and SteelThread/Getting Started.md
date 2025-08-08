---
sidebar_position: 3
slug: /steelthread-getting-started
---

# 🚀 Getting Started with Steel Thread

Steel Thread lets you evaluate your agents — both during development and in production — using real data, real metrics, and minimal boilerplate.

This page walks you through getting started in three steps:

---

## 1️⃣ Sign Up on Portia Cloud

To use Steel Thread, you need data from your agent runs. This means integrating them with [**Portia Cloud**](https://app.portialabs.ai).

- Go to [app.portialabs.ai](https://app.portialabs.ai)
- Log in or create a new account
- Create a new API Key.
- Run your agent making sure to enable the Portia Cloud integration by setting an API key in the config.
- These runs — plans, tool calls, outputs — will form the basis of your evaluation datasets

> 💡 Every run you create in Portia can be used as an evaluation input — no extra data labeling required.

---

## 2️⃣ Create a Dataset to Evaluate

There are two types of monitoring that can be created via the UI.

### 📦 Eval Dataset

Use this to create a static, repeatable set of evals.

- In the Portia UI, create a new [Eval Set](https://app.portialabs.ai/dashboard/evals) with a distinct name e.g.`evals_v1`.
- Add new test cases to the newly created dataset using the `Add to Dataset` wizard.

---

### 🌐 Stream

Use this to continuously evaluate production runs.

- In the Portia UI, create a new [Stream](https://app.portialabs.ai/dashboard/streams) with a distinct name e.g.`stream_v1`.
- Test cases will be automatically sampled based on the config you provide.
- [n.b.] Streams only sample data after creation, so you will need to generate new data after creating the dataset.

---

## 3️⃣ Run Evals Locally Using the SDK

First, install the Steel Thread SDK:

```bash
# Using pip
pip install steel-thread

# Using poetry
poetry add steel-thread

# Using uv
uv pip install steel-thread
```

Then set the correct env vars. At a minimum you need `PORTIA_API_KEY` set and one LLM provider key (i.e. `OPENAI_API_KEY`).

```bash
export OPENAI_API_KEY=""
export PORTIA_API_KEY=""
export ANTHROPIC_API_KEY=""
export MISTRAL_API_KEY=""
export GOOGLE_API_KEY=""
export AZURE_OPENAI_API_KEY=""
export AZURE_OPENAI_ENDPOINT=""
```


Then, run your evals:

### 🧪 Eval Example

```python
from portia import Config, Portia
from steelthread import SteelThread
from steelthread.evals import EvalConfig

config = Config.from_default()
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

### 📈 Stream Example

```python
from portia import Config, Portia
from steelthread import SteelThread
from steelthread.streams import StreamConfig


config = Config.from_default()
st = SteelThread()

# Process stream
st.process_stream(
    StreamConfig(stream_name="stream_v1", config=config)
)

```

---

## ✅ You’re Set!

Once you're running evals, you can:

* View metrics in your terminal and view them in the UI
* Catch regressions before they ship
* Monitor live agent quality in production
* Iterate faster with confidence
