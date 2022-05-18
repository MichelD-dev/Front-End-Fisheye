/* eslint-disable no-extra-semi */
import DOM from './domElements.js'

const cardTemplate = document.getElementById('card-template')
const mediaTemplate = document.getElementById('media-template')

const setSkeletons = nbr => pValue => {
  /**
   * Fonction fadein/fadeout skeletons
   */
  const printSkeleton = direction =>
    [...document.getElementsByClassName('photographer__card')].map(card => {
      card.classList.add(direction)
      direction === 'fadeout' &&
        setTimeout(() => {
          card.remove()
        }, 1000)
    })

  /**
   * Loops affichage/suppression skeletons
   */
  if (nbr === 0) return

  if (pValue === 'to print') {
    DOM.photographersSection?.append(cardTemplate.content.cloneNode(true))
    DOM.mediasSection?.append(mediaTemplate.content.cloneNode(true))

    printSkeleton('fadein')
    setSkeletons(nbr - 1)(pValue)
  }

  if (pValue === 'to hide') {
    printSkeleton('fadeout')
    setSkeletons(nbr - 1)
  }
}

export default setSkeletons
