import DOM from '../utils/domElements.js'
import photographerFactory from '../factories/photographerFactory.js'
import mediaFactory from '../factories/mediaFactory.js'
import {form} from '../modals/form.js'
import {store} from '../API/likesAPI.js'
import getFetchedDatas from '../API/fetchAPI.js'
import setSkeletons from '../components/skeletons.js'
import {keyboardNavigation, mutationObserver, observer} from '../utils/utils.js'
import {sortBy} from '../components/selector.js'
import {addReactionTo} from '../utils/eventListener.js'

/**
 * Récupération de l'id du photographe
 */
const id = +new URLSearchParams(document.location.search).get('id')

document.querySelector('[aria-label="Lien page d\'accueil"]').focus()

/**
 * AFFICHAGE DE LA PAGE PHOTOGRAPHE
 */
const displayMedias = photographer => sortedPhotographerMedias => {
  document.title = `Fisheye - photographe ${photographer.name}`

  keyboardNavigation()

  /**
   * On réinitialise la grille d'images
   */
  DOM.mediasSection.replaceChildren()

  const mediasNbr = sortedPhotographerMedias.length

  /**
   * Affichage des skeletons
   */
  setSkeletons(mediasNbr)('to print')

  /**
   * Récupération du photographe choisi et affichage du header associé
   */
  photographerFactory(photographer).getUserPageDOM()

  /**
   * Récupération des cartes images du photographe
   */
  sortedPhotographerMedias.forEach(media => {
    if (media.photographerId !== id) return

    const article = mediaFactory(media)(photographer)(
      sortedPhotographerMedias,
    ).getMediaCardDOM()

    // /**
    //  * Masquage des skeletons
    //  */
    setSkeletons(mediasNbr)('to hide')

    /**
     * Affichage des cartes images du photographe
     */
    DOM.mediasSection.appendChild(article)

    /**
     * On implémente un intersectionObserver pour ne rendre les cartes que lorsqu'elles sont dans le champ d'affichage
     */
    observer.observe(article)
  })
}

/**
 * Actualisation éventuelle de l'affichage du nbr de likes à la fermeture de la lightbox
 */
mutationObserver.observe(DOM.mediasSection, {
  attributeFilter: ['class'],
})

/**
 * Récupération d'un photographe et des médias associés par critère de tri
 */
export const getMediasSorting = photographers => medias => {
  /**
   * Définition du photographe d'après son id
   */
  const photographer = photographers.find(
    photographer => photographer.id === id,
  )

  /**
   * Filtrage des données selon le photographe
   */
  const photographerMedias = medias.filter(
    media => media.photographerId === photographer.id,
  )

  return {photographer, photographerMedias}
}

/**
 * Récupération de l'ensemble des data
 */
const {photographers, medias} = await getFetchedDatas({
  url: './data/photographers.json',
  storageName: 'original datas',
})

/**
 * Récupération d'un photographe spécifique et des médias associés par critère de tri
 */
const {photographer: forThisPhotographer, photographerMedias} =
  getMediasSorting(photographers)(medias)

/**
 * Stockage de toutes les images du photographe( id, nbr de likes, isLiked) dans le local storage
 */
let likedMedias = []

photographerMedias.forEach(media => {
  likedMedias = [
    ...likedMedias,
    {id: media.id, likes: media.likes, isLiked: false},
  ]
  store.setLikedImages(likedMedias)
})

/**
 * Récupération des données photographes/médias, par popularité par défaut
 */
export const sort = (sortingChoice = 'Popularité') => {
  /**
   * Tri de l'ordre d'affichage des images selon choix utilisateur
   */
  const sortedPhotographerMedias = sortBy(photographerMedias)(sortingChoice)

  /**
   * Affichage des médias
   */
  displayMedias(forThisPhotographer)(sortedPhotographerMedias)

  /**
   * Maintien de l'affichage des likes au changement d'ordre de tri
   */
  mutationObserver.observe(
    [...DOM.mediasSection.getElementsByClassName('media-card')][0],
    {
      attributeFilter: ['class'],
    },
  )

  /**
   * On récupère les éléments qui acquerront le focus
   */
  const focusableElements =
    '[aria-label="Lien page d\'accueil"], button.contact-button, summary, .media-card__image'

  /**
   * On crée un tableau des éléments focusables
   */
  let focusables = [...document.querySelectorAll(focusableElements)]

  /**
   * Changement de focus au clavier et maintien du focus dans la fenêtre
   */
  const focusInWindow = e => {
    e.preventDefault()

    let index = focusables.findIndex(
      elem => elem === document.querySelector(':focus'),
    )

    e.shiftKey === true ? index-- : index++

    if (index >= focusables.length) {
      index = 0
    }
    if (index < 0) {
      index = focusables.length - 1
    }

    focusables[index].focus()

    /**
     * Suppression du nouvel event listener sur le selecteur après chaque choix selectionné, pour éviter leur multiplication
     */
    ;[...document.querySelectorAll('details > *')].forEach(
      el => (el.onclick = () => controller.abort()),
    )
  }

  /**
   * Navigation au clavier
   */
  const tabulate = e => {
    if (
      e.key === 'Tab' &&
      !DOM.modal.hasAttribute('aria-modal') &&
      !DOM.selector.hasAttribute('open') &&
      !DOM.lightbox.hasAttribute('aria-modal')
    ) {
      focusInWindow(e)
    }
  }

  const controller = new AbortController()

  // Création d'un nouvel event listener sur le selecteur
  addReactionTo('keydown')
    .on(window)
    .withFunction(tabulate, {signal: controller.signal})

  /**
   * Bouton d'affichage du formulaire de contact
   */
  DOM.contactBtn.onclick = () => form.show(forThisPhotographer)
}

/**
 * Tri initial par popularité
 */
sort()
