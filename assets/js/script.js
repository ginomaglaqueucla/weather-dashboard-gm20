var userFormEl = $("#user-form");
var searchTermEl = $("#search-term");

var cityH1El = $("#city");
var iconImgEl = $("#weather-icon")
var tempPEl = $("#temp");
var humidPEl = $("#humid");
var windSpeedPEl = $("#wind-speed");
var uvIndexPEl = $("#uv");

// var day1DivEl = $("#day1");
// var day2DivEl = $("#day2");
// var day3DivEl = $("#day3");
// var day4DivEl = $("#day4");
// var day5DivEl = $("#day5");


var currentDay = moment().format("L");


// array of previous cities entered
var cityHistory = [];
var apiKey = "&appid=dda7c53451e44b1f7532fa3d4d41f760";
var apiQueryWeather = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiQueryUV = "https://api.openweathermap.org/data/2.5/uvi?";
var apiQueryForecast = "https://api.openweathermap.org/data/2.5/forecast?q="
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
    var searchTerm = searchTermEl.val().trim();
    // push to array
    cityHistory.push(searchTerm);
    // console.log(cityHistory);
    // save local storage
    saveCityHistory();

    getWeather(searchTerm);
    getForecast(searchTerm);
}

var getWeather = function(searchTerm) {
    // format api url
    var apiURL = apiQueryWeather + searchTerm + weatherUnit + apiKey;
    // console.log(apiURL);

    // make a get request to url
    fetch(apiURL)
        .then(function(response){
            // request was successful
            if (response.ok) {
                // console.log(response);
                response.json().then(function(data) {
                console.log(data);
                getUVIndex(data);
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

var getForecast = function(searchTerm) {
    console.log("being run");
    // format api url
    var apiURL = apiQueryForecast + searchTerm + weatherUnit + apiKey;
    // console.log(apiURL);

    // make a get request to url
    fetch(apiURL)
        .then(function(response){
            // request was successful
            if (response.ok) {
                // console.log(response);
                response.json().then(function(data) {
                console.log(data);
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


var displayWeather = function (weatherData, city) {
    var weatherIconID = weatherData.weather[0].icon;
    var weatherTemp = weatherData.main.temp;
    var weatherHumidity = weatherData.main.humidity;
    var weatherWind = weatherData.wind.speed;
  

    var headerString = city + "  (" + currentDay + ")";
    var weatherIcon = getIcon(weatherIconID);

    cityH1El.text(headerString);
    iconImgEl.attr("src", weatherIcon);
    tempPEl.text("Temperature: "+weatherTemp +"°F");
    humidPEl.text("Humidity: " +weatherHumidity +"%");
    windSpeedPEl.text("Wind Speed: "+ weatherWind +"MPH");

}

var displayForecast = function (forecastData) {
    console.log(forecastData.list.length);
    for(var i = 0; i < 5; i++) {
        console.log(i);
        var futureDay = moment().add(i+1, 'd').format("L");
        console.log(futureDay);
        var weatherIconID = forecastData.list[i].weather[0].icon;
        var weatherTemp = forecastData.list[i].main.temp;
        var weatherHumidity = forecastData.list[i].main.humidity;
        var weatherIcon = getIcon(weatherIconID);
        
        // var dayDivEl = document.createElement("div");
        var indexID = i+1;
        var dayDivEl = $("#day"+indexID);
        var datePEl = document.createElement("p");
        var fIconImgEl = document.createElement("img");
        var fTempPEl = document.createElement("p");
        var fHumidPEl = document.createElement("p");

        datePEl.textContent = futureDay;
        
        fIconImgEl.setAttribute("src", weatherIcon);
        fTempPEl.textContent = weatherTemp;
        fHumidPEl.textContent = weatherHumidity;

        dayDivEl.append(datePEl);
        dayDivEl.append(fIconImgEl);
        dayDivEl.append(fTempPEl);
        dayDivEl.append(fHumidPEl);
    }


}

// fetches UV index and returns
var getUVIndex = function(weatherData) {
    //http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
    var latString = "&lat="+ weatherData.coord.lon;
    var longString = "&lon="+ weatherData.coord.lat;
    var apiURL = apiQueryUV + apiKey + latString + longString;
    fetch(apiURL)
    .then(function(response){
        // request was successful
        if (response.ok) {
            // console.log(response);
            response.json().then(function(data) {
            uvIndexPEl.text("UV Index: " + data.value);
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


var getIcon = function(iconID) {
    var urlPrefix = " http://openweathermap.org/img/wn/";
    var urlSuffix = ".png";
    var url = urlPrefix + iconID + urlSuffix;
    return url;
}


loadCityHistory();

userFormEl.on("submit", formSubmitHandler);