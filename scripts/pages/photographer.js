import { photographerFactory } from '../factories/photographerFactory.js'
import { mediaFactory } from '../factories/mediaFactory.js'
import getPhotographers from '../utils/fetch.js'

let params = new URL(document.location).searchParams
let id = parseInt(params.get('id'))

async function displayData(photographers, medias) {
  const mediasSection = document.querySelector('.medias-section')

  const photographer = photographers.find(
    photographer => photographer.id === id
  )
  const photographerModel = photographerFactory(photographer)
  photographerModel.getUserPageDOM()

  medias.forEach(media => {
    if (media.photographerId !== id) return
    const mediaModel = mediaFactory(media)
    const article = mediaModel.getMediaCardDOM()
    mediasSection.appendChild(article)
  })
}

//TODO utilisation du storage plutôt que fetchs multiples

const getDatas = async () => {
  const spinner = document.getElementById('spinner')
  spinner.removeAttribute('hidden')

  let photographers = JSON.parse(localStorage.getItem('photographers'))
  let medias = JSON.parse(localStorage.getItem('medias'))

  if (!photographers || !medias) {
    const { photographers, medias } = await getPhotographers()
    displayData(photographers, medias)
  }

  spinner.setAttribute('hidden', '')
  displayData(photographers, medias)
}

getDatas()
