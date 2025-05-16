# Quickstart
# Get started with authenticated web agents
## Build a web agent that can authenticate as a user for advanced web browsing capabilities

### 1/ Get your API key

Go over the Dashboard’s Settings tab:

Then copy your API Key directly from the input and set the BROWSERBASE_API_KEY and Project ID as BROWSERBASE_PROJECT_ID environment variables.

You will also need an API key for an LLM. The below example uses Anthropic by setting ANTHROPIC_API_KEY, but you can add OPENAI_API_KEY, GOOGLE_API_KEY or your own <a href="https://docs.portialabs.ai/manage-config#api-keys">local LLM</a>.

### 2/ Install Portia with Browserbase

```pip install portia-sdk-python[tools-browser-browserbase]```

### 3/ Create a simple agent

The below simple agent examples works with the free trial version of Browserbase to retrieve the headlines from a news website.

```python
# type: ignore
# ruff: noqa
from dotenv import load_dotenv

from portia import (
    Config,
    LLMProvider,
    Portia,
    PortiaToolRegistry,
    StorageClass,
)
from portia.cli import CLIExecutionHooks
from portia.open_source_tools.browser_tool import BrowserTool, BrowserInfrastructureOption

load_dotenv(override=True)

task = "Go to https://www.npr.org and get the headline news story"

my_config = Config.from_default(storage_class=StorageClass.MEMORY,
                                llm_provider=LLMProvider.ANTHROPIC)

portia = Portia(config=my_config,
                tools=PortiaToolRegistry(my_config) + [BrowserTool(infrastructure_option=BrowserInfrastructureOption.REMOTE)],
                execution_hooks=CLIExecutionHooks())

plan_run = portia.run(task, end_user="end_user1")
```

4/ Create an agent with authentication!

Whenever a browser tool encounters a page that requires authentication, it will raise a clarification request to the user. The user will need to provide the necessary credentials or authentication information into the website displayed via a Browserbase live link to proceed. The cookies for that authentication can then be reused for future agent plan runs until they expire (and the user will be asked to authenticate again). To use authentication within Portia and Browserbase, a paid version of Browserbase is required.

The below diagram shows how the system works when authentication is required:

![Browser authentication with clarifications](/img/browser_auth.png)

The below example shows a basic agent run which requires authentication to complete.

```python
from dotenv import load_dotenv

from portia import (
    Config,
    LLMProvider,
    Portia,
    PortiaToolRegistry,
    StorageClass,
)
from portia.cli import CLIExecutionHooks
from portia.open_source_tools.browser_tool import BrowserToolForUrl, BrowserInfrastructureOption

load_dotenv(override=True)

# The task that you want the agent to do
task = ("Find the github repo for portia-sdk-python and star it if it's not already starred.")

# Requires an anthropic API key, ANTHROPIC_API_KEY or use any other LLM.
my_config = Config.from_default(storage_class=StorageClass.MEMORY,
                                llm_provider=LLMProvider.ANTHROPIC)

# Requires a paid browserbase subscription for authentication handling
portia = Portia(config=my_config,
                tools=PortiaToolRegistry(my_config) + [
                    BrowserToolForUrl(url="https://www.github.com",
                                      infrastructure_option=BrowserInfrastructureOption.REMOTE)],
                # CLI execution hooks mean authentication requests will be output to the CLI. You can customise these in your application.
                execution_hooks=CLIExecutionHooks())

plan_run = portia.run(task, end_user="end_user")
```