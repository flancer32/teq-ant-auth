# Authentication with Password

The password authentication uses the email as the login name and the salted password.
All encryption is executed on the client side (frontend); the server just stores the salt and the password hash.
The model `Fl32_Auth_Front_Mod_Password` creates a hash for the user password using the 'SHA-384' algorithm.
All data is encoded as base64url before transferring to/from the backend.

## Use Cases

* Registration of a new user.
* Activation of a pre-created user (password setup).
* Authentication of a user (opening a new session).
* User authorization on the backend (session handling).
* Logout process.
* Restoration of a forgotten password.

## RDB Schema

The `fl32_auth_password` entity (DEM):

```json
{
  "password": {
    "attr": {
      "user_ref": {"type": "ref"},
      "email": {
        "type": "string", "comment": "Email to restore the access to the user account."
      },
      "date_updated": {
        "comment": "Date-time when record was updated.",
        "type": "datetime",
        "default": "current"
      },
      "hash": {"type": "binary", "nullable": true},
      "salt": {"type": "binary", "nullable": true}
    },
    "index": {
      "PK": {"type": "primary", "attrs": ["user_ref"]}
    },
    "relation": {
      "user": {
        "attrs": ["user_ref"],
        "ref": {"path": "/fl32/auth/user", "attrs": ["bid"]},
        "action": {"delete": "cascade", "update": "cascade"}
      }
    }
  }
}
```
