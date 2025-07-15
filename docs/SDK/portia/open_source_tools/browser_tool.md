---
Sidebar_Label: browser_tool
Title: portia.open_source_tools.browser_tool
---

Browser tools.

This module contains tools that can be used to navigate to a URL, authenticate the user,
and complete tasks.

The browser tool can run locally or using [Browserbase](https://browserbase.com/). If using
Browserbase, a Browserbase API key is required and project ID is required, and the tool can handle
separate end user authentication.

The browser tool can be used to navigate to a URL and complete tasks. If authentication is
required, the tool will return an ActionClarification with the user guidance and login URL.
If authentication is not required, the tool will return the task output. It uses
(BrowserUse)[https://browser-use.com/] for the task navigation.

#### convert\_model\_to\_browser\_use\_model

```python
def convert_model_to_browser_use_model(
        model: GenerativeModel) -> BaseChatModel
```

Convert a Portia model to a BrowserUse model.

## BrowserToolForUrlSchema Objects

```python
class BrowserToolForUrlSchema(BaseModel)
```

Input schema for the BrowserToolForUrl.

This schema defines the expected input parameters for the BrowserToolForUrl class.

**Attributes**:

- `task` _str_ - The task description that should be performed by the browser tool.
  This is a required field that specifies what actions should be taken
  on the predefined URL.
- `task_data` _list[Any] | str | None_ - Task data that should be used to complete the task.
  Can be a string, a list of strings, or a list of objects that will be converted to
  strings. Important: This should include all relevant data in their entirety,
  from the first to the last character (i.e. NOT a summary).

## BrowserToolSchema Objects

```python
class BrowserToolSchema(BaseModel)
```

Input schema for the BrowserTool.

This schema defines the expected input parameters for the BrowserTool class.

**Attributes**:

- `url` _str_ - The URL that the browser tool should navigate to.
  This is a required field specifying the target webpage.
- `task` _str_ - The task description that should be performed by the browser tool.
  This is a required field that specifies what actions should be taken
  on the provided URL.
- `task_data` _list[Any] | str | None_ - Task data that should be used to complete the task.
  Can be a string, a list of strings, or a list of objects that will be converted to
  strings. Important: This should include all relevant data in their entirety,
  from the first to the last character (i.e. NOT a summary).

## BrowserTaskOutput Objects

```python
class BrowserTaskOutput(BaseModel, Generic[T])
```

Output schema for browser task execution.

This class represents the response from executing a browser task,
including both the task result and any authentication requirements.

**Attributes**:

- `task_output` _T_ - The result or output from executing the requested task.
- `human_login_required` _bool_ - Indicates if manual user authentication is needed.
  Defaults to False.
- `login_url` _str, optional_ - The URL where the user needs to go to authenticate.
  Only provided when human_login_required is True.
- `user_login_guidance` _str, optional_ - Instructions for the user on how to complete
  the login process. Only provided when human_login_required is True.

## BrowserInfrastructureOption Objects

```python
class BrowserInfrastructureOption(Enum)
```

Enumeration of supported browser infrastructure providers.

This enum defines the available options for running browser automation tasks.

**Attributes**:

- `LOCAL` - Uses a local Chrome browser instance for automation.
  Suitable for development and testing.
- `BROWSERBASE` - Uses the Browserbase cloud service for automation.
  Provides better scalability and isolation between users.

## BrowserTool Objects

```python
class BrowserTool(Tool[str | BaseModel])
```

General purpose browser tool. Customizable to user requirements.

This tool is designed to be used for tasks that require a browser. If authentication is
required, the tool will return an ActionClarification with the user guidance and login URL.
If authentication is not required, the tool will return the task output. It uses
(BrowserUse)[https://browser-use.com/] for the task navigation.

When using the tool, you should ensure that once the user has authenticated, that they
indicate that authentication is completed and resume the plan run.

The tool supports both local and BrowserBase infrastructure providers for running the web
based tasks. If using local, a local Chrome instance will be used, and the tool will not
support end_user_id. If using BrowserBase, a BrowserBase API key is required and the tool
can handle separate end users. The infrastructure provider can be specified using the
`infrastructure_option` argument.

**Arguments**:

- `id` _str, optional_ - Custom identifier for the tool. Defaults to &quot;browser_tool&quot;.
- `name` _str, optional_ - Display name for the tool. Defaults to &quot;Browser Tool&quot;.
- `description` _str, optional_ - Custom description of the tool&#x27;s purpose. Defaults to a
  general description of the browser tool&#x27;s capabilities.
- `infrastructure_option` _BrowserInfrastructureOption, optional_ - The infrastructure
  provider to use. Can be either `BrowserInfrastructureOption.LOCAL` or
  `BrowserInfrastructureOption.REMOTE`. Defaults to
  `BrowserInfrastructureOption.REMOTE`.
- `custom_infrastructure_provider` _BrowserInfrastructureProvider, optional_ - A custom
  infrastructure provider to use. If not provided, the infrastructure provider will be
  resolved from the `infrastructure_option` argument.
- `id`0 _BaseModel, optional_ - A Pydantic model to use for structured
  output. If not provided, the tool will return a string.

#### infrastructure\_provider

```python
@cached_property
def infrastructure_provider() -> BrowserInfrastructureProvider
```

Get the infrastructure provider instance (cached).

#### process\_task\_data

```python
@staticmethod
def process_task_data(task_data: list[Any] | str | None) -> str
```

Process task_data into a string, handling different input types.

**Arguments**:

- `task_data` - Data that can be a None, a string or a list of objects.
  

**Returns**:

  A string representation of the data, with list items joined by newlines.

#### Run

```python
def run(
    ctx: ToolRunContext,
    url: str,
    task: str,
    task_data: list[Any] | str | None = None
) -> str | BaseModel | ActionClarification
```

Run the BrowserTool.

## BrowserToolForUrl Objects

```python
class BrowserToolForUrl(BrowserTool)
```

Browser tool for a specific URL.

This tool is designed to be used for browser-based tasks on the specified URL.
If authentication is required, the tool will return an ActionClarification with the user
guidance and login URL. If authentication is not required, the tool will return the task
output. It uses (BrowserUse)[https://browser-use.com/] for the task navigation.

When using the tool, the developer should ensure that once the user has completed
authentication, that they resume the plan run.

The tool supports both local and BrowserBase infrastructure providers for running the web
based tasks. If using local, a local Chrome instance will be used, and the tool will not
support end_user_id. If using BrowserBase, a BrowserBase API key is required and the tool
can handle separate end users. The infrastructure provider can be specified using the
`infrastructure_option` argument.

**Arguments**:

- `url` _str_ - The URL that this browser tool will navigate to for all tasks.
- `id` _str, optional_ - Custom identifier for the tool. If not provided, will be generated
  based on the URL&#x27;s domain.
- `name` _str, optional_ - Display name for the tool. If not provided, will be generated
  based on the URL&#x27;s domain.
- `description` _str, optional_ - Custom description of the tool&#x27;s purpose. If not provided,
  will be generated with the URL.
- `infrastructure_option` _BrowserInfrastructureOption, optional_ - The infrastructure
  provider to use. Can be either `BrowserInfrastructureOption.LOCAL` or
  `BrowserInfrastructureOption.REMOTE`. Defaults to
  `BrowserInfrastructureOption.REMOTE`.
- `custom_infrastructure_provider` _BrowserInfrastructureProvider, optional_ - A custom
  infrastructure provider to use. If not provided, the infrastructure provider will be
  resolved from the `infrastructure_option` argument.

#### \_\_init\_\_

```python
def __init__(
    url: str,
    id: str | None = None,
    name: str | None = None,
    description: str | None = None,
    model: GenerativeModel | None | str = NotSet,
    infrastructure_option: BrowserInfrastructureOption | None = NotSet
) -> None
```

Initialize the BrowserToolForUrl.

#### Run

```python
def run(
    ctx: ToolRunContext,
    task: str,
    task_data: list[Any] | str | None = None
) -> str | BaseModel | ActionClarification
```

Run the BrowserToolForUrl.

## BrowserInfrastructureProvider Objects

```python
class BrowserInfrastructureProvider(ABC)
```

Abstract base class for browser infrastructure providers.

#### setup\_browser

```python
@abstractmethod
def setup_browser(ctx: ToolRunContext) -> Browser
```

Get a Browser instance.

This is called at the start of every step using this tool.

#### construct\_auth\_clarification\_url

```python
@abstractmethod
def construct_auth_clarification_url(ctx: ToolRunContext,
                                     sign_in_url: str) -> HttpUrl
```

Construct the URL for the auth clarification.

#### step\_complete

```python
@abstractmethod
def step_complete(ctx: ToolRunContext) -> None
```

Call when the step is complete to e.g. release the session if needed.

## BrowserInfrastructureProviderLocal Objects

```python
class BrowserInfrastructureProviderLocal(BrowserInfrastructureProvider)
```

Browser infrastructure provider for local browser instances.

#### \_\_init\_\_

```python
def __init__(chrome_path: str | None = None,
             extra_chromium_args: list[str] | None = None) -> None
```

Initialize the BrowserInfrastructureProviderLocal.

#### setup\_browser

```python
def setup_browser(ctx: ToolRunContext) -> Browser
```

Get a Browser instance.

Note: This provider does not support end_user_id.

**Arguments**:

- `ctx` _ToolRunContext_ - The context for the tool run, containing execution context
  and other relevant information.
  

**Returns**:

- `Browser` - A configured Browser instance for local browser automation.

#### construct\_auth\_clarification\_url

```python
def construct_auth_clarification_url(ctx: ToolRunContext,
                                     sign_in_url: str) -> HttpUrl
```

Construct the URL for the auth clarification.

**Arguments**:

- `ctx` _ToolRunContext_ - The context for the tool run, containing execution context
  and other relevant information.
- `sign_in_url` _str_ - The URL that the user needs to sign in to.
  

**Returns**:

- `HttpUrl` - The URL for the auth clarification, which in this case is simply the sign-in
  URL passed directly through.

#### get\_chrome\_instance\_path

```python
def get_chrome_instance_path() -> str
```

Get the path to the Chrome instance based on the operating system or env variable.

**Returns**:

- `str` - The path to the Chrome executable. First checks for the
  PORTIA_BROWSER_LOCAL_CHROME_EXEC environment variable, then falls back to default
  locations based on the operating system.
  

**Raises**:

- `RuntimeError` - If the platform is not supported (not macOS, Windows, or Linux) and the
  env variable isn&#x27;t set.

#### step\_complete

```python
def step_complete(ctx: ToolRunContext) -> None
```

Call when the step is complete to e.g release the session.

#### get\_extra\_chromium\_args

```python
def get_extra_chromium_args() -> list[str] | None
```

Get the extra Chromium arguments.

**Returns**:

  list[str] | None: A list of extra Chromium arguments if the environment variable
  is set, otherwise None.

