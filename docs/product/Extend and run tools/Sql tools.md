---
sidebar_position: 8
slug: /sql-tools
---

SQL Tools with pluggable adapter and a default SQLite implementation.

This module provides separate tools for different SQL operations against a database
via a pluggable adapter. By default, it ships with a SQLite adapter that can be
configured via environment variables or pure JSON config passed at call time.

Available tools:
- RunSQLTool: Execute read-only SQL SELECT queries
- ListTablesTool: List all available tables in the database
- GetTableSchemasTool: Get detailed schema information for specified tables
- CheckSQLTool: Validate SQL queries without executing them

Security note: Only read-only operations are allowed. SQLite authorizer is used to enforce
read-only access by denying all write operations (INSERT, UPDATE, DELETE, CREATE, etc.).

## Quick Start Example

```python
from __future__ import annotations
import os
import sqlite3
import tempfile
from pathlib import Path

from pydantic import BaseModel
from portia import PlanBuilderV2, Input, StepOutput
from portia.portia import Portia
from portia.tool_registry import ToolRegistry
from portia.open_source_tools.sql_tool import ListTablesTool, RunSQLTool, GetTableSchemasTool
from portia.config import Config
from portia import LLMProvider

# -------------------------------------------------------------------
# 1. Create a  SQLite database with one table
# -------------------------------------------------------------------
def create_order_items_db(db_path: str) -> None:
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE order_items (
            item_id INTEGER PRIMARY KEY,
            product_name TEXT,
            quantity INTEGER,
            unit_price DECIMAL(10,2)
        )
    """)
    cur.executemany("""
        INSERT INTO order_items (item_id, product_name, quantity, unit_price)
        VALUES (?, ?, ?, ?)
    """, [
        (1, "Laptop", 1, 999.99),
        (2, "Headphones", 2, 199.99),
        (3, "Water Bottle", 5, 19.99),
    ])
    conn.commit()
    conn.close()

# -------------------------------------------------------------------
# 2. Define structured outputs
# -------------------------------------------------------------------
class QueryResult(BaseModel):
    rows: list[tuple]

class FinalOutput(BaseModel):
    summary: str

# -------------------------------------------------------------------
# 3. Build the plan using PlanBuilderV2
# -------------------------------------------------------------------
def build_plan():
    return (
        PlanBuilderV2("Inspect schema and run a SQL query")
        # Step 1: list tables
        .invoke_tool_step(
            step_name="List tables",
            tool="list_tables",
            args={},
        )
        # Step 2: get schema for order_items
        .invoke_tool_step(
            step_name="Get schema",
            tool="get_table_schemas",
            args={"tables": ["order_items"]},
        )
        # Step 3: run query
        .invoke_tool_step(
            step_name="Run query",
            tool="run_sql",
            args={"query": "SELECT product_name, quantity, unit_price FROM order_items"},
            output_schema=QueryResult,
        )
        # Step 4: summarize with LLM
        .llm_step(
            task="Summarize the sales from the order_items table",
            inputs=[StepOutput("Run query")],
            output_schema=FinalOutput,
            step_name="Summarize query"
        )
        .final_output(FinalOutput)
        .build()
    )

def main():
    tmp_dir = tempfile.mkdtemp()
    db_path = Path(tmp_dir) / "orders.db"
    create_order_items_db(str(db_path))
    os.environ["SQLITE_DB_PATH"] = str(db_path)

    sql_tools = [ListTablesTool(), RunSQLTool(), GetTableSchemasTool()]
    tool_registry = ToolRegistry(sql_tools)

    config = Config.from_default(
        llm_provider=LLMProvider.GOOGLE,
        default_model="google/gemini-2.0-flash"
    )

    portia = Portia(config=config, tools=tool_registry)

    plan = build_plan()
    run = portia.run_plan(plan)

    print("Plan state:", run.state)
    if run.outputs.final_output is not None:
        print("Summary:", run.outputs.final_output.summary)
    else:
        print("Summary: No summary available (final output is None)")

if __name__ == "__main__":
    main()
```

## Configuration Options

### Environment Variables
- `SQLITE_DB_PATH`: Path to the SQLite database file (defaults to ":memory:" if not set)

### JSON Configuration
Alternatively, pass configuration as a JSON string:

