---
sidebar_position: 7
slug: /st-evaluators
---

# 🧮 Evaluators

Evaluators are responsible for the calculation of metrics.

Steel Thread provides two built-in evaluators to help you get started quickly:  
- 🧠 `LLMJudgeEvaluator` for stream based evaluation using LLM-as-Judge
- 🧪 `DefaultEvaluator` for assertion-based eval testing

These evaluators provide baseline capabilities for scoring the quality of your agents’ plans and executions — and serve as a foundation you can extend with custom evaluators.

---

## 🧠 Streams: LLMJudgeEvaluator

This evaluator uses a **Large Language Model (LLM) as a judge** to assess the quality of:

- a **Plan** (before execution)
- a **PlanRun** (after execution)

### ✅ When to Use It

Use this evaluator if:
- You want **subjective scoring** based on high-level properties like clarity or correctness.
- You’re monitoring production behavior using **Streams**.

### ✍️ Scored Metrics

#### For Plans:

| Metric        | Description                                      |
|---------------|--------------------------------------------------|
| `correctness` | Are the steps logically valid?                   |
| `completeness`| Are all necessary steps included?                |
| `clearness`   | Are the steps clearly written and easy to follow?|

#### For PlanRuns:

| Metric       | Description                                       |
|--------------|---------------------------------------------------|
| `success`    | Did the run accomplish its intended goal?         |
| `efficiency` | Were the steps necessary and minimal?             |

These metrics are scored by passing your plan/run JSON to an LLM and asking it to evaluate.

### 🧪 Example

```python
from portia import Config
from steelthread.streams import LLMJudgeEvaluator

config = Config.from_default(
    default_log_level=LogLevel.CRITICAL,
)

evaluator = LLMJudgeEvaluator(config)
plan_metrics = evaluator.eval_plan(plan)
run_metrics = evaluator.eval_plan_run(plan, plan_run)
```

---

## 🧪 Evals: DefaultEvaluator

Evals are **assertion-based**. You define what should happen in each test case, and the `DefaultEvaluator` checks whether that actually occurred.

### ✅ When to Use It

Use this when:

* You want **precise, rule-based tests** (like latency thresholds or tool usage).
* You’re running **Evals** against fixed datasets.

### 📐 Supported Assertion Types

| Assertion Type | Description                                                                                |
| -------------- | ------------------------------------------------------------------------------------------ |
| `outcome`      | Checks whether the final status matches an expected value (e.g. COMPLETE).                 |
| `final_output` | Compares the final output to an expected string, either exactly or partially, or uses LLM. |
| `latency`      | Compares latency against a threshold using normalized scoring.                             |
| `tool_calls`   | Verifies which tools were or weren’t used during the run.                                  |
| `custom`       | Allows additional user-defined metadata for evaluators to interpret.                       |

### 🧮 Scoring Logic

* **Outcome**: 1.0 if status matches, else 0.0
* **Final Output**:

  * `exact_match`: strict equality
  * `partial_match`: expected string must be a substring
  * `llm_judge`: LLM rates similarity
* **Latency**: Uses normalized difference between actual and expected latency
* **Tool Calls**: Penalizes missing or unexpected tool invocations

### 🧪 Example

```python
from portia import Config
from steelthread.evals import DefaultEvaluator

config = Config.from_default(
    default_log_level=LogLevel.CRITICAL,
)

evaluator = DefaultEvaluator(config)
metrics = evaluator.eval_test_case(test_case, plan, plan_run, metadata)
```

---

## 🔧 How It Fits in Eval Runs

These evaluators are the **default components** for Steel Thread’s `EvalConfig` and `StreamConfig`.

You can override them with your own evaluators — or chain multiple evaluators together for deeper analysis.



# 🏗️ Writing Custom Evaluators

Steel Thread makes it easy to define your own logic for evaluating agent runs.

Whether you want to check for business-specific behavior, enforce style rules, or measure something that built-in metrics don’t cover — custom evaluators give you full control.

---

## 🧠 Why Write a Custom Evaluator?

Use a custom evaluator when:

- You want to enforce custom success criteria (e.g. "must mention a policy number")
- You have a domain-specific rule (e.g. "output must include 3 emojis 😎")
- You want to score behavior heuristically (e.g. "more than 2 tool calls = bad")
- You want to use your own LLMs to grade completions

