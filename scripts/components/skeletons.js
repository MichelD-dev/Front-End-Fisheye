/* eslint-disable no-extra-semi */
import DOM from '../utils/domElements.js'

const cardTemplate = document.getElementById('card-template')
const mediaTemplate = document.getElementById('media-template')

const setSkeletons = nbr => action => {
  /**
   * Fonction fadein/fadeout skeletons
   */
  const printSkeletons = direction =>
    [...document.getElementsByClassName('photographer__card')].map(card => {
      card.classList.add(direction)
      direction === 'fadeout' &&
        setTimeout(() => {
          card.setAttribute('aria-hidden', true)
          card.remove()
        }, 1000)
      card.setAttribute('aria-hidden', false)
    })

  /**
   * Loops affichage/suppression skeletons
   */
  if (nbr === 0) return

  if (action === 'to print') {
    DOM.photographersSection?.append(cardTemplate.content.cloneNode(true))
    DOM.mediasSection?.append(mediaTemplate.content.cloneNode(true))

    printSkeletons('fadein')
    setSkeletons(nbr - 1)(action)
  }

  if (action === 'to hide') {
    printSkeletons('fadeout')
    setSkeletons(nbr - 1)
  }
}

export default setSkeletons
