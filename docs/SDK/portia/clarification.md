---
sidebar_label: clarification
title: portia.clarification
---

Clarification Primitives.

This module defines base classes and utilities for handling clarifications in the Portia system.
Clarifications represent questions or actions requiring user input to resolve, with different types
of clarifications for various use cases such as arguments, actions, inputs, multiple choices,
and value confirmations.

## ClarificationCategory Objects

```python
class ClarificationCategory(PortiaEnum)
```

The category of a clarification.

This enum defines the different categories of clarifications that can exist, such as arguments,
actions, inputs, and more. It helps to categorize clarifications for easier
handling and processing.

## Clarification Objects

```python
class Clarification(BaseModel, ABC)
```

Base Model for Clarifications.

A Clarification represents a question or action that requires user input to resolve. For example
it could indicate the need for OAuth authentication, missing arguments for a tool
or a user choice from a list.

**Attributes**:

- `id` _ClarificationUUID_ - A unique identifier for this clarification.
- `category` _ClarificationCategory_ - The category of this clarification, indicating its type.
- `response` _SERIALIZABLE_TYPE_VAR | None_ - The user&#x27;s response to this clarification, if any.
- `step` _int | None_ - The step this clarification is associated with, if applicable.
- `user_guidance` _str_ - Guidance provided to the user to assist with the clarification.
- `resolved` _bool_ - Whether the clarification has been resolved by the user.

## ActionClarification Objects

```python
class ActionClarification(Clarification)
```

Action-based clarification.

Represents a clarification that involves an action, such as clicking a link. The response is set
to `True` once the user has completed the action associated with the link.

**Attributes**:

- `category` _ClarificationCategory_ - The category for this clarification, &#x27;Action&#x27;.
- `action_url` _HttpUrl_ - The URL for the action that the user needs to complete.
- `require_confirmation` _bool_ - Whether the user needs to confirm once the action has been
  completed.

#### serialize\_action\_url

```python
@field_serializer("action_url")
def serialize_action_url(action_url: HttpUrl) -> str
```

Serialize the action URL to a string.

**Arguments**:

- `action_url` _HttpUrl_ - The URL to be serialized.
  

**Returns**:

- `str` - The serialized string representation of the URL.

## InputClarification Objects

```python
class InputClarification(Clarification)
```

Input-based clarification.

Represents a clarification where the user needs to provide a value for a specific argument.
This type of clarification is used when the user is prompted to enter a value.

**Attributes**:

- `category` _ClarificationCategory_ - The category for this clarification, &#x27;Input&#x27;.

## MultipleChoiceClarification Objects

```python
class MultipleChoiceClarification(Clarification)
```

Multiple choice-based clarification.

Represents a clarification where the user needs to select an option for a specific argument.
The available options are provided, and the user must select one.

**Attributes**:

- `category` _ClarificationCategory_ - The category for this clarification &#x27;Multiple Choice&#x27;.
- `options` _list[Serializable]_ - The available options for the user to choose from.
  

**Methods**:

- `validate_response` - Ensures that the user&#x27;s response is one of the available options.

#### validate\_response

```python
@model_validator(mode="after")
def validate_response() -> Self
```

Ensure the provided response is an option.

This method checks that the response provided by the user is one of the options. If not,
it raises an error.

**Returns**:

- `Self` - The validated instance.
  

**Raises**:

- `ValueError` - If the response is not one of the available options.

## ValueConfirmationClarification Objects

```python
class ValueConfirmationClarification(Clarification)
```

Value confirmation clarification.

Represents a clarification where the user is presented with a value and must confirm or deny it.
The clarification should be created with the response field already set, and the user indicates
acceptance by setting the resolved flag to `True`.

**Attributes**:

- `category` _ClarificationCategory_ - The category for this clarification, &#x27;Value Confirmation&#x27;.

## CustomClarification Objects

```python
class CustomClarification(Clarification)
```

Custom clarifications.

Allows the user to extend clarifications with arbitrary data.
The user is responsible for handling this clarification type.

**Attributes**:

- `category` _ClarificationCategory_ - The category for this clarification, &#x27;Custom&#x27;.

#### ClarificationType

A list of clarifications of any type.

