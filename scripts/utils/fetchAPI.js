export default async function getPhotographers() {
  const spinner = document.getElementById('spinner')
  spinner.removeAttribute('hidden')

  try {
    const response = await fetch('../../data/photographers.json')
    if (!response.ok) {
      spinner.hidden = true
      console.error(`Une erreur est survenue: ${response.status}`)
    }
    const data = await response.json()

    localStorage.setItem('original datas', JSON.stringify(data))
    spinner.hidden = true

    return data
  } catch (err) {
    spinner.hidden = true
    console.error("La connexion n'a pu être établie", err)
  }
}
