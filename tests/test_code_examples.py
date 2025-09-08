from contextlib import ExitStack
from typing import Any, Callable
from unittest.mock import MagicMock, patch

import pytest
from dotenv import load_dotenv
from portia import Config, FileReaderTool, FileWriterTool, InMemoryToolRegistry
from pytest_examples import CodeExample, EvalExample, find_examples

load_dotenv(override=True)

# Create a mock module with custom_tool_registry defined
mock_registry_module = MagicMock()
mock_registry_module.custom_tool_registry = InMemoryToolRegistry.from_local_tools(
    [FileReaderTool(), FileWriterTool()]
)

IMPORTS_TO_MOCK = {
    "my_custom_tools.file_writer_tool": MagicMock(),
    "my_custom_tools.file_reader_tool": MagicMock(),
    "my_custom_tools.registry": mock_registry_module,
}


def get_optional_patch(patch_name: str):
    """Create fresh patch objects for each test to avoid parallel execution issues."""
    # Create fresh patches for each invocation to avoid parallel test conflicts

    get_plan_mock = MagicMock()
    get_plan_mock.pretty_print.return_value = ""
    get_plan_run_mock = MagicMock()
    get_plan_run_mock.pretty_print.return_value = ""
    patch_map = {
        "st_process_stream": lambda: patch(
            "steelthread.steelthread.SteelThread.process_stream"
        ),
        "st_run_evals": lambda: patch("steelthread.steelthread.SteelThread.run_evals"),
        "mcp_registry_load_tools": lambda: patch("portia.McpToolRegistry._load_tools"),
        "portia_run_plan": lambda: patch(
            "portia.Portia.run_plan", return_value=get_plan_mock
        ),
        "portia_get_plan_run": lambda: patch(
            "portia.storage.PortiaCloudStorage.get_plan_run",
            return_value=get_plan_run_mock,
        ),
        "portia_get_plan_runs": lambda: patch(
            "portia.storage.PortiaCloudStorage.get_plan_runs", return_value=[]
        ),
        "portia_config": lambda: patch(
            "portia.Config.from_default", return_value=Config.from_default()
        ),
    }

    if patch_name in patch_map:
        return patch_map[patch_name]()
    else:
        raise ValueError(f"Unknown patch name: {patch_name}")


@pytest.mark.parametrize("example", find_examples("docs/product/"), ids=str)
def test_docstrings(example: CodeExample, eval_example: EvalExample):
    # If the example has depends_on=example1, then we'll look for an example with id=example1
    # and load that code in before the current example.
    dependent_examples = _get_all_dependencies(example)
    example.source = "\n".join(
        [dependent_example.source for dependent_example in dependent_examples]
        + [example.source]
    )

    # Skip any tests that have skip=true as a tag
    if "skip=true" in example.prefix_tags():
        assert any(tag.startswith("skip_reason=") for tag in example.prefix_tags()), (
            "skip=true must be accompanied by a skip_reason="
        )
        return

    # We mock out some imports that we use in docs that don't actually exist
    original_import = __import__

    # Create all the context managers we need
    contexts = [
        patch(
            "builtins.__import__",
            side_effect=lambda name, *args, **kwargs: mock_import(
                name, original_import, args, kwargs
            ),
        ),
        patch("builtins.input", side_effect=mock_input),
    ]
    # Apply any optional patches specified in test tags
    patch_tags = [
        tag.split("patch=")[1] for tag in example.prefix_tags() if "patch=" in tag
    ]
    for patch_name in patch_tags:
        contexts.append(get_optional_patch(patch_name))

    # Use ExitStack to handle all context managers
    with ExitStack() as stack:
        for context in contexts:
            stack.enter_context(context)
        eval_example.run(example)


def _get_all_dependencies(
    example: CodeExample, visited: set[str] = None
) -> list[CodeExample]:
    """Recursively get all dependencies for an example."""
    if visited is None:
        visited = set()

    # Get the example ID if it exists
    example_id = None
    for tag in example.prefix_tags():
        if tag.startswith("id="):
            example_id = tag.split("id=")[1]
            break

    # Prevent infinite loops
    if example_id and example_id in visited:
        return []

    if example_id:
        visited.add(example_id)

    # Find the depends_on tag
    depends_on_tag = None
    for tag in example.prefix_tags():
        if tag.startswith("depends_on="):
            depends_on_tag = tag
            break

    if not depends_on_tag:
        return []

    # Extract dependency IDs (comma-separated)
    dependency_ids = depends_on_tag.split("depends_on=")[1].split(",")
    dependency_ids = [dep_id.strip() for dep_id in dependency_ids]  # Remove whitespace

    # Recursively retrieve dependencies
    all_dependencies = []
    for dep_id in dependency_ids:
        try:
            dep_example = _get_example_by_id(dep_id)
            nested_dependencies = _get_all_dependencies(dep_example, visited.copy())
            all_dependencies.extend(nested_dependencies)
            if dep_example not in all_dependencies:
                all_dependencies.append(dep_example)
        except ValueError:
            # Skip if dependency not found
            continue

    return all_dependencies


def _get_example_by_id(id: str) -> CodeExample:
    for example in find_examples("docs/product/"):
        if f"id={id}" in example.prefix_tags():
            return example
    raise ValueError(f"Example with id {id} not found")


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
