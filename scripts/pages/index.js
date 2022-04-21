import { photographerFactory } from '../factories/photographerFactory.js'
import getPhotographers from '../utils/fetch.js'

/**
 * Affichage de la page d'acceuil
 */
async function displayPhotographers(photographers) {
  const photographersSection = document.querySelector('.photographers-section')

  photographers.forEach(photographer => {
    const photographerModel = photographerFactory(photographer)
    const userCardDOM = photographerModel.getUserCardDOM()
    photographersSection.appendChild(userCardDOM)
  })
}

/**
 * Initialisation
 */
async function init() {
  const spinner = document.getElementById('spinner')
  spinner.removeAttribute('hidden')

  /**
   * Récupération des données
   */
  const data =
    JSON.parse(localStorage.getItem('data')) ?? (await getPhotographers())
  const photographers = data ? data.photographers : null
  if (!data) return console.error('NO DATA')

  /**
   * Affichage des photographes
   */
  displayPhotographers(photographers)
  spinner.hidden = true
}

init()
