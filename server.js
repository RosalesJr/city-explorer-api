' use strict';

console.log('My first server!');

const express = require('express');
const cors = require('cors');
const data = require('./data/weather.json');
require('dotenv').config();
const PORT = process.env.PORT || 3002;

const app = express();
app.use(cors());

app.get('/', (request, response) => {
  response.status(200).send('Welcome to the server!');
});

app.get('/weather', (request, response, next) => {
  try {
    // const lon = request.query.lon;
    // const lat = request.query.lat;
    const cityName = request.query.city;
    const searchData = data.find(city => city.city_name === cityName);
    const dataSend = searchData.data.map(Object => {
      return new Forecast(Object);
    });
    response.status(200).send(dataSend);
  }catch(error){
    next(error);
  }
});

class Forecast {
  constructor(weatherObj){
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
  }};

app.get('*', (request, response) => {
  response.status(500).send('"error": "Something went wrong"');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`We are up on PORT: ${PORT}`));