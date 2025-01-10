---
sidebar_position: 5
slug: /manage-config
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Manage your config
Learn how to use the runner `Config` to configure LLM and agent execution options, and select different plan and workflow storage options.

:::tip[TL:DR]
The `Config` class of your `Runner` allows you to:
- Configure your LLM provider, model and API key
- Add more colour e.g. user-specific context to the overall system context
- Save plans and workflows to disk or the Portia cloud
- Manage logging behaviour
:::

## Configure LLM options
The `Config` class (<a href="/SDK/portia/config" target="_blank">**SDK reference ↗**</a>) allows you to control various LLM and agent execution options.
| Property | Purpose |
| ----------- | ----------- |
| `llm_provider` | Select between `OPENAI`, `ANTHROPIC` OR `MISTRALAI`. <br/>This is an ENUM accessible from the `LLMProvider` class. |
| `llm_model` | Select the relevant LLM model. This is an ENUM accessible via the `LLMModel` class. |
| `openai_api_key`<br/>`anthropic_api_key`<br/>`mistralai_api_key` | Set the key you want your `Runner` instance to use from the relevant provider |
| `planner_system_context_extension` | Enrich the system context with more information. For example you can add information specific to a frontend user session such as department, title, timezone etc. |
| `default_agent_type` | This controls how complex (and therefore how fast or expensive) your agents are. It can be one of <ul><li>`VERIFIER`: This is the default setup. This means the agent validates the inputs it receives and assesses its output to determine if it achieved the task at hand in a particular step. This is the setting that allows an LLM to trigger clarifications where relevant (e.g. missing input).</li><li>`ONE_SHOT`: For a simpler and faster agent implementation where an agent simply takes arguments and makes tool calls where relevant, without any validation of inputs and outputs (e.g. useful for light and repeatable workflows)</li><li>`TOOL_LESS`: For workflows where no tools are required.</li></ul>This ENUM is accessible from the `AgentType` class. |

## Manage storage options
You can control where you store and retrieve workflow states using the `storage_class` property in the `Config` class (<a href="/SDK/portia/config" target="_blank">**SDK reference ↗**</a>), which is an ENUM accessible from the `StorageClass` class:
- `MEMORY` allows you to use working memory (default).
- `DISK` allows you to use local storage. You will need to set the `storage_dir` appropriately (defaults to the project's root directory).
- `CLOUD` uses the Portia cloud (<a href="/use-portia-cloud" target="_blank">**How to use Portia cloud ↗**</a>).

## Manage logging
You can control logging behaviour with the following `Config` properties (<a href="/SDK/portia/config" target="_blank">**SDK reference ↗**</a>):
| Property | Purpose |
| ----------- | ----------- |
| `default_log_level` | Controls the minimal log level, i.e. setting it to `DEBUG` will print all logs whereas setting it to `ERROR` will only display ERROR logs and above. This defaults to `INFO`. The ENUM is accessible via the `LogLevel` class |
| `default_log_sink` | Controls where logs are sent. By default this string is set to  `"sys.stdout"` (STDOUT) but can also be set to  `"sys.stderr"` (STDERR) or to a file by setting this to a file path e.g. `"./logs.txt"` |
| `json_log_serialize` | Sets whether logs are JSON serialized before sending them to the log sink. |

## Bringing it all together
Let's test out a couple of these parameters. We will start first by loading the default config values within the `Config` class using the `from_default` method. This method uses the `default_config` within the `Config` class as the baseline and allows you to tweak specific attributes:
- We will explicitly save plans and workflows to disk in the `demo_runs` directory. In the default config the `storage_class` is set to `MEMORY` so we will change it to `DISK`.
- We will enrich the system prompt with note explicitly saying we only want temperature data in Fahrenheit using the `planner_system_context_extension` property. The `WeatherTool` in the `example_tool_registry` included in the Portia SDK returns data in Celsius, so we'd expect injecting this additional system prompt information to effect a change in the plan produced and final outcome.

```python title="main.py"
import json
from portia.runner import Runner
from portia.config import Config
from portia.example_tools.registry import example_tool_registry

# Load the default config then make changes to it
myConfig = Config.from_default(
    storage_class='DISK', 
    storage_dir='demo_runs',
    default_log_level='DEBUG',
    planner_system_context_override = "For weather related queries, always convert to Farenheit."
)

# Instantiate a Portia runner. Load it with the default config and with the simple tool above.
runner = Runner(config=myConfig, tool_registry=example_tool_registry)

# Execute the workflow from the user query
output = runner.run_query('Get the temperature in London and share it with me')

# Serialise into JSON an print the output
print(output.model_dump_json(indent=2))
```

In your demo_runs directory, you should now be able to see a plan and a workflow written to disk per the changes made to the `Config`. Note how the plan and subsequent workflow run now include a second step to convert the temperature returned by the `WeatherTool` to Fahrenheit!
<Tabs>
  <TabItem value="plan" label="Generated plan">
    ```json title="plan-fe3550dd-510a-4d29-b7ff-3f22547f6022.json"
    {
        "id": "fe3550dd-510a-4d29-b7ff-3f22547f6022",
        "query": "Get the temperature in London and share it with me in a tolerable format",
        "steps": [
            {
                "task": "Get the weather for London",
                "input": null,
                "tool_name": "Weather Tool",
                "output": "$london_weather"
            },
            # highlight-start
            {
                "task": "Convert the temperature to Fahrenheit",
                "input": [
                    {
                        "name": "$london_weather",
                        "value": null,
                        "description": "The weather data retrieved for London, which includes temperature in Celsius."
                    }
                ],
                "tool_name": null,
                "output": "$temperature_fahrenheit"
            }
            # highlight-end
        ]
    }
    ```
  </TabItem>
    <TabItem value="workflow" label="Workflow in final state" default>
    ```json title="workflow-b9bf5541-2a2e-42c2-bfa9-f440c33a54f7.json"
    {
        "id": "b9bf5541-2a2e-42c2-bfa9-f440c33a54f7",
        "plan_id": "fe3550dd-510a-4d29-b7ff-3f22547f6022",
        "current_step_index": 1,
        "clarifications": [],
        "state": "COMPLETE",
        "step_outputs": {
            "$london_weather": {
                "value": "The current weather in London is broken clouds with a temperature of 3.34°C."
            },
            # highlight-start
            "$temperature_fahrenheit": {
                "value": "The temperature in London is 37.01°F."
            }
            # highlight-end
        },
        "final_output": {
            "value": "The temperature in London is 37.01°F."
        }
    }
    ```
  </TabItem>
</Tabs>

In the next sections, we will look at how the `Config` class can be used to allow you access to Portia's cloud capabilities.