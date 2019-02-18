import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {hmrBootstrap} from './hmr';
import 'hammerjs';

declare var cordova;

if (environment.production) {
  enableProdMode();
}

/**
 * Check if cordova.js is present, if not start without it.
 */
if (typeof cordova == 'undefined') {
  initBootstrap();
} else {
  document.addEventListener('deviceready', function () {
    initBootstrap();
    cordova.plugins.diagnostic.isCameraAuthorized({
      successCallback: function (authorized) {
        console.log('App is ' + (authorized ? 'authorized' : 'denied') + ' access to the camera');
        if (!authorized) {
          authorizeCamera();
        }
      },
      errorCallback: function (error) {
        console.error('The following error occurred: ' + error + '. Requesting camera access.');
        authorizeCamera();
      },
      externalStorage: false
    });
  }, false);
}

/**
 * Angular only allows one entry point for bootstrapModule, to allow multiple calls it needs to wrapped in a function.
 */
function initBootstrap() {
  const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);
  if (environment.hmr) {
    if (module['hot']) {
      hmrBootstrap(module, bootstrap);
    } else {
      console.error('HMR is not enabled for webpack-dev-server!');
      console.log('Are you using the --hmr flag for ng serve?');
    }
  } else {
    bootstrap().catch(err => console.log(err));
  }
}

/**
 * Call for camera authorization.
 */
function authorizeCamera() {
  cordova.plugins.diagnostic.requestCameraAuthorization({
    successCallback: function (available) {
      console.log('Authorization request for camera use was ' + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? 'granted' : 'denied'));
    },
    errorCallback: function (error) {
      console.error(error);
    },
    externalStorage: false
  });
}




