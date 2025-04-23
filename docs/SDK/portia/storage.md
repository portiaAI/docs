---
sidebar_label: storage
title: portia.storage
---

Storage classes for managing the saving and retrieval of plans, runs, and tool calls.

This module defines a set of storage classes that provide different backends for saving, retrieving,
and managing plans, runs, and tool calls. These storage classes include both in-memory and
file-based storage, as well as integration with the Portia Cloud API. Each class is responsible
for handling interactions with its respective storage medium, including validating responses
and raising appropriate exceptions when necessary.

Classes:
    - Storage (Base Class): A base class that defines common interfaces for all storage types,
    ensuring consistent methods for saving and retrieving plans, runs, and tool calls.
    - InMemoryStorage: An in-memory implementation of the `Storage` class for storing plans,
    runs, and tool calls in a temporary, volatile storage medium.
    - FileStorage: A file-based implementation of the `Storage` class for storing plans, runs,
      and tool calls as local files in the filesystem.
    - PortiaCloudStorage: A cloud-based implementation of the `Storage` class that interacts with
    the Portia Cloud API to save and retrieve plans, runs, and tool call records.

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

#### get\_similar\_plans

```python
def get_similar_plans(query: str,
                      threshold: float = 0.5,
                      limit: int = 10) -> list[Plan]
```

Get similar plans to the query.

**Arguments**:

- `query` _str_ - The query to get similar plans for.
- `threshold` _float_ - The threshold for similarity.
- `limit` _int_ - The maximum number of plans to return.
  

**Returns**:

- `list[Plan]` - The list of similar plans.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

## PlanRunListResponse Objects

```python
class PlanRunListResponse(BaseModel)
```

Response for the get_plan_runs operation. Can support pagination.

## RunStorage Objects

```python
class RunStorage(ABC)
```

Abstract base class for storing and retrieving runs.

Subclasses must implement the methods to save and retrieve PlanRuns.

**Methods**:

  save_plan_run(self, run: Run) -&gt; None:
  Save a PlanRun.
  get_plan_run(self, plan_run_id: PlanRunUUID) -&gt; PlanRun:
  Get PlanRun by ID.
  get_plan_runs(self, run_state: RunState | None = None, page=int | None = None)
  -&gt; PlanRunListResponse:
  Return runs that match the given run_state

#### save\_plan\_run

```python
@abstractmethod
def save_plan_run(plan_run: PlanRun) -> None
```

Save a PlanRun.

**Arguments**:

- `plan_run` _PlanRun_ - The Run object to save.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

#### get\_plan\_run

```python
@abstractmethod
def get_plan_run(plan_run_id: PlanRunUUID) -> PlanRun
```

Retrieve PlanRun by its ID.

**Arguments**:

- `plan_run_id` _RunUUID_ - The UUID of the run to retrieve.
  

**Returns**:

- `Run` - The Run object associated with the provided plan_run_id.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

#### get\_plan\_runs

```python
@abstractmethod
def get_plan_runs(run_state: PlanRunState | None = None,
                  page: int | None = None) -> PlanRunListResponse
```

List runs by their state.

**Arguments**:

- `run_state` _RunState | None_ - Optionally filter runs by their state.
- `page` _int | None_ - Optional pagination data
  

**Returns**:

- `list[Run]` - A list of Run objects that match the given state.
  

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

#### save\_end\_user

```python
@abstractmethod
def save_end_user(end_user: EndUser) -> EndUser
```

Save an end user.

**Arguments**:

- `end_user` _EndUser_ - The EndUser object to save.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

#### get\_end\_user

```python
@abstractmethod
def get_end_user(external_id: str) -> EndUser | None
```

Get an end user.

**Arguments**:

- `external_id` _str_ - The id of the end user to get.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

## Storage Objects

```python
class Storage(PlanStorage, RunStorage, AdditionalStorage)
```

Combined base class for Plan Run + Additional storages.

## AgentMemory Objects

```python
class AgentMemory(Protocol)
```

Abstract base class for storing items in agent memory.

#### save\_plan\_run\_output

```python
@abstractmethod
def save_plan_run_output(output_name: str, output: Output,
                         plan_run_id: PlanRunUUID) -> Output
```

Save an output from a plan run to agent memory.

**Arguments**:

- `output_name` _str_ - The name of the output within the plan
- `output` _Output_ - The Output object to save
- `plan_run_id` _PlanRunUUID_ - The ID of the current plan run
  

**Returns**:

- `Output` - The Output object with value marked as stored in agent memory.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

#### get\_plan\_run\_output

```python
@abstractmethod
def get_plan_run_output(output_name: str,
                        plan_run_id: PlanRunUUID) -> LocalOutput
```

Retrieve an Output from agent memory.

**Arguments**:

- `output_name` _str_ - The name of the output to retrieve
- `plan_run_id` _PlanRunUUID_ - The ID of the plan run
  

**Returns**:

