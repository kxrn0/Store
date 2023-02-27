function download_image() {
	const image = window.event.target.parentElement.querySelector("img");
	const a = document.createElement("a");
	const contentType = /data:image\/(\w+);base64/.exec(image.src)[1];
	const name = `${Math.random().toString(16).slice(-10)}.${contentType}`;

	a.href = image.src;
	a.download = name;
	a.click();
}
