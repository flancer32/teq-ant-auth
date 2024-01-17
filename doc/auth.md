# Authentication basic

## The Front Identity

Every frontend identity has 3 attributes (see `Fl32_Auth_Front_Dto_Identity`):

* `backUuid`: this is the ID of the backend where this front is registered.
* `frontBid`: this ID is loaded from the back after the registration of the front.
* `frontUuid`: this ID is generated on the front and should be registered on the back.

The `Fl32_Auth_Back_Web_Api_Front_Register` endpoint registers new fronts or updates the last connection time for
existing fronts.

## The Front Session

Every API request (`TeqFw_Web_Api_Shared_Defaults.SPACE_SERVICE`) from a front is marked with a session cookie through
the `Fl32_Auth_Back_Web_Handler_Session_Front`. If the cookie named `TEQ_SESSION_FRONT` is not found in the HTTP request
to the API, a new `sessionId` is generated and planted as the `sessionCookie` in the browser. The `sessionId` (newly
generated or extracted from the cookies) is placed into the HTTP request object by the handler.

## The User Identity

Every user identity has 4 attributes (see `Fl32_Auth_Front_Dto_User`):

* `bid`: the backend ID for the user if the user is registered on the backend.
* `keys`: the asymmetric keys for cryptography.
* `session`: the user session ID if the user is authenticated.
* `uuid`: this ID is generated on the frontend and should be registered on the backend.

The `keys` and `uuid` are generated on the frontend and should be registered by the custom backend
using the `Fl32_Auth_Back_Act_User_Create` action. This plugin does not provide any endpoint to sign up users.

## The Sign-Up

The sign-up endpoint in the custom application should use `Fl32_Auth_Back_Act_User_Create` action to create user record
in RDB and generate new user session with `Fl32_Auth_Back_Mod_Session.establish`:

```javascript
const {bid} = await actCreate.act({trx, uuid, keyPub, passHash, passSalt, email, enabled});
const {sessionId} = await modSess.establish({
    request: context.request,
    response: context.response,
    trx,
    userBid,
    frontBid: foundFront.bid,
});
```

After

## The Automatic Sign In

## Old text

Use `Fl32_Auth_Front_Mod_Session.init` method to initialize frontend identity and register it on the back.

Session cookie authentication is used in this plugin. Each authenticated instance has a `sessionId` in the session
cookie, which is added to every request sent to the backend.

## Session Validation

### On the frontend

The `Fl32_Auth_Front_Mod_Session` model requests session initialization by calling the `init` method during the frontend
application startup:

```javascript
export default class Demo_Front_App {
    /**
     * @param {Fl32_Auth_Front_Mod_Session} modSess
     */
    constructor(
        {
            Fl32_Auth_Front_Mod_Session$: modSess,
        }
    ) {
        this.init = async function (fnPrintout) {
            await modSess.init();
        };
    }
}
```

This method uses the `Fl32_Auth_Back_Web_Api_Session_Init` service to validate the established session and retrieve
session data. Session data is loaded into the service using the app-specific implementation of
the `Fl32_Auth_Back_Api_Mole`.

The `Fl32_Auth_Front_Mod_Session` model stores the app-specific session data in its inner cache, which indicates that
the session is established and active:

```javascript
const isAuth = modSess.isValid();
const sessData = modSess.getData();
```

### On the back

Class `Fl32_Auth_Back_Web_Handler_Session_User` (`session handler`) is a handler that extracts `sessionId` from HTTP
header
and saves it with `Fl32_Auth_Back_Mod_Session` (`session manager`) in HTTP request before any API-service is
processed. Any handler after `session handler` can access session data using `session manager` and HTTP request.

## Session Establishment

New session can be established when:

* new user is signed up;
* existing user is signed in;

The user authenticates themselves using any of the methods (password or public key) on the backend. The backend
establishes a new session in RDB, and then plants the authentication cookie into the HTTP response with
the `Fl32_Auth_Back_Mod_Session.establish` method.

## Session Initialization

If the user has an established session (i.e., there is a session cookie in the browser), then the application loads
session data on startup with the `Fl32_Auth_Front_Mod_Session.init` method. This method requests
the `Fl32_Auth_Back_Web_Api_Session_Init` service to load session data into `Fl32_Auth_Back_Mod_Session` on the backend
and return session data to the frontend.

## Closing a Session

It is possible to close the established session with `Fl32_Auth_Front_Mod_Session.close` from the frontend. This
method requests the `Fl32_Auth_Back_Web_Api_Session_Close` service that uses the `Fl32_Auth_Back_Mod_Session` model to
clear the session data in the model, RDB, and cookies.
 