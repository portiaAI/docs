---
sidebar_label: clarification
title: portia.clarification
---

# Clarifications.

Clarifications are the general framework for agents to get input.


## Clarification Objects

```python
class Clarification(BaseModel, Generic[SERIALIZABLE_TYPE_VAR])
```

Base Model for Clarifications.

**Arguments**:

- `id` (`UUID`): A unique ID for this clarification.
- `type` (`str`): The type of clarification. Should be controlled by classes extending this class.
- `response` (`SERIALIZABLE_TYPE_VAR | None`): The response from the user to this clarification.
- `step` (`int | None`): The step this clarification is linked to.
- `user_guidance` (`str`): Guidance provided to the user to help with clarification.
- `UUID`0 (`UUID`1): Whether this clarification has been resolved. Defaults to False.

#### resolve

```python
def resolve(response: SERIALIZABLE_TYPE_VAR | None) -> None
```

Resolve the clarification with the given response.

**Arguments**:

- `response` (`SERIALIZABLE_TYPE_VAR | None`): The response to resolve the clarification.

## ArgumentClarification Objects

```python
class ArgumentClarification(Clarification[SERIALIZABLE_TYPE_VAR])
```

A general class for clarifications for a specific argument of a tool.

**Arguments**:

- `id` (`UUID`): A unique ID for this clarification.
- `type` (`str`): The type of clarification. Should be controlled by classes extending this class.
- `response` (`SERIALIZABLE_TYPE_VAR | None`): The response from the user to this clarification.
- `step` (`int | None`): The step this clarification is linked to.
- `user_guidance` (`str`): Guidance provided to the user to help with clarification.
- `UUID`0 (`UUID`1): Whether this clarification has been resolved. Defaults to False.
- `UUID`2 (`str`): The name of the argument that needs to be clarified.

## ActionClarification Objects

```python
class ActionClarification(Clarification[bool])
```

An action based clarification.

Represents a clarification where the user needs to click on a link. Set the response to true
once the user has clicked on the link and done the associated action.

**Arguments**:

- `id` (`UUID`): A unique ID for this clarification.
- `type` (`str`): The type of clarification. Should be controlled by classes extending this class.
- `response` (`SERIALIZABLE_TYPE_VAR | None`): The response from the user to this clarification.
- `step` (`int | None`): The step this clarification is linked to.
- `user_guidance` (`str`): Guidance provided to the user to help with clarification.
- `UUID`0 (`UUID`1): Whether this clarification has been resolved. Defaults to False.
- `UUID`2 (`UUID`3): The URL that the user should be directed to.

#### serialize\_action\_url

```python
@field_serializer("action_url")
def serialize_action_url(action_url: HttpUrl) -> str
```

Serialize the action URL to a string.


## InputClarification Objects

```python
class InputClarification(ArgumentClarification[str])
```

An input based clarification.

Represents a clarification where the user needs to provide a value for a specific argument.

**Arguments**:

- `id` (`UUID`): A unique ID for this clarification.
- `type` (`str`): The type of clarification. Should be controlled by classes extending this class.
- `response` (`SERIALIZABLE_TYPE_VAR | None`): The response from the user to this clarification.
- `step` (`int | None`): The step this clarification is linked to.
- `user_guidance` (`str`): Guidance provided to the user to help with clarification.
- `UUID`0 (`UUID`1): Whether this clarification has been resolved. Defaults to False.
- `UUID`2 (`str`): The name of the argument that needs to be clarified.

## MultiChoiceClarification Objects

```python
class MultiChoiceClarification(ArgumentClarification[str])
```

A multiple choice based clarification.

Represents a clarification where the user needs to select an option for a specific argument.

**Arguments**:

- `id` (`UUID`): A unique ID for this clarification.
- `type` (`str`): The type of clarification. Should be controlled by classes extending this class.
- `response` (`SERIALIZABLE_TYPE_VAR | None`): The response from the user to this clarification.
- `step` (`int | None`): The step this clarification is linked to.
- `user_guidance` (`str`): Guidance provided to the user to help with clarification.
- `UUID`0 (`UUID`1): Whether this clarification has been resolved. Defaults to False.
- `UUID`2 (`str`): The name of the argument that needs to be clarified.
- `UUID`4 (`UUID`5): A set of options from which the user must choose.

#### resolve

```python
def resolve(response: str | None) -> None
```

Resolve the clarification with the given response.

Responses are checked against the provided options.

**Arguments**:

- `response` (`SERIALIZABLE_TYPE_VAR | None`): The response to resolve the clarification.

**Raises**:

- `ValueError`: If the provided response is not one of the allowed options

