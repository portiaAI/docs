---
sidebar_label: pdf_reader_tool
title: portia.open_source_tools.pdf_reader_tool
---

Tool for reading PDF files and extracting text content using Mistral OCR.

## PDFReaderToolSchema Objects

```python
class PDFReaderToolSchema(BaseModel)
```

Input for PDFReaderTool.

## PDFReaderTool Objects

```python
class PDFReaderTool(Tool)
```

Read a PDF file and extract its text content using Mistral OCR.

#### run

```python
def run(_: ToolRunContext, file_path: str) -> str
```

Run the PDFReaderTool.

