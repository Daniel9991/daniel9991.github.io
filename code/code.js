const hamburgerMenu = document.querySelector("#hamburger-menu")
const openHamburgerButton = document.querySelector("#open-hamburger-button")
const closedHamburgerButton = document.querySelector("#closed-hamburger-button")
const closedHamburgerIcon = document.querySelector("#closed-hamburger-icon")
const openHamburgerIcon = document.querySelector("#open-hamburger-icon")

function openHamburgerMenu(){
  hamburgerMenu.setAttribute("open", "false")
}

function closeHamburgerMenu(){
  hamburgerMenu.setAttribute("open", "true")
}

openHamburgerButton.addEventListener('click', openHamburgerMenu)
closedHamburgerButton.addEventListener('click', closeHamburgerMenu)