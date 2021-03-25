import response from './response.js';

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

let views = [{
        route: "/",
        title: "Home",
        markup: `<p>
            Welcome to the home page
        </p>`
    }, {
        route: "/about",
        title: "About",
        markup: `<p>
            Into the Moss is a weekly radio show made by James Baxter, James Ferris and James Polhill.
        </p>`
    }, {
        route: "/contact",
        title: "Contact",
        markup: `<p>
            Please email us on intothemossradio[at]gmail.com. Thanks.
        </p>`
    }, {
        route: "/episodes/s01",
        title: "Season 1",
        markup: `<ul>
            ${epList.map(ep => {
                return `<li><a class='router-link' href='${ep.link}'>Episode ${ep.episode}</a></li>`;
            }).join('')}
        </ul>`
    }, {
        route: "/episodes/s02",
        title: "Season 2",
        markup: `<h1>Season 2</h1>`
    }
];

// Make a view object for each episode in epList and append it to the views array
epList.forEach(ep => {
    let epView = {
        route: ep.link,
        title: `Episode ${ep.episode}`,
        markup: `<h2>Episode ${ep.episode}</h2>`
    };
    views = [...views, epView];
});

// console.log('views:');
// console.log(views);

export default views;
