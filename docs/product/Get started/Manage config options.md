---
sidebar_position: 5
slug: /manage-config
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Manage your config
Learn how to use your `Portia` instance's `Config` to configure LLM and agent execution options, and select different plan and plan run storage options.

:::tip[TL;DR]
The `Config` class of your `Portia` instance allows you to:
- Configure your LLM provider, model and API key
- Save plans and runs to disk or the Portia cloud
- Manage logging behaviour
:::

## Configure LLM options
The `Config` class (<a href="/SDK/portia/config" target="_blank">**SDK reference ↗**</a>) allows you to control various LLM and agent execution options.

### LLM Provider

|   |   |
| - | - |
| Config settings | `Config.llm_provider` |
| Environment variables | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `MISTRALAI_API_KEY`, `GOOGLE_GENERATIVEAI_API_KEY`, `AZURE_OPENAI_API_KEY` |
| Values | `str`, `LLMProvider` |

If set, this decides what generative AI models are used in Portia defined Agents and Tools.

This can be set using the `LLMProvider` or a string:

| LLMProvider | string |
| ----------- | -------- |
| `LLMProvider.OPENAI` | `openai` |
| `LLMProvider.ANTHROPIC` | `anthropic` |
| `LLMProvider.MISTRALAI` | `mistralai` |
| `LLMProvider.GOOGLE_GENERATIVE_AI` | `google-generativeai` |
| `LLMProvider.AZURE_OPENAI` | `azure-openai` |

:::tip[NB]
If not provided, the LLM provider will be inferred from the environment variable.
For example, if `OPENAI_API_KEY` is found, the provider will be set to `LLMProvider.OPENAI`
:::

#### Examples:

Using enum:
```python
from portia import LLMProvider, Config

config = Config(llm_provider=LLMProvider.OPENAI)
```

Using string:
```python
from portia import LLMProvider, Config

config = Config(llm_provider="anthropic")
```

Via environment variable:
```python
import os
from portia import LLMProvider, Config

os.environ["OPENAI_API_KEY"] = "sk-..."

config = Config()
```

### Model overrides

|   |   |
| - | - |
| Config settings | `default_model`, `planning_model`, `execution_model`, `introspection_model`, `summariser_model` |
| Values | `str`, `GenerativeModel` |

Or

|   |   |
| - | - |
| Config setting | `Config.models` |
| Values | `dict[str, GenerativeModel | str]` |

If set, this decides what generative AI model is used in Portia defined Agents and Tools. It will overwrite the default model for the LLM provider.

:::tip[Model string parsing]
Model strings are in the format `provider/model_name`, where the `provider` is the string value of the LLM provider (e.g. `openai`) and the `model_name` is the name of the model you want to use.
Examples: `openai/gpt-4o`, `anthropic/claude-3-5-sonnet`, `mistralai/mistral-large-latest`, `google-generativeai/gemini-1.5-flash`, `azure-openai/gpt-4o`
:::

#### Examples:

Using model string:
```python
from portia import Config

config = Config(default_model="openai/gpt-4o")
```

Using model instance:
```python
from pydantic import SecretStr
from portia import Config
from portia.models import OpenAIGenerativeModel

config = Config(default_model=OpenAIGenerativeModel(model_name="gpt-4o", api_key=SecretStr("sk-...")))
```

Using the `models` property:
```python
from portia import Config
from portia.models import OpenAIGenerativeModel

# You can mix and match model strings and model instances
config = Config(
    models={
        "default_model": OpenAIGenerativeModel(model_name="gpt-4o", api_key=SecretStr("sk-...")),
        "planning_model": "anthropic/claude-3-5-sonnet",
        "summariser_model": "azure-openai/gpt-4o",
    }
)
```

### Models for Tools

Some tools provided by the SDK are LLM-based. You can control the model used by these tools by passing a `model` directly to the tool constructor:

```python
from portia import LLMTool, DefaultToolRegistry

tool_regsitry = DefaultToolRegistry().replace_tool(LLMTool(model="openai/gpt-4o"))

portia = Portia(config=Config.from_default(), tools=tool_regsitry)
```

Like other config options, you can also provide an explicit model instance to the tool constructor:

```python
from portia import LLMTool, DefaultToolRegistry
from portia.models import OpenAIGenerativeModel

new_llm_tool = LLMTool(model=OpenAIGenerativeModel(model_name="gpt-4o", api_key=SecretStr("sk-...")))
tool_regsitry = DefaultToolRegistry().replace_tool(new_llm_tool)
```

### API keys

|   |   |
| - | - |
| Config settings | `openai_api_key`, `anthropic_api_key`, `mistralai_api_key`, `google_generativeai_api_key`, `azure_openai_api_key` |
| Environment variables | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `MISTRALAI_API_KEY`, `GOOGLE_GENERATIVEAI_API_KEY`, `AZURE_OPENAI_API_KEY` |
| Values | `str` |

The keys are used to authenticate with the LLM provider, via the `GenerativeModel` classes.

#### Examples:

Using environment variables:
```python
from pydantic import SecretStr
from portia import Config

config = Config(anthropic_api_key=SecretStr("sk-..."))
```

## Manage storage options
You can control where you store and retrieve plan run states using the `storage_class` property in the `Config` class (<a href="/SDK/portia/config" target="_blank">**SDK reference ↗**</a>), which is an ENUM accessible from the `StorageClass` class:
- `MEMORY` allows you to use working memory (default if PORTIA_API_KEY is not specified).
- `DISK` allows you to use local storage. You will need to set the `storage_dir` appropriately (defaults to the project's root directory).
- `CLOUD` uses the Portia cloud (<a href="/store-retrieve-plan-runs" target="_blank">**Use Portia cloud ↗**</a> - default if PORTIA_API_KEY is specified).

## Other config settings

| Property | Purpose |
| ----------- | ----------- |
| `planner_system_context_extension` | Enrich the system context with more information. For example you can add information specific to a frontend user session such as department, title, timezone etc. |

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
from portia import (
    Config,
    LogLevel,
    Portia,
    StorageClass,
)
from portia.open_source_tools.registry import example_tool_registry

load_dotenv()

# Load the default config with specified storage and logging options
my_config = Config.from_default(
    storage_class=StorageClass.DISK, 
    storage_dir='demo_runs', # Amend this based on where you'd like your plans and plan runs saved!
    default_log_level=LogLevel.DEBUG,
)

# Instantiate a Portia instance. Load it with the default config and with some example tools
portia = Portia(config=my_config, tools=example_tool_registry)

# Execute the plan run from the user query
output = portia.run('Which stock price grew faster in 2024, Amazon or Google?')

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
    ```json title="prun-e3a77013-2bd4-459c-898c-6a8cc9e77d12.json"
    {
        "id": "prun-e3a77013-2bd4-459c-898c-6a8cc9e77d12",
        "plan_id": "plan-72cb538e-6d2b-42ca-a6c2-511a9a4c4f0e",
        "current_step_index": 2,
        "state": "COMPLETE",
        "execution_context": {
            "end_user_id": null,
            "additional_data": {},
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