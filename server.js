'use strict';

// bring in the express libraray
// don't forget to do an npm install express
const express = require('express');

//allows us to access our env variables
require('dotenv').config();

//allow our front-end to access our server
const cors = require('cors');

// initalizing the express library so I can use it
const app = express();

//this allows anyone to access our server - aka - the worlds worst body guard
app.use(cors());

const PORT = process.env.PORT || 3001;


const myShoppingList = ['coffee', 'eggs', 'facial mask', 'aisan shrimp', 'energy drink', 'deordant'];
//use weather data
const weather = require('./data/weather.json');
const weatherArray = weather.data;
 
app.get('/', function (request, response) {
  response.send('Hello World')
});

app.get('/shopping', (request, response) => {
  response.send(myShoppingList);
})

// hook up weather data
// api endpoint
app.get('/weather', function(request, response){
  console.log(weather.lat);
  const latitude = weather.lat;
  const longitude = weather.lon;
  const city = weather.city_name;
  const forecastArray = weatherArray.map(element => {
    return new Forecast(element.datetime, element.weather.description);
  });

  const cityData = {
    latitude: latitude,
    longitude: longitude,
    city: city,
    forecastArray: forecastArray
  };

  response.send(cityData);
});

// constructor function for a Forecast
class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}
 

// turn on the server
app.listen(PORT, () => console.log(`listening on ${PORT}`));

// three ways to do it:
// 1. node server.js
// 2. npm start
// 3. nodemon - this is going to check for changes and update