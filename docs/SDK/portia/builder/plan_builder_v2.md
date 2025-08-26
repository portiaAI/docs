---
sidebar_label: plan_builder_v2
title: portia.builder.plan_builder_v2
---

Builder for Portia plans.

## PlanBuilderError Objects

```python
class PlanBuilderError(ValueError)
```

Error in Plan definition.

## PlanBuilderV2 Objects

```python
class PlanBuilderV2()
```

Builder for Portia plans.

#### \_\_init\_\_

```python
def __init__(label: str = "Run the plan built with the Plan Builder") -> None
```

Initialize the builder.

**Arguments**:

- `label` - The label of the plan. This is used to identify the plan in the Portia dashboard.

#### input

```python
def input(*,
          name: str,
          description: str | None = None,
          default_value: Any | None = None) -> PlanBuilderV2
```

Add an input to the plan.

**Arguments**:

- `name` - The name of the input.
- `description` - The description of the input.
- `default_value` - The default value of the input.

#### if\_

```python
def if_(condition: Callable[..., bool] | str,
        args: dict[str, Any] | None = None) -> PlanBuilderV2
```

Add a step that checks a condition.

#### else\_if\_

```python
def else_if_(condition: Callable[..., bool],
             args: dict[str, Any] | None = None) -> PlanBuilderV2
```

Add a step that checks a condition.

#### else\_

```python
def else_() -> PlanBuilderV2
```

Add a step that checks a condition.

#### endif

```python
def endif() -> PlanBuilderV2
```

Exit a conditional block.

#### llm\_step

```python
def llm_step(*,
             task: str,
             inputs: list[Any] | None = None,
             output_schema: type[BaseModel] | None = None,
             step_name: str | None = None) -> PlanBuilderV2
```

Add a step that sends a query to the underlying LLM.

**Arguments**:

- `task` - The task to perform.
- `inputs` - The inputs to the task. The inputs can be references to previous step outputs /
  plan inputs (using StepOutput / Input) or just plain values. They are passed in as
  additional context to the LLM when it is completing the task.
- `output_schema` - The schema of the output.
- `step_name` - Optional name for the step. If not provided, will be auto-generated.

#### invoke\_tool\_step

```python
def invoke_tool_step(*,
                     tool: str | Tool,
                     args: dict[str, Any] | None = None,
                     output_schema: type[BaseModel] | None = None,
                     step_name: str | None = None) -> PlanBuilderV2
```

Add a step that directly invokes a tool.

**Arguments**:

- `tool` - The tool to invoke. Should either be the id of the tool to call, the Tool instance
  to call, or a python function that should be called.
- `args` - The arguments to the tool. If any of these values are instances of StepOutput or
  Input, the corresponding values will be substituted in when the plan is run.
- `output_schema` - The schema of the output.
- `step_name` - Optional name for the step. If not provided, will be auto-generated.

#### function\_step

```python
def function_step(*,
                  function: Callable[..., Any],
                  args: dict[str, Any] | None = None,
                  output_schema: type[BaseModel] | None = None,
                  step_name: str | None = None) -> PlanBuilderV2
```

Add a step that directly invokes a function.

**Arguments**:

- `function` - The function to invoke.
- `args` - The arguments to the function. If any of these values are instances of StepOutput
  or Input, the corresponding values will be substituted in when the plan is run.
- `output_schema` - The schema of the output.
- `step_name` - Optional name for the step. If not provided, will be auto-generated.

#### single\_tool\_agent\_step

```python
def single_tool_agent_step(*,
                           tool: str,
                           task: str,
                           inputs: list[Any] | None = None,
                           output_schema: type[BaseModel] | None = None,
                           step_name: str | None = None) -> PlanBuilderV2
```

Add a step that uses the execution agent with a tool.

**Arguments**:

- `tool` - The tool to use.
- `task` - The task to perform.
- `inputs` - The inputs to the task. If any of these values are instances of StepOutput or
  Input, the corresponding values will be substituted in when the plan is run.
- `output_schema` - The schema of the output.
- `step_name` - Optional name for the step. If not provided, will be auto-generated.

#### user\_verify

```python
def user_verify(*,
                message: str,
                step_name: str | None = None) -> PlanBuilderV2
```

Add a step that prompts the user to verify the specified message before continuing.

This step uses a UserVerificationClarification to interact with the user - you must ensure
you have a clarification handler setup that handles this type of clarification.

If the user accepts, then the plan will continue. If the user rejects, then this step will
raise a PlanRunExitError.

**Arguments**:

- `message` - The message the user needs to verify. You can use inputs / outputs from
  previous steps in this message and the corresponding value will be substituted in when
  the plan is run - e.g.
  message=f&quot;Are you happy to proceed for user &#x27;{StepOutput(0)}&#x27;?&quot;
- `step_name` - Optional name for the step. If not provided, will be auto-generated.

#### user\_input

```python
def user_input(*,
               message: str,
               options: list[Serializable] | None = None,
               step_name: str | None = None) -> PlanBuilderV2
```

Add a step that requests input from the user and sets the response as the step output.

This step uses a UserInputClarification / MultipleChoiceClarification (depending on whether
options are specified) to interact with the user - you must ensure you have a clarification
handler setup that handles this type of clarification.

**Arguments**:

- `message` - The guidance message shown to the user. You can use inputs / outputs from
  previous steps in this message and the corresponding value will be substituted in when
  the plan is run - e.g.
  message=f&quot;Enter the value for user &#x27;{StepOutput(0)}&#x27;:&quot;
- `options` - Available options for multiple choice. If None, creates text input.
- `step_name` - Optional name for the step. If not provided, will be auto-generated.
  

**Returns**:

  Self for method chaining.

#### add\_step

```python
def add_step(step: StepV2) -> PlanBuilderV2
```

Add a pre-built step to the plan.

This can be used to add custom steps into the plan.

#### add\_steps

```python
def add_steps(plan: PlanV2 | Iterable[StepV2]) -> PlanBuilderV2
```

Add steps to the plan.

Step can be provided as a sequence or as a plan. If provided as a plan, we will also take
plan inputs from the plan, provided there are no duplicates (if there are duplicates, a
PlanBuilderError will be raised).

#### final\_output

```python
def final_output(output_schema: type[BaseModel] | None = None,
                 summarize: bool = False) -> PlanBuilderV2
```

Set the final output of the plan.

**Arguments**:

- `output_schema` - The schema for the final output. If provided, an LLM will be used to
  coerce the output to this schema.
- `summarize` - Whether to summarize the final output. If True, a summary of the final output
  will be provided along with the value.

#### build

```python
def build() -> PlanV2
```

Return the plan, ready to run.

