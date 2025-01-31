const searchButton = document.querySelector(".search-button");

const cityInput=document.querySelector(".city-input")

const currentWeatherCard=document.querySelector(".current-weather")

const forecastWeatherCards=document.querySelectorAll(".weather-cards li")

const getCityCoordinates=async ()=>{

    try{
    const cityName=cityInput.value.trim()
    
    
    const google_api_key = config.GOOGLE_API_KEY
    
    if(!cityName) return;
    
    const url=`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${google_api_key}`
    
    const result=await fetch(url)
    
    const data= await result.json()
    
    if(data.results.length===0){
        throw new Error(`Please provide a valid address!`)
    }
    
    const {lat,lng}=data.results[0].geometry.location
    
    const addressComponents=data.results[0].address_components;
    
    
    for (let i=0;i<addressComponents.length;i++){
    
        const comp=addressComponents[i]
    
        if (comp.types[0]==='locality'){
    
            const city=comp.long_name
    
            return {city,lat,lng}
    
        } 
    
    }
    }catch(e){
        alert(`Unable to get the coordinates due to the following error: ${e.message}`)
    }
    }
const fetchWeatherData = async(url,state)=>{
    const result = await fetch(url)
    const data = await result.json()
    const date = data.location.localtime.split(" ")[0]
    const icons=data.current.weather_icons
    const iconImage=icons[0]

    if(state==='current'){
        const {temperature:temperature,wind_speed:windspeed,humidity:humidity,weather_descriptions:descriptions,weather_icons:weatherIcons}=data.current
        const weatherDescription = descriptions[0]
        return {temperature,windspeed,humidity,weatherDescription,iconImage,date}


    }
    if (state==='forecast'){
        const {temperature:temperature,wind_speed:windspeed,humidity:humidity,weather_icons:weatherIcons}=data.current
        return {temperature,windspeed,humidity,iconImage,date}

    }

}

const getWeatherData = async(state)=>{
    const geoData=await getCityCoordinates()

    const {lat:latitude,lng:longitude}=geoData

    const weatherStack_api_key = config.WEATHERSTACK_API_KEY

    if (state==='current'){
        const url = `http://api.weatherstack.com/current?access_key=${weatherStack_api_key}&query=${latitude},${longitude}&units=m`
        const weatherData= await fetchWeatherData(url,state)
        await updateWeatherCard(state,weatherData)
    }
    if (state==='forecast'){
        const url = `http://api.weatherstack.com/forecast?access_key=${weatherStack_api_key}&query=${latitude},${longitude}&units=m`
        const weatherData= await fetchWeatherData(url,state)
        await updateWeatherCard(state,weatherData)
    }
}

const updateWeatherCard=async(state,weatherData)=>{
    const {city} = await getCityCoordinates()

    if (state==='current'){
        const {temperature,windspeed,humidity,weatherDescription,iconImage,date} = weatherData

        currentWeatherCard.innerHTML=`
        <div class="details">
            <h2>${city} (${date})</h2>
            <h4>Temperature: ${temperature}°C</h4>
            <h4>Wind: ${windspeed} m/s</h4>
            <h4>Humidity: ${humidity}%</h4>
        </div>
        <div class="icon">
            <img src=${iconImage}>
            <h4>${weatherDescription}</h4>
        </div>
    </div>`
    }
    if (state==='forecast'){
        const {temperature,windspeed,humidity,iconImage,date}= weatherData

        forecastWeatherCards.forEach((card)=>{
            card.innerHTML=`<li class="card">
                            <h3>${date}</h3>
                            <img src=${iconImage} alt="weather-icon">
                            <h4>Temperature: ${temperature}°C</h4>
                            <h4>Wind: ${windspeed} m/s</h4>
                            <h4>Humidity: ${humidity}%</h4>
                        </li>`
        })
    }

    
}


searchButton.addEventListener('click',async ()=>{
    
     await getWeatherData('current')
     await getWeatherData('forecast')

})
    
    

   
