---
Sidebar_Tabel: introspection_agent
Title: portia.introspection_agents.introspection_agent
---

BaseIntrospectionAgent is the interface for all introspection agents.

## PreStepIntrospectionOutcome Objects

```python
class PreStepIntrospectionOutcome(PortiaEnum)
```

The Outcome of the introspection.

## PreStepIntrospection Objects

```python
class PreStepIntrospection(BaseModel)
```

The outcome of a pre-step introspection.

## BaseIntrospectionAgent Objects

```python
class BaseIntrospectionAgent(ABC)
```

Interface for introspection.

This class defines the interface for introspection.
By introspection we mean looking at the state of a plan run and making decisions
about whether to continue.

**Attributes**:

- `config` _Config_ - Configuration settings for the PlanningAgent.

#### \_\_init\_\_

```python
def __init__(config: Config, agent_memory: AgentMemory) -> None
```

Initialize the BaseIntrospectionAgent with configuration.

**Arguments**:

- `config` _Config_ - The configuration to initialize the BaseIntrospectionAgent.
- `agent_memory` _AgentMemory_ - The agent memory to use

#### pre\_step\_introspection

```python
@abstractmethod
def pre_step_introspection(plan: Plan,
                           plan_run: PlanRun) -> PreStepIntrospection
```

pre_step_introspection is introspection run before a plan happens..

