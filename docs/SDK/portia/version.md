---
Sidebar_Label: version
Title: portia.version
---

Version utilities for Portia SDK.

#### get\_version

```python
def get_version() -> str
```

Get the current version of the Portia SDK.

This function works both when the package is installed as a dependency
and when run directly from source. When run from source, it attempts
to read the version from pyproject.toml.

**Returns**:

- `str` - The current version of the Portia SDK

