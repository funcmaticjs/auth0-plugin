# auth0-plugin
Verifies an Auth0 JWT token

## Install

```
$> npm install --save @funcmaticjs/auth0-plugin
```

## Use

```js
const func = require('@funcmaticjs/funcmatic')
const Auth0Plugin = require('@funcmaticjs/auth0-plugin')
...
func.use(new Auth0Plugin())
```

## Configure the Environment

The following variables must exist in `ctx.env` during the env handler:

- `FUNC_AUTH0_DOMAIN`: The Auth0 domain from your Auth0 account (e.g. "xyz.auth0.com"). To find your Auth0 domain, see Auth0's documentatation, *[Learn the Basics](https://auth0.com/docs/getting-started/the-basics)*.
- `FUNC_AUTH0_SKIP_VERIFICATION` (OPTIONAL): If set to the string value of `'true'`, then the Auth0Plugin will decode the token WITHOUT verifying that it was issued by Auth0 for your Auth0 domain. Recommended to only be used in unit testing so that you can test with a mocked token rather than a real issued token from Auth0.


## Side Effects

- `ctx.event.headers['Authorization']`: The Auth0Plugin will check for a JWT token in the `Authorization` http header (i.e. `ctx.event.headers['Authorize']`) with the format: `Bearer Your.JWTTokenHere`. If no Authorization header value is sent by the client, then it is considered a failed authentication (see *No Authorization Token Sent* below).
- `ctx.state.auth`: The Auth0Plugin will first verify the token is valid, and then store the results of the decoded token in `ctx.state.auth`. If the token is not valid (e.g. expired), then it will store 

#### Valid Token (Successful Authentication)

```js
{
  success: true,
  t:  1562517085196,   // ms since epoch i.e. Date.now()
  decoded: {
    /* the decoded JWT token */
  }
}
```

#### Invalid Token (Unsuccessful Authentication)

```js
{
  success: true,
  t:  1562517085196, // ms since epoch i.e. Date.now()
  error: true,
  errorMessage: "Some reason for the error"  
}
```

#### No Authorization Token Sent (Unsuccessful Authentication)

```js
{
  success: true,
  t:  1562517085196, // ms since epoch i.e. Date.now()
  error: true,
  errorMessage: "No token provided"  
}
```

