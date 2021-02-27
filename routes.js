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
])

export default routerInstance
