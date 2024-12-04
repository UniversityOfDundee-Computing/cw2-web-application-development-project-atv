window.addEventListener("DOMContentLoaded", async function () {

    //fetch data from previous page form and set variables we are going to use
    const country = localStorage.getItem('country');
    const start_date = localStorage.getItem('start_date');
    const end_date = localStorage.getItem('end_date');
    const start = localStorage.getItem('start');
    const end = localStorage.getItem('end');


    const country_details = document.getElementById("countrybar");
    country_details.textContent = `${country}`;

    const start_details = document.getElementById("startdatebar");
    start_details.textContent = `${start}`;

    const end_details = document.getElementById("enddatebar");
    end_details.textContent = `${end}`;




    /*

    // use data we have to populate our page with info..
    const contentcard = document.getElementById("myholidaydets");
    contentcard.innerHTML = "";



    //kindof like a navbar with details


    const col = document.createElement('div');
    col.classList.add("col-7");
    col.classList.add("d-grid");
    col.classList.add("p-0");

    const country_details = document.createElement("div");
    country_details.classList.add("country_details");
    country_details.classList.add("py-2");

    country_details.innerHTML = `${country}`;
    col.appendChild(country_details);
    contentcard.appendChild(col);



    const col2 = document.createElement('div');
    col2.classList.add("col-2");
    col2.classList.add("d-grid");
    col2.classList.add("p-0");

    const start_date_details = document.createElement("div");
    start_date_details.classList.add("date_details");

    start_date_details.innerHTML = `${start}`;
    col2.appendChild(start_date_details);
    contentcard.appendChild(col2);




    const col3 = document.createElement('div');
    col3.classList.add("col-2");
    col3.classList.add("d-grid");
    col3.classList.add("p-0");

    const end_date_details = document.createElement("div");
    end_date_details.classList.add("date_details");

    end_date_details.innerHTML = `${end}`;
    col3.appendChild(end_date_details);
    contentcard.appendChild(col3);



    const col4 = document.createElement('div');
    col4.classList.add("col");
    col4.classList.add("edit_col");
    col4.classList.add("d-grid");
    col4.classList.add("p-0");

    const ammend = document.createElement("div");
    ammend.classList.add("edit_details");

    ammend.innerHTML = `Edit`;
    col4.appendChild(ammend);
    contentcard.appendChild(col4);
    */

    //Create fake cities to pass the details to create a city-event page

    city_array = ['London', 'Manchester', 'Glasgow', 'Edinburgh', 'Leeds', 'Bristol'];

    cityCards = document.getElementById("cityCards");

    for (let i = 0; i < city_array.length; i++) {

        const current_city = city_array[i];

        //Create a card for each city

        const col = document.createElement("div");
        col.classList.add("col-md-4");
        col.classList.add("p-4");


        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("citycard");

        const cardbody = document.createElement("div");
        cardbody.classList.add("card-body");
        cardbody.classList.add("citycard-body");

        const image = document.createElement("img");
        image.classList.add("img-fluid");
        image.classList.add("img-full");
        image.src = "https://picsum.photos/300/200";

        const cardtitle = document.createElement("h5");
        cardtitle.classList.add("card-title");
        cardtitle.classList.add("mt-3")
        cardtitle.innerHTML = `${city_array[i]}`;

        const description = document.createElement("p");
        description.classList.add("card-text");
        description.innerHTML = `${city_array[i]} is one of the best cities in the country`;



        const buttondiv = document.createElement("div");
        buttondiv.classList.add("text-end");

        const button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("more_details");
        button.textContent = `Find events`;

        buttondiv.appendChild(button);


        cardbody.appendChild(image);
        cardbody.appendChild(cardtitle);
        cardbody.appendChild(description);
        cardbody.appendChild(buttondiv);

        card.appendChild(cardbody);
        col.appendChild(card);



        //function "Find out more" button to go to another page
        const more_button = button;
        const buttoncolour = more_button.style.backgroundColor;

        more_button.addEventListener("mouseover", function () {
            more_button.style.backgroundColor = 'grey';
        });

        more_button.addEventListener("mouseout", function () {
            more_button.style.backgroundColor = buttoncolour;
        });

        more_button.addEventListener("click", function () {
            more_button.style.backgroundColor = buttoncolour;

            localStorage.setItem('city', current_city);

            // Redirect to the window page
            window.location.href = 'city_events.html';

        });

        cityCards.appendChild(col);
    }


});
