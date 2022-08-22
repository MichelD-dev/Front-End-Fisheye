import {sort} from '../pages/photographer.js'
import DOM from '../utils/domElements.js'
import {addReactionTo} from '../utils/eventListener.js'

/**
 * Tri de l'ordre d'affichage des images selon choix utilisateur
 */
export const sortBy = medias => {
  return sortingChoice => {
    const choices = {
      Titre: () => medias.sort((a, b) => a.title.localeCompare(b.title)),
      Popularité: () => medias.sort((a, b) => b.likes - a.likes),
      Date: () => medias.sort((a, b) => new Date(b.date) - new Date(a.date)),
    }

    return choices[sortingChoice]?.() ?? 'Critère de choix non reconnu'
  }
}

// --------------------------------------------------------------------------- //
// ------------------------------------UTILS---------------------------------- //
// --------------------------------------------------------------------------- //
document.querySelector('#medias-sort-label > span').textContent = DOM.summary.textContent
/**
 * Affichage de l'option selectionnée
 */
const selectDisplaySorting = option => {
  function swap() {
    const x = document.querySelector('#summary > span').textContent
    const y = option.textContent
    document.querySelector('#summary > span').textContent = y
    option.textContent = x
    
    document.querySelector('#medias-sort-label > span').textContent = DOM.summary.textContent
    

    DOM.selector.removeAttribute('open')
  }

  swap()

  document
    .querySelector('#summary')
    .setAttribute(
      'aria-activedescendant',
      `${document.querySelector('#summary > span').textContent.trim()}`,
    )

  setTimeout(() => {
    DOM.summary.focus()
  }, 0)
}

/**
 * GESTION DU FOCUS
 * Changement de focus au clavier et maintien du focus dans le selecteur
 */
/**
 * Navigation au clavier
 */
addReactionTo('keydown')
  .on(window)
  .withFunction(e => {
    if (e.key === 'Tab' && DOM.selector.hasAttribute('open')) {
      focusInSelector(e)
    }
  })

addReactionTo('click')
  .on(DOM.selector)
  .withFunction(e => {
    focusInSelector(e)
  })

/**
 * On récupère les éléments qui acquerront le focus dans le selecteur
 */
const focusableElements = 'details span'
/**
 * On crée un tableau des éléments focusables
 */
let focusables = [...DOM.selector.querySelectorAll(focusableElements)]

const focusInSelector = e => {
  if (DOM.selector.hasAttribute('open')) e.preventDefault()

  let index = focusables.findIndex(
    elem => elem === DOM.selector.querySelector(':focus'),
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

// --------------------------------------------------------------------------- //
// -------------------------------EVENT LISTENERS----------------------------- //
// --------------------------------------------------------------------------- //

addReactionTo('click')
  .on(DOM.selector)
  .withFunction(() => {
    if (!DOM.selector.hasAttribute('open')) {
      DOM.selector.setAttribute('aria-expanded', true)
    } else {
      DOM.selector.setAttribute('aria-expanded', false)
    }
  })

/**
 * Récupération des données selon la catégorie sélectionnée
 */
const selected = document.querySelector('.selected')
for (const sortingChoice of document.querySelectorAll('.custom-option')) {
  addReactionTo('click')
    .on(sortingChoice)
    .withFunction(() => {
      selectDisplaySorting(sortingChoice)
      sort(selected.textContent.trim())
      DOM.summary.focus()
    })

  addReactionTo('keydown')
    .on(sortingChoice)
    .withFunction(e => {
      if (e.key === 'Enter') {
        selectDisplaySorting(sortingChoice)
        sort(selected.textContent.trim())
      }
    })
}

/**
 * On ferme le selecteur lorsque l'utilisateur clique quelque part dans la fenêtre
 */
addReactionTo('click')
  .on(window)
  .withFunction(() => DOM.selector.removeAttribute('open'))

/**
 * On garde le focus sur le selecteur à sa fermeture
 */
DOM.summary.onclick = () => {
  if (!DOM.summary.hasAttribute('open')) DOM.summary.focus()
}
