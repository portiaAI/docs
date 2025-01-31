---
sidebar_position: 7
slug: /spotify-tools
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Spotify tools

## How Oauth works
All Portia tools using API endpoints that require Oauth are built with plug and play authentication support. They use Portia client credentials including client ID, client name and redirect URL. Such tools will raise a `Action Clarification` with an Oauth link as the action URL. The `runner.wait_for_ready()` method must be used in this scenario: Portia's Oauth server will listen for the authentication result and resolve the concerned clarification, allowing your workflow to resume again.

For more on this, please visit to the section on running Portia tools (<a href="/run-portia-tools" target="_blank">**↗**</a>). 

## Portia Create Playlist Tool
**Tool ID:** portia::spotify_create_playlist_tool<br/>**Tool description:** Create a playlist on Spotify.<br/>**Usage notes:**<br/><br/>**Output schema:** <pre><code>[<br/>  Portia_Create_Playlist_Tool(playlist_name: 'string') -> str,<br/>  str: output of the search results<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "playlist_name",<br/>  "type": "string",<br/>  "description": "The name of the playlist to create."<br/>\}</code></pre>
## Portia Search Tracks Tool
**Tool ID:** portia::spotify_search_tracks_tool<br/>**Tool description:** Search for tracks on Spotify.<br/>**Usage notes:**<br/><br/>**Output schema:** <pre><code>[<br/>  Portia_Search_Tracks_Tool(query: 'string') -> list[dict[str, Any]],<br/>  Information about the tracks found<br/>]</code></pre>**Args schema:** <pre><code>\{<br/>  "name": "query",<br/>  "type": "string",<br/>  "description": "The query to search for tracks on Spotify."<br/>\}</code></pre>