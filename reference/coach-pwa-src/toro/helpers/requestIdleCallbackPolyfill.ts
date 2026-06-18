const fallbackDelay = 500

const requestIdleCallbackPolyfill = () => {
  if (typeof window !== 'object') {
    return
  }
  window.requestIdleCallback =
    window.requestIdleCallback ||
    function (cb) {
      const start = Date.now()
      return window.setTimeout(function () {
        cb({
          didTimeout: false,
          timeRemaining: function () {
            return Math.max(0, 50 - (Date.now() - start))
          },
        })
      }, fallbackDelay)
    }

  window.cancelIdleCallback =
    window.cancelIdleCallback ||
    function (id) {
      clearTimeout(id)
    }
}

export default requestIdleCallbackPolyfill
