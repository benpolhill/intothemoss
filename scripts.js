const RSS_URL = `./feed.xml`;

fetch(RSS_URL)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    console.log(data);
    const items = data.querySelectorAll("item");
    let html = `<h2>Season 2</h2>`;
    items.forEach((el, i) => {
      i = items.length - i;
      const pad = (i, n=2) => i.toString().padStart(n, "0");
      const episodePath = i > 15 ? `s02/${pad(i - 15)}` : `s01/${pad(i)}`;
      html += `
        ${i == 15 ? '<h2>Season 1</h2>' : ''}
        <article>
          <div class="thumb">
              <a href="${el.querySelector("link").innerHTML}">
              <a href="./episodes/${episodePath}">
                  <img src="./episodes/images/${pad(i,3)}.jpg">
              </a>
          </div>
          <div class="info">
              <h3>
                <a href="${el.querySelector("link").innerHTML}">
                  ${i}: ${el.querySelector("title").innerHTML}
                </a>
              </h3>
              <p>${el.querySelector("description").innerHTML}</p>
          </div>
        </article>
      `
    });
    document.getElementsByTagName('main')[0].insertAdjacentHTML("beforeend", html);
  });
