// Import parsed XML data as Promise
import xmlData from "./getData.js";
import links from "./links.js";

// We need to wrap everything in an IIAF (immediately invoked async function)
// in order to use the value from the resolved Promise
(async function () {
  const xmlDoc = await Promise.resolve(xmlData);
  const xmlItems = xmlDoc.querySelectorAll("item");

  let router = [
    {
      path: "/",
      title: "Home",
    },
    {
      path: "/about",
      title: "About",
    },
    {
      path: "/contact",
      title: "Contact",
    },
    {
      path: "/episodes/s01",
      title: "Season 1",
    },
    {
      path: "/episodes/s02",
      title: "Season 2",
    },
  ];

  let views = [
    {
      route: "/",
      title: "Home",
      markup: ``,
    },
    {
      route: "/about",
      title: "About",
      markup: `
      <h2>A sunken raft of weeds woven into a verdant morass of sound, song and story</h2>
        <p>Broadcast on London's <a href="https://resonancefm.com">Resonance 104.4 FM</a> every Thursday, <em>Into the Moss</em> is a 14 minute drift through original music, soundscapes and liminal yarns.</p>
      <p>Also available via these reputable outlets:<br>
        ${links.map((l) => '<a target="_blank" href="'+l.link+'">'+l.title+'</a>').join(' | ')}
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
      markup: `<h1>Season 1</h1>
      <ul>
        <li><a class='router-link' href='/episodes/s01/01'>Episode 1</a></li>
        <li><a class='router-link' href='/episodes/s02/01'>Episode 2</a></li>
      </ul>`,
    },
    {
      route: "/episodes/s02",
      title: "Season 2",
      markup: `<h1>Season 2</h1>`,
    },
  ];

  // Add XML item data to router
  xmlItems.forEach((item, i) => {
    const id = xmlItems.length - i;
    const pad = (n, p = 2) => n.toString().padStart(p, "0");
    let route = {};
    let view = {};
    let link = item.querySelector("link").innerHTML;
    let path = new URL(link).pathname;
    let title = item.querySelector("title").innerHTML;
    let description = item.querySelector("description").innerHTML;
    route.id = pad(id);
    route.title = title;
    route.path = path;
    view.route = path;
    view.title = title;
    view.markup = `
      <h1>Episode ${id}: ${title}</h1>
      <div id='episode-player'><img src='/episodes/images/${pad(id,3)}.jpg'><div><audio controls src='/episodes/audio/${pad(id,3)}.mp3'></audio>
      <p>${description}</p></div></div>
      <p><a class='router-link' href='/'>&larr; back to episodes</a></p>`
    // Append each route to the router array
    router = [...router, route];
    // Append each view to the views array
    views = [...views, view];
    // Build the home page list of episodes
    views[0].markup += `
      <article>
        <div class='thumb'>
          <a class='router-link' href='${path}'><img src='/episodes/images/${pad(id,3)}.jpg'></a>
        </div>
        <div class='info'>
          <h2><a class='router-link' href='${path}'>${id}: ${title}</a></h2>
          <p>${description}</p>
        </div>
      </article>`; 
  });
  // console.log(router);
  // console.log(views);

  // document.onload = ()=> {
  //   console.log("LOADED");
  // }

  const main = document.getElementById('main');
  const pageTitle = document.getElementsByTagName('title')[0];
  let currentPath = window.location.pathname;
  console.log(currentPath);
  let view = views.filter(v => v.route === currentPath)[0];
  // console.log(view);
  if (currentPath === '/') {
      main.innerHTML = view.markup;
  } else {
      // Check if route exists in routerInstance
      let route = router.filter(r => r.path === currentPath)[0];
      console.log(`route on load: ${route}`);
      if (route) {
          main.innerHTML = view.markup;
      } else {
          // main.innerHTML = `Route not defined`
          main.innerHTML = views[0].markup // Default to home
      }
  }

  let routeHistory = [];

  window.onpopstate = () => {
      // Back
      let lastRoute = routeHistory.pop();
      let navTo = routeHistory[routeHistory.length - 1] || '/';
      navigate(navTo);
      // Forward? who cares
  }

  document.addEventListener('click', (e)=> {
    // console.log(e.target);
    // With thumbnail images, the clicked target will be the image, 
    // so we have to specify to use the parent `a` link as the target
    let target = e.target.classList.contains('router-link') ? e.target 
      : e.target.parentNode.classList.contains('router-link') ? e.target.parentNode : null;
    if (target) {
      e.preventDefault();
      navigate(target.pathname);
      routeHistory = [...routeHistory, target.pathname]
    }
  })

  function navigate(route) {
    console.log(`navigating to ${route}`);
    // Redirect to the router instance
    let routeInfo = router.filter(r => r.path === route)[0];
    let view = views.filter(v => v.route === route)[0];
    // let definedRoutes = Array.from(document.getElementsByClassName('router-link'));
    if (!routeInfo) {
      window.history.pushState({}, '', 'error');
      main.innerHTML = `This route is not defined`;
    } else {
      // console.log(view);
      window.history.pushState({}, '', routeInfo.path);
      pageTitle.innerHTML = `Into the Moss | ${view.title}`;
      main.innerHTML = view.markup;
    }
  }

})(); // Invoke the IIAF
