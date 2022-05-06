import * as DOM from './domElements.js'
import { formDisplay } from '../modals/form.js'
import { isInputValid } from './utils.js'

let firstName = {
  value: '',
  regex: /^[a-z][ a-z0-9á-ÿæœ\._\-]{1,}$/i,
  id: 'firstname',
  errorText: 'Vous devez indiquer un prénom valide.',
}

let lastName = {
  value: '',
  regex: /^[a-z][ a-z0-9á-ÿæœ\._\-]{1,}$/i,
  id: 'lastname',
  errorText: 'Vous devez indiquer un nom valide.',
}

let email = {
  value: '',
  regex: /^[a-z0-9\-_]+[a-z0-9\.\-_]*@[a-z0-9\-_]{2,}\.[a-z\\.\-_]+[a-z\-_]+/i,
  id: 'email',
  errorText: 'Vous devez indiquer une adresse mail valide.',
}

let message = {
  value: '',
  regex: /[\s\S]+/,
  id: 'message',
  errorText: 'Vous devez indiquer un message.',
}

// FIRSTNAME VALIDATION:
DOM.firstNameInput.onchange = e => (firstName.value = e.target.value)

// LASTNAME VALIDATION:
DOM.lastNameInput.onchange = e => (lastName.value = e.target.value)

// EMAIL VALIDATION:
DOM.emailInput.onchange = e => (email.value = e.target.value)

// MESSAGE VALIDATION:
DOM.messageInput.onchange = e => (message.value = e.target.value)

// FORM VALIDATION FUNCTION
export const validate = e => {
  e.preventDefault()

  return (
    isInputValid(firstName) &&
    isInputValid(lastName) &&
    isInputValid(email) &&
    isInputValid(message)
  )
}

/**
 * Validation et fermeture au clavier
 */
DOM.modalForm.onkeydown = e => {
  if (e.key === 'Enter') {
    if (DOM.formModal.hasAttribute('aria-modal')) return validate(e)
  }
  if (e.key === 'Escape') {
    formDisplay('hide')
  }
}

export { firstName, lastName, email, message }
