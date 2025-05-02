---
sidebar_label: plan_run
title: portia.plan_run
---

Plan runs are executing instances of a Plan.

A plan run encapsulates all execution state, serving as the definitive record of its progress.
As the run runs, its `PlanRunState`, `current_step_index`, and `outputs` evolve to reflect
the current execution state.

The run also retains an `ExecutionContext`, which provides valuable insights for debugging
and analytics, capturing contextual information relevant to the run&#x27;s execution.

Key Components
--------------
- **RunState**: Tracks the current status of the run (e.g., NOT_STARTED, IN_PROGRESS).
- **current_step_index**: Represents the step within the plan currently being executed.
- **outputs**: Stores the intermediate and final results of the PlanRun.
- **ExecutionContext**: Provides contextual metadata useful for logging and performance analysis.

## PlanRunState Objects

```python
class PlanRunState(PortiaEnum)
```

The current state of the Plan Run.

**Attributes**:

- `NOT_STARTED` - The run has not been started yet.
- `IN_PROGRESS` - The run is currently in progress.
- `NEED_CLARIFICATION` - The run requires further clarification before proceeding.
- `READY_TO_RESUME` - The run is ready to resume after clarifications have been resolved.
- `COMPLETE` - The run has been successfully completed.
- `FAILED` - The run has encountered an error and failed.

## PlanRunOutputs Objects

```python
class PlanRunOutputs(BaseModel)
```

Outputs of a Plan Run including clarifications.

**Attributes**:

- `clarifications` _ClarificationListType_ - Clarifications raised by this plan run.
- `step_outputs` _dict[str, Output]_ - A dictionary containing outputs of individual steps.
  Outputs are indexed by the value given by the `step.output` field of the plan.
- `final_output` _Output | None_ - The final consolidated output of the PlanRun if available.

## PlanRun Objects

```python
class PlanRun(BaseModel)
```

A plan run represents a running instance of a Plan.

**Attributes**:

- `id` _PlanRunUUID_ - A unique ID for this plan_run.
- `plan_id` _PlanUUID_ - The ID of the Plan this run uses.
- `current_step_index` _int_ - The current step that is being executed.
- `state` _PlanRunState_ - The current state of the PlanRun.
- `execution_context` _ExecutionContext_ - Execution context for the PlanRun.
- `outputs` _PlanRunOutputs_ - Outputs of the PlanRun including clarifications.
- `plan_run_inputs` _dict[str, LocalDataValue]_ - Dict mapping plan input names to their values.

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

#### get\_potential\_step\_inputs

```python
def get_potential_step_inputs() -> dict[str, Output]
```

Return a dictionary of potential step inputs for future steps.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return the string representation of the PlanRun.

**Returns**:

- `str` - A string representation containing key run attributes.

## ReadOnlyPlanRun Objects

```python
class ReadOnlyPlanRun(PlanRun)
```

A read-only copy of a Plan Run passed to agents for reference.

This class provides a non-modifiable view of a plan run instance,
ensuring that agents can access run details without altering them.

#### from\_plan\_run

```python
@classmethod
def from_plan_run(cls, plan_run: PlanRun) -> ReadOnlyPlanRun
```

Create a read-only plan run from a normal PlanRun.

**Arguments**:

- `plan_run` _PlanRun_ - The original run instance to create a read-only copy from.
  

**Returns**:

- `ReadOnlyPlanRun` - A new read-only instance of the provided PlanRun.

