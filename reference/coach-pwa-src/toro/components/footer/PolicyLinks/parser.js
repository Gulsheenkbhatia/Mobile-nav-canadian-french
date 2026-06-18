import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function policyLinksParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)

  if (!sanitizedHtml) {
    return {
      links: [],
    }
  }

  const $ = cheerio.load(sanitizedHtml)
  const wrapper = $('.policy-link-content')
  const scriptWrapper = $(wrapper)?.find('script.buyerProtection')
  const scriptContent = $(scriptWrapper)?.html()
  $('script').remove()
  const footerLinkWrapper = $('.footer-link-container')
  const dataQa = $(footerLinkWrapper).attr('data-qa')
  return {
    links: [
      ...$('.footer-link-container > li > a').map((i, el) => {
        const $el = $(el)
        return {
          href: $el.attr('href')?.trim(),
          text: $el.text(),
          target: $el.attr('target'),
          dataQa: $el.attr('data-qa'),
          className: $el.attr('class'),
        }
      }),
    ],
    html: $(wrapper)?.html(),
    script: scriptContent,
    dataQa: dataQa,
  }
}
