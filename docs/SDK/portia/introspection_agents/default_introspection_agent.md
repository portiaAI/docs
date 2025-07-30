---
sidebar_label: default_introspection_agent
title: portia.introspection_agents.default_introspection_agent
---

The default introspection agent.

This agent looks at the state of a plan run between steps
and makes decisions about whether execution should continue.

## DefaultIntrospectionAgent Objects

```python
class DefaultIntrospectionAgent(BaseIntrospectionAgent)
```

Default Introspection Agent.

Implements the BaseIntrospectionAgent interface using an LLM to make decisions about what to do.

**Attributes**:

- `config` _Config_ - Configuration settings for the DefaultIntrospectionAgent.

#### \_\_init\_\_

```python
def __init__(config: Config, agent_memory: AgentMemory) -> None
```

Initialize the DefaultIntrospectionAgent with configuration.

**Arguments**:

- `config` _Config_ - The configuration to initialize the DefaultIntrospectionAgent.
- `agent_memory` _AgentMemory_ - The agent memory to use

#### pre\_step\_introspection

```python
def pre_step_introspection(plan: Plan,
                           plan_run: PlanRun) -> PreStepIntrospection
```

Ask the LLM whether to continue, skip or fail the plan_run.

#### apre\_step\_introspection

```python
async def apre_step_introspection(plan: Plan,
                                  plan_run: PlanRun) -> PreStepIntrospection
```

pre_step_introspection is introspection run before a plan happens..

