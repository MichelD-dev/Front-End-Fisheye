import DOM from '../utils/domElements.js'
import photographerFactory from '../factories/photographerFactory.js'
import init from '../utils/init.js'

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
      userCardDOM.setAttribute('aria-busy', false)
    }, 1000)
  })
}

/**
 * Demande de fetch et affichage des photographes
 */
init({
  url: 'https://micheld-dev.github.io/json-files/photographers.json',
  storageName: 'original datas',
  doSomethingWith: displayPhotographers,
  thisParticularData: 'photographers',
})
