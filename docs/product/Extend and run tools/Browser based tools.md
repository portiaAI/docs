---
sidebar_position: 6
slug: /browser-tasks
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using browser based tools

Browser-based tools can deploy an agent to browse the internet and retrieve data or enact actions on your behalf. Our browser tool can be used in two modes:
- **Browserbase mode (DEFAULT)**: Runs on a remote chromium instance using <a href="https://www.browserbase.com/">Browserbase</a> as the underlying infrastructure.
- **Local mode**: Runs on a chrome instance on your own computer

The underlying library for navigating the page is provided by <a href="https://browser-use.com">BrowserUse</a>. It uses a number of LLM calls to navigate the page and complete the action.

## Setting up the browser based tools

<Tabs>
  <TabItem value="Browserbase setup" label="browserbase_setup">
    To use browserbase authentication, you must ensure that you have set the `BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID` in your .env file (or equivalent). These can be obtained by creating an account on <a href="https://www.browserbase.com">Browserbase</a> and a free tier is available if you'd like to test out the functionality.
  </TabItem>
  <TabItem value="Local setup" label="local_setup">
    With local setup, the browser tool uses chrome on the machine it is running on. This means that it is not possible to support end-users but is a good way to test or to write agents for your own purposes. To use the browser tool in local mode, you must specify the `BrowserInfrastructureOption`, i.e:
    
    ```python title="local_tool_use.py"
    browser_tool(infrastructure_option=InfrastructureOption.LOCAL)
    ```
  
    You can specify the executable for the Chrome instance, b setting 
  </TabItem>
</Tabs>


## Using browser based tools in your tool registries

## Authentication with browser based tools

Whenever a browser-based tool encounters a page that requires authentication, it will raise a clarification request to the user, just like other Portia tools. The user will need to provide the necessary credentials or authentication information into the website to proceed.

<Tabs>
  <TabItem value="Browserbase Authentication" label="browserbase_authentication">
    In the case of Browserbase Authentication, the end-user will be provided with a URL starting with `browserbase.com/devtools-fullscreen/...`. When the end-user visits this page, they will see the authentication screen to enter their credentials (and any required 2FA or similar checks).

    Once the end-user has performed the authentication, they should then indicate to your application that they have completed the flow, and you should call `portia.resume(plan_run)` to resume the agent. Note if you are using the `CLIClarificationHandler`, this will not work in this way and you will need to override it to ensure this behaviour.
    
    The authentication credentials will persist until the agent completes the flow.
  </TabItem>
  <TabItem value="Local Browser Authentication" label="local_authentication">
    When running via a Local browser, i.e via your own computer, the 
  </TabItem>

</Tabs>

## When to use API vs browser based tools

## Known issues and caveats