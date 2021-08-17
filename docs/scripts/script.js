// obsManager.js - OBS-StreamDeck Thingy
// Author: ItsOiK
// Date: 06/08-2021

// const AOU_WEB_SECRET = process.env.AOU_WEB_SECRET

AOU_HEROKU_ENDPOINT = "https://aou-website-backend.herokuapp.com/"


const AOU_WEB_CLIENT_ID = "oijx3i1zco4074rk6vu0yxqjkbticz";
const redirect = "https://alpha-omega-united.github.io/";
const scopes = "user:read:follows";
const scope = "&scope=" + scopes;

const USER_ENDPOINT = "https://api.twitch.tv/helix/users";
const FOLLOW_ENDPOINT = "https://api.twitch.tv/helix/users/follows?from_id=";

const loginButton = document.getElementById('login-button')
const hamburgerMenuButton = document.querySelector("#hamburger-menu")
const sidebarMenu = document.querySelector("#menu")
const contentContainer = document.querySelector("#content")
const loginLink = document.getElementById('authorize_public')
const headerBottom = document.getElementById('header-bottom')

let pageinationCursor,
	allFollows = {},
	admins = [],
	users = {};

let gottenUserVar,
	gottenFollowsVar,
	isLoggedIn = false,
	loggedInAs = "",
	loggedInId = "",
	user_token = null;

loginLink.setAttribute('href',
	'https://id.twitch.tv/oauth2/authorize?client_id='
	+ AOU_WEB_CLIENT_ID
	+ '&redirect_uri='
	+ encodeURIComponent(redirect)
	+ '&response_type=token'
	+ scope
);


//!* ---------------------- HTML ---------------------- *//
const INDEX_HTML = `<h1>Welcome to Alpha Omega United's homepage</h1>
					<hr>
					<ul>
						<li>On this site there will be goodies for the AoU community, such as overlays to use on stream, discord
							bot integration, twitch integration and more</li>
					</ul>
					<hr>
					<ul>
						<li>this site is very much under development :D<br>
							-itsOiK 06/08/20</li>
					</ul>`;
const ASSETS_HTML = `<h3>Click on an image to save it</h3>
					<div class="assets-container">
						<div class="assets-img-container">
							<div>Logo with title</div>
							<a href="assets/logo.png" target="_blank"><img src="assets/logo.png"></a>
						</div>
						<div class="assets-img-container">
							<div>Just logo, large</div>
							<a href="assets/logo_large.png" target="_blank"><img src="assets/logo_large.png"></a>
						</div>
						<div class="assets-img-container">
							<div>Twitch Panel</div>
							<a href="assets/Panel.png" target="_blank"><img src="assets/Panel.png"></a>
						</div>
					</div>`;
const RECRUITMENT_HTML = `<div><h2>Hey @ everyone,</h2> AOU currently is currently under development and we are improving this as we speak. You would have seen some changes being made on some channels or that they are removed on the <a href="https://discord.gg/P5qnher4kV">AoU Discord</a>.
					We are organising our team and we would like some more people to join our admin team. This will help us greatly so we can get the community up and running as soon as possible.
					Below are the roles that we are looking for and the description of each of the roles:

					<h3>Social Secretary:</h3>
					<li>
						Responsible for planning and running community events, provide a diverse range of events which meet the needs and interests of the community members. Make sure that all events are inclusive, safe and fun for all community members. Be friendly and approachable.
						Posting on #📣｜announcements to let everyone know in advance what event is happen (maybe a weekly announcements/schedule to begin with? like a schedule) Work with tourney organizers with events.
					</li>
					<h3>Promoters:</h3>
					<li>
						Promote AOU community as a whole on Social Media like Facebook, Instagram, TikTok, YT (add more if you need), create a positive image for AOU. You would need to understand the main objective of AOU is, take questions and address concerns.
						Working along with Editor and designer, posting videos onto various platform to increase the discoverability on AOU.
					</li>
					<h3>Designers:</h3>
					<li>
						Working with AOU Admins, designing concepts, graphics and overlays for branding AOU.
						There will be a specific channel dedicate to all your artwork and designs, you can promote and engage with new members with regards of new jobs and designs.
					</li>
					<h3>Editors:</h3>
					<li>
						Receive clips from AOU streamers, make montages and provide contents for 1min videos to 10 mins videos. Work with Promoters and uploading them onto Instagram Reels, TikTok, longer videos to YT.
						There will be a specific channel for you to show off your edits and content, you can promote and engage with new members with regards of new jobs.
					</li>
					<br>
					<br>
					<hr>
					To apply for these roles, please join the <a href="https://discord.gg/P5qnher4kV">AoU Discord</a> and message any one in the admin team, say which role you want to be, the reason why and how you can bring the community to reach new levels. This will go on for a week and then the week after, if there are 2 or more members competing, then we will let you all vote! 😃					</div>`;

