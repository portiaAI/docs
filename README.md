To render locally use 'npm run start'. You can specify a different port if you're running other sites on localhost by prefixing this command with PORT=3002 (or some other number)

# Code Examples

Code examples in the docs are tested automatically using [pytest-examples](https://github.com/pydantic/pytest-examples).

To run the tests, use `env $(cat .env | xargs) pytest -s test_code_examples.py` (the first part loads environment variables from the '.env' file)

If you have a test that can't be tested automatically (e.g. it requires user input or is not complete), you can add the `skip=true` tag to the example.
