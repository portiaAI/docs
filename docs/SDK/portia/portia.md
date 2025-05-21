---
sidebar_label: portia
title: portia.portia
---

Portia classes that plan and execute runs for queries.

This module contains the core classes responsible for generating, managing, and executing plans
in response to queries. The `Portia` class serves as the main entry point, orchestrating the
planning and execution process. It uses various agents and tools to carry out tasks step by step,
saving the state of the run at each stage. It also handles error cases, clarification
requests, and run state transitions.

The `Portia` class provides methods to:

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
             tools: ToolRegistry | list[Tool] | None = None,
             execution_hooks: ExecutionHooks | None = None,
             telemetry: BaseProductTelemetry | None = None) -> None
```

Initialize storage and tools.

**Arguments**:

- `config` _Config_ - The configuration to initialize the Portia client. If not provided, the
  default configuration will be used.
- `tools` _ToolRegistry | list[Tool]_ - The registry or list of tools to use. If not
  provided, the open source tool registry will be used, alongside the default tools
  from Portia cloud if a Portia API key is set.
- `execution_hooks` _ExecutionHooks | None_ - Hooks that can be used to modify or add
  extra functionality to the run of a plan.
- `telemetry` _BaseProductTelemetry | None_ - Anonymous telemetry service.

#### initialize\_end\_user

```python
def initialize_end_user(end_user: str | EndUser | None = None) -> EndUser
```

Handle initializing the end_user based on the provided type.

#### run

```python
def run(query: str,
        tools: list[Tool] | list[str] | None = None,
        example_plans: list[Plan] | None = None,
        end_user: str | EndUser | None = None,
        plan_run_inputs: list[PlanInput] | list[dict[str, str]]
        | dict[str, str] | None = None,
        structured_output_schema: type[BaseModel] | None = None) -> PlanRun
```

End-to-end function to generate a plan and then execute it.

This is the simplest way to plan and execute a query using the SDK.

**Arguments**:

- `query` _str_ - The query to be executed.
- `tools` _list[Tool] | list[str] | None_ - List of tools to use for the query.
  If not provided all tools in the registry will be used.
- `example_plans` _list[Plan] | None_ - Optional list of example plans. If not
  provide a default set of example plans will be used.
- `end_user` _str | EndUser | None = None_ - The end user for this plan run.
  plan_run_inputs (list[PlanInput] | list[dict[str, str]] | dict[str, str] | None):
  Provides input values for the run. This can be a list of PlanInput objects, a list
  of dicts with keys &quot;name&quot;, &quot;description&quot; (optional) and &quot;value&quot;, or a dict of
  plan run input name to value.
- `structured_output_schema` _type[BaseModel] | None_ - The optional structured output schema
  for the query. This is passed on to plan runs created from this plan but will not be
  stored with the plan itself if using cloud storage and must be re-attached to the
  plan run if using cloud storage.
  

**Returns**:

- `PlanRun` - The run resulting from executing the query.

#### plan

```python
def plan(query: str,
         tools: list[Tool] | list[str] | None = None,
         example_plans: list[Plan] | None = None,
         end_user: str | EndUser | None = None,
         plan_inputs: list[PlanInput] | list[dict[str, str]] | list[str]
         | None = None,
         structured_output_schema: type[BaseModel] | None = None) -> Plan
