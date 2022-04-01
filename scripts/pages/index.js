async function getPhotographers() {
  const response = await fetch('../../data/photographers.json')
  data = await response.json()
  return data
}

async function displayData(photographers, medias) {
  const photographersSection = document.querySelector('.photographers_section')

  photographers.forEach(photographer => {
    const photographerModel = photographerFactory(photographer)
    const userCardDOM = photographerModel.getUserCardDOM()
    photographersSection.appendChild(userCardDOM)
  })
  medias.forEach(media => {
    const mediasModel = mediasFactory(media)
    const mediaCardDOM = mediasModel.getMediaCardDOM()
    // mediasSection.appendChild(mediaCardDOM)
  })
}

async function init() {
  const { photographers, medias } = await getPhotographers()
  localStorage.setItem('photographers', JSON.stringify(photographers))
  localStorage.setItem('medias', JSON.stringify(medias))
  displayData(photographers, medias)
}

init()
