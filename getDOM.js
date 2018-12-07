
function getSelectionHtml(){
    var ret =  document.location.href + "|||||" + document.documentElement.innerHTML;
    return ret;
}
getSelectionHtml();