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

## Other useful packages

* `amplify` - API for Persistent Storage, PubSub and Request
* `appcache` - enable the application cache in the browser
* `backbone`
* `bootstrap`
* `code-prettify` - syntax highlighting of code, from Google
* `email` - send email messages
* `force-ssl` - require this applciation to use secure transprot (HTTPS)
* `less` - leaner CSS language
* `showdown` - markdown to html processor
* `spiderable` - makes the application crawlable to web spiders
* `underscore` - collection of small helper functions: _.map, _.each, ...

## Observations

* `{{#with someVar}}` block in html provides for the MongoDB's `this._id` 
  for `someVar` in the JavaScript code.
* modules `autopublish` and `insecure` are installed by default, but we may want to change that:
  * uninstall `autopublish` if you want to control the subscriptions on per user basis
  * uninstall `insecure` if you want to control and authorize database modifications
