---
sidebar_position: 5
slug: /st-default-evaluators
---

# 📊 Default Evaluators

Steel Thread provides two built-in evaluators to help you get started quickly:  
- 🧠 `LLMJudgeOnlineEvaluator` for online evaluation using LLM-as-Judge
- 🧪 `DefaultOfflineEvaluator` for assertion-based offline testing

These evaluators provide baseline capabilities for scoring the quality of your agents’ plans and executions — and serve as a foundation you can extend with [custom evaluators](./custom-evaluators.md).

---

## 🧠 Online: LLMJudgeOnlineEvaluator

This evaluator uses a **Large Language Model (LLM) as a judge** to assess the quality of:

- a **Plan** (before execution)
- a **PlanRun** (after execution)

### ✅ When to Use It

Use this evaluator if:
- You want **subjective scoring** based on high-level properties like clarity or correctness.
- You’re monitoring production behavior using **Online Evals**.

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
from steelthread.online_evaluators.llm_as_judge import LLMJudgeOnlineEvaluator

evaluator = LLMJudgeOnlineEvaluator(config)
plan_metrics = evaluator.eval_plan(plan)
run_metrics = evaluator.eval_plan_run(plan_run)
````

---

## 🧪 Offline: DefaultOfflineEvaluator

Offline evaluation is **assertion-based**. You define what should happen in each test case, and the `DefaultOfflineEvaluator` checks whether that actually occurred.

### ✅ When to Use It

Use this when:

* You want **precise, rule-based tests** (like latency thresholds or tool usage).
* You’re running **Offline Evals** against fixed datasets.

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
from steelthread.offline_evaluators.default_evaluator import DefaultOfflineEvaluator

evaluator = DefaultOfflineEvaluator(config)
metrics = evaluator.eval_test_case(test_case, plan_run, metadata)
```

---

## 🔧 How It Fits in Eval Runs

These evaluators are the **default components** for Steel Thread’s `OfflineEvalConfig` and `OnlineEvalConfig`.

You can override them with your own evaluators — or chain multiple evaluators together for deeper analysis.

