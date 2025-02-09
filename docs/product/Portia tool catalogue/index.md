---
title: ""
slug: /portia-tools
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DocCardList from '@theme/DocCardList';

# Portia tool catalogue

## Open source tools
Portia offers both open source tools. You can dig into the specs of those tools in our open source repo (<a href="https://github.com/portiaAI/portia-sdk-python/tree/main/portia/open_source_tools" target="_blank">**SDK repo ↗**</a>). We cover some of those tools in the next section as well. For now if you want to pull a list of all the open source tools you can use the `open_source_tool_registry` to do so. Here's a simple code snippet that examines all the tools in that registry.
```python
import json
import pandas as pd
from portia.open_source_tools.registry import open_source_tool_registry

# Collect tool data into a list
tools_data = []
for tool in open_source_tool_registry.get_tools():
    tools_data.append(tool.model_dump())

# Convert the list of dictionaries to a df and print it
tools_df = pd.DataFrame(tools_data)
print(tools_df)

# Get single tool schema
# highlight-next-line
target_tool_id = "your target tool id e.g. 'search_tool'"
single_tool = open_source_tool_registry.get_tool(target_tool_id)
print(f"Tool schema:\n{single_tool.model_dump_json(indent=2)}\n")

# Get args schema of the tool
args_schema = single_tool.args_schema.model_json_schema().get('properties', {})
print(f"Tool args schema: {json.dumps(args_schema, indent=2)}\n")
```


## Portia cloud tools
Portia also offers a cloud-hosted library of tools to save you development time. The cloud tools typically covers popular public SaaS products like gSuite, Zendesk, Hubspot etc. You get a number of Portia tool calls for free when you sign-up to Portia cloud. You can find the ever-growing list of Portia tools on this page. For more info on the pricing for our cloud offering, please visit our (<a href="https://www.portialabs.ai/pricing" target="_blank">**Pricing page ↗**</a>).  
:::info[Request a tool]
If there's a particular product you would like to see tools for in our library, do feel free to request it and we'll do our best to get it done! (<a href="https://tally.so/r/wzWAAg" target="_blank">**Request a tool ↗**</a>).
:::
<br/>
<Tabs>
    <TabItem value="all_tools" label="Get all live Portia cloud tools">
    Run the following code to return a nicely formatted panda data frame of our cloud tools:
    ```python
    from dotenv import load_dotenv
    import pandas as pd
    from portia.tool_registry import PortiaToolRegistry
    from portia.config import default_config

    load_dotenv()

    # Initialise the tool registry
    portia_tool_registry = PortiaToolRegistry(default_config())

    # Collect tool data into a list
    tools_data = []
    for tool in portia_tool_registry.get_tools():
        tools_data.append(tool.model_dump())

    # Convert the list of dictionaries to a DataFrame and print
    tools_df = pd.DataFrame(tools_data)
    print(tools_df)
    ```
    </TabItem>
    <TabItem value="single_tool" label="Explore a single tool by ID">
    The tables below are admittedly difficult to glean on smaller screens so if you'd like to explore a specific tool, put in the ID of the tool you're interested in from the table below into this handy code snippet:
    ```python
    import json
    from dotenv import load_dotenv
    from portia.tool_registry import PortiaToolRegistry
    from portia.config import default_config

    load_dotenv()

    # Initialise the tool registry
    portia_tool_registry = PortiaToolRegistry(default_config())

    # Get tool schema
    # highlight-next-line
    target_tool_id = "target tool id here e.g. portia::list_github_repos_tool"
    single_tool = portia_tool_registry.get_tool(target_tool_id)
    print(f"Tool schema:\n{single_tool.model_dump_json(indent=2)}\n")

    # Get args schema of the tool
    args_schema = single_tool.args_schema.model_json_schema().get('properties', {})
    print(f"Tool args schema: {json.dumps(args_schema, indent=2)}\n")
    ```
    </TabItem>
</Tabs>

## How Oauth works for Portia cloud tools
All Portia tools using API endpoints that require Oauth are built with plug and play authentication support. They use Portia client credentials including client ID, client name and redirect URL. Such tools will raise a `Action Clarification` with an Oauth link as the action URL. The `runner.wait_for_ready()` method must be used in this scenario: Portia's Oauth server will listen for the authentication result and resolve the concerned clarification, allowing your workflow to resume again.<br/>
For more on this, please visit to the section on running Portia tools (<a href="/run-portia-tools" target="_blank">**↗**</a>). 

<DocCardList />