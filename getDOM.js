
function getSelectionHtml(){
    var ret =  document.location.href + "|||||" + document.documentElement.innerHTML + "|||||" + document.title;
    return ret;
}
getSelectionHtml();