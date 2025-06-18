---
sidebar_position: 6
slug: /getting-started-tour
---

# A tour of our SDK

Portia AI enables developers to build powerful, production-ready agents that can interact with real-world APIs, manage context intelligently, and even automate web browsers.
This tutorial provides a whistlestop tour of the SDK to get you started.
It provides four examples, each building on top of the previous to show how to develop increasingly capable AI agents with just a few lines of code.
For a more complete showcase of the SDK's features, including more advanced features or to dive deeper into a particular feature, check out our [full docs site ↗](https://docs.portialabs.ai/).
Our [examples repository ↗](https://github.com/portiaAI/portia-agent-examples) on GitHub also provides some advanced agent examples that can be a useful reference.

## Before you start

Make sure you have the SDK environment set up:

1. Copy `.env.example` to `.env` and fill in the necessary configuration values for the script you want to run.
  Each Python script documents the configuration required to run it at the top of the file.
2. Run any example using:

   ```bash
   uv run <script_name>.py
   ```

   This will:

   * Obtain an appropriate version of Python if necessary.
   * Create a virtual environment for your Python dependencies.
   * Install all required dependencies.
   * Run your script!
  
With that out of the way, let's look at running the first sample script!

## 1. GitHub OAuth integration

**File**: [`1_github_oauth.py` ↗](https://github.com/portiaAI/portia-agent-examples/blob/main/getting-started/1_github_oauth.py)

This is the most straightforward example of using Portia to connect to third-party APIs with OAuth.
It demonstrates how an agent can perform actions on behalf of a user,
such as starring a GitHub repository or checking availability on their Google Calendar.

### Key concepts

* OAuth authentication for third-party services.
* Use of `Portia` with multiple tools.
* Simple command execution.

### Configuring Portia with a .env file

Before we get started with the Portia-specific code, let's talk about configuration.
In all of our examples, we use the popular [`python-dotenv` ↗](https://pypi.org/project/python-dotenv/) library.
This library will read a `.env` file from your current directory,
and copy the variables defined in the file into the Python program's environment.

Portia automatically reads certain environment variables, such as `PORTIA_API_KEY`,
which allows it to connect to the Portia cloud service.
Portia cloud provides useful extra services, such as the ability to:

* See all the plans created or run against your account.
* Store credentials for different services, like the GitHub API.
* Approve certain good plans, making future planning more reliable for your use-cases.

Portia will also automatically look for a variable called `OPENAI_API_KEY`.
If it's available, Portia will configure OpenAI as your underlying default LLM,
used for planning and other tasks that work with human language.

If `OPENAI_API_KEY` is not available, Portia will look for the following keys in order,
and use the first one that is defined:

* `ANTHROPIC_API_KEY`
* `MISTRAL_API_KEY`
* `GOOGLE_API_KEY`
* `AZURE_OPENAI_API_KEY`

Instead of implicitly loading configuration from your environment (and a .env file),
it's often better to explicitly configure Portia.
This can be done when obtaining a `Config` instance,
for example: `config = Config.from_default(llm_provider=LLMProvider.MISTRALAI)`
will override any other API keys configured in the environment.

### Code walkthrough

Let's step through the first code example.
We'll go slower through this first file,
so you can understand all the details,
and in later examples I'll just cover what's changed.

```python id=tour_code_1
from portia import (
   Config,
   Portia,
   PortiaToolRegistry,
   StorageClass,
)
from portia.cli import CLIExecutionHooks
```

Core Portia functionality is stored in the `portia` package.
Other, more specific APIs are in sub-packages.
As you can see here, command-line functionality is stored in `portia.cli`.

| Class                | What does it do?                                                                                                                                                                                                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Config`             | This object will load configuration from the environment, and allow you to configure Portia explicitly in code.                                                                                                                                                                                                |
| `Portia`             | This is the primary class in the Portia SDK, and allows you to plan what an agent will do, and execute that plan with the assistance of any tools that Portia is configured with.                                                                                                                              |
| `PortiaToolRegistry` | This is the default set of tools that allows Portia to interact with APIs such as GitHub and Google. The list of tools provided in the PortiaTool Registry is growing all the time. You can find a complete list in the [Portia Tool Catalogue ↗](https://docs.portialabs.ai/portia-tools)                       |
| `StorageClass`       | This is an enum, allowing you to configure where Portia's state is stored. If you use `StorageClass.CLOUD`, Portia will store plans and plan runs on Portia's servers, allowing various extended functionality. If you would rather store your state locally, use `StorageClass.MEMORY` or `StorageClass.DISK` |

With that out of the way, let's define a task!
This file contains two hard-coded tasks:

```python id=tour_code_2
# A relatively simple task:
task0 = "Star the github repo for portiaAI/portia-sdk-python"

# A more complex task:
task1 = """
Check my availability in Google Calendar for tomorrow between 10am and 12pm.
If I have any free times between 10am and 12pm, please schedule a 30-minute meeting with
bob (bob@portialabs.ai) with title 'Encode Hackathon', and description 'hack it'.
If I don't have any free times, please output the next time after 12pm when I am free.
"""
```

You'll notice, just from the length of the strings, that one task is significantly more complex than the other. For now I'll just focus on `task0`, which automatically [gives us a star on GitHub ↗](https://github.com/portiaAI/portia-sdk-python).

The next step is to put all of the classes that we imported to work,
and to compose a `Portia` instance.
The following code combines configuration,
the list of tools in the Portia Catalogue,
and adds in the `CLIExecutionHooks`,
which adds control-flow for Portia to interrupt the run when required,
and interact with the user on the command-line.

```python id=tour_code_3 depends_on=tour_code_1
# Instantiate a Portia runner.
# Load it with the default config from the environment, and with Portia cloud tools.
# Use the CLIExecutionHooks to allow the user to provide input to the agents via the CLI when needed
my_config = Config.from_default(storage_class=StorageClass.CLOUD)
portia = Portia(
   config=my_config,
   tools=PortiaToolRegistry(my_config),
   # execution_hooks=CLIExecutionHooks(), # add this if you want to use terminal to interact with any plan clarifications raised
)
```

Finally, the `Portia` class is used to run the task!
`portia.run` returns a `PlanRun` object that contains the outputs of the agent run,
including those at each step in the plan.
This is very useful for debugging what the agent did,
as well as obtaining any output from `plan_run.outputs`.

```python id=tour_code_4 depends_on=tour_code_2,tour_code_3
plan_run = portia.run(task0)
```

In this example:

* The agent is initialized with the [default tools ↗](https://docs.portialabs.ai/portia-tools/) that are provided with Portia.
 This includes tools for connecting to the GitHub API and Google Calendar.
* The `run` method receives a high-level instruction.
* Portia handles breaking down the instruction,
 authenticating where needed and calling any necessary tools.

### Running the example

If you haven't done it already, now is a good time to copy the `.env.example`
file and to add your configuration for `PORTIA_API_KEY` (you can grab this from the [the Portia dashboard ↗](https://app.portialabs.ai/dashboard/api-keys) if you don't already have one),
and provide a key for your favourite LLM.

This code has been designed to run with `uv`.
Providing you have `uv` installed, you can run this example with:

`uv run 1_github_oauth.py`

If the user hasn't authorized GitHub yet,
Portia will request authentication before proceeding.
**This is a major feature of Portia!**
Behind the scenes,
this ability for a tool to pause execution of the agent,
and to ask the user for input,
is super-powerful.
We call this process a "clarification."

If you're planning to write your own tools to take advantage of this feature,
do check out the documentation for [clarifications ↗](https://docs.portialabs.ai/understand-clarifications).

### Before moving on

Before moving on, why not swap the task variable provided to `plan.run()`?
Trying out the more complex example can show you how powerful autonomous agents can be!

---

## 2. Tools, end users, and LLMs

**File**: [`2_tools_end_users_llms.py` ↗](https://github.com/portiaAI/portia-agent-examples/blob/main/getting-started/2_tools_end_users_llms.py)

### Key concepts

* Introducing more diverse tools.
* Supporting named end users.
* Separation of planning and execution.

### Code walkthrough

Here's the task that will be execute by default:

```python id=tour_code_5
# Needs Tavily API key
task2 = (
   "Research the price of gold in the last 30 days, "
   "and send bob@portialabs.ai a report about it."
)
```

In order to execute this task,
three tools will be required.

* One tool will be needed to research the price of gold.
 In this example, the planning agent should choose the [Tavily tool ↗](https://tavily.com/).
 Tavily is a research API designed for agents.
* A tool to send an email.
 The planning agent should choose a Google Mail tool for this.
* An LLM (used as a tool!) to generate the email content that will be sent.

Let's skip to near the end 🙂!
The following code configures a Portia instance:

```python id=tour_code_6 depends_on=tour_code_3
# Insert other imports detailed above
from portia import open_source_tool_registry

portia = Portia(
   config=my_config,
   tools=PortiaToolRegistry(my_config) + open_source_tool_registry,
   execution_hooks=CLIExecutionHooks(),
)
```

This is very similar to the previous example.
The first thing to notice in this example is that two tool registries are being provided,
the `PortiaToolRegistry` (which needs to be instantiated with configuration),
and `open_source_tool_registry` which contains some extra open-source tools that are released as part of the Portia SDK.
As seen above, you can combine multiple registries by adding them together,
in the same way as you might combine two Python lists.
(Sometimes tool registries _are_ simply a list of Portia `Tool` objects.)

Finally, let's look at the code that executes the task.
It's slightly different from before:

<!-- Don't send the email in our tests. This won't be shown on the website
```python id=tour_code_invisible_1
task2 = (
   "Research the price of gold in the last 30 days."
)
```
-->
```python id=tour_code_7 depends_on=tour_code_5,tour_code_6,tour_code_invisible_1
plan = portia.plan(task2)
print(plan.pretty_print())

plan_run = portia.run_plan(plan, end_user="its me, mario")
```

Note that this time, instead of calling `portia.run` to plan and execute in a single step,
the code calls `portia.plan`, and then the plan
(after being printed)
is executed with `run_plan`.
Separating out these steps is useful in the case when you would like to validate the plan before it's run,
or even refine the plan before executing.

Note, also, the `end_user` parameter that is passed to `run_plan`.
You can also provide this variable to Portia's `run` method,
if you are planning and executing in a single step.
The `end_user` parameter, as a string, identifies the end-user driving the agent's actions.
It should be a string that uniquely identifies a particular user,
and will be used within the Portia cloud to look up any stored credentials.
This means that if you called `run_plan(end_user="end_user_123")`,
and the user authenticated against the Google API,
future runs of the agent will be authenticated and executed as that user.
When providing an identifier like this,
you should use a value that you can map back to a user session on your own system.
(Don't use "it's me, mario"!)

Here:

* A user is explicitly declared.
* The agent is equipped with tools that allow it to search the web and send emails.
* The instruction combines multiple actions: fetch data, generate a message, and send it.

This example shows how Portia agents can become personalized assistants that combine tool outputs into LLM-generated messages.

---

## 3. Model Context Protocol (MCP)

**File**: [`3_mcp.py` ↗](https://github.com/portiaAI/portia-agent-examples/blob/main/getting-started/3_mcp.py)

### Key concepts

* Setting up an MCP tool registry.
* Configuring Portia to use an MCP tool registry.
* Viewing the final output of a run.

### Code walkthrough

The third example introduces the [Model Context Protocol (MCP) ↗](https://modelcontextprotocol.io/introduction).
At the time of writing, MCP is all-the-rage among the cool kids!
This is a protocol that allows agents to interact with remote tool registries.
Many companies are now providing MCP services alongside their more traditional APIs.
In some cases, including the example below,
the MCP server is a local process that is run directly by the Python code.

Portia supports MCP through the `MCPToolRegistry` class,
which you'll see below.

Here's the task that the example code will execute:

```python id=tour_code_8
task = "Read the portialabs.ai website and tell me what they do"
```

In order to complete this task, a tool will be needed to fetch a web page.
Fortunately, there's an MCP tool to do just that!
The [mcp-server-fetch ↗](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) tool is an MCP server that can be run as a local Python process.
If you were executing it directly from the shell, you could download and run it by calling

```bash
# Don't actually run this:
uvx mcp-server-fetch
```

UVX is provided as part of [UV ↗](https://github.com/astral-sh/uv) and will automatically download and run an executable Python package.
It's also super-fast!

We configured an `MCPToolRegistry` that will run this server with the following code:

```python id=tour_code_9
from portia import McpToolRegistry
registry = McpToolRegistry.from_stdio_connection(
   server_name="fetch",
   command="uvx",
   args=["mcp-server-fetch"],
)
```

This will execute the underlying shell command, _and_ return a `ToolRegistry` object that will allow Portia to call it.

```python id=tour_code_10 depends_on=tour_code_3,tour_code_9
portia = Portia(
   config=my_config,
   tools=registry,
   # execution_hooks=CLIExecutionHooks(), # add this if you want to use terminal to interact with any plan clarifications raised
)
```

If you were running this task as part of a larger application,
your Python code would require access to the end-result of the agent's research.
This can be found in the `PlanRun.outputs.final_output` attribute,
as shown in the last line of code:

```python id=tour_code_11 depends_on=tour_code_8,tour_code_10
print(portia.run(task).outputs.final_output)
```

---

## 4. Browser automation

**File**: [`4_browser_use.py` ↗](https://github.com/portiaAI/portia-agent-examples/blob/main/getting-started/4_browser_use.py)

### Key concepts

* Use of local browser automation
* Use of Browserbase (remote browser-as-a-service)
* Extraction of real-world data from websites

### Code walkthrough

This final example introduces browser-based automation, showing how Portia can automate interactions in real browsers – especially useful when no API is available.
This is a particularly powerful feature when used with websites that require authentication.
Portia is capable of opening a local browser session to allow the user to authenticate.
After successful authentication,
the new browser session details are sent to Browserbase,
where they can then be used remotely to drive the browser,
still authenticated as the local user.
It's important to note that at no point are user credentials shared with Portia!

As with the other examples, let start by looking at the task we wish the agent to complete:

```python id=tour_code_12
task = (
   "Find my connections called 'Bob' on LinkedIn (https://www.linkedin.com)"
)
```

This task doesn't just require the ability to fetch a web page,
like the previous example did.
Instead, it needs the user to log into LinkedIn,
so that the agent can drive the browser as the logged-in user.

```python id=tour_code_13
from portia.open_source_tools.browser_tool import BrowserTool, BrowserInfrastructureOption
# Change `infrastructure_option` to `BrowserInfrastructureOption.REMOTE` to use Browserbase
# instead of local Chrome.
browser_tool = BrowserTool(
    infrastructure_option=BrowserInfrastructureOption.LOCAL
)
```

The code above defines a local browser tool.
If (as here), `infrastructure_option`, is set to `BrowserInfrastructureOption.LOCAL`, then the tool will run Chrome locally, with no remote browser component.
If the argument is set to `BrowserInfrastructureOption.REMOTE` then it will use the remote [Browserbase ↗](https://www.browserbase.com/) service.
In production you'd want to use the Browserbase tool,
but that does require a paid account.
So for running this example locally,
we recommend that you run using the local browser tool.

```python id=tour_code_14 depends_on=tour_code_3,tour_code_12,tour_code_13
portia = Portia(
   config=my_config,
   tools=[browser_tool],
   # execution_hooks=CLIExecutionHooks(), # add this if you want to use terminal to interact with any plan clarifications raised
)

plan_run = portia.run(task)
```

### Running this example

When running this example, it's important to fully shut down any version of Chrome you have running.
The local browser tool needs to start up Chrome with various debugging flags enabled,
as these allow the LLM to drive the browser.

Run the tool with:

```sh
uv run 4_browser_use.py
```

After the planning stage,
you should see a browser start up.
It should navigate to the LinkedIn log in page,
and then pause, allowing you to log into your LinkedIn account.
Once you have logged in,
return to the command-line and follow the instructions to continue.
The agent should then control the browser,
identifying the search box at the top of the screen,
and then using it to locate all your connections called "Bob".
(If you don't have any connections called Bob,
maybe change the task so that it looks up a name you know is in your LinkedIn connection list.)

In this example:

* The agent is capable of using either local or remote browser automation.
* It allows the user to log into LinkedIn,
 navigates the interface,
 and extracts relevant connections.

This highlights Portia's flexibility when building agents that must operate outside the bounds of standard APIs.

### Before moving on

Check out the following video,
showing this feature in action,
with an even more complex and powerful use-case.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hSq8Ww-hagg?si=MEae99Z8n-3X_9Fd" title="Build an AI browser agent to manage LinkedIn connections, with Portia AI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

## Summary table

| Example File                | Focus             | Features Introduced                      |
| --------------------------- | ----------------- | ---------------------------------------- |
| `1_github_oauth.py`         | OAuth API use     | OAuth, basic agent commands              |
| `2_tools_end_users_llms.py` | Multi-tool agent  | End users, multi-step reasoning          |
| `3_mcp.py`                  | Running MCP Tools | MCP format, structured execution         |
| `4_browser_use.py`          | Web automation    | Browser automation, local & remote modes |

These examples form a practical foundation for building agents with Portia.
Look out for tutorials that take these concepts even further, with some sample web applications, integrating with popular frameworks.

We have more tutorials on our [blog ↗](https://blog.portialabs.ai/),
or check out our [GitHub repository ↗](https://github.com/portiaAI/portia-sdk-python).
