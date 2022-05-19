// import { updateMediasLikesOnLightboxClose } from '../pages/photographer.js'
import DOM from '../utils/domElements.js'

/**
 * On stocke les likes du photographe dans le local storage
 */
export const store = () => {
  const setLikedImages = likes => {
    localStorage.setItem("photographer's liked medias", JSON.stringify(likes))
  }

  /**
   * On récupère les likes du photographe du local storage
   */
  const getLikedImages = () => {
    return JSON.parse(localStorage.getItem("photographer's liked medias"))
  }

  return { setLikedImages, getLikedImages }
}

// ------------------------------------------------------------ //
// ------------------------------------------------------------ //

/**
 * Ajout/retrait like sur thumbnail
 */
export const addOrRemoveLike = media => {
  /**
   * On récupère le média sur lequel on ajoute/enlève un like
   */
  const [mediaCard] = [...document.getElementsByClassName('media-card')].filter(
    elem => +elem.id === media.id
  )

  /* On actualise le tableau des ids des medias likés */
  const updatedLikedImages = addLike => {
    /* On le mémorise  dans le local storage */
    store().setLikedImages(
      store()
        .getLikedImages()
        .map(likedImage => {
          if (likedImage.id === media.id) {
            return { ...likedImage, likes: media.likes, isLikedByMe: !!addLike }
          }
          return likedImage
        })
    )
  }

  /**
   * Si la lightbox est cachée, on agit sur les thumbnails
   */
  if (DOM.lightbox.hasAttribute('aria-hidden')) {
    /**
     * Si le like est apparent, on le fait disparaitre et on décrémente le compteur total de likes
     */
    if (!mediaCard.children[2].classList.contains('hidden')) {
      mediaCard.children[2].classList.add('hidden')
      media.likes -= 1

      /* On modifie le nombre de likes sur les images existantes dans le tableau */
      updatedLikedImages(0)

      if (!mediaCard.children[2].classList.contains('hidden')) {
        updatedLikedImages().map(obj => {
          if (obj.like === media.like) {
            mediaCard.children[2].classList.add('hidden')
          }
        })
      }

      return

      /**
       * Si le like est caché, on le fait apparaître et on incrémente le compteur total de likes
       */
    } else {
      mediaCard.children[2].classList.remove('hidden')
      media.likes += 1

      /* On modifie le nombre de likes sur les images existantes dans le tableau */
      updatedLikedImages(+1)

      if (mediaCard.children[2].classList.contains('hidden')) {
        updatedLikedImages.map(obj => {
          if (obj.like === media.like) {
            mediaCard.children[2].classList.remove('hidden')
          }
        })
      }
    }
  }
}

/**
 * Affichage nombre de likes par image
 */
export const printLikesNbr = id => likesNbr => {
  store()
    .getLikedImages()
    .find(likedImage => {
      if (likedImage.id === id) {
        likesNbr.textContent = `${likedImage.likes} `

        DOM.totalLikesNbr.textContent = `${getTotalOfLikes()} `
      }
    })
}

/**
 * Calcul du nombre total de likes du photographe
 */
export const getTotalOfLikes = () => {
  let likesTotal =
    store()
      .getLikedImages()
      ?.map(media => media.likes)
      .reduce((total, current) => total + current, 0) ?? []

  return likesTotal
}

/**
 * Affichage du nombre total de likes du photographe
 */
export const printTotalOfLikes = () => {
  DOM.totalLikesNbr.textContent = `${getTotalOfLikes()} `
}

printTotalOfLikes()

/**
 * Affichage du like dans la lightbox
 */
export const printLikeOnLightbox = media => {
  const updatedLikedImages = addLike => {
    /* On le mémorise  dans le local storage */
    store().setLikedImages(
      store()
        .getLikedImages()
        .map(likedImage => {
          if (likedImage.id === media.id) {
            return { ...likedImage, likes: media.likes, isLikedByMe: !!addLike }
          }
          return likedImage
        })
    )
  }

  /**
   * On vérifie dans le storage quels sont les médias likés
   */
  store()
    .getLikedImages()
    .map(likedImage => {
      if (likedImage.id === media.id) {
        DOM.hiddenLikeCheckbox.checked = likedImage.isLikedByMe
      }
    })

  if (!DOM.hiddenLikeCheckbox.checked) {
    media.likes += 1
    DOM.hiddenLikeCheckbox.checked = true

    /* On modifie le nombre de likes sur les images existantes dans le tableau */
    updatedLikedImages(+1)

    return
  }

  if (DOM.hiddenLikeCheckbox.checked) {
    media.likes -= 1
    DOM.hiddenLikeCheckbox.checked = false

    /* On modifie le nombre de likes sur les images existantes dans le tableau */
    updatedLikedImages(0)
  }
}

/**
 * Affichage like sur lightbox si thumbnail liké
 */
export const printIfThisMediaIsLiked = media => {
  store()
    .getLikedImages()
    .find(thisMedia => {
      if (thisMedia.id === media.id) {
        DOM.hiddenLikeCheckbox.checked = thisMedia.isLikedByMe
      }
    })
}