//! ADMIN PANEL HTML
const ADMIN_HTML = { html: "" };
const ADMIN_TEST = `<div>
						<div>
							<button value="DELETE" onclick="getMembers_DEV("DEV")">DEV</button>
							<!--
							<button value="QUERYONE" onclick="queryDb("QUERYONE")">QUERYONE</button>
							<button value="QUERYMANY" onclick="queryDb("QUERYMANY")">QUERYMANY</button>
							<button value="EDIT" onclick="queryDb("EDIT")">EDIT</button>
							-->
							<hr>
							<button value="ADD" onclick="modifyUserButtonHandler(this)">ADD USER</button>
							</div>
							<div class="input-div search-input">
							<div>Search:</div>
							<input type="text" class="text-input" oninput="onSearchInput(this)" name="search-input-field" id="search-input-field" Placeholder="Search Name/Id">
							<button value="clear" onclick="modifyUserButtonHandler(this)">x</button>
						</div>
					</div>`;

//! LOGGED IN HTML
const LOGGED_IN_HTML = { html: "<div><h1>Members you have not followed</h1><hr></div>" }
const LOGGED_IN_HTML_MENU = `<button onclick="menuButtonHandler('POINTS')" value="POINTS">Your Points</button>
							<button onclick="menuButtonHandler('PLACEHOLDER3')" value="PLACEHOLDER3">PLACEHOLDER3</button>
							<button onclick="menuButtonHandler('PLACEHOLDER4')" value="PLACEHOLDER4">PLACEHOLDER4</button>
							<button onclick="menuButtonHandler('PLACEHOLDER5')" value="PLACEHOLDER5">PLACEHOLDER5</button>
							<button onclick="menuButtonHandler('LIVE')" value="LIVE">Live Now</button>
							<button onclick="menuButtonHandler('LOGIN')" value="LOGIN">AoU Members</button>`;
const EMBEDDED_HTML = `<script src="https://embed.twitch.tv/embed/v1.js"></script>
						<!-- Create a Twitch.Embed object that will render within the "twitch-embed" element -->
						<script type="text/javascript">
						new Twitch.Embed("twitch-embed", {
							width: 854,
							height: 480,
							channel: "theserbian_",
							// Only needed if this page is going to be embedded on other websites
							parent: ["https://alpha-omega-united.github.io/", "github.io", "github.com"]
						});
						</script>`;

//! POPUP HTML
const ROLES_LIST = ["@everyone", "aou dev", "admin"]
const MEMBER_POPUP_HTML = `<div class="edit-member-popup">
							<div class="input-div">
								<div>Twitch Name:</div>
								<input type="text" class="text-input" name="twitch_name-input" id="twitch_name-input" Placeholder="Twitch Name">
							</div>
							<div class="input-div">
								<div>Twitch ID:</div>
								<input type="number" class="text-input" name="twitch_id-input" id="twitch_id-input" Placeholder="Twitch ID">
							</div>
							<div class="input-div">
								<div>Discord Name:</div>
								<input type="text" class="text-input" name="discord_name-input" id="discord_name-input" Placeholder="Discord Name">
							</div>
							<div class="input-div">
								<div>Discord ID:</div>
								<input type="number" class="text-input" name="discord_id-input" id="discord_id-input" Placeholder="Discord ID">
							</div>
							<div class="input-div">
								<div>Points:</div>
								<input type="number" class="text-input" name="points-input" id="points-input" Placeholder="Points" value="0">
							</div>
							<div class="input-div">
								<div>
									<input id="isAdmin" type="checkbox" disabled>
									<label for="isAdmin">is Admin</label>
								</div>
							</div>
						</div>`;
const DELETE_MEMBER_POPUP_HTML = `<div>Are you sure you want to delete</div>
								<div class="popup-delete-content" id="popup-delete-content">DELETE PLACEHOLDER</div>`;
//! /HTML



//!* ---------------------- SELECTORS ---------------------- *//
const popupTitle = document.querySelector("#popup-title")
const popupContent = document.querySelector("#popup-content")
const popup = document.querySelector("#popup")
//! /SELECTORS



