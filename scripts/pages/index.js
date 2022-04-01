import { photographerFactory } from '../factories/photographerFactory.js'
import { mediasFactory } from '../factories/mediasFactory.js'
import getPhotographers from '../utils/fetch.js'

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
  const spinner = document.getElementById('spinner')
  spinner.removeAttribute('hidden')

  let photographers = JSON.parse(localStorage.getItem('photographers'))
  let medias = JSON.parse(localStorage.getItem('medias'))

  if (!photographers || !medias) {
    const { photographers, medias } = await getPhotographers()
    displayData(photographers, medias)
  }

  spinner.setAttribute('hidden','')
  displayData(photographers, medias)
}

init()
