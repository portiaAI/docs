---
sidebar_label: calculator_tool
title: portia.open_source_tools.calculator_tool
---

Simple Calculator Implementation.

## CalculatorToolSchema Objects

```python
class CalculatorToolSchema(BaseModel)
```

Input for the CalculatorTool.

## CalculatorTool Objects

```python
class CalculatorTool(Tool[float])
```

Takes a basic maths question in natural language and returns the result.

Works best for maths expressions containing only numbers and the operators +, -, *, x, /.

#### description

Works best for maths expressions containing only numbers and the operators +, -, *, x, /.

#### run

```python
def run(_: ToolRunContext, math_question: str) -> float
```

Run the CalculatorTool.

#### math\_expression

```python
def math_expression(prompt: str) -> str
```

Convert words and phrases to standard operators.

