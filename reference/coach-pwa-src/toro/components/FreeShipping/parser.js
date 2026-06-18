import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export const freeShippingParser = (html) => {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  return {
    text: $('.card-header__title span')?.text()?.trim(),
    body: $('#shipText').html(),
    shippinginfo: $('.advantages').html(),
  }
}

export const freeShippingReturnParser = (html) => {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  return {
    text: $('.card-header__title span')?.text()?.trim(),
    body: $('#shipText').html(),
    shippinginfo: $('.advantages').html(),
  }
}

export const OutletShippingReturnParser = (html) => {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  return {
    text: $('.card-header__title span')?.text()?.trim(),
    body: $('#shipText').html(),
    shippinginfo: $('.advantages').html(),
  }
}

export const FinalSaleShippingReturnParser = (html) => {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  return {
    text: $('.card-header__title span')?.text()?.trim(),
    body: $('#shipText').html(),
    shippinginfo: $('.advantages').html(),
  }
}

export const SetShippingReturnParser = (html) => {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  return {
    text: $('.card-header__title span')?.text()?.trim(),
    body: $('#shipText').html(),
    shippinginfo: $('.advantages').html(),
  }
}

export const bundleORCAfreeShippingReturnParser = (html) => {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  return {
    text: $('.card-header__title span').text().trim(),
    body: $('#shipText').html(),
    shippinginfo: $('.advantages').html(),
  }
}
