import response from './response.js';

console.log(response);

const itemsAll = [];

response.then(data => {
  const items = data.querySelectorAll('item');
  // console.log(items);
  items.forEach((item, i) => {
    i = items.length - i;
    const pad = (n, p=2) => n.toString().padStart(p, "0");
    let itemObj = {};
    itemObj.id = pad(i);
    itemObj.link = item.querySelector('link').innerHTML;
    itemObj.title = item.querySelector('title').innerHTML;
    itemObj.description = item.querySelector('description').innerHTML;
    // console.log(itemObj);
    itemsAll.push(itemObj);
  })
}, console.error);

console.log(itemsAll);

itemsAll.forEach(el => {
  console.log(el);
})


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

// console.log(epList);
// console.log(typeof(epList));
// console.log(epList[2]);

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
