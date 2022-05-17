import DOM from '../utils/domElements.js'
import {
  isThisMediaLiked,
  printLikeOnLightbox,
  printTotalOfLikes,
} from '../API/likesAPI.js'
import { addReactionTo, removeReactionTo } from '../utils/eventListener.js'

let previouslyFocusedElement
// console.log(previouslyFocusedElement)

/**
 * MODALE LIGHTBOX
 */
export const lightbox = (
  photographer,
  sortedPhotographerMedias = [],
  imageId,
  imagePositionInMediasArray = -1
) => {
  const imageDisplay = document.querySelector('.lightbox__image')
  const videoDisplay = document.querySelector('.lightbox__video')

  /**
   *  Récupération du média à afficher dans la lightbox
   */

  // if (!sortedPhotographerMedias) return

  let [media] = sortedPhotographerMedias.filter(media => media.id === imageId)

  /**
   * Récupération de l'index du média dans le tableau des médias du photographe
   */
  imagePositionInMediasArray = sortedPhotographerMedias.indexOf(media)

  const show = () => {
    /**
     * AFFICHAGE DU MEDIA
     */
    DOM.mediasSection.classList.add('hidden')
    DOM.mediasSection.setAttribute('hidden', true)

    previouslyFocusedElement = document.querySelector(':focus').parentElement

    /**
     * attributs de lecture sur balise vidéo
     */
    videoDisplay.controls = true //TODO Gestion des controls au clavier?
    videoDisplay.setAttribute('type', 'video/mp4')
    videoDisplay.setAttribute('tabIndex', '0')

    /**
     * Affichage du titre du média dans la balise figcaption
     */
    document.querySelector(
      '.lightbox-caption__text'
    ).textContent = `${sortedPhotographerMedias[imagePositionInMediasArray].title}`

    /**
     * Si le média est une image
     */
    if (media.image) {
      DOM.lightboxContainer.classList.remove('w100')
      /**
       * On passe la balise video en display: none
       */
      videoDisplay.classList.add('hidden')
      imageDisplay.classList.remove('hidden')

      /**
       * On définit la source de l'image
       */
      imageDisplay.src = `../../assets/images/${
        photographer.name.split(' ')[0]
      }/${sortedPhotographerMedias[imagePositionInMediasArray].image}`
    }

    /**
     * Si le média est une vidéo
     */
    if (media.video) {
      DOM.lightboxContainer.classList.add('w100')
      /**
       * On passe la balise image en display: none
       */
      imageDisplay.classList.add('hidden')
      videoDisplay.classList.remove('hidden')

      /**
       * On définit la source de la vidéo
       */
      videoDisplay.src = `../../assets/images/${
        photographer.name.split(' ')[0]
      }/${sortedPhotographerMedias[imagePositionInMediasArray].video}`
    }

    /**
     * On affiche la lightbox
     */
    const lightbox = document.getElementById('lightbox')

    lightbox.removeAttribute('aria-hidden')

    lightbox.ariaModal = true

    /**
     * On affiche le like sur la lightbox si le média est liké
     */
    isThisMediaLiked(media)

    clickOnLightboxLike(media)
  }

  /**
   * Click sur like
   */
  const clickOnLightboxLike = media => {
    DOM.hiddenLikeCheckbox.onchange = () => {
      printLikeOnLightbox(media)
    }
  }

  // --------------------------------------------------------------------------- //
  // -----------------------------NEXT LIGHTBOX MEDIA--------------------------- //
  // --------------------------------------------------------------------------- //

  /**
   * BOUTON NEXT
   */
  const displayNextMedia = () => {
    // imagePositionInMediasArray => {
    //   if (executed) return
    //   executed = false
    //   ;() => {
    //     imagePositionInMediasArray
    //     executed = true
    //   }
    // }

    if (document.getElementById('lightbox').hasAttribute('aria-hidden')) {
      return
    }

    const PFE = previouslyFocusedElement

    previouslyFocusedElement =
      PFE.nextSibling !== null
        ? PFE.nextSibling
        : PFE.parentElement.firstElementChild

    imagePositionInMediasArray =
      (imagePositionInMediasArray + 1) % sortedPhotographerMedias.length

    let i = imagePositionInMediasArray

    if (sortedPhotographerMedias[i].image) {
      DOM.lightboxContainer.classList.remove('w100')
      imageDisplay.classList.remove('hidden')
      videoDisplay.classList.add('hidden')

      imageDisplay.src = `../../assets/images/${
        photographer.name.split(' ')[0]
      }/${sortedPhotographerMedias[i].image}`
    }

    if (sortedPhotographerMedias[i].video) {
      DOM.lightboxContainer.classList.add('w100')
      imageDisplay.classList.add('hidden')
      videoDisplay.classList.remove('hidden')

      videoDisplay.src = `../../assets/images/${
        photographer.name.split(' ')[0]
      }/${sortedPhotographerMedias[i].video}`
    }

    document.querySelector('.lightbox-caption__text').textContent =
      sortedPhotographerMedias[i].title

    /**
     * On affiche le like sur la lightbox si le média est liké
     */
    isThisMediaLiked(sortedPhotographerMedias[i])

    /**
     * On actualise l'affichage du like sur le thumbnail
     */
    clickOnLightboxLike(sortedPhotographerMedias[i])
  }

  // --------------------------------------------------------------------------- //
  // ---------------------------PREVIOUS LIGHTBOX MEDIA------------------------- //
  // --------------------------------------------------------------------------- //

  /**
   * BOUTON PREVIOUS
   */
  const displayPreviousMedia = () => {
    if (document.getElementById('lightbox').hasAttribute('aria-hidden')) {
      return
    }

    const PFE = previouslyFocusedElement

    previouslyFocusedElement =
      PFE.previousSibling !== null
        ? PFE.previousSibling
        : PFE.parentElement.lastElementChild

    imagePositionInMediasArray =
      (imagePositionInMediasArray - 1 + sortedPhotographerMedias.length) %
      sortedPhotographerMedias.length

    let i = imagePositionInMediasArray

    if (sortedPhotographerMedias[i].image) {
      DOM.lightboxContainer.classList.remove('w100')
      imageDisplay.classList.remove('hidden')
      videoDisplay.classList.add('hidden')

      sortedPhotographerMedias[i].image &&
        (imageDisplay.src = `../../assets/images/${
          photographer.name.split(' ')[0]
        }/${sortedPhotographerMedias[i].image}`)
    }

    if (sortedPhotographerMedias[i].video) {
      DOM.lightboxContainer.classList.add('w100')
      imageDisplay.classList.add('hidden')
      videoDisplay.classList.remove('hidden')

      sortedPhotographerMedias[i].video &&
        (videoDisplay.src = `../../assets/images/${
          photographer.name.split(' ')[0]
        }/${sortedPhotographerMedias[i].video}`)
    }

    document.querySelector('.lightbox-caption__text').textContent =
      sortedPhotographerMedias[i].title

    /**
     * On affiche le like sur la lightbox si le média est liké
     */
    isThisMediaLiked(sortedPhotographerMedias[i])

    /**
     * On actualise l'affichage du like sur le thumbnail
     */
    clickOnLightboxLike(sortedPhotographerMedias[i])
  }

  const keyboardNavigation = e => {
    if (DOM.lightbox.hasAttribute('aria-modal')) {
      e.key === 'ArrowRight' && displayNextMedia()
      e.key === 'ArrowLeft' && displayPreviousMedia()
      e.key === 'Escape' && /*lightbox*/ hide()
    }
  }

  /**
   * On ferme la lightbox
   */
  const hide = () => {
    const modal = document.querySelector('#lightbox')

    modal.ariaHidden = true
    modal.removeAttribute('aria-modal')

    DOM.mediasSection.classList.remove('hidden')
    DOM.mediasSection.setAttribute('hidden', false)
    previouslyFocusedElement?.firstChild?.focus()

    removeEventListeners()

    printTotalOfLikes()
  }

  // --------------------------------------------------------------------------- //
  // -------------------------------EVENT LISTENERS----------------------------- //
  // --------------------------------------------------------------------------- //

  addReactionTo('click')
    .on('.lightbox__previous')
    .withFunction(displayPreviousMedia)

  addReactionTo('click').on('.lightbox__next').withFunction(displayNextMedia)

  addReactionTo('click').on('.lightbox__close').withFunction(hide)

  addReactionTo('keydown').on(window).withFunction(keyboardNavigation)

  const removeEventListeners = () => {
    removeReactionTo('click')
      .on('.lightbox__previous')
      .withFunction(displayPreviousMedia)

    removeReactionTo('click')
      .on('.lightbox__next')
      .withFunction(displayNextMedia)

    removeReactionTo('click').on('.lightbox__close').withFunction(hide)

    removeReactionTo('keydown').on(window).withFunction(keyboardNavigation)
  }

  return { show, hide }
}

// --------------------------------------------------------------------------- //
// ------------------------FERMETURE DE LA LIGHTBOX--------------------------- //
// --------------------------------------------------------------------------- //

/**
 * On place le focus sur le like
 */
// document.querySelector('.lightbox-caption__like_inactive').focus()

// --------------------------------------------------------------------------- //
// --------------------------------------------------------------------------- //
// --------------------------------------------------------------------------- //

/**
 * GESTION DU FOCUS
 * Changement de focus au clavier et maintien du focus dans la modale
 */
export const focusInLightbox = e => {
  /**
   * On récupère les éléments qui acquerront le focus
   */
  const focusableElements = 'button, input'
  /**
   * On crée un tableau des éléments focusables
   */
  const focusables = [...DOM.lightbox.querySelectorAll(focusableElements)]

  e.preventDefault()
  let index = focusables.findIndex(
    elem => elem === DOM.lightbox.querySelector(':focus')
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
