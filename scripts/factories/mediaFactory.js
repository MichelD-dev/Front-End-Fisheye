import {lightbox} from '../modals/lightbox.js'
import {
  addOrRemoveLike,
  getTotalOfLikes,
  printLikesNbr,
  store,
} from '../API/likesAPI.js'
import {addReactionTo} from '../utils/eventListener.js'

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

    const imgTitle = document.createElement('span')
    imgTitle.classList.add('image__title')
    imgTitle.textContent = media.title
    imgTitle.setAttribute('id', `${media.title}`)

    const mediaCard = document.createElement(media.image ? 'img' : 'video')
    mediaCard.src = `./assets/thumbnails/${photographer.name.split(' ')[0]}/${
      media.image || media.video
    }`
    media.image && (mediaCard.alt = `Image titrée ${media.title}`)
    mediaCard.classList.add('media-card__image')
    media.video && mediaCard.classList.add('media-card__image_video')
    mediaCard.tabIndex = '0'
    mediaCard.setAttribute('loading', 'lazy')
    mediaCard.setAttribute('labelledBy', `${imgTitle.id}`)

    const playIconContainer = document.createElement('div')
    playIconContainer.classList.add('media-card__video-icon-container')

    const playIcon = document.createElement('i')
    playIcon.classList.add(
      'media-card__video-icon',
      'fa-solid',
      'fa-play',
      'fa-4x',
    )

    const imgDatas = document.createElement('div')
    imgDatas.classList.add('image__datas')

    const likes = document.createElement('h2')
    likes.classList.add('media-card__likesNbr')

    const likesNbr = document.createElement('span')
    likesNbr.setAttribute('role', 'note')
    likesNbr.setAttribute('aria-label', 'Nombre de likes')
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
      '.photographer__rate',
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
    likesNbr.insertAdjacentHTML('afterend', '<i class="fa-solid fa-heart"><i>')

    /**
     * Ouverture de la modale au click sur thumbnail
     */
    addReactionTo('click')
      .on(mediaCard)
      .withFunction(() =>
        lightbox(photographer, sortedPhotographerMedias, media.id).show(),
      )
    addReactionTo('click')
      .on(playIconContainer)
      .withFunction(() =>
        lightbox(photographer, sortedPhotographerMedias, media.id).show(),
      )

    /**
     * Ajout/retrait d'un like
     */
    addReactionTo('click')
      .on(likes)
      .withFunction(() => {
        addOrRemoveLike(media)
        printLikesNbr(media.id)(likesNbr)
      })

    addReactionTo('mousedown')
      .on(likes)
      .withFunction(() => (mediaCard.style.transform = 'none'))

    /**
     * ajout/retrait d'un like au clavier
     */
    addReactionTo('keydown')
      .on(mediaCard)
      .withFunction(e => {
        if (e.key === 'Enter') {
          return mediaCard.click()
        }

        const mediaIsLiked = !article.children[2].classList.contains('hidden')

        if (e.key === '+' && mediaIsLiked) return
        if (e.key === '-' && !mediaIsLiked) return

        if (
          (e.key === '+' && !mediaIsLiked) ||
          (e.key === '-' && mediaIsLiked)
        ) {
          addOrRemoveLike(media)
          printLikesNbr(media.id)(likesNbr)
        }
      })

    return article
  }

  getTotalOfLikes()

  return {getMediaCardDOM}
}

export default mediaFactory
