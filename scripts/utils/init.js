import getFetchedDatas from '../API/fetchAPI.js'

/**
 * Initialisation
 */
async function init({
  fetchUrl,
  storageName,
  doSomethingWithData,
  thisParticularData,
}) {
  /* Récupération des données */
  let whenDataIsLoaded = getFetchedDatas(fetchUrl, storageName)

  /* Utilisation des données */
  const useData = fn => data => fn(data)
  await whenDataIsLoaded.then(loadedData =>
    useData(doSomethingWithData)(loadedData[thisParticularData])
  )
}

export default init
