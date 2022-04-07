const hideModal = () => {
  document
    .querySelector('.modal__close')
    .removeEventListener('click', hideModal)
  document
    .querySelector('[name="form"]')
    .removeEventListener('submit', formSubmit)
  modal.setAttribute('aria-hidden', true)
  modal.removeAttribute('aria-modal')
  modal.classList.add('hidden')
//   document.querySelector('.contact-button').addEventListener('click', showModal)
  //   modal.removeEventListener('animationend', hideModal)
}

const formSubmit = e => {
  e.preventDefault()
  console.log(e.currentTarget.firstname.value)
  console.log(e.currentTarget.lastname.value)
  console.log(e.currentTarget.email.value)
  console.log(e.currentTarget.message.value)
  document
    .querySelector('[name="form"]')
    .removeEventListener('submit', formSubmit)
  modalDisplay('hide', previouslyFocusedElement)
}

const focusableElements = 'input, textArea, button'
let focusables = []

const modalDisplay = (action, previouslyFocusedElement) => {
  if (action === 'show') {
    modal.classList.remove('hidden')
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', true)
    focusables = [...modal.querySelectorAll(focusableElements)]
    document.querySelector('.modal__close').addEventListener('click', hideModal)
    document
      .querySelector('[name="form"]')
      .addEventListener('submit', formSubmit)
  }
  if (action === 'hide') {
    modal.addEventListener('animationend', hideModal())
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
  }
}

const focusInModal = e => {
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

export { modalDisplay, focusInModal }
