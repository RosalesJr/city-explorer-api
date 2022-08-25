' use strict';

const axios = require('axios');

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

class Forecast {
  constructor(weatherObj) {
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
  }
}

module.exports = getForecast;