//!* ---------------------- SEARCH INPUT PARSE ---------------------- *//
let memberObject1 = ""
let filledList = ""
async function populateSearchArrays() {
	memberObject1 = await getMembers()
	filledList = fillList(memberObject1.users)
}
function onSearchInput(e) {
	parse_module_results(e, document.querySelector("#follow-container"), filledList, memberObject1.users)
}
//! /SEARCH INPUT PARSE




//!* ---------------------- POPUP ---------------------- *//
function popupButtonHandler(buttonEvent, action) {
	if (buttonEvent.id.includes("cancel")) {
		//TODO ---- this
	} else if (buttonEvent.id.includes("ok")) {
		const data = getPopupInputValues()
		if (buttonEvent.value == "add") {
			queryDb("ADD")
		}
		console.log(data)
	}
	clearPopupInputField(action) // TODO add cancel func
	popup.classList.add("overlay-hide")
}
function setPopupButtonText(button1, button2, action) {
	const popupButtonOk = document.querySelector("#popup-button-ok")
	const popupButtonCancel = document.querySelector("#popup-button-cancel")
	popupButtonOk.innerText = button1
	popupButtonOk.value = action
	popupButtonCancel.innerText = button2
	popupButtonCancel.value = action
}
function clearPopupInputField(action) {
	if (action == "delete") {
		//TODO idk
	}
	if (action == "add" || action == "edit") {
		document.querySelector("#twitch_name-input").value = ""
		document.querySelector("#twitch_id-input").value = ""
		document.querySelector("#discord_name-input").value = ""
		document.querySelector("#discord_id-input").value = ""
		document.querySelector("#points-input").value = ""
		// document.querySelector("#roles-listbox").value = ""
	}
}
function getPopupInputValues() {
	const twitchName = document.querySelector("#twitch_name-input").value
	const twitchId = parseInt(document.querySelector("#twitch_id-input").value)
	const discordName = document.querySelector("#discord_name-input").value
	const discordId = (document.querySelector("#discord_id-input").value.length > 0 ? parseInt(document.querySelector("#discord_id-input").value) : null)
	const points = parseInt(document.querySelector("#points-input").value)
	return { twitchName, twitchId, discordName, discordId, points }
}
function openPopup(title, html, button1, button2, action) {
	setPopupButtonText(button1, button2, action)
	popup.classList.remove("overlay-hide")
	popupTitle.innerHTML = title.toUpperCase()
	popupContent.innerHTML = html
}
//! ADMIN POPUP BUTTONS
function modifyUserButtonHandler(buttonEvent) {
	// console.log(buttonEvent)
	if (buttonEvent.id == "edit-user") {
		openPopup("Edit member", MEMBER_POPUP_HTML, "SAVE", "Cancel", "edit")

		//TODO grab data from DB populate fields
		document.querySelector("#twitch_name-input").value = "UserNameOfSomeone" //! PLACEHOLDERS
		document.querySelector("#twitch_id-input").value = 981251231237 //! PLACEHOLDERS
		document.querySelector("#discord_name-input").value = "DiscordNameOfSomeone" //! PLACEHOLDERS
		document.querySelector("#discord_id-input").value = 7623414912 //! PLACEHOLDERS
		document.querySelector("#points-input").value = 091214248190 //! PLACEHOLDERS
	} else if (buttonEvent.id == "delete-user") {
		openPopup("Delete member", DELETE_MEMBER_POPUP_HTML, "OK", "Cancel", "delete")
		const deleteMember = document.querySelector("#popup-delete-content")
		//TODO grab data from DB populate fields
		deleteMember.innerHTML = "MEMBER NAME" //! PLACEHOLDER
	} else if (buttonEvent.value == "ADD") {
		openPopup("add new member", MEMBER_POPUP_HTML, "SAVE", "Cancel", "add")
	} else if (buttonEvent.value == "clear") {
		const searchInput = document.querySelector("#search-input-field");
		searchInput.value = ''
		parse_module_results(searchInput, document.querySelector("#follow-container"), filledList, memberObject1.users)
	}
}
//! /POPUP



//!* ---------------------- DB QUERY ---------------------- *//
async function queryDb(QueryType) {
	console.log(QueryType)
	let databaseQuery = { query: QueryType }
	if (["ADD", "EDIT", "DELETE"].includes(QueryType)) {
		databaseQuery.userData = getPopupInputValues()
	};
	const endpoint = AOU_HEROKU_ENDPOINT;
	const path = "database";
	const data = { userName: loggedInAs, userToken: user_token, databaseQuery };
	ajaxApi(endpoint, path, "POST", data);
}

