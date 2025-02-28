---
sidebar_label: storage
title: portia.storage
---

Storage classes for managing the saving and retrieval of plans, workflows, and tool calls.

This module defines a set of storage classes that provide different backends for saving, retrieving,
and managing plans, workflows, and tool calls. These storage classes include both in-memory and
file-based storage, as well as integration with the Portia Cloud API. Each class is responsible
for handling interactions with its respective storage medium, including validating responses
and raising appropriate exceptions when necessary.

Classes:
    - Storage (Base Class): A base class that defines common interfaces for all storage types,
    ensuring consistent methods for saving and retrieving plans, workflows, and tool calls.
    - InMemoryStorage: An in-memory implementation of the `Storage` class for storing plans,
    workflows, and tool calls in a temporary, volatile storage medium.
    - FileStorage: A file-based implementation of the `Storage` class for storing plans, workflows,
      and tool calls as local files in the filesystem.
    - PortiaCloudStorage: A cloud-based implementation of the `Storage` class that interacts with
    the Portia Cloud API to save and retrieve plans, workflows, and tool call records.

Each storage class handles the following tasks:
    - Sending and receiving data to its respective storage medium - memory, file system, or API.
    - Validating responses from storage and raising errors when necessary.
    - Handling exceptions and re-raising them as custom `StorageError` exceptions to provide
    more informative error handling.

## PlanStorage Objects

```python
class PlanStorage(ABC)
```

Abstract base class for storing and retrieving plans.

Subclasses must implement the methods to save and retrieve plans.

**Methods**:

  save_plan(self, plan: Plan) -&gt; None:
  Save a plan.
  get_plan(self, plan_id: PlanUUID) -&gt; Plan:
  Get a plan by ID.

#### save\_plan

```python
@abstractmethod
def save_plan(plan: Plan) -> None
```

Save a plan.

**Arguments**:

- `plan` _Plan_ - The Plan object to save.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

#### get\_plan

```python
@abstractmethod
def get_plan(plan_id: PlanUUID) -> Plan
```

Retrieve a plan by its ID.

**Arguments**:

- `plan_id` _PlanUUID_ - The UUID of the plan to retrieve.
  

**Returns**:

- `Plan` - The Plan object associated with the provided plan_id.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

## WorkflowListResponse Objects

```python
class WorkflowListResponse(BaseModel)
```

Response for the get_plan_runs operation. Can support pagination.

## WorkflowStorage Objects

```python
class WorkflowStorage(ABC)
```

Abstract base class for storing and retrieving workflows.

Subclasses must implement the methods to save and retrieve workflows.

**Methods**:

  save_workflow(self, workflow: Workflow) -&gt; None:
  Save a plan_run.
  get_plan_run(self, workflow_id: WorkflowUUID) -&gt; Workflow:
  Get a workflow by ID.
  get_plan_runs(self, run_state: RunState | None = None, page=int | None = None)
  -&gt; WorkflowListResponse:
  Return workflows that match the given run_state

#### save\_workflow

```python
@abstractmethod
def save_workflow(workflow: Workflow) -> None
```

Save a plan_run.

**Arguments**:

- `workflow` _Workflow_ - The Workflow object to save.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

#### get\_workflow

```python
@abstractmethod
def get_plan_run(workflow_id: WorkflowUUID) -> Workflow
```

Retrieve a workflow by its ID.

**Arguments**:

- `workflow_id` _WorkflowUUID_ - The UUID of the workflow to retrieve.
  

**Returns**:

- `PlanRun` - The Workflow object associated with the provided workflow_id.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

#### get\_workflows

```python
@abstractmethod
def get_plan_runs(run_state: RunState | None = None,
                  page: int | None = None) -> WorkflowListResponse
```

List workflows by their state.

**Arguments**:

- `run_state` _RunState | None_ - Optionally filter workflows by their state.
- `page` _int | None_ - Optional pagination data
  

**Returns**:

- `list[Workflow]` - A list of Workflow objects that match the given state.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

## AdditionalStorage Objects

```python
class AdditionalStorage(ABC)
```

