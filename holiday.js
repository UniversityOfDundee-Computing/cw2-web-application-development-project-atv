
document.addEventListener("DOMContentLoaded", function () {

    const inputdiv = document.getElementById("input-group-message");
    const start_input = document.getElementById("start_date");
    const start_input_color = start_input.style.borderColor;
    const end_input = document.getElementById("end_date");
    const end_input_color = end_input.style.borderColor;


    function createDateFromInput(input_date) {
        //creates a date object which we can later use in our api functions if needed
        //our dates are saved in this format DD/MM/YYYY


        start_input.style.borderColor = start_input_color;
        end_input.style.borderColor = end_input_color;

        const new_date = input_date.split('/');
        if (new_date.length != 3) {

            const errormessage = document.createElement("p");
            errormessage.innerHTML = `Invalid date format. Please use this format: DD/MM/YYYY`;
            errormessage.style.color = `red`;
            inputdiv.appendChild(errormessage);

            return false;
        }
        const day = parseInt(new_date[0], 10);
        const month = parseInt(new_date[1], 10);
        const year = parseInt(new_date[2], 10);

        if (isNaN(year) || year < 1000 || year > 9999) {

            const errormessage = document.createElement("p");
            errormessage.innerHTML = `Invalid year. Year must be between 1000 and 9999.`;
            errormessage.style.color = `red`;

            inputdiv.appendChild(errormessage);

            return false;
        }

        if (isNaN(month) || month < 1 || month > 12) {

            const errormessage = document.createElement("p");
            errormessage.innerHTML = `Invalid month. Month must be between 1 and 12.`;
            errormessage.style.color = `red`;

            inputdiv.appendChild(errormessage);

            return false;
        }

        const daysInMonth = new Date(year, month, 0).getDate(); //last day of the month
        if (isNaN(day) || day < 1 || day > daysInMonth) {

            const errormessage = document.createElement("p");
            errormessage.innerHTML = `Invalid day. Day must be between 1 and ${daysInMonth} for the given month.`;
            errormessage.style.color = `red`;

            inputdiv.appendChild(errormessage);

            return false;
        }

        // If all checks pass, return a valid Date object
        return new Date(year, month - 1, day);
    }

    function checkValidDate(input_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!input_date) {
            return false;
        }

        if (input_date < today) {
            inputdiv.innerHTML = "";
            const errormessage = document.createElement("p");
            errormessage.innerHTML = `Invalid date. Date must be today or in the future.`;
            errormessage.style.color = `red`;
            inputdiv.appendChild(errormessage);
            return false;
        }
        return input_date; // Return the valid Date object for further use
    }



    //gets the form id
    const form = document.getElementById("holidayform");
    const contentcard = document.getElementById("myholidaydetails");



    form.addEventListener("submit", (event) => {

        event.preventDefault();


        //fetches details from the form from the page

        const country = document.getElementById("country").value;
        const start_period = document.getElementById("start_date").value;
        const end_period = document.getElementById("end_date").value;

        inputdiv.innerHTML = "";

        const start_date = createDateFromInput(start_period);
        const end_date = createDateFromInput(end_period);

        if (start_date && end_date && checkValidDate(start_date) && checkValidDate(end_date)) {

            if (start_date > end_date) {
                const errormessage = document.createElement("p");
                errormessage.innerHTML = `Invalid input. End date must be after start date`;
                errormessage.style.color = `red`;
                inputdiv.appendChild(errormessage);
            }
            else {
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
            }

        }
        else {
            if (!start_date) {
                const start_input = document.getElementById("start_date");
                start_input.style.borderColor = `red`;

            }
            if (!end_date) {
                const end_input = document.getElementById("end_date");
                end_input.style.borderColor = `red`;
            }

        }
    });


});

