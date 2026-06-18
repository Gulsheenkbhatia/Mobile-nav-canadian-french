import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function mobileMenuNavLinksParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)

  if (!sanitizedHtml) {
    return {
      links: [],
    }
  }

  const $ = cheerio.load(sanitizedHtml)
  const selectedFlagQa = $('a.dropdown-item-locale svg').attr('data-qa')
  const selectedLabelQa = $('a.dropdown-item-locale label').attr('data-qa')
  return {
    links: [
      ...$('a').map((i, el) => {
        const $el = $(el)
        const $useElHref = $el.find('use')?.attr('href')
        return {
          href: $el.attr('href'),
          text: $el.find('label').text(),
          id: $el.attr('data-qa'),
          order: $el.css()?.order,
          iconId: $useElHref?.substring(1),
        }
      }),
    ],
    dataQA: {
      flag: selectedFlagQa,
      label: selectedLabelQa,
    },
  }
}
