import getSkeletons from '../utils/skeletons.js'

const getFetchedDatas = async () => {
  getSkeletons('print')
  const { photographers, medias } =
  JSON.parse(localStorage.getItem('original datas')) ?? (await fetchDatas())
  
  getSkeletons('hide')

  return { photographers, medias }
}

const fetchDatas = async () => {
  try {
    const response = await fetch('/data/photographers.json')
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
