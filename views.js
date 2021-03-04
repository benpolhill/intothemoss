let epList = [
    {'episode': '1',
      'link': 'https://intothemoss.co.uk/episodes/s01/01'},
    {'episode': '2',
      'link': 'https://intothemoss.co.uk/episodes/s01/01'},
    {'episode': '3',
      'link': 'https://intothemoss.co.uk/episodes/s01/01'},
    {'episode': '4',
      'link': 'https://intothemoss.co.uk/episodes/s01/01'},
    {'episode': '5',
      'link': 'https://intothemoss.co.uk/episodes/s01/01'},
    {'episode': '6',
      'link': 'https://intothemoss.co.uk/episodes/s01/01'}
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
                return `<li><a href='${ep.link}'>Episode ${ep.episode}</a></li>`;
            }).join('')}
        </ul>`
    }, {
        route: "/episodes/s02",
        title: "Season 2",
        markup: `<h1>Season 2</h1>`
    }
];

export default views
