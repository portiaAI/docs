---
Sidebar_Label: local_file_reader_tool
Title: portia.open_source_tools.local_file_reader_tool
---

Tool for reading files from disk.

## FileReaderToolSchema Objects

```python
class FileReaderToolSchema(BaseModel)
```

Schema defining the inputs for the FileReaderTool.

## FileReaderTool Objects

```python
class FileReaderTool(Tool[str])
```

Finds and reads content from a local file on Disk.

#### Run

```python
def run(ctx: ToolRunContext, filename: str) -> str | Clarification
```

Run the FileReaderTool.

#### find\_file

```python
def find_file(file_path: Path) -> list[str]
```

Return a full file path or None.

