---
sidebar_label: reference
title: portia.builder.reference
---

References to values in a plan.

#### default\_step\_name

```python
def default_step_name(step_index: int) -> str
```

Return the default name for the step.

## Reference Objects

```python
class Reference(BaseModel, ABC)
```

A reference to a value.

#### get\_legacy\_name

```python
@abstractmethod
def get_legacy_name(plan: PlanV2) -> str
```

Get the name of the reference to use with legacy Portia plans.

#### get\_value

```python
@abstractmethod
def get_value(run_data: RunContext) -> ReferenceValue | None
```

Get the value of the reference.

## StepOutput Objects

```python
class StepOutput(Reference)
```

A reference to the output of a previous step.

When building your plan, you can use this class to reference the output of a previous step.
The output from the specified step will then be substituted in when the plan is run.

See the example usage in example_builder.py for more details.

#### \_\_init\_\_

```python
def __init__(step: str | int) -> None
```

Initialize the step output.

#### get\_legacy\_name

```python
@override
def get_legacy_name(plan: PlanV2) -> str
```

Get the name of the reference to use with legacy Portia plans.

#### \_\_str\_\_

```python
def __str__() -> str
```

Get the string representation of the step output.

#### get\_value

```python
@override
def get_value(run_data: RunContext) -> ReferenceValue | None
```

Get the value of the step output.

## Input Objects

```python
class Input(Reference)
```

A reference to a plan input.

When building your plan, you can specify plan inputs using the PlanBuilder.input() method. These
are inputs whose values you provide when running the plan, rather than when building the plan.
You can then use this to reference those inputs later in your plan. When you do this, the values
will be substituted in when the plan is run.

See the example usage in example_builder.py for more details.

#### \_\_init\_\_

```python
def __init__(name: str) -> None
```

Initialize the input.

#### get\_legacy\_name

```python
@override
def get_legacy_name(plan: PlanV2) -> str
```

Get the name of the reference to use with legacy Portia plans.

#### get\_value

```python
@override
def get_value(run_data: RunContext) -> ReferenceValue | None
```

Get the value of the input.

#### \_\_str\_\_

```python
def __str__() -> str
```

Get the string representation of the input.

## ReferenceValue Objects

```python
class ReferenceValue(BaseModel)
```

Value that can be referenced.

