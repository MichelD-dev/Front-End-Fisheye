import getFetchedDatas from '../API/fetchAPI.js'

/**
 * Initialisation
 */
async function init(url, storageName, doSomethingWithData, thisParticularData) {
  /* Récupération des données */
  let whenDataIsLoaded = getFetchedDatas(url, storageName)

  /* Utilisation des données */
  const useData = fn => data => fn(data)
  await whenDataIsLoaded.then(loadedData =>
    useData(doSomethingWithData)(loadedData[thisParticularData])
  )
}

export default init
