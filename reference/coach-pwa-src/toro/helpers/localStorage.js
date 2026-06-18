import noop from 'lodash/noop'

const localStorage = {
  ...(typeof window !== 'undefined' && window.localStorage
    ? {
        setItem: (keyName, value) => {
          try {
            window.localStorage.setItem(keyName, value)
          } catch (error) {
            console.log(`Failed to set ${keyName} in local storage: ${error}`)
          }
        },
        getItem: (keyName) => {
          try {
            return window.localStorage.getItem(keyName)
          } catch (error) {
            console.log(`Failed to get ${keyName} in local storage: ${error}`)
          }
        },
        clear: () => {
          try {
            window.localStorage.clear()
          } catch (error) {
            console.log(`Failed to clear local storage: ${error}`)
          }
        },
        removeItem: (keyName) => {
          try {
            window.localStorage.removeItem(keyName)
          } catch (error) {
            console.log(`Failed to remove ${keyName} in local storage: ${error}`)
          }
        },
      }
    : {
        setItem: noop,
        getItem: noop,
        clear: noop,
        removeItem: noop,
      }),
}

export default localStorage
