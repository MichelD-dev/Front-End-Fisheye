import * as DOM from '../utils/domElements.js'

/**
 * On stocke les likes du photographe dans le local storage
 */
export const storeLikes = likes => {
  localStorage.setItem("photographer's liked medias", JSON.stringify(likes))
}

/**
 * On récupère les likes du photographe dans le local storage
 */
export const loadLikes = () => {
  return JSON.parse(localStorage.getItem("photographer's liked medias"))
}

// ------------------------------------------------------------ //
// ------------------------------------------------------------ //

/**
 * On initialise un tableau des ids des médias likés
 */
let likedImages = loadLikes()

/**
 * Ajout/retrait like sur média
 */
export const addOrRemoveLike = media => {
  /**
   * On récupère le média sur lequel on ajoute/enlève un like
   */
  const [mediaCard] = [...document.querySelectorAll('.media-card')].filter(
    elem => +elem.id === media.id
  )

  if (DOM.lightbox.hasAttribute('aria-hidden')) {
    /**
     * Si le like est apparent, on le fait disparaitre et on décrémente le compteur total de likes
     */
    if (!mediaCard.children[2].classList.contains('hidden')) {
      mediaCard.children[2].classList.add('hidden')
      media.likes -= 1

      /* On actualise le tableau des ids des medias likés sans le like retiré */
      likedImages = likedImages.map(likedImage => {
        if (likedImage.id === media.id) {
          return { ...likedImage, likes: media.likes, isLikedByMe: false }
        }
        return likedImage
      })

      /* On le mémorise  dans le local storage */
      storeLikes(likedImages)

      const likes = loadLikes()
      if (!mediaCard.children[2].classList.contains('hidden')) {
        likes.map(obj => {
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
      likedImages = likedImages.map(likedImage => {
        if (likedImage.id === media.id) {
          return { ...likedImage, likes: media.likes, isLikedByMe: true }
        }
        return likedImage
      })

      /* On mémorise le tableau des likes dans le local storage */
      storeLikes(likedImages)

      const likes = loadLikes()
      if (mediaCard.children[2].classList.contains('hidden')) {
        likes.map(obj => {
          if (obj.like === media.like) {
            mediaCard.children[2].classList.remove('hidden')
          }
        })
      }
    }
  }
  //   /**
  //    * Affichage nombre total de likes
  //    */
  // likesNbr.textContent = `${media.likes} `

  //   sortedPhotographerMedias = sortedPhotographerMedias.map(obj => {
  //     if (obj.id === media.id) {
  //       /**
  //        * On retourne un tableau des médias avec nombre de likes individuel actualisé
  //        */
  //       return { ...obj, likes: media.likes }
  //     }
  //     /* Sinon, on retourne un tbleau non modifié */
  //     return obj
  //   })

  //   /**
  //    * Incrémentation du nombre total de likes du photographe
  //    */
  //   likesTotal = sortedPhotographerMedias
  //     .map(media => media.likes)
  //     .reduce((total, current) => total + current, 0)

  //   document.querySelector('.photographer__likes').textContent = `${likesTotal} `
}

/**
 * Calcul du nombre total de likes du photographe
 */
export const getTotalOfLikes = () => {
  let likesTotal =
    loadLikes()
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
  if (document.getElementById('lightbox').hasAttribute('aria-modal')) {
    //FIXME nécessaire?
    likedImages.map(likedImage => {
      if (likedImage.id === media.id) {
        DOM.hiddenLikeCheckbox.checked = likedImage.isLikedByMe
      }
    })

    if (!DOM.hiddenLikeCheckbox.checked) {
      media.likes += 1

      /* On modifie le nombre de likes sur les images existantes dans le tableau */
      likedImages = likedImages.map(likedImage => {
        if (likedImage.id === media.id) {
          return { ...likedImage, likes: media.likes, isLikedByMe: true }
        }
        return likedImage
      })

      /* On mémorise le tableau des likes dans le local storage */
      storeLikes(likedImages)

      return
    }
    
    if (DOM.hiddenLikeCheckbox.checked) {
      media.likes -= 1

      /* On actualise le tableau des ids des medias likés sans le like retiré */
      likedImages = likedImages.map(likedImage => {
        if (likedImage.id === media.id) {
          return { ...likedImage, likes: media.likes, isLikedByMe: false }
        }
        return likedImage
      })

      /* On le mémorise  dans le local storage */
      storeLikes(likedImages)
    }
  }
}
// printLikeOnLightbox()
