import getFetchedDatas from '../API/fetchAPI.js'

/**
 * Initialisation
 */
async function init({url, storageName, doSomethingWith, thisParticularData}) {
  /* Récupération des données */
  await getFetchedDatas({url, storageName})
    /* Utilisation des données */
    .then(loadedDatas => doSomethingWith(loadedDatas[thisParticularData]))
}

export default init
