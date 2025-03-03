---
sidebar_position: 2
slug: /run-portia-tools
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Run Portia tools with authentication
Use clarifications to leverage Portia tools' native authentication support.

:::tip[TL;DR]
- All Portia tools come with built-in authentication, typically using Portia OAuth clients for each relevant resource server.
- Agents raise an `ActionClarification` to interrupt a plan run and require use authentication when necessary.
:::

Portia offers a cloud-hosted library of tools to save you development time. You can find the ever-growing list of Portia tools in the next section (<a href="/portia-tools" target="_blank">**Portia tool catalogue ↗**</a>). All Portia tools come with plug and play authentication. Let's delve into how to handle the user authentication flow.

## Handling auth with `Clarification`

We established in the preceding section that clarifications are raised when an agent needs input to progress. This concept lends itself perfectly to tool authentication. Let's break it down:
- All Portia tools come with built-in authentication, typically using Portia OAuth clients for each relevant resource server.
- Portia provisions the required token with the relevant scope when a tool call needs to be made.
- Tokens provisioned by Portia are reusable / long-lived. If a `end_user_id` was passed with the parent `PlanRun`, Portia will store the provisioned OAuth token against it. You will need to persist this `end_user_id` and use it consistently across plan runs to leverage token reusability (<a href="/manage-end-users" target="_blank">**Manage multiple end users ↗**</a>).
- When a Portia tool call is made, we first attempt to retrieve an OAuth token against the `end_user_id` if provided. When no OAuth token is found, an `ActionClarification` is raised with an OAuth link as the action URL. This OAuth link uses Portia's authentication client and a Portia redirect URL.
- Portia's OAuth server listens for the authentication result and resolves the concerned clarification, allowing the plan run to resume again.

## Bringing the concepts together

Now let's bring this to life by reproducing the experience that you can see on the website's playground (<a href="https://www.portialabs.ai" target="_blank">**↗**</a>). We want to be able to handle a prompt like `Find the github repository of Mastodon and give it a star for me`, so let's take a look at the code below.

<details>
<summary>**Portia API key required**</summary>

We're assuming you already have a Portia API key from the dashboard and set it in your environment variables. If not please refer to the previous section and do that first (<a href="/setup-account" target="_blank">**Set up your account ↗**</a>).

</details>

```python title="main.py" skip=true
from dotenv import load_dotenv
from portia import (
    ActionClarification,
    InputClarification,
    MultipleChoiceClarification,
    PlanRunState,
    Portia,
    PortiaToolRegistry,
    default_config,
)

load_dotenv()

# Instantiate Portia. Load it with the default config and with Portia cloud tools above
portia = Portia(tools=PortiaToolRegistry(default_config()))

# Generate the plan from the user query and print it
plan = portia.plan('Find the github repository of PortiaAI and give it a star for me')
print(f"{plan.model_dump_json(indent=2)}")

# Run the plan
plan_run = portia.run_plan(plan)

while plan_run.state == PlanRunState.NEED_CLARIFICATION:
    # If clarifications are needed, resolve them before resuming the plan run
    for clarification in plan_run.get_outstanding_clarifications():
        # Usual handling of Input and Multiple Choice clarifications
        if isinstance(clarification, (InputClarification, MultipleChoiceClarification)):
            print(f"{clarification.user_guidance}")
            user_input = input("Please enter a value:\n" 
                            + (("\n".join(clarification.options) + "\n") if "options" in clarification else ""))
            plan_run = portia.resolve_clarification(clarification, user_input, plan_run)
        
        # Handling of Action clarifications
        # highlight-start
        if isinstance(clarification, ActionClarification):
            print(f"{clarification.user_guidance} -- Please click on the link below to proceed.")
            print(clarification.action_url)
            plan_run = portia.wait_for_ready(plan_run)
        # highlight-end

    # Once clarifications are resolved, resume the plan run
    plan_run = portia.run(plan_run)

# Serialise into JSON and print the output
print(f"{plan_run.model_dump_json(indent=2)}")
```

Pay attention to the following points:
- We're importing all of Portia's cloud tool library using the `PortiaToolRegistry` import. Portia will (rightly!) identify that executing on this query necessitates both the `SearchGitHubReposTool` and the `StarGitHubRepoTool` in particular. Like all Portia cloud tools, our Github tools are built with plug and play authentication support. They will raise a `Action Clarification` with a Github OAuth link as the action URL.
- We're now introducing the `portia.wait_for_ready()` method to handle clarifications of type `ActionClarification`. This method should be used when the resolution to a clarification relies on a third party system and your `Portia` instance needs to listen for a change in its state. In our example, Portia's OAuth server listens for the authentication result and resolves the concerned clarification, allowing the plan run to resume again.

