import response from './response.js';

// console.log(response);
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

// const epList = [];

response.then(data => {
  const items = data.querySelectorAll('item');
  // console.log(items);
  items.forEach((item, i) => {
    i = items.length - i;
    const pad = (n, p=2) => n.toString().padStart(p, "0");
    let episode = {};
    episode.id = pad(i);
    episode.path = item.querySelector('link').innerHTML;
    episode.title = item.querySelector('title').innerHTML;
    episode.description = item.querySelector('description').innerHTML;
    // Append each episode to the router instance
    routerInstance.routes = [...routerInstance.routes, episode]; 
  })
}, console.error);

console.log('routurInstance:');
console.log(routerInstance);
console.log(routerInstance.routes[4]);

// let epList = [
//     {'episode': '1',
//       'link': '/episodes/s01/01'},
//     {'episode': '2',
//       'link': '/episodes/s01/02'},
//     {'episode': '3',
//       'link': '/episodes/s01/03'},
//     {'episode': '4',
//       'link': '/episodes/s01/04'},
//     {'episode': '5',
//       'link': '/episodes/s01/05'},
//     {'episode': '6',
//       'link': '/episodes/s01/06'}
// ];


export default routerInstance;
