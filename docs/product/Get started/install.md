---
sidebar_position: 3
slug: /install
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Install and setup
Let's get you set up and run a test query to make sure everything is in order.

:::info[Requirements]
Portia requires **python v3.11 and above**. If you need to update your python version please visit their [docs](https://python.org/downloads/). If you are unsure what python version you have, you can check using
```bash
python3 --version
```
:::

### Install the Portia Python SDK
Run the following command to install our SDK and its dependencies.
```bash
pip install portia-sdk-python
```

### Configure access to your preferred LLM
Set environment variables to connect to one of our currently supported LLMs. We are currently expanding this list. 

<Tabs groupId="llm-provider">
    <TabItem value="openai" label="Open AI" default>
    `gpt-4o-mini` is set as the default model. You can sign up to their platform **[here](https://platform.openai.com/signup)**
    ```bash
    export OPENAI_API_KEY='your-api-key-here'
    ```
    </TabItem>
    <TabItem value="anthropic" label="Anthropic">
    `sonnet-3.5` is set as the default model. You can sign up to their platform **[here](https://www.anthropic.com/api)**
    ```bash
    export ANTHROPIC_API_KEY='your-api-key-here'
    ```
    </TabItem>
    <TabItem value="mistral" label="Mistral">
    `mistral-large-latest` is set as the default model. You can sign up to their platform **[here](https://auth.mistral.ai/ui/registration)**
    ```bash
    export MISTRAL_API_KEY='your-api-key-here'
    ```
    </TabItem>
</Tabs>

### Test your installation from the command line
Let's submit a basic prompt to your LLM using our framework to make sure it's all working fine. We will submit a simple maths question, which should invoke one of the open source tools in our SDK:
<Tabs groupId="llm-provider">
    <TabItem value="openai" label="Open AI" default>
    Open AI is the default LLM provider. Just run:
    ```bash
    portia-cli run "add 1 + 2"
    ```
    </TabItem>
    <TabItem value="anthropic" label="Anthropic">
    To use Anthropic from the CLI, just run:
    ```bash
    portia-cli run --llm-provider="anthropic" "add 1 + 2"
    ```
    </TabItem>
    <TabItem value="mistral" label="Mistral">
    To use Mistral from the CLI, just run:
    ```bash
    portia-cli run --llm-provider="mistralai" "add 1 + 2"
    ```
    </TabItem>
</Tabs>

Portia will return the final state of the plan run created in response to the submitted prompt. We will delve into plan run states more deeply in a later section but for now you want to be sure you can see `"state": "COMPLETE"` and the answer to your maths question e.g. `"final_output": {"value": 3.0}` as part of that returned state. Here's an example output:
```bash
{
    "id": "prun-13a97e70-2ca6-41c9-bc49-b7f84f6d3982",
    "plan_id": "plan-96693022-598e-458c-8d2f-44ba51d4f0b5",
    "current_step_index": 0,
    "clarifications": [],
    # highlight-next-line
    "state": "COMPLETE",
    "step_outputs": {
        "$result": {
            "value": 3.0
        }
    },
    # highlight-start
    "final_output": {
        "value": 3.0
    }
    # highlight-end
}
```

### Test your installation from a python file
As a final verification step for your installation, set up the required environment variables in the `.env` of a project directory of your choice, namely the relevant LLM API keys. We can now replicate the CLI-driven test above from a python file within that directory.

<Tabs groupId="llm-provider">
    <TabItem value="openai" label="Open AI" default>
        In your local `.env` file, set up your API key as an environment variable using `OPENAI_API_KEY`.<br/>
        Then create a file e.g. `main.py` in your project directory and paste the following code in.
        ```python title="main.py"
        from dotenv import load_dotenv
        from portia import (
            Portia,
            default_config,
            example_tool_registry,
        )

        load_dotenv()

        # Instantiate Portia with the default config which uses Open AI, and with some example tools.
        portia = Portia(tools=example_tool_registry)
        # Run the test query and print the output!
        plan_run = portia.run('add 1 + 2')
        print(plan_run.model_dump_json(indent=2))
        ```
    </TabItem>
    <TabItem value="anthropic" label="Anthropic">
        In your local `.env` file, set up your API key as an environment variable using `ANTHROPIC_API_KEY`.<br/>
        Then create a file e.g. `main.py` in your project directory and paste the following code in.
        ```python title="main.py"
        import os
        from dotenv import load_dotenv
        from portia import (
            Config,
            LLMModel,
            LLMProvider,
            Portia,
            example_tool_registry,
        )

        load_dotenv()
        ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')

        # Create a default Portia config with LLM provider set to Anthropic and to the Sonnet 3.5 model
        anthropic_config = Config.from_default(
            llm_provider=LLMProvider.ANTHROPIC,
            llm_model_name=LLMModel.CLAUDE_3_5_SONNET,
            anthropic_api_key=ANTHROPIC_API_KEY
            )
        # Instantiate a Portia instance. Load it with the config and with the example tools.
        portia = Portia(config=anthropic_config, tools=example_tool_registry)
        # Run the test query and print the output!
        plan_run = portia.run('add 1 + 2')
        print(plan_run.model_dump_json(indent=2))
        ```
    </TabItem>
    <TabItem value="mistral" label="Mistral">
        In your local `.env` file, set up your API key as an environment variable using `MISTRAL_API_KEY`.<br/>
        Then create a file e.g. `main.py` in your project directory and paste the following code in.
        ```python title="main.py"
        import os
        from dotenv import load_dotenv
        from portia import (
            Config,
            LLMModel,
            LLMProvider,
            Portia,
            example_tool_registry,
        )

        load_dotenv()
        MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')

        # Create a default Portia config with LLM provider set to Mistral AI and the latest Mistral Large model
        mistral_config = Config.from_default(
            llm_provider=LLMProvider.MISTRALAI,
            llm_model_name=LLMModel.MISTRAL_LARGE,
            mistralai_api_key=MISTRAL_API_KEY
        )
        # Instantiate a Portia instance. Load it with the config and with the example tools.
        portia = Portia(config=mistral_config, tools=example_tool_registry)
        # Run the test query and print the output!
        plan_run = portia.run('add 1 + 2')
        print(plan_run.model_dump_json(indent=2))
        ```
    </TabItem>
</Tabs>


You should see a similar output to the the CLI-driven test we ran in step 4.

We will review the various elements in `main.py` in more detail in later sections. For now you should remember that:
- You will use a `Portia` instance to handle user prompts.
- A `Portia` instance expects a `Config`. This is where you can specify things like the model you want to use and where you want to store plan runs.
- A `Portia` instance also expects `tools`. This can be a list of tools, or a `ToolRegistry` (i.e a collection of tools you want to use).

If you got this far then we're off to the races :racehorse:. Let's get you set up with a Portia account so you can also use our cloud features. 
Don't worry it comes with a free trial (<a href="https://www.portialabs.ai/pricing" target="_blank">**Pricing page ↗**</a>) :wink: