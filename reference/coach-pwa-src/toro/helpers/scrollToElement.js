export default function scrollToElement(element, offsetHeight = 0) {
  if (element) {
    const method = window.scrollTo
    method({
      top: element.offsetTop + 35 - offsetHeight,
      left: 0,
    })
  }
}
