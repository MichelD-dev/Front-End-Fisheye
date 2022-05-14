import DOM from './domElements.js'

let cardTemplate = document.getElementById('card-template')
let mediaTemplate = document.getElementById('media-template')

const getSkeletons = pValue => {
  for (let i = 0; i < 6; i++) {
    if (pValue === 'print') {
      DOM.photographersSection?.append(cardTemplate.content.cloneNode(true))
      DOM.mediasSection?.append(mediaTemplate.content.cloneNode(true))
      ;[...document.querySelectorAll('.photographer__card')].map(card => {
        card.classList.add('fadein')
      })
    }
    if (pValue === 'hide') {
      ;[...document.querySelectorAll('.photographer__card')].map(card => {
        card.classList.add('fadeout')
        setTimeout(() => {
          card.remove()
        }, 1000)
      })
    }
  }
}

export default getSkeletons
