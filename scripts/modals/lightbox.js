import DOM from '../utils/domElements.js'
import {
  printIfThisMediaIsLiked,
  printLikeOnLightbox,
  printTotalOfLikes,
} from '../API/likesAPI.js'
import {addReactionTo, removeReactionTo} from '../utils/eventListener.js'

/**
 * MODALE LIGHTBOX
 */
export const lightbox = (
  photographer,
  sortedPhotographerMedias = [],
  imageId,
  imagePositionInMediasArray = -1,
) => {
  /**
   * Déclaration du thumbnail ayant le focus à l'ouverture de la lightbox
   */
  let previouslyFocusedElement

  /**
   *  Récupération du média à afficher dans la lightbox
   */
  let [media] = sortedPhotographerMedias.filter(media => media.id === imageId)

  /**
   * Récupération de l'index du média dans le tableau des médias du photographe
   */
  imagePositionInMediasArray = sortedPhotographerMedias.indexOf(media)

  /**
   * Ajout/retrait d'un like
   */
  const addLike = e => {
    if (e.key !== '+' && e.key !== '-') return

    setLikeOnLightbox(e, media)
  }

  /**
   * Affichage de la lightbox
   */
  const show = () => {
    /**
     * AFFICHAGE DU MEDIA
     */
    DOM.mediasSection.classList.add('hidden')

    previouslyFocusedElement = document.querySelector(':focus').parentElement

    /**
     * attributs de lecture sur balise vidéo
     */
    DOM.videoDisplay.setAttribute('controls', 'muted')
    DOM.videoDisplay.setAttribute('type', 'video/mp4')

    DOM.videoDescription.textContent = `${sortedPhotographerMedias[imagePositionInMediasArray].title}`

    /**
     * Affichage du titre du média dans la balise figcaption
     */
    DOM.lightboxCaption.textContent = `${sortedPhotographerMedias[imagePositionInMediasArray].title}`

    /**
     * Si le média est une image
     */
    if (media.image) {
      DOM.lightboxContainer.classList.remove('w100')

      /**
       * On passe la balise video en display: none
       */
      DOM.videoDisplay.classList.add('hidden')
      DOM.imageDisplay.classList.remove('hidden')

      /**
       * On définit la source de l'image
       */
      DOM.imageDisplay.src = `./assets/images/${
        photographer.name.split(' ')[0]
      }/${sortedPhotographerMedias[imagePositionInMediasArray].image}`
      DOM.imageDisplay.alt =
        sortedPhotographerMedias[imagePositionInMediasArray].title
    }

    /**
     * Si le média est une vidéo
     */
    if (media.video) {
      DOM.lightboxContainer.classList.add('w100')

      /**
       * On passe la balise image en display: none
       */
      DOM.imageDisplay.classList.add('hidden')
      DOM.videoDisplay.classList.remove('hidden')

      /**
       * On définit la source de la vidéo
       */
      DOM.videoDisplay.src = `./assets/images/${
        photographer.name.split(' ')[0]
      }/${sortedPhotographerMedias[imagePositionInMediasArray].video}`
      DOM.videoDisplay.alt =
        sortedPhotographerMedias[imagePositionInMediasArray].title
    }

    /**
     * On affiche la lightbox
     */
    DOM.lightbox.removeAttribute('aria-hidden')
    DOM.lightbox.ariaModal = true

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

    /**
     * ajout/retrait d'un like au clavier
     */
    addReactionTo('keydown').on(window).withFunction(addLike)
  }

  /**
   * Fonction de changement d'image dans la lightbox
   */
  const moveToMedia = media => {
    window.removeEventListener('keydown', addLike)

    if (media.image) {
      DOM.lightboxContainer.classList.remove('w100')
      DOM.imageDisplay.classList.remove('hidden')
      DOM.videoDisplay.classList.add('hidden')

      DOM.imageDisplay.src = `./assets/images/${
        photographer.name.split(' ')[0]
      }/${media.image}`
      DOM.imageDisplay.alt =
        sortedPhotographerMedias[imagePositionInMediasArray].title
    }

    if (media.video) {
      DOM.lightboxContainer.classList.add('w100')
      DOM.imageDisplay.classList.add('hidden')
      DOM.videoDisplay.classList.remove('hidden')

      DOM.videoDisplay.src = `./assets/images/${
        photographer.name.split(' ')[0]
      }/${media.video}`
      DOM.videoDisplay.alt =
        sortedPhotographerMedias[imagePositionInMediasArray].title
    }

    DOM.lightboxCaption.textContent = media.title

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

    // window.onkeydown = () => {}

    /**
     * ajout/retrait d'un like au clavier
     */
    addReactionTo('keydown')
      .on(window)
      .withFunction(
        e => {
          if (e.key !== '+' && e.key !== '-') return
          setLikeOnLightbox(e, media)
        },
        {once: true},
      )
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

  /**
   * Fonction d'ajout/retrait d'un like au clavier
   */
  const setLikeOnLightbox = (e, media) => {
    if (e.key !== '+' && e.key !== '-') return

    if (DOM.lightbox.hasAttribute('aria-modal')) {
      const mediaIsLiked = DOM.hiddenLikeCheckbox.checked

      if (e.key === '+' && mediaIsLiked) return
      if (e.key === '-' && !mediaIsLiked) return

      if ((e.key === '+' && !mediaIsLiked) || (e.key === '-' && mediaIsLiked)) {
        printLikeOnLightbox(media)
      }
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
    .on(DOM.lightboxLeftArrow)
    .withFunction(displayPreviousMedia)

  addReactionTo('click')
    .on(DOM.lightboxRightArrow)
    .withFunction(displayNextMedia)

  addReactionTo('click').on(DOM.lightboxClose).withFunction(hide)

  addReactionTo('keydown').on(window).withFunction(keyboardNavigation)

  const removeEventListeners = () => {
    removeReactionTo('click')
      .on(DOM.lightboxLeftArrow)
      .withFunction(displayPreviousMedia)

    removeReactionTo('click')
      .on(DOM.lightboxRightArrow)
      .withFunction(displayNextMedia)

    removeReactionTo('click').on(DOM.lightboxClose).withFunction(hide)

    removeReactionTo('keydown').on(window).withFunction(keyboardNavigation)
  }

  return {show, hide, displayPreviousMedia, displayNextMedia}
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
  const isVideoDisplayed = !DOM.videoDisplay.classList.contains('hidden')

  /**
   * On récupère les éléments qui acquerront le focus
   */
  const focusableElements = `button, input, ${isVideoDisplayed && 'video'}`

  /**
   * On crée un tableau des éléments focusables (et on ordonne l'ordre du focus sur tabulation en triant les tabindex)
   */
  const focusables = [...DOM.lightbox.querySelectorAll(focusableElements)].sort(
    (a, b) => a.tabIndex - b.tabIndex,
  )

  e.preventDefault()

  let index = focusables.findIndex(
    elem => elem === DOM.lightbox.querySelector(':focus'),
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
