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
app.get('/weather', handleGetWeather);

function handleGetWeather(req, res){
  const cityName = req.query.search_query;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${WEATHER_API_KEY}`;
  superagent
    .get(url)
    .then(stuffThatComesBack => {
      const output = stuffThatComesBack.body.data.map(day => new Weather(day));
      res.send(output);
    }).catch(errorThatComesBack => {
      res.status(500).send(errorThatComesBack);
    });
}
function Weather(data){
  this.forecast = data.weather.description;
  this.time = data.datetime;
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