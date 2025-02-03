---
sidebar_position: 2
slug: /open-source-tools
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Open source tools
Portia offers both open source tools as well as a cloud-hosted library of tools to save you development time. You can dig into the specs of those tools in our open source repo (<a href="https://github.com/portiaAI/portia-sdk-python/tree/main/portia/open_source_tools" target="_blank">**SDK repo ↗**</a>).

You can load open source tools into an `InMemoryToolRegistry` object any time, and combine their use with cloud or custom tools as explained in the docs (<a href="/extend-tool-catalogue" target="_blank">**Extend your catalogue ↗**</a>).

## Portia Weather Tool
**Tool ID:** portia::weather_tool<br/>**Tool description:** Get the weather for a given city<br/>**Usage notes:**<br/><br/>**Output schema:** <pre><code>[<br/>  Portia_Weather_Tool(city: 'string') -> str,<br/>  String output of the weather with temp and city<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "city",<br/>  "type": "string",<br/>  "description": "The city to get the weather for"<br/>\}</code></pre>
## Portia Search Tool
**Tool ID:** portia::search_tool<br/>**Tool description:** Searches the internet to find answers to the search query provided and returns those answers. The search tool has access to general information but can not return specific information on users or information not available on the internet<br/>**Usage notes:**<br/><br/>**Output schema:** <pre><code>[<br/>  Portia_Search_Tool(search_query: 'string') -> str,<br/>  str: output of the search results<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "search_query",<br/>  "type": "string",<br/>  "description": "The query to search for. For example, 'what is the capital of France?' or 'who won the US election in 2020?'"<br/>\}</code></pre>
## Portia LLM Tool
**Tool ID:** llm_tool<br/>**Tool description:** A tool that allows you to call an LLM with a prompt and get the output. This is useful for when you need to call an LLM but don't need to use a specific tool.<br/>**Usage notes:**<br/>Can be customized to use a specific LLM model, or to use a specific prompt template. <pre><code>from portia.open_source_tools.llm_tool import LLMTool<br/><br/>llm_tool = LLMTool(model="gpt-4o-mini", provider="openai", prompt="You are a helpful assistant")</code></pre><br/>**Output schema:** <pre><code>[<br/>  LLMTool(task: 'string') -> str,<br/>  str: output of the LLM<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "task",<br/>  "type": "string",<br/>  "description": "The prompt to send to the LLM"<br/>\}</code></pre>
