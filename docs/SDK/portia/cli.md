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

## CLIOptions Objects

```python
class CLIOptions(Enum)
```

The options for the CLI.

#### common\_options

```python
def common_options(f: Callable[..., Any]) -> Callable[..., Any]
```

Define common options for CLI commands.

#### cli

```python
@click.group()
def cli() -> None
```

Portia CLI.

#### run

```python
@click.command()
@common_options
@click.argument("query")
@click.option("--confirm/--no-confirm", default=True)
def run(query: str, log_level: str, env_location: str, confirm: bool,
        llm_provider: str | None, llm_model: str | None,
        end_user_id: str | None) -> None
```

Run a query.

#### plan

```python
@click.command()
@common_options
@click.argument("query")
def plan(query: str, log_level: str, llm_provider: str | None,
         llm_model: str | None, end_user_id: str | None,
         env_location: str) -> None
```

Plan a query.

#### list\_tools

```python
@click.command()
@common_options
def list_tools(log_level: str, llm_provider: str | None, llm_model: str | None,
               end_user_id: str | None, env_location: str) -> None
```

Plan a query.

