// ==UserScript==
// @name     Plebs Image Downloader
// @version  1
// @grant    none
// @match *://archive.4plebs.org/*
// ==/UserScript==

const posts = [...document.querySelectorAll("article.post")].filter((post) =>
	post.querySelector(".thread_image_link")
);
const downloadAll = document.createElement("button");
let links;

async function download_file(href) {
	const a = document.createElement("a");
	const name = `${Math.random().toString(16).slice(-10)}.${href
		.split(".")
		.at(-1)}`;
	const res = await fetch(href);
	const blob = await res.blob();
	const data = URL.createObjectURL(blob);

	a.href = data;
	a.download = name;
	a.click();

	URL.revokeObjectURL(data);
}

links = [];

posts.forEach((post) => {
	const check = document.createElement("input");

	check.setAttribute("type", "checkbox");
	check.addEventListener("change", (event) => {
		const link = post.querySelector(".thread_image_link").href;

		if (event.target.checked) return links.push(link);
		links = links.filter((other) => other !== link);
	});

	post.querySelector(".post_file").appendChild(check);
});

downloadAll.addEventListener("click", () =>
	links.forEach((link) => download_file(link))
);

downloadAll.style.position = "fixed";
downloadAll.style.top = "3rem";
downloadAll.style.right = "3rem";
downloadAll.innerText = "Download All";
document.body.appendChild(downloadAll);
