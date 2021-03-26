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

// const weather = require('./modules/weather');
// const getMovies = require('./movies');

// ============Routes=============================

// proof of life
app.get('/', function (request, response) {
  response.send('Hello World')
});

//use weather data
app.get('/weather', getWeather);

//use movie data
app.get('/movies', getMovies);

// ===============================================

function getMovies(request, response) {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${MOVIES_API_KEY}`;
  const locationSearch = request.query.city;
  const query = {
    key: MOVIES_API_KEY,
    query: locationSearch
  }

  //The .query() method accepts objects, which when used with the GET method will form a query-string. The following will produce the path /search?query=Manny&range=1..5&order=desc.

  superagent
  .get(url)
  .query(query)
  .then(superagentResults => {
    //results is found in the moviedb docs
    const movieResults = superagentResults.body.results;
    const movieResultsArray = movieResults.map(movie => new Movies(movie));
    console.log('movie results', movieResultsArray)
    response.status(200).send(movieResultsArray);
  })
  .catch(err => {
    console.log('something went wrong with superagent call');
    response.status(500).send('we messed up');
  })
}

function Movies(obj){
  this.title = obj.original_title;
  this.overview = obj.overview;
  this.average_votes = obj.vote_average;
  this.total_votes = obj.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500/${obj.poster_path}`;
  this.popularity = obj.popularity;
  this.released_on = obj.release_date;
}

// ===============================================

function getWeather(request, response) {
  const { latitude, longitude } = request.query;
  // go to the weather API
  getWeatherFromAPI(latitude, longitude, response);
}

function getWeatherFromAPI(latitude, longitude, response) {
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const query = {
    key: process.env.WEATHER_API_KEY,
    lat: latitude,
    lon: longitude
  }

  superagent
  .get(url)
  .query(query)
  .then(superagentResults => {
    const results = superagentResults.body.data;
    const weatherResults = results.map(day => new Weather(day));
    console.log('weather results', weatherResults)
    response.status(200).send(weatherResults);
    console.log('200! weather results', weatherResults);
  })
  .catch(err => {
    console.log('something went wrong with superagent call');
    response.status(500).send('we messed up');
  });
}

function Weather(obj){
  this.description =  `${obj.high_temp || 'no temp available'} with ${obj.weather.description.toLowerCase()}`;
  this.date = obj.valid_date;
}

// ===========HEYLISTEN===========================

// turn on the server
app.listen(PORT, () => console.log(`listening on ${PORT}`));

// three ways to do it:
// 1. node server.js
// 2. npm start
// 3. nodemon - this is going to check for changes and update