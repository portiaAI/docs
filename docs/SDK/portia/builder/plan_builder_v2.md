---
sidebar_label: plan_builder_v2
title: portia.builder.plan_builder_v2
---

Builder class for constructing :class:`PlanV2` instances.

You can view an example of this class in use in example_builder.py.

## PlanBuilderError Objects

```python
class PlanBuilderError(ValueError)
```

Error in Plan definition.

## PlanBuilderV2 Objects

```python
class PlanBuilderV2()
```

Chainable builder used to assemble Portia plans.

See example_builder.py for a complete example of how to use this class.

#### \_\_init\_\_

```python
def __init__(label: str = "Run the plan built with the Plan Builder") -> None
```

Initialize the builder.

**Arguments**:

- `label` - Human readable label for the plan shown in the Portia dashboard.

#### input

```python
def input(*,
          name: str,
          description: str | None = None,
          default_value: Any | None = None) -> PlanBuilderV2
```

Add an input required by the plan.

Inputs are values that are provided when running the plan, rather than when building the
plan. You specify them with this .input() method when building the plan, and you can then
use the value in the plan by using Input() references in your plan steps. Then, when you run
the plan, you can pass in the value for the input and the references will all be substituted
with the value.

**Arguments**:

- `name` - Name of the input.
- `description` - Optional description for the input. This can be useful when describing what
  the input is used for, both to human users and when passing the input into language
  models.
- `default_value` - Optional default value to be used if no value is provided when running
  the plan.

#### loop

```python
def loop(while_: Callable[..., bool] | str | None = None,
         do_while_: Callable[..., bool] | str | None = None,
         over: Reference | Sequence[Any] | None = None,
         args: dict[str, Any] | None = None,
         step_name: str | None = None) -> PlanBuilderV2
```

Start a new loop block.

This creates a loop that can iterate over a sequence of values or repeat while a condition
is true. You must specify exactly one of the loop types: while_, do_while_, or over.

For &#x27;while&#x27; loops, the condition is checked before each iteration:
PlanBuilderV2()
.loop(while_=lambda: some_condition)
.llm_step(task=&quot;Repeats while true&quot;)
.end_loop()

For &#x27;do_while&#x27; loops, the condition is checked after each iteration:
PlanBuilderV2()
.loop(do_while_=lambda: some_condition)
.llm_step(task=&quot;Runs at least once&quot;)
.end_loop()

For &#x27;for_each&#x27; loops, iterate over a sequence or reference:
PlanBuilderV2().loop(over=Input(&quot;items&quot;)).llm_step(task=&quot;Process each item&quot;).end_loop()

After opening a loop block with this loop method, you must close the block with
.end_loop() later in the plan.

**Arguments**:

- `while_` - Condition function or string to check before each iteration. The loop continues
  while this condition evaluates to True.
- `do_while_` - Condition function or string to check after each iteration. The loop
  continues while this condition evaluates to True, but always runs at least once.
- `over` - Reference or sequence to iterate over. Each iteration will process one item
  from this sequence.
- `args` - Arguments passed to condition functions if they are functions. These are unused
  if the condition is a string.
- `step_name` - Optional explicit name for the step. This allows its output to be referenced
  via StepOutput(&quot;name_of_step&quot;) rather than by index.

#### end\_loop

```python
def end_loop(step_name: str | None = None) -> PlanBuilderV2
```

Close the most recently opened loop block.

This method must be called to properly close any loop block that was opened with
loop(). It marks the end of the loop logic and allows the plan to continue with
steps outside the loop. For example:

# Simple while loop
PlanBuilderV2().loop(while_=lambda: some_condition).llm_step(task=&quot;Repeats&quot;).end_loop()
.llm_step(task=&quot;Runs after loop&quot;)

# For-each loop over input items
PlanBuilderV2().loop(over=Input(&quot;items&quot;)).llm_step(task=&quot;Process item&quot;).end_loop()
.llm_step(task=&quot;Runs after all items processed&quot;)

Failing to call end_loop() after opening a loop block with loop() will result in an
error when building the plan.

**Arguments**:

- `step_name` - Optional explicit name for the step. This allows its output to be referenced
  via StepOutput(&quot;name_of_step&quot;) rather than by index.

#### if\_

```python
def if_(condition: Callable[..., bool] | str,
        args: dict[str, Any] | None = None) -> PlanBuilderV2
```

Start a new conditional block.

Steps after this if (and before any else, else_if, or endif) are executed only when the
`condition` evaluates to `True`. For example:

# This will run the llm step
PlanBuilderV2().if_(condition=lambda: True).llm_step(task=&quot;Will run&quot;).endif()

