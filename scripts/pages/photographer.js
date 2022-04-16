import { photographerFactory } from '../factories/photographerFactory.js'
import { mediaFactory } from '../factories/mediaFactory.js'
import getPhotographers from '../utils/fetch.js'
import { formDisplay, focusInModal, lightboxDisplay } from '../utils/modals.js'

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
    mediasSection.appendChild(article) //TODO? mettre une ul dans la grid et les articles dans des li?
  })
}

const getDatas = async () => {
  const { photographers, medias } =
    JSON.parse(localStorage.getItem('data')) || (await getPhotographers())

  displayData(photographers, medias)
}

getDatas()

let previouslyFocusedElement = null

document
  .querySelector('.contact-button')
  .addEventListener('click', () => formDisplay('show', previouslyFocusedElement))

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    formDisplay('hide', previouslyFocusedElement)
    lightboxDisplay('hide')
  }
  if (
    e.key === 'Tab' &&
    document.querySelector('.modal').hasAttribute('aria-modal')
  ) {
    focusInModal(e)
  }
})
