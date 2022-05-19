import { getDatas } from '../pages/photographer.js'
import DOM from '../utils/domElements.js'
import { addReactionTo } from '../utils/eventListener.js'

/**
 * Déclaration d'un tableau des selections non choisies
 */
let notSelectedsOptionsArray = []

export const select = () => {
  if (!document.querySelector('.select').classList.contains('open')) {
    document.querySelector('.select').classList.add('open')
    document
      .querySelector('.select__trigger')
      .setAttribute('aria-expanded', true)

    /**
     * Mise en tableau des selections non choisies
     */
    notSelectedsOptionsArray = [
      ...document.getElementsByClassName('custom-option '),
    ].filter(el => !el.classList.contains('selected'))

    /**
     * Border-radius placé dynamiquement en bas de la dernière selection non choisie
     */
    notSelectedsOptionsArray[notSelectedsOptionsArray.length - 1].classList.add(
      'custom-option_last'
    )

    document.querySelector('.selected').focus()
  } else {
    document.querySelector('.select').classList.remove('open')
    document
      .querySelector('.select__trigger')
      .setAttribute('aria-expanded', false)
    /**
     * On retire le border-radius de la dernière selection avant de positionner une nouvelle selection en dernière position
     */
    if (notSelectedsOptionsArray.length !== 0) {
      notSelectedsOptionsArray[
        notSelectedsOptionsArray.length - 1
      ].classList.remove('custom-option_last')
    }
  }
}

/**
 * Affichage de l'option selectionnée
 */
const selectDisplaySorting = option => {
  for (const hidden of document.querySelectorAll(
    '.custom-option.hidden, .select__trigger'
  )) {
    hidden.classList.remove('hidden')
  }
  if (!option.classList.contains('selected')) {
    option.parentNode
      .querySelector('.custom-option.selected')
      ?.classList.remove('selected')
    option.classList.add('selected')
    option.classList.add('hidden')
    option
      .closest('.select')
      .querySelector('.select__trigger span').textContent = option.textContent
  }
}

for (const option of document.getElementsByClassName('custom-option')) {
  addReactionTo('click')
    .on(option)
    .withFunction(
      () => {
        selectDisplaySorting(option)
      },
      { once: true }
    )
}

/**
 * On ferme le selecteur lorsque l'utilisateur clique quelque part dans la fenêtre
 */
addReactionTo('click')
  .on(window)
  .withFunction(e => {
    const select = document.querySelector('.select')
    if (!select.contains(e.target)) {
      select.classList.remove('open')
    }
  })

/**
 * Récupération des données selon la catégorie sélectionnée
 */
for (const selected of document.querySelectorAll('.custom-option')) {
  addReactionTo('click')
    .on(selected)
    .withFunction(() => {
      const sortingChoice = selected.textContent
      getDatas(sortingChoice)
    })

  addReactionTo('keydown')
    .on(selected)
    .withFunction(e => {
      if (e.key === 'Enter') {
        const sortingChoice = selected.textContent
        getDatas(sortingChoice)
      }
    })
}

/**
 * GESTION DU FOCUS
 * Changement de focus au clavier et maintien du focus dans le selecteur
 */
const focusInSelector = e => {
  e.preventDefault()

  /**
   * On récupère les éléments qui acquerront le focus dans le selecteur
   */
  const focusableElements = '.select__trigger, .custom-option:not(.selected)'

  /**
   * On crée un tableau des éléments focusables
   */
  let focusables = [...DOM.selector.querySelectorAll(focusableElements)]

  let index = focusables.findIndex(
    elem => elem === DOM.selector.querySelector(':focus')
  )

  e.shiftKey === true ? index-- : index++

  if (index >= focusables.length) {
    index = 0
  }
  if (index < 0) {
    index = focusables.length - 1
  }

  let option = focusables[index]
  option.focus()

  focusables.forEach(elem => elem.classList.remove('no-white-line'))
  document.activeElement.classList.add('no-white-line')

  // /**
  //  * Navigation au clavier dans le selecteur
  //  */
  addReactionTo('keydown')
    .on(DOM.selector)
    .withFunction(e => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        document.querySelector('.select.open')?.classList.remove('open')
        focusables.forEach(elem => elem.classList.remove('no-white-line'))
        document.querySelector('.select__trigger').focus()
      }

      if (
        e.key === 'Enter' &&
        document.querySelector('.select.open') &&
        !document.activeElement.classList.contains('select__trigger')
      ) {
        selectDisplaySorting(option)
      }
    })
}

addReactionTo('keydown')
  .on(DOM.selector)
  .withFunction(e => {
    if (e.key === 'Tab' && !!document.querySelector('.select.open')) {
      focusInSelector(e)
    }
  })
