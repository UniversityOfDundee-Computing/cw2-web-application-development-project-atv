window.addEventListener("DOMContentLoaded", async function () {

    //fetch data from previous page form and set variables we are going to use
    const country = localStorage.getItem('country');
    const country_code = localStorage.getItem('country_code');
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


    cityCards = document.getElementById("cityCards"); //the place in html on the page they will appear

    //display top 9 cities sorted from population.
    fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${country_code}&types=CITY&sort=-population&limit=9`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '87bddc76b6msha8f8a9e30b81a3dp19af46jsn47d84541a75a',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    })
        .then(response => response.json())
        .then(data => {

            if (data.data) {

                const cities = data.data;
                //ensures there are no duplicates
                const uniqueCities = [...new Map(cities.map(city => [city.name, city])).values()];


                uniqueCities.forEach(city => {

                    let city_name = city.name;

                    IMAGES_API = 'zE9iwzUlUykUhfgcWpaauWK2RQwouDcdWlK7i1e1mLmqiXNuKLdWHRjG';

                    const url = `https://api.pexels.com/v1/search?query=${city_name}&per_page=1`;

                    fetch(url, {
                        method: "GET",
                        headers: {
                            "Authorization": IMAGES_API
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.photos && data.photos.length > 0) {
                                //fetching city image
                                const images = data.photos;
                                city_image = images[0];
                                city_image_src = city_image.src.large;
                                //create the card with city name and city image
                                createCityCard(city_name, city_image_src);
                            }
                            else {
                                getCountryImage(country); //an image of the city wasn't found so we will use one of the country instead
                            }
                        })
                        .catch(error => console.error('Error fetching images:', error));



                    function getCountryImage(country_name) {

                        const countryUrl = `https://api.pexels.com/v1/search?query=${country_name}&per_page=1`;

                        //fetching country image
                        fetch(countryUrl, {
                            method: "GET",
                            headers: {
                                "Authorization": IMAGES_API
                            }
                        })
                            .then(response => response.json())
                            .then(countryData => {

                                if (countryData.photos && countryData.photos.length > 0) {
                                    //get the src of the image
                                    const images = countryData.photos;
                                    const country_image = images[0];
                                    const country_image_src = country_image.src.large;
                                    //create the card with city name and country image
                                    createCityCard(city_name, country_image_src);
                                } else {
                                    createCityCard(city_name, "placeholder-image-url.jpg"); // Use a placeholder image if no image of the country was found eitherr
                                }
                            })
                            .catch(error => console.error('Error fetching country image:', error));
                    }

                });
            }
        })
        .catch(error => console.error('Error fetching cities:', error));


    //function creates the card
    function createCityCard(city_name, cityImage) {

        const col = document.createElement("div");
        col.classList.add("col-md-4");
        col.classList.add("p-4");


        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("citycard");

        const image = document.createElement("img");
        image.classList.add("card-img", "img-fluid", "img-full");
        image.loading = "lazy";
        image.src = cityImage || "placeholder-image-url.jpg";

        image.style.width = "100%";
        image.style.height = "300px";
        image.style.objectFit = "cover";
        image.style.borderRadius = "8px";

        const overlaycard = document.createElement("div");
        overlaycard.classList.add("citycardoverlay");

        const cardinfo = document.createElement("div");
        cardinfo.classList.add("card-img-overlay", "citycarddetails");

        const cardtitle = document.createElement("h5");
        cardtitle.classList.add("card-title", "citytitle");
        cardtitle.style.opcacity = '1';
        cardtitle.innerHTML = `${city_name}`;


        cardinfo.appendChild(cardtitle);


        card.appendChild(image);
        card.appendChild(overlaycard);
        card.appendChild(cardinfo);
        col.appendChild(card);


        card.addEventListener("click", function () {

            localStorage.setItem('city', city_name);

            // Redirect to the window page
            window.location.href = 'city_events.html';

        });

        cityCards.appendChild(col);
    }

});