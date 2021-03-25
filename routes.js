const RSS = `./feed.xml`;

// Get an array of 'items' from the RSS
// async function getItems() {
//   const response = await fetch(RSS);
//   const data = new DOMParser().parseFromString(response, "application/xml");
//   // const data = new window.DOMParser().parseFromString(response.text(), "text/xml");
//   console.log('We has haters:');
//   console.log(data);
//   const items = data.querySelectorAll('item');
//   console.log('items?:');
//   console.log(items);
// } 

// const parser = new DOMParser();

// const xmlDoc = fetch("./feed.xml").then(response => response.text());
// const feed = parser.parseFromString(xmlDoc, "application/xml");

// console.log('xmlDoc:');
// console.log(xmlDoc);
// console.log('feed:');
// console.log(feed);

// const xhr = new XMLHttpRequest();

// xhr.onload = function() {
//   dump(xhr.responseXML.documentElement.nodeName);
// }
// xhr.onerror = function() {
//   dump("Error while getting XML.");
// }
// xhr.open("GET", "feed.xml");
// xhr.responseType = "document";
// xhr.send();
// console.log(xhr);

// const parser = new DOMParser();
// const xmlDoc = xhr.response;

// console.log(xmlDoc);

// getItems();

const itemsArr = [];

fetch(RSS)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    const items = data.querySelectorAll('item');
    // console.log(items);
    items.forEach(item => {
      itemsArr.push(item);
    })
  });

console.log(itemsArr);
// console.log('Will we have items here?:');
// console.log(myItems);



let epList = [
    {'episode': '1',
      'link': '/episodes/s01/01'},
    {'episode': '2',
      'link': '/episodes/s01/02'},
    {'episode': '3',
      'link': '/episodes/s01/03'},
    {'episode': '4',
      'link': '/episodes/s01/04'},
    {'episode': '5',
      'link': '/episodes/s01/05'},
    {'episode': '6',
      'link': '/episodes/s01/06'}
];

let Router = function (name, routes) {
    return {
        name,
        routes
    }
};

let routerInstance = new Router('routerInstance', [{
        path: "/",
        name: "Root"
    }, {
        path: "/about",
        name: "About"
    }, {
        path: "/contact",
        name: "Contact"
    }, {
        path: "/episodes/s01",
        name: "Season 1"
    }, {
        path: "/episodes/s02",
        name: "Season 2"
    }
]);
// console.log(typeof(routerInstance));

// Make a route item for each episode in epList and append it to the router instance
epList.forEach(ep => {
    let epRoute = {
        path: ep.link,
        name: `Episode ${ep.episode}`
    };
    routerInstance.routes = [...routerInstance.routes, epRoute];
});

// console.log('routerInstance:');
// console.log(routerInstance);

export default routerInstance;
