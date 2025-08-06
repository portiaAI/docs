---
sidebar_position: 8
slug: /st-results
---

# 📈 Visualize Eval Results

Results from both Streams and Evals are pushed to the Portia UI for visualization.

## Evals

Clicking into a dataset will show you a summary of the current metrics for that dataset. Metrics are plotted by run.

![Eval Metrics](/img/eval_metrics.png)

You can expand each graph to get a detailed view of the metric. This also allows you to group the metric by any tags that were attached. 

![Eval Metric Group](/img/eval_metrics_group.png)

Clicking on a specific run will bring up the detailed summary of each test case from that run. 

![Eval Metric Table](/img/eval_metric_table.png)

Finally clicking on a specific test case will show you the details of each metric.

![Eval Iteration](/img/eval_iteration.png)

## Streams

Stream metrics are likewise pushed to the UI. 

Clicking on any stream will show the latest metrics for it grouped by day to show you the performance of the stream over time.

![Stream Metrics](/img/stream.png)

You can also drill down into the analysis by looking at tags.

![Stream Grouped Metrics](/img/stream_grouped.png)


## Custom Backends

SteelThread is designed to allow for metrics to be pushed to other sinks, simply by implementing the correct metrics backend and passing it as config. 

```python
class StreamMetricsBackend(ABC):
    """Abstract interface for saving metrics."""

    @abstractmethod
    def save_metrics(self, metrics: list[StreamMetric]) -> None:
        """Save a list of tagged metrics for a specific evaluation run.

        Args:
            metrics (list[StreamMetricWithTags]): The metrics to save.

        """
        raise NotImplementedError


class MyMetricsBackend(StreamMetricsBackend):
    def save_metrics(self, metrics: list[StreamMetric]) -> None:
        return    

conf = StreamConfig(stream_name="stream_v1", config=config, metrics_backends=[MyMetricsBackend])
```
