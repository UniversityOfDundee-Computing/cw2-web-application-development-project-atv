document.addEventListener('DOMContentLoaded', function () {

    const readMoreLinks = document.querySelectorAll('.read-more');

    readMoreLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const cardInfo = this.closest('.post-content').querySelector('.cityinfo');
            const city = this.getAttribute('data-city');

            const isExpanded = this.getAttribute('data-expanded') === 'true';

            if (isExpanded) {
                cardInfo.innerHTML = '';
                this.setAttribute('data-expanded', 'false');
                this.textContent = 'Read More';
            } else {
                this.setAttribute('data-expanded', 'true');
                this.textContent = 'Read Less';
                fetchWikiPage(city, cardInfo);
            }
        });
    });
});

function fetchWikiPage(city, cardInfo) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro&titles=${city}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const page = pages[Object.keys(pages)[0]];
            if (page.extract) {
                cardInfo.innerHTML = `<p>${page.extract}</p>`;
            } else {
                cardInfo.innerHTML = `<p>Sorry, no additional information found for ${city}.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching the Wikipedia page:', error);
            cardInfo.innerHTML = `<p>Error loading information. Please try again later.</p>`;
        });
}
