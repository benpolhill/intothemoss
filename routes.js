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
    }
])

export default routerInstance
