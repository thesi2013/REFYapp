How to sign the apk.
You can follow this answer https://stackoverflow.com/questions/26449512/how-to-create-a-signed-apk-file-using-cordova-command-line-interface.

$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore REFYapp.keystore <<Unsigned APK file>> REFYapp

$ zipalign -v 4 Example-release-unsigned.apk Example.apk
And use zipalign to compress the apk.

After that you are ready to upload it to the PLAYSTORE.
