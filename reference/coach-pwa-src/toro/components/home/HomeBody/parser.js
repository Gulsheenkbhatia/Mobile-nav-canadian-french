import cheerio from 'toro/lib/cheerio'
import get from 'lodash/get'

const transformStyles = (css) => {
  // HP inline styles contains selectors like '#maincontent > ...' which
  // doesn't match with MW markup. Selectors transforms to '#maincontent ...'
  return css.replace(/#maincontent\s?>/g, '#maincontent ')
}

// Set images fetchpriority to low if it's not the preload image(LCP)
const setImagesLowPriority = ($, preloadImageSrc) => {
  $('img').each((i, img) => {
    const imgScr = $(img).attr('src')

    // to handle cases when:
    // - imgScr is undefined or empty
    // - preloadImageSrc is undefined or empty
    if (imgScr && preloadImageSrc && imgScr.includes(preloadImageSrc)) {
      return
    }

    $(img).attr('fetchpriority', 'low')
  })
}

export default function homeBodyParser(html, { preloadImageSrc }) {
  if (!html) {
    return {
      slots: [],
      styles: [],
      videoSrcData: [],
      rawHtml: '',
    }
  }
  const $ = cheerio.load(html)

  setImagesLowPriority($, preloadImageSrc)

  // parse video src from inline scripts
  const videoSrcData = $('script').map((i, el) => {
    const $el = $(el)
    const elHtml = $el.html()

    if (elHtml) {
      const srcRegexp = /'src', (.*?)'\)/g
      const srcType = /; \/\/\w+/g
      const videoIdRegexp = /getElementById\('(.*?)'/g

      const videoSrcs = elHtml.match(srcRegexp)
      const videoId = elHtml.match(videoIdRegexp)
      const videoTypes = elHtml.match(srcType)
      let formattedSrcs = {}
      if (videoSrcs) {
        videoSrcs.forEach((item, idx) => {
          const formattedItem = item.replace(`'src', '`, '').replace(`')`, '')
          const formattedVideoType = videoTypes[idx].replace('; //', '')
          if (formattedVideoType === 'mobile') {
            formattedSrcs = { mobile: formattedItem }
          }
          if (formattedVideoType === 'desktop') {
            formattedSrcs = { ...formattedSrcs, desktop: formattedItem }
          }
        })
      }

      const formattedVideoId = get(videoId, '0', '')
        .replace(`getElementById('`, '')
        .replace(`'`, '')

      return {
        videoId: formattedVideoId,
        videoSrc: formattedSrcs,
      }
    }
    return undefined
  })

  let slots = []
  let slotsBottom = []
  let ugcSnippetFound = false

  $('body > div').each((i, el) => {
    const $el = $(el)

    if ($el.find('> div[data-content-type="ugcHome"]').length) {
      ugcSnippetFound = true
      return
    }

    const id = $el.attr('id')

    const slotData = {
      id,
      html: $.html($el),
      isRecommendationsSlot: !!$el.find('[id=certona-recommendations]').length,
      wyngSlot: id == 'home_body_slot_wyng' || !!$el.find('[id=wyng-content]').length,
      hasVideo: !!$el.find('.content-video').length,
    }
    if (!ugcSnippetFound) {
      slots.push(slotData)
    } else {
      slotsBottom.push(slotData)
    }
  })

  const hasVideoContent =
    slots.some((slot) => slot.hasVideo) || slotsBottom.some((slot) => slot.hasVideo)

  return {
    slots,
    slotsBottom,
    ugcSnippetFound,
    hasVideoContent,
    styles: [
      ...($('body > style')?.map((i, el) => {
        const $el = $(el)
        return transformStyles($el?.html())
      }) || []),
    ],
    videoSrcData: [...videoSrcData],
    // FIXME: this is used for .js-countdown-banner, extract the elements from here to reduce object
    // FIXME: size in client side
    rawHtml: html,
  }
}
