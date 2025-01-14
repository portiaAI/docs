---
sidebar_position: 6
slug: /manage-end-users
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Handle multiple end users

Running workflows for a single user is useful, but in most systems you'll want to be able to run a workflow for different users. We call these users `End Users`.

:::tip[Providing End Users is optional]
You can run any workflow without worrying about end users. `End Users` are only relevant when:
- You want to handle tool OAuth authentication on an end user level to ensure fine grained access control of tool calls.
- You want to have improved debugging/reporting in the Portia Dashboard.
:::


## Execution Context

`End Users` are managed through the runner execution context by providing an `end_user_id`.

:::tip[Setting the `end_user_id`]
The `end_user_id` can be any string value that uniquely represents the end user in your system. For example it could be:
- An internal ID assigned in your systems
- An email address for the user
- Any other attribute or set of attributes that is unique. 
:::

We provide a simple interface to pass execution context to the runner. Alongside the `end_user_id` you can also provide a set of additional attributes in the `additional_data` field.

```python title=main.py
from portia.config import Config, LogLevel
from portia.context import execution_context
from portia.example_tools.registry import example_tool_registry
from portia.runner import Runner
from portia.workflow import WorkflowState

runner = Runner(
    Config.from_default(default_log_level=LogLevel.DEBUG),
    tool_registry=example_tool_registry,
)

# We can also provide additional execution context to the process
with execution_context(end_user_id="123", additional_data={"email_address": "hello@portialabs.ai"}):
    plan = runner.plan_query(
        "Get the temperature in London and Sydney and then add the two temperatures rounded to 2DP",
    )
    workflow = runner.create_and_execute_workflow(plan)
```

Running with execution context like this will:
- Pass the `end_user_id` and `additional_data` to the planner and agent LLMs. This is useful to provide data that is specific to the user calling.
- Use the `end_user_id` to uniquely identify the user for Authentication.
- Persist the `end_user_id` and `additional_data` as part of the Workflow if using Portia Cloud to allow for better debugging/reporting.


It's important when using execution context to remember to restore it if your returning to a workflow later:

```python title=main.py
from portia.config import Config, LogLevel
from portia.context import execution_context
from portia.example_tools.registry import example_tool_registry
from portia.runner import Runner
from portia.workflow import WorkflowState

runner = Runner(
    Config.from_default(default_log_level=LogLevel.DEBUG),
    tool_registry=example_tool_registry,
)

# Run the workflow as normal
with execution_context(end_user_id="123", additional_data={"email_address": "hello@portialabs.ai"}):
    plan = runner.plan_query(
        "Get the temperature in London and Sydney and then add the two temperatures rounded to 2DP",
    )
    workflow = runner.create_and_execute_workflow(plan)

# Outside with block there is no execution context

# if we want to resume the workflow we need to explicitly re-set the context
with execution_context(context=workflow.execution_context):
    runner.execute_workflow(workflow)
```
