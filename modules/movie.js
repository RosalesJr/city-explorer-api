' use strict';

const axios = require('axios');
let cache = require('./cache');

async function getMovies(request, response, next) {
  let city = request.query.city;
  const movieURL = `https://api.themoviedb.org/3/search/movie/?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;
  let key = city + 'Movie';
  try {
    if (cache[key] && (Date.now() - cache[key].timeStamp < 50000)) {
      console.log('Cache Movie Hit');
      response.status(200).send(cache[key].data);
    } else {
      console.log('Cache Movie Miss');
      let movieSearch = await axios.get(movieURL);
      const movieSend = movieSearch.data.results.map(movieObj => {
        return new Movie(movieObj);
      });
      cache[key] = {
        data: movieSend,
        timeStamp: Date.now(),
      };
      response.status(200).send(movieSend);
    }
  } catch (error) {
    next(error);
  }
}

class Movie {
  constructor(movieObj) {
    this.name = movieObj.title;
  }
}

module.exports = getMovies;
