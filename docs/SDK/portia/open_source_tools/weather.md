---
sidebar_label: weather
title: portia.open_source_tools.weather
---

Tool to get the weather from openweathermap.

## WeatherToolSchema Objects

```python
class WeatherToolSchema(BaseModel)
```

Input for WeatherTool.

## WeatherTool Objects

```python
class WeatherTool(Tool)
```

Get the weather for a given city.

#### run

```python
def run(_: ToolRunContext, city: str) -> str
```

Run the WeatherTool.

