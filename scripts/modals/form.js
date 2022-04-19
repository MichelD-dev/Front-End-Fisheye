/**
 * MODALE FORMULAIRE
 * @param {string} "show"/"hide" formulaire
     */
export const formDisplay = (action) => {
  const modal = document.querySelector('#form')

  let previouslyFocusedElement = document.querySelector(':focus')

  if (action === 'show') {
    previouslyFocusedElement = document.querySelector(':focus')
    document.getElementById('firstname').focus()
    modal.classList.remove('hidden')
    modal.removeAttribute('aria-hidden')
    modal.ariaModal = true
    focusables = [...modal.querySelectorAll(focusableElements)]
    document
      .querySelector('.modal__close')
      .addEventListener('click', closeFormModal)
    const submit = e => {
      e.preventDefault()
      formSubmit(e, previouslyFocusedElement)
      document
        .querySelector('[name="form"]')
        .removeEventListener('submit', submit)
    }
    document.querySelector('[name="form"]').addEventListener('submit', submit)
  }
  if (action === 'hide') {
    // modal.addEventListener('animationend', closeModal)

    document
      .querySelector('.modal__close')
      .removeEventListener('click', closeFormModal)
    modal.ariaHidden = true
    modal.removeAttribute('aria-modal')
    // modal.classList.add('hidden')
  }
}

// -------------------------------------------------------------------- //

/**
 * SOUMISSION DU FORMULAIRE
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

  /* On ferme la modale et on remet le focus sur le bouton de contact */
  formDisplay('hide', previouslyFocusedElement)
}

const focusableElements = 'input, textArea, button'
let focusables = []

// -------------------------------------------------------------------- //

/**
 * GESTION DU FOCUS
 * Changement de focus au clavier et maintien dans la modale
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

const closeFormModal = () => formDisplay('hide')
