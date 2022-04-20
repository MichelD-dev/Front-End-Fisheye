import { lightboxDisplay } from '../modals/lightbox.js'

export function mediaFactory(media, photographer, sortedPhotographerMedias) {
  function getMediaCardDOM() {
    /**
     * Incrémentation unique du nombre de likes
     */
    const incrementLikes = () => {
      //TODO ajout d'un like au clavier?
      media.likes += 1
      likesNbr.textContent = `${media.likes} `
      likesNbr.removeEventListener('click', incrementLikes)
      sortedPhotographerMedias = sortedPhotographerMedias.map(obj => {
        if (obj.id === media.id) {
          return { ...obj, likes: media.likes }
        }
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

    const likesNbr = document.createElement('span')
    likesNbr.textContent = `${media.likes} `

    const likeIcon = document.createElement('i')
    likeIcon.classList.add('fa-solid', 'fa-heart')

    document.querySelector('.photographer__rate').textContent = `${photographer.price}€ / jour `

    article.appendChild(mediaCard)
    article.appendChild(imgDatas)
    imgDatas.appendChild(imgTitle)
    imgDatas.appendChild(likes)
    likes.appendChild(likesNbr)
    likesNbr.insertAdjacentHTML('afterend', `<i class="fa-solid fa-heart"><i>`)

    /**
     * Création des gestionnaires d'évènement sur les médias
     */
    likesNbr.addEventListener('click', incrementLikes)

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
