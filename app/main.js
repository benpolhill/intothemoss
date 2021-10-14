import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
// Import parsed XML data as Promise
import xmlData from "/app/getData.js";
import Router from "/app/router.js";
import Views from "/app/views.js";
// import text from "./getText.js";

Sentry.init({
  dsn: "https://2ca06d8c9b384f148a022076bf2b12d7@o1017332.ingest.sentry.io/5983111",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// We need to wrap everything in an IIAF (immediately invoked async function)
// in order to use the value from the resolved Promise
(async function () {
  const xmlDoc = await Promise.resolve(xmlData);
  const xmlItems = xmlDoc.querySelectorAll("item");
  // const texts = await Promise.resolve(text);
  // console.log(`text: ${texts}`);

  let views = new Views;
  let router = new Router;

  // Add XML item data to each view & route
  xmlItems.forEach((item, i) => {
    const id = xmlItems.length - i;
    const pad = (n, p = 2) => n.toString().padStart(p, "0");
    let route = {};
    let view = {};
    let link = item.querySelector("link").innerHTML;
    let path = new URL(link).pathname;
    let title = item.querySelector("title").innerHTML;
    let description = item.querySelector("description").innerHTML;
    let textPath = `/episodes/text/${pad(id,3)}.txt`;
    let pubDate = item.querySelector("pubDate").innerHTML;
    pubDate = pubDate.substring(5, 16);
    // const texty = await Promise.resolve(text);
    route.id = pad(id);
    route.title = title;
    route.path = path;
    view.route = path;
    view.title = title;
    
    view.markup = `
      <h1>${id}: ${title}</h1>
      <div id='episode-player'>
        <div class='thumb'>
          <picture>
            <source srcset='/episodes/images/webp/300/${pad(id,3)}.webp' type='image/webp'>
            <img src='/episodes/images/jpg/300/${pad(id,3)}.jpg' loading='lazy'>
          </picture>
        </div>
        <div id='player-info'>
          <audio controls src='/episodes/audio/${pad(id,3)}.mp3'></audio>
          <p>${description}</p>
          <p>First broadcast on <a href="https://resonancefm.com" target="_blank">Resonance 104.4 FM</a>,  ${pubDate}.</p>
        </div>
      </div>
      <p><a class='router-link' href='/'>&larr; Back to episodes</a> &nbsp; <a class='expander'>Episode text &darr;</a></p>`;

      fetch(textPath)
      .then(response => response.text())
      .then((epText) => {
        if (epText.startsWith("<")) {
          return;
        }
      view.markup += `<pre class='episode-text'>${epText}</pre>`;
      })
    
      
    // Append each route to the router array
    router = [...router, route];
    // Append each view to the views array
    views = [...views, view];
    // Build the home page list of episodes
    views[0].markup += `
      <article>
        <div class='thumb'>
          <a class='router-link' href='${path}'>
            <picture>
              <source srcset='/episodes/images/webp/150/${pad(id,3)}.webp' type='image/webp'>
              <img src='/episodes/images/jpg/150/${pad(id,3)}.jpg' loading='lazy'>
            </picture>
          </a>
        </div>
        <div class='info'>
          <h2><a class='router-link' href='${path}'>${id}: ${title}</a></h2>
          <p>${description}</p>
        </div>
      </article>`; 
  });

  const main = document.getElementById('main');
  const pageTitle = document.getElementsByTagName('title')[0];
  let currentPath = window.location.pathname;
  let view = views.filter(v => v.route === currentPath)[0];
  if (currentPath === '/') {
      main.innerHTML = view.markup;
  } else {
      // Check if route exists in routerInstance
      let route = router.filter(r => r.path === currentPath)[0];
      if (route) {
          main.innerHTML = view.markup;
      } else {
          main.innerHTML = views[0].markup // Default to home if no route defined
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
  // TODO: rewrite all this as switch block for each type of click target
  document.addEventListener('click', (e)=> {
    // With thumbnail images, the clicked target will be the image, 
    // so we have to specify to use the parent `a` link as the target
    let target = e.target.classList.contains('router-link') ? e.target 
      : e.target.parentNode.classList.contains('router-link') ? e.target.parentNode
      : e.target.classList.contains('expander') ? e.target : null;
    if (target) {
      if (target.classList.contains('expander')) {
        try {
          e.preventDefault;
          document.querySelector('.episode-text').style.display = 'block';
          return;
        } catch(e) {
          return;
        }
        return;
      }
      e.preventDefault();
      navigate(target.pathname);
      routeHistory = [...routeHistory, target.pathname]
    }
  })

  function navigate(route) {
    // Redirect to the router instance
    let routeInfo = router.filter(r => r.path === route)[0];
    let view = views.filter(v => v.route === route)[0];
    // let definedRoutes = Array.from(document.getElementsByClassName('router-link'));
    if (!routeInfo) {
      window.history.pushState({}, '', 'error');
      main.innerHTML = `This route is not defined`;
    } else {
      window.history.pushState({}, '', routeInfo.path);
      pageTitle.innerHTML = `Into the Moss | ${view.title}`;
      main.innerHTML = view.markup;
    }
  }

})(); // Invoke the IIAF
