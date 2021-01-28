const RSS_URL = `https://intothemoss.co.uk/feed.xml`;

fetch(RSS_URL)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    console.log(data);
    const items = data.querySelectorAll("item");
    let html = `<h2>Season 1 (10 Sep &ndash; 17 Dec 2020)</h2>`;
    let itemsRevArr = Object.keys(items).reverse();
    console.log(itemsRevArr);
    itemsRevArr.forEach((el, i) => {
      console.log(items[el]);
      i = i+1;
      const j = i.toString().padStart(3, "0");
      html += `
        ${i == 16 ? '<h2>Season 2 (14 Jan 2021 &ndash;)</h2>' : ''}
        <article>
            <h3>${i}: ${items[el].querySelector("title").innerHTML} (${items[el].querySelector("pubDate").innerHTML.substring(5,11)})</h3>
            <p>${items[el].querySelector("description").innerHTML}</p>
            <p>
                Link: <a href="${items[el].querySelector("link").innerHTML}">${items[el].querySelector("link").innerHTML}</a><br>
                Audio: <a href="${items[el].querySelector("enclosure").getAttribute("url")}">${items[el].querySelector("enclosure").getAttribute("url")}</a><br>
                Image: <a href="https://intothemoss.co.uk/episodes/images/${j}.jpg">https://intothemoss.co.uk/episodes/images/${j}.jpg</a>
            </p>
        </article>
      `
    });
    document.getElementsByTagName('main')[0].insertAdjacentHTML("beforeend", html);
  });
