---
sidebar_label: user_verify
title: portia.builder.user_verify
---

Implementation of the various step types used in :class:`PlanV2`.

## UserVerifyStep Objects

```python
class UserVerifyStep(StepV2)
```

A step that requests user confirmation before proceeding with plan execution.

This step pauses execution to ask the user to verify or approve a message.
If the user rejects the verification, the plan execution will stop with an error.

This pauses plan execution and asks the user to confirm or reject the provided
message. The plan will only continue if the user confirms. If the user rejects,
the plan execution will stop with an error. This is useful for getting user approval before
taking important actions like sending emails, making purchases, or modifying data.

A UserVerificationClarification is used to get the verification from the user, so ensure you
have set up handling for this type of clarification in order to use this step. For more
details, see https://docs.portialabs.ai/understand-clarifications.

This step outputs True if the user confirms.

#### \_\_str\_\_

```python
def __str__() -> str
```

Return a description of this step for logging purposes.

#### run

```python
@override
@traceable(name="User Verify Step - Run")
async def run(run_data: RunContext) -> bool | UserVerificationClarification
```

Prompt the user for confirmation.

Returns a UserVerificationClarification to get input from the user (if not already
provided).

If the user has already confirmed, returns True. Otherwise, if the user has rejected the
verification, raises a PlanRunExitError.

#### to\_legacy\_step

```python
@override
def to_legacy_step(plan: PlanV2) -> Step
```

Convert this UserVerifyStep to a legacy Step.

