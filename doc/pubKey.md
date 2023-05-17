# Authentication with Public Key

## Sign Up

### The attestation challenge request

User registration is performed by app-specific code. If public key authentication can be used then registration service
should use `Fl32_Auth_Back_Mod_PubKey.attestChallengeCreate` method to create attestation challenge.

Use `Fl32_Auth_Front_Mod_PubKey.composeOptPkCreate` to create attestation options on the frontend.

### The validation of attestation data

Use `Fl32_Auth_Front_Mod_PubKey.attest` method to send attestation data to the backend to
service `Fl32_Auth_Back_Web_Api_Attest`. This service decodes attestation data and saves public key in RDb.