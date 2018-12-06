function requestContent(url, content, urlC) {
    alert(url + "?content=" + content + "&url=" + urlC + "&token=" + localStorage["ext_user_token1"]);
    var request = new XMLHttpRequest();
    request.open('GET', url + "?content=" + content + "&url=" + urlC + "&token=" + localStorage["ext_user_token1"], false);
    request.onreadystatechange = function (o) {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {

            if (window.confirm('OPEN NOTE ?')) {
                var newURL = 'http://siblola.pythonanywhere.com/static/'+urlC+'.html';
                chrome.tabs.create({ url: newURL });
            };

        } else if (request.readyState === XMLHttpRequest.DONE && request.status !== 200) {
            console.log('ERROR REQUEST STATUS = ' + request.status);
        }
    };
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send();
}

chrome.runtime.onInstalled.addListener(function (info, tab) {
    // When the app gets installed, set up the context menus
    chrome.contextMenus.create({
        title: "Grab",
        contexts: ['selection'],
        onclick: function (info, tab) {
            chrome.tabs.executeScript(tab.id, {
                file: "getDOM.js"
            }, function (result) {
                //alert(encodeURIComponent(result))
                requestContent("http://siblola.pythonanywhere.com/content", encodeURIComponent(result), encodeURI(Math.random().toString()));
            });
        }
    });
});
