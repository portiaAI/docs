---
sidebar_label: cost_estimator
title: portia.cost_estimator
---

Cost estimator for Portia plans.

This module provides functionality to estimate the cost of running a Portia plan,
focusing on LLM usage costs across execution agents, introspection agents, and LLM tools.

The cost estimator uses an LLM-driven approach to estimate token usage and costs
for each step in a plan, providing detailed breakdowns and explanations.

## LLMEstimationResult Objects

```python
class LLMEstimationResult(BaseModel)
```

Structured output for LLM token usage estimation.

## StepCostEstimate Objects

```python
class StepCostEstimate(BaseModel)
```

Cost estimate for a single step in a plan.

## PlanCostEstimate Objects

```python
class PlanCostEstimate(BaseModel)
```

Complete cost estimate for a plan.

## CostEstimator Objects

```python
class CostEstimator()
```

Estimates the cost of running Portia plans based on LLM usage.

#### \_\_init\_\_

```python
def __init__(config: Config | None = None) -> None
```

Initialize the cost estimator.

**Arguments**:

- `config` - Portia configuration to use. If None, uses default config.

#### plan\_estimate

```python
def plan_estimate(plan: Plan | PlanV2) -> PlanCostEstimate
```

Estimate the cost of running a plan.

**Arguments**:

- `plan` - The plan to estimate costs for
  

**Returns**:

  Complete cost estimate for the plan

#### aplan\_estimate

```python
async def aplan_estimate(plan: Plan | PlanV2) -> PlanCostEstimate
```

Asynchronously estimate the cost of running a plan.

**Arguments**:

- `plan` - The plan to estimate costs for
  

**Returns**:

  Complete cost estimate for the plan

