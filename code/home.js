const overviewButton = document.querySelector("#overview-button")
const overviewModal = document.querySelector("#overview-modal")
const closeOverviewButton = document.querySelector("#close-overview-button")
const overviewTitle = document.querySelector("#overview-title")
const overviewContentWrapper = document.querySelector("#overview-content-wrapper")
const previousButton = document.querySelector("#previous-overview-button")
const nextButton = document.querySelector("#next-overview-button")
const slideIndicatorsWrapper = document.querySelector("#overview-slide-indicators-wrapper") 

const overviewContent = [
  {
    title: "About",
    content: [
      "I'm a Software Engineer with 3+ years of experience developing software professionally.",
      "I graduated from university in 2025 but have been coding and working as a developer long before that. My passion for programming began in 2018."
    ]
  },
  {
    title: "Second",
    content: [
      "Not much to say honestly",
    ]
  }
]

let slideshowIndex = 0

function fillOverviewContent(){
  const slideContent = overviewContent[slideshowIndex]
  
  overviewTitle.textContent = slideContent.title
  
  const content = slideContent.content.map(par => {
    const node = document.createElement('p')
    node.textContent = par
    return node
  })
  
  content.forEach(node => overviewContentWrapper.appendChild(node))
}

function cleanOverviewContent(){
  overviewTitle.textContent = ""
  overviewContentWrapper.innerHTML = ""
}

function onShowOverview(){
  fillOverviewContent()
  overviewModal.style.display = "flex"
  generateSliderIndicators(overviewContent.length, slideshowIndex)
}

function onCloseOverview(){
  overviewModal.style.display = "none"
  cleanOverviewContent()
  slideshowIndex = 0
}

function onNextSlide(){
  if(slideshowIndex === overviewContent.length - 1) return

  slideshowIndex += 1
  cleanOverviewContent()
  fillOverviewContent()
  generateSliderIndicators(overviewContent.length, slideshowIndex)
}

function onPreviousSlide(){
  if(slideshowIndex === 0) return
  
  slideshowIndex -= 1
  cleanOverviewContent()
  fillOverviewContent()
  generateSliderIndicators(overviewContent.length, slideshowIndex)
}

function generateSliderIndicators(length, index){
  const indicators = []
  for(let i = 0; i < length; i++){
    const indicator = document.createElement('span')
    
    if(i === index) indicator.className = "slide-indicator slide-indicator-active"
    else indicator.className = "slide-indicator"
    
    indicators.push(indicator)
  }

  // Empty wrapper
  while(slideIndicatorsWrapper.firstChild) 
    slideIndicatorsWrapper.removeChild(slideIndicatorsWrapper.firstChild)

  indicators.forEach(indicator => slideIndicatorsWrapper.appendChild(indicator))
}

overviewButton.addEventListener("click", onShowOverview)
closeOverviewButton.addEventListener("click", onCloseOverview)
previousButton.addEventListener("click", onPreviousSlide)
nextButton.addEventListener("click", onNextSlide)