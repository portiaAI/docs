---
sidebar_position: 4
slug: /store-retrieve-plan-runs
---

# Plan run states on Portia cloud
Use our Run service to save and retrieve serialised plan run states on our cloud.

Storing and retrieving plan runs on Portia cloud significantly simplifies the management of long lived and / or asynchronous plan runs. For example when a clarification is raised, the state of the plan run is automatically maintained in the Portia cloud and retrieving the plan run once the clarification is handled is a single line of code.


<details>
<summary>**API keys required**</summary>

We're assuming you already have a Portia API key from the dashboard and set it in your environment variables. If not please refer to the previous section and do that first (<a href="/setup-account" target="_blank">**Set up your account ↗**</a>).

We will use a simple GET endpoint from OpenWeatherMap in this section. Please sign up to obtain an API key from them (<a href="https://home.openweathermap.org/users/sign_in" target="_blank">**↗**</a>) and set it in the environment variable `OPENWEATHERMAP_API_KEY`.

</details>

## Store plan runs in the cloud
We have seen how to configure the location where plan runs are stored and retrieved previously (<a href="/manage-config" target="_blank">**Manage config options ↗**</a>). We can simply set the `storage_class` property to `CLOUD` in the config of our `Portia` instance. 
With this config and as long as the API key has been set up appropriately as described in the previous section (<a href="/setup-account" target="_blank">**Set up your account ↗**</a>), you should see plan runs executed by your `Portia` instance appear in the `Plan runs` tab of your Portia dashboard and see a change in the aggregate plan run metrics in the Home page as well.

```python title="main.py"
from dotenv import load_dotenv
from portia import Portia
from portia.config import Config, StorageClass
from portia.open_source_tools.registry import example_tool_registry

load_dotenv()

# Load the default config and override the storage class to point to the Portia cloud
my_config = Config.from_default(storage_class=StorageClass.CLOUD)

# Instantiate a Portia instance. Load it with the default config and an example tool registry
portia = Portia(config=my_config, tools=example_tool_registry)

# Run a plan from the user query
plan_run = portia.run('Get the temperature in London and share it with a light joke')

# Serialise into JSON and print the output
print(plan_run.model_dump_json(indent=2))
```
Take a moment to examine the plan run created by the code above in your dashboard. To do so you will need the plan run ID, appearing in the first attribute of the output e.g. `"id": "prun-f66b141b-5603-4bd9-b827-0c7a41bf5d5c"`.

## Retrieve plan runs from the cloud

You can retrieve both plans and run states for a stored plan run. For that you would use the `get_plan_run` and `get_plan` methods of the `Storage` class. You will need to specify the `PortiaCloudStorage` class in particular here. Go ahead and copy your plan run ID from the dashboard entry created in the previous section into the code below.
<!-- Setup a plan run with the correct id. This won't be rendered on the website
```python id=plan_run_invisible_setup
from portia import Portia
from portia.plan import PlanBuilder, PlanUUID
from portia.plan_run import PlanRunUUID
from uuid import UUID
plan = PlanBuilder("test").build()
plan_run = Portia().run_plan(plan)
plan_run_id = PlanRunUUID(uuid=UUID("229956fb-820d-4099-b69c-0606ca620b86"))
plan_run.id = plan_run_id
try:
  if not Portia().storage.get_plan_run(plan_run_id):
    Portia().storage.save_plan_run(plan_run)
except Exception as e:
  pass
```
-->
```python title="main.py" id=manage_plan_run_intro depends_on=plan_run_invisible_setup patch=portia_cloud_storage
from dotenv import load_dotenv
from portia import Config, StorageClass
from portia.storage import PortiaCloudStorage

load_dotenv()

# Load the default config and override the storage class to point to the Portia cloud
my_config = Config.from_default(storage_class=StorageClass.CLOUD)
# Use the PortiaCloudStorage class to interact with cloud storage
my_store = PortiaCloudStorage(config=my_config)

# Retrieve a plan and its run from the cloud
plan_run = my_store.get_plan_run("229956fb-820d-4099-b69c-0606ca620b86")
plan = my_store.get_plan(plan_run.plan_id)

# Serialise into JSON an print the objects
print(f"Retrieved plan run:\n{plan_run.model_dump_json(indent=2)}")
print(f"Retrieved plan:\n{plan.model_dump_json(indent=2)}")
```
Note that you can also access the `StorageClass` directly from your `Portia` instance. If you have a `Portia` instance with an associated `Config` that uses `CLOUD` storage like the first example on this page, you could simply use `portia.storage.get_plan_run` and `portia.storage.get_plan`.

You should expect to see the following output:
```bash
Retrieved plan run:
{
  "id": "prun-f66b141b-5603-4bd9-b827-0c7a41bf5d5c",
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
      "tool_id": "weather_tool",
      "output": "$london_temperature"
    },
    {
      "task": "Generate a light joke about the weather.",
      "inputs": [
        {
          "name": "$london_temperature",
          "description": "The current temperature in London."
        }
      ],
      "tool_id": "llm_tool",
      "output": "$weather_joke"
    }
  ]
}
```

If you wanted to retrieve plan runs in bulk, you can use the `get_plan_runs` method (plural!) from `StorageClass`. This returns paginated data so you will need to process that information further to cycle through all results. Remember the first page number returned is always 1 (not 0!).

<!-- Setup my_store. This won't be rendered on the website
```python id=my_store_invisible_setup
from portia.storage import InMemoryStorage

my_store = InMemoryStorage()
```
-->
```python depends_on=my_store_invisible_setup
plan_run_list_init = my_store.get_plan_runs() # again, plural!
total_pages = plan_run_list_init.total_pages

for page in range(1, total_pages+1):
    print(f"Retrieving plan runs from page {page}...")
    plan_run_list = my_store.get_plan_runs(page=page)
    for plan_run in plan_run_list.results:
        print(f"Plan run ID: {plan_run.id}")
```
