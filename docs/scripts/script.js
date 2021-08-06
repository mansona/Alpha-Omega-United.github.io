// obsManager.js - OBS-StreamDeck Thingy
// Author: ItsOiK
// Date: 06/08-2021



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

const ASSETS_HTML = `<div class="assets-container">
						<div class="assets-img-container">
							<div>logo</div>
							<img src="assets/logo.png">
						</div>
						<div class="assets-img-container">
							<div>logo_large</div>
							<img src="assets/logo_large.png">
						</div>
						<div class="assets-img-container">
							<div>Panel</div>
							<img src="assets/Panel.png">
						</div>
					</div>`


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
	console.log(event)
	if (event.value == "HOME"){
		contentContainer.innerHTML = INDEX_HTML
	} else if (event.value == "ASSETS") {
		contentContainer.innerHTML = ASSETS_HTML

	}
}