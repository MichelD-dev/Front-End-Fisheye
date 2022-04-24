import { lightboxDisplay } from '../modals/lightbox.js'

let likedImages = []
export function mediaFactory(media, photographer, sortedPhotographerMedias) {
  function getMediaCardDOM() {
    /**
     * Ajout/retrait like sur média
     */
    const addOrRemoveLike = () => {
      /**
       * On récupère le média sur lequel on ajoute/enlève un like
       */
      const [mediaCard] = [...document.querySelectorAll('.media-card')].filter(
        media => media.id === article.id
      )
      //TODO ajout d'un like au clavier?

      /**
       * Si le like est apparent, on le fait disparaitre et on décrémente le compteur total de likes
       */
      if (!mediaCard.children[2].classList.contains('hidden')) {
        mediaCard.children[2].classList.add('hidden')
        media.likes -= 1
        /* On actualise le tableau des ids des medias likés sans le like retiré*/
        likedImages = likedImages.filter(
          likedImageId => likedImageId !== mediaCard.id
        )
        /* On le mémorise  dans le local storage */
        localStorage.setItem(
          "photographer's liked medias",
          JSON.stringify(likedImages)
        )

        /**
         * Si le like est caché, on le fait apparaître et on incrémente le compteur total de likes
         */
      } else {
        mediaCard.children[2].classList.remove('hidden')
        media.likes += 1
        /* On actualise le tableau des ids des medias likés avec le nouveau like*/
        likedImages.push(mediaCard.id)
        /* On le mémorise  dans le local storage */
        localStorage.setItem(
          "photographer's liked medias",
          JSON.stringify(likedImages)
        )
      }

      /**
       * Affichage nombre total de likes
       */
      likesNbr.textContent = `${media.likes} `

      sortedPhotographerMedias = sortedPhotographerMedias.map(obj => {
        if (obj.id === media.id) {
          /**
           * On retourne un tableau des médias avec nombre de likes individuel actualisé
           */
          return { ...obj, likes: media.likes }
        }
        /* Sinon, on retourne un tbleau non modifié */
        return obj
      })

      /**
       * Incrémentation du nombre total de likes du photographe
       */
      likesTotal = sortedPhotographerMedias
        .map(media => media.likes)
        .reduce((total, current) => total + current, 0)

      document.querySelector(
        '.photographer__likes'
      ).textContent = `${likesTotal} `
    }

    /**
     * Création des éléments médias du DOM
     */
    const article = document.createElement('article')
    article.classList.add('media-card')
    // article.ariaLabel = title) //FIXME title
    article.tabIndex = '0'
    article.id = media.id

    const mediaCard = document.createElement(media.image ? 'img' : 'video')
    mediaCard.src = `../../assets/thumbnails/${
      photographer.name.split(' ')[0]
    }/${media.image || media.video}`
    media.image && (mediaCard.alt = media.title)
    mediaCard.classList.add('media-card__image')

    const imgDatas = document.createElement('div')
    imgDatas.classList.add('image__datas')

    const imgTitle = document.createElement('span')
    imgTitle.classList.add('image__title')
    imgTitle.textContent = media.title

    const likes = document.createElement('p')
    likes.classList.add('media-card__likesNbr')

    const likesNbr = document.createElement('span')
    likesNbr.textContent = `${media.likes} `

    const likeIcon = document.createElement('i')
    likeIcon.classList.add('fa-solid', 'fa-heart')

    const displayedLikeOnMedia = document.createElement('i')
    displayedLikeOnMedia.classList.add(
      'fa-solid',
      'fa-heart',
      'fa-2x',
      'media-card__like',
      'hidden'
    )

    document.querySelector(
      '.photographer__rate'
    ).textContent = `${photographer.price}€ / jour `

    article.appendChild(mediaCard)
    article.appendChild(imgDatas)
    article.appendChild(displayedLikeOnMedia)
    imgDatas.appendChild(imgTitle)
    imgDatas.appendChild(likes)
    likes.appendChild(likesNbr)
    likesNbr.insertAdjacentHTML('afterend', `<i class="fa-solid fa-heart"><i>`)

    /**
     * Création des gestionnaires d'évènement sur les médias
     */
    likes.addEventListener('click', addOrRemoveLike)

    mediaCard.addEventListener('click', () =>
      lightboxDisplay('show', photographer, sortedPhotographerMedias, media.id)
    )

    article.addEventListener('keydown', e => {
      if (
        e.key === 'Enter' &&
        document.getElementById('lightbox').hasAttribute('aria-hidden')
      ) {
        mediaCard.click()
      }
    })

    return article
  }

  /**
   * Calcul et affichage du nombre total de likes du photographe
   */
  let likesTotal = sortedPhotographerMedias
    .map(media => media.likes)
    .reduce((total, current) => total + current, 0)

  document.querySelector('.photographer__likes').textContent = `${likesTotal} `

  return { getMediaCardDOM }
}
