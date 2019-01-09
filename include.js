var reqUrl = "http://localhost/loger/api_context.php";
// var reqUrl = "http://guu267.com/loger/api_context.php";

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
  for( var i = 0; i < lstSubMenus.length; i++){
    $("#selTopic").append("<option>" + lstSubMenus[i] + "</option>");
  }
});
chrome.storage.sync.get('loger_token', function(data){
  if( data.loger_token){
    $(".loginFields").hide();
    $(".mainFields").show();
  }
});

function requestLogin(url,log1,pass1){
  var request = new XMLHttpRequest();
  request.open('GET',url+"?action=verifyUser&email="+log1+"&pass="+pass1, false);
  request.onreadystatechange = function (o){
      if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        chrome.storage.sync.set({loger_token:request.responseText});
        if( !request.responseText ){
          alert("Login failed.");
        } else{
          alert("Successfully logged in.");
        }
      }else if(request.readyState === XMLHttpRequest.DONE && request.status !== 200){
          console.log('ERROR REQUEST STATUS = ' + request.status);
      }
  };
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.send();
}

$(function () {
  $("#login").click(function () {
    // requestLogin("http://siblola.pythonanywhere.com/auth",$("#log1").val(),$("#pass1").val()); 
    requestLogin( reqUrl,$("#log1").val(),$("#pass1").val()); 
  });
  $("#btnEraseAll").click(function(){
    chrome.storage.sync.set({loger_token:""});
    chrome.storage.sync.set({topics:""});
  });

  $("#logout").click(function () {
    localStorage["ext_user_token1"] = "logout";
    chrome.storage.sync.set({loger_token:""});
    location.reload();
  });
  $("#btnDashboard").click(function(){
    chrome.tabs.create({ url: "options.html" });
    // chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
  });
  $(window).load(function () {
    if((localStorage["ext_user_token1"]!==undefined)&&(localStorage["ext_user_token1"]!=="logout")){
      $('#logForm').hide()
      // $('#logout').show()
    }
    if(localStorage["ext_user_token1"]=="logout"){
      // $('#logout').hide()
      $('#logForm').show()
    }
  });
});


