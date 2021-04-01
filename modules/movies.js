'use strict'

const superagent = require('superagent');
let cache = require('./cache.js');

function getMovies(request, response) {
  const locationSearch = request.query.city;
  
  if(cache[locationSearch] !== undefined && cache[locationSearch].createdAt > Date.now() - 300000){
    response.status(200).send(cache[locationSearch]);
  } else {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.MOVIES_API_KEY}`;
    const query = {
      key: process.env.MOVIES_API_KEY,
      query: locationSearch
    }
    
    superagent
    .get(url)
    .query(query)
    .then(superagentResults => {
      //results is found in the moviedb docs
      const movieResults = superagentResults.body.results;
      const movieResultsArray = movieResults.map(movie => new Movies(movie));
      console.log('movie results', movieResultsArray);
      cache[locationSearch] = movieResultsArray;
      response.status(200).send(movieResultsArray);
    })
    .catch(err => {
      console.log('something went wrong with superagent call in movies');
      response.status(500).send('we messed up');
    })
  }

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

module.exports = getMovies;
