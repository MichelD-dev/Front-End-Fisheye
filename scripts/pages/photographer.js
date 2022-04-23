import { photographerFactory } from '../factories/photographerFactory.js'
import { mediaFactory } from '../factories/mediaFactory.js'
import getPhotographers from '../utils/fetch.js'
import { formDisplay, focusInModal } from '../modals/form.js'
import { lightboxDisplay } from '../modals/lightbox.js'

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
async function displayMedias(photographer, sortedPhotographerMedias) {
  const mediasSection = document.querySelector('.medias__section')

  /**
   * On réinitialise la grille d'images
   */
  while (mediasSection.firstChild) {
    mediasSection.removeChild(mediasSection.lastChild)
  }

  /**
   * Affichage des données du photographe
   */
  const photographerModel = photographerFactory(photographer)
  photographerModel.getUserPageDOM()

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
    mediasSection.appendChild(article) //TODO? mettre une ul dans la grid et les articles dans des li?
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
  // console.log(notSelectedsOptionsArray)

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
  const { photographers, medias } =
    JSON.parse(localStorage.getItem('data')) || (await getPhotographers())

  /**
   * Récupération d'un photographe et des médias associés par critère de tri
   */
  const { photographer, sortedPhotographerMedias } = getMediasSorting(
    photographers,
    medias,
    sortingChoice
  )

  /**
   * Affichage des médias
   */
  displayMedias(photographer, sortedPhotographerMedias)
}

getDatas()

/**
 * Bouton d'affichage du formulaire de contact
 */
document
  .querySelector('.contact-button')
  .addEventListener('click', () => formDisplay('show'))

/**
 * Navigation au clavier dans le formulaire de contact
 */
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    formDisplay('hide')
    lightboxDisplay('hide')
  }
  if (
    e.key === 'Tab' &&
    document.querySelector('.modal').hasAttribute('aria-modal')
  ) {
    focusInModal(e)
  }
})

/*----------------------------------------------------------------- */

/**
 * On ouvre le selecteur
 */
document
  .querySelector('.select-wrapper')
  .addEventListener('click', function () {
    this.querySelector('.select').classList.toggle('open')
  })

/**
 * On ouvre le selecteur avec le clavier
 */
document
  .querySelector('.select-wrapper')
  .addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      this.querySelector('.select').classList.toggle('open')
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
      .classList.remove('selected')
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
}

/**
 * On récupère le selecteur
 */
const selector = document.querySelector('.custom-options')

/**
 * On récupère les éléments qui acquerront le focus dans le selecteur
 */
// const focusableElements = 'span'

// /**
//  * GESTION DU FOCUS //FIXME
//  * Changement de focus au clavier et maintien du focus dans le selecteur
//  */
// const focusInSelector = (e, focusedSelection) => {
//   /**
//    * On crée un tableau des éléments focusables
//    */
//   let focusables = [...selector.querySelectorAll(focusableElements)]

//   e.preventDefault()
//   let index = focusables.findIndex(elem => elem === focusedSelection)

//   focusables[index].classList.remove('selected', 'hidden')
//   e.shiftKey === true ? index-- : index++
//   if (index >= focusables.length) {
//     index = 0
//   }
//   if (index < 0) {
//     index = focusables.length - 1
//   }
//   let option = focusables[index]
//   option.focus()
//   option.classList.add('selected', 'hidden')
//   console.log(option)
//   selectDisplay(option)
// }

// /**
//  * Navigation au clavier dans le selecteur
//  */
// let focusedSelection
// window.addEventListener('keydown', e => {
//   // if (e.key === 'Escape' || e.key === 'Esc') {
//   //   formDisplay('hide')
//   //   lightboxDisplay('hide')
//   // }
//   if (e.key === 'Tab' && document.querySelector('.select.open')) {
//     focusedSelection = document.querySelector('.selected')

//     focusInSelector(e, focusedSelection)
//   }
// })
