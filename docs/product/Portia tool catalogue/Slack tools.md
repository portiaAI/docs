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

## Portia Send Slack Message
**Tool ID:** portia::send_slack_message<br/>**Tool description:** Send a message to a specific Slack channel.<br/>**Usage notes:**<br/><br/>**Output schema:** <pre><code>[<br/>  Portia_Send_Slack_Message(target: 'string', message: 'string') -> dict,<br/>  dict: Output of the message sent<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "target",<br/>  "type": "string",<br/>  "description": "Slack channel ID (i.e. C084F1FSTFC), channel name (#slack-tool-testing)or user name (@tom) where the message will be sent."<br/>\},<br/>\{<br/>  "name": "message",<br/>  "type": "string",<br/>  "description": "The message content to send."<br/>\}</code></pre>
## Portia Find Slack Message
**Tool ID:** portia::find_slack_message<br/>**Tool description:** Search for a message in a Slack channel or chat.<br/>**Usage notes:**<br/><br/>**Output schema:** <pre><code>[<br/>  Portia_Find_Slack_Message(target: 'string', query: 'string') -> dict,<br/>  dict: Output of the messages found<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "target",<br/>  "type": "string",<br/>  "description": "Slack channel ID (i.e. C084F1FSTFC), channel name (#slack-tool-testing)or user name (@tom) where the message will be sent."<br/>\},<br/>\{<br/>  "name": "query",<br/>  "type": "string",<br/>  "description": "Search query to find the message."<br/>\}</code></pre>