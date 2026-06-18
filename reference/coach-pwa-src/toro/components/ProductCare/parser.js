import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function productCareParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  let productCareContent = []
  let productCareSummary = ''

  if (!sanitizedHtml) {
    return {
      items: null,
      accordion: false,
      html: '',
      hasAccordion: false,
      productCareContent,
      productCareSummary,
    }
  }

  const $ = cheerio.load(sanitizedHtml)
  const wrapper1 = $('.product-care.accordion')
  const wrapper2 = $('p.product-care-para-copy')
  const styles = $('body').find('style')?.[0]?.children?.[0]?.data

  const hasAccordion = $('#accordion').length !== 0
  if (hasAccordion) {
    productCareSummary = $('p')?.html() ?? ''

    $('.panel-title').each((i, el) => {
      productCareContent.push({
        title: $(el).html(),
      })
    })

    $('.panel-body').each((i, el) => {
      productCareContent[i] = {
        ...productCareContent[i],
        body: $(el).html(),
      }
    })
  }

  if (wrapper2.length) {
    return {
      items: null,
      accordion: false,
      html: sanitizedHtml,
      styles,
    }
  }
  if (wrapper1.length) {
    return {
      items: [
        ...wrapper1.find('.card').map((i, el) => {
          return {
            title: $(el).find('.card-header .card-title').html(),
            content: $(el).find('.collapse .amp-container').html(),
          }
        }),
      ],
      accordion: true,
      html: sanitizedHtml,
      styles,
    }
  }

  return {
    items: null,
    accordion: false,
    html: sanitizedHtml,
    styles,
    hasAccordion,
    productCareContent,
    productCareSummary,
  }
}
