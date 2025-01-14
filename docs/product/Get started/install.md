---
sidebar_position: 2
slug: /install
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Install and setup
Let's get you set up and run a test query to make sure everything is in order.

:::info[Requirements]
Portia requires **python v3.10 and above**. If you need to update your python version please visit their [docs](https://python.org/downloads/). If you are unsure what python version you have, you can check using
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
Portia allows you to connect to the LLM of your choice using your own API key(s). We are working to support a broader set of models but for now here are the models that our libraries support and how to set the API keys for them.

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
Let's submit a basic prompt to your LLM using our framework to make sure it's all working fine. We will do a simple addition, which should invoke one of the demo tools in our SDK:
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
    portia-cli run "add 1 + 2" --llm-provider="anthropic"
    ```
    </TabItem>
    <TabItem value="mistral" label="Mistral">
    To use Mistral from the CLI, just run:
    ```bash
    portia-cli run "add 1 + 2" --llm-provider="mistralai"
    ```
    </TabItem>
</Tabs>

Portia will return the final state of the workflow created in response to the submitted prompt. We will delve into workflow states more deeply in a later section but for now you want to be sure you can see `"state": "COMPLETE"` and `"final_output": {"value": 3.0}` as part of that returned state. Here's an example output:
```bash
{
    "id": "13a97e70-2ca6-41c9-bc49-b7f84f6d3982",
    "plan_id": "96693022-598e-458c-8d2f-44ba51d4f0b5",
    "current_step_index": 0,
    "clarifications": [],
    "state": "COMPLETE",
    "step_outputs": {
        "$result": {
            "value": 3.0
        }
    },
    "final_output": {
        "value": 3.0
    }
}
```

### Test your installation from a python file
As a final verification step for your installation, let's set up the elementary environment variables in a project directory of your choice and replicate the CLI-driven test above from a python file within that directory. 

<Tabs groupId="llm-provider">
    <TabItem value="openai" label="Open AI" default>
    In your local `.env` file, set up your API key as an environment variable using `OPENAI_API_KEY`.<br/>
    Then create a file e.g. `main.py` in your project directory and paste the following code in.
    ```python title="main.py"
    from portia.runner import Runner
    from portia.config import default_config
    from portia.example_tools.registry import example_tool_registry

    # Create a Portia runner with the default config which uses Open AI, and with the example tools.
    runner = Runner(config=default_config(), tool_registry=example_tool_registry)
    # Run the test query and print the output!
    output = runner.run_query('add 1 + 2')
    print(output.model_dump_json(indent=2))
    ```
    </TabItem>
    <TabItem value="anthropic" label="Anthropic">
        In your local `.env` file, set up your API key as an environment variable using `ANTHROPIC_API_KEY`.<br/>
        Then create a file e.g. `main.py` in your project directory and paste the following code in.
        ```python title="main.py"
        from portia.runner import Runner
        from portia.config import Config
        from portia.example_tools.registry import example_tool_registry

        # Create a default Portia config with LLM provider set to Anthropic. Default to the Sonnet 3.5 model
        anthropic_config = Config.from_default(llm_provider='ANTHROPIC')
        # Instantiate a Portia runner. Load it with the config and with the example tools.
        runner = Runner(config=anthropic_config, tool_registry=example_tool_registry)
        # Run the test query and print the output!
        output = runner.run_query('add 1 + 2')
        print(output.model_dump_json(indent=2))
        ```
    </TabItem>
    <TabItem value="mistral" label="Mistral">
        In your local `.env` file, set up your API key as an environment variable using `MISTRAL_API_KEY`.<br/>
        Then create a file e.g. `main.py` in your project directory and paste the following code in.
        ```python title="main.py"
        from portia.runner import Runner
        from portia.config import Config
        from portia.example_tools.registry import example_tool_registry

        # Create a default Portia config with LLM provider set to Mistral. Defaults to the Large Latest model
        mistral_config = Config.from_default(llm_provider='MISTRALAI')
        # Instantiate a Portia runner. Load it with the config and with the example tools.
        runner = Runner(config=mistral_config, tool_registry=example_tool_registry)
        # Run the test query and print the output!
        output = runner.run_query('add 1 + 2')
        print(output.model_dump_json(indent=2))
        ```
    </TabItem>
</Tabs>


You should see a similar output to the the CLI-driven test we ran in step 4.

We will review the various elements in `main.py` in more detail in later sections. For now you should remember that:
- You will use a `Runner` to handle user prompts using Portia.
- A `Runner` expects a `Config`. This is where you can specify things like the model you want to use and where you want to store Workflow states.
- A `Runner` also expects a tool_registry i.e a collection of tools you want to use.

If you got this far then we're off to the races :racehorse:. Now let's start exploring the developer abstractions Portia offers in more detail!

