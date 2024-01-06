# teq-ant-auth

|CAUTION: TeqFW is an unstable project w/o backward compatibility. Use it at your own risk.|
|---|

Common authentication of the users in Tequila Framework (`ant` package).

Contains:

* Users registry of the current host.
* Users passwords.
* The public keys of the users.
* The session registry.
* WebAuthn API credentials to authenticate users.

Depends on:

* @teqfw/db
* @teqfw/web-api

## Front

### `Fl32_Auth_Front_Mod_Session`

Init the session in the frontend app:

```javascript
await session.init();
```