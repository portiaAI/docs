---
title: ""
slug: /
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DocCardList from '@theme/DocCardList';

<p align="center">
    <img src="/img/Logo_Portia_Symbol_Black.png" alt="Portia AI logo" style={{width: "200px"}}/>
</p>

<h1>Welcome to our docs!</h1>
Portia AI is an open source developer framework aimed at making dead simple for any developer to deploy stateful, authenticated agentic workflows.
<br/>Get familiar with the product, break things and give us some feedback on our <a href="https://discord.gg/DvAJz9ffaR" target="_blank">**Discord channel (↗)**</a>.<br/>

## What is Portia AI
The core product accessible in our <a href="https://github.com/portiaAI/portia-sdk-python" target="_blank">**Github repository (↗)**</a> 
is extensible with our complimentary cloud features which are aimed at making production deployments easier and faster.

With our open source capabilities you should be able to:
- Ingest a user query and augment it with our pre-defined system prompting to generate a structured plan.
- Execute a workflow based on a plan, invoking the relevant tools and updating the workflow state at every step.
- Build your own tools.
- Define clarifications to interrupt a workflow and solicit structured human / machine input when necessary, e.g. to handle required authentication or missing input.

Our cloud offering, which can be enabled from the <a href="https://github.com/portiaAI/portia-sdk-python" target="_blank">**Portia dashboard (↗)**</a> 
works seamlessly with our open source library. It will give you the ability to:
- Store and retrieve workflow states and review historical workflow.
- Invoke a library of cloud-hosted tools with authentication handled for you, and access tool call logs.

## Why Portia AI
We are beginning our journey as a developer framework by focusing on this problem set. Do shout if you think we should add to this list :pray:

<table style={{ width: "100%", borderCollapse: "collapse" }}>
  <thead>
    <tr>
      <th style={{ width: "50%", verticalAlign: "top", padding: "8px", fontSize: "16px" }}>**Problem**</th>
      <th style={{ width: "50%", verticalAlign: "top", padding: "8px", fontSize: "16px" }}>**Portia's solution**</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{ width: "50%", verticalAlign: "top", padding: "8px" }}>
        <strong>Planning:</strong> Many use cases require visibility into the LLM’s reasoning, 
        particularly for complex tasks requiring multiple steps and tools. 
        LLMs also struggle picking the right tools as their tool set grows: 
        a recurring limitation for production deployments.
      </td>
      <td style={{ width: "50%", verticalAlign: "top", padding: "8px" }}>
        <strong>Multi-agent plans:</strong> Our open source, multi-shot prompter guides your LLM to 
        produce a <a href="https://docs.portia.dev/generate-plan">Plan</a> in response to a prompt, 
        weaving the relevant tools, inputs, and outputs for every step.
      </td>
    </tr>
    <tr>
      <td style={{ width: "50%", verticalAlign: "top", padding: "8px" }}>
        <strong>Execution:</strong> Tracking an LLM’s progress mid-task is difficult, making it 
        harder to intervene when guidance is needed. This is especially critical for enforcing 
        company policies or correcting hallucinations (hello, missing arguments in tool calls!)
      </td>
      <td style={{ width: "50%", verticalAlign: "top", padding: "8px" }}>
        <strong>Stateful workflows:</strong> Portia will spin up a multi-agent 
        [`Workflow`](https://docs.portia.dev/execute-workflow) to execute on generated plans and 
        track their state throughout execution. Using our 
        [`Clarification`](https://docs.portia.dev/manage-clarifications) abstraction you can 
        define points where you want to take control of workflow execution e.g. to resolve missing i
        nformation or multiple choice decisions. Portia serialises the workflow state, and you can 
        manage its storage / retrieval yourself or use our cloud offering for simplicity.
      </td>
    </tr>
    <tr>
      <td style={{ width: "50%", verticalAlign: "top", padding: "8px" }}>
        <strong>Authentication:</strong> Existing solutions often disrupt the user experience 
        with cumbersome authentication flows or require pre-emptive, full access to every tool—an 
        approach that doesn’t scale for multi-agent assistants. 
      </td>
      <td style={{ width: "50%", verticalAlign: "top", padding: "8px" }}>
        <strong>Extensible, authenticated tool calling:</strong> Bring your own tools on our 
        extensible [`Tool`](https://docs.portia.dev/extend-tool-definitions) abstraction, or use 
        our growing plug and play authenticated 
        [tool library](https://docs.portia.dev/run-portia-tools), which will include a number of 
        popular SaaS providers over time (Google, Zendesk, Hubspot, Github etc.). All Portia tools 
        feature just-in-time authentication with token refresh, offering security without 
        compromising on user experience.
      </td>
    </tr>
  </tbody>
</table>

Alright let's roll our sleeves up and get you spinning up them agents :robot:! Next up we'll install 
the SDK locally and validate your setup, before creating a Portia cloud account.

<DocCardList />