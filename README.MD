# Protein Tracker

## Meteor

### Notions

#### DDP (Distributed Data Protocol)

> DDP is the Meteor communication protocol

It is responsible for handling subscriptions and RPC (Remote Procedure Calls).
We can see the actual communication via `DevTools/Network/Websocket`. 

#### EJSON

> EJSON is a special type of JSON document (todo: find out more details)

### Meteor directory structure

* `/client` - runs on client only
* `/server` - runs on server only
* `/private` - assets for server code only
* `/public` - static assets, fonts, images, etc.
* `/lib` - runs before everything else
* `/test` - does not run anywhere
* `(anything else)` - runs on client and server
* `main.*` - runs after everything else

### Commands

* `meteor list` - list of installed packages
* `meteor add <package>` - add a new package
* `meteor remove autopublish`
* `meteor reset` - resets the Mongodb data

## Installation

* `meteor create ProteinTracker`
* `cd ProteinTracker`
* `meteor add session`
* `meteor add accounts-ui`
* `meteor add accounts-google`
* `meteor`

## Authentication

Meteor has a number of packages for authentication:

* `accounts-base`
* `accounts-facebook`
* `accounts-github`
* `accounts-google` (!)
* `accounts-meetup`
* `accounts-password`
* `accounts-twitter`
* `accounts-ui` (!)
* `accounts-ui-unstyled`
* `accounts-weibo`

## Other useful standard Meteor packages

* `amplify` - API for Persistent Storage, PubSub and Request
* `appcache` - enable the application cache in the browser
* `backbone`
* `bootstrap`
* `code-prettify` - syntax highlighting of code, from Google
* `email` - send email messages
* `force-ssl` - require this applciation to use secure transprot (HTTPS)
* `less` - leaner CSS language
* `iron:router` - routing sepcifically designed for Meteor (also [see here](https://atmospherejs.com/iron/router))
* `showdown` - markdown to html processor
* `spiderable` - makes the application crawlable to web spiders
* `underscore` - collection of small helper functions: _.map, _.each, ...

## Community packages from Atmosphere

* Meteor `router` [on Github](https://github.com/tmeasday/meteor-router)
* `iron:router` [on Github](https://github.com/iron-meteor/iron-router)

## Installing community packages

On Linux and macOS we can do this simply via `meteorite`

* `npm install -g meteorite`
* `mrt add [package_name]`

Unfortunately, at this moment, `meteorite` does not work of Windows. Also, `mrt` command
conflicts with the Window's `Malicious Software Removal Tool`.

It is still possible though to install community packages on Windows.

* create `packages` folder in the root of your Meteor project if it does not exist yet
* find the GitHub repository for your Meteor package, e.g. `Meteor Router`
* clone the package into the `packages` folder
* if necessary, rename the package directory name to the correct name
* `meteor add [package_name]` 


## Observations

* `{{#with someVar}}` block in html provides for the MongoDB's `this._id` 
  for `someVar` in the JavaScript code.
* modules `autopublish` and `insecure` are installed by default, but we may want to change that:
  * uninstall `autopublish` if you want to control the subscriptions on per user basis
  * uninstall `insecure` if you want to control and authorize database modifications
* don't use newer version of Nodejs for the risk of breaking Meteor
* when Meteor parses your various html files, any files that contain a `<head></head>` tag outside
  of a `<template></template>` will be concatenated together into one `<head></head>` tag in every
  page of your app. This is good for including stuff like title, various meta tags, and 3rd party
  resources that you want to use on every page. Here is an example of `head.html` file: 

  ```html
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="fragment" content="!"/>
    <meta name="description" content="your description"/>
    <meta property="og:title" content="your site title"/>
    <meta property="og:type" content="website"/>
    <meta property="og:image" content="https://yourimageurl"/>
    <meta property="og:url" content="https://hostname"/>
    <meta property="og:description" content="your description"/>
    <meta name="twitter:card" content="summary"/>
    <meta name="twitter:url" content="https://hostname"/>
    <meta name="twitter:title" content="your site title"/>
    <meta name="twitter:description" content="your site description"/>
    <meta name="twitter:image" content="https://yourimageurl">
    <noscript>You must have Javascript enabled in order to use this site</noscript>
    <link rel="shortcut icon" href="/your-ico" type="image/x-icon" />
  </head>
  ```

  However, handlebars support for title tags still does not exist in Meteor so it is definitely
  limited in what you can do with it (no dynamic meta information). But you can can set dynamic
  titles using `iron:router` like this:

  ```JavaScript
  onAfterAction: function(){
    document.title = 'my awesome site: ' + Router.current().route.getName();
  }
  ```
  