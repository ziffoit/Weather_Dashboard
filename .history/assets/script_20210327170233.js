var apiKey = "665b0a1eacab2f0c5a8cae8e0d5d8de0"
var openWeatherApi = "http://api.openweathermap.org/data/2.5"
 
$("#search").on("click", function() {
    var cityName = $("#cityName").val()
    todaysWeather(cityName)
    fiveDayForcast(cityName)
})

function apiCall(endpoint) {
    return fetch(`${openWeatherApi}${endpoint}`)
        .then(function(response) {
            return response.json()
        })
}

function todaysWeather(cityName) {
    //  `${var}` instead of + for concat. string interpolation.
    apiCall(`/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
    //anonymous function
    .then(function(data) {
        console.log(data)
        var nameDate = $("#nameDate")
        // adding date in javascript
        nameDate.text(`${data.name} ${new Date().toLocaleDateString()}`)

        var {description, icon} = data.weather[0]
        $("#weatherIcon").attr("alt", description)
        $("#weatherIcon").attr("src", `./Assets/icons/${icon}@2x.png`)

        // math.round instead of .slice to avoid temps more than 2 characters long being cut off
        var temp = Math.round(data.main.temp)
        $("#temp").text(`Temperature: ${temp}°F`)

        $("#humidity").text(`Humidity: ${data.main.humidity}%`)

        var windSpeed = Math.round(data.wind.speed)
        $("#windSpeed").text(`Wind Speed: ${windSpeed}`)

        
        //lat and lon are already children of coord. object destructuring.
        var {lat, lon} = data.coord
        apiCall(`/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(function(uvData) {
            var uvIndex = Math.round(uvData.value)
            $("#uv").text(`${uvIndex}`)
            if (uvIndex < 3) {
                $("#uv").css("background-color", "green")
            } else if (uvIndex < 8) {
                $("#uv").css("background-color", "orange")  
            } else {
                $("#uv").css("background-color", "red")  
            }
        })
    })
}

function fiveDayForcast(cityName) {
    apiCall(`/forecast?q=${cityName}&appid=${apiKey}&units=imperial`)
    .then (function(fiveDay) {
        console.log(fiveDay)
        var nextDay = [4, 12, 20, 28, 36]
        nextDay.forEach(function(i) {
            var {description, icon} = fiveDay.list[i].weather[i]
            $("icon").attr("alt", description)
            $("icon").attr("src", `./Assets/icons/${icon}@2x.png`)

        })
    })
}