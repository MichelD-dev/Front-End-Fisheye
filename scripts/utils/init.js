import getFetchedDatas from '../API/fetchAPI.js'

/**
 * Initialisation
 */
async function init({ url, storageName, doSomethingWith, thisParticularData }) {
  /* Récupération des données */
  const whenDatasAreLoaded = getFetchedDatas({ url, storageName })

  /* Utilisation des données */
  await whenDatasAreLoaded.then(loadedDatas =>
    doSomethingWith(loadedDatas[thisParticularData])
  )
}

export default init
