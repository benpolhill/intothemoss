async function getText() {

    const textFiles = await fetch(`/episodes/text/016.txt`);
    const text = await textFiles.text();
    // console.log(text);
    return text;
}

export default getText();