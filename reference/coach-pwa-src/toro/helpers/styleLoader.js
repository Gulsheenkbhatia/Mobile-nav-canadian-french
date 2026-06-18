export default function insertStyle(href) {
  return new Promise((resolve) => {
    const link = document.createElement('link')
    link.href = href
    link.rel = 'stylesheet'
    document.body?.appendChild(link)
    resolve()
  })
}
