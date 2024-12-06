document.addEventListener('DOMContentLoaded', function () {
    // 選取所有 .read-more 按鈕
    const readMoreLinks = document.querySelectorAll('.read-more');

    readMoreLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // 防止連結跳轉
            const cardInfo = this.closest('.post-content').querySelector('.cityinfo'); // 找到 cityinfo 區域
            const city = this.getAttribute('data-city'); // 獲取城市名稱

            // 檢查按鈕是否已展開
            const isExpanded = this.getAttribute('data-expanded') === 'true';

            if (isExpanded) {
                // 如果已展開，收起內容並切換狀態
                cardInfo.innerHTML = ''; // 清空內容
                this.setAttribute('data-expanded', 'false');
                this.textContent = 'Read More'; // 恢復按鈕文字
            } else {
                // 如果未展開，請求資料並展開
                this.setAttribute('data-expanded', 'true');
                this.textContent = 'Read Less'; // 改變按鈕文字
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
            const page = pages[Object.keys(pages)[0]]; // 獲取頁面內容
            if (page.extract) {
                // 將資料插入到 cityinfo
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
