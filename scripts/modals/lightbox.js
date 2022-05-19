import DOM from '../utils/domElements.js'
import {
  printIfThisMediaIsLiked,
  printLikeOnLightbox,
  printTotalOfLikes,
} from '../API/likesAPI.js'
import { addReactionTo, removeReactionTo } from '../utils/eventListener.js'

let previouslyFocusedElement

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
  
    previouslyFocusedElement = document.querySelector(':focus').parentElement

    /**
     * attributs de lecture sur balise vidéo
     */
    videoDisplay.controls = true
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
     * On affiche le like sur la lightbox si le thumbnail est liké
     */
    printIfThisMediaIsLiked(media)

    /**
     * Lorsqu'on like le média dans la lightbox
     */
    DOM.hiddenLikeCheckbox.onchange = () => {
      printLikeOnLightbox(media)
    }
  }

  /**
   * Fonction de changement d'image dans la lightbox
   */
  const moveToMedia = media => {
    if (media.image) {
      DOM.lightboxContainer.classList.remove('w100')
      imageDisplay.classList.remove('hidden')
      videoDisplay.classList.add('hidden')

      imageDisplay.src = `../../assets/images/${
        photographer.name.split(' ')[0]
      }/${media.image}`
    }

    if (media.video) {
      DOM.lightboxContainer.classList.add('w100')
      imageDisplay.classList.add('hidden')
      videoDisplay.classList.remove('hidden')

      videoDisplay.src = `../../assets/images/${
        photographer.name.split(' ')[0]
      }/${media.video}`
    }

    document.querySelector('.lightbox-caption__text').textContent = media.title

    /**
     * On affiche le like sur la lightbox si le thumbnail est liké
     */
    printIfThisMediaIsLiked(media)

    /**
     * Affichage du like au click
     */
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
    /**
     * On récupère le thumbnail possédant le focus pour pouvoir l'avancer en même temps que la lightbox
     */
    const PFE = previouslyFocusedElement

    /**
     * Mise en boucle avant du focus sur les thumbnails
     */
    previouslyFocusedElement =
      PFE.nextSibling !== null
        ? PFE.nextSibling
        : PFE.parentElement.firstElementChild

    imagePositionInMediasArray =
      (imagePositionInMediasArray + 1) % sortedPhotographerMedias.length

    moveToMedia(sortedPhotographerMedias[imagePositionInMediasArray])
  }

  // --------------------------------------------------------------------------- //
  // ---------------------------PREVIOUS LIGHTBOX MEDIA------------------------- //
  // --------------------------------------------------------------------------- //

  /**
   * BOUTON PREVIOUS
   */
  const displayPreviousMedia = () => {
    /**
     * On récupère le thumbnail possédant le focus pour pouvoir l'avancer en même temps que la lightbox
     */
    const PFE = previouslyFocusedElement

    /**
     * Mise en boucle arrière du focus sur les thumbnails
     */
    previouslyFocusedElement =
      PFE.previousSibling !== null
        ? PFE.previousSibling
        : PFE.parentElement.lastElementChild

    imagePositionInMediasArray =
      (imagePositionInMediasArray - 1 + sortedPhotographerMedias.length) %
      sortedPhotographerMedias.length

    moveToMedia(sortedPhotographerMedias[imagePositionInMediasArray])
  }

  /**
   * Navigation au clavier
   */
  const keyboardNavigation = e => {
    if (DOM.lightbox.hasAttribute('aria-modal')) {
      e.key === 'ArrowRight' && displayNextMedia()
      e.key === 'ArrowLeft' && displayPreviousMedia()
      e.key === 'Escape' && /*lightbox*/ hide()
    }
  }

  // --------------------------------------------------------------------------- //
  // ------------------------FERMETURE DE LA LIGHTBOX--------------------------- //
  // --------------------------------------------------------------------------- //

  const hide = () => {
    DOM.lightbox.ariaHidden = true
    DOM.lightbox.removeAttribute('aria-modal')

    DOM.mediasSection.classList.remove('hidden')

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

  return { show, hide, displayPreviousMedia, displayNextMedia }
}

// --------------------------------------------------------------------------- //
// -----------------------------GESTION DU FOCUS------------------------------ //
// --------------------------------------------------------------------------- //

/**
 * Navigation au clavier
 */
addReactionTo('keydown')
  .on(window)
  .withFunction(e => {
    if (e.key === 'Tab' && DOM.lightbox.hasAttribute('aria-modal')) {
      focusInLightbox(e)
    }
  })

/**
 * Changement de focus au clavier et maintien du focus dans la modale
 */
export const focusInLightbox = e => {
  const isVideoDisplayed = !document
    .querySelector('.lightbox__video')
    .classList.contains('hidden')

  /**
   * On récupère les éléments qui acquerront le focus
   */
  const focusableElements = `button, input, ${isVideoDisplayed && 'video'}`

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
