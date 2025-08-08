---
sidebar_position: 2
slug: /steel-thread-intro
---

# 🧵 Introducing Steel Thread

Steel Thread is a lightweight, extensible framework for evaluating LLM agents — designed to help teams measure quality, catch regressions, and improve performance with minimal friction.

Steel Thread is built around two core abstractions:

- **Evals** are static data sets designed to be run multiple times to allow you to analyze the impact of changes to your agents before deploying them.
- **Streams** on the other are dynamic datasets that sample real plans and plan runs in production allowing you to monitor performance on real problems. 

---

## 🧠 Why We Built Steel Thread

Evaluating agents isn’t hard because the models are bad — it’s hard because:

- The output space is non-deterministic
- The tool usage is complex and multi-step
- The definition of "correct" is subjective
- And most of all: **curating test data is painful**

We found that most eval frameworks fall down not on logic or metrics — but on data. They assume someone else is maintaining clean eval datasets.

That’s the bottleneck.

So we flipped the problem on its head.

Instead of asking teams to build new datasets from scratch, Steel Thread **plugs directly into the data you already generate in Portia Cloud**:

- Plans
- Plan Runs
- Tool Calls
- User IDs
- Metadata and outputs

Now, every agent execution can become an eval — either retrospectively or in real time.

---

## ⚙️ What Does It Do?

Steel Thread helps you answer the question:

> "Is my agent getting better or worse?"

It does this by providing:

### 📈 Evals
Run against curated static datasets. Useful for:
- Iterating on prompts
- Testing new toolchains
- Benchmarking models
- Catching regressions before deployment

### 🏞️ Streams
Run against your live or recent production runs. Useful for:
- Monitoring quality in real usage
- Tracking performance across time or model changes
- Detecting silent failures

### 🎯 Custom Metrics
Use rules, thresholds, or even LLMs-as-judges to compute:
- Accuracy
- Completeness
- Clarity
- Efficiency
- Latency
- Tool usage
- ...or domain-specific checks

---

## 🔌 Built for Portia

Steel Thread is deeply integrated with the Portia agentic platform.

It works natively with:
- **Plan and PlanRun IDs**
- **ToolCall metadata**
- **End user context**
- **Agent outputs (e.g. final outputs, intermediate values)**
- **APIs and UI features in Portia Cloud**

This means you don’t need to create new test harnesses or annotate synthetic datasets — you can evaluate what's already happening.

Just point Steel Thread at your Portia instance, and start measuring.

---

## 🧩 Flexible & Extensible

Steel Thread is designed to be modular:

- ✅ Drop in custom metrics
- 🛠️ Stub or override tool behavior
- 🔄 Run in CI or ad hoc from the CLI
- 🔍 Mix and match eval and stream strategies
- 📊 Save metrics wherever you like — log, database, dashboard

It plays well with teams at any stage of maturity — whether you’re just getting started with agents or deploying them in production.

---

## 🚀 Get Started

Once installed, you can start running evals in just a few lines:

```python
from steelthread.steelthread import SteelThread,
from steelthread.evals import EvalConfig
from portia import Config

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

Or, define a custom eval dataset with your own metrics and stubs:

```python
from portia import Plan, PlanRun

from steelthread.evals import EvalMetric, EvalTestCase, Evaluator, PlanRunMetadata

class MyEvaluator(Evaluator):
    def eval_test_case(
        self,
        test_case: EvalTestCase,
        final_plan: Plan,
        final_plan_run: PlanRun,
        additional_data: PlanRunMetadata,
    ) -> list[EvalMetric] | EvalMetric | None:
        return EvalMetric.from_test_case(
            test_case=test_case,
            name="custom",
            score=1.0,
            description="Always passes!",
        )
```

---

## 🧬 Why It’s Different

Steel Thread isn’t just another eval runner. It’s an opinionated framework focused on:

* Using your **real production data**
* Supporting **deep introspection** into agent behavior
* Making evals **easy to write and easy to trust**

We believe the best way to scale intelligent agents is not just to deploy them — but to hold them accountable.

Steel Thread helps you do just that.

