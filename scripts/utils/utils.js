import {store} from '../API/likesAPI.js'
import {form} from '../modals/form.js'
import {focusInLightbox, lightbox} from '../modals/lightbox.js'
import DOM from './domElements.js'
import {addReactionTo} from './eventListener.js'

/**
 * Fonction de validation des inputs du formulaire
 */
const isInputValid = ({value, regex, id, errorText}) => {
  let trimmedValue = value.trim()

  /*
    En cas d'absence de texte dans le champ ou de caractères non autorisés entrés, on appelle la fonction setErrorMessage() avec l'id du champ et le message approprié, on remet le focus sur le champ en erreur, et on renvoie false à destination du test de validation lors du submit
    */
  if (!regex.test(trimmedValue) || !value) {
    setErrorMessage(id, errorText)
    document.getElementById(id).focus()
    return false
  }

  /*
  En cas de saisie valide de texte, on reset la fonction d'erreur,
  on affiche dans le champ le texte entré, debarrassé des éventuels espaces avant et après, passé en lowerCase, avec l'éventuel espace entre deux mots réduit à un seul caractère, et on renvoie true à destination du test de validation lors du submit
  */
  setErrorMessage(id, '')
  if (id !== 'message') {
    document.getElementById(id).value = trimmedValue
      .toLowerCase()
      .replace(/  +/g, ' ')
  }
  return true
}

/**
 * Message d'erreur de validation
 */
const setErrorMessage = (id, message) => {
  /* On selectionne le champ d'erreur associé à l'input dont on a récupéré l'id */
  const error = document.getElementById(`${id}-error`)

  /* On affiche le message d'erreur approprié selon l'input */
  error && (error.textContent = message)

  /* On ajoute une bordure rouge à l'input */
  document.getElementById(id).classList.add('error')
  error.style.border = '2px solid red'

  /* S'il n'y a pas de message d'erreur reçu, il s'agit d'un reset, on affiche alors une bordure verte */
  if (message === '') {
    document.getElementById(id).classList.remove('error')
    document.getElementById(id).classList.add('success')
    error.style.border = 'none'
  }
}

const keyboardNavigation = () => {
  addReactionTo('keydown')
    .on(window)
    .withFunction(
      e => {
        if (
          (e.key === 'Escape' || e.key === 'Esc') &&
          DOM.modal.hasAttribute('aria-modal')
        ) {
          form.hide()
        }
        if (
          (e.key === 'Escape' || e.key === 'Esc') &&
          DOM.lightbox.hasAttribute('aria-modal')
        ) {
          lightbox().hide()
        }
        if (e.key === 'Tab' && DOM.lightbox.hasAttribute('aria-modal')) {
          focusInLightbox(e)
        }
      },
      {once: true},
    )
}

/* intersection Observer */
const observer = new IntersectionObserver(
  entries =>
    entries.forEach((entry, i = 1) => {
      setTimeout(() => {
        entry.target.classList.toggle('fadein', entry.isIntersecting)
      }, 100 * i)
      entry.target.setAttribute('aria-busy', false)
      i++
      if (entry.isIntersecting) observer.unobserve(entry.target)
    }),
  {
    threshold: 0.2,
  },
)

/* Mutation Observer */
const mutationObserver = new MutationObserver(() => {
  const mediaCards = [...DOM.mediasSection.getElementsByClassName('media-card')]

  store.getLikedImages().map(media => {
    mediaCards.find(likedMedia => {
      if (+likedMedia.id === media.id) {
        likedMedia.querySelector(
          '.media-card__likesNbr > span',
        ).textContent = `${media.likes} `

        media.isLiked
          ? likedMedia.children[2].classList.remove('hidden')
          : likedMedia.children[2].classList.add('hidden')
      }
    })
  })
})

export {
  isInputValid,
  setErrorMessage,
  keyboardNavigation,
  observer,
  mutationObserver,
}
