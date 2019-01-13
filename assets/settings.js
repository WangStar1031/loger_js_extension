// var reqUrl = "http://localhost/loger/api_context.php";
// var uploadUrl = "http://localhost/loger/fileUpload.php";

var reqUrl = "http://guu267.com/loger/api_context.php";
var uploadUrl = "http://guu267.com/loger/fileUpload.php";

var arrContents = [];
$(".btnCatTab").on('click', function(){
	$(".btnCatTab").removeClass("activeTab");
	$(this).addClass("activeTab");
	var curIndex = -1;
	for( var i = 0; i < $(".btnCatTab").length; i++){
		if( $(".btnCatTab").eq(i).hasClass("activeTab")){
			curIndex = i;
			break;
		}
	}
	$(".catContents>div").hide();
	switch(curIndex){
	case 0:
		$(".cat_case").show();
		break;
	case 1:
		$(".todo_case").show();
		break;
	case 2:
		$(".export_case").show();
		break;
	}
	if( curIndex != -1){

	}
});

$(".btnContentTab").on('click', function(){
	$(".btnContentTab").removeClass("activeTab");
	$(this).addClass("activeTab");
	$(".bellowContents").hide();
	for( var i = 0; i < $(".btnContentTab").length; i++){
		if( $(".btnContentTab").eq(i).hasClass("activeTab")){
			$(".bellowContents").eq(i).show();
		}
	}
});

var loger_token = "";

function removeUrl(_id){
	var ss = window.confirm("Are you sure to remove current url?");
	if( ss == true){
		var _topicName = $("#selTopic option:selected").html();
		$.get(reqUrl + "?action=removeContent&token=" + loger_token + "&topicName=" + _topicName + "&id=" + _id, function(data){
			if( data == "Removed."){
				$("#_" + _id).remove();
				getTopicInfo(_topicName);
			}
		});
	}
}
function removeNote(_id){
	var ss = window.confirm("Are you sure to remove current item?");
	if( ss == true){
		var _topicName = $("#selTopic option:selected").html();
		$.get(reqUrl + "?action=removeNote&token=" + loger_token + "&topicName=" + _topicName + "&id=" + _id, function(data){
			if( data == "OK"){
				$("#notesList li#" + _id).remove();
				getTopicInfo(_topicName);
			}
		});
	}
}
function removeTodo(_id){
	var ss = window.confirm("Are you sure to remove current item?");
	if( ss == true){
		var _topicName = $("#selTopic option:selected").html();
		$.get(reqUrl + "?action=removeTodo&token=" + loger_token + "&topicName=" + _topicName + "&id=" + _id, function(data){
			if( data == "OK"){
				$("#todolist li#" + _id).remove();
				getTopicInfo(_topicName);
			}
		});
	}
}
function baseName(str)
{
   var base = new String(str).substring(str.lastIndexOf('/') + 1); 
    // if(base.lastIndexOf(".") != -1)       
    //     base = base.substring(0, base.lastIndexOf("."));
   return base;
}
function getTopicInfo(_topicName){
	$.post(reqUrl, {action:"getTopicInfo", token: loger_token, topicName: _topicName}, function(data){
		if( data){
			var topicInfo = JSON.parse(data);
			console.log(topicInfo);
			var createdTime = topicInfo.createdTime;
			var arrTime = createdTime.split(" ");
			var arrDate = arrTime[0].split("-");
			var year = arrDate[0];
			var month = arrDate[1];
			var day = arrDate[2];
			var time = arrTime[1];
			var ap = arrTime[2];
			$("#caseInfoMD").html(month + " " + day + ",");
			$("#caseInfoYT").html(year + " " + time + " " + ap);
			$("#caseViewed").html( topicInfo.viewedCount);
			$("#casePhotos").html( topicInfo.photoTagged);
			$("#caseNotes").html( topicInfo.noteCount);
			var strHtml = "";
			if( topicInfo.todolist){
				for( var i = 0; i < topicInfo.todolist.length; i++){
					strHtml += '<li id="' + topicInfo.todolist[i].id + '">' + '<span title="remove" class="btnTodoRemove" id="' + topicInfo.todolist[i].id + '" style="cursor: pointer; color: blue;">&times;</span>&nbsp&nbsp&nbsp&nbsp' + topicInfo.todolist[i].content + "</li>";
				}
			}
			$("#todolist").html(strHtml);
			$(".btnTodoRemove").click(function(){
				var _id = $(this).attr("id");
				removeTodo(_id);
			});

			$(".imageGallary").html("");
			for( var i = 0; i < topicInfo.photoUrls.length; i++){
				strHtml = '<img src="' + topicInfo.photoUrls[i] + '">';
				$(".imageGallary").append(strHtml);
			}

			strHtml = "";
			if( topicInfo.notelist){
				for( var i = 0; i < topicInfo.notelist.length; i++){
					strHtml += '<li id="' + topicInfo.notelist[i].id + '">' + '<span title="remove" class="btnNoteRemove" id="' + topicInfo.notelist[i].id + '" style="cursor: pointer; color: blue;">&times;</span>&nbsp&nbsp&nbsp&nbsp' + topicInfo.notelist[i].content + "</li>";
				}
			}
			$("#notesList").html(strHtml);
			$(".btnNoteRemove").click(function(){
				var _id = $(this).attr("id");
				removeNote(_id);
			});
			$(".attachements ul").html("");
			for( var i = 0; i < topicInfo.attachementsUrls.length; i++){
				var url = topicInfo.attachementsUrls[i];
				strHtml = "<li><a href='" + url + "' download>" + baseName(url) + "</a></li>";
				$(".attachements ul").append(strHtml);
			}
		}
	});
	for( var j = 0; j < arrContents.length; j++){
		if( arrContents[j].topic == _topicName){
			var strHtml = "";
			var curContent = arrContents[j];
			if( curContent.urls){
				for( var i = 0; i < curContent.urls.length; i++){
					var curUrl = curContent.urls[i];
					strHtml += '<li id="_' + curUrl.id + '">';
						strHtml += '<span title="remove" class="btnRemove" id="' + curUrl.id + '" style="cursor: pointer; color: blue;">&times;</span>&nbsp&nbsp&nbsp&nbsp';
						strHtml += '<span><img src="' + curUrl.image + '" class="img_contents"></span>';
						strHtml += '<a href="' + curUrl.url + '" target="_blank">' + curUrl.title + '</a>';
					strHtml += '</li>';
				}
			}
			$("#historyList").html(strHtml);
			$(".btnRemove").click(function(){
				var _id = $(this).attr("id");
				removeUrl(_id);
			});
		}
	}
}
chrome.storage.sync.get('loger_token', function(data){
	if( data.loger_token){
		loger_token = data.loger_token;
		$("input[name=token]").val(loger_token);
		$.post(reqUrl, {action:"getTopics", token: loger_token}, function(data){
			var arrTopics = data.split("%%");
			for( var i = 0; i < arrTopics.length; i++){
				$("#selTopic").append("<option>" + arrTopics[i] + "</option>");
			}
			$("#topicTitle").html(arrTopics[0]);
			$("input[name=topicName]").val(arrTopics[0]);
			getTopicInfo(arrTopics[0]);
		});
		$.post(reqUrl, {action:"getAllWithToken", token: loger_token}, function(data){
			if( data){
				arrContents = JSON.parse(data);
				console.log(arrContents);
				var strHtml = "";
				var curContent = arrContents[0];
				for( var i = 0; i < curContent.urls.length; i++){
					var curUrl = curContent.urls[i];
					strHtml += '<li id="_' + curUrl.id + '">';
						strHtml += '<span title="remove" class="btnRemove" id="' + curUrl.id + '" style="cursor: pointer; color: blue;">&times;</span>&nbsp&nbsp&nbsp&nbsp';
						strHtml += '<span><img src="' + curUrl.image + '" class="img_contents"></span>';
						strHtml += '<a href="' + curUrl.url + '" target="_blank">' + curUrl.title + '</a>';
					strHtml += '</li>';
				}
				$("#historyList").html(strHtml);
				$(".btnRemove").click(function(){
					var _id = $(this).attr("id");
					remove(_id);
				});
			}
		});
	}
});

