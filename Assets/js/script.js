// Variables 
var searchButton = $("#city-search");

var apiKey = "603e7c817d7a1ac25b9f13f2bc21b35f";

// Forloop for persisting the data onto HMTL page
for (var i = 0; i < localStorage.length; i++) {

    var city = localStorage.getItem(i);
    // console.log(localStorage.getItem("City"));
    var cityName = $(".list-group").addClass("list-group-item");

    cityName.append("<li>" + city + "</li>");
}
// Key count for local storage 
var keyCount = 0;
// Search button click event
searchButton.submit(function (event)  {
	event.preventDefault()

    var searchInput = $(".city-input").val();
	console.log("city",searchInput)
    // Variable for current weather working 
    var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
    // Variable for 5 day forecast working
    var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";


    if (searchInput == "") {
        console.log(searchInput);
    } else {
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function (response) {
            // list-group append an li to it with just set text
             console.log(response.name);
            var cityName = $("<ul>").addClass("list-group");
            cityName.append("<li>" + response.name + "</li>");
            // Local storage
            var local = localStorage.setItem(keyCount, response.name);
            keyCount = keyCount + 1;

            // Start Current Weather append 
            var currentCard = $("<div>").addClass("card-body");
         
            var currentName = $("<p>");
            // .addClass("card-text");
			
            // Adjust Date 
            var timeUTC = new Date(response.dt * 1000);
            currentName.text(response.name + " " + timeUTC.toLocaleDateString("en-US"));
            currentCard.append(currentName);
            currentCard.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
            // Add Temp 
            // .addClass("card-text");
			
            var currentTemp =$("<p>");
            currentTemp.text( "Temperature: " + response.main.temp );
			currentCard.append(currentTemp)
            // Add Humidity
            currentCard.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");
            // // Add Wind Speed: 
            currentCard.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");
            // UV Index URL
            var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=603e7c817d7a1ac25b9f13f2bc21b35f&lat=${response.coord.lat}&lon=${response.coord.lon}`;
			
            // UV Index
            $.ajax({
				url: urlUV,
                method: "GET"
            }).then(function (response) {
				
				var currentUV = $("<p>" + "UV Index: " + response.value + "</p>").addClass("card-text");
                currentUV.addClass("UV");
                currentCard.append(currentUV)
                // currentUV.append("UV Index: " + response.value);
            });
			$("#current").html(currentCard)

        });

        // Start call for 5-day forecast 
        $.ajax({
            url: urlFiveDay,
            method: "GET"
        }).then(function (response) {
			console.log(response);
            // Array for 5-days 
            var day = [0, 8, 16, 24, 32];
            var fiveDayCard = $(".fiveDayCard").addClass("card-body");
            var fiveDayDiv = $(".fiveDayOne").addClass("card-text");
            fiveDayDiv.empty();
            // For each for 5 days
            day.forEach(function (i) {
                var FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
                FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US");

                fiveDayDiv.append("<div class=fiveDayColor>" + "<p>" + FiveDayTimeUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");


            })

        });
    }
});
