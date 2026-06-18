import isEmpty from 'lodash/isEmpty'
import { setVideoSource } from 'toro/helpers/setVideoSource'
/**
 * Observes the visibility of all `video` elements inside the specified element
 * that match the specified selector. When a video becomes visible, the `data-src`
 * attribute is copied to `src` and `data-src` is removed.
 *
 * See https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
 * @param {DOMElement} element The img element to lazy load
 * @param {Object} options
 * @param {Object} options.lazyAttribute The attribute specifying the lazy loading. Defaults to `data-loading`.
 * @param {String} options.viewport The viewport to use. Defaults to `mobile`.
 * @param {Boolean} options.showImmediately When true, load all matching videos immediately. Defaults to `false`.
 */
export default function lazyLoadVideos(
  element,
  { lazyAttribute = 'data-loading', viewport = 'mobile', showImmediately = false } = {}
) {
  if (!element) return

  if (element.children?.length === 1) {
    const tarNode = element.parentNode?.parentNode
    if (tarNode) {
      tarNode.classList.add('tarNode')
      if (tarNode.querySelectorAll('.promo-tile-up-1').length >= 1) {
        tarNode.classList.add('tarNode__promo-tile-up-1')
      }
      if (tarNode.querySelectorAll('.promo-tile-up-4').length >= 1) {
        tarNode.classList.add('tarNode__promo-tile-up-4')
      }
    }
  }

  const lazyVideos = [...element.querySelectorAll(`video[${lazyAttribute}]`)]

  if (!lazyVideos?.length) {
    setVideoSource(element, viewport || 'mobile')
    return
  }

  let lazyVideosObserver

  const load = (video) => {
    const vp = viewport || 'mobile'
    const expectedSrc = video.getAttribute(`data-${vp}-video-src`)
    const currentSrc = video.getAttribute('src')

    if (currentSrc && currentSrc === expectedSrc) {
      return
    }

    video.setAttribute('loop', '')
    const sources = video.querySelectorAll('source')

    const firstSource = sources[0]
    const sourceDataSrc = !isEmpty(firstSource.getAttribute('data-src'))
      ? firstSource.getAttribute('data-src')
      : null

    const onLoadHandler = () => {
      for (const source of sources) {
        source.removeAttribute('data-src')
      }
      video.removeEventListener('loadstart', onLoadHandler)
    }

    video.addEventListener('loadstart', onLoadHandler)

    const poster =
      video.getAttribute(`data-${vp}-poster-src`) || video.getAttribute(`data-poster-src`)

    if (poster) {
      video.setAttribute('poster', poster)
    }

    if (expectedSrc) {
      video?.setAttribute('src', expectedSrc)
      for (const source of sources) {
        source.setAttribute('src', expectedSrc)
      }
    } else if (firstSource && sourceDataSrc) {
      video.setAttribute('src', sourceDataSrc)
      firstSource.setAttribute('src', sourceDataSrc)
    }
    video.load()
  }

  if (showImmediately) {
    for (let video of lazyVideos) {
      load(video)
    }
    return
  }

  const observerHandler = function (entries, self) {
    for (let entry of entries) {
      if (entry.isIntersecting) {
        load(entry.target)
        // the video is now in place, stop watching
        if (self) {
          self.unobserve(entry.target)
        }
      }
    }
  }

  try {
    lazyVideosObserver = new window.IntersectionObserver(observerHandler, {
      rootMargin: '700px',
    })

    for (let video of lazyVideos) {
      lazyVideosObserver.observe(video)
    }

    return lazyVideosObserver
  } catch (e) {
    // eagerly load images when we don't have the observer
    for (let video of lazyVideos) {
      load(video)
    }
  }
}
