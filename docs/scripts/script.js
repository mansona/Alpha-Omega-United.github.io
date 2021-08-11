// obsManager.js - OBS-StreamDeck Thingy
// Author: ItsOiK
// Date: 06/08-2021


AOU_WEB_CLIENT_ID = "oijx3i1zco4074rk6vu0yxqjkbticz"
AOU_WEB_SECRET = ""
AOU_WEB_REDIRECT = ""


let counter = 0;



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
					</div>`

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
					To apply for these roles, please join the <a href="https://discord.gg/P5qnher4kV">AoU Discord</a> and message any one in the admin team, say which role you want to be, the reason why and how you can bring the community to reach new levels. This will go on for a week and then the week after, if there are 2 or more members competing, then we will let you all vote! 😃					</div>`

// const COUNTER_HTML = `${counter}`

const EMBEDDED_HTML = `embed twithc player/chat here`

const hamburgerMenuButton = document.querySelector("#hamburger-menu")
const sidebarMenu = document.querySelector("#menu")
const contentContainer = document.querySelector("#content")

function onLoad(){
	contentContainer.innerHTML = INDEX_HTML
}
onLoad()

function hamburgerMenuHandler(event){
	sidebarMenu.classList.toggle("menu-hide")
}

function menuButtonHandler(event){
	counter++;
	if (event == "HOME"){
		contentContainer.innerHTML = INDEX_HTML
	} else if (event == "ASSETS") {
		contentContainer.innerHTML = ASSETS_HTML
	} else if (event == "RECRUITMENT") {
		contentContainer.innerHTML = RECRUITMENT_HTML
	} else if (event == "COUNTER") {
		contentContainer.innerHTML = counter
	} else if (event == "EMBEDDED") {
		contentContainer.innerHTML = EMBEDDED_HTML
	} else if (event == "LOGIN") {
		contentContainer.innerHTML = ""
	}
}



//* ---------------------- TWITCH STUFF ---------------------- *//
let client_id = "oijx3i1zco4074rk6vu0yxqjkbticz",
	redirect = "https://alpha-omega-united.github.io/",
	scopes = "user:read:follows",
	scope = "&scope=" + scopes;

let gottenUserVar, gottenFollowsVar, user_token = null;
const USER_ENDPOINT = "https://api.twitch.tv/helix/users";
const FOLLOW_ENDPOINT = "https://api.twitch.tv/helix/users/follows?from_id=";



document.getElementById('authorize_public')
	.setAttribute('href',
	'https://id.twitch.tv/oauth2/authorize?client_id='
		+ client_id
		+ '&redirect_uri='
		+ encodeURIComponent(redirect)
		+ '&response_type=token'
		+ scope
	);




async function twitchApiGet(endpoint, token) {
	const response = await fetch(
		endpoint,
		{
			"headers": {
				"Client-ID": client_id,
				"Authorization": "Bearer " + token
			}
		}
	)
	const response_json = await response.json()
	console.log(response_json)
	return response_json
}

async function twitchApiPost(endpoint, params, token) {
	const options = {
		method: "POST",
		body: JSON.stringify(params)
	}
	const response = await fetch(endpoint, options)
	const response_json = await response.json()
	console.log(response_json)
	return response_json
}


async function getTokenFromHash() {
	console.log("getting hash")
	if (document.location.hash && document.location.hash != '') {
		var parsedHash = new URLSearchParams(window.location.hash.substr(1));
		if (parsedHash.get('access_token')) {
			user_token = parsedHash.get('access_token');
			window.location.hash = ""
			await getFollows(user_token)
		}
	} else if (document.location.search && document.location.search != '') {
		var parsedParams = new URLSearchParams(window.location.search);
		if (parsedParams.get('error_description')) {
			console.error(parsedParams.get('error') + ' - ' + parsedParams.get('error_description'))
		}
	}
}





async function getFollows(token) {
	let userData = await twitchApiGet(USER_ENDPOINT, token)
		.then(async (response) => {
			endpoint = FOLLOW_ENDPOINT + `${response["data"][0].id}` + "?first=100"
			let followData = await twitchApiGet(endpoint, token)
			console.log(followData)
			// TODO make pagination
			return followData
	})
	console.log(userData)
}




getTokenFromHash()
console.log("123123123")
