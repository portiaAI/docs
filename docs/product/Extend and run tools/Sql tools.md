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

```python skip=true skip_reason=for example purpose only(actual users table does not exist)
from portia import PlanBuilderV2, Input

def build_plan_with_config():
    return (
        PlanBuilderV2("Query database with custom config")
        .input(name="db_config", description="Database configuration as JSON string")
        .invoke_tool_step(
            step_name="Run query with config",
            tool="run_sql",
            args={
                "query": "SELECT COUNT(*) FROM users",
                "config_json": Input("db_config")
            },
        )
        .build()
    )

# Run the plan with configuration
import json
config = {"db_path": "/path/to/database.db"}
run = portia.run_plan(
    build_plan_with_config(), 
    plan_run_inputs={"db_config": json.dumps(config)}
)
```

## SQLAdapter Objects
You can override the default SQLite adapter with your own implementation:

```python skip=true skip_reason=for example purpose only
from portia.open_source_tools.sql_tool import SQLAdapter, RunSQLTool
from typing import Any, Dict, List

class CustomPostgreSQLAdapter(SQLAdapter):
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        # Initialize your database connection here
        
    def run_sql(self, query: str) -> List[Dict[str, Any]]:
        # Implement PostgreSQL query execution
        # This would use psycopg2 or similar library
        pass
    
    def list_tables(self) -> List[str]:
        # Implement table listing for PostgreSQL
        query = """
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        """
        # Execute and return results
        pass
    
    def get_table_schemas(self, tables: List[str]) -> Dict[str, List[Dict[str, Any]]]:
        # Implement schema retrieval for PostgreSQL
        pass
    
    def check_sql(self, query: str) -> Dict[str, Any]:
        # Implement query validation
        pass

# Use custom adapter with SQL tools
custom_adapter = CustomPostgreSQLAdapter("postgresql://user:pass@localhost/db")
sql_tools = [
    RunSQLTool(adapter=custom_adapter),
    # ... other tools with custom adapter
]
```