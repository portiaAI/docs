---
sidebar_label: example_builder
title: example_builder
---

A simple example of using the PlanBuilderV2.

This example demonstrates how to build and execute a multi-step agentic workflow
that combines tool calling, user interactions, conditional logic, and LLM tasks.

## CommodityPriceWithCurrency Objects

```python
class CommodityPriceWithCurrency(BaseModel)
```

Price of a commodity.

## FinalOutput Objects

```python
class FinalOutput(BaseModel)
```

Final output of the plan.

## WhileCondition Objects

```python
class WhileCondition()
```

Class that is used to track the number of times the condition has been run.

## Iterator Objects

```python
class Iterator()
```

Class that is used to track the number of times the iterator has been run.

## Exit Step Example

Here's an example showing how to use the exit step functionality:

```python
from portia import PlanBuilderV2, StepOutput, Input

# Example with conditional exit
plan = (
    PlanBuilderV2("Data processing with early exit")
    .input(name="data", description="Data to process")
    .function_step(
        function=lambda data: len(data) > 1000,
        args={"data": Input("data")},
        step_name="check_data_size"
    )
    .if_(
        condition=lambda is_large: is_large,
        args={"is_large": StepOutput("check_data_size")}
    )
    .exit(message="Data too large - stopping processing", error=True)
    .endif()
    .function_step(
        function=lambda data: f"Processed: {data}",
        args={"data": Input("data")},
        step_name="process_data"
    )
    .exit(message="Processing {{ StepOutput('process_data') }} completed successfully")
    .build()
)
```

This example demonstrates:
- **Conditional exit**: Exits with an error if data is too large
- **Template references**: Uses `{{ StepOutput('process_data') }}` to reference previous step output
- **Graceful termination**: Provides clear messages about why the plan is exiting

