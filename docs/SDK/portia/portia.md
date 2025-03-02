---
sidebar_label: portia
title: portia.portia
---

Portia classes that plan and execute runs for queries.

<<<<<<< HEAD:docs/SDK/portia/runner.md
This module contains the core classes responsible for generating, managing, and executing workflows
in response to queries. The `Portia` instance class serves as the main entry point, orchestrating the
=======
This module contains the core classes responsible for generating, managing, and executing plans
in response to queries. The `Portia` class serves as the main entry point, orchestrating the
>>>>>>> main:docs/SDK/portia/portia.md
planning and execution process. It uses various agents and tools to carry out tasks step by step,
saving the state of the run at each stage. It also handles error cases, clarification
requests, and run state transitions.

<<<<<<< HEAD:docs/SDK/portia/runner.md
The `Portia` instance class provides methods to:
=======
The `Portia` class provides methods to:
>>>>>>> main:docs/SDK/portia/portia.md

- Generate a plan for executing a query.
- Create and manage runs.
- Execute runs step by step, using agents to handle the execution of tasks.
- Resolve clarifications required during the execution of runs.
- Wait for runs to reach a state where they can be resumed.

Modules in this file work with different storage backends (memory, disk, cloud) and can handle
complex queries using various planning and execution agent configurations.

## Portia Objects

```python
class Portia()
```

Portia client is the top level abstraction and entrypoint for most programs using the SDK.

It is responsible for intermediating planning via PlanningAgents and
execution via ExecutionAgents.

#### \_\_init\_\_

```python
def __init__(config: Config | None = None,
             tools: ToolRegistry | list[Tool] | None = None) -> None
```

Initialize storage and tools.

**Arguments**:

<<<<<<< HEAD:docs/SDK/portia/runner.md
- `config` _Config_ - The configuration to initialize the portia. If not provided, the
=======
- `config` _Config_ - The configuration to initialize the Portia client. If not provided, the
>>>>>>> main:docs/SDK/portia/portia.md
  default configuration will be used.
- `tools` _ToolRegistry | list[Tool]_ - The registry or list of tools to use. If not
  provided, the open source tool registry will be used, alongside the default tools
  from Portia cloud if a Portia API key is set.

#### run\_query

```python
def run_query(query: str,
              tools: list[Tool] | list[str] | None = None,
              example_plans: list[Plan] | None = None) -> PlanRun
```

End-to-end function to generate a plan and then execute it.

This is the simplest way to plan and execute a query using the SDK.

**Arguments**:

- `query` _str_ - The query to be executed.
- `tools` _list[Tool] | list[str] | None_ - List of tools to use for the query.
  If not provided all tools in the registry will be used.
- `example_plans` _list[Plan] | None_ - Optional list of example plans. If not
  provide a default set of example plans will be used.
  

**Returns**:

<<<<<<< HEAD:docs/SDK/portia/runner.md
- `PlanRun` - The workflow resulting from executing the query.
=======
- `PlanRun` - The run resulting from executing the query.
>>>>>>> main:docs/SDK/portia/portia.md

#### plan\_query

```python
def plan_query(query: str,
               tools: list[Tool] | list[str] | None = None,
               example_plans: list[Plan] | None = None) -> Plan
```

Plans how to do the query given the set of tools and any examples.

**Arguments**:

- `query` _str_ - The query to generate the plan for.
- `tools` _list[Tool] | list[str] | None_ - List of tools to use for the query.
  If not provided all tools in the registry will be used.
- `example_plans` _list[Plan] | None_ - Optional list of example plans. If not
  provide a default set of example plans will be used.
  

**Returns**:

- `Plan` - The plan for executing the query.
  

**Raises**:

- `PlanError` - If there is an error while generating the plan.

#### create\_plan\_run

```python
def create_plan_run(plan: Plan) -> PlanRun
```

Create a run from a Plan.

**Arguments**:

- `plan` _Plan_ - The plan to create a run from.
  

**Returns**:

<<<<<<< HEAD:docs/SDK/portia/runner.md
- `PlanRun` - The created plan_run.
=======
- `Run` - The created plan_run.
>>>>>>> main:docs/SDK/portia/portia.md

#### execute\_plan\_run

```python
def execute_plan_run(plan_run: PlanRun | None = None,
                     plan_run_id: PlanRunUUID | str | None = None) -> PlanRun
```

<<<<<<< HEAD:docs/SDK/portia/runner.md
Run a plan_run.
=======
Run a PlanRun.
>>>>>>> main:docs/SDK/portia/portia.md

**Arguments**:

- `plan_run` _PlanRun | None_ - The PlanRun to execute. Defaults to None.
- `plan_run_id` _RunUUID | str | None_ - The ID of the PlanRun to execute. Defaults to
  None.
  

**Returns**:

<<<<<<< HEAD:docs/SDK/portia/runner.md
- `PlanRun` - The resulting workflow after execution.
=======
- `PlanRun` - The resulting PlanRun after execution.
>>>>>>> main:docs/SDK/portia/portia.md
  

**Raises**:

<<<<<<< HEAD:docs/SDK/portia/runner.md
- `ValueError` - If neither workflow nor workflow_id is provided.
- `InvalidRunStateError` - If the workflow is not in a valid state to be executed.
=======
- `ValueError` - If neither plan_run nor plan_run_id is provided.
- `InvalidRunStateError` - If the plan run is not in a valid state to be executed.
>>>>>>> main:docs/SDK/portia/portia.md

#### resolve\_clarification

```python
def resolve_clarification(clarification: Clarification,
                          response: object,
                          plan_run: PlanRun | None = None) -> PlanRun
```

Resolve a clarification updating the run state as needed.

**Arguments**:

- `clarification` _Clarification_ - The clarification to resolve.
- `response` _object_ - The response to the clarification.
- `plan_run` _PlanRun | None_ - Optional - the plan run being updated.
  

**Returns**:

<<<<<<< HEAD:docs/SDK/portia/runner.md
- `PlanRun` - The updated plan_run.
=======
- `PlanRun` - The updated PlanRun.
>>>>>>> main:docs/SDK/portia/portia.md

#### wait\_for\_ready

```python
def wait_for_ready(plan_run: PlanRun,
                   max_retries: int = 6,
                   backoff_start_time_seconds: int = 7 * 60,
                   backoff_time_seconds: int = 2) -> PlanRun
```

Wait for the run to be in a state that it can be re-plan_run.

This is generally because there are outstanding clarifications that need to be resolved.

**Arguments**:

- `plan_run` _PlanRun_ - The PlanRun to wait for.
- `max_retries` _int_ - The maximum number of retries to wait for the run to be ready
  after the backoff period starts.
- `backoff_start_time_seconds` _int_ - The time after which the backoff period starts.
- `backoff_time_seconds` _int_ - The time to wait between retries after the backoff period
  starts.
  

**Returns**:

<<<<<<< HEAD:docs/SDK/portia/runner.md
- `PlanRun` - The updated workflow once it is ready to be re-run.
=======
- `PlanRun` - The updated PlanRun once it is ready to be re-plan_run.
>>>>>>> main:docs/SDK/portia/portia.md
  

**Raises**:

<<<<<<< HEAD:docs/SDK/portia/runner.md
- `InvalidRunStateError` - If the workflow cannot be waited for.
=======
- `InvalidRunStateError` - If the run cannot be waited for.
>>>>>>> main:docs/SDK/portia/portia.md

