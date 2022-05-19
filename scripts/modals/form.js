import DOM from '../utils/domElements.js'
import { addReactionTo } from '../utils/eventListener.js'
import {
  validate,
  firstName,
  lastName,
  email,
  message,
} from '../utils/formValidation.js'

/**
 * Prédéclaration de l'élément ayant le focus à l'appel du formulaire
 */
let previouslyFocusedElement = null

/**
 * MODALE FORMULAIRE
 */
export const form = () => {
  /**
   * Ouverture de la modale formulaire
   */
  const show = () => {
    /**
     * Mémorisation présence du focus sur bouton de contact
     */
    previouslyFocusedElement = document.activeElement

    /**
     * On rend la modale formulaire visible
     */
    DOM.formModal.removeAttribute('aria-hidden')
    DOM.formModal.ariaModal = true

    /**
     * On place le focus sur le premier champ
     */
    DOM.firstNameInput.focus()

    /**
     * Bouton de fermeture du formulaire
     */
    DOM.formModalCloseBtn.onclick = () => hide()

    /**
     * On place un écouteur d'évènement Submit sur le formulaire
     */
    DOM.formModal.onsubmit = e => formSubmit(e)
  }

  const hide = () => {
    /**
     * A la fermeture, retour du focus sur le bouton de contact
     */
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()

    /**
     * On vide les champs du formulaire de leur contenu et on supprime les messages d'erreur
     */
    DOM.formModal
      .querySelectorAll('input:not([type="submit"]), textArea')
      .forEach(input => input.classList.remove('error', 'success'))

    firstName.value = ''
    lastName.value = ''
    email.value = ''
    message.value = ''
    ;[...DOM.formModal.getElementsByClassName('error-message')].forEach(
      errorMsg => {
        errorMsg.textContent = ''
      }
    )
    ;[...document.getElementsByClassName('error-message')].map(
      message => (message.style.border = 'none')
    )

    /**
     * On vide les champs du formulaire
     */
    DOM.form.reset()

    /**
     * On passe la modale en hidden
     */
    DOM.formModal.ariaHidden = true
    DOM.formModal.removeAttribute('aria-modal')
  }

  return { show, hide }
}

// -------------------------------------------------------------------- //

/**
 * Fonction de soumission du formulaire
 */
const formSubmit = e => {
  if (!validate(e)) return

  console.table([
    DOM.firstNameInput.value,
    DOM.lastNameInput.value,
    DOM.emailInput.value,
    DOM.messageInput.value,
  ])

  /**
   * On ferme la modale et on remet le focus sur le bouton de contact
   */
  form().hide()
}

// --------------------------------------------------------------------------- //
// -----------------------------GESTION DU FOCUS------------------------------ //
// --------------------------------------------------------------------------- //

/**
 * Navigation au clavier
 */
addReactionTo('keydown')
  .on(window)
  .withFunction(e => {
    if (e.key === 'Tab' && DOM.modal.hasAttribute('aria-modal')) {
      focusInModal(e)
    }
  })

/**
 * On récupère les éléments qui acquerront le focus
 */
const focusableElements = 'input, textArea, button'

/**
 * On crée un tableau des éléments focusables
 */
let focusables = [...DOM.formModal.querySelectorAll(focusableElements)]

/**
 * Changement de focus au clavier et maintien du focus dans la modale
 */
export const focusInModal = e => {
  e.preventDefault()
  let index = focusables.findIndex(
    elem => elem === DOM.formModal.querySelector(':focus')
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
