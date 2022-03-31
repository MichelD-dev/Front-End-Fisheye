function photographerFactory(data) {
  const {
    name: phoName,
    portrait,
    city,
    country,
    tagline: tag,
    price: rate,
  } = data

  const picture = `assets/photographers/${portrait}`

  function getUserCardDOM() {
    const article = document.createElement('article')
    article.classList.add('photographer__card')
    article.setAttribute('aria-label', 'Fiche photographe')

    const img = document.createElement('img')
    img.setAttribute('src', picture)
    img.setAttribute('alt', `${phoName} - Fiche individuelle`)
    img.classList.add('photographer__portrait')

    const name = document.createElement('h2')
    name.textContent = phoName
    name.classList.add('photographer__name')
    name.setAttribute('aria-label', 'Nom du photographe')

    const articleHeader = document.createElement('a')
    articleHeader.setAttribute('href', '#')
    articleHeader.classList.add('photographer-card__header')
    articleHeader.appendChild(img)
    articleHeader.appendChild(name)

    const location = document.createElement('span')
    location.textContent = `${city}, ${country}`
    location.classList.add('photographer__location')
    location.setAttribute('aria-label', 'Localisation du photographe')

    const tagline = document.createElement('span')
    tagline.textContent = tag
    tagline.setAttribute('aria-label', 'Slogan du photographe')

    const price = document.createElement('span')
    price.textContent = `${rate}€/jour`
    price.classList.add('photographer__price')
    price.setAttribute('aria-label', 'Tarif journalier')

    article.appendChild(articleHeader)
    article.appendChild(location)
    article.appendChild(tagline)
    article.appendChild(price)

    return article
  }
  return { phoName, picture, getUserCardDOM }
}
