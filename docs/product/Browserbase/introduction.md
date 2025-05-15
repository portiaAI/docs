# Portia AI integration
## Persistent seamless authentication within a multi-agent framework

<a href="https://www.portialabs.ai">Portia AI</a> is an open-source, multi-agent framework for running reliable production grade agents (<a href="https://github.com/portiaAI/portia-sdk-python">**github repo here↗**</a>). Its core tenets are to enable both multi-agent task planning with human feedback and stateful multi-agent task execution with human control. The framework enables both browser-based and API based agents.

Portia AI offers an open source browser agent implementation using Browserbase to **enable persistent authentication**. When the browser agent needs to authenticate to achieve the task, it leverages Portia's structured human:agent abstraction called a <a href="https://docs.portialabs.ai/understand-clarifications">`clarification`</a> and presents the end user with a <a href="https://docs.browserbase.com/guides/authentication#use-the-session-live-view-to-login">browserbase live session URL</a> that they can use to sign in. Portia incorporates the concept of end users with the <a href="https://docs.portialabs.ai/manage-end-users">`EndUser`</a> abstraction into the framework to delineate the Browserbase sessions associated with them. This enables developers to create powerful applications that can be used by anyone. Note that `clarifications` and end-users in the Portia framework can also be used to implement Oauth for API based tools.

Here are some examples of the kinds of queries that can be handled in 20 lines of code with the Portia / Browserbase integration:
- Send a message to Bob Smith on LinkedIn asking him if he's free on Tuesday for a meeting.
- Get my Google Doc shopping list and add all items in it to my shopping trolley on the Walmart website.
- Book me unto the 8am hot yoga class

The below video shows how you can make a LinkedIn agent with Browserbase and Portia AI:

<div style={{ position: 'relative', paddingBottom: '64.90384615384616%', height: '0' }}>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/hSq8Ww-hagg?si=frZ9F3XsB8xMnYey" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

