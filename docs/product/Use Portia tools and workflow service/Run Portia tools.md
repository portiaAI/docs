---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Run Portia tools
Access our library of tools and view logs of previous tool calls.

:::tip[TL;DR]
stuff
:::

In a previous section, we explored the `tool` and `tool_registry` abstractions. We used example tools that are included in the Portia SDK and we introduced custom tools (<a href="product/Plan%20and%20run%20workflows/Extend%20your%20tool%20registry" target="_blank">**Extend your tool definitions ↗**</a>). 

Portia also offers a cloud-hosted library of tools to save you development time. This typically covers popular public SaaS products like gSuite, Zendesk, Hubspot etc. You get a number of Portia tool calls for free when you sign-up to Portia cloud. For more info on our pricing please visit our  (<a href="https://www.porita.dev/pricing" target="_blank">**Pricing page ↗**</a>).  
:::note[Request a tool]
If there's a particular product you would like to see tools for in our library, do feel free to request it and we'll do our best to get it done! (<a href="https://tally.so/r/wzWAAg" target="_blank">**Request a tool ↗**</a>).
:::

You can use Portia tools in conjunction with your own custom tools by combining tool registries. Take the simple example below:
- We load the `default_config()` and override the `default_log_level` to 'DEBUG' so we can see the tool call logging in the terminal. Note that the tool call logs will also appear in your Portia dashboard
- We import all of Portia's tool library using the `PortiaToolRegistry` import and combine it with the `example_tool_registry` we've used so far into a `complete_tool_registry`
- We run a query that necessitates both the `WeatherTool` from the example tool registry and the `search_tool` from Portia's cloud library.
```python title="main.py"
import json
from portia.runner import Runner
from portia.config import default_config
from portia.example_tools.registry import example_tool_registry
# highlight-next-line
from portia.tool_registry import PortiaToolRegistry

# highlight-start
# Load the default config and add Portia cloud tools and example tools into one registry
myConfig = default_config()
myConfig.default_log_level = 'DEBUG'
complete_tool_registry = example_tool_registry + PortiaToolRegistry(myConfig)
# highlight-end

# Instantiate a Portia runner. Load it with the default config and with the tools above
runner = Runner(config=myConfig, tool_registry=complete_tool_registry)

# Execute a workflow from the user query
output = runner.run_query('Get the weather in the southernmost city in the world')

# Serialise into JSON an print the output
string = output.model_dump_json()
json_body = json.loads(string)
print(json.dumps(json_body, indent=2))
```

Running the code above should return the weather conditions in Puerto Williams, Chile unless a new city was settled by humans in the far southern hemisphere or the equator tilted (hopefully not). In your logs you should be able to see the tools, as well as a plan and final workflow state similar to the output below. Note again how the planner weaved tools from both the cloud and the example registry.

<Tabs>
  <TabItem value="plan" label="Generated plan">
    ```json title="plan-71fbe578-0c3f-4266-b5d7-933e8bb10ef2.json"
    {
        "id": "71fbe578-0c3f-4266-b5d7-933e8bb10ef2",
        "query": "Get the weather in the southernmost city in the world",
        "steps": [
            {
                "task": "Identify the southernmost city in the world.",
                "input": null,
                "tool_name": "Search Tool",
                "output": "$southernmost_city"
            },
            {
                "task": "Get the weather for the identified southernmost city.",
                "input": [
                    {
                        "name": "$southernmost_city",
                        "value": null,
                        "description": "The southernmost city identified in the previous step."
                    }
                ],
                "tool_name": "Weather Tool",
                "output": "$weather_info"
            }
        ]
    }
    ```
  </TabItem>
    <TabItem value="workflow" label="Workflow in final state">
    ```json title="workflow-21213060-5287-4f57-b4fc-a4d55470d763.json"
    {
        "id": "21213060-5287-4f57-b4fc-a4d55470d763",
        "plan_id": "71fbe578-0c3f-4266-b5d7-933e8bb10ef2",
        "current_step_index": 1,
        "clarifications": [],
        "state": "COMPLETE",
        "step_outputs": {
            "$southernmost_city": {
            "value": {
                "output": {
                "value": "Puerto Williams, Chile, is currently recognized as the southernmost city in the world. This designation was confirmed by a bilateral agreement between Chile and Argentina, as well as by Chilean and Argentine media. The population of Puerto Williams has been growing, with the town being developed primarily as a naval base for Chile.",
                "short_summary": "Puerto Williams, Chile, is currently recognized as the southernmost city in the world. This designat",
                "long_summary": "Puerto Williams, Chile, is currently recognized as the southernmost city in the world. This designation was confirmed by a bilateral agreement between Chile and Argentina, as well as by Chilean and Argentine media. The population of Puerto Williams has been growing, with the town being developed primarily as a naval base for Chile."
                }
            }
            },
            "$weather_info": {
            "value": "The current weather in Puerto Williams, Chile is clear sky with a temperature of 13.11\u00b0C."
            }
        },
        "final_output": {
            "value": "The current weather in Puerto Williams, Chile is clear sky with a temperature of 13.11\u00b0C."
        }
    }
    ```
  </TabItem>
</Tabs>