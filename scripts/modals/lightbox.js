const lightboxContainer = document.querySelector('.lightbox__container')

/* Création des balises img et video dans la balise figure */
const imageDisplay = document.createElement('img')
const videoDisplay = document.createElement('video')
videoDisplay.style.position = 'relative' 
videoDisplay.style.zIndex = '2' 

const closeLightboxModal = () => lightboxDisplay('hide')

/**
 * MODALE LIGHTBOX
 */
 export const lightboxDisplay = (
    action,
    photographer,
    sortedPhotographerMedias = [],
    imageId,
    previouslyFocusedElement
  ) => {
    /* AFFICHAGE DU MEDIA */
    previouslyFocusedElement = document.querySelector(':focus')
  
    /* Récupération du média à afficher dans la lightbox */
    let imagePositionInMediasArray = []
    // if (photographerMedias.length === 0) return
    const [media] = sortedPhotographerMedias.filter(media => media.id === imageId)
    /* Récupération de l'index du média dans le tableau des médias du photographe */
    imagePositionInMediasArray = sortedPhotographerMedias.indexOf(media)
  
    if (action === 'show') {
      videoDisplay.controls = true //TODO Gestion des controls au clavier?
      videoDisplay.setAttribute('type', 'video/mp4')
  
      lightboxContainer.insertBefore(videoDisplay, lightboxContainer.firstChild)
      lightboxContainer.insertBefore(imageDisplay, lightboxContainer.firstChild)
  
      /* Affichage du titre du média dans la balise figcaption */
      document.querySelector('.lightbox__text').textContent =
        sortedPhotographerMedias[imagePositionInMediasArray].title
  
      /* Si le média est une image */
      if (media.image) {
        /* On passe la balise video en display: none */
        videoDisplay.classList.add('hidden')
        imageDisplay.classList.remove('hidden')
        /* On définit la source de l'image */
        imageDisplay.src = `../../assets/images/${
          photographer.name.split(' ')[0]
        }/${sortedPhotographerMedias[imagePositionInMediasArray].image}`
      }
      /* Si le média est une vidéo */
      if (media.video) {
        /* On passe la balise image en display: none */
        imageDisplay.classList.add('hidden')
        videoDisplay.classList.remove('hidden')
        /* On définit la source de la vidéo */
        videoDisplay.src = `../../assets/images/${
          photographer.name.split(' ')[0]
        }/${sortedPhotographerMedias[imagePositionInMediasArray].video}`
      }
  
      /* On affiche la lightbox */
      const lightbox = document.getElementById('lightbox')
      lightbox.classList.remove('hidden')
      lightbox.removeAttribute('aria-hidden')
      lightbox.ariaModal = true
      document
        .querySelector('.lightbox__close')
        .addEventListener('click', closeLightboxModal)
    }
  
    /* Définition de l'index qui va nous permettre de changer d'image avec les flêches droite et gauche */
    let i = imagePositionInMediasArray
    /**
     * BOUTON NEXT
     */
    const displayNextMedia = () => {
      if (document.getElementById('lightbox').hasAttribute('aria-hidden')) {
        return
      }

      i += 1
  
      if (i === sortedPhotographerMedias.length) i = 0

      if (sortedPhotographerMedias[i].image) {
        imageDisplay.classList.remove('hidden')
        videoDisplay.classList.add('hidden')
        imageDisplay.src = `../../assets/images/${
          photographer.name.split(' ')[0]
        }/${sortedPhotographerMedias[i].image}`
      }
      if (sortedPhotographerMedias[i].video) {
        imageDisplay.classList.add('hidden')
        videoDisplay.classList.remove('hidden')
        videoDisplay.src = `../../assets/images/${
          photographer.name.split(' ')[0]
        }/${sortedPhotographerMedias[i].video}`
      }
      document.querySelector('.lightbox__text').textContent =
        sortedPhotographerMedias[i].title
    }
    document
      .querySelector('.lightbox__next')
      .addEventListener('click', displayNextMedia)
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        displayNextMedia()
      }
    })
  
    /**
     * BOUTON PREVIOUS
     */
    const displayPreviousMedia = () => {
        if (document.getElementById('lightbox').hasAttribute('aria-hidden')) {
        return
      }
      i -= 1
      if (i === -1) i = sortedPhotographerMedias.length - 1
  
      if (sortedPhotographerMedias[i].image) {
        imageDisplay.classList.remove('hidden')
        videoDisplay.classList.add('hidden')
        sortedPhotographerMedias[i].image &&
          (imageDisplay.src = `../../assets/images/${
            photographer.name.split(' ')[0]
          }/${sortedPhotographerMedias[i].image}`)
      }
      if (sortedPhotographerMedias[i].video) {
        imageDisplay.classList.add('hidden')
        videoDisplay.classList.remove('hidden')
        sortedPhotographerMedias[i].video &&
          (videoDisplay.src = `../../assets/images/${
            photographer.name.split(' ')[0]
          }/${sortedPhotographerMedias[i].video}`)
      }
      document.querySelector('.lightbox__text').textContent =
        sortedPhotographerMedias[i].title
    }
  
    document
      .querySelector('.lightbox__previous')
      .addEventListener('click', displayPreviousMedia)
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        displayPreviousMedia()
      }
    })
  
    /* On ferme la lightbox */
    if (action === 'hide') {
      const modal = document.querySelector('#lightbox')
      if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
  
    document
    .querySelector('.lightbox__close')
    .removeEventListener('click', closeLightboxModal)
    modal.ariaHidden = true
    modal.removeAttribute('aria-modal')
    //   modal.classList.add('hidden')
    document
    .querySelector('.lightbox__next')
    .removeEventListener('click', displayNextMedia)
    document
    .querySelector('.lightbox__previous')
    .removeEventListener('click', displayPreviousMedia)
     }
  }