import noop from 'lodash/noop'

const sessionStorage =
  typeof window !== 'undefined'
    ? window.sessionStorage
    : { setItem: noop, getItem: noop, clear: noop, removeItem: noop }

export default sessionStorage
