---
sidebar_label: browser_tool
title: portia.open_source_tools.browser_tool
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

## BrowserTaskOutput Objects

```python
class BrowserTaskOutput(BaseModel)
```

Output schema for browser task execution.

This class represents the response from executing a browser task,
including both the task result and any authentication requirements.

**Attributes**:

- `task_output` _str_ - The result or output from executing the requested task.
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
class BrowserTool(Tool[str])
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

#### infrastructure\_provider

```python
@cached_property
def infrastructure_provider() -> BrowserInfrastructureProvider
```

Get the infrastructure provider instance (cached).

#### run

```python
def run(ctx: ToolRunContext, url: str, task: str) -> str | ActionClarification
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

#### run

```python
def run(ctx: ToolRunContext, task: str) -> str | ActionClarification
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

#### construct\_auth\_clarification\_url

```python
@abstractmethod
def construct_auth_clarification_url(ctx: ToolRunContext,
                                     sign_in_url: str) -> HttpUrl
```

Construct the URL for the auth clarification.

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

#### get\_extra\_chromium\_args

```python
def get_extra_chromium_args() -> list[str] | None
```

Get the extra Chromium arguments.

**Returns**:

  list[str] | None: A list of extra Chromium arguments if the environment variable
  is set, otherwise None.

## BrowserInfrastructureProviderBrowserBase Objects

```python
class BrowserInfrastructureProviderBrowserBase(BrowserInfrastructureProvider)
```

Browser infrastructure provider for BrowserBase.

This provider implements browser automation using BrowserBase&#x27;s cloud infrastructure. It manages
browser sessions and contexts for remote browser automation, with support for user-specific
contexts.

The provider requires both a BrowserBase API key and project ID, which can be provided either
directly through the constructor or via environment variables (BROWSERBASE_API_KEY and
BROWSERBASE_PROJECT_ID).

**Arguments**:

- `api_key` _str, optional_ - The BrowserBase API key. If not provided, will be read from
  the BROWSERBASE_API_KEY environment variable.
- `project_id` _str, optional_ - The BrowserBase project ID. If not provided, will be read
  from the BROWSERBASE_PROJECT_ID environment variable.
  

**Raises**:

- `ToolHardError` - If either the API key or project ID is not provided and cannot be found
  in environment variables.

#### \_\_init\_\_

```python
def __init__(api_key: str | None = None,
             project_id: str | None = None) -> None
```

Initialize the BrowserBase infrastructure provider.

**Arguments**:

- `api_key` _str, optional_ - The BrowserBase API key. If not provided, will be read from
  the BROWSERBASE_API_KEY environment variable.
- `project_id` _str, optional_ - The BrowserBase project ID. If not provided, will be read
  from the BROWSERBASE_PROJECT_ID environment variable.
  

**Raises**:

- `ToolHardError` - If either the API key or project ID is not provided and cannot be found
  in environment variables.

#### get\_context\_id

```python
def get_context_id(bb: Browserbase) -> str
```

Get the Browserbase context id.

Creates a new context in the BrowserBase project. This method can be overridden in
subclasses to implement custom context management, such as returning a saved context ID
for a specific user.

**Arguments**:

- `bb` _Browserbase_ - The Browserbase client instance.
  

**Returns**:

- `str` - The ID of the created or retrieved context.

#### create\_session

```python
def create_session(bb_context_id: str) -> SessionCreateResponse
```

Create a new BrowserBase session with the given context ID.

Creates a persistent session that will remain active through clarification resolution.

**Arguments**:

- `bb_context_id` _str_ - The BrowserBase context ID to associate with the session.
  

**Returns**:

- `SessionCreateResponse` - The response containing session details including the
  session ID and connection URL.

#### get\_or\_create\_session

```python
def get_or_create_session(context: ToolRunContext, bb: Browserbase) -> str
```

Get an existing session or create a new one if none exists.

Manages session lifecycle by either retrieving an existing session from the context
or creating a new one. Session details are stored in the execution context&#x27;s
additional_data for future retrieval.

**Arguments**:

- `context` _ToolRunContext_ - The tool run context containing execution information.
- `bb` _Browserbase_ - The Browserbase client instance.
  

**Returns**:

- `str` - The session connection URL that can be used to connect to the browser.

#### construct\_auth\_clarification\_url

```python
def construct_auth_clarification_url(ctx: ToolRunContext,
                                     sign_in_url: str) -> HttpUrl
```

Construct the URL for authentication clarification.

Creates URL that allows viewing the browser session during authentication flows.

**Arguments**:

- `ctx` _ToolRunContext_ - The tool run context containing execution information.
- `sign_in_url` _str_ - The URL where authentication should occur (not used in this
  implementation as we return the debug view URL instead).
  

**Returns**:

- `HttpUrl` - The URL for the debug view of the browser session.
  

**Raises**:

- `ToolHardError` - If no session ID is found in the context.

#### setup\_browser

```python
def setup_browser(ctx: ToolRunContext) -> Browser
```

Set up a Browser instance connected to BrowserBase.

Creates or retrieves a BrowserBase session and configures a Browser instance
to connect to it using the Chrome DevTools Protocol (CDP).

**Arguments**:

- `ctx` _ToolRunContext_ - The tool run context containing execution information.
  

**Returns**:

- `Browser` - A configured Browser instance connected to the BrowserBase session.

