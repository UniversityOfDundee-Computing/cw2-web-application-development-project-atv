window.addEventListener("DOMContentLoaded", async function () {

    //fetch data from previous page form and set variables we are going to use
    const country = localStorage.getItem('country'); //country name
    const country_code = localStorage.getItem('country_code'); //country 2 letter code

    const start_date = localStorage.getItem('start_date'); //object start date
    const end_date = localStorage.getItem('end_date'); //object end date

    const start = localStorage.getItem('start'); //start date as a string DD/MM/YYY
    const end = localStorage.getItem('end'); //end date as a string DD/MM/YYYY

    const city = localStorage.getItem('city'); //city name

    const content = document.getElementById("citytitle");
    content.innerHTML = `<h1> Events for ${city} </h1><div id="weather"></div>`;    // adds name of city and weather to html

    var new_start = start.split("/").reverse().join("-");   //changing date formats
    var new_end = end.split("/").reverse().join("-");

    let currentPage = 0; // To keep track of pagination from ticketmaster
    const eventsPerPage = 3; // Number of events per page

    const ticketmasterApiKey = "tnh4spfbmTePMS2kguuqlyQv0JvfHrIj";
    const ticketmasterUrl = (page) => `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ticketmasterApiKey}&city=${city}&startDateTime=20${new_start}T00:00:00Z&endDateTime=${new_end}T23:59:59Z&size=${eventsPerPage}&page=${page}`;

    const eventCards = document.querySelectorAll("#eventCards .card");
    const eventInfoCard = document.getElementById("event_info_card");
    const mapEvent = document.getElementById("map_event");

    let map;
    let infoWindow; //google maps 

    // weather api parts
    const accuweatherApiKey = "Xok1b2Zov1mqI3sH5vgZQCwPJrH99ksk";
    const accuweatherLocationUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${accuweatherApiKey}&q=${city}`;
    const accuweatherCurrentConditionsUrl = (locationKey) => `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${accuweatherApiKey}`;




    // Initialize Google Map when map becomes visible
    function initializeMap() {
        if (!map) {
            map = new google.maps.Map(mapEvent, {
                center: { lat: 39.8283, lng: -98.5795 }, // Center of USA, was the default
                zoom: 4,
            });
            infoWindow = new google.maps.InfoWindow();
        } else {
            google.maps.event.trigger(map, "resize"); // Ensure map resizes correctly
        }
    }

    // Fetch events from Ticketmaster API
    async function fetchEvents(page = 0) {
        try {
            const response = await fetch(ticketmasterUrl(page));
            const data = await response.json();
            const events = data._embedded?.events || [];
            if (events.length > 0) {
                populateEventCards(events);
            } else {
                console.log("No more events available.");
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }

    // Populate the top 3 cards with events
    function populateEventCards(events) {
        eventCards.forEach((card, index) => {
            if (events[index]) {
                const event = events[index];
                const img = card.querySelector("img");
                const title = card.querySelector(".card-title");
                const description = card.querySelector(".card-text");
                const button = card.querySelector("a");

                img.src = event.images[0].url;
                img.alt = event.name;
                title.textContent = event.name;
                description.textContent = event.dates.start.localDate || "No date available";
                button.href = "#";
                button.onclick = (e) => {
                    e.preventDefault();
                    displayEventDetails(event);
                };
                card.style.display = "block";
            } else {
                card.style.display = "none"; // Hide unused cards
            }
        });
    }

    // Display event details and map
    function displayEventDetails(event) {
        // Show the hidden sections
        eventInfoCard.style.display = "block";
        mapEvent.style.display = "block";

        // Initialize or resize map
        initializeMap();

        // Populate event details
        const venue = event._embedded.venues[0];
        const img = eventInfoCard.querySelector("img");
        const title = eventInfoCard.querySelector(".card-title");
        const description = eventInfoCard.querySelector(".card-text");
        const button = eventInfoCard.querySelector("a");

        img.src = event.images[0].url;
        img.alt = event.name;
        title.textContent = event.name;
        description.innerHTML = `
            <p><strong>Date:</strong> ${event.dates.start.localDate}</p>
            <p><strong>Venue:</strong> ${venue.name}</p>
            <p><strong>Address:</strong> ${venue.address.line1}, ${venue.city.name}</p>
        `;
        button.href = event.url; // Ticketmaster event link
        button.textContent = "Tickets";

        // Update map
        const lat = parseFloat(venue.location.latitude);
        const lng = parseFloat(venue.location.longitude);
        const position = { lat, lng };

        map.setCenter(position);
        map.setZoom(12);

        const marker = new google.maps.Marker({
            position,
            map,
            title: event.name,
        });

        infoWindow.setContent(`<h5>${event.name}</h5><p>${venue.address.line1}, ${venue.city.name}</p>`);
        infoWindow.open(map, marker);
    }

    //  button for next 3 events
    const rotateButton = document.getElementById("rotate");
    rotateButton.addEventListener("click", () => {
        currentPage += 1;
        fetchEvents(currentPage);
    });



    // Display city name
    content.innerHTML = `<h3 class="m-0" style="font-weight: 200"> Events in ${city} </h3>`;

    // Fetch weather data
    async function fetchWeather() {
        try {
            // Get location key
            const locationResponse = await fetch(accuweatherLocationUrl);
            const locationData = await locationResponse.json();
            if (locationData.length === 0) throw new Error("City not found in AccuWeather");

            const locationKey = locationData[0].Key;

            // Get current conditions
            const weatherResponse = await fetch(accuweatherCurrentConditionsUrl(locationKey));
            const weatherData = await weatherResponse.json();
            if (weatherData.length === 0) throw new Error("Weather data not found");

            const weather = weatherData[0];

            // Update UI with weather info
            const weatherDiv = document.getElementById("weather");
            weatherDiv.innerHTML = `
                <p><strong>Current Weather:</strong> ${weather.WeatherText}</p>
                <p><strong>Current Temperature:</strong> ${weather.Temperature.Metric.Value}°${weather.Temperature.Metric.Unit}</p>
            `;
        } catch (error) {
            console.error("Error fetching weather:", error);
            const weatherDiv = document.getElementById("weather");
            weatherDiv.innerHTML = `<h4 class="m-0" style="font-weight: 100;">Weather information is not available</h4>`;
        }
    }

    // Call fetchWeather to get weather info
    fetchWeather();


    fetchEvents();




});