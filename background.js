// var reqUrl = "http://localhost/loger/api_context.php";
var reqUrl = "http://guu267.com/loger/api_context.php";

function requestContent(token, url, content) {
    var request = new XMLHttpRequest();
    request.open('GET', url + "?action=addContents&token=" + token + "&contents=" + content, false);
    request.onreadystatechange = function (o) {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {

            if (window.confirm('OPEN NOTE ?')) {
                var newURL = request.responseText;
                if( !newURL){
                    return;
                }
                chrome.tabs.create({ url: newURL });
            };
        } else if (request.readyState === XMLHttpRequest.DONE && request.status !== 200) {
            console.log('ERROR REQUEST STATUS = ' + request.status);
        }
    };
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send();
}
function processMenuItems(_menuId){
    chrome.storage.sync.get('loger_token', function(data){
        if( !data.loger_token){
            alert("Please log in.");
            return;
        }
        var token = data.loger_token;
        switch(_menuId){
            case "Start":
                chrome.storage.sync.set({action:"Start"});
                break;
            case "Stop":
                chrome.storage.sync.set({action:"Stop"});
                break;
            default:
                chrome.storage.sync.set({topic:_menuId});
                break;
        }
        // alert("Processing : " + _menuId);
    });
}
var topics = "";
var lstTopics  = [];
var topicName = "";
chrome.runtime.onInstalled.addListener(function (info, tab) {
    // When the app gets installed, set up the context menus

    chrome.storage.sync.get('topics', function(data){
        var lstSubMenus = [];
        lstSubMenus.push("Default");
        if( data.topics){
            topics = data.topics;
            lstTopics = topics.split("%%");
            for( var i = 0; i < lstTopics.length; i++){
                lstSubMenus.push(lstTopics[i]);
            }
        }
        chrome.contextMenus.create({
            title: "Start recording",
            id: "Start",
            contexts: ["all"],
            onclick: function (info, tab) {
                processMenuItems(info.menuItemId);
            }
        });
        chrome.contextMenus.create({
            title: "Stop recording",
            id: "Stop",
            contexts: ["all"],
            onclick: function (info, tab) {
                processMenuItems(info.menuItemId);
            }
        });
        chrome.contextMenus.create({
            title: "Create Topic",
            id: "Create",
            contexts: ["all"],
            onclick: function (info, tab) {
                topicName = prompt("Please enter new Topic name", "New Topic");
                if (topicName != null) {
                    if( lstTopics.indexOf(topicName) == -1){
                        chrome.storage.sync.get('topics', function(data){
                            if( data.topics){
                                topics = data.topics;
                                lstTopics = topics.split("%%");
                                lstTopics.push(topicName);
                                topics = lstTopics.join("%%");
                                chrome.storage.sync.set({topics:topics});

                                chrome.storage.sync.get('loger_token', function(data){
                                    if( !data.loger_token){
                                        return;
                                    }
                                    activeToken = data.loger_token;
                                    $.post( reqUrl, {action:"addTopic", token: activeToken, topic: topics}, function(data){
                                    });
                                });
                                chrome.contextMenus.create({
                                    title: topicName,
                                    contexts: ["all"],
                                    id: topicName,
                                    onclick: function(info, tab){
                                        processMenuItems(info.menuItemId);
                                    }
                                });
                            }
                        });
                    } else{
                        alert("Topic already exists.");
                    }
                }
            }
        });
        for( var i = 0; i < lstSubMenus.length; i++){
            var title = lstSubMenus[i];
            chrome.contextMenus.create({
                title: title,
                id: title,
                contexts: ["all"],
                onclick: function (info, tab) {
                    processMenuItems(info.menuItemId);
                }
            });
        }
    });
});
function sendContents(_data){
    chrome.storage.sync.get('loger_token', function(data){
        if( !data.loger_token){
            return;
        }
        activeToken = data.loger_token;
        chrome.storage.sync.get('action', function(action){
            if( action.action == "Stop"){
                return;
            }
            console.log( "starting state");
            chrome.storage.sync.get('topic', function(topic){
                var strTopic = "Default";
                if( topic.topic){
                    strTopic = topic.topic;
                }
                $.post( reqUrl, {action:"addContents", token: activeToken, contents: _data, topic: strTopic}, function(data){
                    alert(data);
                    if( data == "Invalid token"){
                        alert("Invalid token.\n Please login again.");
                    }
                });
            });
        });
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request == "ex_pageLoaded"){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.executeScript( tabs[0].id, {file: "getDOM.js"}, function(result){
                    if( !result){
                        alert("Non contents");
                        return;
                    }
                    sendContents(encodeURIComponent(result));
                });
            });
        }
    });