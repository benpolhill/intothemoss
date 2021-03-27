// Import parsed XML data as Promise
import xmlData from "./getData.js";

// We need to wrap everything in an IIAF (immediately invoked async function)
// in order to use the value from the resolved Promise
(async function () {
  const xmlDoc = await Promise.resolve(xmlData);
  const xmlItems = xmlDoc.querySelectorAll("item");

  let router = [
    {
      path: "/",
      name: "Root",
    },
    {
      path: "/about",
      name: "About",
    },
    {
      path: "/contact",
      name: "Contact",
    },
    {
      path: "/episodes/s01",
      name: "Season 1",
    },
    {
      path: "/episodes/s02",
      name: "Season 2",
    },
  ];

  let views = [
    {
      route: "/",
      title: "Home",
      markup: `<p>
      Welcome to the home page
  </p>`,
    },
    {
      route: "/about",
      title: "About",
      markup: `<p>
      Into the Moss is a weekly radio show made by James Baxter, James Ferris and James Polhill.
  </p>`,
    },
    {
      route: "/contact",
      title: "Contact",
      markup: `<p>
      Please email us on intothemossradio[at]gmail.com. Thanks.
  </p>`,
    },
    {
      route: "/episodes/s01",
      title: "Season 1",
      markup: `<ul>
  </ul>`,
    },
    {
      route: "/episodes/s02",
      title: "Season 2",
      markup: `<h1>Season 2</h1>`,
    },
  ];

  xmlItems.forEach((item, i) => {
    const id = xmlItems.length - i;
    const pad = (n, p = 2) => n.toString().padStart(p, "0");
    let episode = {};
    episode.id = pad(id);
    episode.path = item.querySelector("link").innerHTML;
    episode.title = item.querySelector("title").innerHTML;
    episode.description = item.querySelector("description").innerHTML;
    // Append each episode to the router
    router = [...router, episode];
  });
  console.log(router);

})(); // Invoke the IIAF
