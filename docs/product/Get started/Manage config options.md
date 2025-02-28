---
sidebar_position: 5
slug: /manage-config
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Manage your config
Learn how to use the runner `Config` to configure LLM and agent execution options, and select different plan and run storage options.

:::tip[TL;DR]
The `Config` class of your `Portia` instance allows you to:
- Configure your LLM provider, model and API key
- Save plans and runs to disk or the Portia cloud
- Manage logging behaviour
:::

## Configure LLM options
The `Config` class (<a href="/SDK/portia/config" target="_blank">**SDK reference ↗**</a>) allows you to control various LLM and agent execution options.
| Property | Purpose |
| ----------- | ----------- |
| `llm_provider` | Select between `OPENAI`, `ANTHROPIC` OR `MISTRALAI`. <br/>This is an ENUM accessible from the `LLMProvider` class. |
| `llm_model_name` | Select the relevant LLM model. This is an ENUM accessible via the `LLMModel` class. |
| `openai_api_key`<br/>`anthropic_api_key`<br/>`mistralai_api_key` | Set the key you want your `Portia` instance instance to use from the relevant provider |
| `planner_system_context_extension` | Enrich the system context with more information. For example you can add information specific to a frontend user session such as department, title, timezone etc. |
| `default_agent_type` | This controls how complex (and therefore how fast or expensive) your agents are. It can be one of <ul><li>`VERIFIER`: This is the default setup. This means the agent validates the inputs it receives and assesses its output to determine if it achieved the task at hand in a particular step. This is the setting that allows an LLM to trigger clarifications where relevant (e.g. missing input).</li><li>`ONE_SHOT` [Not recommended]: For a simpler and faster agent implementation where an agent simply takes arguments and makes tool calls where relevant, without any validation of inputs and outputs (e.g. useful for light and repeatable plan runs)</li><li>`TOOL_LESS`: For plan runs where no tools are required.</li></ul>This ENUM is accessible from the `AgentType` class. |

