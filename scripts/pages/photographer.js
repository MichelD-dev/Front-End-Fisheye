import DOM from '../utils/domElements.js'
import { photographerFactory } from '../factories/photographerFactory.js'
import { mediaFactory } from '../factories/mediaFactory.js'
import { form } from '../modals/form.js'
import { store } from '../API/likesAPI.js'
import getFetchedDatas from '../API/fetchAPI.js'
import setSkeletons from '../utils/skeletons.js'
import { addReactionTo } from '../utils/eventListener.js'
import { keyboardNavigation } from '../utils/utils.js'

/**
 * Récupération de l'id du photographe
 */
let id = +new URLSearchParams(document.location.search).get('id')

/**
 * Initialisation de la variable objet possédant le focus
 */
// let previouslyFocusedElement = null

/**
 * AFFICHAGE DE LA PAGE PHOTOGRAPHE
 */
export function displayMedias(photographer, sortedPhotographerMedias) {
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
   * Récupération des cartes images du photographe
   */
  const photographerModel = photographerFactory(photographer)
  photographerModel.getUserPageDOM()

  sortedPhotographerMedias.forEach(media => {
    if (media.photographerId !== id) return

    const mediaModel = mediaFactory(
      media,
      photographer,
      sortedPhotographerMedias
    )

    const article = mediaModel.getMediaCardDOM()

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
export const getMediasSorting = (photographers, medias, sortingChoice) => {
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

    return choices[sortingChoice]()
  }

  const sortedPhotographerMedias = sortBy(sortingChoice)

  return { photographer, sortedPhotographerMedias }
}

/**
 * Récupération des données photographes/médias, par popularité par défaut
 */
const getDatas = async (sortingChoice = 'Popularité') => {
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
  const { photographer, sortedPhotographerMedias } = getMediasSorting(
    photographers,
    medias,
    sortingChoice
  )

  {
 
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
  }

  /**
   * Affichage des médias
   */
  displayMedias(photographer, sortedPhotographerMedias)
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
 * Déclaration d'un tableau des selections non choisies
 */
let notSelectedsOptionsArray = []

const select = () => {
  if (!document.querySelector('.select').classList.contains('open')) {
    document.querySelector('.select').classList.add('open')

    /**
     * Mise en tableau des selections non choisies
     */
    notSelectedsOptionsArray = [
      ...document.getElementsByClassName('custom-option '),
    ].filter(el => !el.classList.contains('selected'))

    /**
     * Border-radius placé dynamiquement en bas de la dernière selection non choisie
     */
    notSelectedsOptionsArray[notSelectedsOptionsArray.length - 1].classList.add(
      'custom-option_last'
    )

    document.querySelector('.selected').focus()
  } else {
    document.querySelector('.select').classList.remove('open')

    /**
     * On retire le border-radius de la dernière selection avant de positionner une nouvelle selection en dernière position
     */
    if (notSelectedsOptionsArray.length !== 0) {
      notSelectedsOptionsArray[
        notSelectedsOptionsArray.length - 1
      ].classList.remove('custom-option_last')
    }
  }
}

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

/**
 * Affichage de l'option selectionnée
 */
const selectDisplaySorting = option => {
  for (const hidden of document.querySelectorAll(
    '.custom-option.hidden, .select__trigger'
  )) {
    hidden.classList.remove('hidden')
  }
  if (!option.classList.contains('selected')) {
    option.parentNode
      .querySelector('.custom-option.selected')
      ?.classList.remove('selected')
    option.classList.add('selected')
    option.classList.add('hidden')
    option
      .closest('.select')
      .querySelector('.select__trigger span').textContent = option.textContent
  }
}

for (const option of document.getElementsByClassName('custom-option')) {
  addReactionTo('click')
    .on(option)
    .withFunction(
      () => {
        selectDisplaySorting(option)
      },
      { once: true }
    )
}

/**
 * On ferme le selecteur lorsque l'utilisateur clique quelque part dans la fenêtre
 */
addReactionTo('click')
  .on(window)
  .withFunction(e => {
    const select = document.querySelector('.select')
    if (!select.contains(e.target)) {
      select.classList.remove('open')
    }
  })

/**
 * Récupération des données selon la catégorie sélectionnée
 */
for (const selected of document.querySelectorAll('.custom-option')) {
  addReactionTo('click')
    .on(selected)
    .withFunction(() => {
      const sortingChoice = selected.textContent
      getDatas(sortingChoice)
    })

  addReactionTo('keydown')
    .on(selected)
    .withFunction(e => {
      if (e.key === 'Enter') {
        const sortingChoice = selected.textContent
        getDatas(sortingChoice)
      }
    })
}

/**
 * GESTION DU FOCUS
 * Changement de focus au clavier et maintien du focus dans le selecteur
 */
const focusInSelector = e => {
  e.preventDefault()

  /**
   * On récupère les éléments qui acquerront le focus dans le selecteur
   */
  const focusableElements = '.select__trigger, .custom-option:not(.selected)'

  /**
   * On crée un tableau des éléments focusables
   */
  let focusables = [...DOM.selector.querySelectorAll(focusableElements)]

  let index = focusables.findIndex(
    elem => elem === DOM.selector.querySelector(':focus')
  )

  e.shiftKey === true ? index-- : index++

  if (index >= focusables.length) {
    index = 0
  }
  if (index < 0) {
    index = focusables.length - 1
  }

  let option = focusables[index]
  option.focus()

  focusables.forEach(elem => elem.classList.remove('no-white-line'))
  document.activeElement.classList.add('no-white-line')

  // /**
  //  * Navigation au clavier dans le selecteur
  //  */
  addReactionTo('keydown')
    .on(DOM.selector)
    .withFunction(e => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        document.querySelector('.select.open')?.classList.remove('open')
        focusables.forEach(elem => elem.classList.remove('no-white-line'))
        document.querySelector('.select__trigger').focus()
      }

      if (
        e.key === 'Enter' &&
        document.querySelector('.select.open') &&
        !document.activeElement.classList.contains('select__trigger')
      ) {
        selectDisplaySorting(option)
      }
    })
}

addReactionTo('keydown')
  .on(DOM.selector)
  .withFunction(e => {
    if (e.key === 'Tab' && !!document.querySelector('.select.open')) {
      focusInSelector(e)
    }
  })
