'use strict';
const superagent = require('superagent');
const Weather = require('./weatherConstructor');

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

module.exports = getWeatherFromAPI;