from typing import Any, Callable
from unittest.mock import MagicMock, patch

import pytest
from dotenv import load_dotenv
from pytest_examples import CodeExample, EvalExample, find_examples

load_dotenv(override=True)

IMPORTS_TO_MOCK = {
    "my_custom_tools.file_writer_tool": MagicMock(),
    "my_custom_tools.file_reader_tool": MagicMock(),
    "my_custom_tools.registry": MagicMock(),
}


def mock_import(
    name: str, original_import: Callable[[str, Any, Any], Any], args: Any, kwargs: Any
) -> Any:
    if name in IMPORTS_TO_MOCK:
        return IMPORTS_TO_MOCK[name]
    return original_import(name, *args, **kwargs)


def mock_input(prompt: str) -> str:
    if prompt.startswith("Please enter a value:\n"):
        return prompt.split("\n")[1]
    return ""


@pytest.mark.parametrize("example", find_examples("docs/product/"), ids=str)
def test_docstrings(example: CodeExample, eval_example: EvalExample):
    # For example, if you have depends_on=example1, then we'll look for an example with
    # id=example1 and load that code in before the current example.
    dependent_examples = [
        _get_example_by_id(tag.split("depends_on=")[1])
        for tag in example.prefix_tags()
        if "depends_on=" in tag
    ]
    example.source = "\n".join(
        [dependent_example.source for dependent_example in dependent_examples]
        + [example.source]
    )

    # Remove any lines that are html comment lines
    # This allows us to put lines of code in the docs that are not rendered on the website
    example.source = "\n".join(
        line
        for line in example.source.split("\n")
        if not line.strip().startswith("<!--") and not line.strip().startswith("-->")
    )

    # Skip any tests that have skip=true as a tag
    if "skip=true" in example.prefix_tags():
        return

    # We mock out some imports that we use in docs that don't actually exist
    original_import = __import__
    with (
        patch(
            "builtins.__import__",
            side_effect=lambda name, *args, **kwargs: mock_import(
                name, original_import, args, kwargs
            ),
        ),
        patch("builtins.input", side_effect=mock_input),
    ):
        eval_example.run(example)


def _get_example_by_id(id: str) -> CodeExample:
    print("ID: " + str(id))
    for example in find_examples("docs/product/"):
        if f"id={id}" in example.prefix_tags():
            return example
    raise ValueError(f"Example with id {id} not found")
