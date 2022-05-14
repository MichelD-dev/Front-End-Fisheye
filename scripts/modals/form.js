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
export const formDisplay = action => {
  /**
   * Ouverture de la modale formulaire
   */
  if (action === 'show') {
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
    DOM.modalCloseBtn.addEventListener('click', function closeFormModal() {
      DOM.modalCloseBtn.removeEventListener('click', closeFormModal)
      formDisplay('hide')
    })

    /**
     * On place un écouteur d'évènement Submit sur le formulaire
     */
    DOM.modalForm.onsubmit = formSubmit
  }

  if (action === 'hide') {
    /**
     * A la fermeture, retour du focus sur le bouton de contact
     */
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()

    /**
     * On passe la modale en hidden
     */
    DOM.modalForm.ariaHidden = true
    DOM.modalForm.removeAttribute('aria-modal')
  }
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
    .querySelectorAll('input:not([type="submit"]), textArea')
    .forEach(input => {
      input.classList.remove('error', 'success')
      input.value = ''
    })

  firstName.value = ''
  lastName.value = ''
  email.value = ''
  message.value = ''

  DOM.modalForm.querySelectorAll('.error-message').forEach(errorMsg => {
    errorMsg.textContent = ''
  })

  /**
   * On retire l'écouteur d'évènement Submit sur le formulaire
   */
  DOM.modalForm.removeEventListener('submit', formSubmit)

  /**
   * On ferme la modale et on remet le focus sur le bouton de contact
   */
  closeFormModal()
}

/**
 * On récupère les éléments qui acquerront le focus
 */
const focusableElements = 'input, textArea, button'
/**
 * On crée un tableau des éléments focusables
 */
let focusables = [...DOM.modalForm.querySelectorAll(focusableElements)]

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
