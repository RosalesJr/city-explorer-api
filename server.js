' use strict';

console.log('My first server!');

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const axios = require('axios');
const getForecast = require('./modules/weather');
const getMovies = require('./modules/movie')

const app = express();
app.use(cors());

app.get('/', (request, response) => {
  response.status(200).send('Welcome to the server!');
});

// My routes
app.get('/weather', getForecast);
app.get('/movies', getMovies);

app.get('*', (request, response) => {
  response.status(500).send('"error": "Something went wrong"');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`We are up on PORT: ${PORT}`));