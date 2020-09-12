var userFormEl = document.querySelector("#user-form");
var searchTermEl = document.querySelector("#search-term");

// array of previous cities entered
cityHistory = [];

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


}


loadCityHistory();
userFormEl.addEventListener("submit", formSubmitHandler);