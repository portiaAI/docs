from unittest.mock import patch
from typing import Iterator

import pytest


@pytest.fixture(scope="session", autouse=True)
def mock_get_mcp_session() -> Iterator[None]:
    """Fixture to mock the get_mcp_session function."""

    with patch(
        "portia.tool_registry.get_mcp_session",
    ):
        yield