async function ajaxApi(endpoint, path, method = "GET", data = null) {
	if (method == "GET") {
		// jQuery get example:
		await $.ajax({
			url: endpoint + path,
			success: (response) => resolve(response),
			error: function (request, status, error) {
				console.log(request)
				console.log(status)
				console.log(error)
			}
		});
	} else if (method == "POST" || method == "PUT") {
		// jQuery post/put example:
		await $.ajax({
			url: endpoint + path,
			type: method,
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: (response) => resolve(response),
		});
	}
	function resolve(response) {
		console.log(response)
	}
}
//! /DB QUERY


//!* ---------------------- COOKIES ---------------------- *//
function setCookies(variable, deleteCookie = false) {
	if (deleteCookie) {
		document.cookie = variable + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
	} else {
		let expireDateUtc = new Date(new Date().getTime() + 86400000).toUTCString()
		document.cookie = variable + `; expires=${expireDateUtc}; samesite=strict`
	}
}
if (document.cookie) {
	let cookies = {}
	document.cookie.split("; ").forEach((element) => {
		cookies[element.split("=")[0]] = element.split("=")[1]
	})
	isLoggedIn = cookies["isLoggedIn"]
	loggedInAs = cookies["loggedInAs"]
	loggedInId = cookies["loggedInId"]
	user_token = cookies["user_token"]
	if (isLoggedIn) {
		userLoggedIn(loggedInAs)
		getFollowsAndAddHtml(loggedInId, user_token, loggedInAs)
	}
}
//! /COOKIES




//!* ---------------------- MENU ---------------------- *//
function hamburgerMenuHandler(event) {
	sidebarMenu.classList.toggle("menu-hide")
}
async function menuButtonHandler(buttonEvent) {
	contentContainer.innerHTML = ""
	if (buttonEvent == "HOME") {
		addHtmlChild(contentContainer, INDEX_HTML, "INDEX_HTML", "INDEX_HTML")
	}
	if (buttonEvent == "ASSETS") {
		addHtmlChild(contentContainer, ASSETS_HTML, "ASSETS_HTML", "ASSETS_HTML")
	}
	if (buttonEvent == "RECRUITMENT") {
		addHtmlChild(contentContainer, RECRUITMENT_HTML, "RECRUITMENT_HTML", "RECRUITMENT_HTML")
	}
	if (buttonEvent == "EMBEDDED") {
		addHtmlChild(contentContainer, EMBEDDED_HTML, "EMBEDDED_HTML", "EMBEDDED_HTML")
	}
	if (buttonEvent == "LOGIN") {
		if (isLoggedIn) {
			addHtmlChild(contentContainer, LOGGED_IN_HTML_MENU, "logged-in-sub-menu", "logged-in-sub-menu")
			addHtmlChild(contentContainer, "", "", "", "hr")
			addHtmlChild(contentContainer, "", "follow-container", "follow-container")
			document.querySelector("#follow-container").innerHTML = LOGGED_IN_HTML.html
		} else {
			contentContainer.innerHTML = "You will be sent to twitch for login and returned here upon completion"
		}
	}
	if (buttonEvent == "ADMIN") {
		if (ADMIN_HTML.html == "") {
			const members = await getMembers();
			ADMIN_HTML.html = buildUserHtml(members.users);
		}
		const thisHTML = `<h1>All registered members are listed here</h1><br>${ADMIN_TEST}<hr>`
		contentContainer.innerHTML = ""
		addHtmlChild(contentContainer, thisHTML, "logged-in-sub-menu", "logged-in-sub-menu")
		addHtmlChild(contentContainer, ADMIN_HTML.html, "follow-container", "follow-container")
	}
	if (buttonEvent == "POINTS") {
		const members = await getMembers();
		let userPoints = {};
		userPoints[loggedInAs.toLowerCase()] = members.users[loggedInAs.toLowerCase()];
		addHtmlChild(contentContainer, LOGGED_IN_HTML_MENU, "logged-in-sub-menu", "logged-in-sub-menu")
		addHtmlChild(document.querySelector("#follow-container"), buildUserHtml(userPoints), "follow-container", "follow-container")
	}
	if (buttonEvent == "LIVE") {
		addHtmlChild(contentContainer, LOGGED_IN_HTML_MENU, "logged-in-sub-menu", "logged-in-sub-menu")
		// TODO - make happen
	}
	if (buttonEvent.includes("PLACEHOLDER")) {
		addHtmlChild(contentContainer, LOGGED_IN_HTML_MENU, "logged-in-sub-menu", "logged-in-sub-menu")
		addHtmlChild(document.querySelector("#follow-container"), buttonEvent, "buttonEvent", "buttonEvent")
	}
}
//! /MENU


