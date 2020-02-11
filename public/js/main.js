// EXTENDED JS
//Finds y value of given object
function findPos(obj) {
	var curtop = 0;
	if (obj.offsetParent) {
		do {
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return [curtop];
	}
}

// uses jquery to send delete request (logged in only)
function yeet(url, callback) {
	$.ajax({
			url: url,
			type: 'DELETE',
			success: callback
		});
}

function find_yeet() {
	var all_hrefs = document.getElementById("list").getElementsByTagName("a")
	var btn = document.getElementsByTagName("button")[0]
	btn.setAttribute("class", "btn btn-warning cancel");
	btn.setAttribute("onclick", "stop_yeet()");
	btn.getElementsByTagName("span")[0].textContent = "Cancel"

	for (let i = 0; i < all_hrefs.length; i++) {
		var del_url = all_hrefs[i].href;
		all_hrefs[i].removeAttribute("href");
		all_hrefs[i].setAttribute("id", "del");
		all_hrefs[i].setAttribute("onclick", "yeet('"+del_url+"', (r)=>{location.reload();})");
	}

}

function stop_yeet() {
	var all_hrefs = document.getElementById("list").getElementsByTagName("a")
	var btn = document.getElementsByTagName("button")[0]
	btn.setAttribute("class", "btn btn-danger delete");
	btn.setAttribute("onclick", "find_yeet()");
	btn.getElementsByTagName("span")[0].textContent = "Delete a file"

	for (let i = 0; i < all_hrefs.length; i++) {
		var del_url = all_hrefs[i].onclick.toString().split("{")[1].split("(")[1].slice(1).split("'")[0];
		all_hrefs[i].removeAttribute("onclick");
		all_hrefs[i].removeAttribute("id");
		all_hrefs[i].setAttribute("href", del_url);
	}
}