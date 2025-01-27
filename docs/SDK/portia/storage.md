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

Methods:
    save_plan(self, plan: Plan) -&gt; None:
        Save a plan.
    get_plan(self, plan_id: UUID) -&gt; Plan:
        Get a plan by ID.

#### save\_plan

```python
@abstractmethod
def save_plan(plan: Plan) -> None
```

Save a plan.

Args:
    plan (Plan): The Plan object to save.

Raises:
    NotImplementedError: If the method is not implemented.

#### get\_plan

```python
@abstractmethod
def get_plan(plan_id: UUID) -> Plan
```

Retrieve a plan by its ID.

Args:
    plan_id (UUID): The UUID of the plan to retrieve.

Returns:
    Plan: The Plan object associated with the provided plan_id.

Raises:
    NotImplementedError: If the method is not implemented.

## WorkflowStorage Objects

```python
class WorkflowStorage(ABC)
```

Abstract base class for storing and retrieving workflows.

Subclasses must implement the methods to save and retrieve workflows.

Methods:
    save_workflow(self, workflow: Workflow) -&gt; None:
        Save a workflow.
    get_workflow(self, workflow_id: UUID) -&gt; Workflow:
        Get a workflow by ID.
    get_workflows(self, workflow_state: WorkflowState | None = None) -&gt; list[Workflow]:
        Return workflows that match the given workflow_state

#### save\_workflow

```python
@abstractmethod
def save_workflow(workflow: Workflow) -> None
```

Save a workflow.

Args:
    workflow (Workflow): The Workflow object to save.

Raises:
    NotImplementedError: If the method is not implemented.

#### get\_workflow

```python
@abstractmethod
def get_workflow(workflow_id: UUID) -> Workflow
```

Retrieve a workflow by its ID.

Args:
    workflow_id (UUID): The UUID of the workflow to retrieve.

Returns:
    Workflow: The Workflow object associated with the provided workflow_id.

Raises:
    NotImplementedError: If the method is not implemented.

#### get\_workflows

```python
@abstractmethod
def get_workflows(
        workflow_state: WorkflowState | None = None) -> list[Workflow]
```

List workflows by their state.

Args:
    workflow_state (WorkflowState | None): Optionally filter workflows by their state.

Returns:
    list[Workflow]: A list of Workflow objects that match the given state.

Raises:
    NotImplementedError: If the method is not implemented.

## ToolCallStorage Objects

```python
class ToolCallStorage(ABC)
```

Abstract base class for storing tool_calls.

Subclasses must implement the method to save a tool_call.

Methods:
    save_tool_call(self, tool_call: ToolCallRecord) -&gt; None:
        Save a tool_call.

#### save\_tool\_call

```python
@abstractmethod
def save_tool_call(tool_call: ToolCallRecord) -> None
```

Save a ToolCall.

Args:
    tool_call (ToolCallRecord): The ToolCallRecord object to save.

Raises:
    NotImplementedError: If the method is not implemented.

## LogToolCallStorage Objects

```python
class LogToolCallStorage(ToolCallStorage)
```

ToolCallStorage that logs calls rather than persisting them.

Useful for storages that don&#x27;t care about tool_calls.

#### save\_tool\_call

```python
def save_tool_call(tool_call: ToolCallRecord) -> None
```

Log the tool call.

Args:
    tool_call (ToolCallRecord): The ToolCallRecord object to log.

## Storage Objects

```python
class Storage(PlanStorage, WorkflowStorage, ToolCallStorage)
```

Combined base class for Plan Workflow + Tool storages.

## InMemoryStorage Objects

```python
class InMemoryStorage(PlanStorage, WorkflowStorage, LogToolCallStorage)
```

Simple storage class that keeps plans + workflows in memory.

Tool Calls are logged via the LogToolCallStorage.

#### save\_plan

```python
def save_plan(plan: Plan) -> None
```

Add plan to dict.

Args:
    plan (Plan): The Plan object to save.

#### get\_plan

```python
def get_plan(plan_id: UUID) -> Plan
```

Get plan from dict.

Args:
    plan_id (UUID): The UUID of the plan to retrieve.

Returns:
    Plan: The Plan object associated with the provided plan_id.

Raises:
    PlanNotFoundError: If the plan is not found.

#### save\_workflow

```python
def save_workflow(workflow: Workflow) -> None
```

Add workflow to dict.

Args:
    workflow (Workflow): The Workflow object to save.

#### get\_workflow

```python
def get_workflow(workflow_id: UUID) -> Workflow
```

