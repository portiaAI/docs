---
sidebar_label: runner
title: portia.runner
---

Runner classes that plan and execute workflows for queries.

This module contains the core classes responsible for generating, managing, and executing workflows
in response to queries. The `Runner` class serves as the main entry point, orchestrating the
planning and execution process. It uses various agents and tools to carry out tasks step by step,
saving the state of the workflow at each stage. It also handles error cases, clarification
requests, and workflow state transitions.

The `Runner` class provides methods to:

- Generate a plan for executing a query.
- Create and manage workflows.
- Execute workflows step by step, using agents to handle the execution of tasks.
- Resolve clarifications required during the execution of workflows.
- Wait for workflows to reach a state where they can be resumed.

Modules in this file work with different storage backends (memory, disk, cloud) and can handle
complex queries using various planner and agent configurations.

## Runner Objects

```python
class Runner()
```

Runner class is the top level abstraction and entrypoint for most programs using the SDK.

The runner is responsible for intermediating planning via Planners and execution via Agents.

#### \_\_init\_\_

```python
def __init__(config: Config, tools: ToolRegistry | list[Tool]) -> None
```

Initialize storage and tools.

**Arguments**:

- `config` _Config_ - The configuration to initialize the runner.
- `tools` _ToolRegistry | list[Tool]_ - The registry or list of tools to use.

#### execute\_query

```python
def execute_query(query: str,
                  tools: list[Tool] | list[str] | None = None,
                  example_plans: list[Plan] | None = None) -> Workflow
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

- `Workflow` - The workflow resulting from executing the query.

#### generate\_plan

```python
def generate_plan(query: str,
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

#### create\_workflow

```python
def create_workflow(plan: Plan) -> Workflow
```

Create a workflow from a Plan.

**Arguments**:

- `plan` _Plan_ - The plan to create a workflow from.
  

**Returns**:

- `Workflow` - The created workflow.

#### execute\_workflow

```python
def execute_workflow(
        workflow: Workflow | None = None,
        workflow_id: WorkflowUUID | str | None = None) -> Workflow
```

Run a workflow.

**Arguments**:

- `workflow` _Workflow | None_ - The workflow to execute. Defaults to None.
- `workflow_id` _WorkflowUUID | str | None_ - The ID of the workflow to execute. Defaults to
  None.
  

**Returns**:

- `Workflow` - The resulting workflow after execution.
  

**Raises**:

- `ValueError` - If neither workflow nor workflow_id is provided.
- `InvalidWorkflowStateError` - If the workflow is not in a valid state to be executed.

#### resolve\_clarification

```python
def resolve_clarification(clarification: Clarification,
                          response: object,
                          workflow: Workflow | None = None) -> Workflow
```

Resolve a clarification updating the workflow state as needed.

**Arguments**:

- `clarification` _Clarification_ - The clarification to resolve.
- `response` _object_ - The response to the clarification.
- `workflow` _Workflow | None_ - Optional - the workflow being updated.
  

**Returns**:

- `Workflow` - The updated workflow.

#### wait\_for\_ready

```python
def wait_for_ready(workflow: Workflow,
                   max_retries: int = 6,
                   backoff_start_time_seconds: int = 7 * 60,
                   backoff_time_seconds: int = 2) -> Workflow
```

Wait for the workflow to be in a state that it can be re-run.

This is generally because there are outstanding clarifications that need to be resolved.

**Arguments**:

- `workflow` _Workflow_ - The workflow to wait for.
- `max_retries` _int_ - The maximum number of retries to wait for the workflow to be ready
  after the backoff period starts.
- `backoff_start_time_seconds` _int_ - The time after which the backoff period starts.
- `backoff_time_seconds` _int_ - The time to wait between retries after the backoff period
  starts.
  

**Returns**:

- `Workflow` - The updated workflow once it is ready to be re-run.
  

**Raises**:

- `InvalidWorkflowStateError` - If the workflow cannot be waited for.

