---
sidebar_position: 2
slug: /install
---
# Install and setup
Let's get you set up and run a test query to make sure everything is in order.

:::info[Requirements]
Portia requires **python v3.12 and above**. If you need to update your python version please visit their [docs](https://python.org/downloads/).<br/>We also use **Poetry** to manage all project dependencies. Please reference their [docs](https://python-poetry.org/docs/) if you are not familiar with it.
:::

### 1/ Create a Poetry project
From your preferred project directory, run the command below from the CLI to initialise your Poetry project. You should then see a `pyproject.toml` file in your project directory.
```bash
poetry init
```
If you are unsure what python version you have in your Poetry environment, yoou can you can enforce using the correct version as follows:
```bash
poetry env use python3.12 
```

### 2/ Install the Portia Python SDK
Run the following command to install our SDK and its dependencies.
```bash
poetry add portia-sdk-python
```

### 3/ Configure access to your preferred LLM
Portia allows you to connect to the LLM of your choice using your own API key(s). We are working to support a broader set of models but for now here are the models that our libraries support and how to set the API keys for them (using bash for macOS and Linux).

**Open AI**: gpt-4o-mini is set as the default model. You can sign up to their platform **[here](https://platform.openai.com/signup)**
```bash
export OPENAI_API_KEY='your-api-key-here'
```
**Anthropic**: XXX is set as the default model. You can sign up to their platform **[here](https://www.anthropic.com/api)**
```bash
export ANTHROPIC_API_KEY='your-api-key-here'
```
**Mistral**: XXX is set as the default model. You can sign up to their platform **[here](https://auth.mistral.ai/ui/registration)**
```bash
export MISTRAL_API_KEY='your-api-key-here'
```

### 4/ Test your installation from the command line
Let's submit a simple query to your LLM using our framework. We can ask to do a simple addition, which should invoke one of the simple tools we offer in our open source repo:
```bash
# Enter the poetry shell environment
poetry shell
# Submit a simple query to your LLM  via Portia
portia-cli run "add 1 + 2"
```
Portia will return the final state of the workflow created in response to the submitted prompt. We will delve into workflow states more deeply in a later section but for now you want to be sure you can see `state=WorkflowState.COMPLETE` and `final_output=Output(value=3)` as part of that returned state. Here's an example output:
```bash
id=UUID('f5686410-d285-47bf-973a-952cb3281296') 
plan_id=UUID('53add6f6-f9c5-49ca-903e-7c7b71136aa9'
current_step_index=0 
clarifications=[] 
# highlight-next-line
state=<WorkflowState.COMPLETE: 'COMPLETE'> 
step_outputs={'$sum': Output(value=3)} 
# highlight-next-line
final_output=Output(value=3)
```

### 5/ Test your installation from a python file
As a final verification step for your installation, let's replicate the CLI-driven test above from a python file. To do so, create a file e.g. `main.py` in your project directory and paste the following code in.
```python title="main.py"
from portia.runner import Runner
from portia.config import default_config
from portia.example_tools.registry import example_tool_registry

# Instantiate a Portia runner. Load it with the default config and with the example tools.
runner = Runner(config=default_config(), tool_registry=example_tool_registry)
# Run the test query and print the output!
output = runner.run_query('add 1 + 2')
print(output)

```
When you run this file (using `poetry run python3 main.py` in Poetry), you should see a similar output to the the CLI-driven test we ran in step 4.

We will review the various elements in `main.py` in more detail in later sections. For now you should remember that:
- You will use a `runner` to handle user prompts using Portia
- A `runner` expects a `config`. This is where you can specify things like the model you want to use and where you want to store Workflow states.
- A `runner` also expects a tool_registry i.e a collection of tools you want to use.

If you got this far then we're off to the races :racehorse:. Now let's start exploring the developer abstractions Portia offers in more detail!

