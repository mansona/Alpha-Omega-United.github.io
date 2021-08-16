// Search.js - inputfield search aprser
// Author: ItsOiK
// original Date: 01/07-2021
// this version Date: 16/08-2021

//TODO -------------------------------- SEARCH FUNC ------------------------------------- //
function fillList(userList) {
	var list_to_return = [];
	if (Array.isArray(userList)) {
		for (var i = 0; i < userList.length; i++) {
			list_to_return.push(userList[i]);
		}
	} else if (typeof userList === "object") {
		for (const [key, value] of Object.entries(userList)) {
			list_to_return.push(key)
		}
	}
	return list_to_return;
}

function parse_module_results(textcontroller, parentDiv, listOfContent, contentObject) {
	parentDiv.innerHTML = "";
	if (textcontroller.value.length > 0) {
		var data = textcontroller.value;
		console.log(listOfContent)
		var otherData = listOfContent.filter((str) => str.toLowerCase().includes(data.toLowerCase()));
		if (otherData.length > 0) {
			textcontroller.style.background = "#363636"
			for (item of otherData) {
				const opt = makeSearchHtml(item, contentObject[item].points)
				parentDiv.appendChild(opt)
			}
		} else {
			textcontroller.style.background = "#7E0000"
			//            console.log("no hits")
		}
	} else {
		textcontroller.style.background = "#363636"
		for (option of listOfContent) {
			const opt = makeSearchHtml(option, contentObject[option].points)
			parentDiv.appendChild(opt)
		}
	}
}

function makeSearchHtml(name, points) {
	const pointString = `points: ${points}`;
	const adminUserButtons = `<div class="admin-user-buttons">
							<button onclick="modifyUserButtonHandler(this)" class="edit-user" value="${name}" id="edit-user">EDIT</button>
							<button onclick="modifyUserButtonHandler(this)" class="delete-user" value="${name}" id="delete-user">DELETE</button>
							</div>
							`;
	const opt = document.createElement("div");
	opt.classList.add("follow")
	opt.innerHTML = `<div><a href="https://twitch.tv/${name}" target="_blank">${name}</a>
					<br>
					${pointString}
					</div>
					${adminUserButtons}
					`;
	return opt
}