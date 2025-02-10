---
sidebar_label: cli
title: portia.cli
---

CLI Implementation.

Usage:

portia-cli run &quot;add 4 + 8&quot; - run a query
portia-cli plan &quot;add 4 + 8&quot; - plan a query
portia-cli list-tools

## EnvLocation Objects

```python
class EnvLocation(Enum)
```

The location of the environment variables.

## CLIConfig Objects

```python
class CLIConfig(BaseModel)
```

Config for the CLI.

#### generate\_cli\_option\_from\_pydantic\_field

```python
def generate_cli_option_from_pydantic_field(
        f: Callable[...,
                    Any], field: str, info: FieldInfo) -> Callable[..., Any]
```

Generate a click option from a pydantic field.

#### common\_options

```python
def common_options(f: Callable[..., Any]) -> Callable[..., Any]
```

Define common options for CLI commands.

#### cli

```python
@click.group(context_settings={"max_content_width": 240})
def cli() -> None
```

Portia CLI.

#### version

```python
@click.command()
def version() -> None
```

Print the CLI tool version.

#### run

```python
@click.command()
@common_options
@click.argument("query")
def run(query: str, **kwargs) -> None
```

Run a query.

#### plan

```python
@click.command()
@common_options
@click.argument("query")
def plan(query: str, **kwargs) -> None
```

Plan a query.

#### list\_tools

```python
@click.command()
@common_options
def list_tools(**kwargs) -> None
```

List tools.

#### config\_write

```python
@click.command()
@common_options
def config_write(**kwargs) -> None
```

Write config file to disk.

