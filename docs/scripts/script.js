// obsManager.js - OBS-StreamDeck Thingy
// Author: ItsOiK
// Date: 06/08-2021



const hamburgerMenuButton = document.querySelector("#hamburger-menu")
const sidebarMenu = document.querySelector("#menu")

function hamburgerMenuHandler(event){
	console.log(event)
	sidebarMenu.classList.toggle("menu-hide")
}