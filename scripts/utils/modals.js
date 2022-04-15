const lightboxContainer = document.querySelector('.lightbox__container')

/* Création des balises img et video dans la balise figure */
const imageDisplay = document.createElement('img')
const videoDisplay = document.createElement('video')

/**
 * FERMETURE DE LA MODALE
 */
const hideModal = modal => {
  console.log(imageDisplay, videoDisplay)
  if (modal === lightbox) {
    imageDisplay.classList.add('hidden')
    videoDisplay.classList.add('hidden')
  }
  document.querySelector('.lightbox__text').textContent = ''
  document
    .querySelector(modal === modal ? '.modal__close' : '.lightbox__close')
    .removeEventListener('click', () => formDisplay('hide'))
  modal.ariaHidden = true
  modal.removeAttribute('aria-modal')
  modal.classList.add('hidden')
}

// -------------------------------------------------------------------- //

/**
 * MODALE FORMULAIRE
 */
const formDisplay = (action, previouslyFocusedElement) => {
  if (action === 'show') {
    console.log(modal)
    previouslyFocusedElement = document.querySelector(':focus')
    document.getElementById('firstname').focus()
    modal.classList.remove('hidden')
    modal.removeAttribute('aria-hidden')
    modal.ariaModal = true
    focusables = [...modal.querySelectorAll(focusableElements)]
    document
      .querySelector('.modal__close')
      .addEventListener('click', () => hideModal(modal))
    document
      .querySelector('[name="form"]')
      .addEventListener('submit', e => formSubmit(e, previouslyFocusedElement))
  }
  if (action === 'hide') {
    modal.addEventListener('animationend', hideModal(modal))
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
  }
}

// -------------------------------------------------------------------- //

/**
 * SOUMISSION DU FORMULAIRE
 */
const formSubmit = (e, previouslyFocusedElement) => {
  e.preventDefault()
  console.log(e.currentTarget.firstname.value)
  console.log(e.currentTarget.lastname.value)
  console.log(e.currentTarget.email.value)
  console.log(e.currentTarget.message.value)
  document
    .querySelector('[name="form"]')
    .removeEventListener('submit', formSubmit)
  formDisplay('hide', previouslyFocusedElement)
}

const focusableElements = 'input, textArea, button'
let focusables = []

// -------------------------------------------------------------------- //

/**
 * GESTION DU FOCUS
 * Changement de focus au clavier et maintien dans la modale
 */
const focusInModal = e => {
  e.preventDefault()
  let index = focusables.findIndex(
    elem => elem === modal.querySelector(':focus')
  )
  e.shiftKey === true ? index-- : index++
  if (index >= focusables.length) {
    index = 0
  }
  if (index < 0) {
    index = focusables.length - 1
  }
  focusables[index].focus()
}

// -------------------------------------------------------------------- //

/**
 * MODALE LIGHTBOX
 */
const lightboxDisplay = (action, photographer, photographerMedias, imageId) => {
  /* Récupération du média à afficher dans la lightbox */
  const [media] = photographerMedias.filter(media => media.id === imageId)

  /* Récupération de l'index du média dans le tableau des médias du photographe */
  const imagePositionInMediasArray = photographerMedias.indexOf(media)

  videoDisplay.controls = true
  videoDisplay.setAttribute('type', 'video/mp4') //FIXME videoDisplay.type ne fonctionne pas

  lightboxContainer.insertBefore(videoDisplay, lightboxContainer.firstChild)
  lightboxContainer.insertBefore(imageDisplay, lightboxContainer.firstChild)

  /* Affichage du titre du média dans la balise figcaption */
  document.querySelector('.lightbox__text').textContent =
    photographerMedias[imagePositionInMediasArray].title

  /* AFFICHAGE DU MEDIA */
  if (action === 'show') {
    /* Si le média est une image */
    if (media.image) {
      /* On passe la balise video en display: none */
      videoDisplay.classList.add('hidden')
      imageDisplay.classList.remove('hidden')
      /* On définit la source de l'image */
      imageDisplay.src = `../../assets/images/${
        photographer.name.split(' ')[0]
      }/${photographerMedias[imagePositionInMediasArray].image}`
    }
    /* Si le média est une vidéo */
    if (media.video) {
      /* On passe la balise image en display: none */
      imageDisplay.classList.add('hidden')
      videoDisplay.classList.remove('hidden')
      /* On définit la source de la vidéo */
      videoDisplay.src = `../../assets/images/${
        photographer.name.split(' ')[0]
      }/${photographerMedias[imagePositionInMediasArray].video}`
    }

    /* On affiche la lightbox */
    const lightbox = document.getElementById('lightbox')
    lightbox.classList.remove('hidden')
    lightbox.removeAttribute('aria-hidden')
    lightbox.ariaModal = true
    document
      .querySelector('.lightbox__close')
      .addEventListener('click', () => hideModal(lightbox))
  }

  /* On ferme la lightbox */
  if (action === 'hide') {
    modal.addEventListener('animationend', hideModal())
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
  }

  /* Définition de l'index qui va nous permettre de changer d'image avec les flêches droite et gauche */
  let i = imagePositionInMediasArray

  /**
   * BOUTON NEXT
   */
  document.querySelector('.lightbox__next').addEventListener('click', () => {
    i += 1
    if (i === photographerMedias.length) i = 0

    if (photographerMedias[i].image) {
      imageDisplay.classList.remove('hidden')
      videoDisplay.classList.add('hidden')
      imageDisplay.src = `../../assets/images/${
        photographer.name.split(' ')[0]
      }/${photographerMedias[i].image}`
    }
    if (photographerMedias[i].video) {
      imageDisplay.classList.add('hidden')
      videoDisplay.classList.remove('hidden')
      videoDisplay.src = `../../assets/images/${
        photographer.name.split(' ')[0]
      }/${photographerMedias[i].video}`
    }
    document.querySelector('.lightbox__text').textContent =
      photographerMedias[i].title
  })

  /**
   * BOUTON PREVIOUS
   */
  document
    .querySelector('.lightbox__previous')
    .addEventListener('click', () => {
      i -= 1
      if (i === -1) i = photographerMedias.length - 1

      if (photographerMedias[i].image) {
        imageDisplay.classList.remove('hidden')
        videoDisplay.classList.add('hidden')
        photographerMedias[i].image &&
          (imageDisplay.src = `../../assets/images/${
            photographer.name.split(' ')[0]
          }/${photographerMedias[i].image}`)
      }
      if (photographerMedias[i].video) {
        imageDisplay.classList.add('hidden')
        videoDisplay.classList.remove('hidden')
        photographerMedias[i].video &&
          (videoDisplay.src = `../../assets/images/${
            photographer.name.split(' ')[0]
          }/${photographerMedias[i].video}`)
      }
      document.querySelector('.lightbox__text').textContent =
        photographerMedias[i].title
    })
}

// -------------------------------------------------------------------- //

export { formDisplay, focusInModal, lightboxDisplay }
