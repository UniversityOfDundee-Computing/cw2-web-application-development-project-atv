window.addEventListener("DOMContentLoaded", async function () {

    //fetch data from previous page form and set variables we are going to use
    const country = localStorage.getItem('country'); // country name
    const country_code = localStorage.getItem('country_code'); // code of country - UK/ FR

    const start_date = localStorage.getItem('start_date'); //start date as an object
    const end_date = localStorage.getItem('end_date'); //end date as an object

    const start = localStorage.getItem('start'); //start date as a string DD/MM/YYYY
    const end = localStorage.getItem('end'); //end date as a string DD/MM/YYYY

    const city = localStorage.getItem('city'); //city name

    const content = document.getElementById("citytitle");
    content.innerHTML = `<h1> Events for ${city} </h1>`;

////// added from other events page

    const ticketmasterApiKey = "tnh4spfbmTePMS2kguuqlyQv0JvfHrIj";
    const ticketmasterUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ticketmasterApiKey}`;

    const eventCards = document.querySelectorAll("#eventCards .card");
    const eventInfoCard = document.getElementById("event_info_card");
    const mapEvent = document.getElementById("map_event");

    let map;
    let infoWindow;

    // Initialize Google Map when map becomes visible
    function initializeMap() {
        if (!map) {
            map = new google.maps.Map(mapEvent, {
                center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
                zoom: 4,
            });
            infoWindow = new google.maps.InfoWindow();
        } else {
            google.maps.event.trigger(map, "resize"); // Ensure map resizes correctly
        }
    }

    // Fetch events from Ticketmaster API
    async function fetchEvents() {
        try {
            const response = await fetch(ticketmasterUrl);
            const data = await response.json();
            const events = data._embedded.events.slice(0, 3); // Take only the first 3 events
            populateEventCards(events);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }

    // Populate the top 3 cards with events
    function populateEventCards(events) {
        events.forEach((event, index) => {
            const card = eventCards[index];
            const img = card.querySelector("img");
            const title = card.querySelector(".card-title");
            const description = card.querySelector(".card-text");
            const button = card.querySelector("a");

            img.src = event.images[0].url;
            img.alt = event.name;
            title.textContent = event.name;
            description.textContent = event.dates.start.localDate || "No date available";
            button.href = "#";
            button.addEventListener("click", (e) => {
                e.preventDefault();
                displayEventDetails(event);
            });
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

    fetchEvents();


})