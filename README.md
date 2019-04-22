# PhotoApp
Version: 0.1

This app developed to enable the user to upload their photos safely at the cloud stoarge which make the user capable of retrieving the saved photos at any time he want.

### Installation

1- Make sure that [Nodejs](https://nodejs.org/en/) and [Android SDK](https://developer.android.com/studio) installed on your machine.

2- After downloading the repo you can open the terminal into PhotoApp__Frontend folder and type : 

```sh
$ npm install -g ionic
$ npm install -g cordova
```
        
3- Now you have been installed Ionic and Cordova globally on your machine to make sure run these commands in your terminal :
```sh
$ ionic -v
$ cordova -v
```
4- Then to install all the dependancies that have been used in this project you can type :
```sh
$ npm install
```
5- After that add all Cordova plugins :  
```sh
$ cordova state restore --plugins
```
6- Finally you can run this project on your phone by the following commands :
```sh
$ cordova build android

$ cordova run android
```

To use the app you have to register or login if you have an account when you sign in you can access your saved photos instantly or add a new one. there is a plus sign that is used to add a new photo from your library or shot a new one once you press the right mark your photo is saved on your account.