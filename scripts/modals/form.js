import DOM from '../utils/domElements.js'
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
    DOM.modalForm.removeAttribute('aria-hidden')
    DOM.modalForm.ariaModal = true

    /**
     * On place le focus sur le premier champ
     */
    DOM.firstNameInput.focus()

    /**
     * Bouton de fermeture du formulaire
     */
    DOM.modalCloseBtn.onclick = () =>form().hide()

    /**
     * On place un écouteur d'évènement Submit sur le formulaire
     */
    DOM.modalForm.onsubmit = formSubmit
  }

  const hide = () => {
    /**
     * A la fermeture, retour du focus sur le bouton de contact
     */
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()

    /**
     * On vide les champs du formulaire
     */
    document.getElementById('form').reset()

    /**
     * On passe la modale en hidden
     */
    DOM.modalForm.ariaHidden = true
    DOM.modalForm.removeAttribute('aria-modal')
  }

  return { show, hide }
}

// -------------------------------------------------------------------- //

/**
 * Fonction de soumission du formulaire
 */
const formSubmit = e => {
  e.preventDefault()

  if (!validate(e)) return

  console.table([
    DOM.firstNameInput.value,
    DOM.lastNameInput.value,
    DOM.emailInput.value,
    DOM.messageInput.value,
  ])

  /**
   * On vide les champs du formulaire de leur contenu et on supprime les messages d'erreur
   */
  DOM.modalForm
    .getElementsByTagName('input:not([type="submit"]), textArea')
    .forEach(input => {
      input.classList.remove('error', 'success')
      document.getElementById('form').reset()
    })

  firstName.value = ''
  lastName.value = ''
  email.value = ''
  message.value = ''

  DOM.modalForm.getElementsByClassName('error-message').forEach(errorMsg => {
    errorMsg.textContent = ''
  })

  /**
   * On ferme la modale et on remet le focus sur le bouton de contact
   */
  form().hide()
}

/**
 * On récupère les éléments qui acquerront le focus
 */
const focusableElements = 'input, textArea, button'

/**
 * On crée un tableau des éléments focusables
 */
let focusables = [...DOM.modalForm.getElementsByTagName(focusableElements)]

/**
 * GESTION DU FOCUS
 * Changement de focus au clavier et maintien du focus dans la modale
 */
export const focusInModal = e => {
  e.preventDefault()
  let index = focusables.findIndex(
    elem => elem === DOM.modalForm.querySelector(':focus')
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
