# teq-ant-auth

|CAUTION: TeqFW is an unstable project w/o backward compatibility. Use it at your own risk.|
|---|

Common authentication of the users in Tequila Framework (the `ant` generation).

## Overview

Every user creates a pair of asymmetric keys on the frontend or can import saved keys to connect to the host as an
existing user. The user sends the public key, password (to change the public key), and email (to restore the password)
to the host during sign-up. The stored keys are used to set up a user session (to identify the user for a given
frontend/browser on the backend). The session ID is stored in the local storage on the frontend and can be automatically
reopened.

TODO: do we really need sessions if we already have asymmetric encryption in place?


## Depends on

* @teqfw/db
* @teqfw/web-api

## Back

### Web Handlers

* `Fl32_Auth_Back_Web_Handler_Session_Front`: handles the HTTP session stored in the session cookies. It allows tracing
  all requests from one browser, including anonymous users, to Web API endpoints. On the server side, the session IDs
  are stored in the HTTP request objects.
* `Fl32_Auth_Back_Web_Handler_Session_User`: handles the data for authenticated users. On the frontend, the session ID
  is stored in the local storage. On the backend, the session ID is stored in the RDB (`fl32_auth_session`). The session
  data for the authenticated user is stored inside the handler itself and added to every HTTP request.

## Front

### `Fl32_Auth_Front_Mod_Session`

Init the session in the frontend app:

```javascript
await session.init();
```