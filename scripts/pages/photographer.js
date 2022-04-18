import { photographerFactory } from '../factories/photographerFactory.js'
import { mediaFactory } from '../factories/mediaFactory.js'
import getPhotographers from '../utils/fetch.js'
import { formDisplay, focusInModal, lightboxDisplay } from '../utils/modals.js'

let id = +new URLSearchParams(document.location.search).get('id')
let previouslyFocusedElement = null

async function displayData(photographer, sortedPhotographerMedias) {
  const mediasSection = document.querySelector('.medias__section')

  while (mediasSection.firstChild) {
    mediasSection.removeChild(mediasSection.lastChild)
  }

  const photographerModel = photographerFactory(photographer)
  photographerModel.getUserPageDOM()

  let likesList = []

  sortedPhotographerMedias.forEach(media => {
    if (media.photographerId !== id) return
    // const mediaModel = mediaFactory(media, previouslyFocusedElement)
    likesList.push(media)

    const mediaModel = mediaFactory(
      media,
      likesList,
      photographer,
      sortedPhotographerMedias
    )
    const article = mediaModel.getMediaCardDOM()

    /* Journalisation de la valeur de la variable `likes` dans la console. */
    mediasSection.appendChild(article) //TODO? mettre une ul dans la grid et les articles dans des li?
  })
}



// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //

var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //


const sortSelector = document.querySelector('.select-selected')
sortSelector.addEventListener('click', () => {
  const sortingChoice = sortSelector.innerHTML

  getDatas(sortingChoice)
})

const getMediasSorting = (photographers, medias, sortingChoice) => {

  const photographer = photographers.find(
    photographer => photographer.id === id
  )
  /* Filtrage des données selon le photographe */
  const photographerMedias = medias.filter(
    media => media.photographerId === photographer.id
  )

  let sortedPhotographerMedias
  if (sortingChoice === 'Titre') {
    sortedPhotographerMedias = photographerMedias.sort((a, b) =>
      a.title.localeCompare(b.title)
    )
 
  }
  if (sortingChoice === 'Popularité') {
    sortedPhotographerMedias = photographerMedias.sort(
      (a, b) => a.likes - b.likes
    )
  }
  if (sortingChoice === 'Date') {
    sortedPhotographerMedias = photographerMedias.sort(
      (a, b) => a.date - b.date
    )
  }
  return { photographer, sortedPhotographerMedias }
}

const getDatas = async (sortingChoice = 'Popularité') => {
  const { photographers, medias } =
    JSON.parse(localStorage.getItem('data')) || (await getPhotographers())

  const { photographer, sortedPhotographerMedias } = getMediasSorting(
    photographers,
    medias,
    sortingChoice
  )

  displayData(photographer, sortedPhotographerMedias)
}

// tri par titre

getDatas()

document
  .querySelector('.contact-button')
  .addEventListener('click', () =>
    formDisplay('show', previouslyFocusedElement)
  )

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    formDisplay('hide', previouslyFocusedElement)
    lightboxDisplay('hide', previouslyFocusedElement)
  }
  if (
    e.key === 'Tab' &&
    document.querySelector('.modal').hasAttribute('aria-modal')
  ) {
    focusInModal(e)
  }
})

