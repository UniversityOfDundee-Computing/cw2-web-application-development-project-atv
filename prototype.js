const CALENDARIFIC_API_KEY = 'JgT0e3x8XQAkl1oqId3SVOvp9x4FP1DI'; 
const GOOGLE_MAPS_API_KEY = 'AIzaSyDZ1urMlxvsRmKf3rRb5WUaO3d7-DAGAvQ';    //API KEYS
const TICKETMASTER_API_KEY = 'tnh4spfbmTePMS2kguuqlyQv0JvfHrIj';

document.getElementById('country-form').addEventListener('submit', async (e) => {       //Event listener for the button
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