---
sidebar_label: step_v2
title: portia.builder.step_v2
---

Implementation of the various step types used in :class:`PlanV2`.

## StepV2 Objects

```python
class StepV2(BaseModel, ABC)
```

Abstract base class for all steps executed within a plan.

Each step represents an action that can be performed during plan execution,
such as calling an LLM / agent, invoking a tool, or requesting user input.

#### run

```python
@abstractmethod
async def run(run_data: RunContext) -> Any
```

Execute the step and return its output.

**Returns**:

  The step&#x27;s output value, which may be used by subsequent steps.

#### to\_legacy\_step

```python
@abstractmethod
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this step to the legacy Step format.

This is primarily used to determine how the steps should be presented in the Portia
Dashboard.

## LLMStep Objects

```python
class LLMStep(StepV2)
```

A step that executes a task using an LLM without any tool access.

This step is used for pure language model tasks like text generation,
analysis, or transformation that don&#x27;t require external tool calls.

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

Execute the LLM task and return its response.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this LLMStep to a legacy Step.

## InvokeToolStep Objects

```python
class InvokeToolStep(StepV2)
```

A step that directly invokes a tool with specific arguments.

This performs a direct tool call without LLM involvement, making it suitable
for deterministic operations where you know exactly which tool to call and
what arguments to pass.

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

Execute the tool and return its result.

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

A step where an LLM agent intelligently uses a specific tool to complete a task.

Unlike InvokeToolStep which requires you to specify exact tool arguments, this step
allows an LLM agent to determine how to use the tool based on the task description
and available context. The agent will call the tool at most once during execution.

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

Run the agent and return its output.

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

A step that requests user confirmation before proceeding with plan execution.

This step pauses execution to ask the user to verify or approve a message.
If the user rejects the verification, the plan execution will stop with an error.

This pauses plan execution and asks the user to confirm or reject the provided
message. The plan will only continue if the user confirms. If the user rejects,
the plan execution will stop with an error. This is useful for getting user approval before
taking important actions like sending emails, making purchases, or modifying data.

A UserVerificationClarification is used to get the verification from the user, so ensure you
have set up handling for this type of clarification in order to use this step. For more
details, see https://docs.portialabs.ai/understand-clarifications.

This step outputs True if the user confirms.

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

Prompt the user for confirmation.

Returns a UserVerificationClarification to get input from the user (if not already
provided).

If the user has already confirmed, returns True. Otherwise, if the user has rejected the
verification, raises a PlanRunExitError.

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

## ConditionalStep Objects

```python
class ConditionalStep(StepV2)
```

A step that represents a conditional clause within a conditional execution block.

This step handles conditional logic such as if, else-if, else, and end-if statements
that control which subsequent steps should be executed based on runtime conditions.

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

Evaluate the condition and return a ConditionalStepResult.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this ConditionalStep to a legacy Step.

