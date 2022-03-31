//Mettre le code JavaScript lié à la page photographer.html
let params = new URL(document.location).searchParams
let id = parseInt(params.get('id'))

const photographers = JSON.parse(localStorage.getItem('photographers'))
//TODO utilisation du storage plutôt que fetchs multiples
const photographer = photographers.find(photographer => photographer.id === id)

console.log(photographer)
