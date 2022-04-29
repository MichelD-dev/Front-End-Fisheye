import { lightboxDisplay } from '../modals/lightbox.js'
import {
  addOrRemoveLike,
  loadLikes,
  getTotalOfLikes,
} from '../utils/likesAPI.js'

export function mediaFactory(media, photographer, sortedPhotographerMedias) {
  function getMediaCardDOM() {
    /**
     * Création des éléments médias du DOM
     */
    const article = document.createElement('article')
    article.classList.add('media-card')
    // article.ariaLabel = title) //FIXME title
    article.id = media.id
    
    const mediaCard = document.createElement(media.image ? 'img' : 'video')
    mediaCard.src = `../../assets/thumbnails/${
      photographer.name.split(' ')[0]
    }/${media.image || media.video}`
    media.image && (mediaCard.alt = media.title)
    mediaCard.classList.add('media-card__image')
    mediaCard.tabIndex = '0'
    
    const imgDatas = document.createElement('div')
    imgDatas.classList.add('image__datas')

    const imgTitle = document.createElement('span')
    imgTitle.classList.add('image__title')
    imgTitle.textContent = media.title

    const likes = document.createElement('p')
    likes.classList.add('media-card__likesNbr')

    const likesNbr = document.createElement('span')
    loadLikes().find(likedImage => {
      if (likedImage.id === media.id) {
        likesNbr.textContent = `${media.likes} `
      }
    })

    const likeIcon = document.createElement('i')
    likeIcon.classList.add('fa-solid', 'fa-heart')

    const borderedLikeOnMedia = document.createElement('div')
    borderedLikeOnMedia.classList.add('media-card__like', 'hidden')

    const likeOnMedia = document.createElement('i')
    likeOnMedia.classList.add('fa-solid', 'fa-heart', 'fa-2x')
    borderedLikeOnMedia.appendChild(likeOnMedia)

    document.querySelector(
      '.photographer__rate'
    ).textContent = `${photographer.price}€ / jour `

    article.appendChild(mediaCard)
    article.appendChild(imgDatas)
    article.appendChild(borderedLikeOnMedia)
    imgDatas.appendChild(imgTitle)
    imgDatas.appendChild(likes)
    likes.appendChild(likesNbr)
    likesNbr.insertAdjacentHTML('afterend', `<i class="fa-solid fa-heart"><i>`)

    /**
     * Ajout/retrait d'un like, et affichage nombre de likes
     */
    const printLikesNbr = () => {
      loadLikes().find(likedImage => {
        if (likedImage.id === media.id) {
          likesNbr.textContent = `${likedImage.likes} `

          document.querySelector(
            '.photographer__likes'
          ).textContent = `${getTotalOfLikes()} `
        }
      })
    }
    likes.addEventListener('click', () => {
      addOrRemoveLike(media)
      printLikesNbr()
    })
    
    /**
     * Ouverture de la modale au click sur thumbnail
     */
    mediaCard.addEventListener('click', () =>
      lightboxDisplay('show', photographer, sortedPhotographerMedias, media.id)
    )

    /**
     * Ouverture de la modale au clavier
     */
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
  
  getTotalOfLikes()

  return { getMediaCardDOM }
}
