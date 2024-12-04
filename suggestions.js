window.addEventListener("DOMContentLoaded", async function () {

    //fetch data from previous page form and set variables we are going to use
    const country = localStorage.getItem('country');
    const start_date = localStorage.getItem('start_date');
    const end_date = localStorage.getItem('end_date');


    // use data we have to populate our page with info..
    const contentcard = document.getElementById("myholidaydets");
    contentcard.innerHTML = "";

    const content = document.createElement('div');


    const message = document.createElement('h2');
    message.textContent = `We are going to...`;

    const name = document.createElement('h5');
    name.textContent = `Country: ${country}`;

    const period = document.createElement('p');
    period.textContent = `Start: ${start_date} End: ${end_date}`;


    content.appendChild(message);
    content.appendChild(name);
    content.appendChild(period);

    contentcard.appendChild(content);

});
