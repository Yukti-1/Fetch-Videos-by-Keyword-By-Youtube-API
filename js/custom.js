//YouTube Search API in JavaScript
gapi.load("client", loadClient);

const YOUTUBE_API_KEY = "YOUTUBE_API_KEY";

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }

function loadClient() {
    console.log("inside function loadClient() 1");
    gapi.client.setApiKey(YOUTUBE_API_KEY);
    console.log("inside function loadClient() 2");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function(response) { 
            console.log("Response", response);
            console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });

    
}

//Calling the API and Rendering Result
const ytForm = document.getElementById('yt-form');
const keywordInput = document.getElementById('keyword-input');
const maxresultInput = document.getElementById('maxresult-input');
const orderInput = document.getElementById('order-input');
const videoList = document.getElementById('videoListContainer');
var pageToken = '';
 
ytForm.addEventListener('submit', e => {
    e.preventDefault();
    execute();
});
 
function paginate(e, obj) {
    e.preventDefault();
    pageToken = obj.getAttribute('data-id');
    execute();
}
 
// Make sure the client is loaded before calling this method.
function execute() {
    const searchString = keywordInput.value;
    const maxresult = maxresultInput.value;
    const orderby = orderInput.value;
 
    var arr_search = {
        "part": 'snippet',
        "type": 'video',
        "order": orderby,
        "maxResults": maxresult,
        "q": searchString
    };
 
    if (pageToken != '') {
        arr_search.pageToken = pageToken;
    }
 
    return gapi.client.youtube.search.list(arr_search)
    .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        const listItems = response.result.items;
        if (listItems) {
            let output = '<h4>Videos</h4><ul>';
 
            listItems.forEach(item => {
                const videoId = item.id.videoId;
                const videoTitle = item.snippet.title;
                output += `
                    <li><a data-fancybox href="https://www.youtube.com/watch?v=${videoId}"><img src="http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg" /></a><p>${videoTitle}</p></li>
                `;
            });
            output += '</ul>';
 
            if (response.result.prevPageToken) {
                output += `<br><a class="paginate" href="#" data-id="${response.result.prevPageToken}" onclick="paginate(event, this)">Prev</a>`;
            }
 
            if (response.result.nextPageToken) {
                output += `<a href="#" class="paginate" data-id="${response.result.nextPageToken}" onclick="paginate(event, this)">Next</a>`;
            }
 
            // Output list
            videoList.innerHTML = output;
        }
    },
    function(err) { console.error("Execute error", err); });
}