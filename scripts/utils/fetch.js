export default async function getPhotographers() {
  const spinner = document.getElementById('spinner')
  spinner.removeAttribute('hidden')

  const response = await fetch('../../data/photographers.json')
  const data = await response.json()

  spinner.setAttribute('hidden', '')

  localStorage.setItem('photographers', JSON.stringify(data.photographers))
  localStorage.setItem('medias', JSON.stringify(data.medias))

  return data
}