Your plan run will pause and you should see the link in the logs like so
...
```bash
OAuth required -- Please click on the link below to proceed.
https://github.com/login/oauth/authorize/?redirect_uri=https%3A%2F%2Fapi.portialabs.ai%2Fapi%2Fv0%2Foauth%2Fgithub%2F&client_id=Ov23liXuuhY9MOePgG8Q&scope=public_repo+starring&state=APP_NAME%3Dgithub%253A%253Agithub%26PLAN_RUN_ID%3Daa6019e1-0bde-4d76-935d-b1a64707c64e%26ORG_ID%3Dbfc2c945-4c8a-4a02-847a-1672942e8fc9%26CLARIFICATION_ID%3D9e6b8842-dc39-40be-a298-900383dd5e9e%26SCOPES%3Dpublic_repo%2Bstarring&response_type=code
```

In your logs you should be able to see the tools, as well as a plan and final plan run state similar to the output below. Note again how the planner weaved tools from both the cloud and the example registry.

<Tabs>
  <TabItem value="plan" label="Generated plan">
    ```json title="plan-71fbe578-0c3f-4266-b5d7-933e8bb10ef2.json"
    {
        "id": "plan-71fbe578-0c3f-4266-b5d7-933e8bb10ef2",
        "plan_context": {
            "query": "Find the github repository of PortiaAI and give it a star for me",
            "tool_ids": [
            "portia::list_github_repos_tool",
            "portia::search_github_repos_tool",
            "portia::star_github_repo_tool",
            "portia::send_slack_message",
            "portia::find_slack_message",
            "portia::zendesk_list_groups_for_user_tool",
            ...
            ]
        },
        "steps": [
            {
                "task": "Search for the GitHub repository of PortiaAI",
                "inputs": [],
                "tool_name": "Portia Search GitHub Repositories",
                "output": "$portiaai_repository"
            },
            {
            "task": "Star the GitHub repository of PortiaAI",
            "inputs": [
                {
                    "name": "$portiaai_repository",
                    "value": null,
                    "description": "The GitHub repository of PortiaAI"
                }
            ],
            "tool_name": "Portia Star GitHub Repository",
            "output": "$star_result"
            }
        ]
    }
    ```
  </TabItem>
    <TabItem value="plan run" label="Plan run in final state">
    ```json title="prun-36945fae-1dcc-4b05-9bc4-4b862748e031.json"
    {
        "id": "prun-36945fae-1dcc-4b05-9bc4-4b862748e031",
        "plan_id": "plan-71fbe578-0c3f-4266-b5d7-933e8bb10ef2",
        "current_step_index": 1,
        "state": "COMPLETE",
        "execution_context": {
            "end_user_id": null,
            "additional_data": {},
            "planner_system_context_extension": null,
            "agent_system_context_extension": null
        },
        "outputs": {
            "clarifications": [
                {
                    "uuid": "clar-f873b9be-10ee-4184-a717-3a7559416499",
                    "category": “Multiple Choice”,
                    "response": “portiaAI/portia-sdk-python",
                    "step": 2, 
                    "user_guidance": "Please select a repository.", 
                    "handled": true,
                    "argument": "$portiaai_repository",
                    "options": "[\"portiaAI/portia-sdk-python\", \"portiaAI/docs\", \"portiaAI/portia-agent-examples\"]",
                }
            ],
            "step_outputs": {
            "$portiaai_repository": {
                "value": "[\"portiaAI/portia-sdk-python\", \"portiaAI/docs\", \"portiaAI/portia-agent-examples\"]",
                "summary": null
            },
            "$star_result": {
                "value": "Successfully starred the repository 'portiaAI/portia-sdk-python'.",
                "summary": null
            }
            },
            "final_output": {
            "value": "Successfully starred the repository 'portiaAI/portia-sdk-python'.",
            "summary": null
            }
        }
    }
    ```
  </TabItem>
</Tabs>

:::info
Now that you're familiar with running Portia tools, why not try your hand at the intro example in our <a href="https://github.com/portiaAI/portia-agent-examples/blob/main/get_started_google_tools/README.md" target="_blank">**examples repo (↗)**</a>. In the example ee use the Google Calendar tools to schedule a meeting and handle the authentication process to execute those tool calls.
:::