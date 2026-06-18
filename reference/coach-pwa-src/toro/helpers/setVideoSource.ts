export function setVideoSource(element: HTMLElement, viewport: 'mobile' | 'desktop') {
  const $videos = element.querySelectorAll('video')

  const viewportSourceType = `data-${viewport}-video-src`
  $videos.forEach(($video) => {
    const $sourceElement = $video.querySelector('source')

    if ($video.src) {
      return
    }
    let poster = $video.getAttribute(`data-${viewport}-poster-src`)

    if (!poster) {
      poster = $video.getAttribute(`data-poster-src`)
    }

    if (poster) {
      $video.setAttribute('poster', poster)
    }

    if ($sourceElement) {
      const srcValue = $sourceElement.getAttribute('src')
      if (srcValue) {
        return
      }
    }

    const sourceType = $video.getAttribute(viewportSourceType)

    if (!sourceType) {
      return
    }

    $video.src = sourceType
    if ($sourceElement) {
      $sourceElement.src = sourceType
    }

    $video.autoplay && $video.play()
  })
}
