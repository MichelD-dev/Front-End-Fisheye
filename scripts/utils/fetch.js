export default async function getPhotographers() {
  const response = await fetch('../../data/photographers.json')
  const data = await response.json()
  localStorage.setItem('photographers', JSON.stringify(data.photographers))
  localStorage.setItem('medias', JSON.stringify(data.medias))
  return data
}
