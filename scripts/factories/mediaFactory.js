export function mediaFactory(media) {
  let params = new URL(document.location).searchParams
  let id = parseInt(params.get('id'))

  const { photographers } = JSON.parse(localStorage.getItem('data'))
  const photographer = photographers.find(
    photographer => photographer.id === id
  )

  function getMediaCardDOM() {
    const article = document.createElement('article')
    article.classList.add('media-card')
    // article.setAttribute('aria-label', title) //FIXME title

    const mediaCard = document.createElement(media.image ? 'img' : 'video')
    mediaCard.setAttribute(
      'src',
      `../../assets/images/${photographer.name.split(' ')[0]}/${
        media.image || media.video
      }`
    )
    media.image && mediaCard.setAttribute('alt', ``)//FIXME
    media.video && mediaCard.setAttribute('controls', '')
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
