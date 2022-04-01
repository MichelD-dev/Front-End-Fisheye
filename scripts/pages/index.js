import { photographerFactory } from '../factories/photographerFactory.js'
import getPhotographers from '../utils/fetch.js'

async function displayData(photographers) {
  const photographersSection = document.querySelector('.photographers-section')

  photographers.forEach(photographer => {
    const photographerModel = photographerFactory(photographer)
    const userCardDOM = photographerModel.getUserCardDOM()
    photographersSection.appendChild(userCardDOM)
  })
}

async function init() {
  const spinner = document.getElementById('spinner')
  spinner.removeAttribute('hidden')

  let photographers = JSON.parse(localStorage.getItem('photographers'))

  if (!photographers) {
    const { photographers } = await getPhotographers()
    displayData(photographers)
  }

  spinner.setAttribute('hidden', '')
  displayData(photographers)
}

init()
