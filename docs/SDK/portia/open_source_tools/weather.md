---
Sidebar_Label: weather
Title: portia.open_source_tools.weather
---

Tool to get the weather from openweathermap.

## WeatherToolSchema Objects

```python
class WeatherToolSchema(BaseModel)
```

Input for WeatherTool.

## WeatherTool Objects

```python
class WeatherTool(Tool[str])
```

Get the weather for a given city.

#### Run

```python
def run(_: ToolRunContext, city: str) -> str
```

Run the WeatherTool.

