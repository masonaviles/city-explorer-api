'use strict';
// ===============================================
// don't forget to do an npm install:
// express, dotenv, cors, superagent

// bring in the express library
// initalizing the express library so I can use it
const express = require('express');
const app = express();

//allows us to access our env variables
require('dotenv').config();

//allow our front-end to access our server
//this allows anyone to access our server - aka - the worlds worst body guard
const cors = require('cors');
app.use(cors());

// superagent is going to get us data
const superagent = require('superagent');

// ============Constants==ENV=====================

const PORT = process.env.PORT || 3002;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIES_API_KEY = process.env.MOVIES_API_KEY;

const weatherHandler = require('./modules/weather');
const getMovies = require('./modules/movies');

// ============Routes=============================

// proof of life
app.get('/', function (request, response) {
  response.send('Hello World')
});

//use weather data
// app.get('/weather', getWeather);
app.get('/weather', weatherHandler);

//use movie data
app.get('/movies', getMovies);

// ================Testing========================

// ===============================================

// ===========HEYLISTEN===========================

// turn on the server
app.listen(PORT, () => console.log(`listening on ${PORT}`));

// three ways to do it:
// 1. node server.js
// 2. npm start
// 3. nodemon - this is going to check for changes and update