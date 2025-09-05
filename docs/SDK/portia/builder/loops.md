---
sidebar_label: loops
title: portia.builder.loops
---

Types to support Loops.

## LoopBlock Objects

```python
class LoopBlock(BaseModel)
```

A loop block in the plan.

This object is used to track the position of steps
in the loop tree, if one is present.

**Arguments**:

- `start_step_index` - The index of the first step in the loop.
- `end_step_index` - The index of the last step in the loop.

## LoopStepType Objects

```python
class LoopStepType(StrEnum)
```

The type of loop block.

## LoopType Objects

```python
class LoopType(StrEnum)
```

The type of loop.

## LoopStepResult Objects

```python
class LoopStepResult(BaseModel)
```

Output of a loop step.

**Arguments**:

- `type` - The type of loop block that was executed.
- `loop_result` - The result of the loop predicate evaluation.
- `start_loop_block_step_index` - The step index of the start loop block (loop).
- `end_loop_block_step_index` - The step index of the end loop block (endloop).

