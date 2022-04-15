import { lightboxDisplay } from '../utils/modals.js'

export function mediaFactory(media) {
  let id = +new URLSearchParams(document.location.search).get('id')
  // console.log(id);
  const { photographers } = JSON.parse(localStorage.getItem('data'))
  const photographer = photographers.find(
    photographer => photographer.id === id
  )
    /* Récupération des données */
    const { medias } = JSON.parse(localStorage.getItem('data'))
    /* Filtrage des données selon le photographe */
    const photographerMedias = medias.filter(
      media => media.photographerId === photographer.id
    )

  function getMediaCardDOM() {
    const article = document.createElement('article')
    article.classList.add('media-card')
    article.addEventListener('click', () =>
      lightboxDisplay('show', photographer, photographerMedias, media.id)
    )
    // article.ariaLabel = title) //FIXME title

    const mediaCard = document.createElement(media.image ? 'img' : 'video')
    mediaCard.src = (`../../assets/thumbnails/${photographer.name.split(' ')[0]}/${
        media.image || media.video
      }`
    )
    media.image && (mediaCard.alt = media.title)

    mediaCard.classList.add('media-card__image')
    const imgDatas = document.createElement('div')
    imgDatas.classList.add('image__datas')

    const imgTitle = document.createElement('span')
    imgTitle.classList.add('image__title')
    imgTitle.textContent = media.title

    const imgLikes = document.createElement('span')
    imgLikes.textContent = `${media.likes} `

    const likeIcon = document.createElement('i')
    likeIcon.classList.add('fa-solid', 'fa-heart')

    article.appendChild(mediaCard)
    article.appendChild(imgDatas)
    imgDatas.appendChild(imgTitle)
    imgDatas.appendChild(imgLikes)
    imgLikes.appendChild(likeIcon)

    return article
  }
  return { getMediaCardDOM }
}
