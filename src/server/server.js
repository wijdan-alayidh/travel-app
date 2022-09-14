// dotevn backage to use variables in .env file
const dotenv = require("dotenv");
// config to use variables in .env file
dotenv.config();

// Express server setup
var path = require("path");
const express = require("express");
const app = express();

/* Dependencies */
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const cors = require("cors");
const { request, response } = require("express");
const e = require("express");

/* Middleware*/

// - Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("dist"));
// console.log(__dirname);

// Server setup
const port = 3000;
const server = app.listen(port, listening);

// /* -------- APIs Info -------- */

/**
 *  First API : Geonames
 * ----------------------
 *  Request URL Example :
 *
 *  http://api.geonames.org/postalCodeSearchJSON?placename=london&maxRows=10&username=demo
 *
 *  This API will used to Get coordinates about specific city.
 */
const geonames = {
  URL: "http://api.geonames.org/postalCodeSearchJSON?",
  USER_NAME: "wijdan",
  MAX_ROWS: 1,
};
// console.log(geonames);

/**
 *  Second API : Weatherbit
 * ----------------------
 *  Request URL Example :
 *
 *  http://api.weatherbit.io/v2.0/forecast/daily?lat=51.5072&lon=-0.1276&key=1234....
 *
 *  This API will used to Get weather information.
 */
const weatherbit = {
  URL_FORECAST: "http://api.weatherbit.io/v2.0/forecast/daily?",
  URL_CURRENT: "https://api.weatherbit.io/v2.0/current?",
  KEY: "d7c43479b48e4c1383f18bd7b703d5b7",
};
// console.log(weatherbit);

/**
 *  Third API : Pixabay
 * ----------------------
 *  Request URL Example :
 *
 *  https://pixabay.com/api/?key=1234....&q=london&image_type=photo
 *
 *  This API will used to Get images for specific city.
 */
const pixabay = {
  URL: "https://pixabay.com/api/?",
  KEY: "29732096-d682b610e70c6fb4a26a8749f",
  TYPE: "&image_type=photo",
  CATIGORY: "&category=nature",
};
// console.log(pixabay);

/**
 *  Fourth API : REST Countries
 * ----------------------
 *  Request URL Example :
 *
 *  https://restcountries.com/v3.1/alpha/{code}
 *
 *  This API will used to Get information about countries.
 */
const restcountries = {
  URL: "https://restcountries.com/v3.1/alpha/",
};
// console.log(restcountries);

// Callback to debug
async function listening() {
  console.log(`Server running successfully at port: ${port}`);
}

app.get("/", function (req, res) {
  res.sendFile("dist/index.html");
});

const postCityCoordinates = async (req, res) => {
  let city = await req.body.city;
  let requestURL = `${geonames.URL}placename=${city}&maxRows=${geonames.MAX_ROWS}&username=${geonames.USER_NAME}`;
  try {
    const geonamesApi = await fetch(requestURL);
    const data = await geonamesApi.json();

    if (data.postalCodes.length == 0) {
      const errorMessage = {
        error: "No result, Make sure you input correct city name",
      };
      console.log(errorMessage);
      res.send(errorMessage);
    } else {
      console.log(data);
      res.send(data);
    }
  } catch (error) {
    console.log(error);
  }
};

app.post("/city-coordinates", postCityCoordinates);

app.post("/city-info", async (req, res) => {
  const cityCoordinates = await req.body;
  const travelPlane = await cityCoordinates.travel_plane;

  console.log(cityCoordinates);
  let requestURL =
    (await travelPlane) == "current"
      ? `${weatherbit.URL_CURRENT}lat=${req.body.lat}&lon=${req.body.lng}&key=${weatherbit.KEY}`
      : `${weatherbit.URL_FORECAST}lat=${req.body.lat}&lon=${req.body.lng}&key=${weatherbit.KEY}`;

  let weatherData = {};
  try {
    const weatherbitApi = await fetch(requestURL);
    const weather = await weatherbitApi.json();

    /**
     *
     * This step to classify the results comes from API
     * Because the API sends different data
     * based on the date that passed to API :
     *
     * -----------------------------------------
     *
     * if date --> in current week --> API will send one object data contain the weather data.
     * if date --> in future --> API will send Weather forecast objects for 16 days.
     *
     */

    /*** ------- Get weather Data ------- ***/
    console.log(Object.keys(weather.data).length);

    if (Object.keys(weather.data).length == 1) {
      weatherData = {
        city: weather.data[0].city_name,
        country_code: weather.data[0].country_code,
        temp: weather.data[0].temp,
        weather_icon: weather.data[0].weather.icon,
        weather_desc: weather.data[0].weather.description,
      };
    } else {
      let forecast_weather = {};
      for (let i = 0; i <= weather.data.length - 1; i++) {
        forecast_weather[i] = {
          datetime: weather.data[i].datetime,
          low_temp: weather.data[i].low_temp,
          max_temp: weather.data[i].max_temp,
          temp: weather.data[i].temp,
          weather_icon: weather.data[i].weather.icon,
          weather_desc: weather.data[i].weather.description,
        };

        weatherData = {
          city: weather.city_name,
          country_code: weather.country_code,
          forecast_weather: forecast_weather,
        };
      }
    }

    /*** ------- Get contry information ------- ***/
    const contryCode = await weatherData.country_code;

    const restCountriesAPI = await fetch(`${restcountries.URL}${contryCode}`);
    const country = await restCountriesAPI.json();

    // Get country needed data from API
    const countryInfo = {
      name: country[0].name.official,
      capital: country[0].capital[0],
      population: country[0].population,
      flags: country[0].flags.png,
    };

    /*** ------- Get city or country images ------- ***/

    const cityName = await weatherData.city;

    requestURL = `${pixabay.URL}key=${pixabay.KEY}&q=${encodeURIComponent(
      cityName
    )}${pixabay.CATIGORY}${pixabay.TYPE}`;

    let pixabayAPI = await fetch(requestURL);
    let pixabayData = await pixabayAPI.json();

    let cityImages = {};

    if (pixabayData.hits.length == 0) {
      cityImages = {
        image:
          "https://cdn.pixabay.com/photo/2019/03/07/13/00/clouds-4040132_1280.jpg",
      };
    } else {
      cityImages = {
        image: pixabayData.hits[0].webformatURL,
      };
    }

    console.log(requestURL);

    console.log(weatherData, countryInfo, cityImages);
    res.send({ weather: weatherData, country: countryInfo, image: cityImages });
  } catch (error) {
    console.log(error);
  }
});