- `Output` - The retrieved Output object with value filled in from agent memory.
  

**Raises**:

- `NotImplementedError` - If the method is not implemented.

#### log\_tool\_call

```python
def log_tool_call(tool_call: ToolCallRecord) -> None
```

Log the tool call.

**Arguments**:

- `tool_call` _ToolCallRecord_ - The ToolCallRecord object to log.

## InMemoryStorage Objects

```python
class InMemoryStorage(PlanStorage, RunStorage, AdditionalStorage, AgentMemory)
```

Simple storage class that keeps plans + runs in memory.

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

#### save\_plan\_run

```python
def save_plan_run(plan_run: PlanRun) -> None
```

Add run to dict.

**Arguments**:

- `plan_run` _PlanRun_ - The Run object to save.

#### get\_plan\_run

```python
def get_plan_run(plan_run_id: PlanRunUUID) -> PlanRun
```

Get run from dict.

**Arguments**:

- `plan_run_id` _PlanRunUUID_ - The UUID of the PlanRun to retrieve.
  

**Returns**:

- `PlanRun` - The PlanRun object associated with the provided plan_run_id.
  

**Raises**:

- `PlanRunNotFoundError` - If the PlanRun is not found.

#### get\_plan\_runs

```python
def get_plan_runs(run_state: PlanRunState | None = None,
                  page: int | None = None) -> PlanRunListResponse
```

Get run from dict.

**Arguments**:

- `run_state` _RunState | None_ - Optionally filter runs by their state.
- `page` _int | None_ - Optional pagination data which is not used for in memory storage.
  

**Returns**:

- `list[Run]` - A list of Run objects that match the given state.

#### save\_plan\_run\_output

```python
def save_plan_run_output(output_name: str, output: Output,
                         plan_run_id: PlanRunUUID) -> Output
```

Save Output from a plan run to memory.

**Arguments**:

- `output_name` _str_ - The name of the output within the plan
- `output` _Output_ - The Output object to save
- `plan_run_id` _PlanRunUUID_ - The ID of the current plan run

#### get\_plan\_run\_output

```python
def get_plan_run_output(output_name: str,
                        plan_run_id: PlanRunUUID) -> LocalOutput
```

Retrieve an Output from memory.

**Arguments**:

- `output_name` _str_ - The name of the output to retrieve
- `plan_run_id` _PlanRunUUID_ - The ID of the plan run
  

**Returns**:

- `Output` - The retrieved Output object
  

**Raises**:

- `KeyError` - If the output is not found

#### save\_tool\_call

```python
def save_tool_call(tool_call: ToolCallRecord) -> None
```

Log the tool call.

#### save\_end\_user

```python
def save_end_user(end_user: EndUser) -> EndUser
```

Add end_user to dict.

**Arguments**:

- `end_user` _EndUser_ - The EndUser object to save.

#### get\_end\_user

```python
def get_end_user(external_id: str) -> EndUser | None
```

Get end_user from dict or init a new one.

**Arguments**:

- `external_id` _str_ - The id of the end user object to get.

## DiskFileStorage Objects

```python
class DiskFileStorage(PlanStorage, RunStorage, AdditionalStorage, AgentMemory)
```

Disk-based implementation of the Storage interface.

Stores serialized Plan and Run objects as JSON files on disk.

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

#### save\_plan\_run

```python
def save_plan_run(plan_run: PlanRun) -> None
```

Save PlanRun object to the storage.

**Arguments**:

- `plan_run` _PlanRun_ - The Run object to save.

#### get\_plan\_run

```python
def get_plan_run(plan_run_id: PlanRunUUID) -> PlanRun
```

Retrieve PlanRun object by its ID.

**Arguments**:

- `plan_run_id` _RunUUID_ - The ID of the Run to retrieve.
  

**Returns**:

- `Run` - The retrieved Run object.
  

**Raises**:

- `RunNotFoundError` - If the Run is not found or validation fails.

#### get\_plan\_runs

```python
def get_plan_runs(run_state: PlanRunState | None = None,
                  page: int | None = None) -> PlanRunListResponse
```

Find all plan runs in storage that match state.

**Arguments**:

- `run_state` _RunState | None_ - Optionally filter runs by their state.
- `page` _int | None_ - Optional pagination data which is not used for in memory storage.
  

**Returns**:

- `list[Run]` - A list of Run objects that match the given state.

#### save\_plan\_run\_output

```python
def save_plan_run_output(output_name: str, output: Output,
                         plan_run_id: PlanRunUUID) -> Output
```

Save Output from a plan run to agent memory on disk.

**Arguments**:

- `output_name` _str_ - The name of the output within the plan
- `output` _Output_ - The Output object to save
- `plan_run_id` _PlanRunUUID_ - The ID of the current plan run

#### get\_plan\_run\_output

```python
def get_plan_run_output(output_name: str,
                        plan_run_id: PlanRunUUID) -> LocalOutput
```

