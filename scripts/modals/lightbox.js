import * as DOM from '../utils/domElements.js'
import {
  loadLikes,
  printLikeOnLightbox,
  printTotalOfLikes,
} from '../API/likesAPI.js'
import { updateMediaLikesOnLightboxClose } from '../pages/photographer.js'

/**
 * Création des balises img et video dans la balise figure
 */
const imageDisplay = document.createElement('img')
const videoDisplay = document.createElement('video')

const activeLike = document.createElement('i')
const inactiveLike = document.createElement('i')
activeLike.classList.add(
  'lightbox-caption__like_active',
  'fa-solid',
  'fa-heart'
)
inactiveLike.classList.add(
  'lightbox-caption__like_inactive',
  'fa-solid',
  'fa-heart'
)
DOM.likeInCaption.appendChild(inactiveLike)
DOM.likeInCaption.appendChild(activeLike)

// const likeIcon = document.querySelector('.lightbox-caption__like')

/**
 * Fonction de fermeture de la modale lightbox
 */
const closeLightboxModal = () => lightboxDisplay('hide')

let previouslyFocusedElement

/**
 * MODALE LIGHTBOX
 */
export const lightboxDisplay = (
  action,
  photographer,
  sortedPhotographerMedias,
  imageId,
  imagePositionInMediasArray = -1
) => {
  const displayNext = () =>
    displayNextMedia(sortedPhotographerMedias, photographer)
  const displayPrevious = () =>
    displayPreviousMedia(sortedPhotographerMedias, photographer)

  /**
   * AFFICHAGE DU MEDIA
   */
  DOM.mediasSection.classList.add('hidden')

  /**
   *  Récupération du média à afficher dans la lightbox
   */

  if (sortedPhotographerMedias) {
    const [media] = sortedPhotographerMedias.filter(
      media => media.id === imageId
    )
    const handlePrintLikeOnLightbox = () => {
      printLikeOnLightbox(media)
      document
        .querySelector('.lightbox-caption__like_inactive')
        .removeEventListener('click', handlePrintLikeOnLightbox)

      document
        .querySelector('.lightbox-caption__like_active')
        .removeEventListener('click', handlePrintLikeOnLightbox)
    }

    /**
     * Récupération de l'index du média dans le tableau des médias du photographe
     */
    imagePositionInMediasArray = sortedPhotographerMedias.indexOf(media)

    if (action === 'show') {
      previouslyFocusedElement = document.querySelector(':focus').parentElement

      /**
       * attributs de lecture sur balise vidéo
       */
      videoDisplay.controls = true //TODO Gestion des controls au clavier?
      videoDisplay.setAttribute('type', 'video/mp4')
      videoDisplay.setAttribute('tabIndex', '0')

      /**
       * Insertion du média dans le container lightbox avant son titre, en fonction de son type
       */
      DOM.lightboxContainer.insertBefore(
        videoDisplay,
        DOM.lightboxContainer.querySelector('figcaption')
      )
      DOM.lightboxContainer.insertBefore(
        imageDisplay,
        DOM.lightboxContainer.querySelector('figcaption')
      )

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
    loadLikes().find(like => {
      if (like.id === media.id) {
        if (like.isLikedByMe) {
          document.querySelector('.lightbox-caption__like-btn').checked = true
        } else {
          document.querySelector('.lightbox-caption__like-btn').checked = false
        }
        document.querySelector('.lightbox-caption__like-btn').checked =
          like.isLikedByMe ? true : false

        return like
      }
    })

    document
      .querySelector('.lightbox__close')
      .addEventListener('click', closeLightboxModal)

    document
      .querySelector('.lightbox__next')
      .addEventListener('click', displayNext)

    document
      .querySelector('.lightbox__previous')
      .addEventListener('click', displayPrevious)

    document
      .querySelector('.lightbox-caption__like_inactive')
      .addEventListener('click', handlePrintLikeOnLightbox)

    document
      .querySelector('.lightbox-caption__like_active')
      .addEventListener('click', handlePrintLikeOnLightbox)
  }

  // --------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------- //

  /**
   * BOUTON NEXT
   */
  const displayNextMedia = (sortedPhotographerMedias, photographer) => {
    // console.log(sortedPhotographerMedias)

    if (document.getElementById('lightbox').hasAttribute('aria-hidden')) {
      return
    }

    previouslyFocusedElement.nextSibling !== null
      ? (previouslyFocusedElement = previouslyFocusedElement.nextSibling)
      : (previouslyFocusedElement =
          previouslyFocusedElement.parentElement.firstElementChild)

    imagePositionInMediasArray =
      (imagePositionInMediasArray + 1) % sortedPhotographerMedias.length

    const i = imagePositionInMediasArray

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
    const media = loadLikes().find(
      media => media.id === sortedPhotographerMedias[i].id
    )

    if (media.isLikedByMe) {
      document.querySelector('.lightbox-caption__like-btn').checked = true
    } else {
      document.querySelector('.lightbox-caption__like-btn').checked = false
    }
  }

  // --------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------- //

  /**
   * BOUTON PREVIOUS
   */
  const displayPreviousMedia = (sortedPhotographerMedias, photographer) => {
    if (document.getElementById('lightbox').hasAttribute('aria-hidden')) {
      return
    }

    previouslyFocusedElement.previousSibling !== null
      ? (previouslyFocusedElement = previouslyFocusedElement.previousSibling)
      : (previouslyFocusedElement =
          previouslyFocusedElement.parentElement.lastElementChild)

    imagePositionInMediasArray =
      (imagePositionInMediasArray - 1 + sortedPhotographerMedias.length) %
      sortedPhotographerMedias.length

    const i = imagePositionInMediasArray

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
    const media = loadLikes().find(
      media => media.id === sortedPhotographerMedias[i].id
    )

    if (media.isLikedByMe) {
      document.querySelector('.lightbox-caption__like-btn').checked = true
    } else {
      document.querySelector('.lightbox-caption__like-btn').checked = false
    }
  }

  const changeMedia = e => {
    // console.log(sortedPhotographerMedias, photographer)
    if (e.key === 'ArrowRight' && DOM.lightbox.hasAttribute('aria-modal')) {
      displayNextMedia(sortedPhotographerMedias, photographer)
    }

    if (e.key === 'ArrowLeft' && DOM.lightbox.hasAttribute('aria-modal')) {
      displayPreviousMedia(sortedPhotographerMedias, photographer)
    }
    if (e.key === 'Escape') {
      lightboxDisplay('hide')
    }
  }

  window.addEventListener('keydown', changeMedia)
  // DOM.lightboxRightArrow.parentElement.addEventListener('keydown', changeMedia)
  // console.log(DOM.lightboxRightArrow.parentElement);

  // --------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------- //

  /**
   * On ferme la lightbox
   */
  if (action === 'hide') {
    console.log(document.querySelector('.lightbox__next'))
    const modal = document.querySelector('#lightbox')

    window.removeEventListener('keydown', changeMedia)

    document
      .querySelector('.lightbox__close')
      .removeEventListener('click', closeLightboxModal)

    document.querySelector('.lightbox__next').onclick = () => {}
    // .removeEventListener('click', displayNext)

    // document
    //   .querySelector('.lightbox__previous')
    //   .removeEventListener('click', displayPrevious)

    modal.ariaHidden = true
    modal.removeAttribute('aria-modal')

    DOM.mediasSection.classList.remove('hidden')
    previouslyFocusedElement?.firstChild?.focus()

    printTotalOfLikes()
  }
}

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
