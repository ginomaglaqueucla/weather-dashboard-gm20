// User Input
var userFormEl = $("#user-form");
var searchTermEl = $("#search-term");

// City Weather
var cityH1El = $("#city");
var iconImgEl = $("#weather-icon")
var tempPEl = $("#temp");
var humidPEl = $("#humid");
var windSpeedPEl = $("#wind-speed");
var uvIndexPEl = $("#uv");

// Current Date
var currentDay = moment().format("L");

// array of previous cities entered
var cityHistory = [];

// API query strings
var apiKey = "&appid=dda7c53451e44b1f7532fa3d4d41f760";
var apiQueryWeather = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiQueryUV = "https://api.openweathermap.org/data/2.5/uvi?";
var apiQueryForecast = "https://api.openweathermap.org/data/2.5/forecast?q="
var weatherUnit = "&units=imperial"

var searchTermFlag = true;

// Load/display seach history
var loadCityHistory = function() {
    cityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    if(!cityHistory){
        console.log("I'm empty");
        // this may be redundent
        cityHistory = [];
    }

    // remove previous children
    $(".history").empty();
    // display 
    for(var i = 1; i <= cityHistory.length; i++){
        var cityString = "<p class='border hist-city'><button class='row btn btn-light'>" + cityHistory[cityHistory.length-i] + "</button></p>";
        $(".history").append(cityString);
    }
}

// save searched city onto local storage
var saveCityHistory = function() {
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
}

// handles when submission
var formSubmitHandler = function(event) {
    event.preventDefault();
    searchTermFlag = true;
    // remove previous forecast
    for (var i = 0; i < 5; i++) {
        var indexID = i + 1;
        dayDivEl = $("#day"+indexID);
        dayDivEl.empty();
    }

    // grab user input
    var searchTerm = searchTermEl.val().trim();
    // reset field to blank
    searchTermEl.val("");

    // fetch weather/forecast with user input
    getWeather(searchTerm, searchTermFlag);
    getForecast(searchTerm);
}

// fetches weather data using user input or previously inputted city
var getWeather = function(searchTerm, searchTermFlag) {
    // format api url for Open Weather API
    var apiURL = apiQueryWeather + searchTerm + weatherUnit + apiKey;

    // make a get request to url
    fetch(apiURL)
        .then(function(response){
            // request was successful
            if (response.ok) {
                // console.log(response);
                response.json().then(function(data) {

                if(searchTermFlag) {
                    // push to array
                    cityHistory.push(searchTerm);
                    // save local storage
                    saveCityHistory();
                    // update and display search history
                    loadCityHistory();
                }
                // request UV Index
                getUVIndex(data);
                // display weather with acquired fetched data
                displayWeather(data, searchTerm);
                });
            // error handling
            } 
            else {
                location.reload();
                alert("Error: " + response.statusText);
            }
    })
        .catch(function(error) {
        alert("Unable to connect to Open Weather");
    });
}

// fetches future weather data using user input or previously inputted city
var getForecast = function(searchTerm) {
    // format api url for Open Weather API
    var apiURL = apiQueryForecast + searchTerm + weatherUnit + apiKey;

    // make a get request to url
    fetch(apiURL)
        .then(function(response){
            // request was successful
            if (response.ok) {
                // console.log(response);
                response.json().then(function(data) {
                // display forecast weather with aquired fetched data
                displayForecast(data);
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

// display weather with API weather data
var displayWeather = function (weatherData, city) {
    var weatherIconID = weatherData.weather[0].icon;
    var weatherTemp = weatherData.main.temp;
    var weatherHumidity = weatherData.main.humidity;
    var weatherWind = weatherData.wind.speed;
    $("#weather-div").addClass("border")
  

    var headerString = city + "  (" + currentDay + ")";
    var weatherIcon = getIcon(weatherIconID);

    cityH1El.text(headerString);
    iconImgEl.attr("src", weatherIcon);
    tempPEl.text("Temperature: "+weatherTemp +"°F");
    humidPEl.text("Humidity: " +weatherHumidity +"%");
    windSpeedPEl.text("Wind Speed: "+ weatherWind +"MPH");

}

// display forecast weather with API weather data
var displayForecast = function (forecastData) {
    $("#five-day").empty();
    $("#five-day").append("5-Day Forecast: ");
    // loop 5 times to display for 5 day forecast
    for(var i = 0; i < 5; i++) {
        console.log(i);
        var futureDay = moment().add(i+1, 'd').format("L");
        console.log(futureDay);
        var weatherIconID = forecastData.list[i].weather[0].icon;
        var weatherTemp = forecastData.list[i].main.temp;
        var weatherHumidity = forecastData.list[i].main.humidity;
        var weatherIcon = getIcon(weatherIconID);
        

        var indexID = i+1;
        var dayDivEl = $("#day"+indexID);
        var datePEl = document.createElement("p");
        var fIconImgEl = document.createElement("img");
        var fTempPEl = document.createElement("p");
        var fHumidPEl = document.createElement("p");

        datePEl.textContent = futureDay;
        
        fIconImgEl.setAttribute("src", weatherIcon);
        fTempPEl.textContent = "Temp: " + weatherTemp + "°F";
        fHumidPEl.textContent = "Humidity: " + weatherHumidity +"%";

        dayDivEl.append(datePEl);
        dayDivEl.append(fIconImgEl);
        dayDivEl.append(fTempPEl);
        dayDivEl.append(fHumidPEl);
        dayDivEl.addClass("bg-primary card");
    }

}

// display weather and forecast when user selects from search history
var displayWeatherFromHist = function(event) {
    event.preventDefault();
    searchTermFlag = false;
    // capture value of click
    var term = $(this)
    .text()
    .trim();
    // empty previous forecast
    for (var i = 0; i < 5; i++) {
        var indexID = i + 1;
        dayDivEl = $("#day"+indexID);
        dayDivEl.empty();
    }
    // request weather data with term
    getWeather(term);
    getForecast(term);


}

// fetches UV index and returns
var getUVIndex = function(weatherData) {
    var latString = "&lat="+ weatherData.coord.lat;
    var longString = "&lon="+ weatherData.coord.lon;
    var apiURL = apiQueryUV + apiKey + latString + longString;

    fetch(apiURL)
    .then(function(response){
        // request was successful
        if (response.ok) {
            // console.log(response);
            response.json().then(function(data) {
                // check UV conditions
                checkUVIndex(data);
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

// changes UV Index color depending on condtions
var checkUVIndex = function(weatherData){
    var uvColor;
    var uvIndex = weatherData.value;
    if(parseInt(uvIndex) <= 2) {
        uvColor = "bg-success";
    }
    else if (parseInt(uvIndex) <= 5) {
        uvColor = "bg-warning";
    } else {
        uvColor = "bg-danger";
    }
    $("#uv").empty();
    $("#uv").append("UV Index: <span class='"+uvColor+"'>"+uvIndex+"</span>");
}

// constructs image source for weather icon
var getIcon = function(iconID) {
    var urlPrefix = " http://openweathermap.org/img/wn/";
    var urlSuffix = "@2x.png";
    var url = urlPrefix + iconID + urlSuffix;
    return url;
}


loadCityHistory();
userFormEl.on("submit", formSubmitHandler);
$(".history").on("click", "button", displayWeatherFromHist);