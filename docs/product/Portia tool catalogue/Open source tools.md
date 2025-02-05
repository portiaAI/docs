---
sidebar_position: 2
slug: /open-source-tools
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Open source tools
Portia offers both open source tools as well as a cloud-hosted library of tools to save you development time. You can dig into the specs of those tools in our open source repo (<a href="https://github.com/portiaAI/portia-sdk-python/tree/main/portia/open_source_tools" target="_blank">**SDK repo ↗**</a>).

You can import our open source tools into your project using `from portia.open_source_tools.registry import open_source_tool_registry` and load them into an `InMemoryToolRegistry` object. You can also combine their use with cloud or custom tools as explained in the docs (<a href="/extend-tool-catalogue" target="_blank">**Extend your catalogue ↗**</a>).

## Weather Tool
**Tool ID:** portia::weather_tool<br/>**Tool description:** Get the weather for a given city<br/>**Usage notes:**<br/>This tool uses a simple GET endpoint from OpenWeatherMap. Please sign up to obtain an API key from them (<a href="https://home.openweathermap.org/users/sign_in" target="_blank">**↗**</a>) and set it in the environment variable `OPENWEATHERMAP_API_KEY`.<br/>**Output schema:** <pre><code>[<br/>  Portia_Weather_Tool(city: 'string') -> str,<br/>  String output of the weather with temp and city<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "city",<br/>  "type": "string",<br/>  "description": "The city to get the weather for"<br/>\}</code></pre>
## Search Tool
**Tool ID:** portia::search_tool<br/>**Tool description:** Searches the internet to find answers to the search query provided and returns those answers. The search tool has access to general information but can not return specific information on users or information not available on the internet<br/>**Usage notes:**<br/>This tool requires a Tavily key. Head over to their website to provision one (<a href="https://tavily.com/" target="_blank">**↗**</a>). You will need to set it in the environment variable `TAVILY_API_KEY`.<br/>**Output schema:** <pre><code>[<br/>  Portia_Search_Tool(search_query: 'string') -> str,<br/>  str: output of the search results<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "search_query",<br/>  "type": "string",<br/>  "description": "The query to search for. For example, 'what is the capital of France?' or 'who won the US election in 2020?'"<br/>\}</code></pre>
## LLM Tool
**Tool ID:** llm_tool<br/>
**Tool description:** A Jack-of-all-trades tool to respond to a prompt by relying solely on LLM capabilities. This includes using LLM general knowledge, in-built reasoning and code interpreter capabilities. This tool can be used to summarize the outputs of other tools, make general language model queries or to answer questions. This should be used only as a last resort when no other tool satisfies a step in a task<br/>
**Usage notes:**<br/>We recommend you include this tool in all plans / workflows as a fail safe. This minimises the likelihood that the LLM assumes it doesn't have the tools to perform certain simple tasks that are otherwise not tool-specific. The LLM tool can be customized to use a specific LLM model, or to use a specific prompt template.
```python
from portia.open_source_tools.llm_tool import LLMTool

llm_tool = LLMTool(
    model="gpt-4o-mini", 
    provider="openai", 
    prompt="You are a helpful assistant"
)
```
**Output schema:** <pre><code>[<br/>  LLMTool(task: 'string') -> str,<br/>  str: output of the LLM<br/>]</code></pre>
**Args schema:** <pre><code>\{<br/>  "name": "task",<br/>  "type": "string",<br/>  "description": "The prompt to send to the LLM"<br/>\}</code></pre>
