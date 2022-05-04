import * as DOM from '../utils/domElements.js'
import { photographerFactory } from '../factories/photographerFactory.js'
import getPhotographers from '../API/fetchAPI.js'

/**
 * Affichage de la page d'acceuil
 */
async function displayPhotographers(photographers) {
  photographers.forEach(photographer => {
    const photographerModel = photographerFactory(photographer)
    const userCardDOM = photographerModel.getUserCardDOM()
    DOM.photographersSection.appendChild(userCardDOM)
  })
}

/**
 * Initialisation
 */
async function init() {
  DOM.spinner.removeAttribute('hidden')

  /**
   * Récupération des données
   */
  const data =
    JSON.parse(localStorage.getItem('original datas')) ??
    (await getPhotographers())
  const photographers = data ? data.photographers : null
  if (!data) return console.error('NO DATA')

  /**
   * Affichage des photographes
   */
  displayPhotographers(photographers)
  DOM.spinner.hidden = true
}

init()
