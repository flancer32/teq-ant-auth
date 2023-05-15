# Authentication basic

Session cookie authentication is used in this plugin. Each authenticated instance has a `sessionId` in the session
cookie, which is added to every request sent to the backend.

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

## Session stores

### On the frontend

The `Fl32_Auth_Front_Mod_Session` model requests session initialization by calling the `init` method during the frontend
application startup. This method uses the `Fl32_Auth_Back_Web_Api_Session_Init` service to validate the established
session and retrieve session data. Session data is loaded into the service using the app-specific implementation of
the `Fl32_Auth_Back_Api_Mole`. The `Fl32_Auth_Front_Mod_Session` model stores the app-specific session data in its inner
cache, which indicates that the session is established and active.

### On the back

Class `Fl32_Auth_Back_Web_Handler_Session` (`session handler`) is a handler that extracts `sessionId` from HTTP header
and saves it with `Fl32_Auth_Back_Mod_Session` (`session manager`) in HTTP request before any API-service is
processed. Any handler after `session handler` can access session data using `session manager` and HTTP request.