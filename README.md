We use [docusaurus](https://docusaurus.io) to generate our docs. Docusaurus is a static website generator that runs under Node.js. We use a [Node.js](https://nodejs.org) project management tool called [yarn](https://yarnpkg.com) to install Docusaurus and to manage project dependencies. If you do not have Node.js and yarn installed on your system, install them first.

To render locally use 'npm run start'. You can specify a different port if you're running other sites on localhost by prefixing this command with PORT=3002 (or some other number)

## Code Examples
Code examples in the docs are tested automatically using [pytest-examples](https://github.com/pydantic/pytest-examples).

To run the tests, use `poetry run pytest`. For this to work, you'll need to ensure you create a .env file in the root of the project with the
variables listed in .env.example.

If you have a test that can't be tested automatically (e.g. it requires user input or is not complete), you can add the `skip=true` tag to the example.
