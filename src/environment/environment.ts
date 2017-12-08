// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  firebaseCredentials: {
    apiKey: "AIzaSyCxHFmE_7akLn3uZE1K2Me7N5lgIP94dsg",
    authDomain: "opcloud-sandbox.firebaseapp.com",
    databaseURL: "https://opcloud-sandbox.firebaseio.com",
    projectId: "opcloud-sandbox",
    storageBucket: "opcloud-sandbox.appspot.com",
    messagingSenderId: "510910097862"
    },
  firebaseCredentials_: {
    apiKey: "AIzaSyDCcM4LU4GtKEAUtpW-xjfL1Vq9G8K0J2w",
    authDomain: "opcloud-client.firebaseapp.com",
    databaseURL: "https://opcloud-client.firebaseio.com",
    projectId: "opcloud-client",
    storageBucket: "opcloud-client.appspot.com",
    messagingSenderId: "926349859368"
  },
  firebaseAuthProviders: [
    "google"
  ]
};