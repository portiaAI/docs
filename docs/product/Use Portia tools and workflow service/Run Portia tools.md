---
sidebar_position: 3
slug: /run-portia-tools
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Run Portia tools
Access our library of tools and view logs of previous tool calls.

:::tip[TL;DR]
- Portia offers a cloud-hosted library of tools spanning popular apps like gSuite, Slack, Zendesk etc.
- We offer several ways of combining tool registries so you can use Portia tools in conjunction with your own custom tools
:::

In a previous section, we explored the `Tool` and `Tool_registry` abstractions. We used example tools that are included in the Portia SDK and we introduced custom tools (<a href="/extend-tool-definitions" target="_blank">**Extend your tool definitions ↗**</a>). 

Portia also offers a cloud-hosted library of tools to save you development time. This typically covers popular public SaaS products like gSuite, Zendesk, Hubspot etc. You get a number of Portia tool calls for free when you sign-up to Portia cloud. You can find the ever-growing list of Portia tools in the next section (<a href="/portia-tools-catalogue" target="_blank">**Portia tool catalogue ↗**</a>). For more info on the pricing for our cloud offering, please visit our (<a href="https://www.portialabs.ai/pricing" target="_blank">**Pricing page ↗**</a>).  
:::info[Request a tool]
If there's a particular product you would like to see tools for in our library, do feel free to request it and we'll do our best to get it done! (<a href="https://tally.so/r/wzWAAg" target="_blank">**Request a tool ↗**</a>).
:::

Now let's try to reproduce the experience that you can see on website's playground (<a href="https:www.portialabs.ai" target="_blank">**↗**</a>). We want to be able to handle a prompt like `Find the github repository of Mastodon and give it a star for me`, so let's take a look at the code below:

```python title="main.py"
from dotenv import load_dotenv
from portia.runner import Runner
from portia.config import default_config
from portia.workflow import WorkflowState
from portia.clarification import MultipleChoiceClarification, InputClarification, ActionClarification
from portia.tool_registry import PortiaToolRegistry

load_dotenv()

# Instantiate a Portia runner. Load it with the default config and with Portia cloud tools above
runner = Runner(config=default_config(), tool_registry=PortiaToolRegistry(default_config()))

# Generate the plan from the user query and print it
plan = runner.generate_plan('Find the github repository of Mastodon and give it a star for me')
print(f"{plan.model_dump_json(indent=2)}")

# Execute the workflow
workflow = runner.create_workflow(plan)
workflow = runner.execute_workflow(workflow)

while workflow.state == WorkflowState.NEED_CLARIFICATION:
    # If clarifications are needed, resolve them before resuming the workflow
    for clarification in workflow.get_outstanding_clarifications():
        # Usual handling of Input and Multiple Choice clarifications
        if isinstance(clarification, (InputClarification, MultipleChoiceClarification)):
            print(f"{clarification.user_guidance}")
            user_input = input("Please enter a value:\n" 
                               + (clarification.choices if clarification.choices else ""))
            workflow = runner.resolve_clarification(workflow, clarification, user_input)
        
        # Handling of Action clarifications
        # highlight-start
        if isinstance(clarification, ActionClarification):
            print(f"{clarification.user_guidance} -- Please click on the link below to proceed.")
            print(clarification.action_url)
            workflow = runner.wait_for_ready(workflow)
        # highlight-end

    # Once clarifications are resolved, resume the workflow
    workflow = runner.execute_workflow(workflow)

# Serialise into JSON an print the output
print(f"{workflow.model_dump_json(indent=2)}")
```

Pay attention to the following points:
- We're importing all of Portia's cloud tool library using the `PortiaToolRegistry` import. Portia will (rightly!) identify that executing on this query necessitates both the `SearchGitHubReposTool` and the `StarGitHubRepoTool` in particular. Like all Portia cloud tools, our Github tools are built with plug and play authentication support. They will raise a `Action Clarification` with a Github Oauth link as the action URL. This Oauth link uses Portia's Github authentication client and a Portia redirect URL.
- The way we handle clarifications is now conditional on their type. While we continue to resolve `InputClarification` and `MultipleChoiceClarification` using `runner.resolve_clarification()`, we're now introducing the `runner.wait_for_ready()` method to handle clarifications of type `ActionClarification`. This method should be used when the resolution to a clarification relies on a third party system and the runner needs to listen for a change in its state. In our example, Portia's Oauth server listens for the authentication result and resolves the concerned clarification, allowing the workflow to resume again. 

