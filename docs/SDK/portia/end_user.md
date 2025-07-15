---
Sidebar_Label: end_user
Title: portia.end_user
---

Models for end user management.

## EndUser Objects

```python
class EndUser(BaseModel)
```

Represents an actual user of the system.

#### set\_additional\_data

```python
def set_additional_data(key_name: str, key_value: str) -> None
```

Set a field in the additional data blob.

#### remove\_additional\_data

```python
def remove_additional_data(key_name: str) -> None
```

Set a field in the additional data blob.

#### get\_additional\_data

```python
def get_additional_data(key_name: str) -> str | None
```

Get a field from the additional data blob.