```

Plans how to do the query given the set of tools and any examples.

**Arguments**:

- `query` _str_ - The query to generate the plan for.
- `tools` _list[Tool] | list[str] | None_ - List of tools to use for the query.
  If not provided all tools in the registry will be used.
- `example_plans` _list[Plan] | None_ - Optional list of example plans. If not
  provide a default set of example plans will be used.
- `end_user` _str | EndUser | None = None_ - The optional end user for this plan.
- `plan_inputs` _list[PlanInput] | list[dict[str, str]] | list[str] | None_ - Optional list
  of inputs required for the plan.
  This can be a list of Planinput objects, a list of dicts with keys &quot;name&quot; and
  &quot;description&quot; (optional), or a list of plan run input names. If a value is provided
  with a PlanInput object or in a dictionary, it will be ignored as values are only
  used when running the plan.
- `structured_output_schema` _type[BaseModel] | None_ - The optional structured output schema
  for the query. This is passed on to plan runs created from this plan but will be
  not be stored with the plan itself if using cloud storage and must be re-attached
  to the plan run if using cloud storage.
  

**Returns**:

- `Plan` - The plan for executing the query.
  

**Raises**:

- `PlanError` - If there is an error while generating the plan.

#### run\_plan

```python
def run_plan(
        plan: Plan | PlanUUID | UUID,
        end_user: str | EndUser | None = None,
        plan_run_inputs: list[PlanInput]
    | list[dict[str, Serializable]]
    | dict[str, Serializable]
    | None = None,
        structured_output_schema: type[BaseModel] | None = None) -> PlanRun
```

Run a plan.

**Arguments**:

- `plan` _Plan | PlanUUID | UUID_ - The plan to run, or the ID of the plan to load from
  storage.
- `end_user` _str | EndUser | None = None_ - The end user to use.
  plan_run_inputs (list[PlanInput] | list[dict[str, Serializable]] | dict[str, Serializable] | None):
  Provides input values for the run. This can be a list of PlanInput objects, a list
  of dicts with keys &quot;name&quot;, &quot;description&quot; (optional) and &quot;value&quot;, or a dict of
  plan run input name to value.
- `structured_output_schema` _type[BaseModel] | None_ - The optional structured output schema
  for the plan run. This is passed on to plan runs created from this plan but will be
  

**Returns**:

- `PlanRun` - The resulting PlanRun object.

#### resume

```python
def resume(plan_run: PlanRun | None = None,
           plan_run_id: PlanRunUUID | str | None = None) -> PlanRun
```

Resume a PlanRun.

If a clarification handler was provided as part of the execution hooks, it will be used
to handle any clarifications that are raised during the execution of the plan run.
If no clarification handler was provided and a clarification is raised, the run will be
returned in the `NEED_CLARIFICATION` state. The clarification will then need to be handled
by the caller before the plan run is resumed.

**Arguments**:

- `plan_run` _PlanRun | None_ - The PlanRun to resume. Defaults to None.
- `plan_run_id` _RunUUID | str | None_ - The ID of the PlanRun to resume. Defaults to
  None.
  

**Returns**:

- `PlanRun` - The resulting PlanRun after execution.
  

**Raises**:

- `ValueError` - If neither plan_run nor plan_run_id is provided.
- `InvalidPlanRunStateError` - If the plan run is not in a valid state to be resumed.

#### execute\_plan\_run\_and\_handle\_clarifications

```python
def execute_plan_run_and_handle_clarifications(plan: Plan,
                                               plan_run: PlanRun) -> PlanRun
```

Execute a plan run and handle any clarifications that are raised.

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

- `PlanRun` - The updated PlanRun.

#### error\_clarification

```python
def error_clarification(clarification: Clarification,
                        error: object,
                        plan_run: PlanRun | None = None) -> PlanRun
```

Mark that there was an error handling the clarification.

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

- `PlanRun` - The updated PlanRun once it is ready to be re-plan_run.
  

**Raises**:

- `InvalidRunStateError` - If the run cannot be waited for.

#### create\_plan\_run

```python
def create_plan_run(plan: Plan,
                    end_user: str | EndUser | None = None,
                    plan_run_inputs: list[PlanInput] | None = None) -> PlanRun
```

Create a PlanRun from a Plan.

**Arguments**:

- `plan` _Plan_ - The plan to create a plan run from.
- `end_user` _str | EndUser | None = None_ - The end user this plan run is for.
- `plan_run_inputs` _list[PlanInput] | None = None_ - The plan inputs for the
  plan run with their values.
  

**Returns**:

- `PlanRun` - The created PlanRun object.

