var date = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
console.log(date.getFullYear());
console.log(monthNames[date.getMonth()]);
console.log(date.getDate());
console.log(date.getHours());
console.log(date.getMinutes());

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
	if( curIndex != -1){
		
	}
});
$(".btnContentTab").on('click', function(){
	$(".btnContentTab").removeClass("activeTab");
	$(this).addClass("activeTab");
});
