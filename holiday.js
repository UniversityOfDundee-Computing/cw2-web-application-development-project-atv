
function createDateFromInput(input_date) {
    //creates a date object which we can later use in our api functions if needed
    //our dates are saved in this format DD/MM/YYYY

    new_date = input_date.split('/');
    day = new_date[0];
    month = new_date[1];
    year = new_date[2];

    const date = new Date(year, month - 1, day);
    return date;
}


document.addEventListener("DOMContentLoaded", function () {


    //gets the form id
    const form = document.getElementById("holidayform");
    const contentcard = document.getElementById("myholidaydetails");



    form.addEventListener("submit", (event) => {

        event.preventDefault();


        //fetches details from the form from the page

        const country = document.getElementById("country").value;
        const start_period = document.getElementById("start_date").value;
        const end_period = document.getElementById("end_date").value;

        const start_date = createDateFromInput(start_period);
        const end_date = createDateFromInput(end_period);


        //Check the form works and right details are passed

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

        const capital = "";

        var headers = new Headers();
        headers.append("X-CSCAPI-KEY", "QVNvWE0zNVNxN0pKd1FLM2owTWpGM21QaXRHZ1RwZ3h2TkN3Q29xUg==");

        var requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };

        fetch("https://api.countrystatecity.in/v1/countries", requestOptions)
            .then(response => response.json())
            .then(data => {

                if (data && Array.isArray(data)) {
                    const found = data.find(item => item.name.toLowerCase() === country.toLowerCase());

                    if (found) {
                        const country_code = found.iso2;

                        localStorage.setItem('country_code', country_code);

                        //store them so they are displayed in a window page
                        localStorage.setItem('country', country);

                        //passing the strings for dates
                        localStorage.setItem('start', start_period);
                        localStorage.setItem('end', end_period);

                        //passing the objects for dates
                        localStorage.setItem('start_date', start_date);
                        localStorage.setItem('end_date', end_date);

                        // Redirect to the window page
                        window.location.href = 'suggestions.html';

                    } else {
                        console.log('Country not found.');
                    }
                }

            })
            .catch(error => console.log('error', error));

    });
});

