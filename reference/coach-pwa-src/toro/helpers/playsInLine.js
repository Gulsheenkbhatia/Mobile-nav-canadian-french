export default function playsInLine(element) {
  if (!element) return

  if (element.children.length === 1) {
    const tarNode = element.parentNode?.parentNode
    if (tarNode) {
      tarNode.classList.add('tarNode')
    }
  }

  const videos = [...element.querySelectorAll(`video`)]

  if (!videos.length) return

  try {
    for (let video of videos) {
      video.setAttribute('playsinline', '')
    }
  } catch (e) {
    return null
  }
}
