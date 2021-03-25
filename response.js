
    async function getData() {

        const feed = await fetch(`./feed.xml`);
        const rss = await feed.text();

        return rss;

        // console.log(RSS);
        // const myLovelyData = new DOMParser().parseFromString(RSS, "application/xml");

        // console.log(myLovelyData);
        // const lovelyItems = myLovelyData.querySelectorAll('item');

        // console.log(lovelyItems);
        // return lovelyItems;

    }

    // function response() {
    //     console.log('here in the default exported function');
    //     return getData();
    // }

    export default getData().then(response => 
        new DOMParser().parseFromString(response, "application/xml")
    );



// function response() {

//     const RSS = `./feed.xml`;
//     let itemsAll = [{title: "filst", id: "0", link: "test"},{title: "fieelst", id: "0", link: "teest"}];

//     fetch(RSS)
//     .then(response => response.text())
//     .then(str => new DOMParser().parseFromString(str, "text/xml"))
//     .then(data => {
//         const items = data.querySelectorAll('item');
//         // console.log(items);
//         items.forEach((item, i) => {
//             i = items.length - i;
//             const pad = (n, p=2) => n.toString().padStart(p, "0");
//             let itemObj = {};
//             itemObj.id = pad(i);
//             itemObj.link = item.querySelector('link').innerHTML;
//             itemObj.title = item.querySelector('title').innerHTML;
//             itemObj.description = item.querySelector('description').innerHTML;
//             // console.log(itemObj);
//             itemsAll.push(itemObj);
//         })
//         itemsAll.push({test: "object"});
//         itemsAll.push({test2: "ontomnt"});
//     });

//     return itemsAll;

// }

// export default response();