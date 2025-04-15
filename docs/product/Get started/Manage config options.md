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

Portia uses providers such as OpenAI and Anthropic for usage of generative AI models. You can configure the provider that Portia will use with the `llm_provider` config setting.

If set, this decides which generative AI models are used in Portia defined Agents and Tools. Portia has built-in defaults for which models to use for each provider, so at a minimum you only need to set this property.

Options for setting the LLM provider are:

| Option | Values |
| - | - |
| `LLMProvider` enum | `LLMProvider.OPENAI`<br/>`LLMProvider.ANTHROPIC`<br/>`LLMProvider.MISTRALAI`<br/>`LLMProvider.GOOGLE_GENERATIVE_AI`<br/>`LLMProvider.AZURE_OPENAI`<br/>`LLMProvider.OLLAMA` |
| Provider name (`str`) | `"openai"`<br/>`"anthropic"`<br/>`"mistralai"`<br/>`"google-generativeai"`<br/>`"azure-openai"`<br/>`"ollama"` |
| Inferred from environment variable | `OPENAI_API_KEY`<br/>`ANTHROPIC_API_KEY`<br/>`MISTRAL_API_KEY`<br/>`GOOGLE_API_KEY`<br/>`AZURE_OPENAI_API_KEY` |


#### Examples:

Using the `LLMProvider` enum:
```python
from portia import LLMProvider, Config

config = Config.from_default(llm_provider=LLMProvider.OPENAI)
```

Passing the Provider name as a string value:
```python
from portia import LLMProvider, Config

config = Config.from_default(llm_provider="anthropic")
```

Inferred from environment variables (if `OPENAI_API_KEY=sk-...` is in the environment variables):
```python
from portia import LLMProvider, Config

config = Config.from_default()  # config.llm_provider => LLMProvider.OPENAI
```

### API keys

The API keys for the LLM Providers can be set via `Config` class properties or environment variables.

| Option | Values |
| - | - |
| Config property | `openai_api_key`, `anthropic_api_key`, `mistralai_api_key`, `google_generativeai_api_key`, `azure_openai_api_key` |
| Environment variable | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `MISTRALAI_API_KEY`, `GOOGLE_GENERATIVEAI_API_KEY`, `AZURE_OPENAI_API_KEY` |


#### Examples:

Passing the API key to the `Config` class:
```python
from portia import Config

config = Config.from_default(anthropic_api_key="sk-...")
```

### Model overrides

You can configure Portia to use specific models for different components, overriding the default model for the LLM provider.

You might do this if you want to:
- Trade off cost against performance, for example using a cheaper model for the Planning Agent
- Extend Portia to support an LLM provider that we do not natively support
- Mix and match models from different providers, for example using OpenAI o3-mini for the Planning Agent and Anthropic Claude 3.7 Sonnet for everything else

The preferred way to do this is via the `Config.from_default(...)` method, which allows you to specify the models using the following arguments:
- `default_model` - The fallback default model for all use-cases if not specified elsewhere
- `planning_model` - The model used for the Planning process
- `execution_model` - The model used for the execution of a step
- `introspection_model` - The model used for evaluating conditionals
- `summarizer_model` - The model used for summarizing the output of a step

You can configure each of these models in the following ways:

| Option | Value |
| - | - |
| Model name (`str`) | A `str` in the form `provider/model_name`, for example `openai/gpt-4o`. See tip below for more examples. |
| Model object (`GenerativeModel`) | An instance of a `GenerativeModel` class. See [Bring your own models](#bring-your-own-models) below for more details. |

Alternatively, if setting the models directly in the `Config` class, you should use the `models` property, which is a `GenerativeModelsConfig` instance. See the example below for more details.

:::tip[Configuring models with model names]
Model strings are in the format `provider/model_name`, where the `provider` is the string value of the LLM provider (e.g. `openai`) and the `model_name` is the name of the model you want to use.<br/>
Examples:
- `openai/gpt-4o`
- `anthropic/claude-3-5-sonnet`
- `mistralai/mistral-large-latest`
- `google-generativeai/gemini-1.5-flash`
- `azure-openai/gpt-4o`
:::

#### Examples:

Setting the default model by its name:
```python
from portia import Config

config = Config.from_default(default_model="openai/gpt-4o")
```

Mixing and matching models from different providers. Make sure that the relevant API keys are set in the environment variables, or passed along with the model name:

```python
from portia import Config

config = Config.from_default(default_model="openai/gpt-4o", planning_model="anthropic/claude-3-5-sonnet")
```


### Models for Tools

Some tools provided by the SDK are LLM-based. You can control the model used by these tools by passing a `model` directly to the tool constructor:

```python
import dotenv
from portia import Config, DefaultToolRegistry, LLMTool, Portia
from portia.model import OpenAIGenerativeModel

dotenv.load_dotenv()

config = Config.from_default()

tool_registry = DefaultToolRegistry(config).replace_tool(
    LLMTool(model="openai/gpt-4.1-mini")
)

portia = Portia(config=config, tools=tool_registry)
```

If you do not provide a model, the default model for the LLM provider will be used.

### Bring your own models

You can bring your own models to Portia by implementing the `GenerativeModel` (<a href="/SDK/portia/model#generativemodel-objects" target="_blank">**SDK reference ↗**</a>) interface and passing an instance of your class to the `Config` class.

```python
from portia import Config, GenerativeModel, LLMProvider, Message
from pydantic import BaseModel
from langchain_core.language_models.chat_models import BaseChatModel

class MyGenerativeModel(GenerativeModel):
    provider: LLMProvider = LLMProvider.CUSTOM

    def get_response(self, messages: list[Message]) -> Message:
        """Requires implementation"""

    def get_structured_response(
        self,
        messages: list[Message],
        schema: type[BaseModel],
    ) -> BaseModel:
        """Requires implementation"""

    def to_langchain(self) -> BaseChatModel:
        """Requires implementation"""

config = Config.from_default(
    default_model=MyGenerativeModel("my-model-name")
)
```

In this case you do **not** need to set the `llm_provider` config setting, or provide any API keys.

:::tip[NB]
Currently Portia relies on LangChain `BaseChatModel` clients in several places, so we are limited to the models that LangChain supports.<br/>
Thankfully, this is a very <a href="https://python.langchain.com/docs/integrations/providers/" target="_blank">broad set of models</a>, so there is a good chance that your model of choice is supported.
:::


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