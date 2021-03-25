function response() {

    const RSS = `./feed.xml`;
    const itemsArr = [];

    fetch(RSS)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        const items = data.querySelectorAll('item');
        // console.log(items);
        items.forEach(item => {
        itemsArr.push(item);
        })
    });

    return itemsArr;

}

export default response();