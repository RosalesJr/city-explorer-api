' use strict';

const axios = require('axios');

async function getMovies(request, response, next){
  let city = request.query.city;
  const movieURL = `https://api.themoviedb.org/3/search/movie/?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;
  try {
    let movieSearch = await axios.get(movieURL);
    const movieSend = movieSearch.data.results.map(movieObj => {
      return new Movie(movieObj);});
    response.status(200).send(movieSend);
  }catch (error) {
    next(error);
  }
}

class Movie {
  constructor(movieObj){
    this.name = movieObj.title;
  }
}

module.exports = getMovies;
