---
sidebar_label: workflow
title: portia.workflow
---

Workflows are executing instances of a Plan.

A workflow encapsulates all execution state, serving as the definitive record of its progress.
As the workflow runs, its `WorkflowState`, `current_step_index`, and `outputs` evolve to reflect
the current execution state.

The workflow also retains an `ExecutionContext`, which provides valuable insights for debugging
and analytics, capturing contextual information relevant to the workflow&#x27;s execution.

Key Components
--------------
- **WorkflowState**: Tracks the current status of the workflow (e.g., NOT_STARTED, IN_PROGRESS).
- **current_step_index**: Represents the step within the plan currently being executed.
- **outputs**: Stores the intermediate and final results of the workflow.
- **ExecutionContext**: Provides contextual metadata useful for logging and performance analysis.

## WorkflowState Objects

```python
class WorkflowState(PortiaEnum)
```

The current state of the Workflow.

**Attributes**:

- `NOT_STARTED` - The workflow has not been started yet.
- `IN_PROGRESS` - The workflow is currently in progress.
- `NEED_CLARIFICATION` - The workflow requires further clarification before proceeding.
- `READY_TO_RESUME` - The workflow is ready to resume after clarifications have been resolved.
- `COMPLETE` - The workflow has been successfully completed.
- `FAILED` - The workflow has encountered an error and failed.

## WorkflowOutputs Objects

```python
class WorkflowOutputs(BaseModel)
```

Outputs of a workflow, including clarifications.

**Attributes**:

- `clarifications` _ClarificationListType_ - Clarifications raised by this workflow.
- `step_outputs` _dict[str, Output]_ - A dictionary containing outputs of individual steps.
  Outputs are indexed by the value given by the `step.output` field of the plan.
- `final_output` _Output | None_ - The final consolidated output of the workflow, if available.

## Workflow Objects

```python
class Workflow(BaseModel)
```

A workflow represents a running instance of a Plan.

**Attributes**:

- `id` _WorkflowUUID_ - A unique ID for this workflow.
- `plan_id` _PlanUUID_ - The ID of the Plan this Workflow uses.
- `current_step_index` _int_ - The current step that is being executed.
- `state` _WorkflowState_ - The current state of the workflow.
- `execution_context` _ExecutionContext_ - Execution context for the workflow.
- `outputs` _WorkflowOutputs_ - Outputs of the workflow, including clarifications.

#### get\_outstanding\_clarifications

```python
def get_outstanding_clarifications() -> ClarificationListType
```

Return all outstanding clarifications.

**Returns**:

- `ClarificationListType` - A list of outstanding clarifications that have not been resolved.

#### get\_clarifications\_for\_step

```python
def get_clarifications_for_step(
        step: int | None = None) -> ClarificationListType
```

Return clarifications for the given step.

**Arguments**:

- `step` _int | None_ - the step to get clarifications for. Defaults to current step.
  

**Returns**:

- `ClarificationListType` - A list of clarifications for the given step.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return the string representation of the workflow.

**Returns**:

- `str` - A string representation containing key workflow attributes.

## ReadOnlyWorkflow Objects

```python
class ReadOnlyWorkflow(Workflow)
```

A read-only copy of a workflow, passed to agents for reference.

This class provides a non-modifiable view of a workflow instance,
ensuring that agents can access workflow details without altering them.

#### from\_workflow

```python
@classmethod
def from_workflow(cls, workflow: Workflow) -> ReadOnlyWorkflow
```

Create a read-only workflow from a normal workflow.

**Arguments**:

- `workflow` _Workflow_ - The original workflow instance to create a read-only copy from.
  

**Returns**:

- `ReadOnlyWorkflow` - A new read-only instance of the provided workflow.

