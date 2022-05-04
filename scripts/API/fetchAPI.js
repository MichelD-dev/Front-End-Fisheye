import * as DOM from '../utils/domElements.js'

const getFetchedDatas = async () => {
  DOM.spinner.removeAttribute('hidden')

  const { photographers, medias } =
    JSON.parse(localStorage.getItem('original datas')) ?? (await fetchDatas())

  DOM.spinner.hidden = true

  return { photographers, medias }
}

const fetchDatas = async () => {
  try {
    const response = await fetch('../../data/photographers.json')
    if (!response.ok) {
      console.error(`Une erreur est survenue: ${response.status}`)
    }
    const data = await response.json()

    localStorage.setItem('original datas', JSON.stringify(data))

    return data
  } catch (err) {
    console.error("La connexion n'a pu être établie", err)
  }
}

export default getFetchedDatas
