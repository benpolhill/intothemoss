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
            <source srcset='/assets/images/webp/300/${pad(
              id,
              3
            )}.webp' type='image/webp'>
            <img src='/assets/images/jpg/300/${pad(
              id,
              3
            )}.jpg' loading='lazy'>
          </picture>
        </div>
        <div id='player-info'>
          <audio controls src='/audio/${pad(id, 3)}.mp3'></audio>
          <p>${description}</p>
          <p>First broadcast on <a href="https://resonancefm.com" target="_blank">Resonance 104.4 FM</a>,  ${pubDate}.</p>
        </div>
      </div>
      <p><a class='router-link' href='/'>&larr; Back to episodes</a> &nbsp; <a class='expander hidden'>Episode text &darr;</a></p>`;

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
              <source srcset='/assets/images/webp/150/${pad(
                id,
                3
              )}.webp' type='image/webp'>
              <img src='/assets/images/jpg/150/${pad(
                id,
                3
              )}.jpg' loading='lazy'>
            </picture>
          </a>
        </div>
      `;
  });

  const main = document.getElementById("main");
  // const logo = document.querySelector(".logo");
  const pageTitle = document.getElementsByTagName("title")[0];
  let currentPath = window.location.pathname;
  let view = views.filter((v) => v.route === currentPath)[0];
  
  function buildPage(path) {
    if (path == "/") {
      main.insertAdjacentHTML('beforeend', view.markup);
      // main.innerHTML = view.markup;
      // main.classList.add('home');
      // main.classList.remove('episode');
      main.classList = ['home',];
      // logo.classList.remove("hidden");
      isTouchScreen() ? handleLogoVisibility("scroll") : handleLogoVisibility("mousemove");
    } else {
      // main.classList.add('episode');
      // main.classList.remove('home');
      main.classList = ['episode',];
      // Check if route exists in routerInstance
      let route = router.filter((r) => r.path === path)[0];
      if (route) {
        let textPath = `/assets/text/${pad(view.id, 3)}.txt`;
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
              const textExp = document.querySelector('.expander');
              textExp.classList.remove('hidden');
            }
          });
        main.innerHTML = view.markup;
        console.log("The HTML we're getting is:::");
        console.log(view.markup);
      } else {
        main.innerHTML = views[0].markup; // Default to home if no route defined
      }
    }
  }
  console.log(`Here we are, building ${currentPath} at root scope!`);
  buildPage(currentPath);

  let routeHistory = [];

  window.onpopstate = () => {
    // Back
    let lastRoute = routeHistory.pop();
    let navTo = routeHistory[routeHistory.length - 1] || "/";
    console.log(`Navigating to ${navTo}, as window.onpopstate has been triggered!`);
    navigate(navTo);
    // Forward? who cares
  };
  // TODO: rewrite all this as switch block for each type of click target
  document.addEventListener("click", (e) => {
    // With thumbnail images, the clicked target will be the image,
    // so we have to specify to use the parent `a` link as the target
    e.preventDefault();
    console.log("E.TARGET.CLOSEST('.router-link') IS THIS:");
    console.log(e.target.closest('.router-link'));
    // if (e.target.classList.contains("router-link") || e.target.classList.contains("expander")) {
    let target = e.target;
    // }
    if (e.target.closest('.router-link')) {
      target = e.target.closest('.router-link');
    }
    console.log("The 'target':");
    console.log(target);
    console.log("WE HAVE CLICKED THE ROUTER LINK!!!");
    navigate(target.pathname);
    routeHistory = [...routeHistory, target.pathname];
    try {
      // e.preventDefault();
      document.querySelector(".episode-text").style.display = "block";
      return;
    } catch (e) {
      return;
    }
    // e.preventDefault();
  });

  function handleLogoVisibility(eventType) {
    console.log("handling logo visibility, which should only happen on homepage, / ");
    console.log("View is::::::::");
    console.log(view);
    // if (view.route != "/") return;
    let x;
    try {
      document.addEventListener(
        eventType,
        function () {
          let logo = document.querySelector('.logo');
          if (x) {
            clearTimeout(x);
            removeLogo(logo);
          }
          x = setTimeout(() => {
            showLogo(logo);
          }, 1200);
        },
        false
      );
    } catch (e) {
      console.info(`TypeError: ${e}`);
    }
  }
  function removeLogo(logo) {
    try {
      logo.classList.add("hide");
      setTimeout(() => {
        logo.classList.add("hidden");
      }, 400);
    } catch(e) {
      console.info(`Can't remove ${logo} because it doesn't exist! (${e}).`);
    }
  }
  function showLogo(logo) {
    logo.classList.remove("hidden");
    setTimeout(() => {
      logo.classList.remove("hide");
    }, 100);
  }

  function navigate(route) {
    console.log(`Navigating to ${route}`);
    // Redirect to the router instance
    let routeInfo = router.filter((r) => r.path === route)[0];
    console.log(`routeInfo is :`);
    console.log(routeInfo);
    let view = views.filter((v) => v.route === route)[0];
    console.log(`view is :`);
    console.log(view);
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
        // removeLogo();
      }
      window.history.pushState({}, "", routeInfo.path);
      pageTitle.innerHTML = `Into the Moss | ${view.title}`;
      main.innerHTML = view.markup;
    }
  }
})(); // Invoke the IIAF
