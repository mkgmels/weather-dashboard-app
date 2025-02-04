const request = require('request')

const config = require("./config")

const getCityCoordinates=(city)=>{
    return new Promise((resolve,reject)=>{
        const google_api_key = config.GOOGLE_API_KEY
    
        if(!city) return reject("City is required!");
        
        const url=`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${google_api_key}`
        
        request({
            url,
            json:true
        },(error,response)=>{
            if (error){
                return reject("Unable to connect to the geocode api")
            }
            const {results,error_message}=response.body
            if (error_message){
                return reject(error_message)
            }
            else if (results.length===0){
                return reject("There is no matching result for the provided city")
            }
            else{
    
                const {lat,lng}=results[0].geometry.location
        
                const addressComponents=results[0].address_components;
                
                let city=""
                
                for (let i=0;i<addressComponents.length;i++){
                
                    const comp=addressComponents[i]
                
                    if (comp.types[0]==='locality'){
                
                        city=comp.long_name
                
            }
        }
        const geoData={lat,lng,city}
        resolve(geoData)
    
    }
    })
    })
}


module.exports=getCityCoordinates