//* ---------------------- TWITCH STUFF ---------------------- *//
async function twitchApiGet(endpoint, token) {
	let result = await fetch(
		endpoint,
		{
			"headers": {
				"Client-ID": AOU_WEB_CLIENT_ID,
				"Authorization": "Bearer " + token
			}
		}
	)
		.then(response => {
			if (!response.ok) {
				setCookies(`loggedInAs=`, true)
				setCookies(`isLoggedIn=`, true)
				setCookies(`loggedInId=`, true)
				setCookies(`user_token=`, true)
				loginButton.remove()
				headerBottom.appendChild(makeLoginButtonLink())
				resultJson = false
				throw "api failed"
			} else {
				resultJson = response.json()
				return resultJson
			}
		});
	return result
}

function makeLoginButtonLink() {
	const loginButtonLink = document.createElement("a")
	loginButtonLink.id = "authorize_public"
	loginButtonLink.setAttribute('href',
		'https://id.twitch.tv/oauth2/authorize?client_id='
		+ AOU_WEB_CLIENT_ID
		+ '&redirect_uri='
		+ encodeURIComponent(redirect)
		+ '&response_type=token'
		+ scope
	);
	loginButtonLink.innerHTML = `<button id="login-button" onclick="menuButtonHandler('LOGIN')" value="LOGIN">LOGIN</button>`
	return loginButtonLink
}

async function getTokenFromHash() {
	if (document.location.hash && document.location.hash != '') {
		var parsedHash = new URLSearchParams(window.location.hash.substr(1));
		if (parsedHash.get('access_token')) {
			user_token = parsedHash.get('access_token');
			window.location.hash = ""
			isLoggedIn = true
			await getUserId(user_token).then(async (response) => {
				console.log(response)
				let userId = response["data"][0].id,
					displayName = response["data"][0].display_name,
					loginName = response["data"][0].login;
				userLoggedIn(displayName)
				setCookies(`loggedInAs=${displayName}`)
				setCookies(`isLoggedIn=${isLoggedIn}`)
				setCookies(`loggedInId=${userId}`)
				setCookies(`user_token=${user_token}`)
				getFollowsAndAddHtml(userId, user_token, displayName)
			})
		}
	} else if (document.location.search && document.location.search != '') {
		var parsedParams = new URLSearchParams(window.location.search);
		if (parsedParams.get('error_description')) {
			console.error(parsedParams.get('error') + ' - ' + parsedParams.get('error_description'))
		}
	}
}
async function getUserId(token) {
	let userData = await twitchApiGet(USER_ENDPOINT, token)
	if (userData) {
		return userData
	}
}

async function getFollowsAndAddHtml(userId, user_token, loggedInAs) {
	await getFollowsPaginated(userId, user_token)
	const memberData = await parseMemberData()
	console.log(memberData)
	console.log(loggedInAs)
	toggleAdminButtonVisibility(memberData, loggedInAs)
	let notFollowMembers = checkFollowMember(memberData.users, loggedInAs)
	LOGGED_IN_HTML["html"] += buildUserHtml(notFollowMembers, false)
	contentContainer.innerHTML = ""
	addHtmlChild(contentContainer, LOGGED_IN_HTML_MENU, "logged-in-sub-menu", "logged-in-sub-menu")
	addHtmlChild(contentContainer, "", "", "", "hr")
	addHtmlChild(contentContainer, "", "follow-container", "follow-container")
	document.querySelector("#follow-container").innerHTML = LOGGED_IN_HTML.html
}


async function getFollowsPaginated(userId, token) {
	let endpoint = FOLLOW_ENDPOINT + `${userId}` + "&first=100"
	let followData = await twitchApiGet(endpoint, token)
	if (followData) {
		let followCount = followData["data"].length
		parseFollowData(followData["data"])
		pageinationCursor = followData["pagination"]["cursor"]
		while (followCount < parseInt(followData.total)) {
			pageEndpoint = endpoint + "&after=" + pageinationCursor
			var newData = await twitchApiGet(pageEndpoint, token)
			if (newData) {
				parseFollowData(newData["data"])
				followCount += followData["data"].length
				pageinationCursor = newData["pagination"]["cursor"]
			} else {
				console.error("something bad happened")
			}
		}
	} else {
		console.error("something bad happened")
	}
}

