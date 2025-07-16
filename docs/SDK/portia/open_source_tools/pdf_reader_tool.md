---
Sidebar_Label: pdf_reader_tool
Title: portia.open_source_tools.pdf_reader_tool
---

Tool for reading PDF files and extracting text content using Mistral OCR.

## PDFReaderToolSchema Objects

```python
class PDFReaderToolSchema(BaseModel)
```

Input for PDFReaderTool.

## PDFReaderTool Objects

```python
class PDFReaderTool(Tool[str])
```

Read a PDF file and extract its text content using Mistral OCR.

#### Run

```python
def run(_: ToolRunContext, file_path: str) -> str
```

Run the PDFReaderTool.

