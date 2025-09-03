---
sidebar_label: reference
title: portia.builder.reference
---

References to values in a plan.

This module provides reference classes that allow you to reference variables in your plan whose
values are not known when the plan is built, such as outputs from previous steps or user-provided
inputs. When the plan is run, these references are then resolved to their actual values.

The Reference class provides an interface for all reference types. It then has the following
implementations:
StepOutput: References the output value from a previous step.
Input: References a user-provided input value.

**Example**:

    ```python
    from portia.builder import PlanBuilderV2
    from portia.builder.reference import StepOutput, Input

    builder = PlanBuilderV2()
    builder.input("user_query", description="The user's search query")

    # Step 1: Search for information
    builder.step("search", tools=[search_tool], inputs={"query": Input("user_query")})

    # Step 2: Process the search results
    builder.step("process", tools=[llm_tool], inputs={"data": StepOutput("search")})
    ```

#### default\_step\_name

```python
def default_step_name(step_index: int) -> str
```

Generate a default name for a step based on its index.

**Arguments**:

- `step_index` - The zero-based index of the step in the plan.
  

**Returns**:

  A string in the format &quot;step_{index}&quot; (e.g., &quot;step_0&quot;, &quot;step_1&quot;).

## Reference Objects

```python
class Reference(BaseModel, ABC)
```

Abstract base class for all reference types in Portia plans.

References allow you to dynamically reference values that will be resolved at runtime,
such as outputs from previous steps or user-provided inputs. This enables building
flexible workflows where later steps can depend on the results of earlier operations.

This is an abstract base class that defines the interface all reference types must
implement. Concrete implementations include StepOutput and Input.

#### get\_legacy\_name

```python
@abstractmethod
def get_legacy_name(plan: PlanV2) -> str
```

Get the reference name for compatibility with legacy Portia plans.

**Arguments**:

- `plan` - The PlanV2 instance containing the reference.

#### get\_value

```python
@abstractmethod
def get_value(run_data: RunContext) -> Any | None
```

Resolve and return the value this reference points to.

**Arguments**:

- `run_data` - The runtime context containing step outputs, inputs, and other
  execution data needed to resolve the reference.
  

**Returns**:

  The resolved value, or None if the reference cannot be resolved.
  

**Raises**:

- `NotImplementedError` - This method must be implemented by subclasses.

## StepOutput Objects

```python
class StepOutput(Reference)
```

A reference to the output of a previous step in the plan.

StepOutput allows you to reference the output value produced by an earlier step,
enabling you to create workflows where later steps depend on the results of
previous operations. The reference is resolved at runtime during plan execution.

You can reference a step either by its name (string) or by its position (integer index).
Step indices are zero-based, so the first step is index 0.

**Example**:

    ```python
    from portia.builder import PlanBuilderV2
    from portia.builder.reference import StepOutput

    builder = PlanBuilderV2()

    # Create a step that produces some output
    builder.step("search", tools=[search_tool], inputs={"query": "Python tutorials"})

    # Reference the output by name
    builder.step("analyze", tools=[llm_tool], inputs={"data": StepOutput("search")})

    # Reference the output by index (0 = first step)
    builder.step("summarize", tools=[llm_tool], inputs={"data": StepOutput(0)})
    ```

#### \_\_init\_\_

```python
def __init__(step: str | int) -> None
```

Initialize a reference to a step&#x27;s output.

#### get\_legacy\_name

```python
@override
def get_legacy_name(plan: PlanV2) -> str
```

Get the reference name for compatibility with legacy Portia plans.

#### \_\_str\_\_

```python
def __str__() -> str
```

Get the string representation of the step output.

#### get\_value

```python
@override
def get_value(run_data: RunContext) -> Any | None
```

Resolve and return the output value from the referenced step.

**Notes**:

  If the step cannot be found, a warning is logged and None is returned.
  The step is matched by either name (string) or index (integer).

#### get\_description

```python
def get_description(run_data: RunContext) -> str
```

Get the description of the step output.

## Input Objects

```python
class Input(Reference)
```

A reference to a user-provided plan input.

Input allows you to reference values that are provided at runtime when the plan
is executed, rather than when the plan is built. This enables creating reusable
plans that can work with different input values each time they run.

Plan inputs are defined using the PlanBuilder.input() method when building your
plan, and their values are provided when calling portia.run() or portia.arun().
The Input reference is then resolved to the actual value during execution.

**Example**:

    ```python
    from portia.builder import PlanBuilderV2
    from portia.builder.reference import Input

    builder = PlanBuilderV2()

    # Define an input that will be provided at runtime
    builder.input("user_query", description="The user's search query")
    builder.input("max_results", description="Maximum number of results")

    # Use the inputs in steps
    builder.step("search",
                tools=[search_tool],
                inputs={
                    "query": Input("user_query"),
                    "limit": Input("max_results")
                })

    # When running the plan, provide the input values:
    # portia.run(plan, inputs={"user_query": "Python tutorials", "max_results": 10})
    ```

#### \_\_init\_\_

```python
def __init__(name: str) -> None
```

Initialize a reference to a plan input.

#### get\_legacy\_name

```python
@override
def get_legacy_name(plan: PlanV2) -> str
```

Get the reference name for compatibility with legacy Portia plans.

#### get\_value

```python
@override
def get_value(run_data: RunContext) -> Any | None
```

Resolve and return the user-provided input value.

**Returns**:

  The user-provided value for this input, or None if not found.
  

**Notes**:

  If the input value is itself a Reference, it will be recursively resolved.

#### \_\_str\_\_

```python
def __str__() -> str
```

Get the string representation of the input.

