# SGA Financial Data Visualization Website

## Abstract

**INSERT ABSTRACT WHEN DONE**

## Description

This is the repository for the SGA Financial Data Visualization MQP Team of 2019-2020. The team consisted of Peter Christakos, Andrew Morrison, Julian Pinzer, and Katherine Thompson. The advisor was Lane Harrison.

There are two parts of the website, the [React.js](src/README_REACT.md) frontend, and the [node + express server](server/README_NODE.md) backend.

## Instructions

**NOTE**: must have node installed on your computer

1. Start by running `npm install` in this directory
2. Make sure these packages are installed globally `npm install -g copyfiles jsdoc node-sass nodemon parcel-bundler pino-colada react-scripts serve`
3. Create a `config.json` file in the server directory, it should look like this:
   `{ "host": "webdb.wpi.edu", "user": "username", "password": "password", "database": "sgadb" }`
4. Run `npm run css-build` to generate the custom css files
5. Run `npm run docs` to generate the documentation for the program
6. Run one of the other commands based on need (`npm run <command>`):
   1. `start` to just run the react application, no node server
   2. `build` to build the react application for deployment
   3. `server` to just run the node server, no react application
   4. `dev` to run both the node server and the react application. Supports live reload for server files and react files.

## How to get credentials for the SGA Financial MySQL Database

Email IT Services or speak with someone in SGA to get credentials. It will probably be unlikely to get credentials for anything other than an IQP or MQP.
