import {addReactionTo} from '../utils/eventListener.js'

const photographerFactory = data => {
  const {
    id,
    name: phoName,
    portrait,
    city,
    country,
    tagline: tag,
    price: rate,
  } = data

  const picture = `assets/photographers/${portrait}`

  /**
   * Création des éléments DOM du photographe - page photographe
   */
  function getUserPageDOM() {
    document.title = `Fisheye | ${phoName}`

    const name = document.querySelector('.photographer__name')
    name.textContent = `${phoName}`

    const location = document.querySelector('.photographer__location')
    location.textContent = `${city}, ${country}`

    const tagline = document.querySelector('.photographer__tagline')
    tagline.textContent = `${tag}`

    const portrait = document.querySelector('.photographer__portrait')
    portrait.src = picture
    portrait.alt = `${phoName} - Fiche individuelle`

    return {name, location, tagline, portrait}
  }

  /**
   * Création des éléments DOM des photographes - page d'accueil
   */
  function getUserCardDOM() {
    const article = document.createElement('article')
    article.classList.add('photographer__card', 'card')
    article.ariaLabel = `Fiche photographe, ${phoName}, ${city}, ${rate}€ par jour, sa devise, ${tag}`
    article.ariaBusy = true
    article.role= "link"
    article.tabIndex = '0'

    const img = document.createElement('img')
    img.src = picture
    img.alt = `${phoName} - Fiche individuelle`
    img.classList.add('photographer__portrait')

    const name = document.createElement('h2')
    name.textContent = phoName
    name.classList.add('photographer__name')
    name.ariaLabel = 'Nom du photographe'

    const articleHeader = document.createElement('a')
    articleHeader.href = `./photographer.html?id=${id}`
    articleHeader.classList.add('photographer-card__header')
    articleHeader.appendChild(img)
    articleHeader.appendChild(name)
    articleHeader.tabIndex = '-1'

    const location = document.createElement('span')
    location.textContent = `${city}, ${country}`
    location.classList.add('photographer__location')
    location.setAttribute('role', 'text')
    location.ariaLabel = 'Localisation du photographe'

    const tagline = document.createElement('span')
    tagline.textContent = tag
    tagline.setAttribute('role', 'text')
    tagline.ariaLabel = 'Slogan du photographe'

    const price = document.createElement('span')
    price.textContent = `${rate}€/jour`
    price.classList.add('photographer__price')
    price.setAttribute('role', 'text')
    price.ariaLabel = 'Tarif journalier'

    article.appendChild(articleHeader)
    article.appendChild(location)
    article.appendChild(tagline)
    article.appendChild(price)

    addReactionTo('keydown')
      .on(article)
      .withFunction(e => {
        if (e.key === 'Enter') {
          articleHeader.click()
        }
      })

    return article
  }
  return {getUserCardDOM, getUserPageDOM}
}

export default photographerFactory
