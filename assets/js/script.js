var userFormEl = document.querySelector("#user-form");
var searchTermEl = document.querySelector("#search-term");

var cityH1El = document.querySelector("#city");
var tempPEl = document.querySelector("#temp");
var humidPEl = document.querySelector("#humid");
var windSpeedPEl = document.querySelector("#wind-speed");
var uvIndexPEl = document.querySelector("#uv");


var currentDay = moment().format("L");

// array of previous cities entered
var cityHistory = [];
var apiKey = "&appid=dda7c53451e44b1f7532fa3d4d41f760";
var apiQueryWeather = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiQueryUV = "https://api.openweathermap.org/data/2.5/uvi?";
var weatherUnit = "&units=imperial"

var loadCityHistory = function() {
    cityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    if(!cityHistory){
        console.log("I'm empty");
        // this may be redundent
        cityHistory = [];
    }
}

var saveCityHistory = function() {
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
}

// handles when submission
var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log("hello");

    // grab user input
    var searchTerm = searchTermEl.value.trim();
    // push to array
    cityHistory.push(searchTerm);
    console.log(cityHistory);
    // save local storage
    saveCityHistory();

    getWeather(searchTerm);
}

var getWeather = function(searchTerm) {
    // format api url
    var apiURL = apiQueryWeather + searchTerm + weatherUnit + apiKey;
    console.log(apiURL);

    // make a get request to url
    fetch(apiURL)
        .then(function(response){
            // request was successful
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                console.log(data);
                displayWeather(data, searchTerm);
                });
            // error handling
            } 
            else {
                alert("Error: " + response.statusText);
            }
    })
        .catch(function(error) {
        alert("Unable to connect to Open Weather");
    });
}

var displayWeather = function (weatherData, city) {
    var weatherIcon = weatherData.weather.icon;
    var weatherTemp = weatherData.main.temp;
    var weatherHumidity = weatherData.main.humidity;
    var weatherWind = weatherData.wind.speed;
    var cityLatLong = [weatherData.coord.lat, weatherData.coord.lon];
    var weatherUV = getUVIndex(cityLatLong);
    console.log(weatherIcon);
    console.log(weatherTemp);
    console.log(weatherHumidity);
    console.log(weatherWind);
    console.log(cityLatLong);
    console.log(weatherUV);

    var headerString = city + "  (" + currentDay + ")";
    cityH1El.textContent = headerString;
    tempPEl.textContent = weatherTemp;
    humidPEl.textContent = weatherHumidity;
    windSpeedPEl.textContent = weatherWind;
    uvIndexPEl.textContent = weatherUV;

}

// fetches UV index and returns
var getUVIndex = function(cityLatLong) {
    //http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
    var latString = "&lat="+ cityLatLong[0];
    var longString = "&lon="+ cityLatLong[1];
    var apiURL = apiQueryUV + apiKey + latString + longString;
    fetch(apiURL)
    .then(function(response){
        // request was successful
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
            console.log(data.value);
            return data.value;
            });
        // error handling
        } 
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
    alert("Unable to connect to Open Weather");
    });
    
}


loadCityHistory();
userFormEl.addEventListener("submit", formSubmitHandler);