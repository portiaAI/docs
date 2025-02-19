---
sidebar_position: 6
slug: /slack-tools
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Slack tools

## How Oauth works
All Portia tools using API endpoints that require Oauth are built with plug and play authentication support. They use Portia client credentials including client ID, client name and redirect URL. Such tools will raise a `Action Clarification` with an Oauth link as the action URL. The `runner.wait_for_ready()` method must be used in this scenario: Portia's Oauth server will listen for the authentication result and resolve the concerned clarification, allowing your workflow to resume again.

For more on this, please visit to the section on running Portia tools (<a href="/run-portia-tools" target="_blank">**↗**</a>). 

## Configure your Slack tools with Portia AI
You will need to create your own Slack App to use with Portia AI. This is so you can control the name and appearance of slack bot activity initiated via the Portia AI framework. Once your slack app is created you can configure your client ID and secret in the Portia dashboard.

### Install a Slack app
1. Head over to <a href="https://api.slack.com/apps" target="_blank">**api.slack.com/apps ↗**</a>
2. Create an app from scratch and select the Slack workplace you would like to use it in.
3. Note down the client ID and secret on the **Basic Information** page. We will need this in a couple of steps from now!
4. In the **OAuth & Permissions** tab further down in the left hand nav, add as **Redirect URL** the following URL `https://api.portialabs.ai/api/v0/oauth/slack` (don't forget to hit that **Save URLs** button!).
5. Under **Bot Token Scopes**, be sure to add the scopes
    - `channels:history` -- View messages and other content in public channels that your Slack app has been added to.
    - `channels:read` -- View basic information about public channels in a workspace.
    - `chat:write` -- Send messages as *@\{your slack app name\}*.
    - `users:read` -- View people in a workspace.
6. Under **User Token Scopes**, be sure to add the scope `search:read` to support searching workplace content.
7. Now scroll up to the top of the **OAuth & Permissions** page and hit the **Install to *\{your workplace name\}*** button.
8. Once that is done, open your Slack app and hit 'Add apps` and be sure to select your new app.

### Configure access in Portia AI
1. Log into your Portia <a href="https://app.portialabs.ai" target="_blank">**dashboard ↗**</a>
2. Navigate to the **Manage Org** tab.
3. Enter the client ID and secret of your Slack app as collected in step 3 of the Slack installation process above.

You are now ready to call Slack tools on our cloud!
 
 
## Portia Send Slack Message
**Tool ID:** portia:slack:bot:send_message<br/>**Tool description:** Send a message to a specific Slack channel.<br/>**Usage notes:**<br/><br/>**Output schema:** <pre><code>[<br/>  Portia_Send_Slack_Message(target: 'string', message: 'string') -> dict,<br/>  dict: Output of the message sent<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "target",<br/>  "type": "string",<br/>  "description": "Slack channel ID (i.e. C084F1FSTFC), channel name (#slack-tool-testing)or user name (@tom) where the message will be sent."<br/>\},<br/>\{<br/>  "name": "message",<br/>  "type": "string",<br/>  "description": "The message content to send."<br/>\}</code></pre>
## Portia Find Slack Message
**Tool ID:** portia:slack:user:find_message<br/>**Tool description:** Search for a message in a Slack channel or chat.<br/>**Usage notes:**<br/><br/>**Output schema:** <pre><code>[<br/>  Portia_Find_Slack_Message(target: 'string', query: 'string') -> dict,<br/>  dict: Output of the messages found<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "target",<br/>  "type": "string",<br/>  "description": "Slack channel ID (i.e. C084F1FSTFC), channel name (#slack-tool-testing)or user name (@tom) where the message will be sent."<br/>\},<br/>\{<br/>  "name": "query",<br/>  "type": "string",<br/>  "description": "Search query to find the message."<br/>\}</code></pre>