'use strict';
const superagent = require('superagent');

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

module.exports = getMovies;