# Portia AI integration
## Persistent seamless authentication within a multi-agent framework

<a href="https://www.portialabs.ai">Portia AI</a> is an open-source, multi-agent framework for running reliable production grade agents (<a href="https://github.com/portiaAI/portia-sdk-python">**github repo here↗**</a>). The framework enables both browser-based and API based agents.

For browser-based agents, Portia AI uses Browserbase to enable persistent authentication. When the browser agent needs to authenticate to achieve the task, it creates a structured `clarification` (TODO -- insert link) with a browserbase debug URL (TODO -- insert link) that the user can sign in. Portia incorporates the concept of end-user into the framework to delineate the OAuth tokens and browserbase sessions associated with them. This enables deverlopers to create powerful applications that can be used by anyone.

Here are some examples of the kinds of queries that can be handled in 20 lines of code with the Portia / Browserbase integration:
- Send a message to Bob Smith on LinkedIn asking him if he's free on Tuesday for a meeting.
- Get my Google Doc shopping list and add all items in it to my shopping trolley on the Walmart website.
- Book me unto the 8am hot yoga class

The below video shows how you can make a LinkedIn agent with Browserbase and Portia AI:

TODO: include link