You can plug in your evaluator to any **EvalConfig** or **StreamConfig** — just pass it to the `evaluators` field.

---

## ✍️ How to Write an Evaluator

Evaluators implement a single method:

```python
from portia import Plan, PlanRun
from steelthread.evals import EvalTestCase, EvalMetric, PlanRunMetadata

def eval_test_case(
    self,
    test_case: EvalTestCase,
    final_plan: Plan,
    final_plan_run: PlanRun,
    additional_data: PlanRunMetadata,
) -> list[EvalMetric] | EvalMetric | None:
```

Return one or more `EvalMetric` objects with a `score`, `name`, and optional `description`.

### ✅ Example: Emoji Scorer

```python
import re
from portia import Plan, PlanRun
from steelthread.evals import Evaluator, EvalTestCase, PlanRunMetadata, EvalMetric

class EmojiEvaluator(Evaluator):
    def eval_test_case(
        self,
        test_case: EvalTestCase,
        final_plan: Plan,  
        final_plan_run: PlanRun,
        additional_data: PlanRunMetadata,  
    ) -> list[EvalMetric] | EvalMetric | None:
        string_to_score = (
            f"{final_plan_run.outputs.final_output.get_value()}"
            if final_plan_run.outputs.final_output
            else ""
        )
        emoji_pattern = re.compile(
            "[\U0001f600-\U0001f64f"  # emoticons
            "\U0001f300-\U0001f5ff"  # symbols & pictographs
            "\U0001f680-\U0001f6ff"  # transport & map symbols
            "\U0001f1e0-\U0001f1ff"  # flags
            "]+",
            flags=re.UNICODE,
        )

        emojis = emoji_pattern.findall(string_to_score)
        emoji_count = len(emojis)

        expected = int(test_case.get_custom_assertion("expected_emojis") or 2)
        score = min(emoji_count / expected, 1.0)

        return EvalMetric.from_test_case(
            test_case=test_case,
            name="emoji_score",
            score=score,
            description=f"Target: {expected}, Found: {emoji_count}",
        )
```

> 🧪 Add this evaluator to your config with `evaluators=[EmojiEvaluator(config)]`.

---

## 🌐 Writing Stream Evaluators

Stream evaluators implement two methods:

```python
from steelthread.streams import PlanStreamItem, PlanRunStreamItem, StreamMetric,
class MyStreamEvaluator(StreamEvaluator):
    def process_plan(self, stream_item: PlanStreamItem) -> list[StreamMetric] | StreamMetric:
        ...

    def process_plan_run(self, stream_item: PlanRunStreamItem) -> list[StreamMetric] | StreamMetric | None:
        ...
```

Use these to evaluate live data, such as new plans generated in production.

### 🧠 LLM-as-Judge Example

You can use an LLM to score plan runs automatically:

```python
from steelthread.streams import StreamEvaluator
from steelthread.utils.llm import LLMScorer, MetricOnly


class LLMJudge(StreamEvaluator):
    def __init__(self, config):
        self.scorer = LLMScorer(config)

    def eval_plan_run(self, plan, plan_run):
        return self.scorer.score(
            task_data=[plan_run.model_dump_json()],
            metrics_to_score=[
                MetricOnly(name="success", description="Goal met"),
                MetricOnly(name="efficiency", description="Minimal steps"),
            ],
        )
```

---

## 🧩 Plug It In

To use your evaluator, pass it to the runner:

```python
from steelthread import SteelThread
from steelthread.evals import EvalConfig

SteelThread().run_evals(
    portia,
    EvalConfig(
        eval_dataset_name="evals_v1",
        config=config,
        evaluators=[MyCustomEvaluator(config)],
    ),
)
```

Or for streams:

```python
from steelthread import SteelThread
from steelthread.streams import StreamConfig

SteelThread().process_stream(
    StreamConfig(
        stream_name="prod_runs",
        config=config,
        evaluators=[LLMJudge(config)],
    ),
)
```

---

## ✅ You’re Ready!

Custom evaluators give you the flexibility to define quality on your terms — with logic, LLMs, regexes, or anything else you can code.
