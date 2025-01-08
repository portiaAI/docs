---
sidebar_position: 2
---

# Store and retrieve workflow states
Use our workflow service to save and retrieve serialised workflow states on our cloud.

We have seen how to configure where workflows are stored and retrieved previously (<a href="/product/Plan%20and%20run%20workflows/Manage%20config%20options" target="_blank">**Manage config options ↗**</a>). We can simply set the `storage_class` property of our `Runner`'s `Config` to `CLOUD`. As long as the API key has been set up appropriately as described in the previous section (<a href="product/Use%20Portia%20tools%20and%20workflow%20service/Set%20up%20your%20account" target="_blank">**Set up your account ↗**</a>), you should see the workflow appear in the `Workflows` tab of your Portia dashboard and see a change in the aggregate workflow metrics in the Home page as well. Take a moment to examine those.
```python title="main.py"
import json
from portia.runner import Runner
from portia.config import Config
from portia.example_tools.registry import example_tool_registry

# Load the default config and override the storage class to point to the Portia cloud
myConfig = Config.from_default(storage_class = 'CLOUD')

# Instantiate a Portia runner. Load it with the default config and with the simple tool above.
runner = Runner(config=myConfig, tool_registry=example_tool_registry)

# Execute a workflow from the user query
output = runner.run_query('Get the temperature in London and share it with a light joke')

# Serialise into JSON an print the output
string = output.model_dump_json()
json_body = json.loads(string)
print(json.dumps(json_body, indent=2))
```

Now let's look at how to tap into the library of tools accessible on the Portia cloud.