$("#selTopic").change(function(){
	var topicName = $("#selTopic option:selected").html();
	$("#topicTitle").html(topicName);
	$("input[name=topicName]").val(topicName);
	getTopicInfo(topicName);
});

$("#btnUpload").click(function(){
	var strTodo = $("#todoText").val();
	if( strTodo.trim() == ""){
		alert("Please insert the todo text.");
	} else{
		var topicName = $("#selTopic option:selected").html();
		$.post(reqUrl, {action:"insertTodo", token: loger_token, topic: topicName, todoText: strTodo}, function(data){
			if(data){
				getTopicInfo(topicName);
				$("#todoText").val("");
			}
		});
	}
});

$("#btnNoteUpload").click(function(){
	var strTodo = $("#NoteText").val();
	if( strTodo.trim() == ""){
		alert("Please insert the Note text.");
	} else{
		var topicName = $("#selTopic option:selected").html();
		$.post(reqUrl, {action:"insertNote", token: loger_token, topic: topicName, NoteText: strTodo}, function(data){
			if(data){
				getTopicInfo(topicName);
				$("#NoteText").val("");
			}
		});
	}
});

$("#btnNewTopic").click(function(){
	topicName = prompt("Please enter new Topic name", "New Topic");
	if (topicName != null) {
		$.post(reqUrl, { action:"addTopic", token: loger_token, topic: topicName}, function(data){
			if( data == "OK"){
				chrome.contextMenus.create({
					title: topicName,
					contexts: ["all"],
					id: topicName,
					type: "radio",
					onclick: function(info, tab){
						_menuId = info.menuItemId;
						chrome.storage.sync.set({topic:_menuId});
						chrome.contextMenus.update(_menuId, {checked: true});
					}
				});
			}else {
				alert(data);
			}
		});
	}
});

$(document).ready(function (e) {
	$("#photoUpload").on('submit',(function(e) {
		e.preventDefault();
		$.ajax({
			url: uploadUrl,
			type: "POST",
			data:  new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){
				if(data=='uploaded') {
					$("#photoUpload")[0].reset(); 
					getTopicInfo($("#selTopic option:selected").html());
				}
			}          
		});
	}));
	$("#attachementsUpload").on('submit',(function(e) {
		e.preventDefault();
		$.ajax({
			url: uploadUrl,
			type: "POST",
			data:  new FormData(this),
			contentType: false,
			cache: false,
			processData:false,
			success: function(data){
				if(data=='uploaded') {
					$("#attachementsUpload")[0].reset(); 
					getTopicInfo($("#selTopic option:selected").html());
				}
			}          
		});
	}));
});