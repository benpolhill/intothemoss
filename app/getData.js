async function getData() {

    const feed = await fetch(`./feed.xml`);
    const rss = await feed.text();

    return rss;
}

// Will export XML data object as Promise
export default getData().then(data => 
    new DOMParser().parseFromString(data, "application/xml")
);
