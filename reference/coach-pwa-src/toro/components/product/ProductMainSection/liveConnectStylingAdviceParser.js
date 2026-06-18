import cheerio from 'toro/lib/cheerio'

export default function liveConnectStylingAdviceParser(html) {
  if (!html) {
    return {}
  }
  const $ = cheerio.load(html, null, false)
  const container = $('.pdp-styling-advice') // d-flex d-md-flex d-lg-flex

  return {
    content: $.html(),
    devices: {
      mobile: container?.hasClass('d-flex'),
      tablet: container?.hasClass('d-md-flex'),
      desktop: container?.hasClass('d-lg-flex'),
    },
  }
}