function parseFollowData(data) {
	data.forEach(follow => {
		allFollows[follow["to_name"].toLowerCase()] = follow["to_id"]
	});
}


function buildUserHtml(membersObject, includePoints = true) {
	let followHtml = ""
	let pointString = ""
	let adminUserButtons = ""
	for (const [key, value] of Object.entries(membersObject)) {
		if (includePoints) {
			pointString = `points: ${value.points}`
			adminUserButtons = `<div class="admin-user-buttons">
									<button onclick="modifyUserButtonHandler(this)" class="edit-user" value="${key}" id="edit-user">EDIT</button>
									<button onclick="modifyUserButtonHandler(this)" class="delete-user" value="${key}" id="delete-user">DELETE</button>
								</div>`
		}
		followHtml += `
			<div class="follow">
				<div><a href="https://twitch.tv/${key}" target="_blank">${key}</a>
				<br>
				${pointString}
				</div>
				${adminUserButtons}
			</div>
			`
	}
	return followHtml
}

function addHtmlChild(parent, html, htmlId, htmlClass, elementType = "div") {
	const element = document.createElement(elementType);
	if (htmlId.length > 0) {
		element.id = htmlId
	}
	if (htmlClass.length > 0) {
		element.classList.add(htmlClass)
	}
	if (html.length > 0) {
		element.innerHTML = html
	}
	parent.appendChild(element);
}
//! -----------------------------------------------------
//! --------------------- TEST AREA ---------------------
//! -----------------------------------------------------
//TODO get data from DB
//TODO parse data
//TODO
//TODO

// menuButtonHandler("ADMIN")

async function getMembers_DEV() {
	const result = await queryDb("QUERYGETALL")
	console.log(result)
}


async function getMembers() {
	//TODO get DB data here
	let data = await fetch("https://raw.githubusercontent.com/Alpha-Omega-United/AoU-Community/main/twitch_bot/data/aou_members.json")
		.then(res => res.json())
		.then(json => {
			return json
		})
	return data
}

async function parseMemberData() {
	await getMembers().then((data) => {
		for (const i in data["MODERATORS"]) {
			admins.push(data["MODERATORS"][i])
		}
		for (const [key, value] of Object.entries(data["users"])) {
			users[key] = value
		}
	})
	return { admins, users }
}


//! -----------------------------------------------------
//! --------------------- TEST AREA ---------------------
//! -----------------------------------------------------




function toggleAdminButtonVisibility(memberObject, user) {
	if (memberObject.admins.includes(user.toLowerCase())) {
		let adminButton = document.querySelector("#admin-button")
		adminButton.classList.remove("admin-button-hide")
	}
}

function checkFollowMember(memberObject, user) {
	let notFollowMembers = {}
	for (const [memberKey, memberValue] of Object.entries(memberObject)) {
		if (!(memberKey in allFollows) && memberKey.toLowerCase() != user.toLowerCase()) {
			notFollowMembers[memberKey.toLowerCase()] = memberValue
		}
	}
	return notFollowMembers
}

function userLoggedIn(user) {
	if (isLoggedIn) {
		unwrap(loginLink)
		loginButton.innerText = user
		loggedInAs = user
	}
}

// remove parent without removing childen
function unwrap(wrapper) {
	// place childNodes in document fragment
	var docFrag = document.createDocumentFragment();
	while (wrapper.firstChild) {
		var child = wrapper.removeChild(wrapper.firstChild);
		docFrag.appendChild(child);
	}
	// replace wrapper with document fragment
	wrapper.parentNode.replaceChild(docFrag, wrapper);
}

function adminPanel() {
	contentContainer.innerHTML = INDEX_HTML
}










//* ---------------- ON LOAD! ---------------- *//
onLoad()
function onLoad() {
	if (!document.location.hash) {
		contentContainer.innerHTML = INDEX_HTML
	} else {
		contentContainer.innerHTML = "<h1>LOADING...</h1>"
	}
	getTokenFromHash()
	populateSearchArrays()

};









//* ---------------- LAST UPDATED! ---------------- *//
getLastUpdated()
async function getLastUpdated() {
	let data = await fetch("https://raw.githubusercontent.com/Alpha-Omega-United/Alpha-Omega-United.github.io/main/docs/last_updated.txt")
		.then(res => res.text())
	console.log(data)
}
