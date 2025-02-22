---
sidebar_position: 3
slug: /store-retrieve-workflows
---

# Workflow states on Portia cloud
Use our workflow service to save and retrieve serialised workflow states on our cloud.

Storing and retrieving workflows on Portia cloud significantly simplifies the management of long lived and / or asynchronous workflows. For example when a clarification is raised, the state of the workflow is automatically maintained in the Portia cloud and retrieving the workflow once the clarification is handled is a single line of code.


<details>
<summary>**API keys required**</summary>

We're assuming you already have a Portia API key from the dashboard and set it in your environment variables. If not please refer to the previous section and do that first (<a href="/setup-account" target="_blank">**Set up your account ↗**</a>).

We will use a simple GET endpoint from OpenWeatherMap in this section. Please sign up to obtain an API key from them (<a href="https://home.openweathermap.org/users/sign_in" target="_blank">**↗**</a>) and set it in the environment variable `OPENWEATHERMAP_API_KEY`.

</details>

## Store workflows in the cloud
We have seen how to configure the location where workflows are stored and retrieved previously (<a href="/manage-config" target="_blank">**Manage config options ↗**</a>). We can simply set the `storage_class` property to `CLOUD` in the config of our `Runner`. 
With this config and as long as the API key has been set up appropriately as described in the previous section (<a href="/setup-account" target="_blank">**Set up your account ↗**</a>), you should see workflows executed by your `Runner` appear in the `Workflows` tab of your Portia dashboard and see a change in the aggregate workflow metrics in the Home page as well.

```python title="main.py"
from dotenv import load_dotenv
from portia.runner import Runner
from portia.config import Config, StorageClass
from portia.open_source_tools.registry import example_tool_registry

load_dotenv()

# Load the default config and override the storage class to point to the Portia cloud
my_config = Config.from_default(storage_class=StorageClass.CLOUD)

# Instantiate a Portia runner. Load it with the default config and an example tool registry
runner = Runner(config=my_config, tools=example_tool_registry)

# Execute a workflow from the user query
workflow = runner.execute_query('Get the temperature in London and share it with a light joke')

# Serialise into JSON an print the output
print(workflow.model_dump_json(indent=2))
```
Take a moment to examine the workflow created by the code above in your dashboard. To do so you will need the workflow ID, appearing in the first attribute of the output e.g. `"id": "f66b141b-5603-4bd9-b827-0c7a41bf5d5c"`.

## Retrieve workflows from the cloud

You can retrieve both workflow states and plans for a stored workflow. For that you would use the `get_workflow` and `get_plan` methods of the `Storage` class. You will need to specify the `PortiaCloudStorage` class in particular here. Go ahead and copy your workflow ID from the dashboard entry created in the previous section into the code below.
```python title="main.py" skip=true
from dotenv import load_dotenv
from portia.config import Config, StorageClass
from portia.runner import PortiaCloudStorage

load_dotenv()

# Load the default config and override the storage class to point to the Portia cloud
my_config = Config.from_default(storage_class=StorageClass.CLOUD)
# Use the PortiaCloudStorage class to interact with cloud storage
my_store = PortiaCloudStorage(config=my_config)

# Retrieve a workflow and a plan from the cloud
workflow = my_store.get_workflow("229956fb-820d-4099-b69c-0606ca620b86")
plan = my_store.get_plan(workflow.plan_id)

# Serialise into JSON an print the objects
print(f"Retrieved workflow:\n{workflow.model_dump_json(indent=2)}")
print(f"Retrieved plan:\n{workflow.model_dump_json(indent=2)}")
```
Note that you can also access the `StorageClass` directly from your `Runner` object. If you have a `Runner` with an associated `Config` that uses `CLOUD` storage like the first example on this page, you could simply use `runner.storage.get_workflow` and `runner.storage.get_plan`.

You should expect to see the following output:
```bash
Retrieved workflow:
{
  "id": "wkfl-f66b141b-5603-4bd9-b827-0c7a41bf5d5c",
  "plan_id": "plan-1eee4bbf-361a-41be-bab7-6dd86a247f48",
  "current_step_index": 1,
  "clarifications": [],
  "state": "COMPLETE",
  "step_outputs": {
    "$weather_joke": {
      "value": "Why did the weather go to therapy? It had too many issues to cloud its mind!"
    },
    "$london_temperature": {
      "value": "The current weather in London is overcast clouds with a temperature of 0.91°C."
    }
  },
  "final_output": {
    "value": "Why did the weather go to therapy? It had too many issues to cloud its mind!"
  }
}
Retrieved plan:
{
  "id": "plan-1eee4bbf-361a-41be-bab7-6dd86a247f48",
  "query": "Get the temperature in London and share it with a light joke",
  "steps": [
    {
      "task": "Get the current temperature in London.",
      "inputs": [],
      "tool_name": "Weather Tool",
      "output": "$london_temperature"
    },
    {
      "task": "Generate a light joke about the weather.",
      "inputs": [
        {
          "name": "$london_temperature",
          "value": null,
          "description": "The current temperature in London."
        }
      ],
      "tool_name": null,
      "output": "$weather_joke"
    }
  ]
}
```

If you wanted to retrieve workflows in bulk, you can use the `get_workflows` method (plural!) from `StorageClass`. This returns paginated data so you will need to process that information further to cycle through all results. Remember the first page number returned is always 1 (not 0!).

```python skip=true
workflow_list_init = my_store.get_workflows() # again, plural!
total_pages = workflow_list_init.total_pages

for page in range(1, total_pages+1):
    print(f"Retrieving workflows from page {page}...")
    workflow_list = my_store.get_workflows(page=page)
    for workflow in workflow_list.results:
        print(f"Workflow ID: {workflow.id}")
```
