import { lightbox } from '../modals/lightbox.js'
import {
  addOrRemoveLike,
  getTotalOfLikes,
  printLikesNbr,
  store,
} from '../API/likesAPI.js'
import { addReactionTo } from '../utils/eventListener.js'
import DOM from '../utils/domElements.js'

const mediaFactory = media => photographer => sortedPhotographerMedias => {
  function getMediaCardDOM() {
    /**
     * Création des éléments médias du DOM
     */
    const article = document.createElement('article')
    article.classList.add('media-card')
    article.ariaLabel = 'photo'
    article.ariaBusy = true
    article.id = media.id

    const mediaCard = document.createElement(media.image ? 'img' : 'video')
    mediaCard.src = `./assets/thumbnails/${photographer.name.split(' ')[0]}/${
      media.image || media.video
    }`
    media.image && (mediaCard.alt = media.title)
    mediaCard.classList.add('media-card__image')
    media.video && mediaCard.classList.add('media-card__image_video')
    mediaCard.tabIndex = '0'

    const playIconContainer = document.createElement('div')

    const playIcon = document.createElement('i')
    playIcon.classList.add(
      'media-card__video-icon',
      'fa-solid',
      'fa-play',
      'fa-4x'
    )

    const imgDatas = document.createElement('div')
    imgDatas.classList.add('image__datas')

    const imgTitle = document.createElement('span')
    imgTitle.classList.add('image__title')
    imgTitle.textContent = media.title

    const likes = document.createElement('p')
    likes.classList.add('media-card__likesNbr')

    const likesNbr = document.createElement('span')
    likesNbr.setAttribute('aria-live', 'polite')

    store.getLikedImages().find(likedImage => {
      if (likedImage.id === media.id) {
        likesNbr.textContent = `${media.likes} `
      }
    })

    const likeIcon = document.createElement('i')
    likeIcon.classList.add('fa-solid', 'fa-heart')

    const likeDisplayedOnMedia = document.createElement('div')
    likeDisplayedOnMedia.classList.add('media-card__like', 'hidden')

    const likeOnMedia = document.createElement('i')
    likeOnMedia.classList.add('fa-solid', 'fa-heart', 'fa-2x')
    likeDisplayedOnMedia.appendChild(likeOnMedia)

    document.querySelector(
      '.photographer__rate'
    ).textContent = `${photographer.price}€ / jour `

    article.appendChild(mediaCard)
    article.appendChild(imgDatas)
    article.appendChild(likeDisplayedOnMedia)
    article.children[0].classList.contains('media-card__image_video') &&
      article.appendChild(playIconContainer)
    playIconContainer.appendChild(playIcon)
    imgDatas.appendChild(imgTitle)
    imgDatas.appendChild(likes)
    likes.appendChild(likesNbr)
    likesNbr.insertAdjacentHTML('afterend', `<i class="fa-solid fa-heart"><i>`)

    /**
     * Ouverture de la modale au click sur thumbnail
     */
    addReactionTo('click')
      .on(mediaCard)
      .withFunction(() =>
        lightbox(photographer, sortedPhotographerMedias, media.id).show()
      )
    addReactionTo('click')
      .on(playIconContainer)
      .withFunction(() =>
        lightbox(photographer, sortedPhotographerMedias, media.id).show()
      )

    /**
     * Ouverture de la modale au clavier
     */
    addReactionTo('keydown')
      .on(article)
      .withFunction(e => {
        if (e.key === 'Enter' && DOM.lightbox.hasAttribute('aria-hidden')) {
          mediaCard.click()
        }
      })

    /**
     * Ajout/retrait d'un like
     */
    addReactionTo('click')
      .on(likes)
      .withFunction(() => {
        addOrRemoveLike(media)
        printLikesNbr(media.id)(likesNbr)
      })

    /**
     * Ajout/retrait d'un like au clavier
     */
    addReactionTo('keydown')
      .on(mediaCard)
      .withFunction(e => {
        if (e.keyCode === 32) {
          e.preventDefault()
          addOrRemoveLike(media)
          printLikesNbr(media.id)(likesNbr)
        }
      })

    return article
  }

  getTotalOfLikes()

  return { getMediaCardDOM }
}

export default mediaFactory
