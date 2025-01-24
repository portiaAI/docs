---
sidebar_position: 4
slug: /portia-tools-catalogue
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Portia tool catalogue
Here you will find a catalogue of our cloud-hosted tools.

We'll do our best to keep this page up-to-date but as a fail-safe, you can always visit run the following code to return a nicely mind panda data frame of our cloud tools:
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

## Github

## Slack

## Zendesk

## Google (coming soon)

## Hubspot (coming soon)
