const searchButton = document.querySelector(".search-button");

const cityInput=document.querySelector(".city-input")


const getCityCoordinates=async ()=>{

try{
const cityName=cityInput.value.trim()

const google_api_key = config.GOOGLE_API_KEY

if(!cityName) return ;

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

const getWeatherForecast = async()=>{
    const {city:cityName,lat:latitude,lng:longitude}=await getCityCoordinates()

    const weatherStack_api_key = config.WEATHERSTACK_API_KEY


    const url = `http://api.weatherstack.com/forecast?access_key=${weatherStack_api_key}&query=${latitude},${longitude}&units=m`

    const result = await fetch(url)
    const data = await result.json()
    console.log(data)

}

searchButton.addEventListener('click',getWeatherForecast)