async function getPhotographers() {
  const response = await fetch('../../data/photographers.json')
  data = await response.json()
  return data
}

async function displayData(photographerss) {
  const photographersSection = document.querySelector('.photographers_section')

  photographerss.forEach(photographer => {
    const photographerModel = photographerFactory(photographer)
    const userCardDOM = photographerModel.getUserCardDOM()
    photographersSection.appendChild(userCardDOM)
  })
}

async function init() {
  const { photographers } = await getPhotographers()
  localStorage.setItem('photographers', JSON.stringify(photographers))
  displayData(photographers)
}

init()
