---
sidebar_position: 1
slug: /handling-large-data-sources
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How agent memory works in Portia AI

With Portia, agents can leverage memory by default.
This allows them to work efficiently when large pieces of data are produced / processed during plans, avoiding latency, cost and performance issues caused when language model context windows fill up.

When a step of a plan produces a large output, for example if a large document is read or downloaded, agents in Portia will automatically store this output in agent memory.
In their plan run state, they also maintain a reference to this output.
Then, if the large output is needed by future steps when running the plan, the value will be pulled in from agent memory as needed.

<div style={{
  overflow: 'hidden',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '10px',
  width: '100%',
  maxWidth: '800px',
  position: 'relative'
}}>
  <img 
    src="/img/agent-memory.png" 
    alt="Agent memory diagram showing how large outputs are stored and referenced" 
    style={{
      width: '100%',
      height: 'auto',
      display: 'block'
    }}
  />
</div>

Agent memories are scoped to a particular run of a plan and persist when a plan is paused to handle a clarification and later resumed. If you are running with Portia cloud storage, you can view the values your agents have stored in agent memory by navigating to the <a href="https://app.portialabs.ai/dashboard/agent-memory" target="_blank">**Agent Memory page ↗**</a>.

## Configuring agent memory

Agent memory uses the storage class that you have configured for your Portia client.
This means you can store memories locally, in the Portia cloud or on disk.
For more details on the available storage classes, see our 
<a href="/manage-config#manage-storage-options" target="_blank">storage options section ↗</a>.

You can also configure the size threshold at which step outputs are written to agent memory using the `large_output_threshold_tokens` config value:
```
portia = Portia(Config.from_default(large_output_threshold_tokens=10000))
```

Step outputs longer than this threshold are automatically written to agent memory. 
This threshold is expressed in tokens, which is a unit of text processed by a language model. 
They can be thought of as being roughly equivalent to words, but with some words taking several tokens. 
For more details, see <a href="https://blogs.nvidia.com/blog/ai-tokens-explained/" target="_blank">this explainer on language model tokens ↗</a>.