import pytest
from pytest_examples import find_examples, CodeExample, EvalExample


@pytest.mark.parametrize('example', find_examples('docs/product/'), ids=str)
def test_docstrings(example: CodeExample, eval_example: EvalExample):
    if "skip=true" in example.prefix_tags():
        return
    eval_example.run(example)