Abstract base class for additional storage.

Subclasses must implement the methods.

**Methods**:

  save_tool_call(self, tool_call: ToolCallRecord) -&gt; None:
  Save a tool_call.

#### save\_tool\_call

```python
@abstractmethod
def save_tool_call(tool_call: ToolCallRecord) -> None
```

Save a ToolCall.

**Arguments**:

- `tool_call` _ToolCallRecord_ - The ToolCallRecord object to save.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

## LogAdditionalStorage Objects

```python
class LogAdditionalStorage(AdditionalStorage)
```

AdditionalStorage that logs calls rather than persisting them.

Useful for storages that don&#x27;t care about tool_calls etc.

#### save\_tool\_call

```python
def save_tool_call(tool_call: ToolCallRecord) -> None
```

Log the tool call.

**Arguments**:

- `tool_call` _ToolCallRecord_ - The ToolCallRecord object to log.

## Storage Objects

```python
class Storage(PlanStorage, WorkflowStorage, AdditionalStorage)
```

Combined base class for Plan Workflow + Additional storages.

## InMemoryStorage Objects

```python
class InMemoryStorage(PlanStorage, WorkflowStorage, LogAdditionalStorage)
```

Simple storage class that keeps plans + workflows in memory.

Tool Calls are logged via the LogAdditionalStorage.

#### \_\_init\_\_

```python
def __init__() -> None
```

Initialize Storage.

#### save\_plan

```python
def save_plan(plan: Plan) -> None
```

Add plan to dict.

**Arguments**:

- `plan` _Plan_ - The Plan object to save.

#### get\_plan

```python
def get_plan(plan_id: PlanUUID) -> Plan
```

Get plan from dict.

**Arguments**:

- `plan_id` _PlanUUID_ - The UUID of the plan to retrieve.
  

**Returns**:

- `Plan` - The Plan object associated with the provided plan_id.
  

**Raises**:

- `PlanNotFoundError` - If the plan is not found.

#### save\_workflow

```python
def save_workflow(workflow: Workflow) -> None
```

Add workflow to dict.

**Arguments**:

- `workflow` _Workflow_ - The Workflow object to save.

#### get\_workflow

```python
def get_plan_run(workflow_id: WorkflowUUID) -> Workflow
```

Get workflow from dict.

**Arguments**:

- `workflow_id` _WorkflowUUID_ - The UUID of the workflow to retrieve.
  

**Returns**:

- `PlanRun` - The Workflow object associated with the provided workflow_id.
  

**Raises**:

- `WorkflowNotFoundError` - If the workflow is not found.

#### get\_workflows

```python
def get_plan_runs(run_state: RunState | None = None,
                  page: int | None = None) -> WorkflowListResponse
```

Get workflow from dict.

**Arguments**:

- `run_state` _RunState | None_ - Optionally filter workflows by their state.
- `page` _int | None_ - Optional pagination data which is not used for in memory storage.
  

**Returns**:

- `list[Workflow]` - A list of Workflow objects that match the given state.

## DiskFileStorage Objects

```python
class DiskFileStorage(PlanStorage, WorkflowStorage, LogAdditionalStorage)
```

Disk-based implementation of the Storage interface.

Stores serialized Plan and Workflow objects as JSON files on disk.

#### \_\_init\_\_

```python
def __init__(storage_dir: str | None) -> None
```

Set storage dir.

**Arguments**:

- `storage_dir` _str | None_ - Optional directory for storing files.

#### save\_plan

```python
def save_plan(plan: Plan) -> None
```

Save a Plan object to the storage.

**Arguments**:

- `plan` _Plan_ - The Plan object to save.

#### get\_plan

```python
def get_plan(plan_id: PlanUUID) -> Plan
```

Retrieve a Plan object by its ID.

**Arguments**:

- `plan_id` _PlanUUID_ - The ID of the Plan to retrieve.
  

**Returns**:

- `Plan` - The retrieved Plan object.
  

**Raises**:

- `PlanNotFoundError` - If the Plan is not found or validation fails.

#### save\_workflow

