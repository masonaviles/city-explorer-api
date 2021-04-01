'use strict'

const superagent = require('superagent');
let cache = require('./cache.js');

function weatherHandler(request, response) {
  const { latitude, longitude } = request.query;
  console.log('request q: ', request.query);
  // request q:  { latitude: '47.6038321', longitude: '-122.3300624' }
  getWeather(latitude, longitude)
  .then(summaries => response.send(summaries))
  .catch((error) => {
    console.error(error);
    response.status(500).send('Sorry. Something went wrong!')
  });
}

function getWeather(latitude, longitude) {
  const key = 'weather-' + latitude + longitude;
  console.log({latitude, longitude});
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const queryParams = {
    key: process.env.WEATHER_API_KEY,
    lang: 'en',
    lat: latitude,
    lon: longitude,
    days: 5,
  };
  // inMemoryDB[ingredient].createdAt > Date.now() - 300000
  if (cache[key] !== undefined && cache[key].timestamp > Date.now() -  50000) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    // console.log({finalRecipes});
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = superagent.get(url)
    .query(queryParams)
    .then(response => {
      parseWeather(response.body);
      console.log('response b: ', response.body);
    });
  }
  
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    console.log('weather d: ', weatherData.data);
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    console.log('weatherSummer: ',weatherSummaries);
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
    this.timestap =  Date.now();
  }
}

module.exports = weatherHandler;




// ========================================
// function getWeather(request, response) {
//   const { latitude, longitude } = request.query;
//   // go to the weather API
//   getWeatherFromAPI(latitude, longitude, response);
// }

// function getWeatherFromAPI(latitude, longitude, response) {
//   const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
//   const query = {
//     key: process.env.WEATHER_API_KEY,
//     lat: latitude,
//     lon: longitude
//   }

//   superagent
//   .get(url)
//   .query(query)
//   .then(superagentResults => {
//     const results = superagentResults.body.data;
//     const weatherResults = results.map(day => new Weather(day));
//     console.log('weather results', weatherResults)
//     response.status(200).send(weatherResults);
//     console.log('200! weather results', weatherResults);
//   })
//   .catch(err => {
//     console.log('something went wrong with superagent call');
//     response.status(500).send('we messed up');
//   });
// }

// function Weather(obj){
//   this.description =  `${obj.high_temp || 'no temp available'} with ${obj.weather.description.toLowerCase()}`;
//   this.date = obj.valid_date;
// }

// module.exports = getWeather;
