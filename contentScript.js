
html2canvas(document.querySelector("body"), {scale: 0.3}).then(canvas => {
	var image = new Image();
	image.src = canvas.toDataURL("image/png");
	chrome.runtime.sendMessage({cat:"ex_pageLoaded", image:image.src});
	// console.log(image);
});
