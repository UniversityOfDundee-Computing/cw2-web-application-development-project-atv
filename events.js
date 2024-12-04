window.addEventListener("DOMContentLoaded", async function () {

    //fetch data from previous page form and set variables we are going to use
    const country = localStorage.getItem('country');
    const start_date = localStorage.getItem('start_date');
    const end_date = localStorage.getItem('end_date');
    const city = localStorage.getItem('city')                   // once fully implemented look at city or whatever it gets called


    // use data we have to populate our page with info..
    const contentcard = document.getElementById("myholidaydets");
    contentcard.innerHTML = "";

    const content = document.createElement('div');


    const message = document.createElement('h2');
    message.textContent = `We are going to...`;

    const name = document.createElement('h5');
    name.textContent = `City: ${city}`;

    const period = document.createElement('p');
    period.textContent = `Start: ${start_date} End: ${end_date}`;


    content.appendChild(message);
    content.appendChild(name);
    content.appendChild(period);

    contentcard.appendChild(content);


  
        const ticketmasterApiKey = "tnh4spfbmTePMS2kguuqlyQv0JvfHrIj";
        const ticketmasterUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ticketmasterApiKey}`;
    
        const eventCards = document.querySelectorAll("#eventCards .card");
        const eventInfoCard = document.getElementById("event_info_card");
        const mapEvent = document.getElementById("map_event");
    
        let map;
        let infoWindow;
    
        // Initialize Google Map
        function initMap() {
            map = new google.maps.Map(mapEvent, {
                center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
                zoom: 4,
            });
            infoWindow = new google.maps.InfoWindow();
        }
    
        window.initMap = initMap; // Expose initMap to the global scope
    
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
                    displayEventOnMap(event);
                    showEventDetails(event);
                });
            });
        }
    
        // Display event location on the map
        function displayEventOnMap(event) {
            const venue = event._embedded.venues[0];
            const lat = venue.location.latitude;
            const lng = venue.location.longitude;
    
            const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
    
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
    
        // Show detailed event information in the new info card
        function showEventDetails(event) {
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
        }
    
        fetchEvents();
});
    
