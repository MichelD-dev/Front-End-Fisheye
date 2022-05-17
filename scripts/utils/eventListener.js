// QuerySelector ONLY

// Syntaxe :  addReactionTo('evt').on(window || 'class/id/attribut...').withFunction(fonction)

const event = actionChoice => evt => {
  return {
    on: function (elem) {
      return {
        withFunction: function (action, ...params) {
          if (typeof elem === 'string')
            return actionChoice === 'add'
              ? document
                  .querySelector(elem)
                  .addEventListener(evt, action, params)
              : document.querySelector(elem).removeEventListener(evt, action)
          return actionChoice === 'add'
            ? elem.addEventListener(evt, action, params)
            : elem.removeEventListener(evt, action)
        },
      }
    },
  }
}

export const addReactionTo = event('add')
export const removeReactionTo = event('remove')
