var apiKey = "665b0a1eacab2f0c5a8cae8e0d5d8de0"

$("#search").on("click", function() {
    var cityName = $("#cityName").val()
    console.log(cityName)
    todaysWeather(cityName)
})

function todaysWeather(cityName) {
    console.log(cityName)
    //  `${var}` instead of + for concat
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        console.log(data)
    })
}