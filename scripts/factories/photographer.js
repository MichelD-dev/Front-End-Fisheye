function photographerFactory(data) {
  const { name: phName, portrait, city, country, tagline: tag, price: prc } = data

  const picture = `assets/photographers/${portrait}`

  function getUserCardDOM() {
    const article = document.createElement('article')
    article.classList.add('photographer__card')

    const img = document.createElement('img')
    img.setAttribute('src', picture)
    img.classList.add('photographer__portrait')
    img.setAttribute('alt', phName)

    const name = document.createElement('name')
    name.textContent = phName
    name.classList.add('photographer__name')

    const location = document.createElement('span')
    location.textContent = `${city}, ${country}`
    location.classList.add('photographer__location')

    const tagline = document.createElement('span')
    tagline.textContent = tag

    const price = document.createElement('span')
    price.textContent = `${prc}€/jour`
    price.classList.add('photographer__price')

    article.appendChild(img)
    article.appendChild(name)
    article.appendChild(location)
    article.appendChild(tagline)
    article.appendChild(price)

    return article
  }
  return { name, picture, getUserCardDOM }
}
