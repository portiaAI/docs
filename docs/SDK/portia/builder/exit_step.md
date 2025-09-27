---
sidebar_label: exit_step
title: portia.builder.exit_step
---

Exit step implementation for plan termination.

## ExitStep Objects

```python
class ExitStep(StepV2)
```

A step that causes the plan to exit gracefully.

This step allows for early termination of a plan with an optional message and error flag. When executed, the plan will stop execution and return the specified output.

**Attributes**:

- `message` - The message to include when exiting the plan.
- `error` - Whether this exit represents an error condition.

**Methods**:

- `run()` - Execute the exit step, causing the plan to terminate gracefully.
- `to_legacy_step()` - Convert this ExitStep to a legacy Step.

## ExitStepResult Objects

```python
class ExitStepResult(BaseModel)
```

Result of an ExitStep execution.

This result indicates that the plan should exit gracefully.

**Attributes**:

- `message` - The exit message to display.
- `error` - Whether this exit represents an error condition.
