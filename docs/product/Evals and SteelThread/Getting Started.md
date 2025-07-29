---
sidebar_position: 4
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

There are two types of datasets that can be created via the UI.

### 📦 Offline Dataset

Use this to create a static, repeatable set of evals.

- In the Portia UI, create a new [Offline Eval Set](https://app.portialabs.ai/dashboard/evals/new) with a distinct name e.g.`offline_evals_v1`.
- Add new test cases to the newly created dataset using the `Add to Dataset` wizard.

---

### 🌐 Online Dataset

Use this to continuously evaluate production runs.

- In the Portia UI, create a new [Online Eval Set](https://app.portialabs.ai/dashboard/evals/new) with a distinct name e.g.`online_evals_v1`.
- Test cases will be automatically sampled based on the config you provide.
- [n.b.] Online Datasets only sample data after creation, so you will need to generate new data after creating the dataset.

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

### 🧪 Offline Example

```python
from portia import Config, Portia
from steelthread.steelthread import SteelThread, OfflineEvalConfig

config = Config.from_default()

SteelThread().run_offline(
    Portia(config),
    OfflineEvalConfig(
        data_set_name="offline_evals_v1",
        config=config,
        iterations=3,
    ),
)
```

### 📈 Online Example

```python
from portia import Config
from steelthread.steelthread import SteelThread, OnlineEvalConfig

config = Config.from_default()

SteelThread().run_online(
    OnlineEvalConfig(
        data_set_name="prod_online_evals",
        config=config,
    )
)
```

> ✅ You can customize metrics, stub tools, or create new evaluators — see the docs for [writing custom metrics](./custom-metrics.md).

---

## ✅ You’re Set!

Once you're running evals, you can:

* View metrics in your terminal or save them to dashboards
* Catch regressions before they ship
* Monitor live agent quality in production
* Iterate faster with confidence
