const weatherForm = document.querySelector("form");
const currentWeatherCard = document.querySelector(".current-weather");
const forecastWeatherCards = document.querySelectorAll(".card");
const currentLocationButton=document.querySelector(".location-button")


currentLocationButton.addEventListener('click',()=>{
    try{
      navigator.geolocation.getCurrentPosition(async(position,error)=>{
        const {latitude:lat,longitude:lng}=position.coords;
        const response = await fetch(`/weather?coords=${lat},${lng}`);
        const data = await response.json();
        if (data.error) {
          return console.error(data.error);
        }
    
    
        const { currentWeatherData: current, forecasts } = data;
    
        currentWeatherCard.innerHTML = `<div class="details">
                               <h2>${current.cityName} (${data.currentWeatherData.currentDate})</h2>
                               <h4>Temp: ${current.currentTemp}°C</h4>
                               <h4>Wind: ${current.currentWindSpeed} kph</h4>
                               <h4>Humidity: ${current.currentHumidity}%</h4>
                             </div>
                             <div class="icon">
                             <img src=${current.currentIcon}>
                             <h4>${current.currentState}</h4>
                             </div>
                             `;
        forecastWeatherCards.forEach((card, index) => {
          const {
            forecastTemperature,
            forecastWindSpeed,
            forecastHumidity,
            forecastState,
            forecastIcon,
            forecastDate,
            cityName,
          } = forecasts[index+1];
          card.innerHTML = `<li class="card">
                  <h3>(${forecastDate})</h3>
                  <img src=${forecastIcon}>
                  <h4>Temp: ${forecastTemperature}°C</h4>
                  <h4>Wind: ${forecastWindSpeed} m/s</h4>
                  <h4>Humidity: ${forecastHumidity}%</h4>
                </li>`;
        });
      })
      
     
    }catch(e){
      console.error(e)
    }
})

weatherForm.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();
    const city = document.querySelector("input").value;
    const response = await fetch(`/weather?address=${city}`);
    const data = await response.json();
    if (data.error) {
      return console.error(data.error);
    }


    const { currentWeatherData: current, forecasts } = data;

    currentWeatherCard.innerHTML = `<div class="details">
                           <h2>${current.cityName} (${data.currentWeatherData.currentDate})</h2>
                           <h4>Temp: ${current.currentTemp}°C</h4>
                           <h4>Wind: ${current.currentWindSpeed} kph</h4>
                           <h4>Humidity: ${current.currentHumidity}%</h4>
                         </div>
                         <div class="icon">
                         <img src=${current.currentIcon}>
                         <h4>${current.currentState}</h4>
                         </div>
                         `;
    forecastWeatherCards.forEach((card, index) => {
      const {
        forecastTemperature,
        forecastWindSpeed,
        forecastHumidity,
        forecastState,
        forecastIcon,
        forecastDate,
        cityName,
      } = forecasts[index+1];
      card.innerHTML = `<li class="card">
              <h3>(${forecastDate})</h3>
              <img src=${forecastIcon}>
              <h4>Temp: ${forecastTemperature}°C</h4>
              <h4>Wind: ${forecastWindSpeed} m/s</h4>
              <h4>Humidity: ${forecastHumidity}%</h4>
            </li>`;
    });
  } catch (e) {
    console.error(e.message);
  }
});
