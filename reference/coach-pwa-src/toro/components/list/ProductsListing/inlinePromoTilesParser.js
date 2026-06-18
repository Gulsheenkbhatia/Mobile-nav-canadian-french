import cheerio from 'toro/lib/cheerio'

export default function inlinePromoTilesParser(html) {
  if (!html) {
    return {}
  }

  const $ = cheerio.load(html, null, false)
  const regex = new RegExp('<picture' | '<video')
  let splideData
  if (regex.test(html)) {
    const $productTileContainerPictures = $(
      '.product-tile__container picture:not([data-class*="inline-img"])'
    )
    splideData = $('.splide__list')?.data('config')
    $productTileContainerPictures.each((i, el) => {
      const $el = $(el)
      if (!$el.has('img').length) {
        $el.append(`<img class="ae-img" />`)
      }
    })
  }

  const hasVideo = !!$('.content-video').length

  return {
    markup: $.html(),
    isSplideContent: splideData ? true : false,
    hasVideo,
  }
}