Your workflow will pause and you should see the link in the logs like so
...
```bash
OAuth required -- Please click on the link below to proceed.
https://github.com/login/oauth/authorize/?redirect_uri=https%3A%2F%2Fapi.portialabs.ai%2Fapi%2Fv0%2Foauth%2Fgithub%2F&client_id=Ov23liXuuhY9MOePgG8Q&scope=public_repo+starring&state=APP_NAME%3Dgithub%253A%253Agithub%26WORKFLOW_ID%3Daa6019e1-0bde-4d76-935d-b1a64707c64e%26ORG_ID%3Dbfc2c945-4c8a-4a02-847a-1672942e8fc9%26CLARIFICATION_ID%3D9e6b8842-dc39-40be-a298-900383dd5e9e%26SCOPES%3Dpublic_repo%2Bstarring&response_type=code
```

In your logs you should be able to see the tools, as well as a plan and final workflow state similar to the output below. Note again how the planner weaved tools from both the cloud and the example registry.

<Tabs>
  <TabItem value="plan" label="Generated plan">
    ```json title="plan-71fbe578-0c3f-4266-b5d7-933e8bb10ef2.json"
    {
        "id": "71fbe578-0c3f-4266-b5d7-933e8bb10ef2",
        "plan_context": {
            "query": "Find the github repository of Mastodon and give it a star for me",
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
            "task": "Search for the GitHub repository of Mastodon",
            "inputs": [],
            "tool_name": "Portia Search GitHub Repositories",
            "output": "$mastodon_repository"
            },
            {
            "task": "Star the GitHub repository of Mastodon",
            "inputs": [
                {
                "name": "$mastodon_repository",
                "value": null,
                "description": "The GitHub repository of Mastodon"
                }
            ],
            "tool_name": "Portia Star GitHub Repository",
            "output": "$star_result"
            }
        ]
    }
    ```
  </TabItem>
    <TabItem value="workflow" label="Workflow in final state">
    ```json title="workflow-36945fae-1dcc-4b05-9bc4-4b862748e031.json"
    {
        "id": "36945fae-1dcc-4b05-9bc4-4b862748e031",
        "plan_id": "71fbe578-0c3f-4266-b5d7-933e8bb10ef2",
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
                    "uuid": b1c1e1c0-5c3e-1984,
                    "type": “Multiple Choice Clarification”,
                    "response": “mastodon/mastodon",
                    "step": 2, 
                    "user_guidance": "Please select a repository.", 
                    "handled": true,
                    "argument": "$mastodon_repository",
                    "options": "['mastodon/mastodon', 'idaholab/mastodon', 'mastodon/mastodon-ios', 'mastodon/mastodon-android',
                                ...']",
                }
            ],
            "step_outputs": {
            "$mastodon_repository": {
                "value": "['mastodon/mastodon', 'idaholab/mastodon', 'mastodon/mastodon-ios', 'mastodon/mastodon-android',
                            ...']",
                "summary": null
            },
            "$star_result": {
                "value": "Successfully starred the repository 'mastodon/mastodon'.",
                "summary": null
            }
            },
            "final_output": {
            "value": "Successfully starred the repository 'mastodon/mastodon'.",
            "summary": null
            }
        }
    }
    ```
  </TabItem>
</Tabs>

If you wanted to explore all the tools available in the Portia cloud library, you can use the `get_tools` method of the `Tool_registry` class to list them all out. 
```python
from portia.tool_registry import PortiaToolRegistry 
from portia.config import Config

portia_tool_registry = PortiaToolRegistry(Config.from_default(storage_class='CLOUD'))

# Get all tools in a registry
for tool in portia_tool_registry.get_tools():
    print(f"{tool.model_dump_json(indent=2)}\n")
```

Check out the next section for more information about the tools available on Portia cloud.