import { photographerFactory } from '../factories/photographerFactory.js'
import { mediaFactory } from '../factories/mediaFactory.js'
import getPhotographers from '../utils/fetch.js'
import modal from '../utils/contactForm.js'

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

document
  .querySelector('.contact-button')
  .addEventListener('click', () => modal('display'))

document.querySelector('.modal-close').addEventListener('click', () => modal('close'))

document.querySelector('[name="form"]').addEventListener('submit', e => {
  e.preventDefault()
  console.log(e.currentTarget.firstname.value)
  console.log(e.currentTarget.lastname.value)
  console.log(e.currentTarget.email.value)
  console.log(e.currentTarget.message.value)
  modal('close')
})
