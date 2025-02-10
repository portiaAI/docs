---
sidebar_label: prefixed_uuid
title: portia.prefixed_uuid
---

Prefixed UUIDs.

Support for various prefixed UUIDs that append the type of UUID to the ID.

## PrefixedUUID Objects

```python
class PrefixedUUID(BaseModel)
```

A UUID with an optional prefix.

Attributes:
    prefix (str): A string prefix to prepend to the UUID. Empty by default.
    uuid (UUID): The UUID value.
    id (str): Computed property that combines the prefix and UUID.

#### serialize\_model

```python
@model_serializer
def serialize_model() -> str
```

Serialize the PrefixedUUID to a string using the id property.

Returns:
    str: The prefixed UUID string.

#### from\_string

```python
@classmethod
def from_string(cls, prefixed_uuid: str) -> Self
```

Create a PrefixedUUID from a string in the format &#x27;prefix-uuid&#x27;.

Args:
    prefixed_uuid (str): A string in the format &#x27;prefix-uuid&#x27;.

Returns:
    Self: A new instance of PrefixedUUID.

Raises:
    ValueError: If the string format is invalid or the prefix doesn&#x27;t match.

#### validate\_model

```python
@model_validator(mode="before")
@classmethod
def validate_model(cls, v: str | dict) -> dict
```

Validate the ID field.

## PlanUUID Objects

```python
class PlanUUID(PrefixedUUID)
```

A UUID for a plan.

## WorkflowUUID Objects

```python
class WorkflowUUID(PrefixedUUID)
```

A UUID for a workflow.

## ClarificationUUID Objects

```python
class ClarificationUUID(PrefixedUUID)
```

A UUID for a clarification.

