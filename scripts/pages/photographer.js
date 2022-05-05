import * as DOM from '../utils/domElements.js'
import { photographerFactory } from '../factories/photographerFactory.js'
import { mediaFactory } from '../factories/mediaFactory.js'
import { formDisplay, focusInModal } from '../modals/form.js'
import { lightboxDisplay } from '../modals/lightbox.js'
import { storeLikes } from '../API/likesAPI.js'
import getFetchedDatas from '../API/fetchAPI.js'
import getSkeletons from '../utils/skeletons.js'

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
export async function displayMedias(photographer, sortedPhotographerMedias) {
  /**
   * On réinitialise la grille d'images
   */
  while (DOM.mediasSection.firstChild) {
    DOM.mediasSection.removeChild(DOM.mediasSection.lastChild)
  }

  /**
   * Affichage des données du photographe
   */
  const photographerModel = photographerFactory(photographer)
  photographerModel.getUserPageDOM()
  getSkeletons('print')

  /**
   * Récupération des cartes images du photographe
   */

  sortedPhotographerMedias.forEach(media => {
    if (media.photographerId !== id) return

    const mediaModel = mediaFactory(
      media,
      photographer,
      sortedPhotographerMedias
    )

    const article = mediaModel.getMediaCardDOM()

    /**
     * Affichage des cartes images du photographe
     */
    getSkeletons('hide')
    DOM.mediasSection.appendChild(article)
    setTimeout(() => {
      article.classList.add('fadein')
    }, 1200)
  })
}

/**
 * Déclaration d'un tableau des selections non choisies
 */
let notSelectedsOptionsArray = []

/**
 * Récupération d'un photographe et des médias associés par critère de tri
 */
const getMediasSorting = (photographers, medias, sortingChoice) => {
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
  let sortedPhotographerMedias
  if (sortingChoice === 'Titre') {
    sortedPhotographerMedias = photographerMedias.sort((a, b) =>
      a.title.localeCompare(b.title)
    )
  }
  if (sortingChoice === 'Popularité') {
    sortedPhotographerMedias = photographerMedias.sort(
      (a, b) => a.likes - b.likes
    )
  }
  if (sortingChoice === 'Date') {
    sortedPhotographerMedias = photographerMedias.sort(
      (a, b) => a.date - b.date
    )
  }

  /**
   * On retire le border-radius de la dernière selection avant de positionner une nouvelle selection en dernière position
   */
  if (notSelectedsOptionsArray.length !== 0) {
    notSelectedsOptionsArray[
      notSelectedsOptionsArray.length - 1
    ].classList.remove('custom-option_last')
  }

  /**
   * Mise en tableau des selections non choisies
   */
  notSelectedsOptionsArray = [
    ...document.querySelectorAll('.custom-option '),
  ].filter(el => !el.classList.contains('selected'))

  /**
   * Border-radius placé dynamiquement en bas de la dernière selection non choisie
   */
  notSelectedsOptionsArray[notSelectedsOptionsArray.length - 1].classList.add(
    'custom-option_last'
  )

  return { photographer, sortedPhotographerMedias }
}

/**
 * Récupération des données photographes/médias, par popularité par défaut
 */
const getDatas = async (sortingChoice = 'Popularité') => {
  /**
   * Récupération de l'ensemble des data
   */
  const { photographers, medias } = await getFetchedDatas()

  /**
   * Récupération d'un photographe spécifique et des médias associés par critère de tri
   */
  const { photographer, sortedPhotographerMedias } = getMediasSorting(
    photographers,
    medias,
    sortingChoice
  )

  {
    //TODO {}?
    /**
     * Stockage de toutes les images du photographe dans le local storage
     */
    let likedMedias = []

    sortedPhotographerMedias.forEach(media => {
      likedMedias = [
        ...likedMedias,
        { id: media.id, likes: media.likes, isLikedByMe: false },
      ]
      storeLikes(likedMedias)
    })
  }

  /**
   * Affichage des médias
   */
  displayMedias(photographer, sortedPhotographerMedias)
}

getDatas()

/**
 * Bouton d'affichage du formulaire de contact
 */
DOM.contactBtn.addEventListener('click', () => formDisplay('show'))

/**
 * Navigation au clavier dans le formulaire de contact
 */
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    formDisplay('hide')
    lightboxDisplay('hide')
  }
  if (e.key === 'Tab' && DOM.modal.hasAttribute('aria-modal')) {
    focusInModal(e)
  }
})

/*------------------------- SELECTEUR ------------------------ */

/**
 * On ouvre le selecteur
 */
document
  .querySelector('.select-wrapper')
  .addEventListener('click', function () {
    this.querySelector('.select').classList.toggle('open')
    document.querySelector('.selected').focus()
  })

/**
 * On ouvre le selecteur avec le clavier
 */
document
  .querySelector('.select-wrapper')
  .addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      this.querySelector('.select').classList.toggle('open')
      document.querySelector('.select__trigger').focus()
    }
  })

/**
 * Affichage de l'option selectionnée
 */
const selectDisplay = option => {
  for (const hidden of document.querySelectorAll('.custom-option.hidden')) {
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

for (const option of document.querySelectorAll('.custom-option')) {
  option.addEventListener('click', () => {
    selectDisplay(option)
  })
}

/**
 * On ferme le selecteur lorsque l'utilisateur clique quelque part dans la fenêtre
 */
window.addEventListener('click', e => {
  const select = document.querySelector('.select')
  if (!select.contains(e.target)) {
    select.classList.remove('open')
  }
})

/**
 * Récupération des données selon la catégorie sélectionnée
 */
for (const selected of document.querySelectorAll('.custom-option')) {
  selected.addEventListener('click', () => {
    const sortingChoice = selected.textContent
    getDatas(sortingChoice)
  })
  selected.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const sortingChoice = selected.textContent
      getDatas(sortingChoice)
    }
  })
}

/**
 * On récupère les éléments qui acquerront le focus dans le selecteur
 */
const focusableElements = '.select__trigger, .custom-option:not(.selected)'
let focusables = []

/**
 * GESTION DU FOCUS
 * Changement de focus au clavier et maintien du focus dans le selecteur
 */
const focusInSelector = e => {
  e.preventDefault()

  /**
   * On crée un tableau des éléments focusables
   */
  focusables = [...DOM.selector.querySelectorAll(focusableElements)]

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

  DOM.selector.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !!document.querySelector('.select.open')) {
      selectDisplay(option)
    }
  })
}

// /**
//  * Navigation au clavier dans le selecteur
//  */
DOM.selector.addEventListener('keydown', e => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    document.querySelector('.select.open').classList.remove('open')
  }
  if (e.key === 'Tab' && !!document.querySelector('.select.open')) {
    focusInSelector(e)
  }
})
