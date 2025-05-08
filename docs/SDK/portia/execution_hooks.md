---
sidebar_label: execution_hooks
title: portia.execution_hooks
---

Execution hooks for customizing the behavior of portia during execution.

## ExecutionHooks Objects

```python
class ExecutionHooks(BaseModel)
```

Hooks that can be used to modify or add extra functionality to the run of a plan.

Hooks can be registered for various execution events:
- clarification_handler: A handler for clarifications raised during execution
- before_step_execution: Called before executing each step
- after_step_execution: Called after executing each step. When there&#x27;s an error, this is
    called with the error as the output value.
- before_first_step_execution: Called before executing the first step
- after_last_step_execution: Called after executing the last step of the plan run. This is not
    called if a clarification is raised, as it is expected that the plan will be resumed after
    the clarification is handled.
- before_tool_call: Called before the tool is called
- after_tool_call: Called after the tool is called

#### clarification\_handler

Handler for clarifications raised during execution.

#### before\_step\_execution

Called before executing each step.

**Arguments**:

- `plan` - The plan being executed
- `plan_run` - The current plan run
- `step` - The step about to be executed

#### after\_step\_execution

Called after executing each step.

When there&#x27;s an error, this is called with the error as the output value.

**Arguments**:

- `plan` - The plan being executed
- `plan_run` - The current plan run
- `step` - The step that was executed
- `output` - The output from the step execution

#### before\_first\_step\_execution

Called before executing the first step.

**Arguments**:

- `plan` - The plan being executed
- `plan_run` - The current plan run

#### after\_last\_step\_execution

Called after executing the last step of the plan run.

This is not called if a clarification is raised, as it is expected that the plan
will be resumed after the clarification is handled.

**Arguments**:

- `plan` - The plan that was executed
- `plan_run` - The completed plan run
- `output` - The final output from the plan execution

#### before\_tool\_call

Called before the tool is called.

**Arguments**:

- `tool` - The tool about to be called
- `args` - The args for the tool call
- `plan_run` - The current plan run
- `step` - The step being executed
  

**Returns**:

  Clarification | None: A clarification to raise, or None to proceed with the tool call

#### after\_tool\_call

Called after the tool is called.

**Arguments**:

- `tool` - The tool that was called
- `output` - The output returned from the tool call
- `plan_run` - The current plan run
- `step` - The step being executed
  

**Returns**:

  Clarification | None: A clarification to raise, or None to proceed. If a clarification
  is raised, when we later resume the plan, the same step will be executed again

#### log\_step\_outputs

```python
def log_step_outputs(plan: Plan, plan_run: PlanRun, step: Step,
                     output: Output) -> None
```

Log the output of a step in the plan.

