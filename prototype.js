//API KEYS
const CALENDARIFIC_API_KEY = 'JgT0e3x8XQAkl1oqId3SVOvp9x4FP1DI'; 
const GOOGLE_MAPS_API_KEY = 'AIzaSyDZ1urMlxvsRmKf3rRb5WUaO3d7-DAGAvQ';    
const TICKETMASTER_API_KEY = 'tnh4spfbmTePMS2kguuqlyQv0JvfHrIj';

//Event listener for the button
document.getElementById('country-form').addEventListener('submit', async (e) => {       
    e.preventDefault();
    const country = document.getElementById('country').value.trim().toUpperCase();
    if (!country) return alert('Please enter a valid country code.');
  
    const holidays = await getHolidays(country);
    if (holidays.length === 0) {
      alert('No holidays found for this country.');
      return;
    }
  
    displayHolidays(holidays);
  });

  // Fetch holidays from Calendarific API
  async function getHolidays(country) {
    const url = `https://calendarific.com/api/v2/holidays?&api_key=${CALENDARIFIC_API_KEY}&country=${country}&year=2025`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.response.holidays || [];
    } catch (error) {
      console.error('Error fetching holidays:', error);
      return [];
    }
  }

  // Fetch top 3 cities using Google Maps API, 
  async function getCities(countryName) {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=cities+in+${encodeURIComponent(countryName)}&key=${GOOGLE_MAPS_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results.slice(0, 3).map((result) => result.name);
      } else {
        console.log('No cities found for this country.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }

  // Fetch events for a specific city and date
  async function getEventsForCityAndDate(city, date) {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&keyword=${encodeURIComponent(city)}&startDateTime=${date}T00:00:00Z&endDateTime=${date}T23:59:59Z`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data._embedded?.events || [];
    } catch (error) {
      console.error(`Error fetching events for city ${city} and date ${date}:`, error);
      return [];
    }
  }