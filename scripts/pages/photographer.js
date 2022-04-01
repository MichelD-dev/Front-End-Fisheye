//Mettre le code JavaScript lié à la page photographer.html
import { photographerFactory } from '../factories/photographerFactory.js'
import { mediasFactory } from '../factories/mediasFactory.js'
import { displayModal, closeModal } from '../utils/contactForm.js'
import getPhotographers from '../utils/fetch.js'

let params = new URL(document.location).searchParams
let id = parseInt(params.get('id'))

//TODO utilisation du storage plutôt que fetchs multiples

const getDatas = async () => {
  const spinner = document.getElementById('spinner')
  spinner.removeAttribute('hidden')

  let photographers = JSON.parse(localStorage.getItem('photographers'))
  let medias = JSON.parse(localStorage.getItem('medias'))

  if (!photographers || !medias) {
    const data = await getPhotographers()
      return data
  }

  spinner.setAttribute('hidden', '')
  return { photographers, medias }
}

const { photographers, medias } = await getDatas()
const photographer = photographers.find(photographer => photographer.id === id)

const picture = `assets/photographers/${photographer.portrait}`

document.querySelector('.photographer__name').textContent = photographer.name
document.querySelector(
  '.photographer__location'
).textContent = `${photographer.city}, ${photographer.country}`
document.querySelector('.photographer__tagline').textContent =
  photographer.tagline
document.querySelector('.photographer__portrait').setAttribute('src', picture)
document
  .querySelector('.photographer__portrait')
  .setAttribute('alt', `${name} - Fiche individuelle`)

mediasFactory(medias)
