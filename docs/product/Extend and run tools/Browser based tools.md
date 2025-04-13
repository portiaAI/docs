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
    browser_tool = BrowserTool(infrastructure_option=BrowserInfrastructureOption.LOCAL)
    ```
  
    You can specify the executable for the Chrome instance, by setting `PORTIA_BROWSER_LOCAL_CHROME_EXEC='path/to/chrome/exec'`. If not specified, the default location on most operating systems will be used. For the agent to work, all other Chrome instances must be closed before the task starts.
  </TabItem>
</Tabs>

## Using browser based tools in Portia

There are 2 ways to use browser based tools within Portia:
- **`BrowserTool()`**: This is a general browser tool and it will be used when a URL is provided as part of the query.
- **`BrowserToolForUrl(url)`**: To restrict the browser tool to a specific URL. This is particularly useful to ensure that the planner is restricted to the domains that you want it to be support.

## Authentication with browser based tools

Whenever a browser-based tool encounters a page that requires authentication, it will raise a clarification request to the user, just like other Portia tools. The user will need to provide the necessary credentials or authentication information into the website to proceed.

<Tabs>
  <TabItem value="Browserbase Authentication" label="browserbase_authentication">
    In the case of Browserbase Authentication, the end-user will be provided with a URL starting with `browserbase.com/devtools-fullscreen/...`. When the end-user visits this page, they will see the authentication screen to enter their credentials (and any required 2FA or similar checks).

    Once the end-user has performed the authentication, they should then indicate to your application that they have completed the flow, and you should call `portia.resume(plan_run)` to resume the agent. Note if you are using the `CLIClarificationHandler`, this will not work in this way and you will need to override it to ensure this behaviour.
    
    The authentication credentials will persist until the agent completes the flow.
  </TabItem>
  <TabItem value="Local Browser Authentication" label="local_authentication">
    When running via a Local browser, i.e via your own computer, the clarification URL will be a regular URL that you can click on to authenticate.
  </TabItem>
</Tabs>

## When to use API vs browser based tools

Browser based tools are very flexible in terms of what they do, however they do not have the same tight permissioning as OAuth tools and require more LLM tools so we recommend balancing between the two and using browser tools when APIs are not available.

## Known issues and caveats

### Popups and authentication
When using Browserbase as the underlying browser infrastructure, if authentication requires a popup, it will not show to the user and they will not be able to log-in. We are investigating solutions for this at the moment.

### Local chrome failing to connect
If you see an issue whereby Chrome opens, but then immediately closes and restarts, the issue is likely because it can't find the user data directory and the debug server is not starting. You can fix this by specifying the env variable `PORTIA_BROWSER_LOCAL_EXTRA_CHROMIUM_ARGS="--user-data-dir='path/to/dir'"` and there's more information about this on the <a href="https://github.com/browser-use/browser-use/issues/291#issuecomment-2792636861">browser-use issue link</a>.