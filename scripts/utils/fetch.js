export default async function getPhotographers() {
  const spinner = document.getElementById('spinner')
  spinner.removeAttribute('hidden')

  try {
    const response = await fetch('../../data/photographers.json')
    if (!response.ok) {
      spinner.setAttribute('hidden', '')
      console.error(`Une erreur est survenue: ${response.status}`)
    }
    const data = await response.json()

    localStorage.setItem('data', JSON.stringify(data))
    spinner.setAttribute('hidden', '')

    return data
  } catch (err) {
    spinner.setAttribute('hidden', '')
    console.error("La connexion n'a pu être établie")
  }
}
