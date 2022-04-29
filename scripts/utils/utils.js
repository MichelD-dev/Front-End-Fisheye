// import { formModal } from './domElements.js'

// const launchModal = (modal = formModal) => modal.classList.add('visible')

// const closeModal = (modal = formModal) => modal.classList.remove('visible')

// --------------------------------------------------------------- //
// -------------------VALIDATION DU FORMULAIRE-------------------- //
// --------------------------------------------------------------- //

/**
 * Test de validation des inputs du formulaire
 */
const isInputValid = ({ value, regex, id, errorText }) => {
  let trimmedValue = value.trim()

  if (!regex.test(trimmedValue) || !value) {
    setErrorMessage(id, errorText)
    document.getElementById(id).focus()
    return false
  }
  setErrorMessage(id, '')
  document.getElementById(id).value = trimmedValue
    .toLowerCase()
    .replace(/  +/g, ' ')
  return true
}

/**
 * Message d'erruer de validation
 */
const setErrorMessage = (id, message) => {
  const error = document.getElementById(`${id}-error`)

  error.textContent = message

  if (message === '') {
    document.getElementById(id).classList.remove('error')
    document.getElementById(id).classList.add('success')
  }
  document.getElementById(id).classList.add('error')
}

export { isInputValid, setErrorMessage }
