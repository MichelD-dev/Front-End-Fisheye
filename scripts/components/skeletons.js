/* eslint-disable no-extra-semi */
import DOM from '../utils/domElements.js'

const cardTemplate = document.getElementById('card-template')
const mediaTemplate = document.getElementById('media-template')

const setSkeletons = nbr => action => {
  const direction = {
    'to print': 'fadein',
    'to hide': 'fadeout',
  }

  /**
   * Loops affichage/suppression skeletons
   */
  if (!nbr) return

  if (action === 'to print') {
    DOM.photographersSection?.append(cardTemplate.content.cloneNode(true))
    DOM.mediasSection?.append(mediaTemplate.content.cloneNode(true))
  }
  ;[...document.getElementsByClassName('photographer__card')].map(card => {
    card.classList.add(direction[action])

    if (action === 'to hide') {
      setTimeout(() => {
        card.setAttribute('aria-hidden', true)
        card.remove()
      }, 1000)
      card.setAttribute('aria-hidden', false)
    }
  })

  return setSkeletons(nbr - 1)(action)
}

export default setSkeletons
