document.addEventListener('DOMContentLoaded', function () {
    // 確保 cityinfo 區塊和 Read More 按鈕正確選取
    const readMoreLinks = document.querySelectorAll('.read-more');

    readMoreLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // 阻止連結的預設行為
            const city = this.getAttribute('data-city'); // 獲取城市名稱
            const cardInfo = this.closest('.post-content').querySelector('.cityinfo'); // 找到對應的 cityinfo 區域
            fetchWikiPage(city, cardInfo); // 傳遞 city 和 cityinfo 區塊
        });
    });
});

function fetchWikiPage(city, cardInfo) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro&titles=${city}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const page = pages[Object.keys(pages)[0]]; // 取得頁面資料
            if (page.extract) {
                // 更新 cityinfo 區域內容
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
