' use strict';

const axios = require('axios');
let cache = require('./cache');

async function getForecast(request, response, next){
  let lat = request.query.lat;
  let lon = request.query.lon;
  const key = 'Forecast' + lat + lon;
  const weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=5&key=${process.env.WEATHER_API_KEY}`;
  try {
    if(cache[key] && (Date.now() - cache[key].timeStamp < 50000)){
      console.log('Cache Hit');
      response.status(200).send(cache[key].data);
    }else{
      console.log('Cache Miss');
      let searchData = await axios.get(weatherURL);
      const dataSend = searchData.data.data.map(weatherObj => {
        return new Forecast(weatherObj);
      });
      cache[key] = {
        data: dataSend,
        timeStamp: Date.now()
      };
      console.log(searchData);
      response.status(200).send(dataSend);
    }
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
