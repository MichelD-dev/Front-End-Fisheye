// QuerySelector ONLY

// Syntaxe :  addReactionTo('evt').on(window || 'class/id/attribut...').withFunction(fonction)

const event = actionChoice => evt => {
  return {
    on: function (elem) {
      return {
        withFunction: function (action, ...params) {
          if (typeof elem === 'string') {
            if (actionChoice === 'add') {
              return document
                .querySelector(elem)
                .addEventListener(evt, action, ...params)
            }
            if (actionChoice === 'remove') {
              return document
                .querySelector(elem)
                .removeEventListener(evt, action)
            }
          }
          {
            if (actionChoice === 'add') {
              return elem.addEventListener(evt, action, ...params)
            }
            if (actionChoice === 'remove') {
              return elem.removeEventListener(evt, action)
            }
          }
        },
      }
    },
  }
}
export const addReactionTo = event('add')
export const removeReactionTo = event('remove')
