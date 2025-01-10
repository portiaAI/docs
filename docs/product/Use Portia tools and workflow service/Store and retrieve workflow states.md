---
sidebar_position: 2
slug: /store-retrieve-workflows
---

# Store and retrieve workflow states
Use our workflow service to save and retrieve serialised workflow states on our cloud.

We have seen how to configure where workflows are stored and retrieved previously (<a href="/manage-config" target="_blank">**Manage config options ↗**</a>). We can simply set the `storage_class` property to `CLOUD` in the config of our `Runner`. 

### Store workflows in the cloud
With the above config and as long as the API key has been set up appropriately as described in the previous section (<a href="/setup-account" target="_blank">**Set up your account ↗**</a>), you should see workflows executed by your `Runner` appear in the `Workflows` tab of your Portia dashboard and see a change in the aggregate workflow metrics in the Home page as well. To examine the workflow created in the code below in your dashboard, you will need the workflow ID, appearing the first attribute of the output e.g. `"id": "f66b141b-5603-4bd9-b827-0c7a41bf5d5c"`. Take a moment to examine those after running the code below.
```python title="main.py"
import json
from portia.runner import Runner
from portia.config import Config, StorageClass
from portia.example_tools.registry import example_tool_registry

# Load the default config and override the storage class to point to the Portia cloud
myConfig = Config.from_default(storage_class=StorageClass.CLOUD)

# Instantiate a Portia runner. Load it with the default config and with the simple tool above.
runner = Runner(config=myConfig, tool_registry=example_tool_registry)

# Execute a workflow from the user query
output = runner.run_query('Get the temperature in London and share it with a light joke')

# Serialise into JSON an print the output
print(output.model_dump_json(indent=2))
```

### Retrieve workflows from the cloud
You can retrieve both workflow states and plans for a stored workflow. For that you would use the `get_workflow` and `get_plan` methods of the `Storage` class. You will need to specify the `PortiaCloudStorage` class in particular here. Go ahead and copy your workflow ID from the dashboard entry created in the previous section into the code below.
```python title="main.py"
from portia.config import Config
from portia.runner import PortiaCloudStorage

# Load the default config and override the storage class to point to the Portia cloud
myConfig = Config.from_default(storage_class = 'CLOUD')
# Use the PortiaCloudStorage class to interact with cloud storage
myStore = PortiaCloudStorage(config=myConfig)

# Retrieve a workflow and a plan from the cloud
workflow = myStore.get_workflow("f66b141b-5603-4bd9-b827-0c7a41bf5d5c")
plan = myStore.get_plan(workflow.plan_id)

# Serialise into JSON an print the objects
print(f"Retrieved workflow:\n{workflow.model_dump_json(indent=2)}")
print(f"Retrieved plan:\n{workflow.model_dump_json(indent=2)}")
```

You should expect to see the following output:
```bash
Retrieved workflow:
{
  "id": "f66b141b-5603-4bd9-b827-0c7a41bf5d5c",
  "plan_id": "1eee4bbf-361a-41be-bab7-6dd86a247f48",
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
  "id": "1eee4bbf-361a-41be-bab7-6dd86a247f48",
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

Now let's look at how to tap into the library of tools accessible on the Portia cloud.
