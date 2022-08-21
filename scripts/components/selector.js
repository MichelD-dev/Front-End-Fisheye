import { sort } from "../pages/photographer.js";
import DOM from "../utils/domElements.js";
import { addReactionTo } from "../utils/eventListener.js";

/**
 * Tri de l'ordre d'affichage des images selon choix utilisateur
 */
export const sortBy = (medias) => {
  return (sortingChoice) => {
    const choices = {
      Titre: () => medias.sort((a, b) => a.title.localeCompare(b.title)),
      Popularité: () => medias.sort((a, b) => b.likes - a.likes),
      Date: () => medias.sort((a, b) =>  new Date(b.date) - new Date(a.date)),
    };
    
    return choices[sortingChoice]?.() ?? "Critère de choix non reconnu";
  };
};

// --------------------------------------------------------------------------- //
// ------------------------------------UTILS---------------------------------- //
// --------------------------------------------------------------------------- //

/**
 * Changements d'apparence du selecteur sur events
 */
const selectorChange = () => {
  /**
   * Déclaration d'un tableau des selections non choisies
   */
  let notSelectedsOptionsArray = [];

  /**
   * Ouverture du selecteur
   */
  if (!document.querySelector(".select").classList.contains("open")) {
    document.querySelector(".select").classList.add("open");
    document
      .querySelector(".custom-options")
      .setAttribute("aria-expanded", true);

    /**
     * Mise en tableau des selections non choisies
     */
    notSelectedsOptionsArray = [
      ...document.getElementsByClassName("custom-option"),
    ].filter((el) => !el.classList.contains("selected"));

    /**
     * Border-radius placé dynamiquement en bas de la dernière selection non choisie
     */
    notSelectedsOptionsArray[notSelectedsOptionsArray.length - 1].classList.add(
      "custom-option_last"
    );

    document.querySelector(".selected").focus();
  } else {
    /**
     * Fermeture du selecteur
     */
    document.querySelector(".select").classList.remove("open");
    document
      .querySelector(".custom-options")
      .setAttribute("aria-expanded", false);

    /**
     * On retire le bottom border-radius des selections avant de positionner une nouvelle selection en dernière position
     */
    [...document.getElementsByClassName("custom-option")].forEach((option) =>
      option.classList.remove("custom-option_last")
    );
  }
};

/**
 * Affichage de l'option selectionnée
 */
const selectDisplaySorting = (option) => {
  for (const hidden of document.querySelectorAll(
    ".custom-option.hidden, .select__trigger"
  )) {
    hidden.classList.remove("hidden");
    document
      .querySelector(".select__trigger")
      .classList.add("no-btm-border-radius");
  }
  if (!option.classList.contains("selected")) {
    option.parentNode
      .querySelector(".custom-option.selected")
      .removeAttribute("aria-selected");
    option.parentNode
      .querySelector(".custom-option.selected")
      .classList.remove("selected");

    option.classList.add("selected");
    option.setAttribute("aria-selected", true);
    option.classList.add("hidden");
    setTimeout(() => {
      document
        .querySelector(".select__trigger")
        .classList.remove("no-btm-border-radius");
    }, 200);

    option
      .closest(".select")
      .querySelector(".select__trigger span").textContent = option.textContent;
    document
      .querySelector(".select__trigger")
      .setAttribute("aria-activedescendant", `${option.textContent}`);
  }
};

/**
 * GESTION DU FOCUS
 * Changement de focus au clavier et maintien du focus dans le selecteur
 */
const focusInSelector = (e) => {
  e.preventDefault();

  /**
   * On récupère les éléments qui acquerront le focus dans le selecteur
   */
  const focusableElements = ".select__trigger, .custom-option:not(.selected)";

  /**
   * On crée un tableau des éléments focusables
   */
  let focusables = [...DOM.selector.querySelectorAll(focusableElements)];

  let index = focusables.findIndex(
    (elem) => elem === DOM.selector.querySelector(":focus")
  );

  e.shiftKey === true ? index-- : index++;

  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }

  let option = focusables[index];
  option.focus();

  focusables.forEach((elem) => elem.classList.remove("no-white-line"));
  document.activeElement.classList.add("no-white-line");

  return focusables;
};

// --------------------------------------------------------------------------- //
// -------------------------------EVENT LISTENERS----------------------------- //
// --------------------------------------------------------------------------- //

/**
 * On ouvre le selecteur
 */
addReactionTo("click").on(".select-wrapper").withFunction(selectorChange);

/**
 * On ouvre le selecteur avec le clavier
 */
addReactionTo("keydown")
  .on(".select-wrapper")
  .withFunction((e) => {
    if (e.key === "Enter") {
      selectorChange();
      document.querySelector(".select__trigger").focus();
    }
  });

/**
 * Navigation au clavier dans le selecteur
 */
addReactionTo("keydown")
  .on(DOM.selector)
  .withFunction((e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      const focusables = focusInSelector(e);
      document.querySelector(".select.open")?.classList.remove("open");
      focusables.forEach((elem) => elem.classList.remove("no-white-line"));
      document.querySelector(".select__trigger").focus();
    }
    if (e.key === "Tab" && document.querySelector(".select.open")) {
      focusInSelector(e);
    }
  });

/**
 * Selection
 */
for (const option of document.getElementsByClassName("custom-option")) {
  addReactionTo("click")
    .on(option)
    .withFunction(() => {
      selectDisplaySorting(option);
    });
  addReactionTo("keydown")
    .on(option)
    .withFunction((e) => {
      if (
        e.key === "Enter" &&
        document.querySelector(".select.open") &&
        !document.activeElement.classList.contains("select__trigger")
      ) {
        const focusables = focusInSelector(e);
        focusables.forEach((elem) => elem.classList.remove("no-white-line"));
        selectDisplaySorting(option);
      }
    });
}

/**
 * Récupération des données selon la catégorie sélectionnée
 */
for (const selected of document.querySelectorAll(".custom-option")) {
  addReactionTo("click")
    .on(selected)
    .withFunction(() => {
      const sortingChoice = selected.textContent;
      sort(sortingChoice);
    });

  addReactionTo("keydown")
    .on(selected)
    .withFunction((e) => {
      if (e.key === "Enter") {
        const sortingChoice = selected.textContent;
        sort(sortingChoice);
      }
    });
}

/**
 * On ferme le selecteur lorsque l'utilisateur clique quelque part dans la fenêtre
 */
addReactionTo("click")
  .on(window)
  .withFunction((e) => {
    const select = document.querySelector(".select");
    if (!select.contains(e.target)) {
      select.classList.remove("open");
    }
  });
