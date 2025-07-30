---
sidebar_position: 6
slug: /st-evaluators
---

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

You can plug in your evaluator to any **OfflineEvalConfig** or **OnlineEvalConfig** — just pass it to the `evaluators` field.

---

## ✍️ How to Write One (Offline)

Offline evaluators implement a single method:

```python
def eval_test_case(
    self,
    test_case: OfflineTestCase,
    final_plan: Plan,
    final_plan_run: PlanRun,
    additional_data: PlanRunMetadata,
) -> list[Metric] | Metric | None:
````

Return one or more `Metric` objects with a `score`, `name`, and optional `description`.

### ✅ Example: Emoji Scorer

```python
import re
from steelthread.offline_evaluators.evaluator import OfflineEvaluator, PlanRunMetadata
from steelthread.metrics.metric import Metric

class EmojiEvaluator(OfflineEvaluator):
    def eval_test_case(self, test_case, final_plan, final_plan_run, additional_data):
        output = final_plan_run.outputs.final_output.get_value()
        emoji_count = len(re.findall(r"[😀-🙏🚀-🛸🇦-🇿]", output))

        expected = int(test_case.get_custom_assertion("expected_emojis") or 2)
        score = min(emoji_count / expected, 1.0)

        return Metric(
            name="emoji_score",
            score=score,
            description=f"Target: {expected}, Found: {emoji_count}",
        )
```

> 🧪 Add this evaluator to your config with `evaluators=[EmojiEvaluator(config)]`.

---

## 🌐 Writing Online Evaluators

Online evaluators implement two methods:

```python
def eval_plan(self, plan: Plan) -> list[Metric] | Metric:
    ...

def eval_plan_run(self, plan_run: PlanRun) -> list[Metric] | Metric | None:
    ...
```

Use these to evaluate live data, such as new plans generated in production.

### 🧠 LLM-as-Judge Example

You can use an LLM to score plan runs automatically:

```python
from steelthread.online_evaluators.evaluator import OnlineEvaluator
from steelthread.metrics.metric import Metric
from steelthread.common.llm import LLMMetricScorer

class LLMJudge(OnlineEvaluator):
    def __init__(self, config):
        self.scorer = LLMMetricScorer(config)

    def eval_plan_run(self, plan, plan_run):
        return self.scorer.score(
            task_data=[plan_run.model_dump_json()],
            metrics_to_score=[
                Metric(name="success", description="Goal met", score=0),
                Metric(name="efficiency", description="Minimal steps", score=0),
            ]
        )
```

---

## 🧩 Plug It In

To use your evaluator, pass it to the runner:

```python
SteelThread().run_offline(
    portia,
    OfflineEvalConfig(
        data_set_name="offline_v1",
        config=config,
        evaluators=[MyCustomEvaluator(config)],
    ),
)
```

Or for online:

```python
SteelThread().run_online(
    OnlineEvalConfig(
        data_set_name="prod_runs",
        config=config,
        evaluators=[LLMJudge(config)],
    ),
)
```

---

## 📏 Reminder: What is a Metric?

A `Metric` is just a structured score:

```python
Metric(
    name="final_output_match",
    score=0.85,
    description="Matches expected summary with minor differences",
)
```

Scores should be normalized between **0.0 (bad)** and **1.0 (perfect)**.

---

## ✅ You’re Ready!

Custom evaluators give you the flexibility to define quality on your terms — with logic, LLMs, regexes, or anything else you can code.
