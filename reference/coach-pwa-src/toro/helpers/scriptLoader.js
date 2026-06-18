import isFunction from 'lodash/isFunction'

export default function insertScript(src, options = {}) {
  const { onLoad, onError, ...rest } = options

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.type = 'text/javascript'
    script.onload = () => {
      isFunction(onLoad) && onLoad()
      resolve()
    }
    script.onerror = () => {
      isFunction(onError) && onError()
      if (process.env.NODE_ENV === 'development') {
        resolve()
        return
      }
      reject(new Error(`Script load failed: ${src}`))
    }
    for (const [option, value] of Object.entries(rest)) {
      script[option] = value
    }
    document.body?.appendChild(script)
  })
}
