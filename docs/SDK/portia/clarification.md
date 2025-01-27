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
class Clarification(BaseModel, Generic[SERIALIZABLE_TYPE_VAR])
```

Base Model for Clarifications.

A Clarification represents a question or action that requires user input to resolve. For example
it could indicate the need for OAuth authentication, missing arguments for a tool
or a user choice from a list.

Attributes:
    id (UUID): A unique identifier for this clarification.
    category (ClarificationCategory): The category of this clarification, indicating its type.
    response (SERIALIZABLE_TYPE_VAR | None): The user&#x27;s response to this clarification, if any.
    step (int | None): The step this clarification is associated with, if applicable.
    user_guidance (str): Guidance provided to the user to assist with the clarification.
    resolved (bool): Whether the clarification has been resolved by the user.

## ArgumentClarification Objects

```python
class ArgumentClarification(Clarification[SERIALIZABLE_TYPE_VAR])
```

Clarification about a specific argument for a tool.

This clarification is used when a tool&#x27;s argument is missing or requires further clarification.
The name of the argument is provided within the clarification.

Attributes:
    argument_name (str): The name of the argument that is being clarified.
    category (ClarificationCategory): The category for this clarification, &#x27;Argument&#x27;.

## ActionClarification Objects

```python
class ActionClarification(Clarification[SERIALIZABLE_TYPE_VAR])
```

Action-based clarification.

Represents a clarification that involves an action, such as clicking a link. The response is set
to `True` once the user has completed the action associated with the link.

Attributes:
    category (ClarificationCategory): The category for this clarification, &#x27;Action&#x27;.
    action_url (HttpUrl): The URL for the action that the user needs to complete.

#### serialize\_action\_url

```python
@field_serializer("action_url")
def serialize_action_url(action_url: HttpUrl) -> str
```

Serialize the action URL to a string.

Args:
    action_url (HttpUrl): The URL to be serialized.

Returns:
    str: The serialized string representation of the URL.

## InputClarification Objects

```python
class InputClarification(ArgumentClarification[SERIALIZABLE_TYPE_VAR])
```

Input-based clarification.

Represents a clarification where the user needs to provide a value for a specific argument.
This type of clarification is used when the user is prompted to enter a value.

Attributes:
    category (ClarificationCategory): The category for this clarification, &#x27;Input&#x27;.

## MultipleChoiceClarification Objects

```python
class MultipleChoiceClarification(ArgumentClarification[SERIALIZABLE_TYPE_VAR]
                                  )
```

Multiple choice-based clarification.

Represents a clarification where the user needs to select an option for a specific argument.
The available options are provided, and the user must select one.

Attributes:
    category (ClarificationCategory): The category for this clarification &#x27;Multiple Choice&#x27;.
    options (list[SERIALIZABLE_TYPE_VAR]): The available options for the user to choose from.

Methods:
    validate_response: Ensures that the user&#x27;s response is one of the available options.

#### validate\_response

```python
@model_validator(mode="after")
def validate_response() -> Self
```

Ensure the provided response is an option.

This method checks that the response provided by the user is one of the options. If not,
it raises an error.

Returns:
    Self: The validated instance.

Raises:
    ValueError: If the response is not one of the available options.

## ValueConfirmationClarification Objects

```python
class ValueConfirmationClarification(
        ArgumentClarification[SERIALIZABLE_TYPE_VAR])
```

Value confirmation clarification.

Represents a clarification where the user is presented with a value and must confirm or deny it.
The clarification should be created with the response field already set, and the user indicates
acceptance by setting the resolved flag to `True`.

Attributes:
    category (ClarificationCategory): The category for this clarification, &#x27;Value Confirmation&#x27;.

#### ClarificationType

A list of clarifications of any type.

