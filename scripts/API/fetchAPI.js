import getSkeletons from '../utils/skeletons.js'

const getFetchedDatas = async ({ url, storageName }) => {
  getSkeletons('print')
  const data =
    JSON.parse(localStorage.getItem(storageName)) ??
    (await fetchDatas(url, storageName))

  getSkeletons('hide')

  return data
}

const fetchDatas = async (url, storageName) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`Une erreur est survenue: ${response.status}`)
    }
    const data = await response.json()

    localStorage.setItem(storageName, JSON.stringify(data))

    return data
  } catch (err) {
    console.error("La connexion n'a pu être établie", err)
  }
}

export default getFetchedDatas
