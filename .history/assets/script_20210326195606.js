var apiKey = "665b0a1eacab2f0c5a8cae8e0d5d8de0"
var openWeatherApi = "http://api.openweathermap.org/data/2.5"

$("#search").on("click", function() {
    var cityName = $("#cityName").val()
    console.log(cityName)
    todaysWeather(cityName)
})

function todaysWeather(cityName) {
    console.log(cityName)
    //  `${var}` instead of + for concat
    fetch(`${openWeatherApi}/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
    //anonymous function
    .then(function(response) {
        return response.json()
    })
    //anonymous function
    .then(function(data) {
        console.log(data)
        var nameDate = $("#nameDate")
        // adding date in javascript
        nameDate.append(`${data.name} ${new Date().toLocaleDateString()}`)
        var temp = $("#temp")
        temp.append(`Temperature: ${data.main.temp.toString().slice(0,2)}°F`)
        var humidity = $("#humidity")
        humidity.append(`Humidity: ${data.main.humidity}%`)
        var windSpeed = $("#windSpeed")
        windSpeed.append(`Wind Speed: ${data.wind.speed.toString().slice(0,3)}`)
        var icon = data.weather[0].icon
        var description = data.weather[0].description
        $("#weatherIcon").attr("alt", description)
        $("#weatherIcon").attr("src", `./Assets/icons/${icon}@2x.png`)
        //lat and lon are already children of coord. object destructuring.
        var {lat, lon} = data.coord
        fetch(`${openWeatherApi}/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    })


}
// 5 day forcast
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
//http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}