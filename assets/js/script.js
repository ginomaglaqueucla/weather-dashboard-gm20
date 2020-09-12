var userFormEl = document.querySelector("#user-form");
var searchTermEl = document.querySelector("#search-term");

// array of previous cities entered
var cityHistory = [];
var apiKey = "&appid=dda7c53451e44b1f7532fa3d4d41f760";
var apiQueryPre = "https://api.openweathermap.org/data/2.5/weather?q=";
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
    var apiURL = apiQueryPre + searchTerm + weatherUnit + apiKey;
    console.log(apiURL);

    // make a get request to url
    fetch(apiURL)
        .then(function(response){
            // request was successful
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                console.log(data.main.temp);
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


loadCityHistory();
userFormEl.addEventListener("submit", formSubmitHandler);