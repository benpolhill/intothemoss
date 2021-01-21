const RSS_URL = `https://intothemoss.co.uk/feed.xml`;

fetch(RSS_URL)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    console.log(data);
    const items = data.querySelectorAll("item");
    let html = `<h2>Season 2</h2>`;
    items.forEach((el, i) => {
      i = items.length - i;
      const j = i.padStart(3, "0");
      html += `
        ${i == 15 ? '<h2>Season 1</h2>' : ''}
        <article>
          <img src="https://intothemoss.co.uk/episodes/images/${j}">
          <h3>
            <a href="${el.querySelector("link").innerHTML}">
              ${i}: ${el.querySelector("title").innerHTML}
            </a>
          </h3>
          <p>${el.querySelector("description").innerHTML}</p>
        </article>
      `
    });
    document.getElementsByTagName('main')[0].insertAdjacentHTML("beforeend", html);
  });
