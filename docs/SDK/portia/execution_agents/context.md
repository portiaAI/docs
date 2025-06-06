---
sidebar_label: context
title: portia.execution_agents.context
---

Context builder that generates contextual information for the PlanRun.

This module defines a set of functions that build various types of context
required for the run execution. It takes information about inputs,
outputs, clarifications, and execution metadata to build context strings
used by the agent to perform tasks. The context can be extended with
additional system or user-provided data.

#### generate\_main\_system\_context

```python
def generate_main_system_context() -> list[str]
```

Generate the main system context.

**Returns**:

- `list[str]` - A list of strings representing the system context.

## StepInput Objects

```python
class StepInput(BaseModel)
```

An input for a step being executed by an execution agent.

#### generate\_input\_context

```python
def generate_input_context(step_inputs: list[StepInput],
                           previous_outputs: dict[str, Output]) -> list[str]
```

Generate context for the inputs and indicate which ones were used.

**Arguments**:

- `step_inputs` _list[StepInput]_ - The list of inputs for the current step.
- `previous_outputs` _dict[str, Output]_ - A dictionary of previous step outputs.
  

**Returns**:

- `list[str]` - A list of strings representing the input context.

#### generate\_clarification\_context

```python
def generate_clarification_context(clarifications: ClarificationListType,
                                   step: int) -> list[str]
```

Generate context from clarifications for the given step.

**Arguments**:

- `clarifications` _ClarificationListType_ - A list of clarification objects.
- `step` _int_ - The step index for which clarifications are being generated.
  

**Returns**:

- `list[str]` - A list of strings representing the clarification context.

#### generate\_context\_from\_run\_context

```python
def generate_context_from_run_context(context: ToolRunContext) -> list[str]
```

Generate context from the execution context.

**Arguments**:

- `context` _ExecutionContext_ - The execution context containing metadata and additional data.
  

**Returns**:

- `list[str]` - A list of strings representing the execution context.

#### build\_context

```python
def build_context(ctx: ToolRunContext, plan_run: PlanRun,
                  step_inputs: list[StepInput]) -> str
```

Build the context string for the agent using inputs/outputs/clarifications/ctx.

**Arguments**:

- `ctx` _ToolRunContext_ - The tool run context containing agent and system metadata.
- `plan_run` _PlanRun_ - The current run containing outputs and clarifications.
- `step_inputs` _list[StepInput]_ - The inputs for the current step.
  

**Returns**:

- `str` - A string containing all relevant context information.

