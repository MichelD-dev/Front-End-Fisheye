import { lightboxDisplay } from '../utils/modals.js'

export function mediaFactory(
  media,
  likesList,
  photographer,
  sortedPhotographerMedias
) {
  function getMediaCardDOM() {
    const article = document.createElement('article')
    article.classList.add('media-card')

    article.tabIndex = '0'
    article.addEventListener('keydown', e => {
      if (
        e.key === 'Enter' &&
        document.getElementById('lightbox').classList.contains('hidden')
      ) {
        mediaCard.click()
      }
    })
    // article.ariaLabel = title) //FIXME title

    const mediaCard = document.createElement(media.image ? 'img' : 'video')
    mediaCard.src = `../../assets/thumbnails/${
      photographer.name.split(' ')[0]
    }/${media.image || media.video}`
    media.image && (mediaCard.alt = media.title)
    mediaCard.classList.add('media-card__image')
    mediaCard.addEventListener('click', () =>
      lightboxDisplay('show', photographer, sortedPhotographerMedias, media.id)
    )
    mediaCard.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        mediaCard.click()
      }
    })
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
    imgDatas.appendChild(likes)
    likes.appendChild(likesNbr)
    likesNbr.insertAdjacentHTML('afterend', `<i class="fa-solid fa-heart"><i>`)

    return article
  }
  const likes = document.createElement('p')
  const likesNbr = document.createElement('span')
  likesNbr.id = `${media.id}-likes-count`

  let likesTotal = likesList
    .map(media => media.likes)
    .reduce((total, current) => total + current, 0)

  document.querySelector('.photographer__likes').textContent = `${likesTotal} `

  const incrementLikes = () => {
    //TODO ajout d'un like au clavier?
    media.likes += 1
    likesNbr.textContent = `${media.likes} `
    likesNbr.removeEventListener('click', incrementLikes)
    likesList = likesList.map(obj => {
      if (obj.id === media.id) {
        return { ...obj, likes: media.likes }
      }
      return obj
    })

    likesTotal = likesList
      .map(media => media.likes)
      .reduce((total, current) => total + current, 0)

    document.querySelector(
      '.photographer__likes'
    ).textContent = `${likesTotal} `
  }

  likesNbr.addEventListener('click', incrementLikes)
  likesNbr.textContent = `${media.likes} `

  return { getMediaCardDOM, incrementLikes }
}
