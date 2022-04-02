// import * as Sentry from "@sentry/browser";
// import { Integrations } from "@sentry/tracing";
// import { consoleSandbox } from "@sentry/utils";
// Import parsed XML data as Promise
import xmlData from "/app/getData.js";
import Router from "/app/router.js";
import Views from "/app/views.js";
// import text from "./getText.js";

// Sentry.init({
//   dsn: "https://2ca06d8c9b384f148a022076bf2b12d7@o1017332.ingest.sentry.io/5983111",
//   integrations: [new Integrations.BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

// We need to wrap everything in an IIAF (immediately invoked async function)
// in order to use the value from the resolved Promise
(async function () {
  const xmlDoc = await Promise.resolve(xmlData);
  const xmlItems = xmlDoc.querySelectorAll("item");
  
  let views = new Views();
  let router = new Router();
 
  // Pad numbers with zeros, default 2, i.e. 69 -> 069
  function pad(n, p = 2) {
    return n.toString().padStart(p, "0");
  }

  // Detect whether touchscreen
  function isTouchScreen() {
    return ('ontouchstart' in window);
  }

  // Add XML item data to each view & route
  xmlItems.forEach((item, i) => {
    const id = xmlItems.length - i;
    let route = {};
    let view = {};
    let link = item.querySelector("link").innerHTML;
    let path = new URL(link).pathname;
    let title = item.querySelector("title").innerHTML;
    let description = item.querySelector("description").innerHTML;
    // let textPath = `/episodes/text/${pad(id, 3)}.txt`;
    let pubDate = item.querySelector("pubDate").innerHTML;
    pubDate = pubDate.substring(5, 16);
    // const texty = await Promise.resolve(text);
    route.id = pad(id);
    route.title = title;
    route.path = path;
    view.id = id;
    view.route = path;
    view.title = title;

    view.markup = `
      <h1>${id}: ${title}</h1>
      <div id='episode-player'>
        <div class='thumb'>
          <picture>
            <source srcset='/episodes/images/webp/300/${pad(
              id,
              3
            )}.webp' type='image/webp'>
            <img src='/episodes/images/jpg/300/${pad(
              id,
              3
            )}.jpg' loading='lazy'>
          </picture>
        </div>
        <div id='player-info'>
          <audio controls src='/episodes/audio/${pad(id, 3)}.mp3'></audio>
          <p>${description}</p>
          <p>First broadcast on <a href="https://resonancefm.com" target="_blank">Resonance 104.4 FM</a>,  ${pubDate}.</p>
        </div>
      </div>
      <p><a class='router-link' href='/'>&larr; Back to episodes</a> &nbsp; <a class='expander'>Episode text &darr;</a></p>`;

    // Append each route to the router array
    router = [...router, route];
    // Append each view to the views array
    views = [...views, view];
    // Build the home page list of episodes
    views[0].markup += `
        <div class='thumb'>
          <a class='router-link' href='${path}'>
            <p class="id">${id}</p>
            <picture>
              <source srcset='/episodes/images/webp/150/${pad(
                id,
                3
              )}.webp' type='image/webp'>
              <img src='/episodes/images/jpg/150/${pad(
                id,
                3
              )}.jpg' loading='lazy'>
            </picture>
          </a>
        </div>
      `;
  });

  const main = document.getElementById("main");
  const logo = document.querySelector(".logo");
  const pageTitle = document.getElementsByTagName("title")[0];
  let currentPath = window.location.pathname;
  let view = views.filter((v) => v.route === currentPath)[0];
  
  function buildPage(path) {
    if (path == "/") {
      main.innerHTML = view.markup;
      main.classList.add('home');
      main.classList.remove('episode');
      logo.classList.remove("hidden");
      isTouchScreen() ? handleLogoVisibility("scroll") : handleLogoVisibility("mousemove");
    } else {
      main.classList.add('episode');
      main.classList.remove('home');
      // Check if route exists in routerInstance
      let route = router.filter((r) => r.path === path)[0];
      if (route) {
        let textPath = `/episodes/text/${pad(view.id, 3)}.txt`;
        fetch(textPath)
          .then((response) => response.text())
          .then((epText) => {
            if (epText.startsWith("<")) {
              return;
            } else {
              let epTextElem = document.createElement('pre');
              epTextElem.classList.add('episode-text');
              epTextElem.innerText = epText;
              document.getElementById('main').appendChild(epTextElem);
            }
          });
        main.innerHTML = view.markup;
      } else {
        main.innerHTML = views[0].markup; // Default to home if no route defined
      }
    }
  }
  buildPage(currentPath);

  let routeHistory = [];

  window.onpopstate = () => {
    // Back
    let lastRoute = routeHistory.pop();
    let navTo = routeHistory[routeHistory.length - 1] || "/";
    navigate(navTo);
    // Forward? who cares
  };
  // TODO: rewrite all this as switch block for each type of click target
  document.addEventListener("click", (e) => {
    // With thumbnail images, the clicked target will be the image,
    // so we have to specify to use the parent `a` link as the target
    let target = e.target.classList.contains("router-link")
      ? e.target
      : e.target.parentNode.classList.contains("router-link")
      ? e.target.parentNode
      : e.target.classList.contains("expander")
      ? e.target
      : null;
    if (target) {
      if (target.classList.contains("expander")) {
        try {
          e.preventDefault;
          document.querySelector(".episode-text").style.display = "block";
          return;
        } catch (e) {
          return;
        }
        return;
      }
      e.preventDefault();
      navigate(target.pathname);
      routeHistory = [...routeHistory, target.pathname];
    }
  });

  function handleLogoVisibility(eventType) {
    let x;
    document.addEventListener(
      eventType,
      function () {
        if (x) {
          clearTimeout(x);
          removeLogo();
        }
        x = setTimeout(() => {
          showLogo();
        }, 1200);
      },
      false
    );
  }
  function removeLogo() {
    logo.classList.add("hide");
    setTimeout(() => {
      logo.classList.add("hidden");
    }, 400);
  }
  function showLogo() {
    logo.classList.remove("hidden");
    setTimeout(() => {
      logo.classList.remove("hide");
    }, 100);
  }

  function navigate(route) {
    // Redirect to the router instance
    let routeInfo = router.filter((r) => r.path === route)[0];
    let view = views.filter((v) => v.route === route)[0];
    // let definedRoutes = Array.from(document.getElementsByClassName('router-link'));
    if (!routeInfo) {
      window.history.pushState({}, "", "error");
      main.innerHTML = `This route is not defined`;
    } else {
      // We want to remove the logo from all pages apart from home
      if (routeInfo.path == "/") {
        buildPage(routeInfo.path);
        main.classList.remove('episode');
        // logo.classList.remove("hidden");
        // isTouchScreen() ? handleLogoVisibility("scroll") : handleLogoVisibility("mousemove");
      } else {
        main.classList.remove('home');
        removeLogo();
      }
      window.history.pushState({}, "", routeInfo.path);
      pageTitle.innerHTML = `Into the Moss | ${view.title}`;
      main.innerHTML = view.markup;
    }
  }
})(); // Invoke the IIAF
