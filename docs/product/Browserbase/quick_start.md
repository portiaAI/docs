# Get started with authenticated web agents
## Build a web agent that can authenticate as a user for advanced web browsing capabilities

1/ Get your API key

Go over the Dashboard’s Settings tab:

Then copy your API Key directly from the input and set the BROWSERBASE_API_KEY and Project ID as BROWSERBASE_PROJECT_ID environment variables.

2/ Install Portia with Browserbase

```pip install portia-sdk-python[tools-browser-browserbase]```

3/ Create your agent

```
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
task = ("Go to LinkedIn and find all my connections called 'Matt'")

# Requires an anthropic API key, ANTHROPIC_API_KEY or use any other LLM.
my_config = Config.from_default(storage_class=StorageClass.MEMORY,
                                llm_provider=LLMProvider.ANTHROPIC)

# Requires a paid browserbase subscription for authentication handling
portia = Portia(config=my_config,
                tools=PortiaToolRegistry(my_config) + [
                    BrowserToolForUrl(url="https://www.linkedin.com",
                                      infrastructure_option=BrowserInfrastructureOption.REMOTE)],
                # CLI execution hooks mean authentication requests will be output to the CLI. You can customise these in your application.
                execution_hooks=CLIExecutionHooks())

plan_run = portia.run(task, end_user="end_user")
```