---
sidebar_position: 4
slug: /manage-end-users
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Handle multiple end users

Portia has been built from the ground up for production deployments and one of the most important aspects of this is having a first class representation of your users within Portia. We call these entities end users, the people or companies that you are running agentic workflows for. 


:::tip[TL;DR]
The `EndUser` class can be used represent your users within `Portia`.
- The `external_id` field in an `EndUser` object uniquely represents the end user in your system e.g. an internal ID or an email address.
- `names`, `emails` and `phone_numbers` can all be stored against this object. They can dynamically be updated in tools. All changes to `end_user` models are persisted in storage.
- `additional_data` can be used to pass user specific info that may be relevant to the response such as title and department.
- If you don't provide an `end_user` the system will generate one to represent you.
:::


## End Users at Portia

In Production, you will be running plans for many stakeholders including customers, employees and partners. You may want to pass information specific to these individuals when they submit a prompt and / or information specific to the current context they are operating in (e.g. the particular app they are using when they submit their prompt to initiate a plan run).

We refer to these "person" entities as **end users** and represent them through the `EndUser` model.
- You can pass either a string or a full `EndUser` to the plan + run endpoints. The string or external ID can be any value that uniquely represents the end user in your system e.g. an internal ID or an email address.
- Alongside the `end_user_id` you can also provide a set of additional attributes in the `additional_data` field.

## Pass the EndUser to the plan run

```python title="main.py"
from dotenv import load_dotenv
from portia import (
    Portia,
    default_config,
    example_tool_registry,
    execution_context,
)
from portia.end_user import EndUser

load_dotenv()

portia = Portia(tools=example_tool_registry)

# We can provide it as a string
# highlight-start
plan_run = portia.run(
    "Get the temperature in Svalbard and write me a personalized greeting with the result.",
    end_user="my_user_id_123"
)
# highlight-end

# Or provide additional information through the model:
# highlight-start
plan_run = portia.run(
    "Get the temperature in Svalbard and write me a personalized greeting with the result.",
    end_user=EndUser(external_id="my_user_id_123", name="Nicholas of Patara")
)
# highlight-end

print(plan_run.model_dump_json(indent=2))
```

The result of this code block will be the addition of an `end_user` within the `PlanRun` state, and a `final_output` that is indeed personalised to Saint Nicholas (known by his stage name Santa Claus):
```json title="plan_run_state.json"
{
  "id": "prun-d9991518-92d7-447f-bf28-4f7b9b8110ce",
  "plan_id": "plan-4f497c60-c33e-40ea-95b4-cd2054559fff",
  "current_step_index": 1,
  "clarifications": [],
  "state": "COMPLETE",
  # highlight-start
  "end_user": { 
    "external_id": "DemoUser123",
    "name": "Nicholas of Patara",
  },
  # highlight-end
  "step_outputs": {
    "$svalbard_temperature": {
      "value": "The current weather in Svalbard is light snow with a temperature of -11.53°C."
    },
    "$personalized_greeting": {
      "value": "Hello Nicholas of Patara, I hope you are keeping warm. With the current weather in Svalbard showing light snow and a temperature of -11.53°C, make sure to bundle up and stay cozy!"
    }
  },
  # highlight-start
  "final_output": {
    "value": "Hello Nicholas of Patara, I hope you are keeping warm. With the current weather in Svalbard showing light snow and a temperature of -11.53°C, make sure to bundle up and stay cozy!"
  }
  # highlight-end
}
```


## Accessing End Users in a tool

End User objects are passed through to the tool run function as part of the `ToolRunContext`. This allows you to access attributes for your users in tools.

You can also update attributes in tools, which will be persisted to storage upon completion of the tool call. This provides a way of storing useful data about the user.

```python title="main.py"
from pydantic import BaseModel, Field
from portia.tool import Tool, ToolRunContext

class EndUserUpdateToolSchema(BaseModel):
    """Input for AdditionTool."""

    name: str | None = Field(default=None, description="The new name for the end user.")


class EndUserUpdateTool(Tool):
    """Adds two numbers."""

    id: str = "end_user_update"
    name: str = "End User Update Tool"
    description: str = "Updates the name of the end user"
    args_schema: type[BaseModel] = EndUserUpdateToolSchema
    output_schema: tuple[str, str] = ("str", "str: The new name")

    def run(self, ctx: ToolRunContext, name: str) -> str:
        """Change the name."""
        ctx.end_user.name = name
        ctx.end_user.set_attribute("has_name_update", "true")
        return name
```

## End User and OAuth tokens

If you are using Portia Cloud Tools which support user level OAuth tokens, these tokens are stored against the EndUser of the `plan_run`. If you have the setting enabled (see Security), tokens will be reused for each end user reducing the number of authentication flows they must do.
This makes setting an `end_user` correctly important in this case to avoid token collision issues.
