We use [docusaurus](https://docusaurus.io) to generate our docs. Docusaurus is a static website generator that runs under Node.js. We use a [Node.js](https://nodejs.org) project management tool called [yarn](https://yarnpkg.com) to install Docusaurus and to manage project dependencies. If you do not have Node.js and yarn installed on your system, install them first.

To render locally use 'npm run start'. You can specify a different port if you're running other sites on localhost by prefixing this command with PORT=3002 (or some other number)

## Code Examples
Code examples in the docs are tested automatically using [pytest-examples](https://github.com/pydantic/pytest-examples).

To run the tests, use `poetry run pytest`. For this to work, you'll need to ensure you create a .env file in the root of the project with the
variables listed in .env.example.

We ensure that all snippets of code in the repo are testing. In order to do this, we have a few tricks:
* If you start your code block with ```python depends_on=example1```, then we will look for a code snippet in the repo that has ```python id=example1` and load that code in first, allowing you to depend on that code.
* You can also use this behaviour to put in invisible setup code - simple put a code block inside HTML comment tags ([example](https://github.com/portiaAI/docs/pull/131/files#diff-4417e9ac8a583e918ba4d264eed6a2bf9850a0cb2b501919534f901d5622bfb3R225)) and then depend on that code block
* You can bring up supported test containers needed for running the test putting ```python  test_containers=redis...```
* We mock out some a few things that aren't available at test running time - e.g. imports that aren't available publicly or input() calls. See `tests/test_code_examples.py` for details.
* If you absolutely must skip a test (e.g. it's a code snippet that we're not expecting people to run), you can start your code block with ```python skip=true skip_reason=...```
