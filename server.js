' use strict';

console.log('My first server!');

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/', (request, response) => {
  response.status(200).send('Welcome to the server!');
});

// My routes
app.get('/weather', getForecast);
app.get('/movies', getMovies);

async function getForecast(request, response, next){
  let lat = request.query.lat;
  let lon = request.query.lon;
  const weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=5&key=${process.env.WEATHER_API_KEY}`;
  try {
    let searchData = await axios.get(weatherURL);
    const dataSend = searchData.data.data.map(weatherObj => {
      return new Forecast(weatherObj);
    });
    console.log(searchData);
    response.status(200).send(dataSend);
  } catch (error) {
    next(error);
  }
}

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

class Forecast {
  constructor(weatherObj) {
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
  }
}

class Movie {
  constructor(movieObj){
    this.name = movieObj.title;
  }
}

app.get('*', (request, response) => {
  response.status(500).send('"error": "Something went wrong"');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`We are up on PORT: ${PORT}`));