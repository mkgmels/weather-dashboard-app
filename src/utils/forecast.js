const config = require("./config.js");

const request = require("request");

const weatherApiKey = config.WEATHER_API_KEY;

const geocode = require("./geocode.js");

const forecast = async (city,coords) => {
  let geoData={}
  let url=``
  if (coords){
     geoData = coords;
     url = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${coords}&days=5`;

  }else {
     geoData = await geocode(encodeURIComponent(city));
     url = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${geoData.lat},${geoData.lng}&days=5`;

  }
  return new Promise((resolve, reject) => {
    request({ url, json: true }, (error, response) => {
      const result = response.body;
      if (error) {
        return reject("Unable to connect to the weather api!");
      } else if (result.error) {
        return reject(result.error.message);
      } else {
        const {
          temp_c: currentTemp,
          wind_kph: currentWindSpeed,
          humidity: currentHumidity,
          condition: currentCondition,
        } = response.body.current;
        currentCondition.icon = "https:" + currentCondition.icon;
        const { text: currentState, icon: currentIcon } = currentCondition;
        const {name:cityName,localtime}=response.body.location
        const currentDate=localtime.split(" ")[0]
        const currentWeatherData = {
          currentTemp,
          currentWindSpeed,
          currentHumidity,
          currentState,
          currentIcon,
          currentDate,
          cityName
        };
        const forecasts = [];
        const forecastResponseData = response.body.forecast.forecastday;
        forecastResponseData.forEach((forecast) => {
          const {
            avgtemp_c: forecastTemperature,
            maxwind_kph: forecastWindSpeed,
            avghumidity: forecastHumidity,
            condition: forecastCondition,
          } = forecast.day;
          const forecastDate=forecast.date
          forecastCondition.icon = "https:" + forecastCondition.icon;
          const { text: forecastState, icon: forecastIcon } = forecastCondition;
          
          let forecastWeatherData = {
            forecastTemperature,
            forecastWindSpeed,
            forecastHumidity,
            forecastState,
            forecastIcon,
            forecastDate,
            cityName
          };
          forecasts.push(forecastWeatherData);
        });
        return resolve({ currentWeatherData, forecasts });
      }
    });
  });
};

/*   forecast("Brussel")
  .then((data) => {
    console.log(data);
  })
  .catch((e) => {
    console.error(e);
  });    */

module.exports = forecast;

