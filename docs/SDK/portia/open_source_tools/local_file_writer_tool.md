---
sidebar_label: local_file_writer_tool
title: portia.open_source_tools.local_file_writer_tool
---

Local file writer tool.

## FileWriterToolSchema Objects

```python
class FileWriterToolSchema(BaseModel)
```

Schema defining the inputs for the FileWriterTool.

## FileWriterTool Objects

```python
class FileWriterTool(Tool[str])
```

Writes content to a file.

#### run

```python
def run(_: ExecutionContext, filename: str, content: str) -> str
```

Run the FileWriterTool.

