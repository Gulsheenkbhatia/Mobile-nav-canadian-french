let bodyEl

const getBodyEl = () => {
  if (bodyEl) return bodyEl
  bodyEl = document?.querySelector('body')
  return bodyEl
}

const toggleBodyScroll = (flag) => {
  getBodyEl().classList.toggle('lock-body', !flag)
}

export default toggleBodyScroll
