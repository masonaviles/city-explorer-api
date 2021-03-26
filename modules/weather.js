'use strict'

const superagent = require('superagent');

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

module.exports = getWeather;
