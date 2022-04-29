// import * as DOM from './domElements.js'
// import {
//   launchModal,
//   closeModal,
//   isInputValid,

//   setErrorMessage,
// } from './utils.js'

// // DOM.formModalBtn.forEach(btn => (btn.onclick = () => launchModal()))

// // DOM.formModalCloseBtn.onclick = () => closeModal()

// let firstName = {
//   value: '',
//   regex: /^[a-z][ a-z0-9á-ÿæœ\._\-]{1,}$/i,
//   id: 'first',
//   errorText: 'Vous devez indiquer un prénom valide.',
// }

// let lastName = {
//   value: '',
//   regex: /^[a-z][ a-z0-9á-ÿæœ\._\-]{1,}$/i,
//   id: 'last',
//   errorText: 'Vous devez indiquer un nom valide.',
// }

// let email = {
//   value: '',
//   regex: /^[a-z0-9\-_]+[a-z0-9\.\-_]*@[a-z0-9\-_]{2,}\.[a-z\\.\-_]+[a-z\-_]+/i,
//   id: 'email',
//   errorText: 'Vous devez indiquer une adresse mail valide.',
// }

// // FIRSTNAME VALIDATION:
// DOM.firstNameInput.onchange = e => (firstName.value = e.target.value)
// DOM.firstNameInput.onblur = () => isInputValid(firstName)

// // LASTNAME VALIDATION:
// DOM.lastNameInput.onchange = e => (lastName.value = e.target.value)
// DOM.lastNameInput.onblur = () => isInputValid(lastName)

// // EMAIL VALIDATION:
// DOM.emailInput.onchange = e => (email.value = e.target.value)
// DOM.emailInput.onblur = () => isInputValid(email)

// // FORM VALIDATION FUNCTION
// const validate = e => {
//   /* It prevents the page reload */
//   e.preventDefault()

//   if (
//     isInputValid(firstName) &&
//     isInputValid(lastName) &&
//     isInputValid(email)
//   ) {
//     document
//       .querySelectorAll('input:not([type="button"]):not([type="submit"])')
//       .forEach(input => {
//         input.classList.remove('error')
//         input.classList.remove('success')
//         input.value = ''
//       })

//     firstName.value = lastName.input = email.input = ''

//     closeModal()
//   }
// }

// DOM.form.onsubmit = validate

// // document.onkeydown = e => {
// //   if (e.key === 'Enter') {
// //     if (DOM.formModal.classList.contains('visible')) return validate(e)
// //   }
// //   if (e.key === 'Escape') {
// //     closeModal()
// //   }
// // }
