import { photographerFactory } from '../factories/photographerFactory.js'
import { mediaFactory } from '../factories/mediaFactory.js'
import getPhotographers from '../utils/fetch.js'
import { modalDisplay, focusInModal } from '../utils/contactForm.js'

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
  const { photographers, medias } =
    JSON.parse(localStorage.getItem('data')) || (await getPhotographers())

  displayData(photographers, medias)
}

getDatas()

const showModal = () => {
  previouslyFocusedElement = document.querySelector(':focus')
  modalDisplay('show', previouslyFocusedElement)
  // document
  //   .querySelector('.contact-button')
  //   .removeEventListener('click', showModal)
  document.getElementById('firstname').focus()
}

let previouslyFocusedElement = null

document.querySelector('.contact-button').addEventListener('click', showModal)

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    modalDisplay('hide', previouslyFocusedElement)
  }
  if (
    e.key === 'Tab' &&
    document.querySelector('.modal').hasAttribute('aria-modal')
  ) {
    focusInModal(e)
  }
})
