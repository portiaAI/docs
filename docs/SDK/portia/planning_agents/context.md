---
sidebar_label: context
title: portia.planning_agents.context
---

Context helpers for PlanningAgents.

#### render\_prompt\_insert\_defaults

```python
def render_prompt_insert_defaults(query: str,
                                  tool_list: list[Tool],
                                  examples: list[Plan] | None = None) -> str
```

Render the prompt for the PlanningAgent with defaults inserted if not provided.

#### default\_query\_system\_context

```python
def default_query_system_context() -> list[str]
```

Return the default system context.

#### get\_tool\_descriptions\_for\_tools

```python
def get_tool_descriptions_for_tools(
        tool_list: list[Tool]) -> list[dict[str, str]]
```

Given a list of tool names, return the descriptions of the tools.

