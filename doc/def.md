# Definitions

## Front

The front is a set of browser resources on the client side restricted by
the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin). The backend should separate all fronts by UUID
because every front has its own space in IDB, local/session/cache storage, etc.

## User

The user is a person with their own set of personal data to store in an application (both on the backend and the
frontend).

## User Session

The session is an authenticated relationship between a user and a front.