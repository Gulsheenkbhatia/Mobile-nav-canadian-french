import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function socialIconsParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)

  if (!sanitizedHtml) {
    return {
      links: [],
    }
  }

  const $ = cheerio.load(sanitizedHtml)

  return {
    links: [
      ...$('a').map((i, el) => {
        const $el = $(el)
        const divider = $el.parent()?.css('border-left')

        return {
          href: $el.attr('href'),
          text: $el.attr('text'),
          target: $el.attr('target'),
          src: $el.find('img').attr('src'),
          iconName: ($el.find('use').attr('href') || '').replace('#icon-social-', ''),
          linkTitle: $el.attr('title'),
          linkText: $el.attr('data-text'),
          rel: $el.attr('rel'),
          dataQa: $el.attr('data-qa'),
          divider,
        }
      }),
    ],
  }
}
