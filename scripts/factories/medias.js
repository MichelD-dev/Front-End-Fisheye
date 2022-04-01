const mediasFactory = data => {
  const { id, photographerId, title, image, likes, date, price } = data
  console.log(data)
  let params = new URL(document.location).searchParams
  let ide = parseInt(params.get('id'))

  const photographers = JSON.parse(localStorage.getItem('photographers'))
  const photographer = photographers.find(
    photographer => photographer.id === ide
  )

  const pictures = `assets/images/${photographer.name.split(' ')[0]}`
  console.log(pictures);



  const array = []
  array.push(`${pictures}/${image}`)

  function getMediaCardDOM() {
    const article = document.createElement('article')
    article.classList.add('media__card')
    article.setAttribute('aria-label', title) //FIXME title
  }
  return { getMediaCardDOM, title }
}
