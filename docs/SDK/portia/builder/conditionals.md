---
sidebar_label: conditionals
title: portia.builder.conditionals
---

Types to support Conditionals.

## ConditionalBlock Objects

```python
class ConditionalBlock(BaseModel)
```

A conditional block in the plan.

This object is used to track the position of steps
in the conditional tree, if one is present.

**Arguments**:

- `clause_step_indexes` - The indexes of the conditional steps
  (i.e. the if_, else_if_, else_, endif steps).
- `parent_conditional_block` - The parent branch of this branch. If None,
  this is a root branch.

## ConditionalBlockClauseType Objects

```python
class ConditionalBlockClauseType(StrEnum)
```

The type of conditional block clause.

## ConditionalStepResult Objects

```python
class ConditionalStepResult(BaseModel)
```

Output of a conditional step.

**Arguments**:

- `type` - The type of conditional block clause that was executed.
- `conditional_result` - The result of the conditional predicate evaluation.
- `next_clause_step_index` - The step index of the next clause conditional to
  jump to if the conditional result is false.
- `end_condition_block_step_index` - The step index of the end condition block (endif).

