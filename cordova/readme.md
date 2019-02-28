How to deploy cordova.

$ cordova platform add <<platfrom>>
To install the platforms for cordova you need android and ios.

$ cordova build --release <<platform>> 
To build the release version.

If you want to sign for android by yourself, move the apk into the key folder and follow the instructions there
or upload the apk directly to the PLAYSTORE and let google do the signing.


For IOS read this:
https://stackoverflow.com/questions/36095819/cordova-ios-error-building-images-xcassets#


$ cordova build ios --build-config --release

