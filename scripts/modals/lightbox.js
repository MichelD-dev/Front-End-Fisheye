import * as DOM from '../utils/domElements.js'
import {
  loadLikes,
  printLikeOnLightbox,
  printTotalOfLikes,
} from '../API/likesAPI.js'

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
DOM.caption.appendChild(inactiveLike)
DOM.caption.appendChild(activeLike)

// const likeIcon = document.querySelector('.lightbox-caption__like')
let imagePositionInMediasArray = -1

/**
 * MODALE LIGHTBOX
 */
export const lightboxDisplay = (
  action,
  photographer,
  sortedPhotographerMedias,
  imageId,
  previouslyFocusedElement
) => {
  /**
   * AFFICHAGE DU MEDIA
   */
  previouslyFocusedElement = document.querySelector(':focus')
  DOM.mediasSection.classList.add('hidden')

  /**
   *  Récupération du média à afficher dans la lightbox
   */

  if (sortedPhotographerMedias) {
    const [media] = sortedPhotographerMedias.filter(
      media => media.id === imageId
    )

    /**
     * Récupération de l'index du média dans le tableau des médias du photographe
     */
    imagePositionInMediasArray = sortedPhotographerMedias.indexOf(media)

    const handlePrintLikeOnLightbox = () => printLikeOnLightbox(media)

    if (action === 'show') {
      /**
       * attributs de lecture sur balise vidéo
       */
      videoDisplay.controls = true //TODO Gestion des controls au clavier?
      videoDisplay.setAttribute('type', 'video/mp4')
      videoDisplay.setAttribute('tabIndex', '0')

      /**
       * Insertion du média dans le container lightbox avant son titre, en fonction de * * son type
       */
      DOM.lightboxContainer.insertBefore(
        videoDisplay,
        DOM.lightboxContainer.firstChild
      )
      DOM.lightboxContainer.insertBefore(
        imageDisplay,
        DOM.lightboxContainer.firstChild
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
      }
    })

    document
      .querySelector('.lightbox__close')
      .addEventListener('click', closeLightboxModal)

    document.querySelector('.lightbox__next').addEventListener('click', () =>
      //FIXME quid du remove?
      displayNextMedia(sortedPhotographerMedias, photographer)
    )

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        displayNextMedia(sortedPhotographerMedias, photographer)
      }
    })

    document
      .querySelector('.lightbox__previous')
      .addEventListener('click', () =>
        //FIXME quid du remove?
        displayPreviousMedia(sortedPhotographerMedias, photographer)
      )

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        displayPreviousMedia(sortedPhotographerMedias, photographer)
      }
    })
    document
      .querySelector('.lightbox-caption__like_inactive')
      .addEventListener('click', handlePrintLikeOnLightbox)
    // document
    //   .querySelector('.lightbox-caption__like_active')
    //   .addEventListener('click', handlePrintLikeOnLightbox)
  }

  window.removeEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      displayPreviousMedia()
    }
  })

  window.removeEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      displayPreviousMedia()
    }
  })

  /**
   * BOUTON NEXT
   */
  const displayNextMedia = (sortedPhotographerMedias, photographer) => {
     if (document.getElementById('lightbox').hasAttribute('aria-hidden')) {
      return
    }

    imagePositionInMediasArray =
      (imagePositionInMediasArray + 1) % sortedPhotographerMedias.length

    let i = imagePositionInMediasArray

    if (sortedPhotographerMedias[i].image) {
      //FIXME
      imageDisplay.classList.remove('hidden')
      videoDisplay.classList.add('hidden')
      imageDisplay.src = `../../assets/images/${
        photographer.name.split(' ')[0]
      }/${sortedPhotographerMedias[i].image}`
    }

    if (sortedPhotographerMedias[i].video) {
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
    loadLikes().find(like => {
      if (like.id === sortedPhotographerMedias[i].id) {
        if (like.isLikedByMe) {
          document.querySelector('.lightbox-caption__like-btn').checked = true
        } else {
          document.querySelector('.lightbox-caption__like-btn').checked = false
        }
      }
    })
  }

  /**
   * BOUTON PREVIOUS
   */
  const displayPreviousMedia = (sortedPhotographerMedias, photographer) => {
    if (document.getElementById('lightbox').hasAttribute('aria-hidden')) {
      return
    }

    imagePositionInMediasArray =
      (imagePositionInMediasArray - 1 + sortedPhotographerMedias.length) %
      sortedPhotographerMedias.length

    let i = imagePositionInMediasArray

    if (sortedPhotographerMedias[i].image) {
      imageDisplay.classList.remove('hidden')
      videoDisplay.classList.add('hidden')
      sortedPhotographerMedias[i].image &&
        (imageDisplay.src = `../../assets/images/${
          photographer.name.split(' ')[0]
        }/${sortedPhotographerMedias[i].image}`)
    }

    if (sortedPhotographerMedias[i].video) {
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
    loadLikes().find(like => {
      if (like.id === sortedPhotographerMedias[i].id) {
        if (like.isLikedByMe) {
          document.querySelector('.lightbox-caption__like-btn').checked = true
        } else {
          document.querySelector('.lightbox-caption__like-btn').checked = false
        }
      }
    })
  }

  /**
   * On ferme la lightbox
   */
  if (action === 'hide') {
    const modal = document.querySelector('#lightbox')

    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()

    document
      .querySelector('.lightbox__close')
      .removeEventListener('click', closeLightboxModal)

    document
      .querySelector('.lightbox__next')
      .removeEventListener('click', displayNextMedia)

    document
      .querySelector('.lightbox__previous')
      .removeEventListener('click', displayPreviousMedia)

    // document
    //   .querySelector('.lightbox-caption__like_inactive')
    //   .removeEventListener('click', handlePrintLikeOnLightbox)

    // document
    //   .querySelector('.lightbox-caption__like_active')
    //   .removeEventListener('click', handlePrintLikeOnLightbox)

    modal.ariaHidden = true
    modal.removeAttribute('aria-modal')

    DOM.mediasSection.classList.remove('hidden')

    printTotalOfLikes()
  }
}

/**
 * Fonction de fermeture de la modale lightbox
 */
const closeLightboxModal = () => lightboxDisplay('hide')
