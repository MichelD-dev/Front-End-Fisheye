//Mettre le code JavaScript lié à la page photographer.html
import {  photographerFactory } from '../factories/photographer.js'
import { mediasFactory } from '../factories/medias.js'
import { displayModal, closeModal } from '../utils/contactForm.js'

let params = new URL(document.location).searchParams
let id = parseInt(params.get('id'))

const photographers = JSON.parse(localStorage.getItem('photographers'))
//TODO utilisation du storage plutôt que fetchs multiples
const photographer = photographers.find(photographer => photographer.id === id)

const picture = `assets/photographers/${photographer.portrait}`

document.querySelector('.photographer__name').textContent = photographer.name
document.querySelector('.photographer__location').textContent = `${photographer.city}, ${photographer.country}`
document.querySelector('.photographer__tagline').textContent = photographer.tagline
document.querySelector('.photographer__portrait').setAttribute('src', picture)
document.querySelector('.photographer__portrait').setAttribute('alt', `${name} - Fiche individuelle`)

mediasFactory(photographer)