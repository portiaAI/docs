---
sidebar_label: context
title: portia.agents.context
---

Context builder that generates contextual information for the plan_run.

This module defines a set of functions that build various types of context
required for the plan run. It takes information about inputs,
outputs, clarifications, and execution metadata to build context strings
used by the agent to perform tasks. The context can be extended with
additional system or user-provided data.

#### generate\_main\_system\_context

```python
def generate_main_system_context(
        system_context_extensions: list[str] | None = None) -> list[str]
```

Generate the main system context.

**Arguments**:

- `system_context_extensions` _list[str] | None_ - Optional list of strings to extend
  the system context.
  

**Returns**:

- `list[str]` - A list of strings representing the system context.

#### generate\_input\_context

```python
def generate_input_context(inputs: list[Variable],
                           previous_outputs: dict[str, Output]) -> list[str]
```

Generate context for the inputs and indicate which ones were used.

**Arguments**:

- `inputs` _list[Variable]_ - The list of input variables for the current step.
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

#### generate\_context\_from\_execution\_context

```python
def generate_context_from_execution_context(
        context: ExecutionContext) -> list[str]
```

Generate context from the execution context.

**Arguments**:

- `context` _ExecutionContext_ - The execution context containing metadata and additional data.
  

**Returns**:

- `list[str]` - A list of strings representing the execution context.

#### build\_context

```python
def build_context(ctx: ExecutionContext, step: Step,
                  workflow: Workflow) -> str
```

Build the context string for the agent using inputs/outputs/clarifications/ctx.

**Arguments**:

- `ctx` _ExecutionContext_ - The execution context containing agent and system metadata.
- `step` _Step_ - The current step in the workflow, including inputs.
- `workflow` _Workflow_ - The current workflow containing outputs and clarifications.
  

**Returns**:

- `str` - A string containing all relevant context information.

