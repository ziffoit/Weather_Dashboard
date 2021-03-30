var apiKey = "665b0a1eacab2f0c5a8cae8e0d5d8de0"
var openWeatherApi = "http://api.openweathermap.org/data/2.5"

function requestWeather(cityName) {
    todaysWeather(cityName)
    fiveDayForecast(cityName)
}

var searchedCities = JSON.parse(localStorage.getItem("city")) || []
for (let i = 0; i < searchedCities.length; i++) {
    const currentCity = searchedCities[i];
    var savedCity = $("<button></button>").text(currentCity)
    savedCity.on("click", function() { 
        requestWeather(currentCity)
    })
    
    $("#searchHistory").append(savedCity)

}

$("#search").on("click", function() {
    var cityName = $("#cityName").val()
    if (cityName) { 
        requestWeather(cityName)

        searchedCities.push(cityName)
        localStorage.setItem("city", JSON.stringify(searchedCities))
    }
})

function apiCall(endpoint) {
    return fetch(`${openWeatherApi}${endpoint}`)
        .then(function(response) {
            return response.json()
        }).catch(function(error) {
            console.error(error)
            throw error
        })
}

function setWeatherIcon(idSelector, description, icon) {
    $(idSelector).attr("alt", description)
    $(idSelector).attr("src", `./Assets/icons/${icon}@2x.png`)
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
        setWeatherIcon("#weatherIcon", description, icon)

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

function fiveDayForecast(cityName) {
    apiCall(`/forecast?q=${cityName}&appid=${apiKey}&units=imperial`)
    .then (function(fiveDay) {
        console.log("--",fiveDay)
        var nextDay = [4, 12, 20, 28, 36]
        nextDay.forEach(function(currentValue, j) {
            console.log(fiveDay.list[currentValue].weather[0])

            var {description, icon} = fiveDay.list[currentValue].weather[0]
            setWeatherIcon(`#icon${j+1}`, description, icon)

            // dt_txt: "2021-03-30 15:00:00" datetime text
            let [_, month, day] = fiveDay.list[currentValue].dt_txt.split(" ")[0].split("-")
            $(`#date${j+1}`).text(`${month}/${day}`)

            // make a function
            var temp = Math.round(fiveDay.list[currentValue].main.temp)
            $(`#temp${j+1}`).text(`Temp: ${temp}°F`)

            // make a function
            $(`#humidity${j+1}`).text(`Humidity: ${fiveDay.list[currentValue].main.humidity}%`)
        })
    })
}

