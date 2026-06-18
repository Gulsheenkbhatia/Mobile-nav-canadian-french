function populatePictureWithImg(picture) {
  if (picture?.getElementsByTagName('img')?.length === 0) {
    const altEl = picture.getAttribute('data-alt')
    const classEl = picture.getAttribute('data-class')

    const imgElement = document.createElement('img')
    imgElement.setAttribute('class', classEl)
    imgElement.setAttribute('alt', altEl)
    picture.appendChild(imgElement)
  }

  if (picture?.getElementsByTagName('img')?.length > 1) {
    const imgsInPicture = picture.getElementsByTagName('img')
    picture.removeChild(imgsInPicture[1])
  }
}

function loadImg(img) {
  const src = img.getAttribute('data-src')
  if (src) {
    img.setAttribute('src', src)
    img.removeAttribute('data-src')
  }
}

function loadPicture(picture, lazyAttribute) {
  if (!picture?.hasAttribute(lazyAttribute)) {
    return
  }
  populatePictureWithImg(picture)
  for (let source of picture.getElementsByTagName('source')) {
    const siblingPictureSrcSet = source.getAttribute('data-srcset')
    if (siblingPictureSrcSet) {
      source.setAttribute('srcset', siblingPictureSrcSet)
      source.removeAttribute('data-srcset')
    }
  }
  picture.removeAttribute(lazyAttribute)
}

function loadBackground(div, viewport) {
  const desktopBgImage = div.getAttribute('data-desktop-bg-image')
  const mobileBgImage = div.getAttribute('data-mobile-bg-image')
  const src = viewport === 'mobile' ? mobileBgImage : desktopBgImage
  if (!src) return
  const prevStyle = div.getAttribute('style') || ''
  div.setAttribute('style', `${prevStyle}; background-image: url(${src})`)
  div.removeAttribute('data-desktop-bg-image')
  div.removeAttribute('data-mobile-bg-image')
}

function runOnNextPageScroll(cb) {
  window.addEventListener('scroll', function run() {
    cb()
    window.removeEventListener('scroll', run)
  })
}

const getObserverHandler = (handler) => (entries, self) => {
  for (let entry of entries) {
    if (entry.isIntersecting) {
      handler(entry.target)
      // the image is now in place, stop watching
      if (self) {
        self.unobserve(entry.target)
      }
    }
  }
}

const createIntersectionObserver = (callback, options) => {
  return new window.IntersectionObserver(getObserverHandler(callback), options)
}
/**
 * Observes the visibility of all `img` elements inside the specified element
 * that match the specified selector. When an image becomes visible, the `data-src`
 * attribute is copied to `src`.
 *
 * See https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
 * @param {DOMElement} element The img element to lazy load
 * @param {Object} options
 * @param {String} options.lazyAttribute The attribute containing the image URL. Defaults to `data-src`.
 * @param {Boolean} options.showImmediately Whether to show the images immediately. Defaults to `false`.
 */
export default function lazyLoadImages(
  element,
  { lazyAttribute = 'data-loading', showImmediately = false } = {},
  viewport = 'desktop'
) {
  if (!element) return
  const lazyImages = [
    ...element.querySelectorAll(
      `img[${lazyAttribute}], picture[${lazyAttribute}], [data-desktop-bg-image]`
    ),
  ]

  if (!lazyImages?.length) return

  const load = (element) => {
    if (element.tagName === 'IMG') {
      loadImg(element)
    } else if (element.tagName === 'PICTURE') {
      loadPicture(element, lazyAttribute)
    } else {
      loadBackground(element, viewport)
    }
  }

  if (showImmediately) {
    for (let img of lazyImages) {
      load(img)
    }
    return
  }

  try {
    const lazyImageObserverInst = createIntersectionObserver(load)
    const lazyImageObserver = createIntersectionObserver(load, {
      rootMargin: '700px',
    })
    // show lazy if they are in view from start
    for (let img of lazyImages) {
      lazyImageObserverInst.observe(img)
    }

    runOnNextPageScroll(() => {
      for (let img of lazyImages) {
        lazyImageObserverInst.unobserve(img)
        lazyImageObserver.observe(img)
      }
    })

    return lazyImageObserver
  } catch (e) {
    // eagerly load images when we don't have the observer
    for (let img of lazyImages) {
      load(img)
    }
  }
}
