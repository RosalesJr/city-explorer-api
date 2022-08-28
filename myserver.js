'use strict';

require('dotenv');
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3002;
const getWeather = require('./modules/weatherr');
const getMovies = require('./modules/movie');

const app = express();
app.use(cors());

app.get('/', (request, response) => {
  response.status(200).send('Welcome to the server!');
});

//routes
app.get('/weather', getWeather);
app.get('/movies', getMovies);

app.get('*', (request, response) => {
  response.status(500).send('"error": "Something went wrong"');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});
// function weatherHandler(request, response) {
//   // const { lat, lon } = request.query;
//   // getWeather(lat, lon)
//     .then(summaries => response.status(200).send(summaries))
//     .catch((error) => {
//       console.error(error);
//       response.status(200).send('Sorry. Something went wrong!');
//     });
// }

app.listen(PORT, () => console.log(`Server up on ${PORT}`));
