import cheerio from 'toro/lib/cheerio'

export default function seoMarkupParser(html) {
  const $ = cheerio.load(html)
  const accordion = $('#collapseText').first().html()
  const toggle = $('.toggleContentBlock').first().html()
  const items = [$('head').html()]
  const containerClassName =
    $('.mol-plp-block').first().attr('class') || $('div').first().attr('class')
  const $container = $('#collapseText').first().parent()
  $container.find('#collapseText, .toggleContentBlock').remove()
  const content = $container.html() || $.html()

  return {
    content: content === '&nbsp;' ? null : content,
    accordion,
    toggle,
    items,
    containerClassName,
  }
}
