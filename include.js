// var reqUrl = "http://localhost/loger/api_context.php";
var reqUrl = "http://guu267.com/loger/api_context.php";

chrome.storage.sync.get('topics', function(data){
  var lstSubMenus = [];
  if( data.topics){
      topics = data.topics;
      lstTopics = topics.split("%%");
      for( var i = 0; i < lstTopics.length; i++){
          lstSubMenus.push(lstTopics[i]);
      }
  }
  chrome.storage.sync.get('topic', function(topic){
   if( topic.topic){
     var curTopic = topic.topic;
     for( var i = 0; i < lstSubMenus.length; i++){
       var strHtml = "";
       strHtml += "<option";
       if( curTopic == lstSubMenus[i]){
         strHtml += " selected";
       }
       strHtml += ">" + lstSubMenus[i] + "</option>";
       $("#selTopic").append(strHtml);
     }
   }
  });
});

chrome.storage.sync.get('loger_token', function(data){
  if( data.loger_token){
    $(".loginFields").hide();
    $(".mainFields").show();
  }
});

chrome.storage.sync.get('action', function(action){
  if( action.action){
    var act = action.action;
    if( act == "Stop"){
      $("input[type=checkbox]").prop("checked", false);
    } else{
      $("input[type=checkbox]").prop("checked", true);
    }
  }
});
$(function () {
  $("#selTopic").change(function(){
    var topic = $("#selTopic option:selected").html();
    console.log(topic);
    chrome.storage.sync.set({topic:topic});
    chrome.contextMenus.update(topic, {checked: true});

  });

  $("input[type=checkbox]").change(function(){
    if( this.checked){
      chrome.storage.sync.set({action:"Start"});
      chrome.contextMenus.update("Start", {checked: true});
    } else{
      chrome.storage.sync.set({action:"Stop"});
      chrome.contextMenus.update("Stop", {checked: true});
    }
  });

  $("#btnEraseAll").click(function(){
    chrome.storage.sync.set({loger_token:""});
    chrome.storage.sync.set({topics:""});
    chrome.contextMenus.removeAll();
    location.reload();
  });

  $("#logout").click(function () {
    chrome.storage.sync.set({loger_token:""});
    chrome.contextMenus.removeAll();
    location.reload();
  });
  $("#btnDashboard").click(function(){
    chrome.tabs.create({ url: "options.html" });
  });

  $("#login").click(function () {
    var email = $("#log1").val();
    var pass = $("#pass1").val();
    $.get( reqUrl + "?action=verifyUser&email="+email+"&pass="+pass, function(retVal){
      chrome.storage.sync.set({loger_token: retVal});
      if( retVal){
        $.post(reqUrl, {action:"getTopics", token: retVal}, function(data){
          chrome.storage.sync.set({'topics': data});
          chrome.contextMenus.removeAll();
          chrome.runtime.sendMessage({cat:"ex_CreateContextMenus", topics:data});
        });
        alert("Successfully logged in.");
        location.reload();
      } else{
        alert("Login failed.");
      }
    });
  });
  $("#log1").keydown(function(e){
    if( e.which == 13){
      $("#pass1").focus();
    }
  });
  $("#pass1").keydown(function(e){
    if( e.which == 13){
      $("#login").click();
    }
  })

});


