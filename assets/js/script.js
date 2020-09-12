var userFormEl = document.querySelector("#user-form");
var searchTermEl = document.querySelector("#search-term");

// handles when submission
var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log("hello");

    var searchTerm = searchTermEl.value.trim();
    console.log(searchTerm);
}



userFormEl.addEventListener("submit", formSubmitHandler);