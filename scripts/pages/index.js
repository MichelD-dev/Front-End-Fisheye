import DOM from '../utils/domElements.js'
import photographerFactory from '../factories/photographerFactory.js'
import init from '../utils/init.js'
import {addReactionTo} from '../utils/eventListener.js'

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

  /**
   * On récupère les éléments qui acquerront le focus
   */
  const focusableElements = 'article:not(.skeleton__card)'

  /**
   * On crée un tableau des éléments focusables
   */
  let focusables = [...document.querySelectorAll(focusableElements)]

  /**
   * Changement de focus au clavier et maintien du focus dans la fenêtre
   */
  const focusInWindow = e => {
    e.preventDefault()
    let index = focusables.findIndex(
      elem => elem === document.querySelector(':focus'),
    )
    e.shiftKey === true ? index-- : index++
    if (index >= focusables.length) {
      index = 0
    }
    if (index < 0) {
      index = focusables.length - 1
    }
    focusables[index].focus()
  }

  /**
   * Navigation au clavier
   */
  addReactionTo('keydown')
    .on(window)
    .withFunction(e => {
      if (e.key === 'Tab') {
        focusInWindow(e)
      }
    })
}

/**
 * Demande de fetch et affichage des photographes
 */
init({
  url: './data/photographers.json',
  storageName: 'original datas',
  doSomethingWith: displayPhotographers,
  thisParticularData: 'photographers',
})
