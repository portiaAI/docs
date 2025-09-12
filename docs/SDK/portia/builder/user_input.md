---
sidebar_label: user_input
title: portia.builder.user_input
---

Implementation of the user input step.

## UserInputStep Objects

```python
class UserInputStep(StepV2)
```

A step that requests input from the user and returns their response.

This pauses plan execution and prompts the user to provide input. If options are
provided, the user must choose from the given choices (multiple choice). If no
options are provided, the user can enter free-form text.

A Clarification (either InputClarification or MultipleChoiceClarification) is used to get
the input from the user, so ensure you have set up handling for the required type of
clarification in order to use this step. For more details, see
https://docs.portialabs.ai/understand-clarifications.

The user&#x27;s response becomes the output of this step and can be referenced by
subsequent steps in the plan.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="User Input Step - Run")
async def run(run_data: RunContext) -> Any
```

Request input from the user and return the response.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this UserInputStep to a legacy Step.

