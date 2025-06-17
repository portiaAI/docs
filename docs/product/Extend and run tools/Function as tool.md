---
sidebar_position: 4
slug: /function-as-tool
---

# Function as tool

Portia provides a simple and straightforward way to create custom tools from Python functions using the `@tool` [decorator](https://peps.python.org/pep-0318/). This approach automatically converts your functions into tools, eliminating the need to manually create classes and schemas.

## Basic usage

Here's a simple example of creating a tool from a Python function using the `@tool` decorator:

```python title="custom_tools/query_cv.py" id="query_cv"
from portia import tool
from typing import Annotated

@tool
def query_cv(name: Annotated[str, "Full name of the person to query"]) -> str:
    """Query the CV of a person."""
    cv_data = {
        "David Brent": "David is a 35 year old general manager at Wernham Hogg, based in Slough.",
        "Jen Barber": "A 27 year old relationship manager at Raymond Industry. She lives in Hammersmith.",
    }

    return cv_data.get(name, "No data found")
```

This example is equivalent to the following class-based tool:

```python
from portia import Tool
from portia.tool import ToolRunContext
from pydantic import BaseModel, Field
from typing import Annotated

class QueryCvSchema(BaseModel):
    name: str = Field(..., description="Name of the person to query")

class QueryCvTool(Tool[str]):
    name: str = "Query CV"
    description: str = "Query the CV of a person."
    args_schema: type = QueryCvSchema

    def run(self, _: ToolRunContext, name: str) -> str:
        cv_data = {
            "David Brent": "David is a 35 year old general manager at Wernham Hogg, based in Slough.",
            "Jen Barber": "A 27 year old relationship manager at Raymond Industry. She lives in Hammersmith.",
        }

        return cv_data.get(name, "No data found")
```

## Working with context

Tools can access the execution context by including a `ctx` or `context` parameter. This provides access to the underlying Portia plan and configuration. In the example below, we use the `ctx` parameter to access the default model and extract structured information from text.

```python title="custom_tools/extract_personal_info.py" id="extract_personal_info"
from portia.tool import ToolRunContext
from portia import tool
from portia.model import Message
from pydantic import BaseModel, Field
from typing import Annotated

class PersonalInfo(BaseModel):
    """Personal information."""

    name: str = Field(..., description="The name of the person")
    age: int = Field(..., description="The age of the person")
    occupation: str = Field(..., description="The occupation")
    company: str = Field(..., description="The company the person works for")
    location: str = Field(..., description="Where the person is based")

@tool
def extract_personal_info(ctx: ToolRunContext, text: str) -> PersonalInfo:
    """Extract personal information from a text."""
    model = ctx.config.get_default_model()

    messages = [
        Message(role="user", content=f"Extract the personal info: {text}"),
    ]

    return model.get_structured_response(messages, PersonalInfo)
```

## Registering tools

Once the functions are defined, they can be instantiated into `Tool` classes and added to a `ToolRegistry` object:

```python title="registry" id="registry" depends_on=query_cv,extract_personal_info
from portia import ToolRegistry

tool_registry = ToolRegistry([
    query_cv(),
    extract_personal_info(),
])
```

## Putting it together

```python id="main" depends_on=registry
from dotenv import load_dotenv
from portia import Config, LogLevel, Portia

load_dotenv()

portia = Portia(
    Config.from_default(default_log_level=LogLevel.DEBUG),
    tools=tool_registry,
)

portia.run("How far does Jen Barber live from David Brent?")
```

## Conclusion

The `@tool` decorator allows you to create new tools quickly for simple use cases. For more complex scenarios requiring advanced customisation, consider using the [class-based approach](/add-custom-tools) instead.
