---
sidebar_label: step_v2
title: portia.builder.step_v2
---

Interface for steps that are run as part of a PlanV2.

## StepV2 Objects

```python
class StepV2(BaseModel, ABC)
```

Interface for steps that are run as part of a plan.

#### run

```python
@abstractmethod
async def run(run_data: RunContext) -> Any
```

Execute the step.

#### to\_legacy\_step

```python
@abstractmethod
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this step to a Step from plan.py.

A Step is the legacy representation of a step in the plan, and is still used in the
Portia backend. If this step doesn&#x27;t need to be represented in the plan sent to the Portia
backend, return None.

## LLMStep Objects

```python
class LLMStep(StepV2)
```

A step that runs a given task through an LLM (without any tools).

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="LLM Step - Run")
async def run(run_data: RunContext) -> str | BaseModel
```

Run the LLM query.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this LLMStep to a Step.

## InvokeToolStep Objects

```python
class InvokeToolStep(StepV2)
```

A step that calls a tool with the given args (no LLM involved, just a direct tool call).

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="Invoke Tool Step - Run")
async def run(run_data: RunContext) -> Any
```

Run the tool.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this InvokeToolStep to a legacy Step.

## SingleToolAgentStep Objects

```python
class SingleToolAgentStep(StepV2)
```

A step where an LLM agent uses a single tool (calling it only once) to complete a task.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="Single Tool Agent Step - Run")
async def run(run_data: RunContext) -> None
```

Run the agent step.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this SingleToolAgentStep to a Step.

## UserVerifyStep Objects

```python
class UserVerifyStep(StepV2)
```

A step that asks the user to verify a message before continuing.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="User Verify Step - Run")
async def run(run_data: RunContext) -> bool | UserVerificationClarification
```

Run the user verification step.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this UserVerifyStep to a legacy Step.

## UserInputStep Objects

```python
class UserInputStep(StepV2)
```

A step that requests input from the user and returns the response.

If options are provided, creates a multiple choice clarification.
Otherwise, creates a text input clarification.

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

Run the user input step.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this UserInputStep to a legacy Step.

## ConditionalStep Objects

```python
class ConditionalStep(StepV2)
```

A step that represents a conditional clause in a conditional block.

I.E. if, else-if, else, end-if clauses.

#### validate\_conditional\_block

```python
@field_validator("conditional_block", mode="after")
@classmethod
def validate_conditional_block(cls,
                               v: ConditionalBlock | None) -> ConditionalBlock
```

Validate the conditional block.

#### block

```python
@property
def block() -> ConditionalBlock
```

Get the conditional block for this step.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="Conditional Step - Run")
async def run(run_data: RunContext) -> Any
```

Run the conditional step.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this ConditionalStep to a PlanStep.

