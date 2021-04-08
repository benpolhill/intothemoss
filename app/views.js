import links from "/app/links.js";

let Views = function() { 
    return [
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
      <h3><em>Into the Moss</em> is also available via these reputable outlets:</h3><p>
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
      route: "/episodes",
      title: "Episodes",
      markup: `<h1>Episodes</h1>
      <ul>
        <li><a class='router-link' href='/episodes/s01'>Season 1</a></li>
        <li><a class='router-link' href='/episodes/s02'>Season 2</a></li>
      </ul>`,
    },
    {
      route: "/episodes/s02",
      title: "Season 2",
      markup: `<h1>Season 2</h1>`,
    },
  ];
}

  export default Views;