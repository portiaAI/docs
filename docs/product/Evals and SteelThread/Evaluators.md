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
def eval_test_case(
    self,
    test_case: TestCase,
    final_plan: Plan,
    final_plan_run: PlanRun,
    additional_data: PlanRunMetadata,
) -> list[Metric] | Metric | None:
```

Return one or more `Metric` objects with a `score`, `name`, and optional `description`.

### ✅ Example: Emoji Scorer

```python

class EmojiEvaluator(Evaluator):
    def eval_test_case(
        self,
        test_case: EvalTestCase,
        final_plan: Plan,  
        final_plan_run: PlanRun,
        additional_data: PlanRunMetadata,  
    ) -> list[EvalMetric] | EvalMetric | None:
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

## 🌐 Writing Stream Evaluators

Stream evaluators implement two methods:

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
class LLMJudge(StreamEvaluator):
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
SteelThread().process_stream(
    StreamConfig(
        stream_name="prod_runs",
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
