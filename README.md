# @flancer32/teq-ant-auth

Common authentication of the users in Tequila Framework (the `ant` generation).

## Disclaimer

This package is a part of the [Tequila Framework](https://flancer32.com/what-is-teqfw-f84ab4c66abf) (TeqFW). The TeqFW
is currently in an early stage of development and should be considered unstable. It may change rapidly, leading to
breaking changes without prior notice. Use it at your own risk. Please note that contributions to the project are
welcome, but they should only be made by those who understand and accept the risks of working with an unstable
framework.

## Overview

### Namespace

This plugin uses `Fl32_Auth` namespace.

### Back

#### DI Replacements

* `Fl32_Auth_Back_Api_Mod_User`: the model provides application specific methods for the user.

#### Web Handlers

* `Fl32_Auth_Back_Web_Handler_Session_Front`: handles the HTTP session stored in the session cookies. It allows tracing
  all requests from one browser, including anonymous users, to Web API endpoints. On the server side, the session IDs
  are stored in the HTTP request objects.
* `Fl32_Auth_Back_Web_Handler_Session_User`: handles the data for authenticated users. On the frontend, the session ID
  is stored in the local storage. On the backend, the session ID is stored in the RDB (`fl32_auth_session`). The session
  data for the authenticated user is stored inside the handler itself and added to every HTTP request.

#### Web API Endpoints

* `Fl32_Auth_Shared_Web_Api_Front_Register`: Registers the current frontend UUID on the backend and get identification
  data in the response.
* `Fl32_Auth_Shared_Web_Api_User_Register`: Registers the authentication data for current user on the backend (UUID,
  encryption and signature keys, email and password).

## Usage

Every user creates a pair of asymmetric keys on the frontend or can import saved keys to connect to the host as an
existing user. The user sends the public key, password (to change the public key), and email (to restore the password)
to the host during sign-up. The stored keys are used to set up a user session (to identify the user for a given
frontend/browser on the backend). The session ID is stored in the local storage on the frontend and can be automatically
reopened.

TODO: do we really need sessions if we already have asymmetric encryption in place?

## Front

### `Fl32_Auth_Front_Mod_Session`

Init the session in the frontend app:

```javascript
await session.init();
```