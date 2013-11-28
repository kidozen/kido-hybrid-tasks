KidoZen Hybrid Sample Application

## Overview

This sample application serves bothh as a hybrid and web application depending on how you deploy this. It uses [cordova](http://cordova.apache.org/) to generate an Android Application based on the contents of the `wwww` folder, or `kido` to run and deploy it as a web app.

### Building the hybrid app

This sample was created with `cordova@2.8.15`. In order to install this version you can do:

	npm install -g cordova@2.8.15

Note: npm is the package manager of node.js.

You can build the Hybrid app and then open the Android solution with an IDE like Android Studio, like this:

	cordova build

If you want to run the app in an emulator:

	cordova emulate

If you want to run the app in a mobile device connected to your computer:

	cordova run

If you want to test the web application in a browser:

	cd www
	kido app-run myapp1 mycompany1.kidocloud.com

Where `myapp1` is the name of the KidoZen application, and `mycompany1.kidocloud.com` is your KidoZen environment. Then open `http://localhost:3000` in your browser.

## Code Structure

The Web Application is located in the `www` folder. It uses MVC to separate the View (DOM manipulation) from the business rules Model (in this case, KidoZen services).

## Unit Tests

The web app has a series of unit tests in `www/spec` which were built using [Jasmine](http://pivotal.github.io/jasmine/) framework, and can be run locally using the `kido` client tool like this:

	cd www
	kido app-run myapp1 mycompany1.kidocloud.com

Go with your browser to `http://localhost:3000/spec.html`