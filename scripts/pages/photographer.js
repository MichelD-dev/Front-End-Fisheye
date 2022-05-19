import DOM from '../utils/domElements.js'
import photographerFactory from '../factories/photographerFactory.js'
import mediaFactory from '../factories/mediaFactory.js'
import { form } from '../modals/form.js'
import { store } from '../API/likesAPI.js'
import getFetchedDatas from '../API/fetchAPI.js'
import setSkeletons from '../components/skeletons.js'
import { addReactionTo } from '../utils/eventListener.js'
import { keyboardNavigation } from '../utils/utils.js'
import { select } from '../components/selector.js'

/**
 * Récupération de l'id du photographe
 */
let id = +new URLSearchParams(document.location.search).get('id')

/**
 * AFFICHAGE DE LA PAGE PHOTOGRAPHE
 */
const displayMedias = photographer => sortedPhotographerMedias => {
  keyboardNavigation()

  /**
   * On réinitialise la grille d'images
   */
  while (DOM.mediasSection.firstChild) {
    DOM.mediasSection.removeChild(DOM.mediasSection.lastChild)
  }

  /**
   * Affichage des skeletons
   */
  setSkeletons(6)('to print')

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
      sortedPhotographerMedias
    ).getMediaCardDOM()

    // /**
    //  * Masquage des skeletons
    //  */
    setSkeletons(6)('to hide')

    /**
     * Affichage des cartes images du photographe
     */
    DOM.mediasSection.appendChild(article)
    setTimeout(() => {
      article.classList.add('fadein')
      article.setAttribute('aria-busy', false)
    }, 1200)
  })
}

/**
 * Actualisation éventuelle de l'affichage du nbr de likes à la fermeture de la lightbox
 */
const mutationObserver = new MutationObserver(() => {
  const mediaCards = [...DOM.mediasSection.getElementsByClassName('media-card')]

  store()
    .getLikedImages()
    .map(media => {
      mediaCards.find(likedMedia => {
        if (+likedMedia.id === media.id) {
          likedMedia.querySelector(
            '.media-card__likesNbr > span'
          ).textContent = `${media.likes} `

          media.isLikedByMe
            ? likedMedia.children[2].classList.remove('hidden')
            : likedMedia.children[2].classList.add('hidden')
        }
      })
    })
})

mutationObserver.observe(DOM.mediasSection, {
  attributeFilter: ['hidden'],
})

/**
 * Récupération d'un photographe et des médias associés par critère de tri
 */
export const getMediasSorting = photographers => medias => sortingChoice => {
  /**
   * Définition du photographe d'après son id
   */
  const photographer = photographers.find(
    photographer => photographer.id === id
  )

  /**
   * Filtrage des données selon le photographe
   */
  const photographerMedias = medias.filter(
    media => media.photographerId === photographer.id
  )

  /**
   * Tri de l'ordre d'affichage des images selon choix utilisateur
   */
  const sortBy = sortingChoice => {
    const choices = {
      Titre: () =>
        photographerMedias.sort((a, b) => a.title.localeCompare(b.title)),
      Popularité: () => photographerMedias.sort((a, b) => b.likes - a.likes),
      Date: () => photographerMedias.sort((a, b) => a.date - b.date),
    }

    return choices[sortingChoice]?.() ?? 'Critère de choix non reconnu'
  }

  const sortedPhotographerMedias = sortBy(sortingChoice)

  return { photographer, sortedPhotographerMedias }
}

/**
 * Récupération des données photographes/médias, par popularité par défaut
 */
export const getDatas = async (sortingChoice = 'Popularité') => {
  /**
   * Récupération de l'ensemble des data
   */
  const { photographers, medias } = await getFetchedDatas({
    url: 'https://micheld-dev.github.io/json-files/photographers.json',
    storageName: 'original datas',
  })

  /**
   * Récupération d'un photographe spécifique et des médias associés par critère de tri
   */
  const { photographer, sortedPhotographerMedias } =
    getMediasSorting(photographers)(medias)(sortingChoice)

  /**
   * Stockage de toutes les images du photographe dans le local storage
   */
  let likedMedias = []

  sortedPhotographerMedias.forEach(media => {
    likedMedias = [
      ...likedMedias,
      { id: media.id, likes: media.likes, isLikedByMe: false },
    ]
    store().setLikedImages(likedMedias)
  })

  /**
   * Affichage des médias
   */
  displayMedias(photographer)(sortedPhotographerMedias)
}

getDatas()

// --------------------------------------------------------------------------- //
// ---------------------------FORMULAIRE DE CONTACT--------------------------- //
// --------------------------------------------------------------------------- //

/**
 * Bouton d'affichage du formulaire de contact
 */
DOM.contactBtn.onclick = () => form().show()

/*------------------------------------------------------------ */
/*------------------------- SELECTEUR ------------------------ */
/*------------------------------------------------------------ */

/**
 * On ouvre le selecteur
 */
addReactionTo('click').on('.select-wrapper').withFunction(select)

/**
 * On ouvre le selecteur avec le clavier
 */
addReactionTo('keydown')
  .on('.select-wrapper')
  .withFunction(e => {
    if (e.key === 'Enter') {
      select()
      document.querySelector('.select__trigger').focus()
    }
  })
