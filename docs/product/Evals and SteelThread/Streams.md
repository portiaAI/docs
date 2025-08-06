---
sidebar_position: 6
slug: /Streams
---

# 🌊 Streams

Streams are a way to sample real plans and plan runs from your account allowing you to monitor the performance of your agents in production. 

The overall flow is:

1. From the Portia UI create a new stream including the configuration for sampling. 
2. Wait for the stream to populate with real plans or plan_runs.
3. Invoke the SteelThread `process_stream` function, which will process each plan or plan_run in the stream using LLMAsJudge evaluators and report the results back to Portia. 
4. Visualize the metrics from each run in the Portia UI.


## 💡Use Cases

- Real-time evaluation: Capture live user prompts and score them.
- User feedback loop: Add ground truth or user approval later and backfill metrics.
- Regression detection: Compare stream results over time.


## Basic Usage

```python
from portia import Config, LogLevel
from steelthread.steelthread import SteelThread
from steelthread.streams.stream_processor import StreamConfig

# Setup config and SteelThread
config = Config.from_default(default_log_level=LogLevel.CRITICAL)
st = SteelThread()

# Process a stream
st.process_stream(
    StreamConfig(
        stream_name="stream_v1",
        config=config,
        additional_tags={"feeling": "neutral"},  # Optional metadata
    )
)
```

## 🧠 Stream vs Eval — At a Glance

| Feature             | `process_stream(...)`        | `run_evals(...)`                             |
|---------------------|------------------------------|----------------------------------------------|
| **Input source**     | Dynamic, real-time           | Static, pre-defined test cases               |
| **Repetition/Retry** | 1 by default                 | N times via `iterations`                     |
| **Use case**         | Production runs, monitoring  | Ground truth benchmarking, regression        |
| **Tool stubbing**    | Optional                     | Recommended                                  |
| **Custom evaluation**| Yes                          | Yes                                          |
