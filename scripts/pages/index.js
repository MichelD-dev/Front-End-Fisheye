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

  const data =
    JSON.parse(localStorage.getItem('data')) ?? (await getPhotographers())
  const photographers = data ? data.photographers : null
  spinner.hidden = true
  if (!data) return console.error('NO DATA')
  displayData(photographers)
}

init()

