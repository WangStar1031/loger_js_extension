// var reqUrl = "http://localhost/loger/api_context.php";
var reqUrl = "http://guu267.com/loger/api_context.php";

function requestLogin(url,log1,pass1){
  var request = new XMLHttpRequest();
  // request.open('GET',url+"?login="+log1+"&password="+pass1, false);
  request.open('GET',url+"?action=verifyUser&email="+log1+"&pass="+pass1, false);
  request.onreadystatechange = function (o){
      if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        chrome.storage.sync.set({loger_token:request.responseText});
        console.log(request.responseText);
        //localStorage["ext_user_token1"] = JSON.parse(request.responseText).token
        alert("DEBUG --" + request.responseText);
         
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

  $("#logout").click(function () {
    localStorage["ext_user_token1"] = "logout"
    location.reload();
  });

  $(window).load(function () {
    if((localStorage["ext_user_token1"]!==undefined)&&(localStorage["ext_user_token1"]!=="logout")){
      $('#logForm').hide()
      $('#logout').show()
    }
    if(localStorage["ext_user_token1"]=="logout"){
      $('#logout').hide()
      $('#logForm').show()
    }
  });
});


