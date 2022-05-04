import * as DOM from '../utils/domElements.js'
import { photographerFactory } from '../factories/photographerFactory.js'
import getFetchedDatas from '../API/fetchAPI.js'

/**
 * Affichage de la page d'accueil
 */
async function displayPhotographers(photographers) {
  photographers.forEach(photographer => {
    const photographerModel = photographerFactory(photographer)
    const userCardDOM = photographerModel.getUserCardDOM()
    DOM.photographersSection.appendChild(userCardDOM)
    setTimeout(() => {
      userCardDOM.classList.add('fadein')
    }, 1000)
  })
}

/**
 * Initialisation
 */
async function init() {
  /* Récupération des données */
  await getFetchedDatas().then(({ photographers }) => {
    /* Affichage des photographes */
    displayPhotographers(photographers)
  })
}

init()
