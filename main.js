import routerInstance from './routes.js'
import views from './views.js'

// window.onreload = () => {
//     setTimeout( () => console.log('RELOADED'), 1500);
// }

window.onload = () => {
    const main = document.getElementById('main');
    const pageTitle = document.getElementsByTagName('title')[0];
    let currentPath = window.location.pathname;
    let view = views.filter(v => v.route === currentPath)[0];
    if (currentPath === '/') {
        main.innerHTML = view.markup;
    } else {
        // Check if route exists in routerInstance
        let route = routerInstance.routes.filter(r => r.path === currentPath)[0];
        if (route) {
            main.innerHTML = view.markup;
        } else {
            main.innerHTML = `Route not defined`
        }
    }

    let navigate = route => {
        // Redirect to the router instance
        let routeInfo = routerInstance.routes.filter(r => r.path === route)[0]
        let view = views.filter(v => v.route === route)[0];
        if (!routeInfo) {
            window.history.pushState({}, '', 'error')
            main.innerHTML = `This route is not defined`
        } else {
            window.history.pushState({}, '', routeInfo.path);
            pageTitle.innerHTML = `Into the Moss | ${view.title}`;
            main.innerHTML = view.markup;
        }
    }

    let definedRoutes = Array.from(document.getElementsByClassName('router-link'));
    let routeHistory = [];

    definedRoutes.forEach(route => {
        route.addEventListener('click', e => {
            e.preventDefault();
            navigate(e.target.pathname);
            routeHistory = [...routeHistory, e.target.pathname];
        })
    })

    window.onpopstate = () => {
        // Back
        let lastRoute = routeHistory.pop();
        let navTo = routeHistory[routeHistory.length - 1] || '/';
        navigate(navTo);
        // Forward? who cares
    }


}