Get workflow from dict.

Args:
    workflow_id (UUID): The UUID of the workflow to retrieve.

Returns:
    Workflow: The Workflow object associated with the provided workflow_id.

Raises:
    WorkflowNotFoundError: If the workflow is not found.

#### get\_workflows

```python
def get_workflows(
        workflow_state: WorkflowState | None = None) -> list[Workflow]
```

Get workflow from dict.

Args:
    workflow_state (WorkflowState | None): Optionally filter workflows by their state.

Returns:
    list[Workflow]: A list of Workflow objects that match the given state.

## DiskFileStorage Objects

```python
class DiskFileStorage(PlanStorage, WorkflowStorage, LogToolCallStorage)
```

Disk-based implementation of the Storage interface.

Stores serialized Plan and Workflow objects as JSON files on disk.

#### save\_plan

```python
def save_plan(plan: Plan) -> None
```

Save a Plan object to the storage.

Args:
    plan (Plan): The Plan object to save.

#### get\_plan

```python
def get_plan(plan_id: UUID) -> Plan
```

Retrieve a Plan object by its ID.

Args:
    plan_id (UUID): The ID of the Plan to retrieve.

Returns:
    Plan: The retrieved Plan object.

Raises:
    PlanNotFoundError: If the Plan is not found or validation fails.

#### save\_workflow

```python
def save_workflow(workflow: Workflow) -> None
```

Save a Workflow object to the storage.

Args:
    workflow (Workflow): The Workflow object to save.

#### get\_workflow

```python
def get_workflow(workflow_id: UUID) -> Workflow
```

Retrieve a Workflow object by its ID.

Args:
    workflow_id (UUID): The ID of the Workflow to retrieve.

Returns:
    Workflow: The retrieved Workflow object.

Raises:
    WorkflowNotFoundError: If the Workflow is not found or validation fails.

#### get\_workflows

```python
def get_workflows(
        workflow_state: WorkflowState | None = None) -> list[Workflow]
```

Find all workflows in storage that match state.

Args:
    workflow_state (WorkflowState | None): Optionally filter workflows by their state.

Returns:
    list[Workflow]: A list of Workflow objects that match the given state.

## PortiaCloudStorage Objects

```python
class PortiaCloudStorage(Storage)
```

Save plans, workflows and tool calls to portia cloud.

#### check\_response

```python
def check_response(response: httpx.Response) -> None
```

Validate the response from Portia API.

Args:
    response (httpx.Response): The response from the Portia API to check.

Raises:
    StorageError: If the response from the Portia API indicates an error.

#### save\_plan

```python
def save_plan(plan: Plan) -> None
```

Save a plan to Portia Cloud.

Args:
    plan (Plan): The Plan object to save to the cloud.

Raises:
    StorageError: If the request to Portia Cloud fails.

#### get\_plan

```python
def get_plan(plan_id: UUID) -> Plan
```

Retrieve a plan from Portia Cloud.

Args:
    plan_id (UUID): The ID of the plan to retrieve.

Returns:
    Plan: The Plan object retrieved from Portia Cloud.

Raises:
    StorageError: If the request to Portia Cloud fails or the plan does not exist.

#### save\_workflow

```python
def save_workflow(workflow: Workflow) -> None
```

Save a workflow to Portia Cloud.

Args:
    workflow (Workflow): The Workflow object to save to the cloud.

Raises:
    StorageError: If the request to Portia Cloud fails.

#### get\_workflow

```python
def get_workflow(workflow_id: UUID) -> Workflow
```

Retrieve a workflow from Portia Cloud.

Args:
    workflow_id (UUID): The ID of the workflow to retrieve.

Returns:
    Workflow: The Workflow object retrieved from Portia Cloud.

Raises:
    StorageError: If the request to Portia Cloud fails or the workflow does not exist.

#### get\_workflows

```python
def get_workflows(
        workflow_state: WorkflowState | None = None) -> list[Workflow]
```

Retrieve workflows from Portia Cloud.

Args:
    workflow_state (WorkflowState | None): Optionally filter workflows by their state.

Returns:
    list[Workflow]: A list of Workflow objects retrieved from Portia Cloud.

Raises:
    StorageError: If the request to Portia Cloud fails.

#### save\_tool\_call

```python
def save_tool_call(tool_call: ToolCallRecord) -> None
```

Save a tool call to Portia Cloud.

Args:
    tool_call (ToolCallRecord): The ToolCallRecord object to save to the cloud.

Raises:
    StorageError: If the request to Portia Cloud fails.