# This will not run the llm step
PlanBuilderV2().if_(condition=lambda: False).llm_step(task=&quot;Won&#x27;t run&quot;).endif()

After opening a conditional block with this if_ method, you must close the block with
.endif() later in the plan.

Note: it is if_() rather than if() because if is a keyword in Python.

**Arguments**:

- `condition` - Condition to evaluate. This can either be a function that returns a boolean
  (as with a traditional if statement) or a string that is evaluated for truth using a
  language model.
- `args` - Arguments passed to the condition function if it is a function. These are unused
  if the condition is a string.

#### else\_if\_

```python
def else_if_(condition: Callable[..., bool],
             args: dict[str, Any] | None = None) -> PlanBuilderV2
```

Add an `else if` clause to the current conditional block.

Steps after this else_if (and before any &#x27;else&#x27; or &#x27;endif&#x27;) are executed only when the
`condition` evaluates to `True` and any previous conditions (&#x27;if&#x27; or &#x27;else if&#x27;) have been
evaluated to False. For example:

# This will run the llm step
PlanBuilderV2().if_(condition=lambda: False).else_if_(condition=lambda: True)
.llm_step(task=&quot;Will run&quot;).endif()

# This will not run the llm step
PlanBuilderV2().if_(condition=lambda: False).else_if_(condition=lambda: True)
.llm_step(task=&quot;Won&#x27;t run&quot;).endif()

# This will not run the llm step
PlanBuilderV2().if_(condition=lambda: True).else_if_(condition=lambda: True)
.llm_step(task=&quot;Won&#x27;t run&quot;).endif()

You must ensure that this conditional block is closed with an endif() call later in
the plan.

Note: it is else_if_() rather than else_if() to match if_ and else_, which must have an
underscore because they are keywords in Python.

**Arguments**:

- `condition` - Condition to evaluate. This can either be a function that returns a boolean
  (as with a traditional if statement) or a string that is evaluated for truth using a
  language model.
- `args` - Arguments passed to the condition function if it is a function. These are unused
  if the condition is a string.

#### else\_

```python
def else_() -> PlanBuilderV2
```

Add an `else` clause to the current conditional block.

Steps after this else (and before any &#x27;endif&#x27;) are executed only when all previous
conditions (&#x27;if&#x27; and any &#x27;else if&#x27;) have been evaluated to False. For example:

# This will run the llm step in the else clause
PlanBuilderV2().if_(condition=lambda: False).llm_step(task=&quot;Won&#x27;t run&quot;)
.else_().llm_step(task=&quot;Will run&quot;).endif()

# This will not run the llm step in the else clause
PlanBuilderV2().if_(condition=lambda: True).llm_step(task=&quot;Will run&quot;)
.else_().llm_step(task=&quot;Won&#x27;t run&quot;).endif()

You must ensure that this conditional block is closed with an endif() call later in
the plan.

Note: it is else_() rather than else() because else is a keyword in Python.

#### endif

```python
def endif() -> PlanBuilderV2
```

Close the most recently opened conditional block.

This method must be called to properly close any conditional block that was opened with
if_(). It marks the end of the conditional logic and allows the plan to continue with
unconditional steps. For example:

__Simple if-endif block__

PlanBuilderV2().if_(condition=lambda: False).llm_step(task=&quot;Won&#x27;t run&quot;).endif()
.llm_step(task=&quot;Will run&quot;)

__Complex if-else_if-else-endif block__

PlanBuilderV2().if_(condition=lambda: False).llm_step(task=&quot;Won&#x27;t run&quot;)
.else_if_(condition=lambda: False).llm_step(task=&quot;Won&#x27;t run&quot;)
.else_().llm_step(task=&quot;Will run&quot;)
.endif()
.llm_step(task=&quot;Always runs after conditional&quot;)

Failing to call endif() after opening a conditional block with if_() will result in an
error when building the plan.

#### llm\_step

```python
def llm_step(*,
             task: str,
             inputs: list[Any] | None = None,
             output_schema: type[BaseModel] | None = None,
             step_name: str | None = None,
             system_prompt: str | None = None) -> PlanBuilderV2
```

Add a step that sends a task to an LLM.

The output from the step is a string (if no output schema is provided) or a structured
object (if an output schema is provided).

This just calls a raw LLM without access to tools. If you need to call tools, either use
a single_tool_agent_step(), a react_agent_step() or an invoke_tool_step().

**Arguments**:

- `task` - Instruction given to the LLM.
- `inputs` - Optional additional context for the LLM. Values may reference
  previous step outputs or plan inputs.
- `output_schema` - Expected schema of the result.
- `step_name` - Optional explicit name for the step. This allows its output to be referenced
  via StepOutput(&quot;name_of_step&quot;) rather than by index.
- `system_prompt` - Optional system prompt for the LLM - allows overriding the default system
  prompt.

#### invoke\_tool\_step

```python
def invoke_tool_step(*,
                     tool: str | Tool,
                     args: dict[str, Any] | None = None,
                     output_schema: type[BaseModel] | None = None,
                     step_name: str | None = None) -> PlanBuilderV2
```

Add a step that invokes a tool directly.

This is a raw tool call without any LLM involvement. The args passed into this method have
any references resoled (e.g. Input or StepOutput) and are then directly used to call the
tool. This should be used when you know the exact arguments you want to pass the tool, and
you want to avoid the latency / non-determinism of using an LLM.

**Arguments**:

- `tool` - The id of the tool to invoke, or the Tool instance to invoke.
- `args` - Arguments passed to the tool. This can include references such as Input and
  StepOutput whose values are resolved at runtime.
- `output_schema` - Schema of the result. If the tool does not provide a result of this type,
  then a language model will be used to coerce the output into this schema..
- `step_name` - Optional explicit name for the step. This allows its output to be referenced
  via StepOutput(&quot;name_of_step&quot;) rather than by index.

#### function\_step

```python
def function_step(*,
                  function: Callable[..., Any],
                  args: dict[str, Any] | None = None,
                  output_schema: type[BaseModel] | None = None,
                  step_name: str | None = None) -> PlanBuilderV2
```

Add a step that calls a Python function.

This step directly calls a python function without any LLM involvement. It is useful for
incorporating custom logic, calculations, or data transformations into your plan.

The function is called synchronously if it&#x27;s a regular function, or awaited if it&#x27;s
an async function.

**Arguments**:

- `function` - The Python function to call. Can be sync or async.
- `args` - Arguments passed to the function as keyword arguments. This can include
  references such as Input and StepOutput whose values are resolved at runtime.
- `output_schema` - Schema for the result. If provided and the function output doesn&#x27;t
  match, a language model will be used to coerce the output into this schema.
- `step_name` - Optional explicit name for the step. This allows its output to be
  referenced via StepOutput(&quot;name_of_step&quot;) rather than by index.

#### single\_tool\_agent\_step

```python
def single_tool_agent_step(*,
                           tool: str,
                           task: str,
                           inputs: list[Any] | None = None,
                           output_schema: type[BaseModel] | None = None,
                           step_name: str | None = None) -> PlanBuilderV2
```

Add a step where an agent uses a single tool to complete a task.

This creates an LLM agent that has access to exactly one tool and uses it once to complete
the specified task. The agent can reason about how to use the tool. This is more flexible
than invoke_tool_step() because the agent can adapt its tool usage based on the task and
inputs. Use this when you know which tool should be used, but want the agent to determine
the specific arguments.

This step outputs the result of the tool call if output schema is not provided. If an output
schema is provided, then the agent will coerce the result of the tool call to match this
schema.

**Arguments**:

- `tool` - The id of the tool the agent can use to complete the task.
- `task` - Natural language description of what the agent should accomplish.
- `inputs` - Optional context data for the agent. This can include references such as
  Input and StepOutput whose values are resolved at runtime and provided as
  context to the agent.
- `output_schema` - Schema for the result. If provided, the agent will structure its
  output to match this schema.
- `step_name` - Optional explicit name for the step. This allows its output to be
  referenced via StepOutput(&quot;name_of_step&quot;) rather than by index.

#### react\_agent\_step

```python
def react_agent_step(*,
                     task: str,
                     tools: list[str] | None = None,
                     inputs: list[Any] | None = None,
                     output_schema: type[BaseModel] | None = None,
                     step_name: str | None = None,
                     allow_agent_clarifications: bool = False,
                     tool_call_limit: int = 25) -> PlanBuilderV2
```

Add a step that uses a ReAct agent with multiple tools.

The ReAct agent uses reasoning and acting cycles to complete complex tasks
that may require multiple tool calls and decision making.

**Arguments**:

- `task` - The task to perform.
- `tools` - The list of tool IDs to make available to the agent.
- `inputs` - The inputs to the task. If any of these values are instances of StepOutput or
  Input, the corresponding values will be substituted in when the plan is run.
- `output_schema` - The schema of the output.
- `step_name` - Optional name for the step. If not provided, will be auto-generated.
- `allow_agent_clarifications` - Whether to allow the agent to ask clarifying questions.
- `tool_call_limit` - Maximum number of tool calls the agent can make.

#### user\_verify

```python
def user_verify(*,
                message: str,
                step_name: str | None = None) -> PlanBuilderV2
```

Add a user confirmation step.

This pauses plan execution and asks the user to confirm or reject the provided
message. The plan will only continue if the user confirms. If the user rejects,
the plan execution will stop with an error. This is useful for getting user approval before
taking important actions like sending emails, making purchases, or modifying data.

A UserVerificationClarification is used to get the verification from the user, so ensure you
have set up handling for this type of clarification in order to use this step. For more
details, see https://docs.portialabs.ai/understand-clarifications.

This step outputs True if the user confirms.

**Arguments**:

- `message` - Text shown to the user for confirmation. This can include references
  such as Input and StepOutput whose values are resolved at runtime before
  being shown to the user.
- `step_name` - Optional explicit name for the step. This allows its output to be
  referenced via StepOutput(&quot;name_of_step&quot;) rather than by index.

#### user\_input

```python
def user_input(*,
               message: str,
               options: list[Serializable] | None = None,
               step_name: str | None = None) -> PlanBuilderV2
```

Add a step that requests input from the user.

This pauses plan execution and prompts the user to provide input. If options are
provided, the user must choose from the given choices (multiple choice). If no
options are provided, the user can enter free-form text.

A Clarification (either InputClarification or MultipleChoiceClarification) is used to get
the input from the user, so ensure you have set up handling for the required type of
clarification in order to use this step. For more details, see
https://docs.portialabs.ai/understand-clarifications.

The user&#x27;s response becomes the output of this step and can be referenced by
subsequent steps in the plan.

**Arguments**:

- `message` - Instruction or question shown to the user. This can include references
  such as Input and StepOutput whose values are resolved at runtime before
  being shown to the user.
- `options` - List of choices for multiple choice prompts. If None, the user can
  provide free-form text input. If provided, the user must select from
  these options.
- `step_name` - Optional explicit name for the step. This allows its output to be
  referenced via StepOutput(&quot;name_of_step&quot;) rather than by index.

#### add\_step

```python
def add_step(step: StepV2) -> PlanBuilderV2
```

Add a pre-built step to the plan.

This allows you to integrate custom step types that you&#x27;ve created by subclassing
StepV2, or to reuse steps that were created elsewhere. The step is added as-is
to the plan without any modification.

**Arguments**:

- `step` - A pre-built step instance that inherits from StepV2.

#### add\_steps

```python
def add_steps(plan: PlanV2 | Iterable[StepV2],
              input_values: dict[str, Any] | None = None) -> PlanBuilderV2
```

Add multiple steps or merge another plan into this builder.

This allows you to compose plans by merging smaller plans together, or to add
a sequence of pre-built steps all at once. When merging a PlanV2, both the
steps and the plan inputs are merged into the current builder.

This is useful for creating reusable sub-plans that can be incorporated into
larger workflows.

**Arguments**:

- `plan` - Either a complete PlanV2 to merge (including its steps and inputs),
  or any iterable of StepV2 instances to add to the current plan.
- `input_values` - Optional mapping of inputs in the sub-plan to values. This is
  only used when plan is a PlanV2, and is useful if a sub-plan has an input
  and you want to provide a value for it from a step in the top-level plan.
  For example:
  
    ```python
        sub_plan = builder.input(name="input_name").build()
        top_plan = builder.llm_step(step_name="llm_step", task="Task")
                   .add_steps(sub_plan, input_values={"input_name": StepOutput("llm_step")})
                   .build()
    ```
  
- `input_values` - Optional mapping of input names to default values. Only used
  when plan is a PlanV2. These values will be set as default values for
  the corresponding plan inputs.
  

**Raises**:

- `PlanBuilderError` - If duplicate input names are detected when merging plans,
  or if you try to provide values for inputs that don&#x27;t exist in the
  sub-plan.

#### final\_output

```python
def final_output(output_schema: type[BaseModel] | None = None,
                 summarize: bool = False) -> PlanBuilderV2
```

Define the final output schema for the plan.

This configures how the plan&#x27;s final result should be structured. The final output is
automatically derived from the last step&#x27;s output, but if output_schema is provided and
the last step&#x27;s output does not already match this schema, an LLM will be used to coerce
the output into this schema. If summarize is True, a summary of the plan run will also be
included as part of the final output.

**Arguments**:

- `output_schema` - Pydantic model class that defines the structure of the final
  output.
- `summarize` - Whether to also generate a human-readable summary of the final
  output in addition to the structured result.

#### build

```python
def build() -> PlanV2
```

Finalize and return the built plan.

**Raises**:

- `PlanBuilderError` - If there are any issues when building the plan (e.g. an if block is
  opened without being closed).

