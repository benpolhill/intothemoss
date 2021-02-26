/* eslint-disable no-console */
/* eslint-disable no-alert */

import Router from './Router.js';

const router = new Router({
    mode: 'history',
    root: '/'
});
const epList = ['01','02','03','04','05','06','07'];

// router
//     .add(/about/, () => {
//         console.log('welcome to about page');
//     })
//     .add(/contact/, () => {
//         console.log('Contact page');
//     })
//     .add('/', () => {
//         console.log('Home?')
//     })
//     .add('', () => {
//         // General controller
//         console.log('404')
//     });

document.getElementsByClassName("route-link")[0].addEventListener('click', e => {
    //e.preventDefault();
    const routeLink = e.target.parentElement['href'];
    console.log(routeLink);
    router.add(`${routeLink}`, () => {
        console.log(`trying to go to ${routeLink}!`);
        renderView(routeLink);
    })
});

epList.forEach( (ep) => {
    const epList = document.getElementById("episode-list"); 
    const markup = `
        <a href="${ep}">Show ${ep}!</a>
    `;
    epList.insertAdjacentHTML('beforeend', markup);
    router.add(`${ep}`, () => {
        renderView(ep);
    })
});

function renderView(id) {
    document.getElementById("main").innerHTML = `
        <h2>Into the Moss episode ${id}</h2>
        <p>Play the episode by pressing play on the player below!</p>
        <audio controls='' src='https://intothemoss.co.uk/episodes/audio/0${id}.mp3'>Audio not found</audio>
        `;
}
