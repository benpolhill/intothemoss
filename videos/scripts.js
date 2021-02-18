/**
* Sample JavaScript code for youtube.playlists.list
* See instructions for running APIs Explorer code samples locally:
* https://developers.google.com/explorer-help/guides/code_samples#javascript
*/

function authenticate() {
return gapi.auth2.getAuthInstance()
    .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
    .then(function() { console.log("Sign-in successful"); },
          function(err) { console.error("Error signing in", err); });
}
function loadClient() {
    gapi.client.setApiKey("AIzaSyCgBPn0ISgyOrFuOkoyacN7VpGQfmvflrE");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function() { console.log("GAPI client loaded for API"); },
       function(err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
    return gapi.client.youtube.playlists.list({
      "part": [
        "snippet,contentDetails,player"
      ],
      "channelId": "UCzEaX54ErVwZUZJc2sJxjkg",
      "maxResults": 25
    })
    .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        const playlists = response.result.items; 
        playlists.forEach((item) => {
            const $listItem = `
                <li>
                    <h2>${item.snippet.title} (${item.contentDetails.itemCount} videos)</h2>
                    <h3>${item.snippet.description}</h3>
                    ${item.player.embedHtml.replace('http:','https:')}
                </li>
                `;
            document.getElementById('playlists').innerHTML += $listItem;
        });
    },
    function(err) { console.error("Execute error", err); });
}

gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "177488418454-8k6istlnfs6p6mhfqssi0e8gnkpcilo4.apps.googleusercontent.com"});
});

// document.onload(loadClient().then(execute));