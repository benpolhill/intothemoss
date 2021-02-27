import routerInstance from './routes.js'

window.onload = () => {
    let root = document.getElementById('app');
    let h1 = document.getElementsByTagName('h1')[0];

    let currentPath = window.location.pathname;
    console.log(`currentPath: ${currentPath}`);
    if (currentPath === '/') {
        root.innerHTML = 'You are on the home page'
    } else {
        // Check if route exists in routerInstance
        let route = routerInstance.routes.filter(r => r.path === currentPath)[0];
        if (route) {
            root.innerHTML = `You are on the ${route.name} path`
        } else {
            root.innerHTML = `Route not defined!`
        }
    }

    let navigate = e => {
        console.log('navigating to...');
        //e.preventDefault;
        let route = e.target.pathname;
        console.log(route);

        // Redirect to the router instance
        let routeInfo = routerInstance.routes.filter(r => r.path === route)[0]
        if (!routeInfo) {
            window.history.pushState({}, '', 'error')
            root.innerHTML = `This route is not defined`
        } else {
            window.history.pushState({}, '', routeInfo.path)
            h1.innerHTML = routeInfo.name;
            root.innerHTML = `You are on the ${routeInfo.name} path!`
        }
    }

    let definedRoutes = Array.from(document.getElementsByClassName('router-link'));
    console.log(definedRoutes);

    definedRoutes.forEach(route => {
        route.addEventListener('click', e => {
            e.preventDefault();
            navigate(e);
        })
    })

}
