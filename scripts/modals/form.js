/**
 * MODALE FORMULAIRE
 */
export const formDisplay = action => {
  const modal = document.querySelector('#form')
  let previouslyFocusedElement = null
  /**
   * Ouverture de la modale formulaire
   */
  if (action === 'show') {
    /**
     * Mémorisation présence du focus sur bouton de contact
     */
    previouslyFocusedElement = document.activeElement
    console.log(previouslyFocusedElement)

    /**
     * On rend la modale formulaire visible
     */
    modal.removeAttribute('aria-hidden')
    modal.ariaModal = true

    /**
     * On place le focus sur le premier champ
     */
    document.getElementById('firstname').focus()

    /**
     * On crée un tableau des éléments focusables
     */
    focusables = [...modal.querySelectorAll(focusableElements)]

    /**
     * On place un écouteur d'évènement Click sur le bouton de fermeture
     */
    document
      .querySelector('.modal__close')
      .addEventListener('click', closeFormModal)

    /**
     * On place un écouteur d'évènement Submit sur le formulaire
     */
    document
      .querySelector('[name="form"]')
      .addEventListener('submit', formSubmit)
  }

  if (action === 'hide') {
    console.log(previouslyFocusedElement) //FIXME comment retrouver le focus sur le bouton contact

    /**
     * On vide les champs du formulaire
     */
    document
      .querySelectorAll('input:not([type="button"]):not([type="submit"])')
      .forEach(input => {
        input.value = ''
      })
    /**
     * On retire l'écouteur d'évènement du bouton de fermeture da la modale
     */
    document
      .querySelector('.modal__close')
      .removeEventListener('click', closeFormModal)
    /**
     * On passe la modale en hidden
     */
    modal.ariaHidden = true
    modal.removeAttribute('aria-modal')
  }
}

// -------------------------------------------------------------------- //

/**
 * Fonction de soumission du formulaire
 */
const formSubmit = (e, previouslyFocusedElement) => {
  e.preventDefault()
  console.table([
    e.currentTarget.firstname.value,
    e.currentTarget.lastname.value,
    e.currentTarget.email.value,
    e.currentTarget.message.value,
  ])

  /* On vide les champs du formulaire */
  document
    .querySelectorAll(
      'input:not([type="button"]):not([type="submit"]), textarea'
    )
    .forEach(input => {
      input.value = ''
    })

  /**
   * On retire l'écouteur d'évènement Submit sur le formulaire
   */
  document
    .querySelector('[name="form"]')
    .removeEventListener('submit', formSubmit)

  /* On ferme la modale et on remet le focus sur le bouton de contact */
  formDisplay('hide')
}

/**
 * On récupère les éléments qui acquerront le focus
 */
const focusableElements = 'input, textArea, button'
let focusables = []

/**
 * GESTION DU FOCUS
 * Changement de focus au clavier et maintien du focus dans la modale
 */
export const focusInModal = e => {
  const modal = document.querySelector('#form')
  e.preventDefault()
  let index = focusables.findIndex(
    elem => elem === modal.querySelector(':focus')
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
 * Fonction de fermeture de la modale
 */
const closeFormModal = () => formDisplay('hide')
