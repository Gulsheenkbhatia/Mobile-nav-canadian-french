import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function contentLinksParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)

  if (!sanitizedHtml) {
    return {
      links: [],
    }
  }

  const $ = cheerio.load(sanitizedHtml)

  return {
    links: [
      ...$('.footer-links').map((i, el) => {
        const $el = $(el)
        const $title = $el.find('.footer-links__title')

        return {
          title: $title?.length && {
            text: $title.text(),
            className: $title.attr('class'),
            'data-menu-footer': $title.attr('data-menu-footer'),
            dataQa: $title.attr('data-qa'),
          },
          items: [
            ...$el.find('.footer-links__container li a').map((i, link) => {
              const $link = $(link)
              return {
                href: $link.attr('href'),
                text: $link.text(),
                target: $link.attr('target'),
                'data-menu-item': $link.attr('data-menu-item'),
                rel: $link.attr('rel'),
                dataQa: $link.attr('data-qa'),
              }
            }),
          ],
        }
      }),
    ],
  }
}
