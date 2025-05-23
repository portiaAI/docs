To render locally use 'npm run start'. You can specify a different port if you're running other sites on localhost by prefixing this command with PORT=3002 (or some other number)

# Code Examples

Code examples in the docs are tested automatically using [pytest-examples](https://github.com/pydantic/pytest-examples).

To run the tests, use `poetry run pytest`. For this to work, you'll need to ensure you create a .env file in the root of the project with the
variables listed in .env.example.

# Tools docs generation

To generate the Tools documentation, run (this script)[https://github.com/portiaAI/platform/blob/main/backend/project/tools/management/commands/generate_tool_docs.py#L585] in the Platform repo.
