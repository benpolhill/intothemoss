let epList = ['1','2','3','4','5'];
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
        markup: `<p>
            ${epList.forEach(ep => 'hello')}
        </p>`
    }, {
        route: "/episodes/s02",
        title: "Season 2",
        markup: `<h1>Season 2</h1>`
    }
];

export default views