```python
def save_workflow(workflow: Workflow) -> None
```

Save a Workflow object to the storage.

**Arguments**:

- `workflow` _Workflow_ - The Workflow object to save.

#### get\_workflow

```python
def get_plan_run(workflow_id: WorkflowUUID) -> Workflow
```

Retrieve a Workflow object by its ID.

**Arguments**:

- `workflow_id` _WorkflowUUID_ - The ID of the Workflow to retrieve.
  

**Returns**:

- `PlanRun` - The retrieved Workflow object.
  

**Raises**:

- `WorkflowNotFoundError` - If the Workflow is not found or validation fails.

#### get\_workflows

```python
def get_plan_runs(run_state: RunState | None = None,
                  page: int | None = None) -> WorkflowListResponse
```

Find all workflows in storage that match state.

**Arguments**:

- `run_state` _RunState | None_ - Optionally filter workflows by their state.
- `page` _int | None_ - Optional pagination data which is not used for in memory storage.
  

**Returns**:

- `list[Workflow]` - A list of Workflow objects that match the given state.

## PortiaCloudStorage Objects

```python
class PortiaCloudStorage(Storage)
```

Save plans, workflows and tool calls to portia cloud.

#### \_\_init\_\_

```python
def __init__(config: Config) -> None
```

Initialize the PortiaCloudStorage instance.

**Arguments**:

- `config` _Config_ - The configuration containing API details for Portia Cloud.

#### check\_response

```python
def check_response(response: httpx.Response) -> None
```

Validate the response from Portia API.

**Arguments**:

- `response` _httpx.Response_ - The response from the Portia API to check.
  

**Raises**:

- `StorageError` - If the response from the Portia API indicates an error.

#### save\_plan

```python
def save_plan(plan: Plan) -> None
```

Save a plan to Portia Cloud.

**Arguments**:

- `plan` _Plan_ - The Plan object to save to the cloud.
  

**Raises**:

- `StorageError` - If the request to Portia Cloud fails.

#### get\_plan

```python
def get_plan(plan_id: PlanUUID) -> Plan
```

Retrieve a plan from Portia Cloud.

**Arguments**:

- `plan_id` _PlanUUID_ - The ID of the plan to retrieve.
  

**Returns**:

- `Plan` - The Plan object retrieved from Portia Cloud.
  

**Raises**:

- `StorageError` - If the request to Portia Cloud fails or the plan does not exist.

#### save\_workflow

```python
def save_workflow(workflow: Workflow) -> None
```

Save a workflow to Portia Cloud.

**Arguments**:

- `workflow` _Workflow_ - The Workflow object to save to the cloud.
  

**Raises**:

- `StorageError` - If the request to Portia Cloud fails.

#### get\_workflow

```python
def get_plan_run(workflow_id: WorkflowUUID) -> Workflow
```

Retrieve a workflow from Portia Cloud.

**Arguments**:

- `workflow_id` _WorkflowUUID_ - The ID of the workflow to retrieve.
  

**Returns**:

- `PlanRun` - The Workflow object retrieved from Portia Cloud.
  

**Raises**:

- `StorageError` - If the request to Portia Cloud fails or the workflow does not exist.

#### get\_workflows

```python
def get_plan_runs(run_state: RunState | None = None,
                  page: int | None = None) -> WorkflowListResponse
```

Find all workflows in storage that match state.

**Arguments**:

- `run_state` _RunState | None_ - Optionally filter workflows by their state.
- `page` _int | None_ - Optional pagination data which is not used for in memory storage.
  

**Returns**:

- `list[Workflow]` - A list of Workflow objects retrieved from Portia Cloud.
  

**Raises**:

- `StorageError` - If the request to Portia Cloud fails.

#### save\_tool\_call

```python
def save_tool_call(tool_call: ToolCallRecord) -> None
```

Save a tool call to Portia Cloud.

**Arguments**:

- `tool_call` _ToolCallRecord_ - The ToolCallRecord object to save to the cloud.
  

**Raises**:

- `StorageError` - If the request to Portia Cloud fails.

