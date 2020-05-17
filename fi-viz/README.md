# SGA Financial Data Visualization Website

## Abstract

Worcester Polytechnic Institute provides students with the opportunity to get involved on campus with clubs, organizations, and school-sponsored events. Funding these endeavors is a large-scale operation that the Student Government Association (SGA) is tasked with handling. SGA’s budget is comprised of the Student Life Fee, which is paid yearly by each student. Many students are not aware of the purpose of this fee, and due to this, SGA has made financial transparency one of their goals for this fiscal year. With this project, our team aims to use data visualization to bring awareness to the student body about where their portion of the student life fee goes. Students involved in SGA, club executives, students interested in their finances, and even future WPI students alike can all use our site in some way. This is just a start to bringing clarity to the student life fee, and we believe our project will provide a strong foundation to continue increasing transparency and spark important conversations about how students want their money allocated.

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
