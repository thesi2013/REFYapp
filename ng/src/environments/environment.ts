// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  firebase: {
    apiKey: "AIzaSyCr3uJX0ESpdqtJwFn_jYkNpiRyb0j1FC8",
    authDomain: "testrefy.firebaseapp.com",
    databaseURL: "https://testrefy.firebaseio.com",
    projectId: 'testrefy',
    storageBucket: "testrefy.appspot.com",
    messagingSenderId: "842023912277"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
