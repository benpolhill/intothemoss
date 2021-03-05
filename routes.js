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
console.log(typeof(routerInstance));

// Make a route item for each episode in epList and append it to the router instance
epList.forEach(ep => {
    let epRoute = {
        route: ep.link,
        name: `Episode ${ep.episode}`
    };
    routerInstance.routes = [...routerInstance.routes, epRoute];
});

console.log('routerInstance:');
console.log(routerInstance);

export default routerInstance;