```python
import json
config = {"db_path": "/path/to/database.db"}

result = tool.run(
    context,
    query="SELECT COUNT(*) FROM users",
    config_json=json.dumps(config)
)
```

## SQLAdapter Objects

```python
class SQLAdapter()
```

Abstract adapter interface for SQL databases (read-only).

#### run\_sql

```python
def run_sql(query: str) -> list[dict[str, Any]]
```

Execute a read-only query and return rows as list of dicts.

#### list\_tables

```python
def list_tables() -> list[str]
```

List available table names.

#### get\_table\_schemas

```python
def get_table_schemas(tables: list[str]) -> dict[str, list[dict[str, Any]]]
```

Return column schemas for the given tables.

#### check\_sql

```python
def check_sql(query: str) -> dict[str, Any]
```

Check if a query would run successfully (read-only).

## SQLiteConfig Objects

```python
@dataclass
class SQLiteConfig()
```

Configuration for SQLite connections.

**Attributes**:

- `db_path` - Path to the SQLite database file, or &quot;:memory:&quot; for in-memory.

## SQLiteAdapter Objects

```python
class SQLiteAdapter(SQLAdapter)
```

SQLite adapter using read-only URI mode where possible.

#### \_\_init\_\_

```python
def __init__(config: SQLiteConfig) -> None
```

Initialize the adapter with the given configuration.

#### run\_sql

```python
def run_sql(query: str) -> list[dict[str, Any]]
```

Execute the read-only SQL query and return rows as dicts.

#### list\_tables

```python
def list_tables() -> list[str]
```

Return a list of user tables in the database.

#### get\_table\_schemas

```python
def get_table_schemas(tables: list[str]) -> dict[str, list[dict[str, Any]]]
```

Return PRAGMA table_info for each table in `tables`.

#### check\_sql

```python
def check_sql(query: str) -> dict[str, Any]
```

Check the query by executing an EXPLAIN; return ok True/False with error.

## BaseSQLToolArgs Objects

```python
class BaseSQLToolArgs(BaseModel)
```

Base arguments for SQL tools.

Either provide config via:
  - environment variables, or
  - the optional `config_json` string with adapter-specific config (pure JSON)

## BaseSQLTool Objects

```python
class BaseSQLTool(Tool[Any])
```

Base SQL tool with shared adapter functionality.

Use SQLiteAdapter by default. Configure via env or config_json:
  - SQLITE_DB_PATH: path to sqlite database (e.g., /tmp/db.sqlite).
    If not set, defaults to :memory:

#### \_\_init\_\_

```python
def __init__(adapter: SQLAdapter | None = None, **kwargs: Any) -> None
```

Initialize the tool with an optional adapter (defaults to SQLite).

## RunSQLArgs Objects

```python
class RunSQLArgs(BaseSQLToolArgs)
```

Arguments for running SQL queries.

## RunSQLTool Objects

```python
class RunSQLTool(BaseSQLTool)
```

Execute read-only SQL SELECT queries against a database.

#### run

```python
def run(_: ToolRunContext, **kwargs: Any) -> list[dict[str, Any]]
```

Execute the SQL query and return results.

## ListTablesArgs Objects

```python
class ListTablesArgs(BaseSQLToolArgs)
```

Arguments for listing database tables.

## ListTablesTool Objects

```python
class ListTablesTool(BaseSQLTool)
```

List all available tables in the database.

#### run

```python
def run(_: ToolRunContext, **kwargs: Any) -> list[str]
```

List all tables in the database.

## GetTableSchemasArgs Objects

```python
class GetTableSchemasArgs(BaseSQLToolArgs)
```

Arguments for getting table schemas.

## GetTableSchemasTool Objects

```python
class GetTableSchemasTool(BaseSQLTool)
```

Get detailed schema information for specified tables.

#### run

```python
def run(_: ToolRunContext, **kwargs: Any) -> dict[str, list[dict[str, Any]]]
```

Get schema information for the specified tables.

## CheckSQLArgs Objects

```python
class CheckSQLArgs(BaseSQLToolArgs)
```

Arguments for checking SQL query validity.

## CheckSQLTool Objects

```python
class CheckSQLTool(BaseSQLTool)
```

Check if a SQL query is valid without executing it.

#### run

```python
def run(_: ToolRunContext, **kwargs: Any) -> dict[str, Any]
```

Check the validity of the SQL query.

