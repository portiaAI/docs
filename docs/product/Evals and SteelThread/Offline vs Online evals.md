---
sidebar_position: 2
slug: /offline-online-evals
---

# 💻 Offline vs Online Evals

When working with LLM-based systems and agents, it's not enough to evaluate performance once — you need **ongoing, structured feedback**. This is where **offline** and **online** evals come in.

Each serves a different purpose. Together, they form a complete picture of how your system behaves — both in development and in the wild.

---

## 📦 What Are Offline Evals?

**Offline evals** are static, curated datasets designed to be run repeatedly during development.

- ✅ **Predictable**: You run them on known inputs and expected behaviors.
- 🔁 **Repeatable**: You can rerun the same test set after any code, prompt, or model change.
- 🧪 **Controlled**: You isolate variables to see exactly what changed and why.

### Common Use Cases
- Testing changes to prompts or logic
- Benchmarking a new model
- Regression testing before deploys
- Developing new evaluators or metrics

> Think of offline evals as your **unit tests and benchmarks** for LLM agents.

---

## 🌐 What Are Online Evals?

**Online evals** are dynamic evaluations that operate over live system data — your real-time or recent plans and executions.

- 🚀 **Production-aware**: They track real user traffic and system behavior.
- 🧭 **Continuous**: As new plans and runs are created, they’re automatically evaluated.
- 🧩 **Unfiltered**: They expose blind spots not covered by test datasets.

### Common Use Cases
- Monitoring quality in production
- Detecting silent failures or regressions
- Measuring alignment with user goals
- Spotting drift over time (e.g., LLM or data changes)

> Think of online evals as your **observability layer** for agents in the real world.

---

## 🔍 Key Differences

| Feature            | Offline Evals                        | Online Evals                          |
|--------------------|--------------------------------------|----------------------------------------|
| Input Source       | Static, curated test cases           | Live or recent production data         |
| Frequency          | Manually or on CI                    | Continuous or scheduled                |
| Use Case           | Development, testing, iteration      | Monitoring, regression, drift detection|
| Control            | High — inputs & expectations known   | Low — inputs and outputs are emergent  |
| Scope              | Targeted tasks and edge cases        | Real-world coverage                    |

---

## 🧠 Why We Need Both

Relying on just one is risky:

- **Only offline** means you’re blind to real-world edge cases, user behavior, and model drift.
- **Only online** means you lose the precision and control needed to improve the system safely.

Used together, they give you:

- Confidence in what you **changed**
- Visibility into what’s **happening**
- Tools to **iterate intelligently** and **respond quickly**

---

## 🤔 When Should You Use Each?

| Scenario                                              | Use This Eval Type        |
|-------------------------------------------------------|---------------------------|
| Refactoring prompts                                   | 🧪 Offline                |
| Validating new tool logic                             | 🧪 Offline                |
| Benchmarking multiple models                          | 🧪 Offline                |
| Tracking production quality over time                 | 🌐 Online                |
| Detecting drift from user feedback                    | 🌐 Online                |
| Diagnosing regressions after a release                | 🌐 + 🧪 Both             |
| Building dashboards or leaderboards                   | 🌐 Online                |

---

## 🧬 Evals as a Lifecycle

- **Offline evals** keep your development grounded.
- **Online evals** keep your system honest in production.

Together, they support a feedback loop that’s essential for intelligent, adaptable agents.

> Treat evals as part of your build-measure-learn cycle — not an afterthought.