## Manage storage options
You can control where you store and retrieve plan run states using the `storage_class` property in the `Config` class (<a href="/SDK/portia/config" target="_blank">**SDK reference ↗**</a>), which is an ENUM accessible from the `StorageClass` class:
- `MEMORY` allows you to use working memory (default if PORTIA_API_KEY is not specified).
- `DISK` allows you to use local storage. You will need to set the `storage_dir` appropriately (defaults to the project's root directory).
- `CLOUD` uses the Portia cloud (<a href="/store-retrieve-plan-runs" target="_blank">**Use Portia cloud ↗**</a> - default if PORTIA_API_KEY is specified).

## Manage logging
You can control logging behaviour with the following `Config` properties (<a href="/SDK/portia/config" target="_blank">**SDK reference ↗**</a>):
| Property | Purpose |
| ----------- | ----------- |
| `default_log_level` | Controls the minimal log level, i.e. setting it to `DEBUG` will print all logs whereas setting it to `ERROR` will only display ERROR logs and above. This defaults to `INFO`. The ENUM is accessible via the `LogLevel` class |
| `default_log_sink` | Controls where logs are sent. By default this string is set to  `"sys.stdout"` (STDOUT) but can also be set to  `"sys.stderr"` (STDERR) or to a file by setting this to a file path e.g. `"./logs.txt"` |
| `json_log_serialize` | Sets whether logs are JSON serialized before sending them to the log sink. |

## Bringing it all together
<details>
<summary>**Tavily API key required**</summary>

We will use a simple GET endpoint from Tavily in this section. Please sign up to obtain an API key from them (<a href="https://tavily.com/" target="_blank">**↗**</a>) and set it in the environment variable `TAVILY_API_KEY`.
</details>

Let's test out a couple of these parameters. We will start first by loading the default config values within the `Config` class using the `from_default` method. This method uses the `default_config` within the `Config` class as the baseline and allows you to tweak specific attributes:
- We will explicitly save plans and runs to disk in a `demo_runs` directory. In the default config the `storage_class` is set to `MEMORY` so we will change it to `DISK`
- We will set the `default_log_level` to `DEBUG`, which will result in the generated plan, every change in the plan run state and all tool calls appearing in the logs.

```python title="main.py"
from dotenv import load_dotenv
from portia import Portia
from portia.config import Config, StorageClass, LogLevel
from portia.open_source_tools.registry import example_tool_registry

load_dotenv()

# Load the default config then make changes to it
my_config = Config.from_default(
    storage_class=StorageClass.DISK, 
    storage_dir='demo_runs', # Amend this based on where you'd like your plans and plan runs saved!
    default_log_level=LogLevel.DEBUG,
    )

# Instantiate Portia. Load it with the default config and with some example tools
portia = Portia(config=my_config, tools=example_tool_registry)

# Execute the plan run from the user query
output = portia.run_query('Which stock price grew faster in 2024, Amazon or Google?')

# Serialise into JSON and print the output
print(output.model_dump_json(indent=2))
```

In your `demo_runs` directory, you should now be able to see a plan and a plan run written to disk per the changes made to the `Config`.
<Tabs>
  <TabItem value="plan" label="Generated plan">
    ```json title="plan-72cb538e-6d2b-42ca-a6c2-511a9a4c4f0e.json"
    {
        "id": "plan-72cb538e-6d2b-42ca-a6c2-511a9a4c4f0e",
        "plan_context": {
            "query": "Which stock price grew faster in 2024, Amazon or Google?",
            "tool_ids": [
                "calculator_tool",
                "weather_tool",
                "search_tool"
            ]
        },
        "steps": [
            {
                "task": "Search for the stock price growth of Amazon in 2024.",
                "inputs": [],
                "tool_name": "Search Tool",
                "output": "$amazon_stock_growth_2024"
            },
            {
                "task": "Search for the stock price growth of Google in 2024.",
                "inputs": [],
                "tool_name": "Search Tool",
                "output": "$google_stock_growth_2024"
            },
            {
                "task": "Compare the stock price growth of Amazon and Google in 2024.",
                "inputs": [
                    {
                        "name": "$amazon_stock_growth_2024",
                        "value": null,
                        "description": "The stock price growth of Amazon in 2024."
                    },
                    {
                        "name": "$google_stock_growth_2024",
                        "value": null,
                        "description": "The stock price growth of Google in 2024."
                    }
                ],
                "tool_name": null,
                "output": "$faster_growth"
            }
        ]
    }
    ```
  </TabItem>
    <TabItem value="plan run" label="Plan run in final state" default>
    ```json title="pr-e3a77013-2bd4-459c-898c-6a8cc9e77d12.json"
    {
        "id": "pr-e3a77013-2bd4-459c-898c-6a8cc9e77d12",
        "plan_id": "plan-72cb538e-6d2b-42ca-a6c2-511a9a4c4f0e",
        "current_step_index": 2,
        "state": "COMPLETE",
        "execution_context": {
            "end_user_id": null,
            "additional_data": {},
            "planner_system_context_extension": null,
            "agent_system_context_extension": null
        },
        "outputs": {
            "clarifications": [],
            "step_outputs": {
                "$amazon_stock_growth_2024": {
                    "value": "In 2024, Amazon's stock price reached an all-time high closing price of $214.10 in November, having risen consistently since the start of 2023. Analysts remain optimistic, with many maintaining a 'Buy' rating and predicting further growth. By the end of 2024, Amazon's stock was expected to continue its upward trend, with projections varying but generally positive. The latest closing stock price as of November 14, 2024, was $211.48, just below the all-time high of $214.10.",
                    "summary": null
                },
                "$google_stock_growth_2024": {
                    "value": "As of today, January 23, 2025, Google's stock has experienced an 18% increase since the beginning of the year, starting at $139.56 and trading at $164.74. Analysts predict the stock price to reach $208 by the end of 2024, marking a year-on-year growth rate of 49.03%. The forecast for the end of 2024 is an estimated increase of 18.18% from today's price.",
                    "summary": null
                },
                "$faster_growth": {
                    "value": "In 2024, Amazon's stock price growth was positive, reaching an all-time high closing price of $214.10 in November. Google's stock price growth in 2024 was also strong, with a year-on-year growth rate of 49.03% and a forecasted increase of 18.18% by the end of the year.",
                    "summary": null
                }
            },
            "final_output": {
                "value": "In 2024, Amazon's stock price growth was positive, reaching an all-time high closing price of $214.10 in November. Google's stock price growth in 2024 was also strong, with a year-on-year growth rate of 49.03% and a forecasted increase of 18.18% by the end of the year.",
                "summary": null
            }
        }
    }
    ```
  </TabItem>
</Tabs>

Now let's start exploring the developer abstractions Portia offers in more detail!