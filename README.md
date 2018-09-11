# Firebase - Custom Claims CLI

The Firebase Admin SDK supports defining custom attributes on user accounts. This provides the ability to implement various access control strategies, including role-based access control, in Firebase apps. These custom attributes can give users different levels of access (roles), which are enforced in an application's security rules.

This CLI is a simple wrapper around the Admin SDk to allow current claims to be viewed and updated as well as new cliams to be added.

## Overview

This CLI offers the capability to set custom claims using the [admin SDK](https://firebase.google.com/docs/auth/admin/custom-claims).

### Usage

To use the `claim` command a path to the service account configuration can be provided as the only required argument to either command. If this value is _NOT_ present then the application will look for the following environmental variable to generate a service config at runtime.

- `GOOGLE_APPLICATION_CREDENTIALS`

The above variable is required when a path to a service config is not specified. If you are running this in the context of a GCP then more can be found [here](https://cloud.google.com/docs/authentication/production).

For use locally you can set this environmental variable like so:

`export GOOGLE_APPLICATION_CREDENTIALS=`path/to/local/service/config'`


#### Command Line

##### Claim

```sh
claim [path/to/serviceAccountConfig.json]
```

- `-e, --email <email>` - The `email` argument is required and is the email address associated with the user account that is used for authentication. Custom claims apply to users already signed in with supported providers (Email/Password, Google, Facebook, phone, etc). For example, a user signed in with Firebase Auth's Email/Password provider can have access control defined using custom claims. For more information see the [docs](https://firebase.google.com/docs/auth/admin/custom-claims).
- `-c, --claims <claims>` - Claims are a json string that is parsed using [node-jq](https://www.npmjs.com/package/node-jq) and used to set claims on a given user account. Once set they are accessible on both the client and the server. And can be accessed like below:


##### Node.js:
```admin.auth().getUser(uid).then(userRecord);```

##### Web:
```
firebase.auth().currentUser.getIdTokenResult()
  .then(idTokenResult=> {
    // claims available on
    idTokenResult.claims
  })
```



## License

Firestore Utility CLI is open source software [licensed as Apache License, Version 2.0](https://github.com/fanai-inc/firestore-utils/blob/develop/LICENSE.md).