Retrieve an Output from agent memory on disk.

**Arguments**:

- `output_name` _str_ - The name of the output to retrieve
- `plan_run_id` _PlanRunUUID_ - The ID of the plan run
  

**Returns**:

- `Output` - The retrieved Output object
  

**Raises**:

- `FileNotFoundError` - If the output file is not found
- `ValidationError` - If the deserialization fails

#### save\_tool\_call

```python
def save_tool_call(tool_call: ToolCallRecord) -> None
```

Log the tool call.

#### save\_end\_user

```python
def save_end_user(end_user: EndUser) -> EndUser
```

Write end_user to dict.

**Arguments**:

- `end_user` _EndUser_ - The EndUser object to save.

#### get\_end\_user

```python
def get_end_user(external_id: str) -> EndUser | None
```

Get end_user from dict or init a new one.

**Arguments**:

- `external_id` _str_ - The id of the end user object to get.

## PortiaCloudStorage Objects

```python
class PortiaCloudStorage(Storage, AgentMemory)
```

Save plans, runs and tool calls to portia cloud.

#### \_\_init\_\_

```python
def __init__(config: Config,
             cache_dir: str | None = None,
             max_cache_size: int = DEFAULT_MAX_CACHE_SIZE) -> None
```

Initialize the PortiaCloudStorage instance.

**Arguments**:

- `config` _Config_ - The configuration containing API details for Portia Cloud.
- `cache_dir` _str | None_ - Optional directory for local caching of outputs.
- `max_cache_size` _int_ - The maximum number of files to cache locally.

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

#### save\_plan\_run

```python
def save_plan_run(plan_run: PlanRun) -> None
```

Save PlanRun to Portia Cloud.

**Arguments**:

- `plan_run` _PlanRun_ - The Run object to save to the cloud.
  

**Raises**:

- `StorageError` - If the request to Portia Cloud fails.

#### get\_plan\_run

```python
def get_plan_run(plan_run_id: PlanRunUUID) -> PlanRun
```

Retrieve PlanRun from Portia Cloud.

**Arguments**:

- `plan_run_id` _RunUUID_ - The ID of the run to retrieve.
  

**Returns**:

- `Run` - The Run object retrieved from Portia Cloud.
  

**Raises**:

- `StorageError` - If the request to Portia Cloud fails or the run does not exist.

#### get\_plan\_runs

```python
def get_plan_runs(run_state: PlanRunState | None = None,
                  page: int | None = None) -> PlanRunListResponse
```

Find all runs in storage that match state.

**Arguments**:

- `run_state` _RunState | None_ - Optionally filter runs by their state.
- `page` _int | None_ - Optional pagination data which is not used for in memory storage.
  

**Returns**:

- `list[Run]` - A list of Run objects retrieved from Portia Cloud.
  

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

#### save\_plan\_run\_output

```python
def save_plan_run_output(output_name: str, output: Output,
                         plan_run_id: PlanRunUUID) -> Output
```

Save Output from a plan run to Portia Cloud.

**Arguments**:

- `output_name` _str_ - The name of the output within the plan
- `output` _Output_ - The Output object to save
- `plan_run_id` _PlanRun_ - The if of the current plan run
  

**Raises**:

- `StorageError` - If the request to Portia Cloud fails.

#### get\_plan\_run\_output

```python
def get_plan_run_output(output_name: str,
                        plan_run_id: PlanRunUUID) -> LocalOutput
```

Retrieve an Output from Portia Cloud.

**Arguments**:

- `output_name` - The name of the output to get from memory
- `plan_run_id` _RunUUID_ - The ID of the run to retrieve.
  

**Returns**:

- `Run` - The Run object retrieved from Portia Cloud.
  

**Raises**:

- `StorageError` - If the request to Portia Cloud fails or the run does not exist.

#### get\_similar\_plans

```python
def get_similar_plans(query: str,
                      threshold: float = 0.5,
                      limit: int = 5) -> list[Plan]
```

Get similar plans to the query.

**Arguments**:

- `query` _str_ - The query to get similar plans for.
- `threshold` _float_ - The threshold for similarity.
- `limit` _int_ - The maximum number of plans to return.
  

**Returns**:

- `list[Plan]` - The list of similar plans.

#### save\_end\_user

```python
def save_end_user(end_user: EndUser) -> EndUser
```

Save an end_user to Portia Cloud.

**Arguments**:

- `end_user` _EndUser_ - The EndUser object to save to the cloud.
  

**Raises**:

- `StorageError` - If the request to Portia Cloud fails.

#### get\_end\_user

```python
def get_end_user(external_id: str) -> EndUser
```

Retrieve an end user from Portia Cloud.

**Arguments**:

- `external_id` _str_ - The ID of the end user to retrieve.
  

**Returns**:

- `EndUser` - The EndUser object retrieved from Portia Cloud.
  

**Raises**:

- `StorageError` - If the request to Portia Cloud fails or the plan does not exist.

