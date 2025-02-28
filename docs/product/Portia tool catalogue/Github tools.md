---
sidebar_position: 4
slug: /github-tools
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Github tools

## How OAuth works
All Portia tools using API endpoints that require OAuth are built with plug and play authentication support. They use Portia client credentials including client ID, client name and redirect URL. Such tools will raise a `Action Clarification` with an OAuth link as the action URL. The `portia.wait_for_ready()` method must be used in this scenario: Portia's OAuth server will listen for the authentication result and resolve the concerned clarification, allowing your plan run to resume again.

For more on this, please visit to the section on running Portia tools (<a href="/run-portia-tools" target="_blank">**↗**</a>). 

## Portia List GitHub Repositories
**Tool ID:** portia:github::list_repos<br/>**Tool description:** Lists all public repositories for a GitHub organization.<br/>**Usage notes:**<br/><br/>**Output schema:** <pre><code>[<br/>  Portia_List_GitHub_Repositories(org: 'string') -> list,<br/>  A list of public repositories.<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "org",<br/>  "type": "string",<br/>  "description": "The organization name."<br/>\}</code></pre>
## Portia Search GitHub Repositories
**Tool ID:** portia:github::search_repos<br/>**Tool description:** Searches all public repositories for a specific term.<br/>**Usage notes:**<br/><br/>**Output schema:** <pre><code>[<br/>  Portia_Search_GitHub_Repositories(search_term: 'string') -> list,<br/>  A list of public repositories that match.<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "search_term",<br/>  "type": "string",<br/>  "description": "The term to search for."<br/>\}</code></pre>
## Portia Star GitHub Repository
**Tool ID:** portia:github::star_repo<br/>**Tool description:** Stars a GitHub repository.<br/>**Usage notes:**<br/><br/>**Output schema:** <pre><code>[<br/>  Portia_Star_GitHub_Repository(repo: 'string') -> str,<br/>  A string indicating successful starring<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "repo",<br/>  "type": "string",<br/>  "description": "The repository to star in the form organization/repository.For example: PortiaAI/portia-sdk-python"<br/>\}</code></pre>