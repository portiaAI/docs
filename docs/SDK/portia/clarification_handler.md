---
Sidebar_Label: clarification_handler
Title: portia.clarification_handler
---

Clarification Handler.

This module defines the base ClarificationHandler interface that determines how to handle
clarifications that arise during the run of a plan.

## ClarificationHandler Objects

```python
class ClarificationHandler(ABC)
```

Handles clarifications that arise during the execution of a plan run.

#### Handle

```python
def handle(clarification: Clarification,
           on_resolution: Callable[[Clarification, object], None],
           on_error: Callable[[Clarification, object], None]) -> None
```

Handle a clarification by routing it to the appropriate handler.

**Arguments**:

- `clarification` - The clarification object to handle
- `on_resolution` - Callback function that should be invoked once the clarification has been
  handled, prompting the plan run to resume. This can either be called synchronously
  in this function or called async after returning from this function. The callback
  takes two arguments: the clarification object and the response to the clarification.
- `on_error` - Callback function that should be invoked if the clarification handling has
  failed. This can either be called synchronously in this function or called async
  after returning from this function. The callback takes two arguments: the
  clarification object and the error.

#### handle\_action\_clarification

```python
def handle_action_clarification(
        clarification: ActionClarification,
        on_resolution: Callable[[Clarification, object], None],
        on_error: Callable[[Clarification, object], None]) -> None
```

Handle an action clarification.

#### handle\_input\_clarification

```python
def handle_input_clarification(
        clarification: InputClarification,
        on_resolution: Callable[[Clarification, object], None],
        on_error: Callable[[Clarification, object], None]) -> None
```

Handle a user input clarification.

#### handle\_multiple\_choice\_clarification

```python
def handle_multiple_choice_clarification(
        clarification: MultipleChoiceClarification,
        on_resolution: Callable[[Clarification, object], None],
        on_error: Callable[[Clarification, object], None]) -> None
```

Handle a multi-choice clarification.

#### handle\_value\_confirmation\_clarification

```python
def handle_value_confirmation_clarification(
        clarification: ValueConfirmationClarification,
        on_resolution: Callable[[Clarification, object], None],
        on_error: Callable[[Clarification, object], None]) -> None
```

Handle a value confirmation clarification.

#### handle\_user\_verification\_clarification

```python
def handle_user_verification_clarification(
        clarification: UserVerificationClarification,
        on_resolution: Callable[[Clarification, object], None],
        on_error: Callable[[Clarification, object], None]) -> None
```

Handle a user verification clarification.

#### handle\_custom\_clarification

```python
def handle_custom_clarification(
        clarification: CustomClarification,
        on_resolution: Callable[[Clarification, object], None],
        on_error: Callable[[Clarification, object], None]) -> None
```

Handle a custom clarification.

