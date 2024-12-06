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



})