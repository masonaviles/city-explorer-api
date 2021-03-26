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

// ===============================================

const PORT = process.env.PORT || 3002;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
// ===============================================

// proof of life
app.get('/', function (request, response) {
  response.send('Hello World')
});

//use weather data
app.get('/weather', getWeather);

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

// function handleWeather(request, response) {
//   console.log('made it to weather');

//   const forecastArray = weather.data.map(day => {
//     return new Forecast(day, weather.city_name, weather.lat, weather.lon);
//   });
//   response.status(200).send(forecastArray);
// }

// function Forecast(obj, city, lat, lon) {
//   this.desc = obj.weather.description;
//   this.date = obj.datetime;
//   this.city = city;
//   this.lat = lat;
//   this.lon = lon;
// }
 

// turn on the server
app.listen(PORT, () => console.log(`listening on ${PORT}`));

// three ways to do it:
// 1. node server.js
// 2. npm start
// 3. nodemon - this is going to check for changes and update