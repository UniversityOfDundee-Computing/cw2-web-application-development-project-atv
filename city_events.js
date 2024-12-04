window.addEventListener("DOMContentLoaded", async function () {

    //fetch data from previous page form and set variables we are going to use
    const city = localStorage.getItem('city');

    const content = document.getElementById("citytitle");
    content.innerHTML = `<h1> Events for ${city} </h1>`;



})